import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentService } from '../services/studentService.js';

const RATING_DESCRIPTIONS = {
  1: 'Poor / Ineffective',
  2: 'Fair / Below Average',
  3: 'Good / Average',
  4: 'Very Good / Above Average',
  5: 'Excellent / Outstanding',
};

const RATING_PARAMETERS = [
  { 
    key: 'teachingClarity', 
    label: 'Teaching Clarity', 
    desc: 'Clarity of concepts, structure of lectures, and ease of understanding.' 
  },
  { 
    key: 'classroomInteraction', 
    label: 'Classroom Interaction', 
    desc: 'Encouraging student participation, questions, and active class discussion.' 
  },
  { 
    key: 'doubtClarification', 
    label: 'Doubt Clarification', 
    desc: 'Patience, responsiveness, and thoroughness when resolving student questions.' 
  },
  { 
    key: 'practicalConceptsTaught', 
    label: 'Practical Concepts Taught', 
    desc: 'Integration of real-world examples, practical applications, and hands-on demonstrations.' 
  },
];

const SPEED_OPTIONS = ['Slow', 'Normal', 'Fast'];
const SPEED_CONFIG = {
  Slow: { label: 'Slow', desc: 'Pacing is slow; could cover more depth', color: 'text-amber-600 bg-amber-50 border-amber-200' },
  Normal: { label: 'Normal', desc: 'Optimal pacing; balanced and clear', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  Fast: { label: 'Fast', desc: 'Pacing is fast; hard to keep up at times', color: 'text-blue-600 bg-blue-50 border-blue-200' },
};

export const GiveFeedback = () => {
  const navigate = useNavigate();
  const [faculties, setFaculties] = useState([]);
  const [loadingFaculties, setLoadingFaculties] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Form State
  const [facultyId, setFacultyId] = useState('');
  const [academicYear, setAcademicYear] = useState('2026-2027');
  const [semester, setSemester] = useState('');
  const [subjectName, setSubjectName] = useState('');
  
  // 5-Star Rating parameters
  const [ratings, setRatings] = useState({
    teachingClarity: 0,
    classroomInteraction: 0,
    doubtClarification: 0,
    practicalConceptsTaught: 0,
  });

  // Slider State for Teaching Speed ('Slow', 'Normal', 'Fast') -> index 0, 1, 2
  const [speedIndex, setSpeedIndex] = useState(1); // Default to 'Normal' (index 1)

  const [comments, setComments] = useState('');
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const response = await studentService.getFaculties();
        setFaculties(response?.faculties || []);
      } catch (err) {
        console.error('Error fetching faculties:', err);
        setMessage({ type: 'error', text: 'Failed to load faculty dropdown list.' });
      } finally {
        setLoadingFaculties(false);
      }
    };
    fetchFaculties();
  }, []);

  const handleRatingChange = (param, val) => {
    setRatings((prev) => ({
      ...prev,
      [param]: val,
    }));
    if (formErrors[param]) {
      setFormErrors((prev) => ({ ...prev, [param]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!facultyId) errors.facultyId = 'Please select a faculty member';
    if (!academicYear) errors.academicYear = 'Please provide the academic year';
    if (!semester) errors.semester = 'Please select the semester';
    if (!subjectName.trim()) errors.subjectName = 'Please enter the course/subject name';

    RATING_PARAMETERS.forEach((param) => {
      if (ratings[param.key] === 0) {
        errors[param.key] = `Please rate '${param.label}'`;
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setSubmitLoading(true);
    try {
      const selectedSpeed = SPEED_OPTIONS[speedIndex];
      const payload = {
        facultyId,
        academicYear,
        semester,
        subjectName: subjectName.trim(),
        ratings: {
          ...ratings,
          teachingSpeed: selectedSpeed,
        },
        teachingSpeed: selectedSpeed,
        comments: comments.trim() || undefined,
      };

      const response = await studentService.submitFeedback(payload);
      if (response?.success) {
        setMessage({
          type: 'success',
          text: 'Thank you! Your feedback has been stored anonymously. Redirecting to dashboard...',
        });
        
        // Reset form
        setFacultyId('');
        setSubjectName('');
        setSemester('');
        setComments('');
        setRatings({
          teachingClarity: 0,
          classroomInteraction: 0,
          doubtClarification: 0,
          practicalConceptsTaught: 0,
        });
        setSpeedIndex(1);

        setTimeout(() => {
          navigate('/student/dashboard');
        }, 3000);
      }
    } catch (err) {
      console.error('Submission error:', err);
      setMessage({
        type: 'error',
        text: err.message || 'An error occurred during submission. Please try again.',
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  // Helper component to render a 1 to 5 range slider for a rating parameter
  const SliderRatingSelector = ({ paramKey, currentVal }) => {
    const displayVal = currentVal || 3; // Default visual position to 3 if unselected

    return (
      <div className="w-full space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">Rating Score (1-5)</span>
          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border transition-colors ${
            currentVal > 0 
              ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' 
              : 'bg-slate-100 text-slate-500 border-slate-200'
          }`}>
            {currentVal > 0 ? `${currentVal} / 5 — ${RATING_DESCRIPTIONS[currentVal]}` : 'Slide to Rate (1 to 5)'}
          </span>
        </div>

        {/* Range Slider 1 to 5 */}
        <input
          type="range"
          min="1"
          max="5"
          step="1"
          value={displayVal}
          onChange={(e) => handleRatingChange(paramKey, parseInt(e.target.value, 10))}
          className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500 focus:outline-none"
        />

        {/* Number Pills 1, 2, 3, 4, 5 */}
        <div className="flex justify-between items-center text-xs font-bold pt-0.5">
          {[1, 2, 3, 4, 5].map((num) => {
            const isSelected = currentVal === num;
            return (
              <button
                type="button"
                key={num}
                onClick={() => handleRatingChange(paramKey, num)}
                className={`w-8 h-7 rounded-lg border transition-all text-xs font-bold flex items-center justify-center ${
                  isSelected
                    ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/20 scale-105'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
                title={`${num} - ${RATING_DESCRIPTIONS[num]}`}
              >
                {num}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const currentSpeed = SPEED_OPTIONS[speedIndex];
  const speedMeta = SPEED_CONFIG[currentSpeed];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header Info */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-black text-slate-850">Give Academic Feedback</h1>
        <p className="text-sm text-slate-500">
          Provide anonymous constructive feedback for faculty members. Ratings and commentary are completely separate from your student records.
        </p>
      </div>

      {/* Message Notifications */}
      {message.text && (
        <div
          className={`p-4 rounded-xl border text-sm flex gap-3 ${
            message.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600'
              : 'bg-rose-500/10 border-rose-500/20 text-rose-600'
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

      {/* Main Feedback Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card Section 1: Session Details */}
        <div className="bg-white border border-slate-200 backdrop-blur-md rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-md font-bold text-slate-850 pb-2 border-b border-slate-200">1. Select Course & Instructor</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Instructor Select */}
            <div className="space-y-2">
              <label htmlFor="faculty" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Faculty Instructor
              </label>
              <select
                id="faculty"
                value={facultyId}
                onChange={(e) => {
                  setFacultyId(e.target.value);
                  if (formErrors.facultyId) setFormErrors({ ...formErrors, facultyId: '' });
                }}
                disabled={loadingFaculties}
                className={`
                  w-full bg-slate-50 border text-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/80 transition text-sm cursor-pointer
                  ${formErrors.facultyId ? 'border-rose-500/60' : 'border-slate-200 hover:border-slate-300'}
                `}
              >
                <option value="">-- Choose Faculty Member --</option>
                {faculties.map((f) => (
                  <option key={f._id} value={f._id}>
                    {f.name} ({f.department} - {f.designation || 'Faculty'})
                  </option>
                ))}
              </select>
              {formErrors.facultyId && (
                <p className="text-xs text-rose-500 font-medium">{formErrors.facultyId}</p>
              )}
            </div>

            {/* Course/Subject name */}
            <div className="space-y-2">
              <label htmlFor="subjectName" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Subject Name / Code
              </label>
              <input
                id="subjectName"
                type="text"
                value={subjectName}
                onChange={(e) => {
                  setSubjectName(e.target.value);
                  if (formErrors.subjectName) setFormErrors({ ...formErrors, subjectName: '' });
                }}
                placeholder="e.g. Distributed Computing (CS-402)"
                className={`
                  w-full bg-slate-50 border text-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/80 transition text-sm
                  ${formErrors.subjectName ? 'border-rose-500/60' : 'border-slate-200 hover:border-slate-300'}
                `}
              />
              {formErrors.subjectName && (
                <p className="text-xs text-rose-500 font-medium">{formErrors.subjectName}</p>
              )}
            </div>

            {/* Academic Year select */}
            <div className="space-y-2">
              <label htmlFor="academicYear" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Academic Year
              </label>
              <select
                id="academicYear"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/80 transition text-sm cursor-pointer"
              >
                <option value="2026-2027">2026-2027</option>
                <option value="2025-2026">2025-2026</option>
                <option value="2027-2028">2027-2028</option>
              </select>
            </div>

            {/* Semester select */}
            <div className="space-y-2">
              <label htmlFor="semester" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Semester Term
              </label>
              <select
                id="semester"
                value={semester}
                onChange={(e) => {
                  setSemester(e.target.value);
                  if (formErrors.semester) setFormErrors({ ...formErrors, semester: '' });
                }}
                className={`
                  w-full bg-slate-50 border text-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/80 transition text-sm cursor-pointer
                  ${formErrors.semester ? 'border-rose-500/60' : 'border-slate-200 hover:border-slate-300'}
                `}
              >
                <option value="">-- Choose Semester --</option>
                <option value="1st Semester">1st Semester (Odd)</option>
                <option value="2nd Semester">2nd Semester (Even)</option>
                <option value="3rd Semester">3rd Semester (Odd)</option>
                <option value="4th Semester">4th Semester (Even)</option>
                <option value="5th Semester">5th Semester (Odd)</option>
                <option value="6th Semester">6th Semester (Even)</option>
                <option value="7th Semester">7th Semester (Odd)</option>
                <option value="8th Semester">8th Semester (Even)</option>
              </select>
              {formErrors.semester && (
                <p className="text-xs text-rose-500 font-medium">{formErrors.semester}</p>
              )}
            </div>
          </div>
        </div>

        {/* Card Section 2: Evaluate Content */}
        <div className="bg-white border border-slate-200 backdrop-blur-md rounded-2xl p-6 shadow-xl space-y-6">
          <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
            <h3 className="text-md font-bold text-slate-850">2. Evaluate Content</h3>
            <span className="text-xs font-semibold text-slate-400">4 Rating Sliders (1-5) + Speed Slider</span>
          </div>

          {/* 4 Clickable 1-5 Sliders */}
          <div className="space-y-5">
            {RATING_PARAMETERS.map((param) => (
              <div key={param.key} className="p-4 bg-slate-50/70 border border-slate-200/80 rounded-xl space-y-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-800">{param.label}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{param.desc}</p>
                </div>
                <SliderRatingSelector paramKey={param.key} currentVal={ratings[param.key]} />
                {formErrors[param.key] && (
                  <p className="text-xs text-rose-500 font-medium">{formErrors[param.key]}</p>
                )}
              </div>
            ))}
          </div>

          {/* Teaching Speed Slider Section (Slow / Normal / Fast) */}
          <div className="p-5 bg-gradient-to-br from-slate-50 to-blue-50/30 border border-blue-100 rounded-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <span>Teaching Speed</span>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${speedMeta.color}`}>
                    {speedMeta.label}
                  </span>
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">{speedMeta.desc}</p>
              </div>
            </div>

            {/* Interactive Range Slider */}
            <div className="pt-2 pb-1 px-2 space-y-3">
              <input
                type="range"
                min="0"
                max="2"
                step="1"
                value={speedIndex}
                onChange={(e) => setSpeedIndex(parseInt(e.target.value, 10))}
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none"
              />

              {/* Slider Track Labels: Slow - Normal - Fast */}
              <div className="flex justify-between items-center text-xs font-bold">
                {SPEED_OPTIONS.map((opt, idx) => {
                  const isActive = idx === speedIndex;
                  return (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => setSpeedIndex(idx)}
                      className={`px-3 py-1 rounded-lg border transition-all text-xs font-bold ${
                        isActive
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20 scale-105'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {opt === 'Slow' && '🐢 Slow'}
                      {opt === 'Normal' && '⚡ Normal'}
                      {opt === 'Fast' && '🚀 Fast'}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Card Section 3: Comments */}
        <div className="bg-white border border-slate-200 backdrop-blur-md rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-md font-bold text-slate-850 pb-2 border-b border-slate-200">3. Constructive Comments</h3>
          <div className="space-y-2">
            <label htmlFor="comments" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Additional Details / Suggestions (Optional)
            </label>
            <textarea
              id="comments"
              rows={4}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Provide constructive feedback regarding pedagogy, assignments, or suggestions for improvement..."
              className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/80 transition text-sm resize-y"
            ></textarea>
            <div className="flex justify-between text-xxs text-slate-400">
              <span>Do not mention your name, roll number, or other identifying information.</span>
              <span>{comments.length} / 1000 chars</span>
            </div>
          </div>
        </div>

        {/* Form Submission Button */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/student/dashboard')}
            className="py-3 px-6 bg-transparent hover:bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-sm font-semibold text-slate-500 hover:text-slate-700 transition"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={submitLoading}
            className="py-3 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 active:translate-y-px transition flex items-center gap-2"
          >
            {submitLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Submitting Feedback...</span>
              </>
            ) : (
              <>
                <span>Submit Feedback Anonymously</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

