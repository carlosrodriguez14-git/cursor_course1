"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PlaygroundPage() {
  const router = useRouter();
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedKey = apiKey.trim();
    if (!trimmedKey) {
      setError("API key is required.");
      return;
    }

    setError("");
    router.push(`/protected?key=${encodeURIComponent(trimmedKey)}`);
  };

  return (
    <div className="min-h-screen bg-zinc-100 px-6 py-12 text-zinc-900">
      <div className="mx-auto w-full max-w-3xl rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <button
          className="text-xs font-semibold text-zinc-500 transition-colors hover:text-zinc-700"
          type="button"
          onClick={() => router.back()}
        >
          ← Back
        </button>
        <h1 className="text-2xl font-semibold">API Playground</h1>
        <p className="mt-2 text-sm text-zinc-500">
          Submit an API key to validate access to the protected page.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-xs font-semibold text-zinc-500">
              API Key
            </label>
            <input
              className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm outline-none transition-colors focus:border-blue-500"
              placeholder="tvly-..."
              type="text"
              value={apiKey}
              onChange={(event) => setApiKey(event.target.value)}
            />
            {error ? (
              <p className="mt-2 text-xs font-semibold text-red-600">{error}</p>
            ) : null}
          </div>
          <button
            className="h-11 rounded-md bg-blue-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            type="submit"
          >
            Submit API Key
          </button>
        </form>
      </div>
    </div>
  );
}
