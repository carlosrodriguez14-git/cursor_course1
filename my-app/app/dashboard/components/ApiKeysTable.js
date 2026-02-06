"use client";

const ActionButton = ({ label, onClick, children }) => (
  <button
    className="group relative flex h-7 w-7 items-center justify-center rounded-full border border-zinc-200 text-[10px] uppercase transition-colors hover:bg-zinc-100"
    type="button"
    onClick={onClick}
    aria-label={label}
    title={label}
  >
    {children}
    <span className="pointer-events-none absolute -bottom-7 left-1/2 hidden -translate-x-1/2 rounded-md bg-zinc-900 px-2 py-1 text-[10px] text-white shadow-sm group-hover:block">
      {label}
    </span>
  </button>
);

export default function ApiKeysTable({
  isLoading,
  apiKeys,
  pagedKeys,
  visibleKeyId,
  maskKey,
  onToggleVisibility,
  onCopyKey,
  onEditKey,
  onDeleteKey,
  onOpenCreate,
  pageSize,
  onPageSizeChange,
  currentPage,
  totalPages,
  startIndex,
  endIndex,
  onPrevPage,
  onNextPage,
}) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">API Keys</h2>
          <p className="text-sm text-zinc-500">
            The key is used to authenticate your requests to the Research API.
            To learn more, see the documentation page.
          </p>
        </div>
        <button
          className="flex h-9 items-center gap-2 rounded-md bg-blue-600 px-4 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
          type="button"
          onClick={onOpenCreate}
        >
          + Create New Key
        </button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-zinc-200">
        <div className="min-w-[640px] grid grid-cols-[1.2fr_0.5fr_1.2fr_0.6fr] gap-4 bg-zinc-50 px-5 py-3 text-xs font-semibold text-zinc-500">
          <span>Name</span>
          <span>Usage</span>
          <span>Key</span>
          <span>Options</span>
        </div>
        {isLoading ? (
          <div className="px-5 py-6 text-sm text-zinc-500">Loading keys...</div>
        ) : null}

        {!isLoading && apiKeys.length === 0 ? (
          <div className="px-5 py-6 text-sm text-zinc-500">
            No API keys yet.
          </div>
        ) : null}

        {pagedKeys.map((item) => (
          <div
            className="min-w-[640px] grid grid-cols-[1.2fr_0.5fr_1.2fr_0.6fr] items-center gap-4 border-t border-zinc-200 px-5 py-3 text-sm"
            key={item.id || item.value}
          >
            <span className="text-zinc-700">{item.name}</span>
            <span className="text-zinc-500">{item.usage}</span>
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600">
              {visibleKeyId === item.id ? item.value : maskKey(item.value)}
            </span>
            <div className="flex items-center gap-2 text-zinc-400">
              <ActionButton
                label={visibleKeyId === item.id ? "Hide key" : "View key"}
                onClick={() => onToggleVisibility(item.id)}
              >
                v
              </ActionButton>
              <ActionButton label="Copy key" onClick={() => onCopyKey(item.value)}>
                c
              </ActionButton>
              <ActionButton label="Edit name" onClick={() => onEditKey(item)}>
                e
              </ActionButton>
              <ActionButton label="Delete key" onClick={() => onDeleteKey(item.id)}>
                d
              </ActionButton>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-500">
        <span>
          Showing {apiKeys.length === 0 ? 0 : startIndex + 1}-{endIndex} of{" "}
          {apiKeys.length}
        </span>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2">
            Rows
            <select
              className="h-8 rounded-full border border-zinc-200 bg-white px-2 text-xs font-semibold text-zinc-600"
              value={pageSize}
              onChange={(event) => onPageSizeChange(Number(event.target.value))}
            >
              {[5, 10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
          <button
            className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-semibold text-zinc-600 disabled:opacity-50"
            type="button"
            onClick={onPrevPage}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-semibold text-zinc-600 disabled:opacity-50"
            type="button"
            onClick={onNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
