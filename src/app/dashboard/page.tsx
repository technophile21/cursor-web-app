'use client';

import { useEffect, useState } from 'react';
import { useApiKeys } from '@/hooks/useApiKeys';
import { ApiKey } from '@/types/apiKey';

const PASS_PHRASE = 'password';

export default function Dashboard() {
  const {
    apiKeys,
    loading,
    error: generalError,
    fetchApiKeys,
    createApiKey,
    updateApiKey,
    deleteApiKey,
  } = useApiKeys();

  const [newKeyName, setNewKeyName] = useState('');
  const [showNewKey, setShowNewKey] = useState<ApiKey | null>(null);
  const [revealedKeys, setRevealedKeys] = useState<Set<string>>(new Set());
  const [passPhrase, setPassPhrase] = useState('');
  const [showPassPhraseInput, setShowPassPhraseInput] = useState<string | null>(null);
  const [passPhraseError, setPassPhraseError] = useState(false);
  const [errorDialog, setErrorDialog] = useState<string | null>(null);

  // Show general error in error dialog
  useEffect(() => {
    if (generalError) {
      setErrorDialog(generalError);
    }
  }, [generalError]);

  useEffect(() => {
    fetchApiKeys().catch(() => {
      // Error is already handled by the hook and displayed through the generalError state
    });
  }, [fetchApiKeys]);

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorDialog(null);
    
    try {
      const newKey = await createApiKey({ name: newKeyName });
      setShowNewKey(newKey);
      setNewKeyName('');
    } catch (error) {
      // Error is already set in the error dialog by the generalError effect
      // Just handle UI-specific logic, no need to rethrow or log
      if (error instanceof Error && !error.message.includes('unique')) {
        // We want to preserve the name only for uniqueness errors
        // For other errors, it might be a good idea to clear it
        // setNewKeyName('');
      }
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      await updateApiKey(id, { isActive: !isActive });
    } catch (error) {
      // Error is already set in the error dialog by the generalError effect
      // No need to do anything here
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this API key?')) {
      try {
        await deleteApiKey(id);
      } catch (error) {
        // Error is already set in the error dialog by the generalError effect
        // No need to do anything here
      }
    }
  };

  const maskApiKey = (key: string) => {
    if (key.length <= 8) return '*'.repeat(key.length);
    return `${key.slice(0, 4)}${'*'.repeat(key.length - 8)}${key.slice(-4)}`;
  };

  const handleRevealKey = (id: string) => {
    setShowPassPhraseInput(id);
    setPassPhrase('');
    setPassPhraseError(false);
  };

  const handlePassPhraseSubmit = (e: React.FormEvent, id: string) => {
    e.preventDefault();
    if (passPhrase === PASS_PHRASE) {
      setRevealedKeys(prev => new Set([...prev, id]));
      setShowPassPhraseInput(null);
      setPassPhraseError(false);
    } else {
      setPassPhraseError(true);
    }
  };

  const handleHideKey = (id: string) => {
    setRevealedKeys(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">API Keys Management</h1>

      {/* Error Dialog */}
      {errorDialog && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded flex justify-between items-start">
          <div>
            <h3 className="font-bold text-red-800 mb-1">Error</h3>
            <p className="text-red-700">{errorDialog}</p>
          </div>
          <button
            onClick={() => setErrorDialog(null)}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Dismiss error"
          >
            ✕
          </button>
        </div>
      )}

      {/* Create new API key form */}
      <form onSubmit={handleCreateKey} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={newKeyName}
            onChange={(e) => {
              setNewKeyName(e.target.value);
              if (errorDialog && errorDialog.includes('unique')) {
                setErrorDialog(null);
              }
            }}
            placeholder="Enter API key name"
            className="flex-1 px-4 py-2 border rounded"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Create New Key
          </button>
        </div>
      </form>

      {/* Display newly created key */}
      {showNewKey && (
        <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded">
          <h3 className="font-bold mb-2">New API Key Created!</h3>
          <p className="mb-2">Please copy your API key now. You won't be able to see it again!</p>
          <code className="block p-2 bg-white border rounded mb-2">
            {showNewKey.key}
          </code>
          <button
            onClick={() => setShowNewKey(null)}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* API Keys list */}
      <div className="space-y-4">
        {apiKeys.map((key) => (
          <div
            key={key.id}
            className="p-4 border rounded"
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-bold">{key.name}</h3>
                <p className="text-sm text-gray-500">
                  Created: {new Date(key.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleToggleActive(key.id, key.isActive)}
                  className={`px-3 py-1 rounded ${
                    key.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {key.isActive ? 'Active' : 'Inactive'}
                </button>
                <button
                  onClick={() => handleDelete(key.id)}
                  className="px-3 py-1 text-red-600 hover:bg-red-50 rounded"
                >
                  Delete
                </button>
              </div>
            </div>

            {/* API Key display section */}
            <div className="mt-4 p-3 bg-gray-50 rounded">
              <div className="flex items-center justify-between">
                <code className="font-mono">
                  {revealedKeys.has(key.id) ? key.key : maskApiKey(key.key)}
                </code>
                {revealedKeys.has(key.id) ? (
                  <button
                    onClick={() => handleHideKey(key.id)}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    Hide
                  </button>
                ) : (
                  <button
                    onClick={() => handleRevealKey(key.id)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Reveal
                  </button>
                )}
              </div>

              {/* Passphrase input */}
              {showPassPhraseInput === key.id && (
                <form
                  onSubmit={(e) => handlePassPhraseSubmit(e, key.id)}
                  className="mt-2 flex gap-2"
                >
                  <input
                    type="password"
                    value={passPhrase}
                    onChange={(e) => setPassPhrase(e.target.value)}
                    placeholder="Enter passphrase"
                    className="flex-1 px-3 py-1 text-sm border rounded"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPassPhraseInput(null)}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                </form>
              )}
              {passPhraseError && showPassPhraseInput === key.id && (
                <p className="mt-1 text-sm text-red-500">
                  Incorrect passphrase
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 