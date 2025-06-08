import React, { useState } from 'react';

const DEFAULT_PAYLOAD = `{
  "githubUrl" : "https://github.com/technophile21/cs231n.github.io"
}`;
const DEFAULT_OUTPUT = `{
  "error": "Failed to process GitHub repository",
  "details": "429 You exceeded your current quota, please check your plan and billing details. For more information on this error, read the docs: https://platform.openai.com/docs/guides/error-codes/api-errors.\n\nTroubleshooting URL: https://js.langchain.com/docs/troubleshooting/errors/MODEL_RATE_LIMIT/\n"
}`;

export default function ApiDemo() {
  const [payload, setPayload] = useState(DEFAULT_PAYLOAD);
  const [output, setOutput] = useState(DEFAULT_OUTPUT);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTryIt = async () => {
    setLoading(true);
    setError("");
    setOutput("");
    let parsedPayload;
    try {
      parsedPayload = JSON.parse(payload);
    } catch (e) {
      setError("Invalid JSON payload");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/github-summarizer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "demo-key" // Replace with a valid key if needed
        },
        body: JSON.stringify(parsedPayload)
      });
      const data = await res.json();
      setOutput(JSON.stringify(data, null, 2));
    } catch (e) {
      setError("API call failed");
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center w-full">
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl mx-auto justify-center items-center">
        {/* Input Box */}
        <div className="flex-1 min-w-[320px] max-w-[420px] bg-white rounded-lg shadow p-6 border flex flex-col justify-between h-80">
          <div>
            <div className="mb-2 font-semibold text-left">API Payload (POST /api/github-summarizer)</div>
            <textarea
              className="w-full h-40 p-2 border rounded font-mono text-sm resize-none"
              value={payload}
              onChange={e => setPayload(e.target.value)}
              spellCheck={false}
            />
          </div>
          <div>
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 w-full"
              onClick={handleTryIt}
              disabled={loading}
            >
              {loading ? "Loading..." : "Try it"}
            </button>
            {error && <div className="mt-2 text-red-600 text-sm">{error}</div>}
          </div>
        </div>
        {/* Output Box */}
        <div className="flex-1 min-w-[320px] max-w-[420px] bg-white rounded-lg shadow p-6 border flex flex-col justify-between h-80">
          <div>
            <div className="mb-2 font-semibold text-left">Output</div>
            <pre className="w-full h-40 p-2 bg-gray-100 border rounded font-mono text-sm overflow-auto text-left whitespace-pre-wrap">{output}</pre>
          </div>
        </div>
      </div>
    </div>
  );
} 