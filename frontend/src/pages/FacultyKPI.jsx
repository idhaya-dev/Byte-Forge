import React, { useEffect, useState } from 'react';
import { facultyService } from '../services/facultyService.js';

export const FacultyKPI = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [kpiData, setKpiData] = useState({
    scores: {
      researchScore: 0,
      bookScore: 0,
      certScore: 0,
      eventScore: 0,
      selfRatingScore: 0,
      totalScore: 0,
    },
    counts: {
      papers: 0,
      books: 0,
      certificates: 0,
      events: 0,
      selfRating: 0,
    },
  });

  useEffect(() => {
    fetchKPI();
  }, []);

  const fetchKPI = async () => {
    try {
      setLoading(true);
      const response = await facultyService.getKPI();
      if (response?.success) {
        setKpiData(response);
      }
    } catch (err) {
      console.error('Error fetching KPI metrics:', err);
      setError('Failed to fetch KPI dashboard analytics.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  const { scores, counts } = kpiData;

  const kpiCategories = [
    {
      name: 'Research Publications',
      score: scores.researchScore,
      count: counts.papers,
      max: 20,
      unit: 'papers',
      formula: '5 points per paper (Max 4)',
      color: 'bg-violet-500',
      description: 'Journals, conference papers, and index publications logged under your profile.',
    },
    {
      name: 'Books & Chapters Published',
      score: scores.bookScore,
      count: counts.books,
      max: 20,
      unit: 'books',
      formula: '10 points per book (Max 2)',
      color: 'bg-fuchsia-500',
      description: 'Text books, research chapters, or monographs authored under university affiliations.',
    },
    {
      name: 'Professional Certifications',
      score: scores.certScore,
      count: counts.certificates,
      max: 20,
      unit: 'certs',
      formula: '5 points per certificate (Max 4)',
      color: 'bg-emerald-500',
      description: 'Training licenses, industry course credentials, or faculty development programs completed.',
    },
    {
      name: 'Events Organised',
      score: scores.eventScore,
      count: counts.events,
      max: 20,
      unit: 'events',
      formula: '5 points per event organized (Max 4)',
      color: 'bg-amber-500',
      description: 'Conferences, technical workshops, or professional webinars coordinated and organized.',
    },
    {
      name: 'Self-Appraisal Evaluation',
      score: scores.selfRatingScore,
      count: counts.selfRating,
      max: 20,
      unit: 'stars',
      formula: '4 points per self star rating (Max 5 stars)',
      color: 'bg-indigo-500',
      description: 'Self evaluation grading entered on your annual appraisal worksheet.',
    },
  ];

  return (
    <div className="space-y-8 font-sans max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-850">KPI Targets Dashboard</h1>
        <p className="text-sm text-slate-500">Renders real-time appraisal metric standings and progress weights on the 100-point performance scale.</p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-455 text-sm">
          {error}
        </div>
      )}

      {/* Total score summary indicator */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-violet-955/20 to-slate-900 border border-slate-200 p-8 shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-lg font-bold text-slate-850">Cumulative KPI Score</h3>
          <p className="text-xs text-slate-500 max-w-md leading-relaxed">
            Your cumulative KPI Score shows your achievements across research, upskilling, and teaching parameters. Check individual sections below to target missing weights.
          </p>
        </div>

        {/* Circular or big numeric score visual indicator */}
        <div className="flex items-center gap-4">
          <div className="text-center">
            <span className="block text-5xl font-black text-transparent bg-gradient-to-tr from-violet-400 to-fuchsia-400 bg-clip-text">
              {scores.totalScore}
            </span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Points Secured</span>
          </div>
          <div className="h-12 w-px bg-slate-100"></div>
          <div className="text-center">
            <span className="block text-4xl font-extrabold text-slate-500">100</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Max Target</span>
          </div>
        </div>
      </div>

      {/* KPI Category List */}
      <div className="space-y-6">
        {kpiCategories.map((cat) => {
          const percent = (cat.score / cat.max) * 100;
          return (
            <div key={cat.name} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-lg space-y-4 hover:border-slate-300 transition">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <h4 className="font-bold text-slate-850 text-md">{cat.name}</h4>
                  <p className="text-xxs text-slate-500 mt-0.5">{cat.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xxs font-semibold bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-slate-500">
                    Logged: {cat.count} {cat.unit}
                  </span>
                  <span className="text-xs font-extrabold text-slate-800">
                    {cat.score} / {cat.max} pts
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5">
                <div className="w-full h-2.5 bg-slate-50 border border-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${cat.color} transition-all duration-500 rounded-full`}
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xxs text-slate-500">
                  <span>Score Weight: {cat.formula}</span>
                  <span>{Math.round(percent)}% Complete</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
