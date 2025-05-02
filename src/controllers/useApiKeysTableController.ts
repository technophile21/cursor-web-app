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
  }, []);

  const handleToggleActive = useCallback(async (id: string, isActive: boolean) => {
    await updateApiKey(id, { isActive: !isActive });
  }, [updateApiKey]);

  const handleDelete = useCallback(async (id: string) => {
    await deleteApiKey(id);
  }, [deleteApiKey]);

  return {
    revealedKeys,
    showCopyToast,
    setShowCopyToast,
    maskApiKey,
    revealKey,
    handleHideKey,
    handleCopyKey,
    handleToggleActive,
    handleDelete,
  };
} 