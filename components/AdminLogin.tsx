import React, { useState } from 'react';
import { Lock, ArrowRight, AlertCircle } from 'lucide-react';

interface Props {
  onLogin: (password: string) => boolean;
}

const AdminLogin: React.FC<Props> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onLogin(password);
    if (!success) {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[500px] animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 w-full max-w-md border border-slate-200 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-32 h-32 bg-slate-900 rounded-full opacity-5"></div>
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-32 h-32 bg-red-600 rounded-full opacity-5"></div>

        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-700">
            <Lock size={32} />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">Store Administration</h2>
        <p className="text-center text-slate-500 mb-8">Please sign in to manage department media and settings.</p>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              className={`w-full px-4 py-3 rounded-xl border ${error ? 'border-red-300 bg-red-50 focus:ring-red-200' : 'border-slate-300 bg-slate-50 focus:ring-slate-200'} focus:outline-none focus:ring-4 transition-all`}
              placeholder="Enter admin password"
              autoFocus
            />
            {error && (
              <div className="flex items-center text-red-600 text-sm mt-2 font-medium">
                <AlertCircle size={14} className="mr-1" />
                Incorrect password. Hint: Try 'main123'
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center group"
          >
            Sign In
            <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-400">Restricted Access. Authorized personnel only.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;