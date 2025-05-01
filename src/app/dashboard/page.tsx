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
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [payAsYouGo, setPayAsYouGo] = useState(false);

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
      setShowCreateForm(false);
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
    return `${key.slice(0, 12)}${'*'.repeat(key.length - 24)}${key.slice(-12)}`;
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
    <div className="max-w-6xl mx-auto p-6">
      {/* Error Dialog */}
      {errorDialog && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex justify-between items-start">
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

      {/* Plan Information Card */}
      <div className="mb-10 p-8 rounded-2xl bg-gradient-to-r from-pink-200 via-purple-300 to-blue-300 shadow-md">
        <div className="flex justify-between items-start mb-6">
          <div className="bg-white/30 px-3 py-1 rounded-md text-sm font-medium">
            CURRENT PLAN
          </div>
          <button className="bg-white/30 px-3 py-1 rounded-md text-sm font-medium flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
            </svg>
            Manage Plan
          </button>
        </div>

        <h1 className="text-4xl font-bold text-white mb-8">Researcher</h1>

        <div className="flex items-center gap-1.5 mb-2">
          <div className="text-white font-medium">API Usage</div>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white/70" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>

        <div className="mb-1 text-white/80">Plan</div>
        <div className="flex items-center justify-between mb-4">
          <div className="w-full h-2 bg-white/30 rounded-full overflow-hidden">
            <div className="h-full bg-white" style={{ width: '0%' }}></div>
          </div>
          <div className="ml-4 text-white whitespace-nowrap">0 / 1,000 Credits</div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setPayAsYouGo(!payAsYouGo)}
            className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${payAsYouGo ? 'bg-white' : 'bg-white/30'}`}
            role="switch"
            aria-checked={payAsYouGo}
          >
            <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full shadow-lg ring-0 transition duration-200 ease-in-out ${payAsYouGo ? 'translate-x-5 bg-blue-600' : 'translate-x-0 bg-white'}`}></span>
          </button>
          <span className="text-white">Pay as you go</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white/70" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {/* Display newly created key */}
      {showNewKey && (
        <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
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

      {/* API Keys Section */}
      <div className="bg-white shadow-sm rounded-lg border p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">API Keys</h2>
          <button 
            onClick={() => setShowCreateForm(true)}
            className="flex items-center justify-center h-7 w-7 rounded-full hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <p className="text-gray-500 mb-4">
          The key is used to authenticate your requests to the <a href="#" className="text-blue-600 hover:underline">Research API</a>.
          To learn more, see the <a href="#" className="text-blue-600 hover:underline">documentation</a> page.
        </p>

        {/* Create new API key form */}
        {showCreateForm && (
          <form onSubmit={handleCreateKey} className="mb-6 p-4 border rounded-lg bg-gray-50">
            <h3 className="font-medium mb-3">Create new API key</h3>
            <div className="flex flex-col gap-4">
              <div>
                <label htmlFor="keyName" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  id="keyName"
                  type="text"
                  value={newKeyName}
                  onChange={(e) => {
                    setNewKeyName(e.target.value);
                    if (errorDialog && errorDialog.includes('unique')) {
                      setErrorDialog(null);
                    }
                  }}
                  placeholder="Enter API key name"
                  className="w-full px-3 py-2 text-sm border rounded-md"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 text-sm border rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Create
                </button>
              </div>
            </div>
          </form>
        )}

        {/* API Keys Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-gray-500 text-sm">
                <th className="py-2 px-2 font-medium">NAME</th>
                <th className="py-2 px-2 font-medium">TYPE</th>
                <th className="py-2 px-2 font-medium">USAGE</th>
                <th className="py-2 px-2 font-medium">KEY</th>
                <th className="py-2 px-2 font-medium text-right">OPTIONS</th>
              </tr>
            </thead>
            <tbody>
              {apiKeys.map((key) => (
                <tr key={key.id} className="border-b">
                  <td className="py-4 px-2">{key.name}</td>
                  <td className="py-4 px-2 text-gray-500">dev</td>
                  <td className="py-4 px-2 text-gray-500">0</td>
                  <td className="py-4 px-2 font-mono text-sm">
                    {revealedKeys.has(key.id) ? key.key : maskApiKey(key.key)}
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex justify-end gap-2">
                      {revealedKeys.has(key.id) ? (
                        <button
                          onClick={() => handleHideKey(key.id)}
                          className="text-gray-500 hover:text-gray-700"
                          title="Hide"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                            <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                          </svg>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRevealKey(key.id)}
                          className="text-gray-500 hover:text-gray-700"
                          title="View"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                      )}
                      <button
                        onClick={() => {navigator.clipboard.writeText(key.key)}}
                        className="text-gray-500 hover:text-gray-700"
                        title="Copy"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                          <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleToggleActive(key.id, key.isActive)}
                        className="text-gray-500 hover:text-gray-700"
                        title="Edit"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(key.id)}
                        className="text-gray-500 hover:text-red-500"
                        title="Delete"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* No API Keys Message */}
        {apiKeys.length === 0 && (
          <div className="py-8 text-center text-gray-500">
            You don't have any API keys yet. Click the + button to create one.
          </div>
        )}
      </div>

      {/* Passphrase Modal */}
      {showPassPhraseInput && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="font-bold mb-4">Enter passphrase</h3>
            <form onSubmit={(e) => handlePassPhraseSubmit(e, showPassPhraseInput)}>
              <div className="mb-4">
                <input
                  type="password"
                  value={passPhrase}
                  onChange={(e) => setPassPhrase(e.target.value)}
                  placeholder="Enter passphrase"
                  className="w-full px-4 py-2 border rounded"
                />
                {passPhraseError && (
                  <p className="mt-1 text-sm text-red-500">
                    Incorrect passphrase
                  </p>
                )}
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowPassPhraseInput(null)}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 