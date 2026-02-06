"use client";

export default function KeyModal({
  isOpen,
  title,
  description,
  label,
  placeholder,
  value,
  onChange,
  onCancel,
  onSubmit,
  submitLabel,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-zinc-500">{description}</p>

        <div className="mt-5">
          <label className="text-xs font-semibold text-zinc-500">{label}</label>
          <input
            className="mt-2 h-10 w-full rounded-md border border-zinc-200 px-3 text-sm outline-none transition-colors focus:border-blue-500"
            placeholder={placeholder}
            type="text"
            value={value}
            onChange={(event) => onChange(event.target.value)}
          />
        </div>

        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            className="h-9 rounded-md border border-zinc-200 px-4 text-sm font-semibold text-zinc-600"
            type="button"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="h-9 rounded-md bg-blue-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            type="button"
            onClick={onSubmit}
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
