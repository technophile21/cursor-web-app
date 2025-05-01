'use client';

import { useEffect, useState } from 'react';
import { useApiKeys } from '@/hooks/useApiKeys';
import { ApiKey } from '@/types/apiKey';

export default function Dashboard() {
  const {
    apiKeys,
    loading,
    error,
    fetchApiKeys,
    createApiKey,
    updateApiKey,
    deleteApiKey,
  } = useApiKeys();

  const [newKeyName, setNewKeyName] = useState('');
  const [showNewKey, setShowNewKey] = useState<ApiKey | null>(null);

  useEffect(() => {
    fetchApiKeys();
  }, [fetchApiKeys]);

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newKey = await createApiKey({ name: newKeyName });
      setShowNewKey(newKey);
      setNewKeyName('');
    } catch (error) {
      console.error('Failed to create API key:', error);
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      await updateApiKey(id, { isActive: !isActive });
    } catch (error) {
      console.error('Failed to update API key:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this API key?')) {
      try {
        await deleteApiKey(id);
      } catch (error) {
        console.error('Failed to delete API key:', error);
      }
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">API Keys Management</h1>

      {/* Create new API key form */}
      <form onSubmit={handleCreateKey} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
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
            className="p-4 border rounded flex items-center justify-between"
          >
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
        ))}
      </div>
    </div>
  );
} 