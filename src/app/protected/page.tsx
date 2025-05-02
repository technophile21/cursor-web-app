'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Toast from '@/components/Toast';
import { supabaseApiKeyService } from '@/services/supabaseApiKeyService';

export default function ProtectedPage() {
  const searchParams = useSearchParams();
  const apiKey = searchParams.get('apiKey') || '';
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (!apiKey) return;

    async function validate() {
      try {
        const isValid = await supabaseApiKeyService.validateKey(apiKey);
        if (isValid) {
          setToast({ message: 'Valid API key', type: 'success' });
        } else {
          setToast({ message: 'Invalid API key', type: 'error' });
        }
      } catch (e) {
        setToast({ message: 'Error validating API key', type: 'error' });
      }
    }

    validate();
  }, [apiKey]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Protected Page</h1>
      <p className="mb-2">API Key: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{apiKey}</span></p>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
} 