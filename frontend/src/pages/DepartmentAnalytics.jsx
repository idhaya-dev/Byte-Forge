import React, { useEffect, useState } from 'react';
import { hodService } from '../services/hodService.js';

export const DepartmentAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    totalFaculty: 0,
    pendingReviews: 0,
    completedReviews: 0,
    publicationsTotal: 0,
    booksTotal: 0,
    certificatesTotal: 0,
    eventsTotal: 0,
    avgOverallScore: 0,
    avgStudentFeedback: 4.0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await hodService.getDepartmentAnalytics();
      if (response?.success) {
        setAnalytics(response.analytics);
      }
    } catch (err) {
      console.error('Error fetching department analytics:', err);
      setError('Failed to fetch analytics metrics.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  const kpis = [
    { name: 'Research Publications Coordinated', count: analytics.publicationsTotal, color: 'bg-violet-500' },
    { name: 'Academic Books Published', count: analytics.booksTotal, color: 'bg-fuchsia-500' },
    { name: 'Faculty Development Certificates', count: analytics.certificatesTotal, color: 'bg-emerald-500' },
    { name: 'Syllabus Events Coordinated', count: analytics.eventsTotal, color: 'bg-amber-500' },
  ];

  return (
    <div className="space-y-8 font-sans max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white">Department Analytics</h1>
        <p className="text-sm text-slate-400">Identify performance metrics and publication aggregates for your department.</p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-455 text-sm">
          {error}
        </div>
      )}

      {/* Overview Aggregates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl shadow flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Average KPI Score</p>
            <h3 className="text-3xl font-black text-white">{analytics.avgOverallScore}%</h3>
          </div>
          <span className="text-xxs px-2.5 py-1 bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 rounded-full font-bold">
            Target 75%+
          </span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl shadow flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Student Feedback Avg</p>
            <h3 className="text-3xl font-black text-white">{analytics.avgStudentFeedback} / 5.0</h3>
          </div>
          <span className="text-xxs px-2.5 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full font-bold">
            CS Standard
          </span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl shadow flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Appraisal Progress</p>
            <h3 className="text-3xl font-black text-white">
              {analytics.completedReviews} / {analytics.totalFaculty}
            </h3>
          </div>
          <span className="text-xxs px-2.5 py-1 bg-amber-500/10 text-amber-450 border border-amber-500/20 rounded-full font-bold">
            Reviewed
          </span>
        </div>
      </div>

      {/* Logged Activities Summary Progress */}
      <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl shadow-lg space-y-6">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-800">
          Department Activity Targets Progress
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {kpis.map((kpi) => (
            <div key={kpi.name} className="p-4 bg-slate-950/30 border border-slate-850 rounded-xl space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-300">{kpi.name}</span>
                <span className="font-bold text-white text-sm">{kpi.count}</span>
              </div>
              <div className="w-full h-2.5 bg-slate-950 border border-slate-850 rounded-full overflow-hidden">
                <div
                  className={`h-full ${kpi.color} rounded-full transition-all duration-300`}
                  style={{ width: `${Math.min((kpi.count / 25) * 100, 100)}%` }}
                ></div>
              </div>
              <p className="text-[9px] text-slate-550 text-slate-500">
                Department Capacity Benchmark: 25 items target (Progress: {Math.round(Math.min((kpi.count / 25) * 100, 100))}%).
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
