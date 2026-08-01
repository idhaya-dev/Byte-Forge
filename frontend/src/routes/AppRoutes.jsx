import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

// Route protection component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/forbidden" replace />;
  }

  return children;
};

// Placeholder Components (as requested: "Do not generate application pages yet")
const LoginPlaceholder = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white">
    <h2 className="text-3xl font-bold mb-4 text-brand-400">Academic 360° Appraisal</h2>
    <p className="text-slate-400 mb-6">Login Page (Placeholder)</p>
  </div>
);

const RegisterPlaceholder = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white">
    <h2 className="text-3xl font-bold mb-4 text-brand-400">Academic 360° Appraisal</h2>
    <p className="text-slate-400 mb-6">Register Page (Placeholder)</p>
  </div>
);

const DashboardPlaceholder = () => {
  const { user, logout } = useAuth();
  return (
    <div className="p-8 min-h-screen bg-slate-900 text-white">
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold">Faculty Appraisal Dashboard</h1>
          <p className="text-slate-400">Welcome back, {user?.name} ({user?.role})</p>
        </div>
        <button 
          onClick={logout}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded transition"
        >
          Logout
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-slate-800 rounded-lg border border-slate-700">
          <h3 className="font-semibold text-lg mb-2">Self Appraisal</h3>
          <p className="text-slate-400 mb-4">Complete and submit your self evaluation form.</p>
          <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">Pending</span>
        </div>
        <div className="p-6 bg-slate-800 rounded-lg border border-slate-700">
          <h3 className="font-semibold text-lg mb-2">Peer Evaluations</h3>
          <p className="text-slate-400 mb-4">Provide anonymous review for your fellow department peers.</p>
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-500/20 text-slate-400 border border-slate-500/30">0 Pending</span>
        </div>
        <div className="p-6 bg-slate-800 rounded-lg border border-slate-700">
          <h3 className="font-semibold text-lg mb-2">HOD Sign-Off</h3>
          <p className="text-slate-400 mb-4">Track progress of your department head appraisal evaluation.</p>
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-500/20 text-slate-400 border border-slate-500/30">Locked</span>
        </div>
      </div>
    </div>
  );
};

const ForbiddenPlaceholder = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white">
    <h1 className="text-6xl font-extrabold text-rose-500 mb-4">403</h1>
    <h2 className="text-2xl font-semibold mb-2">Access Denied</h2>
    <p className="text-slate-400">You do not have permission to access this page.</p>
  </div>
);

const NotFoundPlaceholder = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white">
    <h1 className="text-6xl font-extrabold text-brand-500 mb-4">404</h1>
    <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
    <p className="text-slate-400">The requested page could not be found.</p>
  </div>
);

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPlaceholder />} />
      <Route path="/register" element={<RegisterPlaceholder />} />
      <Route path="/forbidden" element={<ForbiddenPlaceholder />} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPlaceholder />
          </ProtectedRoute>
        }
      />

      {/* Redirects */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFoundPlaceholder />} />
    </Routes>
  );
};
