import React, { useState, useEffect } from 'react';

function App() {
  const [text, setText] = useState('');
  const [key, setKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleProcess = async (type) => {
    setError(null);
    setResult('');
    
    if (!text.trim()) {
      setError('Please enter some text to process.');
      return;
    }
    if (!key.trim()) {
      setError('Please enter a secret key.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, key })
      });
      
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || `Failed to ${type}`);
      }
      
      setResult(data.result);
    } catch (err) {
      let errorMsg = err.message;
      
      // Better network error detection
      if (errorMsg.includes('Failed to fetch') || errorMsg.includes('NetworkError') || errorMsg.includes('fetch')) {
        errorMsg = 'Network error: Backend server not reachable. \n\n1. Ensure backend is running: cd backend && npm start\n2. Check http://localhost:5000 loads the app\n3. Check Windows Firewall\n4. Try refresh/restart browser';
      } else if (errorMsg.includes('json')) {
        errorMsg = 'Server error: Invalid response. Backend may have crashed.';
      }
      
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }

  };

  const copyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setText('');
    setKey('');
    setResult('');
    setError(null);
    setCopied(false);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 animate-fade-in flex flex-col items-center justify-center">
      
      <div className="fixed inset-0 z-[-1] bg-gradient-to-br from-indigo-100 via-white to-pink-100 dark:from-indigo-950 dark:via-slate-900 dark:to-pink-950 opacity-50 dark:opacity-100"></div>
      
      <div className="w-full max-w-4xl flex justify-end mb-4">
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-3 rounded-full bg-surface shadow-sm border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-all"
          title="Toggle Dark Mode"
        >
          {isDarkMode ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>

      <div className="w-full max-w-4xl glass-card animate-slide-up">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary animate-gradient-x mb-2">
            RC4 Cipher Studio
          </h1>
          <p className="text-[color:var(--text-muted)] text-lg">Secure your messages with stream encryption</p>
        </div>

        <div className="mb-8 p-4 bg-orange-100 dark:bg-orange-900/30 border-l-4 border-orange-500 rounded-r-lg text-orange-800 dark:text-orange-200 text-sm flex items-start flex-col sm:flex-row gap-2 sm:gap-0">
          <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0 hidden sm:block" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
          </svg>
          <p>
            <strong>Security/Educational Note:</strong> RC4 is an outdated and insecure encryption algorithm and is used here for educational purposes only. Do not use for protecting sensitive data.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2 ml-1">Secret Key</label>
              <div className="relative">
                <input 
                  type={showKey ? 'text' : 'password'}
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder="Enter a strong key..."
                  className="input-field pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                  title={showKey ? 'Hide secret key' : 'Show secret key'}
                >
                  {showKey ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-2 ml-1">Text to Process</label>
              <textarea 
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter plaintext to encrypt, or Base64 ciphertext to decrypt..."
                className="input-field h-40 resize-none"
              ></textarea>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => handleProcess('encrypt')}
                disabled={isLoading}
                className="btn-primary flex-1 flex justify-center items-center"
              >
                {isLoading ? <Spinner /> : 'Encrypt'}
              </button>
              <button 
                onClick={() => handleProcess('decrypt')}
                disabled={isLoading}
                className="btn-secondary flex-1 flex justify-center items-center"
              >
                {isLoading ? <Spinner /> : 'Decrypt'}
              </button>
            </div>
            
            <button 
              onClick={handleClear}
              className="text-sm text-[color:var(--text-muted)] hover:text-[color:var(--text-main)] transition-colors w-full text-center"
            >
              Clear All Fields
            </button>
          </div>

          <div className="bg-black/5 dark:bg-black/20 rounded-2xl p-6 border border-black/5 dark:border-white/5 flex flex-col h-full">
            <h3 className="text-lg font-semibold mb-4 mx-1">Output Result</h3>
            
            {error && (
              <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-xl text-sm animate-fade-in border border-red-200 dark:border-red-800 break-words">
                {error}
              </div>
            )}

            <div className="flex-1 relative mb-6">
              <textarea
                readOnly
                value={result}
                placeholder="Result will appear here..."
                className="w-full h-full min-h-[12rem] bg-transparent border-0 focus:ring-0 resize-none text-[color:var(--text-main)] placeholder-[color:var(--text-muted)]"
              ></textarea>
            </div>

            <button 
              onClick={copyToClipboard}
              disabled={!result}
              className={`btn-secondary w-full py-3 flex items-center justify-center gap-2 ${copied ? '!bg-green-500 !text-white !border-green-500' : ''}`}
            >
              {copied ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                  Copy to Clipboard
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

const Spinner = () => (
  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export default App;
