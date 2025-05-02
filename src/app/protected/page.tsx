'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Toast from '@/components/Toast';
import { supabaseApiKeyService } from '@/services/supabaseApiKeyService';
import { strings } from '@/constants/strings';

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
          setToast({ message: 'api_key_valid', type: 'success' });
        } else {
          setToast({ message: 'api_key_invalid', type: 'error' });
        }
      } catch (e) {
        setToast({ message: 'api_key_validation_error', type: 'error' });
      }
    }

    validate();
  }, [apiKey]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">{strings.protected_page_title}</h1>
      <p className="mb-2">{strings.api_key_label}: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{apiKey}</span></p>
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