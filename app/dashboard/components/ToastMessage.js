"use client";

const variants = {
  error: "border-red-200 text-red-600 right-6",
  success: "border-emerald-200 text-emerald-600 left-6",
};

export default function ToastMessage({ message, variant }) {
  if (!message) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-6 rounded-xl border bg-white px-4 py-3 text-sm shadow-lg ${variants[variant]}`}
    >
      {message}
    </div>
  );
}
