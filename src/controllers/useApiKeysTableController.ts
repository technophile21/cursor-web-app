import { useState, useCallback } from 'react';
import { ApiKey } from '@/types/apiKey';

export function useApiKeysTableController({
  updateApiKey,
  deleteApiKey,
}: {
  updateApiKey: (id: string, data: Partial<ApiKey>) => Promise<unknown>;
  deleteApiKey: (id: string) => Promise<unknown>;
}) {
  const [revealedKeys, setRevealedKeys] = useState<Set<string>>(new Set());
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [showRenameToast, setShowRenameToast] = useState(false);
  const [selectedApiKey, setSelectedApiKey] = useState<ApiKey | null>(null);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);

  const maskApiKey = useCallback((key: string) => {
    if (key.length <= 8) return '*'.repeat(key.length);
    return `${key.slice(0, 12)}${'*'.repeat(key.length - 24)}${key.slice(-12)}`;
  }, []);

  const revealKey = useCallback((id: string) => {
    setRevealedKeys(prev => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
  }, []);

  const handleHideKey = useCallback((id: string) => {
    setRevealedKeys(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  }, []);

  const handleCopyKey = useCallback(async (key: string) => {
    await navigator.clipboard.writeText(key);
    setShowCopyToast(true);
    setTimeout(() => setShowCopyToast(false), 3000);
  }, []);

  const handleToggleActive = useCallback(async (id: string, isActive: boolean) => {
    await updateApiKey(id, { isActive: !isActive });
  }, [updateApiKey]);

  const handleDelete = useCallback(async (id: string) => {
    await deleteApiKey(id);
  }, [deleteApiKey]);

  const handleRename = useCallback(async (id: string, newName: string) => {
    await updateApiKey(id, { name: newName });
    setShowRenameToast(true);
    setTimeout(() => setShowRenameToast(false), 3000);
  }, [updateApiKey]);

  const openRenameModal = useCallback((apiKey: ApiKey) => {
    setSelectedApiKey(apiKey);
    setIsRenameModalOpen(true);
  }, []);

  const closeRenameModal = useCallback(() => {
    setIsRenameModalOpen(false);
    setSelectedApiKey(null);
  }, []);

  return {
    revealedKeys,
    showCopyToast,
    showRenameToast,
    selectedApiKey,
    isRenameModalOpen,
    maskApiKey,
    revealKey,
    handleHideKey,
    handleCopyKey,
    handleToggleActive,
    handleDelete,
    handleRename,
    openRenameModal,
    closeRenameModal,
  };
} 