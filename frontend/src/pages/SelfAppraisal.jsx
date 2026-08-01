import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { appraisalService } from '../services/appraisalService.js';

export const SelfAppraisal = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isReadOnly, setIsReadOnly] = useState(false);

  // Form fields
  const [academicYear, setAcademicYear] = useState('2026-2027');
  const [teachingHours, setTeachingHours] = useState(0);
  const [researchPapersCount, setResearchPapersCount] = useState(0);
  const [booksPublishedCount, setBooksPublishedCount] = useState(0);
  const [studentProjectsGuided, setStudentProjectsGuided] = useState(0);
  const [selfRating, setSelfRating] = useState(3);
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
            setAcademicYear(current.academicYear || '2026-2027');
            setTeachingHours(current.selfAppraisal?.teachingHours || 0);
            setResearchPapersCount(current.selfAppraisal?.researchPapersCount || 0);
            setBooksPublishedCount(current.selfAppraisal?.booksPublishedCount || 0);
            setStudentProjectsGuided(current.selfAppraisal?.studentProjectsGuided || 0);
            setSelfRating(current.selfAppraisal?.selfRating || 3);
            setAchievements(current.selfAppraisal?.achievements || '');
            setChallengesText(current.selfAppraisal?.challengesText || '');
            
            // Mark read-only if already submitted
            if (current.selfAppraisal?.submitted) {
              setIsReadOnly(true);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching existing appraisal:', err);
        setMessage({ type: 'error', text: 'Failed to retrieve your current appraisal data.' });
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
        academicYear,
        teachingHours: Number(teachingHours),
        researchPapersCount: Number(researchPapersCount),
        booksPublishedCount: Number(booksPublishedCount),
        studentProjectsGuided: Number(studentProjectsGuided),
        selfRating: Number(selfRating),
        achievements: achievements.trim(),
        challengesText: challengesText.trim(),
        submit: submitFlag, // true if final submit, false if draft save
      };

      const response = await appraisalService.submitSelfAppraisal(payload);
      if (response?.success) {
        setMessage({
          type: 'success',
          text: submitFlag
            ? 'Your Self-Appraisal has been locked and submitted successfully!'
            : 'Draft appraisal saved successfully!',
        });
        if (submitFlag) {
          setIsReadOnly(true);
        }
      }
    } catch (err) {
      console.error('Appraisal submit error:', err);
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
          <p className="text-sm text-slate-500">Loading appraisal worksheet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-850">Self Appraisal Worksheet</h1>
          <p className="text-sm text-slate-500">
            Log your annual scores and achievements. Lock the sheet for formal HOD sign-off.
          </p>
        </div>
        {isReadOnly && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 text-emerald-400 animate-fade-in">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Locked & Submitted
          </span>
        )}
      </div>

      {/* Security alert regarding submission lock */}
      {!isReadOnly && (
        <div className="p-4 rounded-xl bg-violet-950/20 border border-violet-900/40 text-xs text-violet-400 flex items-start gap-3">
          <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="font-bold text-violet-300">Worksheet Locked on Submission</p>
            <p className="mt-0.5 leading-relaxed">
              You can save edits as a draft as many times as you like. However, triggering 'Submit Appraisal' locks your worksheet and transfers ownership to the HOD for official department grading. It cannot be altered after locking.
            </p>
          </div>
        </div>
      )}

      {/* Message Notifications */}
      {message.text && (
        <div
          className={`p-4 rounded-xl border text-sm flex gap-3 ${
            message.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
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
        <h3 className="text-md font-bold text-slate-850 pb-2 border-b border-slate-200">Evaluation Parameters</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Academic Session */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Academic Session
            </label>
            <select
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              disabled={isReadOnly}
              className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-650 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/80 transition text-sm cursor-pointer disabled:cursor-not-allowed"
            >
              <option value="2026-2027">2026-2027 (Current)</option>
              <option value="2025-2026">2025-2026</option>
              <option value="2027-2028">2027-2028</option>
            </select>
          </div>

          {/* Annual Teaching Hours */}
          <div className="space-y-2">
            <label htmlFor="teachingHours" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Annual Teaching Hours
            </label>
            <input
              id="teachingHours"
              type="number"
              value={teachingHours}
              onChange={(e) => setTeachingHours(e.target.value)}
              disabled={isReadOnly}
              placeholder="e.g. 520"
              className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-650 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/80 transition text-sm disabled:cursor-not-allowed text-white"
            />
          </div>

          {/* Research Publications Count */}
          <div className="space-y-2">
            <label htmlFor="researchPapersCount" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Research Publications Count
            </label>
            <input
              id="researchPapersCount"
              type="number"
              value={researchPapersCount}
              onChange={(e) => setResearchPapersCount(e.target.value)}
              disabled={isReadOnly}
              placeholder="e.g. 3"
              className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-650 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/80 transition text-sm disabled:cursor-not-allowed text-white"
            />
          </div>

          {/* Books Published Count */}
          <div className="space-y-2">
            <label htmlFor="booksPublishedCount" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Books Published Count
            </label>
            <input
              id="booksPublishedCount"
              type="number"
              value={booksPublishedCount}
              onChange={(e) => setBooksPublishedCount(e.target.value)}
              disabled={isReadOnly}
              placeholder="e.g. 1"
              className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-650 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/80 transition text-sm disabled:cursor-not-allowed text-white"
            />
          </div>

          {/* Student Projects Guided */}
          <div className="space-y-2">
            <label htmlFor="studentProjectsGuided" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Student Projects Guided
            </label>
            <input
              id="studentProjectsGuided"
              type="number"
              value={studentProjectsGuided}
              onChange={(e) => setStudentProjectsGuided(e.target.value)}
              disabled={isReadOnly}
              placeholder="e.g. 12"
              className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-650 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/80 transition text-sm disabled:cursor-not-allowed text-white"
            />
          </div>

          {/* Self evaluation performance rating */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Self Evaluation Rating
            </label>
            <div className="flex items-center gap-1.5 pt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => !isReadOnly && setSelfRating(star)}
                  disabled={isReadOnly}
                  className={`focus:outline-none transition ${isReadOnly ? 'cursor-not-allowed' : 'active:scale-90 hover:scale-105'}`}
                >
                  <svg
                    className={`w-8 h-8 ${
                      star <= selfRating
                        ? 'text-violet-400 fill-violet-400'
                        : 'text-slate-700'
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              ))}
              <span className="text-xs font-bold text-slate-500 ml-2">({selfRating}/5)</span>
            </div>
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
              disabled={isReadOnly}
              placeholder="Detail your research highlights, syllabus creations, special lectures, or student guidance achievements..."
              className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-650 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/80 transition text-sm resize-y disabled:cursor-not-allowed"
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
              disabled={isReadOnly}
              placeholder="Outline specific academic, resource, or infrastructural limitations faced during this session..."
              className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-650 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/80 transition text-sm resize-y disabled:cursor-not-allowed"
            ></textarea>
          </div>
        </div>

        {/* Buttons */}
        {!isReadOnly && (
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => navigate('/faculty/dashboard')}
              className="py-2.5 px-6 bg-transparent hover:bg-white border border-slate-200 hover:border-slate-750 text-slate-500 hover:text-slate-700 text-xs font-bold rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={submitLoading}
              onClick={() => handleSave(false)}
              className="py-2.5 px-6 bg-slate-100 hover:bg-slate-750 border border-slate-700 hover:border-slate-350 text-slate-650 hover:text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5"
            >
              {submitLoading ? 'Saving...' : 'Save as Draft'}
            </button>
            <button
              type="button"
              disabled={submitLoading}
              onClick={() => {
                if (window.confirm('Are you sure you want to final submit? This will lock the self-appraisal worksheet and render it read-only.')) {
                  handleSave(true);
                }
              }}
              className="py-2.5 px-8 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-violet-500/15 transition flex items-center gap-1.5"
            >
              {submitLoading ? 'Submitting...' : 'Submit Appraisal'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
