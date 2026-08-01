import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { appraisalService } from '../services/appraisalService.js';

export const FacultyLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [appraisalStatus, setAppraisalStatus] = useState('Pending HOD Review');
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [kpiDropdownOpen, setKpiDropdownOpen] = useState(
    ['/faculty/certificates', '/faculty/books', '/faculty/events', '/faculty/papers'].includes(location.pathname)
  );

  useEffect(() => {
    const fetchAppraisalStatus = async () => {
      try {
        const res = await appraisalService.getAppraisals();
        if (res?.success && res.appraisals?.length > 0) {
          const current = res.appraisals.find(a => a.academicYear === '2026-2027');
          if (current) {
            setAppraisalStatus(current.status);
          }
        }
      } catch (err) {
        console.error('Error loading appraisal status in layout:', err);
      }
    };
    fetchAppraisalStatus();
  }, []);

  const isHodCompleted = appraisalStatus === 'Completed' || appraisalStatus === 'Approved by HOD';

  const handleAiInsightsClick = (e) => {
    setMobileMenuOpen(false);
    if (!isHodCompleted) {
      e.preventDefault();
      setShowPendingModal(true);
    }
  };

  const mainNavigation = [
    {
      name: 'Dashboard',
      path: '/faculty/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      name: 'Work Report',
      path: '/faculty/appraisal',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
  ];

  const kpiSubItems = [
    {
      name: 'Research Papers',
      path: '/faculty/papers',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      name: 'Books Published',
      path: '/faculty/books',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      name: 'Certificates',
      path: '/faculty/certificates',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
    },
    {
      name: 'Events',
      path: '/faculty/events',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="h-screen overflow-hidden bg-slate-50 text-slate-800 flex flex-col md:flex-row font-sans relative">
      {/* Pending HOD Approval Popup Modal */}
      {showPendingModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-500 to-orange-500"></div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 border border-amber-500/20 shadow-inner">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>

              <div className="space-y-1">
                <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-amber-600 bg-amber-100 px-2 py-0.5 rounded border border-amber-200">
                  Feature Restricted
                </span>
                <h3 className="text-lg font-black text-slate-850">
                  Pending HOD Approval
                </h3>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              The AI Academic Insights feature is currently unavailable because your performance appraisal review is pending overall evaluation and comments from your Head of Department (HOD).
            </p>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex justify-between items-center">
              <span className="font-semibold text-slate-500">Current HOD Status:</span>
              <span className="font-extrabold text-amber-600 bg-amber-100/60 px-2.5 py-0.5 rounded border border-amber-200">
                ⏳ {appraisalStatus}
              </span>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowPendingModal(false);
                  navigate('/faculty/dashboard');
                }}
                className="w-full py-2.5 bg-black hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition shadow-md active:translate-y-px"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between bg-white border-b border-slate-200 p-4 sticky top-0 z-50 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-fuchsia-500 flex items-center justify-center font-bold text-white shadow-md">
            360
          </div>
          <span className="font-bold text-lg tracking-wider text-slate-800">Academic 360</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-slate-500 hover:text-slate-850 focus:outline-none transition p-1 rounded-md hover:bg-slate-100"
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
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-violet-600 to-fuchsia-500 flex items-center justify-center font-extrabold text-white shadow-md">
                360
              </div>
              <div>
                <span className="font-black text-xl tracking-wider text-slate-800">Academic 360</span>
                <p className="text-xxs text-violet-600 font-bold tracking-widest uppercase">Faculty</p>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="px-4 py-6 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)]">
              {/* Dashboard & Work Report */}
              {mainNavigation.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-250
                      ${isActive
                        ? 'bg-violet-600 text-white shadow-md shadow-violet-500/10'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }
                    `}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                );
              })}

              {/* KPI Report Accordion Dropdown */}
              <div>
                <button
                  type="button"
                  onClick={() => setKpiDropdownOpen(!kpiDropdownOpen)}
                  className={`
                    w-full flex items-center justify-between px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-250
                    ${kpiSubItems.some(sub => location.pathname === sub.path)
                      ? 'bg-violet-50 text-violet-700 font-bold border border-violet-200'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <span>KPI Report</span>
                  </div>
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${kpiDropdownOpen ? 'rotate-180 text-violet-600' : 'text-slate-400'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* KPI Sub-Items Dropdown */}
                {kpiDropdownOpen && (
                  <div className="mt-1 ml-4 pl-3 border-l-2 border-violet-100 space-y-1">
                    {kpiSubItems.map((sub) => {
                      const isSubActive = location.pathname === sub.path;
                      return (
                        <Link
                          key={sub.name}
                          to={sub.path}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`
                            flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium text-xs transition-all duration-200
                            ${isSubActive
                              ? 'bg-violet-600 text-white shadow-sm font-bold'
                              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            }
                          `}
                        >
                          {sub.icon}
                          <span>{sub.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* AI Insights Link */}
              <Link
                to="/faculty/insights"
                onClick={handleAiInsightsClick}
                className={`
                  flex items-center justify-between px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-250
                  ${location.pathname === '/faculty/insights'
                    ? 'bg-violet-600 text-white shadow-md shadow-violet-500/10'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <span>AI Insights</span>
                </div>
                {!isHodCompleted && (
                  <span className="text-[9px] font-bold text-amber-700 bg-amber-100 border border-amber-200 px-1.5 py-0.5 rounded">
                    🔒
                  </span>
                )}
              </Link>
            </nav>
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3 mb-4 px-2">
              <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold text-violet-600 shadow-sm shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'F'}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-slate-800 truncate">{user?.name || 'Faculty Member'}</p>
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
          &copy; {new Date().getFullYear()} Academic 360° Instructor Appraisal Workspace. All activities undergo dual verification audits.
        </footer>
      </main>
    </div>
  );
};
