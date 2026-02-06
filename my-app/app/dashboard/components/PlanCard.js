"use client";

export default function PlanCard() {
  return (
    <section className="rounded-3xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-orange-500 p-6 text-white shadow-lg">
      <div className="flex items-center justify-between text-xs uppercase tracking-wide text-white/80">
        <span>Current plan</span>
        <button
          className="rounded-full border border-white/40 px-3 py-1 text-xs"
          type="button"
        >
          Manage Plan
        </button>
      </div>
      <div className="mt-4 text-2xl font-semibold">Researcher</div>
      <div className="mt-4 flex items-center justify-between text-xs text-white/80">
        <span>API Limit</span>
        <span>24 / 1,000 Requests</span>
      </div>
      <div className="mt-2 h-2 w-full rounded-full bg-white/30">
        <div className="h-2 w-[15%] rounded-full bg-white" />
      </div>
    </section>
  );
}
