import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Lock, Check } from 'lucide-react';

const AuthTokenInput: React.FC = () => {
  const { token, setToken, isAuthenticated } = useAuth();
  const [inputValue, setInputValue] = useState(token || '');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setToken(inputValue.trim());
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setInputValue('');
  };

  if (isAuthenticated) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Check className="text-green-600" size={20} />
          <div>
            <p className="text-green-800 font-semibold text-sm">Authenticated</p>
            <p className="text-green-700 text-xs">Token is set and active</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-[#EEEEEE] rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <Lock className="text-[#40AEBC]" size={18} />
        <label htmlFor="auth-token" className="text-sm font-semibold text-[#181C31]">
          Authentication Token
        </label>
      </div>
      <div className="flex gap-2">
        <input
          id="auth-token"
          type="password"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter your Bearer token"
          className="flex-1 px-3 py-2 border border-[#EEEEEE] rounded-lg text-sm focus:ring-2 focus:ring-[#40AEBC] focus:border-[#40AEBC] outline-none"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-[#40AEBC] text-white rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          {showSuccess ? 'Saved!' : 'Set Token'}
        </button>
      </div>
      <p className="text-xs text-[#83849E] mt-2">
        All API requests require authentication. Set your Bearer token to continue.
      </p>
    </form>
  );
};

export default AuthTokenInput;
