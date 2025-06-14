import React from 'react';
import { ApiKey } from '@/types/apiKey';
import RenameApiKeyModal from './RenameApiKeyModal';

interface ApiKeysTableProps {
  apiKeys: ApiKey[];
  useMockData: boolean;
  revealedKeys: Set<string>;
  onRevealKey: (id: string) => void;
  onHideKey: (id: string) => void;
  onCopyKey: (key: string) => void;
  onToggleActive: (id: string, isActive: boolean) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, newName: string) => Promise<void>;
  maskApiKey: (key: string) => string;
  selectedApiKey: ApiKey | null;
  isRenameModalOpen: boolean;
  onOpenRenameModal: (apiKey: ApiKey) => void;
  onCloseRenameModal: () => void;
}

export default function ApiKeysTable({
  apiKeys,
  useMockData,
  revealedKeys,
  onRevealKey,
  onHideKey,
  onCopyKey,
  onToggleActive,
  onDelete,
  onRename,
  maskApiKey,
  selectedApiKey,
  isRenameModalOpen,
  onOpenRenameModal,
  onCloseRenameModal,
}: ApiKeysTableProps) {
  const existingNames = apiKeys.map(key => key.name);

  return (
    <>
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
                <td className="py-4 px-2 text-gray-500">{useMockData ? Math.floor(Math.random() * 50) : 0}</td>
                <td className="py-4 px-2 font-mono text-sm">
                  {revealedKeys.has(key.id) ? key.key : maskApiKey(key.key)}
                </td>
                <td className="py-4 px-2">
                  <div className="flex justify-end gap-2">
                    {revealedKeys.has(key.id) ? (
                      <button
                        onClick={() => onHideKey(key.id)}
                        className="text-gray-500 hover:text-purple-500"
                        title="Hide"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                          <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                        </svg>
                      </button>
                    ) : (
                      <button
                        onClick={() => onRevealKey(key.id)}
                        className="text-gray-500 hover:text-green-500"
                        title="View"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                    <button
                      onClick={() => onCopyKey(key.key)}
                      className="text-gray-500 hover:text-yellow-500"
                      title="Copy"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                        <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onOpenRenameModal(key)}
                      className="text-gray-500 hover:text-blue-500"
                      title="Edit"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDelete(key.id)}
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

      <RenameApiKeyModal
        isOpen={isRenameModalOpen}
        onClose={onCloseRenameModal}
        apiKey={selectedApiKey}
        onRename={onRename}
        existingNames={existingNames}
      />
    </>
  );
} 