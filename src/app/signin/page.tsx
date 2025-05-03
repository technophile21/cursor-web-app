'use client';

import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Toast from '@/components/Toast';

export default function SignIn() {
  const searchParams = useSearchParams();
  const [showToast, setShowToast] = useState(false);
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  useEffect(() => {
    // Show toast if redirected from a protected page
    if (searchParams.get('error') === 'AccessDenied') {
      setShowToast(true);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <Image
            className="mx-auto h-12 w-auto"
            src="/next.svg"
            alt="Logo"
            width={48}
            height={48}
          />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please sign in to access protected content
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <button
            onClick={() => signIn('google', { callbackUrl })}
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Image
              src="/google.svg"
              alt="Google logo"
              width={20}
              height={20}
              className="mr-2"
            />
            Sign in with Google
          </button>
        </div>
      </div>

      {showToast && (
        <Toast
          message="Please sign in to access this page"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
} 