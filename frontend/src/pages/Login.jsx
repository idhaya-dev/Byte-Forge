import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

export const Login = () => {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Active Role Tab Selector: 'Student', 'Faculty', 'HOD'
  const [activeRole, setActiveRole] = useState('Student');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});



  const validate = () => {
    const errors = {};
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

    if (!email) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validate()) return;

    setLoading(true);
    try {
      const loggedUser = await login(email, password);
      
      if (loggedUser) {
        // Strict role validation match
        if (loggedUser.role === activeRole) {
          if (activeRole === 'Student') navigate('/student/dashboard');
          else if (activeRole === 'Faculty') navigate('/faculty/dashboard');
          else if (activeRole === 'HOD') navigate('/hod/dashboard');
        } else {
          // Log out immediately if role mismatch
          setError(`Access denied. The authenticated account is registered as a ${loggedUser.role}, not a ${activeRole}.`);
        }
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Theme configuration based on active role (Light mode optimized)
  const getTheme = () => {
    switch (activeRole) {
      case 'Faculty':
        return {
          brand: 'from-violet-600 to-violet-500',
          accent: 'text-violet-600',
          ring: 'focus:ring-violet-500/50 focus:border-violet-500/80',
          buttonBg: 'from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-violet-500/10',
          tabActive: 'bg-white text-violet-600 border-slate-200 shadow-sm'
        };
      case 'HOD':
        return {
          brand: 'from-emerald-600 to-teal-500',
          accent: 'text-emerald-600',
          ring: 'focus:ring-emerald-500/50 focus:border-emerald-500/80',
          buttonBg: 'from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-500/10',
          tabActive: 'bg-white text-emerald-600 border-slate-200 shadow-sm'
        };
      case 'Student':
      default:
        return {
          brand: 'from-blue-600 to-indigo-500',
          accent: 'text-blue-600',
          ring: 'focus:ring-blue-500/50 focus:border-blue-500/80',
          buttonBg: 'from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-600 shadow-blue-500/10',
          tabActive: 'bg-white text-blue-600 border-slate-200 shadow-sm'
        };
    }
  };

  const theme = getTheme();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Decorative subtle background orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-slate-100 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-slate-100 rounded-full blur-3xl -z-10"></div>

      {/* Main Container */}
      <div className="w-full max-w-md relative z-10">
        {/* Logo Section */}
        <div className="text-center mb-6">
          <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr ${theme.brand} text-white font-black text-2xl shadow-lg mb-4 transition duration-300`}>
            360
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-800 mb-1">
            Academic 360°
          </h1>
          <p className="text-xxs font-bold tracking-widest text-slate-400 uppercase">
            Unified Portal Authentication
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-xl">
          {/* Role Tab Selector */}
          <div className="flex gap-1.5 p-1 bg-slate-100 border border-slate-200 rounded-xl mb-6">
            {['Student', 'Faculty', 'HOD'].map((role) => {
              const isActive = activeRole === role;
              return (
                <button
                  type="button"
                  key={role}
                  onClick={() => {
                    setActiveRole(role);
                    setError('');
                    setFieldErrors({});
                  }}
                  className={`
                    flex-1 py-2 text-center rounded-lg text-xs font-bold transition duration-200 border
                    ${isActive
                      ? theme.tabActive
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                    }
                  `}
                >
                  {role}
                </button>
              );
            })}
          </div>

          <h2 className="text-lg font-bold text-slate-800 mb-5">Sign In to Workspace</h2>

          {error && (
            <div className="mb-5 p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-sm flex gap-2.5 items-start">
              <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-slate-550 uppercase tracking-wider mb-2 text-slate-500">
                {activeRole} Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: '' });
                  }}
                  placeholder={`${activeRole.toLowerCase()}@university.edu`}
                  className={`
                    w-full pl-11 pr-4 py-3 bg-white border rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 transition text-sm
                    ${fieldErrors.email ? 'border-rose-450 ring-2 ring-rose-500/10' : `border-slate-200 hover:border-slate-350 ${theme.ring}`}
                  `}
                />
              </div>
              {fieldErrors.email && (
                <p className="mt-1.5 text-xs text-rose-500 font-medium">{fieldErrors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-xs font-bold text-slate-550 uppercase tracking-wider mb-2 text-slate-500">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: '' });
                  }}
                  placeholder="••••••••"
                  className={`
                    w-full pl-11 pr-4 py-3 bg-white border rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 transition text-sm
                    ${fieldErrors.password ? 'border-rose-450 ring-2 ring-rose-500/10' : `border-slate-200 hover:border-slate-350 ${theme.ring}`}
                  `}
                />
              </div>
              {fieldErrors.password && (
                <p className="mt-1.5 text-xs text-rose-500 font-medium">{fieldErrors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full mt-2 py-3 px-4 bg-gradient-to-r ${theme.buttonBg} text-white font-bold rounded-xl active:translate-y-px transition duration-300 flex justify-center items-center gap-2`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In as {activeRole}</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Student Sign Up link */}
          {activeRole === 'Student' && (
            <div className="mt-6 text-center text-xs">
              <span className="text-slate-500">New Student? </span>
              <Link to="/register" className={`font-bold transition hover:underline ${theme.accent}`}>
                Create Student Account &rarr;
              </Link>
            </div>
          )}
        </div>

        {/* Technical Notice */}
        <div className="mt-8 text-center text-xs text-slate-400">
          <p>Protected by cryptographic double-audit logging.</p>
        </div>
      </div>
    </div>
  );
};
