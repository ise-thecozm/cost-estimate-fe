import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { estimatorApi } from '../services/estimatorApi';
import { Lock, User, Loader2, AlertCircle } from 'lucide-react';
import { COLORS } from '../constants';

const LoginScreen: React.FC = () => {
  const { setToken } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await estimatorApi.login({ username, password });
      setToken(response.token, {
        username: response.username,
        email: response.email,
      });
      // Token and user info are automatically stored in localStorage by AuthContext
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Login failed. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#EDF5FF] to-white p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-[#EEEEEE] p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#40AEBC] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Lock className="text-white" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-[#181C31] mb-2">Cost Estimation Module</h1>
            <p className="text-[#83849E] text-sm">Sign in to access the application</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <div className="flex-1">
                <p className="text-red-800 font-semibold text-sm">Login Failed</p>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-[#181C31] mb-2">
                Username
              </label>
              <div className="relative">
                <User
                  className="absolute left-3 top-[50%] -translate-y-[25%] text-[#83849E]"
                  size={18}
                />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-3 border border-[#EEEEEE] rounded-lg text-[#181C31] text-sm focus:ring-2 focus:ring-[#40AEBC] focus:border-[#40AEBC] outline-none transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-[#181C31] mb-2">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-[50%] -translate-y-[25%] text-[#83849E]"
                  size={18}
                />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-3 border border-[#EEEEEE] rounded-lg text-[#181C31] text-sm focus:ring-2 focus:ring-[#40AEBC] focus:border-[#40AEBC] outline-none transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !username || !password}
              className="w-full py-3 px-6 bg-[#40AEBC] text-white font-bold rounded-lg shadow-lg shadow-[#40AEBC]/20 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Signing in...
                </>
              ) : (
                <>
                  <Lock size={18} />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-[#EEEEEE]">
            <p className="text-xs text-center text-[#83849E]">
              Default credentials: <span className="font-semibold text-[#181C31]">admin / admin123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
