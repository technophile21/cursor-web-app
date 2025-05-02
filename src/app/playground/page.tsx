'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PlaygroundPage() {
  const [apiKey, setApiKey] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;
    router.push(`/protected?apiKey=${encodeURIComponent(apiKey.trim())}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md flex flex-col gap-4">
        <h1 className="text-2xl font-bold mb-2">API Playground</h1>
        <label htmlFor="api-key" className="font-medium">Enter your API key:</label>
        <input
          id="api-key"
          type="text"
          value={apiKey}
          onChange={e => setApiKey(e.target.value)}
          className="border px-3 py-2 rounded"
          placeholder="API key"
          required
        />
        <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2 font-medium hover:bg-blue-700">Submit</button>
      </form>
    </div>
  );
} 