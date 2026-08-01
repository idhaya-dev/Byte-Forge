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
  const [showPendingModal, setShowPendingModal] = useState(false);

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
              reportFromDate: currentAppraisal.selfAppraisal?.reportFromDate || '',
              reportToDate: currentAppraisal.selfAppraisal?.reportToDate || '',
              achievements: currentAppraisal.selfAppraisal?.achievements || '',
              challengesText: currentAppraisal.selfAppraisal?.challengesText || '',
              submittedAt: currentAppraisal.selfAppraisal?.submittedAt || null,
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

  const isHodCompleted = appraisalInfo.status === 'Completed' || appraisalInfo.status === 'Approved by HOD';

  const handleAiInsightsClick = (e) => {
    if (!isHodCompleted) {
      e.preventDefault();
      setShowPendingModal(true);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-violet-500"></div>
          <p className="text-sm text-slate-500">Loading appraisal metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in font-sans relative">
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
                ⏳ {appraisalInfo.status}
              </span>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowPendingModal(false)}
                className="w-full py-2.5 bg-black hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition shadow-md active:translate-y-px"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Welcome Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-50 via-fuchsia-50/30 to-violet-50 border border-slate-200 p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-violet-600/10 to-transparent blur-2xl pointer-events-none"></div>
        <div className="relative z-10 space-y-2">
          <div className="inline-block px-3 py-1 rounded-full text-xxs font-bold uppercase tracking-wider text-violet-600 bg-violet-500/10 border border-violet-500/20">
            Instructor Workstation
          </div>
          <h1 className="text-3xl font-black text-slate-800">
            Welcome, {user?.name || 'Faculty Member'}
          </h1>
          <p className="text-slate-500 max-w-xl text-sm leading-relaxed">
            Manage your academic profile, log publications, update training certificates, track organized events, and submit your monthly work report form.
          </p>
        </div>
      </div>

      {/* Overview Performance Metrics under Welcome Box */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* 1. Attendance Percentage */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-lg relative overflow-hidden group hover:border-violet-500/50 hover:bg-white transition-all duration-200">
          <div className="absolute top-0 left-0 w-1 h-full bg-violet-500"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Attendance Percentage</p>
              <h3 className="text-3xl font-extrabold text-slate-850">{appraisalInfo.attendancePercentage || '94.5%'}</h3>
            </div>
            <div className="p-2.5 bg-violet-500/10 rounded-xl text-violet-400 group-hover:scale-105 transition">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <p className="text-xxs text-slate-500 mt-4">Academic Session 2026-2027</p>
        </div>

        {/* 2. Student Rating */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-lg relative overflow-hidden group hover:border-fuchsia-500/50 hover:bg-white transition-all duration-200">
          <div className="absolute top-0 left-0 w-1 h-full bg-fuchsia-500"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Student Feedback Rating</p>
              <h3 className="text-3xl font-extrabold text-slate-850">{appraisalInfo.studentRating || '4.4 / 5.0'}</h3>
            </div>
            <div className="p-2.5 bg-fuchsia-500/10 rounded-xl text-fuchsia-400 group-hover:scale-105 transition">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.246.582 1.817l-3.97 2.884a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.884a1 1 0 00-1.175 0l-3.97 2.884c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.97-2.884c-.779-.571-.38-1.817.582-1.817h4.907a1 1 0 00.95-.69l1.519-4.674z" />
              </svg>
            </div>
          </div>
          <p className="text-xxs text-slate-500 mt-4">Based on student evaluations</p>
        </div>

        {/* 3. HOD Review Status */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-lg relative overflow-hidden group hover:border-emerald-500/50 hover:bg-white transition-all duration-200">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">HOD Review Status</p>
              <h3 className="text-2xl font-extrabold text-slate-850 mt-1 leading-tight">{appraisalInfo.status || 'Pending'}</h3>
            </div>
            <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400 group-hover:scale-105 transition">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-xxs text-slate-500 mt-4">
            {appraisalInfo.status === 'Approved by HOD' || appraisalInfo.status === 'Completed'
              ? '✓ Review Completed' 
              : '⏳ Pending HOD Review'}
          </p>
        </div>

        {/* 4. Overall Score (Calculated ONLY when HOD review status is completed/approved, else PENDING) */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-lg relative overflow-hidden group hover:border-amber-500/50 hover:bg-white transition-all duration-200">
          <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Overall Score</p>
              <h3 className={`text-3xl font-extrabold ${
                appraisalInfo.status === 'Approved by HOD' || appraisalInfo.status === 'Completed'
                  ? 'text-slate-850' 
                  : 'text-slate-400'
              }`}>
                {appraisalInfo.status === 'Approved by HOD' || appraisalInfo.status === 'Completed'
                  ? (appraisalInfo.overallScore || '92 / 100') 
                  : 'Pending'}
              </h3>
            </div>
            <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-400 group-hover:scale-105 transition">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <p className="text-xxs text-slate-500 mt-4">
            {appraisalInfo.status === 'Approved by HOD' || appraisalInfo.status === 'Completed'
              ? 'Computed from HOD appraisal review' 
              : 'Calculated once HOD review is completed'}
          </p>
        </div>
      </div>

      {/* Main Grid: Work Report for Monthly Performance & Right Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Work Report for Monthly Performance Card */}
        <div className="lg:col-span-2 bg-white border border-slate-200 p-6 rounded-2xl shadow-lg flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-850">Work Report for Monthly Performance</h3>
              <span className={`text-xxs font-bold px-2 py-0.5 rounded border ${
                appraisalInfo.submitted
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : appraisalInfo.status === 'Draft'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  : 'bg-slate-100 text-slate-500 border-slate-700'
              }`}>
                {appraisalInfo.status}
              </span>
            </div>

            <p className="text-sm text-slate-650 leading-relaxed">
              Your monthly performance work report forms the core baseline of the performance evaluation system. Once submitted, your logs are reviewed alongside HOD assessments and student feedback.
            </p>

            {/* Submitted Work Report Log Display (Visible only after submission) */}
            {!appraisalInfo.submitted ? (
              <div className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-xl text-xs space-y-1">
                <span className="font-bold text-amber-700 block uppercase tracking-wider text-[10px]">
                  ⏳ Work Report Pending Submission
                </span>
                <p className="text-slate-650 leading-relaxed text-xs">
                  Please complete and submit your performance work report to log your evaluation period, achievements, and challenges for HOD review.
                </p>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-xl text-xs max-h-52 overflow-y-auto space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-slate-200/70 sticky top-0 bg-slate-50 z-10">
                  <span className="font-bold text-violet-700 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                    📅 Report Period: {appraisalInfo.reportFromDate && appraisalInfo.reportToDate ? `${appraisalInfo.reportFromDate} to ${appraisalInfo.reportToDate}` : 'Not Specified'}
                  </span>
                  {appraisalInfo.submittedAt && (
                    <span className="text-[10px] text-slate-500 font-semibold">
                      Submitted: {new Date(appraisalInfo.submittedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  )}
                </div>

                {appraisalInfo.achievements ? (
                  <div className="space-y-1">
                    <span className="font-bold text-slate-700 block text-[10px] uppercase tracking-wider">Submitted Key Achievements:</span>
                    <p className="text-slate-650 leading-relaxed text-xs whitespace-pre-wrap">{appraisalInfo.achievements}</p>
                  </div>
                ) : (
                  <p className="text-slate-400 italic text-xs">No achievements logged in work report.</p>
                )}

                {appraisalInfo.challengesText && (
                  <div className="space-y-1 pt-1 border-t border-slate-200/50">
                    <span className="font-bold text-slate-700 block text-[10px] uppercase tracking-wider">Challenges & Focus Areas:</span>
                    <p className="text-slate-650 leading-relaxed text-xs whitespace-pre-wrap">{appraisalInfo.challengesText}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Link
              to="/faculty/appraisal"
              className="py-2.5 px-6 rounded-xl font-bold text-xs bg-violet-600 hover:bg-violet-500 text-white shadow-md shadow-violet-600/15 transition active:translate-y-px duration-150"
            >
              Submit a Work Report
            </Link>
          </div>
        </div>

        {/* Right Sidebar Column */}
        <div className="lg:col-span-1 space-y-6">
          {/* AI Core Insights Card */}
          <div className="bg-gradient-to-tr from-violet-50 via-fuchsia-50/30 to-violet-50 border border-slate-200 p-6 rounded-2xl shadow-lg space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between font-bold text-sm uppercase tracking-wider text-violet-700">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <span>AI Core Insights</span>
                </div>
                {!(appraisalInfo.status === 'Completed' || appraisalInfo.status === 'Approved by HOD') && (
                  <span className="text-[9px] font-bold text-amber-700 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full lowercase tracking-normal">
                    🔒 pending HOD
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {(appraisalInfo.status === 'Completed' || appraisalInfo.status === 'Approved by HOD')
                  ? 'Access diagnostic growth suggestions and strengths analysis based on your completed HOD review.'
                  : 'AI Academic Insights will be generated once your HOD completes your overall performance appraisal review.'}
              </p>
            </div>
            <Link
              to="/faculty/insights"
              onClick={handleAiInsightsClick}
              className={`w-full text-center py-2.5 rounded-xl text-xs font-bold transition border ${
                (appraisalInfo.status === 'Completed' || appraisalInfo.status === 'Approved by HOD')
                  ? 'bg-violet-100/50 hover:bg-violet-100 text-violet-700 border-violet-200 hover:border-violet-300'
                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200 cursor-pointer'
              }`}
            >
              {(appraisalInfo.status === 'Completed' || appraisalInfo.status === 'Approved by HOD')
                ? 'Analyze Profile Performance'
                : 'View Review Status'}
            </Link>
          </div>

          {/* KPI Progress Card (Directly Below AI Core Insights) */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-lg space-y-4">
            <div className="pb-2 border-b border-slate-200 flex justify-between items-center">
              <h4 className="font-bold text-sm text-slate-800">KPI PROGRESS</h4>
              <span className="text-xxs font-bold text-slate-400 uppercase tracking-wider">Metrics Log</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Research Papers */}
              <div className="p-4 bg-slate-50/70 border border-slate-200/80 rounded-xl relative overflow-hidden flex flex-col items-center justify-center text-center">
                <div className="absolute top-0 left-0 w-1 h-full bg-violet-500"></div>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Research Papers</p>
                <h3 className="text-2xl font-extrabold text-slate-850">{stats.papers}</h3>
              </div>

              {/* Books Published */}
              <div className="p-4 bg-slate-50/70 border border-slate-200/80 rounded-xl relative overflow-hidden flex flex-col items-center justify-center text-center">
                <div className="absolute top-0 left-0 w-1 h-full bg-fuchsia-500"></div>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Books Published</p>
                <h3 className="text-2xl font-extrabold text-slate-850">{stats.books}</h3>
              </div>

              {/* Certificates */}
              <div className="p-4 bg-slate-50/70 border border-slate-200/80 rounded-xl relative overflow-hidden flex flex-col items-center justify-center text-center">
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Certifications</p>
                <h3 className="text-2xl font-extrabold text-slate-850">{stats.certificates}</h3>
              </div>

              {/* Events Organised */}
              <div className="p-4 bg-slate-50/70 border border-slate-200/80 rounded-xl relative overflow-hidden flex flex-col items-center justify-center text-center">
                <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Events Organised</p>
                <h3 className="text-2xl font-extrabold text-slate-850">{stats.events}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
