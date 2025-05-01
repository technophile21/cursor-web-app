'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
}

export default function Dashboard() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Mock data - replace with actual API calls
  useEffect(() => {
    // Simulated API keys
    setApiKeys([
      {
        id: '1',
        name: 'Production API Key',
        key: 'sk_prod_xxxxxxxxxxxx',
        createdAt: new Date().toISOString(),
      },
    ]);
  }, []);

  const handleCreateKey = () => {
    if (!newKeyName) return;
    
    const newKey: ApiKey = {
      id: Math.random().toString(36).substr(2, 9),
      name: newKeyName,
      key: `sk_${Math.random().toString(36).substr(2, 24)}`,
      createdAt: new Date().toISOString(),
    };

    setApiKeys([...apiKeys, newKey]);
    setNewKeyName('');
    setIsCreating(false);
  };

  const handleDeleteKey = (id: string) => {
    setApiKeys(apiKeys.filter(key => key.id !== id));
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">API Keys Dashboard</h1>
          <button
            onClick={() => setIsCreating(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Create New API Key
          </button>
        </div>

        {isCreating && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Create New API Key</h2>
            <div className="flex gap-4">
              <input
                type="text"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="Enter key name"
                className="flex-1 px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              />
              <button
                onClick={handleCreateKey}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
              >
                Create
              </button>
              <button
                onClick={() => setIsCreating(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <div className="p-6">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b dark:border-gray-700">
                  <th className="pb-4">Name</th>
                  <th className="pb-4">API Key</th>
                  <th className="pb-4">Created</th>
                  <th className="pb-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {apiKeys.map((apiKey) => (
                  <tr key={apiKey.id} className="border-b dark:border-gray-700">
                    <td className="py-4">{apiKey.name}</td>
                    <td className="py-4 font-mono">
                      {apiKey.key.slice(0, 8)}...{apiKey.key.slice(-4)}
                    </td>
                    <td className="py-4">
                      {new Date(apiKey.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4">
                      <button
                        onClick={() => handleDeleteKey(apiKey.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 