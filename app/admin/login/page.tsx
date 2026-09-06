'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ShieldCheck, Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('admin@asbrandoils.com');
  const [password, setPassword] = useState('admin_asbrandoils_2026');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to login');
      } else {
        router.push('/admin');
        router.refresh();
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-forest-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gold-500/20 text-gold-400 mb-3 border border-gold-500/30">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-cream-50">
          Editorial CMS Access
        </h2>
        <p className="mt-2 text-xs text-stone-400">
          A.S. Heritage & Living Publishing Platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-forest-900/60 backdrop-blur-md py-8 px-6 shadow-2xl rounded-3xl sm:px-10 border border-forest-800">
          <form className="space-y-5" onSubmit={handleLogin}>
            {error && (
              <div className="p-3 bg-red-950/80 border border-red-800/80 rounded-xl text-xs text-red-200">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 bg-forest-950/80 border border-forest-800 rounded-xl text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1">
                Security Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 bg-forest-950/80 border border-forest-800 rounded-xl text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-forest-950 bg-gold-500 hover:bg-gold-400 transition-colors shadow-lg hover:shadow-gold-500/20 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-forest-950" />
              ) : (
                'Sign In To Dashboard'
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-forest-800/80 text-center">
            <span className="text-[11px] text-stone-400">
              Default Dev Credentials Pre-Filled
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
