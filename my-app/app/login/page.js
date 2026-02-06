"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

const ERROR_MESSAGES = {
  OAuthAccountNotLinked:
    "That Google account is already linked to another login method.",
  AccessDenied: "Access denied. Please use an approved account.",
  OAuthSignin: "Unable to start Google sign-in. Please try again.",
  OAuthCallback: "Google sign-in failed. Please try again.",
};

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const errorMessage = useMemo(() => {
    const errorKey = searchParams.get("error");
    if (!errorKey) {
      return "";
    }

    return ERROR_MESSAGES[errorKey] || "Unable to sign in. Please try again.";
  }, [searchParams]);

  const callbackUrl = useMemo(() => {
    return searchParams.get("redirectedFrom") || "/dashboard";
  }, [searchParams]);

  const handleGoogleSignIn = useCallback(async () => {
    setIsLoading(true);
    await signIn("google", { callbackUrl });
  }, [callbackUrl]);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [router, status]);

  useEffect(() => {
    if (status === "unauthenticated") {
      handleGoogleSignIn();
    }
  }, [status, handleGoogleSignIn]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-100 px-6">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold">Log in</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Continue with Google to manage your API keys.
        </p>

        <div className="mt-6 flex flex-col gap-4">
          {errorMessage ? (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {errorMessage}
            </p>
          ) : null}

          <button
            className="flex h-11 items-center justify-center gap-2 rounded-md bg-blue-600 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            {isLoading ? "Connecting..." : "Continue with Google"}
          </button>
        </div>

        <p className="mt-4 text-sm text-zinc-500">
          New here?{" "}
          <a className="text-blue-600 hover:underline" href="/signup">
            Create an account
          </a>
        </p>
      </div>
    </div>
  );
}
