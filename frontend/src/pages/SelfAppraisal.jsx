import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { appraisalService } from '../services/appraisalService.js';

export const SelfAppraisal = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Form fields (all editable)
  const [reportFromDate, setReportFromDate] = useState('2026-07-01');
  const [reportToDate, setReportToDate] = useState('2026-07-31');
  const [achievements, setAchievements] = useState('');
  const [challengesText, setChallengesText] = useState('');

  useEffect(() => {
    const fetchExistingAppraisal = async () => {
      try {
        setLoading(true);
        const response = await appraisalService.getAppraisals();
        if (response?.success && response.appraisals?.length > 0) {
          const current = response.appraisals.find(
            (app) => app.academicYear === '2026-2027'
          );
          if (current) {
            setReportFromDate(current.selfAppraisal?.reportFromDate || '2026-07-01');
            setReportToDate(current.selfAppraisal?.reportToDate || '2026-07-31');
            setAchievements(current.selfAppraisal?.achievements || '');
            setChallengesText(current.selfAppraisal?.challengesText || '');
          }
        }
      } catch (err) {
        console.error('Error fetching existing work report:', err);
        setMessage({ type: 'error', text: 'Failed to retrieve your current work report data.' });
      } finally {
        setLoading(false);
      }
    };

    fetchExistingAppraisal();
  }, []);

  const handleSave = async (submitFlag) => {
    setMessage({ type: '', text: '' });
    setSubmitLoading(true);

    try {
      const payload = {
        academicYear: '2026-2027',
        reportFromDate,
        reportToDate,
        achievements: achievements.trim(),
        challengesText: challengesText.trim(),
        submit: submitFlag, // true if final submit, false if draft save
      };

      const response = await appraisalService.submitSelfAppraisal(payload);
      if (response?.success) {
        setMessage({
          type: 'success',
          text: submitFlag
            ? 'Your Work Report has been submitted successfully and updated!'
            : 'Draft work report saved successfully!',
        });
      }
    } catch (err) {
      console.error('Work report submit error:', err);
      setMessage({ type: 'error', text: err.message || 'An error occurred. Please try again.' });
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-violet-500"></div>
          <p className="text-sm text-slate-500">Loading work report...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-850">Faculty Work Report</h1>
          <p className="text-sm text-slate-500">
            Log and update your performance work report for specific date periods anytime.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-violet-50 text-violet-700 border border-violet-200">
          ✏️ Fully Editable Mode
        </span>
      </div>

      {/* Info Notice */}
      <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/20 text-xs text-violet-800 flex items-start gap-3">
        <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p className="font-bold text-violet-900">Work Report Parameters Editable</p>
          <p className="mt-0.5 leading-relaxed">
            All fields in your work report can be edited and updated. Select your report date range below to submit for HOD review.
          </p>
        </div>
      </div>

      {/* Message Notifications */}
      {message.text && (
        <div
          className={`p-4 rounded-xl border text-sm flex gap-3 ${
            message.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700'
              : 'bg-rose-500/10 border-rose-500/20 text-rose-700'
          }`}
        >
          {message.type === 'success' ? (
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )}
          <p>{message.text}</p>
        </div>
      )}

      {/* Form */}
      <div className="bg-white border border-slate-200 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-xl space-y-6">
        <h3 className="text-md font-bold text-slate-850 pb-2 border-b border-slate-200">Evaluation & Performance Parameters</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Report From (Date) */}
          <div className="space-y-2">
            <label htmlFor="reportFromDate" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Report From (Date)
            </label>
            <input
              id="reportFromDate"
              type="date"
              value={reportFromDate}
              onChange={(e) => setReportFromDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/80 transition text-sm font-semibold cursor-pointer"
            />
          </div>

          {/* Report To (Date) */}
          <div className="space-y-2">
            <label htmlFor="reportToDate" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Report To (Date)
            </label>
            <input
              id="reportToDate"
              type="date"
              value={reportToDate}
              onChange={(e) => setReportToDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/80 transition text-sm font-semibold cursor-pointer"
            />
          </div>
        </div>

        {/* Text Areas */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          {/* Key Achievements */}
          <div className="space-y-2">
            <label htmlFor="achievements" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Key Academic & Professional Achievements
            </label>
            <textarea
              id="achievements"
              rows={4}
              value={achievements}
              onChange={(e) => setAchievements(e.target.value)}
              placeholder="Detail your research highlights, syllabus creations, special lectures, or student guidance achievements..."
              className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/80 transition text-sm resize-y"
            ></textarea>
          </div>

          {/* Challenges faced */}
          <div className="space-y-2">
            <label htmlFor="challenges" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Challenges Faced & Recommendations
            </label>
            <textarea
              id="challenges"
              rows={4}
              value={challengesText}
              onChange={(e) => setChallengesText(e.target.value)}
              placeholder="Outline specific academic, resource, or infrastructural limitations faced during this session..."
              className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/80 transition text-sm resize-y"
            ></textarea>
          </div>
        </div>

        {/* Action Buttons (Always Available & Active) */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={() => navigate('/faculty/dashboard')}
            className="py-2.5 px-6 bg-transparent hover:bg-slate-100 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl transition"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={submitLoading}
            onClick={() => handleSave(false)}
            className="py-2.5 px-6 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
          >
            {submitLoading ? 'Saving...' : 'Save as Draft'}
          </button>
          <button
            type="button"
            disabled={submitLoading}
            onClick={() => handleSave(true)}
            className="py-2.5 px-8 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-violet-500/15 transition flex items-center gap-1.5"
          >
            {submitLoading ? 'Submitting...' : 'Submit Work Report'}
          </button>
        </div>
      </div>
    </div>
  );
};
