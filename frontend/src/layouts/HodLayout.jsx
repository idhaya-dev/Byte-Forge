import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

export const HodLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    {
      name: 'HOD Dashboard',
      path: '/hod/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      name: 'Faculty Management',
      path: '/hod/faculty',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      name: 'Department Analytics',
      path: '/hod/analytics',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
        </svg>
      ),
    },
    {
      name: 'My Self Appraisal',
      path: '/hod/appraisal',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="h-screen overflow-hidden bg-slate-50 text-slate-800 flex flex-col md:flex-row font-sans">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between bg-white border-b border-slate-200 p-4 sticky top-0 z-50 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center font-bold text-white shadow-md">
            360
          </div>
          <span className="font-bold text-lg tracking-wider text-slate-800">Academic 360</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-slate-500 hover:text-slate-800 focus:outline-none transition p-1 rounded-md hover:bg-slate-100"
        >
          {mobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Sidebar - Desktop */}
      <aside className={`
        ${mobileMenuOpen ? 'block' : 'hidden'}
        md:block
        fixed md:static inset-y-0 left-0 z-40
        w-64 bg-white border-r border-slate-200 flex flex-col justify-between
        transition-all duration-300 h-full shrink-0
      `}>
        <div className="flex flex-col h-full justify-between">
          <div>
            {/* Logo */}
            <div className="hidden md:flex items-center gap-3 px-6 py-6 border-b border-slate-100">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center font-extrabold text-white shadow-md">
                360
              </div>
              <div>
                <span className="font-black text-xl tracking-wider text-slate-800">Academic 360</span>
                <p className="text-xxs text-emerald-600 font-bold tracking-widest uppercase">Head of Department</p>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="px-4 py-6 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)]">
              {navigation.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-250
                      ${isActive
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/10'
                        : 'text-slate-650 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }
                    `}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3 mb-4 px-2">
              <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold text-emerald-600 shadow-sm shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'H'}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-slate-800 truncate">{user?.name || 'HOD Member'}</p>
                <p className="text-xs text-slate-400 truncate">{user?.department || 'Computer Science'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg border border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-slate-500 font-bold text-sm transition duration-200"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto flex flex-col">
        {/* Content Body */}
        <div className="flex-1 p-6 md:p-8 bg-slate-50/30">
          <Outlet />
        </div>

        {/* Footer */}
        <footer className="py-4 px-8 border-t border-slate-200 bg-white text-center text-xs text-slate-400 shrink-0">
          &copy; {new Date().getFullYear()} Academic 360° Department Appraisal Management Console.
        </footer>
      </main>
    </div>
  );
};
