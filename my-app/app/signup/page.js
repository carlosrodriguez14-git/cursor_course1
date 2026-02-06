"use client";

import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const { status } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [router, status]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-100 px-6">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold">Create account</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Use Google to create your account.
        </p>

        <div className="mt-6 flex flex-col gap-4">
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
          Already have an account?{" "}
          <a className="text-blue-600 hover:underline" href="/login">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
