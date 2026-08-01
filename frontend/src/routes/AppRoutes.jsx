import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

// Import Layouts and Pages for Student module
import { StudentLayout } from '../layouts/StudentLayout.jsx';
import { Login } from '../pages/Login.jsx';
import { StudentRegister } from '../pages/StudentRegister.jsx';
import { StudentDashboard } from '../pages/StudentDashboard.jsx';
import { GiveFeedback } from '../pages/GiveFeedback.jsx';
import { FeedbackHistory } from '../pages/FeedbackHistory.jsx';
import { StudentAnnouncements } from '../pages/StudentAnnouncements.jsx';

// Import Layouts and Pages for Faculty module
import { FacultyLayout } from '../layouts/FacultyLayout.jsx';
import { FacultyDashboard } from '../pages/FacultyDashboard.jsx';
import { SelfAppraisal } from '../pages/SelfAppraisal.jsx';
import { FacultyKPI } from '../pages/FacultyKPI.jsx';
import { ResearchPapers } from '../pages/ResearchPapers.jsx';
import { BooksPublished } from '../pages/BooksPublished.jsx';
import { Certificates } from '../pages/Certificates.jsx';
import { EventsOrganised } from '../pages/EventsOrganised.jsx';
import { AIInsights } from '../pages/AIInsights.jsx';

// Import Layouts and Pages for HOD module
import { HodLayout } from '../layouts/HodLayout.jsx';
import { HodDashboard } from '../pages/HodDashboard.jsx';
import { FacultyManagement } from '../pages/FacultyManagement.jsx';
import { FacultyDetails } from '../pages/FacultyDetails.jsx';
import { DepartmentAnalytics } from '../pages/DepartmentAnalytics.jsx';

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

const HodDashboardPlaceholder = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans p-6 md:p-12 relative overflow-hidden">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '2s' }}></div>

      <header className="flex justify-between items-center pb-6 border-b border-slate-900">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-brand-600 to-emerald-500 flex items-center justify-center font-extrabold text-white shadow-lg shadow-brand-500/25">
            360
          </div>
          <div>
            <span className="font-black text-xl tracking-wider text-white">Academic 360°</span>
            <p className="text-xxs text-emerald-400 font-semibold tracking-widest uppercase">HOD Workspace</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="py-2 px-5 rounded-xl border border-slate-800 hover:border-rose-900/50 hover:bg-rose-950/20 text-slate-400 hover:text-rose-455 transition text-xs font-bold"
        >
          Logout
        </button>
      </header>

      <main className="flex-1 flex flex-col justify-center items-center py-12">
        <div className="max-w-md w-full bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl shadow-2xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400 font-bold text-lg">
            H
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Welcome, {user?.name || 'HOD'}</h2>
            <p className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">
              Department Head of {user?.department || 'Computer Science'}
            </p>
            <p className="text-slate-400 text-sm leading-relaxed pt-2">
              The HOD Appraisal Workspace is currently in design mode. Under mock bypass, you have securely authenticated and reached the dashboard view successfully.
            </p>
          </div>
          <div className="p-4 bg-slate-950/50 border border-slate-850 rounded-xl text-xxs text-slate-500 text-left space-y-1">
            <p className="font-semibold text-slate-400">Authenticated Details:</p>
            <p>Email: {user?.email}</p>
            <p>Authentication State: MOCKED_BYPASS</p>
          </div>
        </div>
      </main>

      <footer className="py-4 border-t border-slate-900 text-center text-xs text-slate-600">
        &copy; {new Date().getFullYear()} Academic 360° HOD Management Portal.
      </footer>
    </div>
  );
};

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/faculty/login" element={<Navigate to="/login" replace />} />
      <Route path="/hod/login" element={<Navigate to="/login" replace />} />
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

      {/* Faculty Portal Protected Routes */}
      <Route
        path="/faculty"
        element={
          <ProtectedRoute allowedRoles={['Faculty']}>
            <FacultyLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/faculty/dashboard" replace />} />
        <Route path="dashboard" element={<FacultyDashboard />} />
        <Route path="appraisal" element={<SelfAppraisal />} />
        <Route path="kpi" element={<FacultyKPI />} />
        <Route path="papers" element={<ResearchPapers />} />
        <Route path="books" element={<BooksPublished />} />
        <Route path="certificates" element={<Certificates />} />
        <Route path="events" element={<EventsOrganised />} />
        <Route path="insights" element={<AIInsights />} />
      </Route>

      {/* HOD Portal Protected Routes */}
      <Route
        path="/hod"
        element={
          <ProtectedRoute allowedRoles={['HOD']}>
            <HodLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/hod/dashboard" replace />} />
        <Route path="dashboard" element={<HodDashboard />} />
        <Route path="faculty" element={<FacultyManagement />} />
        <Route path="faculty/:id" element={<FacultyDetails />} />
        <Route path="analytics" element={<DepartmentAnalytics />} />
        <Route path="appraisal" element={<SelfAppraisal />} />
      </Route>

      {/* Redirects */}
      <Route path="/" element={<Navigate to="/student/dashboard" replace />} />
      <Route path="*" element={<NotFoundPlaceholder />} />
    </Routes>
  );
};
