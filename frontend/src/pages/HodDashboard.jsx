import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { hodService } from '../services/hodService.js';

export const HodDashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState({
    totalFaculty: 0,
    pendingReviews: 0,
    completedReviews: 0,
    publicationsTotal: 0,
    avgOverallScore: 0,
    avgStudentFeedback: 4.0,
  });
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [analyticsRes, facultyRes] = await Promise.all([
          hodService.getDepartmentAnalytics(),
          hodService.getDepartmentFaculty(),
        ]);

        if (analyticsRes?.success) {
          setAnalytics(analyticsRes.analytics);
        }

        if (facultyRes?.success) {
          setFaculties(facultyRes.faculties || []);
        }
      } catch (err) {
        console.error('Error loading HOD dashboard data:', err);
        setError('Could not retrieve department records.');
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
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500"></div>
          <p className="text-sm text-slate-500">Loading department statistics...</p>
        </div>
      </div>
    );
  }

  // Filter pending appraisals: status is Submitted By Faculty or Under Review By HOD
  const pendingFacultyReviews = faculties.filter(
    (f) => f.appraisalStatus === 'Submitted By Faculty' || f.appraisalStatus === 'Under Review By HOD'
  );

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50/30 to-emerald-50 border border-slate-200 p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-emerald-600/10 to-transparent blur-2xl pointer-events-none"></div>
        <div className="relative z-10 space-y-2">
          <div className="inline-block px-3 py-1 rounded-full text-xxs font-bold uppercase tracking-wider text-emerald-450 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
            Administrative Control Panel
          </div>
          <h1 className="text-3xl font-black text-slate-850">
            Welcome, {user?.name || 'Department Head'}
          </h1>
          <p className="text-slate-500 max-w-xl text-sm leading-relaxed">
            Manage your department faculty roster, review annual appraisal sheets, grade achievements, and monitor department-wide student feedbacks and publications.
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

      {/* Analytics Counts Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Faculty */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Total Faculty</p>
              <h3 className="text-3xl font-extrabold text-slate-850">{analytics.totalFaculty}</h3>
            </div>
            <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <p className="text-xxs text-slate-500 mt-4">Active in department</p>
        </div>

        {/* Pending Reviews */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Pending Reviews</p>
              <h3 className="text-3xl font-extrabold text-slate-850">{analytics.pendingReviews}</h3>
            </div>
            <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-xxs text-slate-500 mt-4">Awaiting HOD ratings</p>
        </div>

        {/* Completed Appraisals */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Finalized Reviews</p>
              <h3 className="text-3xl font-extrabold text-slate-850">{analytics.completedReviews}</h3>
            </div>
            <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-xxs text-slate-500 mt-4">Overall scores finalized</p>
        </div>

        {/* Avg Overall Score */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Avg Score (KPI)</p>
              <h3 className="text-3xl font-extrabold text-slate-850">{analytics.avgOverallScore}%</h3>
            </div>
            <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <p className="text-xxs text-slate-500 mt-4">Out of 100 points scale</p>
        </div>
      </div>

      {/* Main Grid: Pending Appraisals & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pending Reviews Table */}
        <div className="lg:col-span-2 bg-white border border-slate-200 p-6 rounded-2xl shadow-lg flex flex-col justify-between overflow-hidden">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-850">Pending Appraisals Evaluation</h3>
              <span className="text-xxs font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Action Required ({pendingFacultyReviews.length})
              </span>
            </div>

            {pendingFacultyReviews.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-sm">
                <svg className="w-12 h-12 mx-auto mb-2 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                All submitted appraisals in your department have been reviewed!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                      <th className="py-3 pr-4">Faculty Member</th>
                      <th className="py-3 px-4">Designation</th>
                      <th className="py-3 px-4">Self Rating</th>
                      <th className="py-3 pl-4 text-right">Review</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40 text-sm text-slate-650">
                    {pendingFacultyReviews.map((faculty) => (
                      <tr key={faculty._id} className="hover:bg-slate-50/20 transition">
                        <td className="py-3 pr-4 font-semibold text-slate-800">
                          {faculty.name}
                        </td>
                        <td className="py-3 px-4 text-xs text-slate-500">{faculty.designation}</td>
                        <td className="py-3 px-4 text-xs font-semibold text-emerald-600">
                          {faculty.selfRating ? `${faculty.selfRating} / 5 ★` : 'N/A'}
                        </td>
                        <td className="py-3 pl-4 text-right">
                          <Link
                            to={`/hod/faculty/${faculty._id}`}
                            className="inline-block py-1.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xxs font-bold rounded-lg border border-emerald-200 transition"
                          >
                            Evaluate
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Quick Utilities sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Department Analytics Quick Card */}
          <div className="bg-gradient-to-tr from-emerald-50 via-teal-50/30 to-emerald-50 border border-slate-200 p-6 rounded-2xl shadow-lg space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm uppercase tracking-wider">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
                </svg>
                <span>Department Analytics</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Review overall department publications statistics, training certificate aggregates, and student appraisal rating profiles.
              </p>
            </div>
            <Link
              to="/hod/analytics"
              className="block w-full text-center py-2.5 bg-emerald-100/50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 hover:border-emerald-300 rounded-xl text-xs font-bold transition"
            >
              Analyze Department Metrics
            </Link>
          </div>

          {/* Quick Roster Links */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-lg space-y-4">
            <h4 className="font-bold text-sm text-slate-850">Academic Roster</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              View designations, current evaluation tracks, and publication points for all instructors in your department.
            </p>
            <Link to="/hod/faculty" className="text-xs font-bold text-emerald-450 hover:text-emerald-400 flex items-center gap-1 transition">
              Manage Faculty Roster
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
