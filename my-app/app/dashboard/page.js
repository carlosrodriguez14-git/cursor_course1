"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

import ApiKeysTable from "./components/ApiKeysTable";
import ConfirmModal from "./components/ConfirmModal";
import KeyModal from "./components/KeyModal";
import PlanCard from "./components/PlanCard";
import Sidebar from "./components/Sidebar";
import ToastMessage from "./components/ToastMessage";
import useApiKeys from "./hooks/useApiKeys";
import maskKey from "./utils/maskKey";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const {
    apiKeys,
    isLoading,
    error,
    toast,
    visibleKeyId,
    setVisibleKeyId,
    pageSize,
    setPageSize,
    isCreateOpen,
    openCreateModal,
    closeCreateModal,
    keyName,
    setKeyName,
    isEditOpen,
    openEditModal,
    closeEditModal,
    editName,
    setEditName,
    isDeleteOpen,
    openDeleteModal,
    closeDeleteModal,
    saveKey,
    editKey,
    deleteKey,
    handleCopyKey,
    pagination,
    setPageIndex,
  } = useApiKeys();

  const { pagedKeys, currentPage, totalPages, startIndex, endIndex } =
    pagination;

  const profileImage = session?.user?.image;
  const userLabel = session?.user?.name || session?.user?.email || "User";
  const initials = userLabel
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");

  return (
    <div className="min-h-screen bg-zinc-100 px-6 py-10 text-zinc-900">
      <div className="mx-auto flex w-full max-w-6xl gap-6">
        <div className="fixed right-6 top-6 z-50 flex items-center gap-3">
          <div
            className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-zinc-200 bg-white shadow-sm"
            aria-label={`Signed in as ${userLabel}`}
            title={`Signed in as ${userLabel}`}
          >
            {profileImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profileImage}
                alt={`${userLabel} profile`}
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="text-[10px] font-semibold text-zinc-500">
                {initials || "U"}
              </span>
            )}
            <span
              className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500"
              aria-hidden="true"
            />
          </div>
          <button
            className="rounded-full border border-zinc-200 bg-white/80 px-4 py-1 text-xs font-semibold text-zinc-700 shadow-sm backdrop-blur transition hover:bg-white"
            type="button"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
          >
            {isSidebarOpen ? "Hide" : "Show"}
          </button>
        </div>
        <Sidebar isOpen={isSidebarOpen} />
        <main className="flex w-full flex-1 flex-col gap-6">
          <PlanCard />
          <ApiKeysTable
            isLoading={isLoading}
            apiKeys={apiKeys}
            pagedKeys={pagedKeys}
            visibleKeyId={visibleKeyId}
            maskKey={maskKey}
            onToggleVisibility={(id) =>
              setVisibleKeyId(visibleKeyId === id ? null : id)
            }
            onCopyKey={handleCopyKey}
            onEditKey={openEditModal}
            onDeleteKey={openDeleteModal}
            onOpenCreate={openCreateModal}
            pageSize={pageSize}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPageIndex(1);
            }}
            currentPage={currentPage}
            totalPages={totalPages}
            startIndex={startIndex}
            endIndex={endIndex}
            onPrevPage={() => setPageIndex((prev) => Math.max(1, prev - 1))}
            onNextPage={() =>
              setPageIndex((prev) => Math.min(totalPages, prev + 1))
            }
          />
        </main>
      </div>
      <ToastMessage message={error} variant="error" />
      <ToastMessage message={toast} variant="success" />
      <KeyModal
        isOpen={isCreateOpen}
        title="Create a new API key"
        description="Enter a name for the new API key."
        label="Key Name — A unique name to identify this key"
        placeholder="Key Name"
        value={keyName}
        onChange={setKeyName}
        onCancel={closeCreateModal}
        onSubmit={saveKey}
        submitLabel="Create"
      />
      <KeyModal
        isOpen={isEditOpen}
        title="Edit API key name"
        description="Update the name for this API key."
        label="Key Name"
        placeholder="Key Name"
        value={editName}
        onChange={setEditName}
        onCancel={closeEditModal}
        onSubmit={editKey}
        submitLabel="Save"
      />
      <ConfirmModal
        isOpen={isDeleteOpen}
        title="Delete API key"
        description="Are you sure you want to delete this API key? This action cannot be undone."
        onCancel={closeDeleteModal}
        onConfirm={deleteKey}
        confirmLabel="Delete"
      />
    </div>
  );
}
