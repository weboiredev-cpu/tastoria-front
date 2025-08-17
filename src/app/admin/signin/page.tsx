'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { toast } from 'react-toastify';

export default function AdminSignIn() {
  // Prevent scrolling when this page is mounted
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [shake, setShake] = useState(false);
  const router = useRouter();

  const validateForm = useCallback(() => {
    const newErrors: { email?: string; password?: string } = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleInputChange = useCallback((field: 'email' | 'password', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    setIsLoading(true);
    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
        callbackUrl: '/admin/dashboard'
      });
      if (result?.error) {
        toast.error('Invalid email or password. Please try again.');
        setErrors({ password: 'Invalid credentials' });
        setShake(true);
        setTimeout(() => setShake(false), 500);
      } else if (result?.ok) {
        toast.success('Sign in successful! Redirecting...');
        router.push('/admin/dashboard');
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [formData, validateForm, router]);

  const handleForgotPassword = useCallback(() => {
    toast.info('Please contact your system administrator for password reset.');
  }, []);

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 z-0 animate-gradient-x bg-gradient-to-br from-blue-200 via-indigo-100 to-purple-200 bg-[length:200%_200%]" />
      <div className="relative z-10 w-full max-w-md">
        {/* Main Card */}
        <div className={`bg-white/70 backdrop-blur-2xl rounded-2xl border border-blue-200/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] overflow-hidden transition-shadow duration-300 ${shake ? 'animate-shake' : ''}`}> 
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 text-center">
            <div className="w-16 h-16 bg-white/80 rounded-xl mx-auto mb-4 flex items-center justify-center shadow-lg">
              <img 
                src="/image/Tastoria.jpg" 
                alt="Tastoria Logo" 
                className="w-12 h-12 rounded-lg object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="hidden w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <AdminIcon />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-1 drop-shadow-lg">
              Admin Portal
            </h1>
            <p className="text-blue-100 text-sm">
              Tastoria Management System
            </p>
          </div>
          {/* Form Section */}
          <div className="p-8">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-600 text-sm">
                Please sign in to your admin account
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {/* Email Field */}
              <div>
                <label 
                  htmlFor="email" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.email 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-300 bg-gray-50 focus:bg-white hover:shadow-md'
                    }`}
                    placeholder="admin@tastoria.com"
                    autoComplete="email"
                    disabled={isLoading}
                  />
                  <div className="absolute right-3 top-3.5">
                    <EmailIcon className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 flex items-center animate-shake">
                    <AlertIcon className="w-4 h-4 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>
              {/* Password Field */}
              <div>
                <label 
                  htmlFor="password" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 ${
                      errors.password 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-300 bg-gray-50 focus:bg-white hover:shadow-md'
                    }`}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-blue-500 transition-colors"
                    tabIndex={-1}
                    disabled={isLoading}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 flex items-center animate-shake">
                    <AlertIcon className="w-4 h-4 mr-1" />
                    {errors.password}
                  </p>
                )}
              </div>
              {/* Forgot Password */}
              {/*
              <div className="text-right">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-blue-600 hover:text-blue-700 focus:outline-none focus:underline transition-colors"
                  disabled={isLoading}
                >
                  Forgot your password?
                </button>
              </div>
              */}
              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-95 shadow-lg hover:shadow-xl'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <LoadingSpinner />
                    <span className="ml-2">Signing In...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <LockIcon className="w-5 h-5 mr-2" />
                    Sign In
                  </div>
                )}
              </button>
            </form>
          </div>
        </div>
        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Tastoria. All rights reserved.
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Secure admin access powered by Next.js
          </p>
        </div>
      </div>
      {/* Custom CSS for animation */}
      <style jsx global>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 8s ease-in-out infinite;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-8px); }
          40%, 80% { transform: translateX(8px); }
        }
        .animate-shake {
          animation: shake 0.5s;
        }
      `}</style>
    </div>
  );
}

// Icon Components
function AdminIcon() {
  return (
    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
    </svg>
  );
}

function EmailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.967 9.967 0 012.114-3.053m1.666-1.644A9.953 9.953 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.97 9.97 0 01-4.43 5.522M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
    </svg>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );
}

function AlertIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
  );
}

function LoadingSpinner() {
  return (
    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
