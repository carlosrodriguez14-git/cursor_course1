"use client";

import { useEffect, useMemo, useState } from "react";

const DEFAULT_PAGE_SIZE = 10;

export default function useApiKeys() {
  const [apiKeys, setApiKeys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [visibleKeyId, setVisibleKeyId] = useState(null);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [keyName, setKeyName] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editId, setEditId] = useState("");
  const [editName, setEditName] = useState("");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState("");

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timer = window.setTimeout(() => {
      setToast("");
    }, 2000);

    return () => window.clearTimeout(timer);
  }, [toast]);

  const loadKeys = async () => {
    setIsLoading(true);
    setError("");

    const response = await fetch("/api/keys");
    const payload = await response.json();

    if (!response.ok) {
      setError(payload?.error || "Unable to load API keys.");
      setIsLoading(false);
      return;
    }

    setApiKeys(payload.data || []);
    setPageIndex(1);
    setIsLoading(false);
  };

  useEffect(() => {
    loadKeys();
  }, []);

  const openCreateModal = () => setIsCreateOpen(true);

  const closeCreateModal = () => {
    setIsCreateOpen(false);
    setKeyName("");
  };

  const openEditModal = (item) => {
    const keyId = item?.id ? String(item.id) : "";
    if (!keyId) {
      setError("This key is missing an id. Refresh the page.");
      return;
    }

    setEditId(keyId);
    setEditName(item?.name || "");
    setIsEditOpen(true);
  };

  const closeEditModal = () => {
    setIsEditOpen(false);
    setEditId("");
    setEditName("");
  };

  const saveKey = async () => {
    const trimmedName = keyName.trim();
    if (!trimmedName) {
      return;
    }

    const response = await fetch("/api/keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: trimmedName,
      }),
    });

    const payload = await response.json();

    if (!response.ok) {
      setError(payload?.error || "Unable to create API key.");
      return;
    }

    setApiKeys((prev) => [payload.data, ...prev]);
    setPageIndex(1);
    closeCreateModal();
  };

  const openDeleteModal = async (id) => {
    const keyId = id ? String(id) : "";
    if (!keyId) {
      await loadKeys();
      setError("This key is missing an id. List refreshed.");
      return;
    }

    setDeleteId(keyId);
    setIsDeleteOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteOpen(false);
    setDeleteId("");
  };

  const deleteKey = async () => {
    if (!deleteId) {
      setError("This key is missing an id. Refresh the page.");
      return;
    }

    const response = await fetch(`/api/keys/${encodeURIComponent(deleteId)}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const payload = await response.json();
      setError(payload?.error || "Unable to delete API key.");
      return;
    }

    setApiKeys((prev) => prev.filter((item) => String(item.id) !== deleteId));
    setPageIndex(1);
    closeDeleteModal();
  };

  const editKey = async () => {
    const trimmedName = editName.trim();
    if (!editId) {
      setError("This key is missing an id. Refresh the page.");
      return;
    }

    if (!trimmedName) {
      setError("Name is required.");
      return;
    }

    const response = await fetch(`/api/keys/${encodeURIComponent(editId)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: trimmedName,
      }),
    });

    const payload = await response.json();
    if (!response.ok) {
      setError(payload?.error || "Unable to update API key.");
      return;
    }

    setApiKeys((prev) =>
      prev.map((key) => (String(key.id) === editId ? payload.data : key))
    );
    closeEditModal();
  };

  const handleCopyKey = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
      setToast("API key copied.");
    } catch (copyError) {
      setError("Unable to copy the API key.");
    }
  };

  const pagination = useMemo(() => {
    const totalPages = Math.max(1, Math.ceil(apiKeys.length / pageSize));
    const currentPage = Math.min(pageIndex, totalPages);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, apiKeys.length);

    return {
      totalPages,
      currentPage,
      startIndex,
      endIndex,
      pagedKeys: apiKeys.slice(startIndex, endIndex),
    };
  }, [apiKeys, pageIndex, pageSize]);

  return {
    apiKeys,
    isLoading,
    error,
    toast,
    visibleKeyId,
    setVisibleKeyId,
    pageIndex,
    setPageIndex,
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
  };
}
