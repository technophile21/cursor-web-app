'use client';

import { useEffect, useState } from 'react';
import { useApiKeys } from '@/hooks/useApiKeys';
import { ApiKey } from '@/types/apiKey';
import CreateApiKeyDialog from '@/components/CreateApiKeyDialog';
import Toast from '@/components/Toast';
import Sidebar from '@/components/Sidebar';
import { SidebarProvider, useSidebar } from '@/context/SidebarContext';
import { useCreateApiKeyDialogController } from '@/controllers/useCreateApiKeyDialogController';
import { useApiKeysTableController } from '@/controllers/useApiKeysTableController';
import ApiKeysTable from '@/components/ApiKeysTable';
import { strings } from '@/constants/strings';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

const PASS_PHRASE = 'password';

// Mock data for demonstration purposes
const MOCK_DATA: ApiKey[] = [
  {
    id: 'mock-1',
    name: 'Production API Key',
    key: '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',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    lastUsed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
    userId: 'mock-user-1'
  },
  {
    id: 'mock-2',
    name: 'Development API Key',
    key: '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',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    lastUsed: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
    userId: 'mock-user-1'
  }
];

function DashboardContent() {
  const { status, data: session } = useSession();
  const {
    apiKeys: realApiKeys,
    loading,
    error: generalError,
    fetchApiKeys,
    createApiKey,
    updateApiKey,
    deleteApiKey,
  } = useApiKeys();

  const [useMockData, setUseMockData] = useState(true);
  const apiKeys = useMockData ? MOCK_DATA : realApiKeys;

  const [showNewKey, setShowNewKey] = useState<ApiKey | null>(null);
  const [showPassPhraseInput, setShowPassPhraseInput] = useState<string | null>(null);
  const [passPhrase, setPassPhrase] = useState('');
  const [passPhraseError, setPassPhraseError] = useState(false);
  const [errorDialog, setErrorDialog] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [payAsYouGo, setPayAsYouGo] = useState(false);
  const { open: sidebarOpen, setOpen: setSidebarOpen } = useSidebar();

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/');
    }
  }, [status]);

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

  // Check if we should use real data
  useEffect(() => {
    if (realApiKeys.length > 0) {
      setUseMockData(false);
    }
  }, [realApiKeys]);

  const handleCreateKey = async (data: { name: string }) => {
    setErrorDialog(null);
    setUseMockData(false);
    
    const newKey = await createApiKey({ name: data.name });
    setShowNewKey(newKey);
    return newKey;
  };

  // Table controller for API keys table operations
  const tableController = useApiKeysTableController({
    updateApiKey,
    deleteApiKey,
  });

  // Handler for requesting reveal (opens passphrase modal)
  const handleRequestRevealKey = (id: string) => {
    setShowPassPhraseInput(id);
    setPassPhrase('');
    setPassPhraseError(false);
  };

  // Handler for passphrase modal submit
  const handlePassPhraseSubmit = (e: React.FormEvent, id: string) => {
    e.preventDefault();
    if (passPhrase === PASS_PHRASE) {
      tableController.revealKey(id);
      setShowPassPhraseInput(null);
      setPassPhraseError(false);
    } else {
      setPassPhraseError(true);
    }
  };

  // Show switch to real data prompt
  const switchToRealData = () => {
    setUseMockData(false);
  };

  const handleCopyKey = async (key: string) => {
    try {
      await navigator.clipboard.writeText(key);
      setShowPassPhraseInput(null);
      setPassPhraseError(false);
    } catch {
      setErrorDialog('Failed to copy API key to clipboard');
    }
  };

  // Controller for CreateApiKeyDialog
  const createApiKeyDialog = useCreateApiKeyDialogController({
    onSubmit: handleCreateKey,
    onClose: () => setIsCreateDialogOpen(false),
  });

  if (loading && !useMockData) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="relative min-h-screen">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} onOpen={() => setSidebarOpen(true)} />
      <main className={sidebarOpen ? "ml-64 px-6 pt-6 transition-all duration-200" : "px-6 pt-6 transition-all duration-200"}>
        <div className="max-w-6xl mx-auto p-6">
          {/* Demo Data Notification */}
          {useMockData && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex justify-between items-start">
              <div>
                <h3 className="font-bold text-blue-800 mb-1">{strings.dashboard_demo_mode_title}</h3>
                <p className="text-blue-700">{strings.dashboard_demo_mode_desc}</p>
              </div>
              <button
                onClick={switchToRealData}
                className="text-gray-500 hover:text-gray-700"
                aria-label={strings.dismiss}
              >
                ✕
              </button>
            </div>
          )}

          {/* Error Dialog */}
          {errorDialog && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex justify-between items-start">
              <div>
                <h3 className="font-bold text-red-800 mb-1">{strings.error}</h3>
                <p className="text-red-700">{errorDialog}</p>
              </div>
              <button
                onClick={() => setErrorDialog(null)}
                className="text-gray-500 hover:text-gray-700"
                aria-label={strings.dismiss_error}
              >
                ✕
              </button>
            </div>
          )}

          {/* Plan Information Card */}
          <div className="mb-10 p-8 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 shadow-md">
            <div className="flex justify-between items-start mb-6">
              <div className="bg-white/30 px-3 py-1 rounded-md text-sm font-medium">
                {strings.dashboard_current_plan}
              </div>
              <button className="bg-white/30 px-3 py-1 rounded-md text-sm font-medium flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
                </svg>
                {strings.dashboard_manage_plan}
              </button>
            </div>

            <h1 className="text-4xl font-bold text-white mb-8">{strings.dashboard_plan_name}</h1>

            <div className="flex items-center gap-1.5 mb-2">
              <div className="text-white font-medium">{strings.dashboard_api_usage}</div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white/70" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>

            <div className="mb-1 text-white/80">{strings.dashboard_plan_label}</div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-full h-2 bg-white/30 rounded-full overflow-hidden">
                <div className="h-full bg-white" style={{ width: useMockData ? '15%' : '0%' }}></div>
              </div>
              <div className="ml-4 text-white whitespace-nowrap">
                {useMockData ? '150' : '0'} / 1,000 {strings.dashboard_credits}
              </div>
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
              <span className="text-white">{strings.dashboard_payg}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white/70" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Display newly created key */}
          {showNewKey && (
            <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-bold mb-2">{strings.dashboard_new_key_title}</h3>
              <p className="mb-2">{strings.dashboard_new_key_desc}</p>
              <code className="block p-2 bg-white border rounded mb-2">
                {showNewKey.key}
              </code>
              <button
                onClick={() => setShowNewKey(null)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                {strings.dismiss}
              </button>
            </div>
          )}

          {/* API Keys Section */}
          <div className="bg-white shadow-sm rounded-lg border p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{strings.dashboard_api_keys_title}</h2>
              <button 
                onClick={() => setIsCreateDialogOpen(true)}
                className="flex items-center justify-center h-7 w-7 rounded-full hover:bg-gray-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <p className="text-gray-500 mb-4">
              {strings.dashboard_api_keys_desc_1} <a href="#" className="text-blue-600 hover:underline">{strings.dashboard_api_keys_desc_2}</a>.
              {strings.dashboard_api_keys_desc_3} <a href="#" className="text-blue-600 hover:underline">{strings.dashboard_api_keys_desc_4}</a> {strings.dashboard_api_keys_desc_5}
            </p>

            <ApiKeysTable
              apiKeys={apiKeys}
              useMockData={useMockData}
              revealedKeys={tableController.revealedKeys}
              onRevealKey={handleRequestRevealKey}
              onHideKey={tableController.handleHideKey}
              onCopyKey={handleCopyKey}
              onToggleActive={tableController.handleToggleActive}
              onDelete={tableController.handleDelete}
              maskApiKey={tableController.maskApiKey}
            />

            {/* No API Keys Message */}
            {apiKeys.length === 0 && (
              <div className="py-8 text-center text-gray-500">
                {strings.dashboard_no_api_keys}
              </div>
            )}
          </div>

          {/* Create API Key Dialog */}
          <CreateApiKeyDialog
            isOpen={isCreateDialogOpen}
            onClose={() => setIsCreateDialogOpen(false)}
            {...createApiKeyDialog}
          />

          {/* Passphrase Modal */}
          {showPassPhraseInput && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 className="font-bold mb-4">{strings.dashboard_passphrase_title}</h3>
                <form onSubmit={(e) => handlePassPhraseSubmit(e, showPassPhraseInput)}>
                  <div className="mb-4">
                    <input
                      type="password"
                      value={passPhrase}
                      onChange={(e) => setPassPhrase(e.target.value)}
                      placeholder={strings.dashboard_passphrase_placeholder}
                      className="w-full px-4 py-2 border rounded"
                    />
                    {passPhraseError && (
                      <p className="mt-1 text-sm text-red-500">
                        {strings.dashboard_passphrase_error}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowPassPhraseInput(null)}
                      className="px-4 py-2 border rounded hover:bg-gray-50"
                    >
                      {strings.cancel}
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      {strings.submit}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Add Toast at the end of the component, just before the closing div */}
          {tableController.showCopyToast && (
            <Toast
              message="dashboard_api_key_copied"
              onClose={() => tableController.setShowCopyToast(false)}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default function Dashboard() {
  return (
    <SidebarProvider>
      <DashboardContent />
    </SidebarProvider>
  );
} 