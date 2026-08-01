import React, { useEffect, useState } from 'react';
import { facultyService } from '../services/facultyService.js';

export const AIInsights = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [insights, setInsights] = useState({
    analysisSummary: '',
    strengths: [],
    opportunities: [],
    recommendations: [],
    metrics: {
      publicationsCount: 0,
      certificatesCount: 0,
      eventsOrganisedCount: 0,
      studentEvaluationAverage: null,
    },
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
          <p className="text-sm text-slate-500">Running performance diagnostics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-850">AI Academic Insights</h1>
        <p className="text-sm text-slate-500">
          Automated performance review diagnostic tool providing constructive advice based on logged metrics.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-455 text-sm">
          {error}
        </div>
      )}

      {/* Main Analysis Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-50 via-fuchsia-50/30 to-violet-50 border border-slate-200 p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-violet-600/10 to-transparent blur-2xl pointer-events-none"></div>
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xxs font-bold uppercase tracking-wider text-violet-600 bg-violet-500/10 border border-violet-500/20">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Diagnostic Summary
          </div>
          <p className="text-slate-800 text-sm leading-relaxed max-w-2xl font-medium">
            {insights.analysisSummary || 'Profile data is steady. Logging further publications or certifications will trigger personalized growth tips.'}
          </p>
        </div>
      </div>

      {/* Strengths & Growth Areas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card: Strengths */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-lg space-y-4 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
          <h3 className="text-sm font-bold text-slate-850 uppercase tracking-wider flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-450 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Demonstrated Strengths
          </h3>

          {insights.strengths.length === 0 ? (
            <p className="text-xs text-slate-500 leading-relaxed">No high-metric strengths detected yet. Keep logging research articles or books to trigger recognition points.</p>
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
            <svg className="w-5 h-5 text-amber-450 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Growth Opportunities
          </h3>

          {insights.opportunities.length === 0 ? (
            <p className="text-xs text-slate-500 leading-relaxed">Excellent work! No significant performance gaps found in your metrics sheet.</p>
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
          Recommended Actions
        </h3>

        {insights.recommendations.length === 0 ? (
          <p className="text-xs text-slate-500 leading-relaxed">No recommendations generated. Check back after your students submit appraisal surveys.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {insights.recommendations.map((rec, index) => (
              <div key={index} className="p-4 bg-slate-50/50 border border-slate-200 rounded-xl space-y-2 flex flex-col justify-between hover:border-slate-200 transition">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-violet-450 uppercase tracking-widest text-violet-400">Step {index + 1}</span>
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
