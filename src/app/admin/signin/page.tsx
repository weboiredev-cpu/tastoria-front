'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { toast } from 'react-toastify';

export default function AdminSignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
      callbackUrl: '/admin/dashboard'
    });

    if (result?.error) {
      toast.error("Invalid credentials");
    } else if (result?.ok) {
      toast.success("Login successful!");
      router.push('/admin/dashboard');
    }
    setLoading(false);
  }, [email, password, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-100 to-blue-200 flex items-center justify-center px-4">
      <div className="w-full max-w-xl p-10 rounded-3xl shadow-2xl bg-white border border-gray-200 animate-fadeIn">

        <div className="flex flex-col items-center mb-6">
          <img src="/image/Tastoria.jpg" alt="Logo" className="w-28 h-auto rounded-xl mb-3" />
          <h2 className="text-3xl font-bold text-gray-800 mb-1">
            Tastoria <span className="text-blue-500">Admin</span>
          </h2>
          <p className="text-sm text-gray-600">Welcome back! Please sign in.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 bg-white/95"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@tastoria.com"
              autoComplete="username"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 bg-white/95"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword(prev => !prev)}
              className="absolute right-3 top-[38px] text-gray-400 hover:text-blue-500 transition"
            >
              {showPassword ? (
                <EyeOpenIcon />
              ) : (
                <EyeClosedIcon />
              )}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-2.5 rounded-lg shadow-lg hover:scale-105 transition-all duration-150`}
          >
           {loading ? (
    <>
      <SpinnerIcon />
      Signing In...
    </>
  ) : (
    'Sign In'
  )}
</button>
        </form>

        <div className="pt-5 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} Tastoria — All rights reserved.
        </div>
      </div>
    </div>
  );
}

// 👁️ Eye Icons as components (no unnecessary duplication)
function EyeOpenIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

function EyeClosedIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.967 9.967 0 012.114-3.053m1.666-1.644A9.953 9.953 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.97 9.97 0 01-4.43 5.522M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
    </svg>
  );
}
function SpinnerIcon() {
  return (
    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
      <circle
        className="opacity-25"
        cx="12" cy="12" r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
      />
    </svg>
  );
}

