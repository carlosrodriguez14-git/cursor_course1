"use client";

import { useState } from "react";

import ApiKeysTable from "./components/ApiKeysTable";
import ConfirmModal from "./components/ConfirmModal";
import KeyModal from "./components/KeyModal";
import PlanCard from "./components/PlanCard";
import Sidebar from "./components/Sidebar";
import ToastMessage from "./components/ToastMessage";
import useApiKeys from "./hooks/useApiKeys";
import maskKey from "./utils/maskKey";

export default function DashboardPage() {
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

  return (
    <div className="min-h-screen bg-zinc-100 px-6 py-10 text-zinc-900">
      <div className="mx-auto flex w-full max-w-6xl gap-6">
        <button
          className="fixed right-6 top-6 z-50 rounded-full border border-zinc-200 bg-white/80 px-4 py-1 text-xs font-semibold text-zinc-700 shadow-sm backdrop-blur transition hover:bg-white"
          type="button"
          onClick={() => setIsSidebarOpen((prev) => !prev)}
        >
          {isSidebarOpen ? "Hide" : "Show"}
        </button>
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
