import React, { useEffect, useState } from 'react';
import { facultyService } from '../services/facultyService.js';

export const AIInsights = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [insights, setInsights] = useState({
    isHodReviewCompleted: false,
    status: '',
    hodComments: '',
    analysisSummary: '',
    strengths: [],
    opportunities: [],
    recommendations: [],
  });

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const response = await facultyService.getAIInsights();
      if (response?.success) {
        setInsights(response);
      }
    } catch (err) {
      console.error('Error fetching AI insights:', err);
      setError('Failed to fetch AI insights report.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-violet-500"></div>
          <p className="text-sm text-slate-500 font-medium">Loading AI Performance Diagnostics...</p>
        </div>
      </div>
    );
  }

  // 1. Locked State: Displayed if HOD Review is NOT completed yet
  if (!insights.isHodReviewCompleted) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 font-sans">
        <div>
          <h1 className="text-2xl font-black text-slate-850">AI Academic Insights</h1>
          <p className="text-sm text-slate-500">
            Automated performance review diagnostic tool providing constructive advice based on logged metrics.
          </p>
        </div>

        <div className="bg-white border border-slate-200 p-8 md:p-12 rounded-2xl shadow-xl space-y-6 text-center max-w-2xl mx-auto">
          <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          <div className="space-y-3">
            <span className="inline-block px-3 py-1 rounded-full text-xxs font-bold uppercase tracking-wider text-amber-600 bg-amber-500/10 border border-amber-500/20">
              HOD Overall Review Pending
            </span>
            <h2 className="text-2xl font-black text-slate-850">
              AI Insights Locked
            </h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              AI Insights & Diagnostic Suggestions will be unlocked once your Head of Department (HOD) completes your overall performance appraisal review and submits official review comments.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-600 flex justify-between items-center max-w-md mx-auto shadow-sm">
            <span className="font-bold text-slate-500">Current HOD Status:</span>
            <span className="font-extrabold text-amber-600 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200">
              ⏳ {insights.status || 'Pending HOD Review'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // 2. Unlocked State: Displayed AFTER HOD Review is completed
  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-850">AI Academic Insights</h1>
        <p className="text-sm text-slate-500">
          Personalized performance suggestions and growth diagnostics based on your completed HOD overall review.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm font-semibold">
          {error}
        </div>
      )}

      {/* HOD Official Review Comments Card */}
      <div className="bg-white border-2 border-violet-200 p-6 rounded-2xl shadow-lg space-y-3 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-violet-600"></div>
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2 text-violet-700 font-extrabold text-xs uppercase tracking-wider">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <span>HOD Official Review Comments</span>
          </div>
          <span className="text-xxs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
            ✓ Overall Review Completed
          </span>
        </div>
        <blockquote className="text-slate-800 text-sm font-semibold italic bg-violet-50/50 p-4 rounded-xl border border-violet-100/60 leading-relaxed">
          "{insights.hodComments || 'Satisfactory overall academic and administrative performance.'}"
        </blockquote>
      </div>

      {/* Main Diagnostic Analysis Summary Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-50 via-fuchsia-50/30 to-violet-50 border border-slate-200 p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-violet-600/10 to-transparent blur-2xl pointer-events-none"></div>
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xxs font-bold uppercase tracking-wider text-violet-600 bg-violet-500/10 border border-violet-500/20">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            HOD-Guided Diagnostic Summary
          </div>
          <p className="text-slate-800 text-sm leading-relaxed max-w-2xl font-medium">
            {insights.analysisSummary}
          </p>
        </div>
      </div>

      {/* Strengths & Growth Areas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card: Strengths */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-lg space-y-4 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
          <h3 className="text-sm font-bold text-slate-850 uppercase tracking-wider flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Demonstrated Strengths
          </h3>

          {insights.strengths.length === 0 ? (
            <p className="text-xs text-slate-500 leading-relaxed">No specific strengths recorded yet.</p>
          ) : (
            <ul className="space-y-3 text-xs text-slate-650 leading-relaxed list-none">
              {insights.strengths.map((str, index) => (
                <li key={index} className="flex gap-2.5 items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5"></span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Card: Opportunities */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-lg space-y-4 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
          <h3 className="text-sm font-bold text-slate-850 uppercase tracking-wider flex items-center gap-2">
            <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Focus & Growth Areas
          </h3>

          {insights.opportunities.length === 0 ? (
            <p className="text-xs text-slate-500 leading-relaxed">Excellent work! No significant performance gaps noted in HOD review.</p>
          ) : (
            <ul className="space-y-3 text-xs text-slate-650 leading-relaxed list-none">
              {insights.opportunities.map((opp, index) => (
                <li key={index} className="flex gap-2.5 items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5"></span>
                  <span>{opp}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Actions & Recommendations Section */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-lg space-y-4">
        <h3 className="text-sm font-bold text-slate-850 uppercase tracking-wider flex items-center gap-2">
          <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Recommended Actions Based on HOD Guidance
        </h3>

        {insights.recommendations.length === 0 ? (
          <p className="text-xs text-slate-500 leading-relaxed">No recommendations generated.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {insights.recommendations.map((rec, index) => (
              <div key={index} className="p-4 bg-slate-50/50 border border-slate-200 rounded-xl space-y-2 flex flex-col justify-between hover:border-slate-200 transition">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-violet-400 uppercase tracking-widest">Step {index + 1}</span>
                  <p className="text-xs text-slate-650 leading-relaxed">{rec}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
