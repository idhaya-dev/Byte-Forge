import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { facultyService } from '../services/facultyService.js';
import { appraisalService } from '../services/appraisalService.js';

export const FacultyDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    papers: 0,
    books: 0,
    certificates: 0,
    events: 0,
    selfRating: 0,
  });
  const [appraisalInfo, setAppraisalInfo] = useState({
    status: 'No Record',
    academicYear: '2026-2027',
    submitted: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [kpiRes, appraisalsRes] = await Promise.all([
          facultyService.getKPI(),
          appraisalService.getAppraisals(),
        ]);

        if (kpiRes?.success) {
          setStats(kpiRes.counts);
        }

        // Check if there is an appraisal for the standardized session '2026-2027'
        if (appraisalsRes?.success && appraisalsRes.appraisals?.length > 0) {
          const currentAppraisal = appraisalsRes.appraisals.find(
            (app) => app.academicYear === '2026-2027'
          );
          if (currentAppraisal) {
            setAppraisalInfo({
              status: currentAppraisal.status,
              academicYear: currentAppraisal.academicYear,
              submitted: currentAppraisal.selfAppraisal?.submitted || false,
              id: currentAppraisal._id,
            });
          }
        }
      } catch (err) {
        console.error('Error loading faculty dashboard stats:', err);
        setError('Could not retrieve dashboard metrics. Please reload the page.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-violet-500"></div>
          <p className="text-sm text-slate-400">Loading appraisal metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      {/* Welcome Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-violet-950/40 to-slate-900 border border-slate-800/80 p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-violet-600/10 to-transparent blur-2xl pointer-events-none"></div>
        <div className="relative z-10 space-y-2">
          <div className="inline-block px-3 py-1 rounded-full text-xxs font-bold uppercase tracking-wider text-violet-400 bg-violet-500/10 border border-violet-500/20">
            Instructor Workstation
          </div>
          <h1 className="text-3xl font-black text-white">
            Welcome, {user?.name || 'Faculty Member'}
          </h1>
          <p className="text-slate-400 max-w-xl text-sm leading-relaxed">
            Manage your academic profile, log publications, update training certificates, track organized events, and submit your annual self appraisal form.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex gap-3">
          <svg className="w-5 h-5 shrink-0 mt-0.5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p>{error}</p>
        </div>
      )}

      {/* Grid of Counts */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Research Papers */}
        <Link to="/faculty/papers" className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl shadow-lg relative overflow-hidden group hover:border-violet-500/50 hover:bg-slate-900 transition-all duration-200">
          <div className="absolute top-0 left-0 w-1 h-full bg-violet-500"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Research Papers</p>
              <h3 className="text-3xl font-extrabold text-white">{stats.papers}</h3>
            </div>
            <div className="p-2.5 bg-violet-500/10 rounded-xl text-violet-400 group-hover:scale-105 transition">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <p className="text-xxs text-slate-500 mt-4 group-hover:text-violet-400 transition">Manage publications &rarr;</p>
        </Link>

        {/* Books Published */}
        <Link to="/faculty/books" className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl shadow-lg relative overflow-hidden group hover:border-fuchsia-500/50 hover:bg-slate-900 transition-all duration-200">
          <div className="absolute top-0 left-0 w-1 h-full bg-fuchsia-500"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Books Published</p>
              <h3 className="text-3xl font-extrabold text-white">{stats.books}</h3>
            </div>
            <div className="p-2.5 bg-fuchsia-500/10 rounded-xl text-fuchsia-400 group-hover:scale-105 transition">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
          <p className="text-xxs text-slate-500 mt-4 group-hover:text-fuchsia-400 transition">Manage books &rarr;</p>
        </Link>

        {/* Certificates */}
        <Link to="/faculty/certificates" className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl shadow-lg relative overflow-hidden group hover:border-emerald-500/50 hover:bg-slate-900 transition-all duration-200">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Certifications</p>
              <h3 className="text-3xl font-extrabold text-white">{stats.certificates}</h3>
            </div>
            <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400 group-hover:scale-105 transition">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
          </div>
          <p className="text-xxs text-slate-500 mt-4 group-hover:text-emerald-400 transition">Manage credentials &rarr;</p>
        </Link>

        {/* Events Organised */}
        <Link to="/faculty/events" className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl shadow-lg relative overflow-hidden group hover:border-amber-500/50 hover:bg-slate-900 transition-all duration-200">
          <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Events Organised</p>
              <h3 className="text-3xl font-extrabold text-white">{stats.events}</h3>
            </div>
            <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-400 group-hover:scale-105 transition">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <p className="text-xxs text-slate-500 mt-4 group-hover:text-amber-400 transition">Manage activities &rarr;</p>
        </Link>
      </div>

      {/* Main Grid: Self Appraisal Status & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Appraisal Card */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 p-6 rounded-2xl shadow-lg flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">Annual Self Appraisal</h3>
              <span className={`text-xxs font-bold px-2 py-0.5 rounded border ${
                appraisalInfo.submitted
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : appraisalInfo.status === 'Draft'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}>
                {appraisalInfo.status}
              </span>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              Your self appraisal forms the core baseline of the 360-degree performance scoring system. Once submitted, your scores are evaluated alongside HOD assessments, student feedback, and peer reviews.
            </p>

            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-950/40 p-4 border border-slate-850/40 rounded-xl">
              <div>
                <span className="text-slate-500 block text-xxs font-bold uppercase">Academic Session</span>
                <span className="text-white font-medium">{appraisalInfo.academicYear}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-xxs font-bold uppercase">Self Evaluation Status</span>
                <span className="text-white font-medium">
                  {appraisalInfo.submitted ? `Submitted (Rating: ${stats.selfRating || '5'}/5)` : 'Draft Pending Submission'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Link
              to="/faculty/appraisal"
              className={`
                py-2.5 px-6 rounded-xl font-bold text-xs shadow-md transition active:translate-y-px duration-150
                ${appraisalInfo.submitted
                  ? 'bg-slate-800 hover:bg-slate-750 text-slate-350 border border-slate-700'
                  : 'bg-violet-600 hover:bg-violet-500 text-white shadow-violet-600/15'
                }
              `}
            >
              {appraisalInfo.submitted ? 'View Appraisal Form' : 'Complete Self Appraisal'}
            </Link>
          </div>
        </div>

        {/* Quick Insights Cards */}
        <div className="lg:col-span-1 space-y-6">
          {/* AI Insights Quick Card */}
          <div className="bg-gradient-to-tr from-slate-900 to-violet-950/20 border border-violet-900/30 p-6 rounded-2xl shadow-lg space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-violet-400 font-bold text-sm uppercase tracking-wider">
                <svg className="w-5 h-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span>AI Core Insights</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Unlock diagnostic suggestions regarding research metrics, training credentials, and teaching pedagogy based on your active scores.
              </p>
            </div>
            <Link
              to="/faculty/insights"
              className="w-full text-center py-2.5 bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 border border-violet-500/20 hover:border-violet-500/35 rounded-xl text-xs font-bold transition"
            >
              Analyze Profile Performance
            </Link>
          </div>

          {/* KPI Dashboard Quick Link */}
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl shadow-lg space-y-3">
            <h4 className="font-bold text-sm text-white">KPI Targets Progress</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Track progress points towards the 100-point performance scale. Keep publication indexes and event logs updated.
            </p>
            <Link to="/faculty/kpi" className="text-xs font-semibold text-violet-400 hover:text-violet-300 flex items-center gap-1 transition">
              Open KPIs Board
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
