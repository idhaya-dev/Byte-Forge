import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { studentService } from '../services/studentService.js';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    submittedCount: 0,
    announcementCount: 0,
    facultyCount: 0,
    pendingReviews: 0,
  });
  const [recentAnnouncements, setRecentAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Load data from all 3 services in parallel
        const [historyRes, announcementsRes, facultiesRes] = await Promise.all([
          studentService.getFeedbackHistory(),
          studentService.getAnnouncements(),
          studentService.getFaculties(),
        ]);

        const submittedCount = historyRes?.count || 0;
        const announcementCount = announcementsRes?.count || 0;
        const facultyCount = facultiesRes?.count || 0;

        // Calculate pending reviews: total faculties - reviewed faculties
        // (Note: in a real system, reviews might be course/subject-specific,
        // but this gives a nice indicator of overall participation)
        const pendingReviews = Math.max(0, facultyCount - submittedCount);

        setStats({
          submittedCount,
          announcementCount,
          facultyCount,
          pendingReviews,
        });

        // Set the top 3 announcements for quick display
        setRecentAnnouncements(announcementsRes?.announcements?.slice(0, 3) || []);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Could not retrieve dashboard metrics. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-500"></div>
          <p className="text-sm text-slate-500">Assembling dashboard metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50/30 to-blue-50 border border-slate-200 p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-brand-600/10 to-transparent blur-2xl pointer-events-none"></div>
        <div className="relative z-10 space-y-2">
          <div className="inline-block px-3 py-1 rounded-full text-xxs font-bold uppercase tracking-wider text-brand-500 bg-brand-500/10 border border-brand-500/20">
            Welcome back
          </div>
          <h1 className="text-3xl font-black text-slate-800">
            Hello, {user?.name || 'Student'}!
          </h1>
          <p className="text-slate-655 text-slate-500 max-w-xl text-sm leading-relaxed">
            Your voice matters. Submit constructive feedback for your course instructors anonymously to help improve academic delivery in the {user?.department || 'University'} department.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex gap-3">
          <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p>{error}</p>
        </div>
      )}

      {/* Grid of Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stat 1 */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 group-hover:h-full transition-all"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Reviews Completed</p>
              <h3 className="text-3xl font-extrabold text-slate-850">{stats.submittedCount}</h3>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-xxs text-emerald-500 font-medium mt-4 flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Submitted securely & anonymously
          </p>
        </div>

        {/* Stat 2 */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-brand-500 group-hover:h-full transition-all"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Available Faculty</p>
              <h3 className="text-3xl font-extrabold text-slate-850">{stats.facultyCount}</h3>
            </div>
            <div className="p-3 bg-brand-500/10 rounded-xl text-brand-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <p className="text-xxs text-slate-500 font-medium mt-4">Listed inside your department</p>
        </div>

        {/* Stat 3 */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-amber-500 group-hover:h-full transition-all"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Pending Submissions</p>
              <h3 className="text-3xl font-extrabold text-slate-850">{stats.pendingReviews}</h3>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
          <p className="text-xxs text-amber-500 font-medium mt-4">Estimated feedback submissions remaining</p>
        </div>

        {/* Stat 4 */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 group-hover:h-full transition-all"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Announcements</p>
              <h3 className="text-3xl font-extrabold text-slate-850">{stats.announcementCount}</h3>
            </div>
            <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
          </div>
          <p className="text-xxs text-slate-500 font-medium mt-4">Targeted to student portal</p>
        </div>
      </div>

      {/* Main Grid: Quick Actions + Recent Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Quick Actions */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-lg space-y-4">
            <h3 className="text-lg font-bold text-slate-850">Quick Tasks</h3>
            <div className="space-y-3">
              <Link
                to="/student/feedback"
                className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 hover:bg-brand-900/10 hover:border-brand-500/30 border border-slate-200 text-slate-650 hover:text-white transition group"
              >
                <div className="p-2.5 bg-brand-500/10 rounded-lg text-brand-400 group-hover:scale-110 transition duration-200">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.246.582 1.817l-3.97 2.884a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.884a1 1 0 00-1.175 0l-3.97 2.884c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.97-2.884c-.779-.571-.38-1.817.582-1.817h4.907a1 1 0 00.95-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div>
                  <span className="font-semibold text-sm">Submit New Feedback</span>
                  <p className="text-xxs text-slate-500">Rate your instructors</p>
                </div>
              </Link>

              <Link
                to="/student/history"
                className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-650 hover:text-white transition group"
              >
                <div className="p-2.5 bg-slate-100 rounded-lg text-slate-500 group-hover:scale-110 transition duration-200">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <span className="font-semibold text-sm">Review Submission Logs</span>
                  <p className="text-xxs text-slate-500">View history of evaluations</p>
                </div>
              </Link>
            </div>
          </div>

          <div className="bg-gradient-to-tr from-brand-950/40 to-slate-900 border border-brand-800/20 p-6 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-brand-500/10 rounded-full blur-xl"></div>
            <h4 className="font-bold text-sm text-brand-400 mb-1.5 uppercase tracking-wider">🔒 Anonymous Guarantee</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Your feedback is divided into separate storage layers. The database logs *when* you submit feedback but holds the ratings & comments in a detached document. No email, name, or student ID is associated with the evaluations.
            </p>
          </div>
        </div>

        {/* Right Column: Recent Announcements */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-lg space-y-6">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-850">Academic Announcements</h3>
              <Link to="/student/announcements" className="text-xs font-semibold text-brand-400 hover:text-brand-300 transition flex items-center gap-1">
                View All
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {recentAnnouncements.length === 0 ? (
              <div className="text-center py-8 text-slate-500 space-y-2">
                <svg className="w-12 h-12 mx-auto text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                </svg>
                <p className="text-sm">No recent announcements found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentAnnouncements.map((ann) => (
                  <div key={ann._id} className="p-4 bg-slate-50/80 border border-slate-200 rounded-xl hover:border-slate-300 transition">
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <h4 className="font-bold text-slate-850 text-sm hover:text-brand-400 transition cursor-pointer">{ann.title}</h4>
                      <span className="text-xxs text-slate-500 whitespace-nowrap">
                        {new Date(ann.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
                      {ann.content}
                    </p>
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-200 text-xxs text-slate-500">
                      <span className="font-medium text-slate-500">{ann.postedBy?.name || 'Administrator'}</span>
                      <span>&bull;</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-700 font-semibold text-slate-500 uppercase tracking-widest text-[9px]">{ann.postedBy?.role || 'Admin'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
