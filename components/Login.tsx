
import React, { useState } from 'react';
import { ShieldCheck, Lock, User, AlertCircle, Info } from 'lucide-react';
import { loginToBackend } from '../services/cyberService';

interface LoginProps {
  onLogin: (username: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await loginToBackend({ username, password });
      
      if (response.success) {
        onLogin(username);
      } else {
        setError(response.detail || 'Invalid credentials. Please use the demo login provided.');
        setIsLoading(false);
      }
    } catch (err) {
      setError('Connection error. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-full mb-2 border border-blue-500/20">
            <ShieldCheck className="w-8 h-8 text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">CyberShield Access</h1>
          <p className="text-slate-400 text-sm">Enterprise Security Platform</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="flex items-center gap-2 p-3 text-sm bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">Identity</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all placeholder:text-slate-600"
                placeholder="Enter username"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all placeholder:text-slate-600"
                placeholder="Enter password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : 'Establish Connection'}
          </button>
        </form>

        <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-blue-400 mb-1">
            <Info className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Audit Credentials</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <p className="text-slate-500">Username</p>
              <p className="text-slate-200 mono">Analyst</p>
            </div>
            <div>
              <p className="text-slate-500">Password</p>
              <p className="text-slate-200 mono">cyber-demo-2024</p>
            </div>
          </div>
        </div>

        <div className="text-center pt-4 border-t border-slate-800">
          <p className="text-xs text-slate-500">
            Internal use only. Active auditing is compliant with NIST 800-63B.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
