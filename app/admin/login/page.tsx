'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Mail, ShieldCheck, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

function AdminLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Validate redirect URL to prevent Open Redirect attacks
  const rawFrom = searchParams.get('from');
  const redirectTarget = rawFrom && rawFrom.startsWith('/admin') && !rawFrom.startsWith('//')
    ? rawFrom
    : '/admin';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Invalid credentials. Please verify and try again.');
      } else {
        router.push(redirectTarget);
        router.refresh();
      }
    } catch {
      setError('A connection error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-forest-900/30 via-stone-950 to-stone-950 pointer-events-none" />

      <div className="relative sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-forest-950/80 text-gold-400 mb-4 border border-gold-500/30 shadow-xl shadow-gold-500/5">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-cream-50 tracking-tight">
          Editorial Console Login
        </h1>
        <p className="mt-1.5 text-xs text-stone-400">
          A.S. Heritage & Living Publishing Platform
        </p>
      </div>

      <div className="relative mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-stone-900/90 backdrop-blur-xl py-8 px-6 shadow-2xl rounded-3xl sm:px-10 border border-stone-800">
          <form className="space-y-5" onSubmit={handleLogin}>
            {error && (
              <div className="p-3.5 bg-red-950/80 border border-red-800/80 rounded-xl text-xs text-red-200 leading-relaxed animate-in fade-in">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="admin-email"
                className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5"
              >
                Administrator Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-3" />
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@asbrandoils.com"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-gold-500 transition-colors shadow-inner"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-500 absolute left-3.5 top-3" />
                <input
                  id="admin-password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-gold-500 transition-colors shadow-inner font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-stone-950 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 transition-all shadow-lg hover:shadow-gold-500/20 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-stone-950" />
                  <span>Verifying Session...</span>
                </>
              ) : (
                <>
                  <span>Sign In To Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-stone-800/80 flex items-center justify-between text-[11px] text-stone-500">
            <Link href="/" className="hover:text-gold-400 transition-colors">
              ← Return to Public Magazine
            </Link>
            <span>Authorized Personnel Only</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-stone-950 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-gold-500" />
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
