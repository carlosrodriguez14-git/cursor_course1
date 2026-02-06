"use client";

const variants = {
  success: "border-emerald-200 text-emerald-600",
  error: "border-red-200 text-red-600",
  info: "border-zinc-200 text-zinc-600",
};

export default function Notification({ message, variant = "info" }) {
  if (!message) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 rounded-xl border bg-white px-4 py-3 text-sm shadow-lg ${variants[variant]}`}
    >
      {message}
    </div>
  );
}
