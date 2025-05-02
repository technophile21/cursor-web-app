'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PlaygroundPage() {
  const router = useRouter();
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with API key:', apiKey);
    
    if (apiKey.trim()) {
      const url = `/protected?apiKey=${encodeURIComponent(apiKey)}`;
      console.log('Redirecting to:', url);
      try {
        window.location.href = url;
      } catch (error) {
        console.error('Navigation error:', error);
      }
    } else {
      console.log('API key is empty');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">API Playground</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="mb-4">
          <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
            API Key
          </label>
          <input
            type="text"
            id="apiKey"
            value={apiKey}
            onChange={(e) => {
              console.log('Input changed:', e.target.value);
              setApiKey(e.target.value);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter your API key"
            required
          />
        </div>
        <button
          type="submit"
          onClick={() => console.log('Submit button clicked')}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Submit
        </button>
      </form>
    </div>
  );
} 