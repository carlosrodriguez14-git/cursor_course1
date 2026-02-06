"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "../../lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    setIsLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    if (data?.session) {
      router.push("/dashboard");
      return;
    }

    setMessage("Check your email to confirm your account.");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-100 px-6">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold">Create account</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Sign up to start managing API keys.
        </p>

        <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
          <label className="text-sm font-medium">
            Email
            <input
              className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm outline-none transition-colors focus:border-blue-500"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label className="text-sm font-medium">
            Password
            <input
              className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm outline-none transition-colors focus:border-blue-500"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {message ? <p className="text-sm text-emerald-600">{message}</p> : null}

          <button
            className="h-11 rounded-md bg-blue-600 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Sign up"}
          </button>
        </form>

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
