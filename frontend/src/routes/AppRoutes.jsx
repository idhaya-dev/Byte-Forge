import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

// Import Layouts and Pages for Student module
import { StudentLayout } from '../layouts/StudentLayout.jsx';
import { StudentLogin } from '../pages/StudentLogin.jsx';
import { StudentRegister } from '../pages/StudentRegister.jsx';
import { StudentDashboard } from '../pages/StudentDashboard.jsx';
import { GiveFeedback } from '../pages/GiveFeedback.jsx';
import { FeedbackHistory } from '../pages/FeedbackHistory.jsx';
import { StudentAnnouncements } from '../pages/StudentAnnouncements.jsx';

// Route protection component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-white">
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

// Placeholder Components (remained clean, no HOD or Faculty code generated)

const ForbiddenPlaceholder = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white">
    <h1 className="text-6xl font-extrabold text-rose-500 mb-4 font-sans">403</h1>
    <h2 className="text-2xl font-semibold mb-2 font-sans">Access Denied</h2>
    <p className="text-slate-400 font-sans">You do not have permission to access this page.</p>
  </div>
);

const NotFoundPlaceholder = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white">
    <h1 className="text-6xl font-extrabold text-brand-500 mb-4 font-sans">404</h1>
    <h2 className="text-2xl font-semibold mb-2 font-sans">Page Not Found</h2>
    <p className="text-slate-400 font-sans">The requested page could not be found.</p>
  </div>
);

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<StudentLogin />} />
      <Route path="/register" element={<StudentRegister />} />
      <Route path="/forbidden" element={<ForbiddenPlaceholder />} />

      {/* Student Portal Protected Routes */}
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={['Student']}>
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/student/dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="feedback" element={<GiveFeedback />} />
        <Route path="history" element={<FeedbackHistory />} />
        <Route path="announcements" element={<StudentAnnouncements />} />
      </Route>

      {/* Redirects */}
      <Route path="/" element={<Navigate to="/student/dashboard" replace />} />
      <Route path="*" element={<NotFoundPlaceholder />} />
    </Routes>
  );
};
