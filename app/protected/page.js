"use client";

export const dynamic = "force-dynamic";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Notification from "../components/Notification";

const REDIRECT_DELAY_MS = 2000;

export default function ProtectedPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-100 px-6 py-12 text-zinc-900">
          <div className="mx-auto w-full max-w-3xl rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
            <h1 className="text-2xl font-semibold">Protected</h1>
            <p className="mt-2 text-sm text-zinc-500">Loading...</p>
          </div>
        </div>
      }
    >
      <ProtectedContent />
    </Suspense>
  );
}

function ProtectedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const apiKey = useMemo(
    () => (searchParams.get("key") || "").trim(),
    [searchParams]
  );
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let isActive = true;

    const validateKey = async () => {
      if (!apiKey) {
        if (isActive) {
          setStatus("invalid");
          setMessage("Invalid API Key");
        }
        return;
      }

      setStatus("loading");
      setMessage("");

      try {
        const response = await fetch("/api/validate-key", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ apiKey }),
        });
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload?.error || "Unable to validate API key.");
        }

        const isValid = Boolean(payload?.valid);

        if (!isActive) {
          return;
        }

        if (isValid) {
          setStatus("valid");
          setMessage("valid api key, /protected can be accessed");
        } else {
          setStatus("invalid");
          setMessage("Invalid API Key");
        }
      } catch (error) {
        if (isActive) {
          setStatus("error");
          setMessage(error?.message || "Unable to validate API key.");
        }
      }
    };

    validateKey();

    return () => {
      isActive = false;
    };
  }, [apiKey]);

  useEffect(() => {
    if (status !== "invalid") {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      router.replace("/playground");
    }, REDIRECT_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [router, status]);

  const isSuccess = status === "valid";
  const isError = status === "invalid" || status === "error";

  return (
    <div className="min-h-screen bg-zinc-100 px-6 py-12 text-zinc-900">
      <div className="mx-auto w-full max-w-3xl rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold">Protected</h1>
        <p className="mt-2 text-sm text-zinc-500">
          Validate the submitted API key to access this page.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-600">
            Status: {status === "loading" ? "Validating..." : status}
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              className="h-10 rounded-md border border-zinc-200 px-4 text-sm font-semibold text-zinc-600 transition-colors hover:bg-zinc-50"
              type="button"
              onClick={() => router.push("/playground")}
            >
              Back to playground
            </button>
            {isSuccess ? (
              <button
                className="h-10 rounded-md bg-blue-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                type="button"
                onClick={() => router.push("/dashboard")}
              >
                Go to dashboard
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <Notification
        message={message}
        variant={isSuccess ? "success" : isError ? "error" : "info"}
      />
    </div>
  );
}
