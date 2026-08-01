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
  { key: 'teachingEffectiveness', label: 'Teaching Effectiveness', desc: 'Ability to explain concepts, engage students, and clarify doubts.' },
  { key: 'courseCoverage', label: 'Course Coverage & Pace', desc: 'Coverage of syllabus, pacing of lectures, and depth of explanation.' },
  { key: 'communicationSkills', label: 'Communication Skills', desc: 'Clarity, voice modulation, and language accessibility.' },
  { key: 'punctuality', label: 'Punctuality & Discipline', desc: 'Timeliness in arriving, starting lectures, and returning assignments.' },
  { key: 'supportOutsideClass', label: 'Support Outside Class', desc: 'Availability during office hours, guidance, and project support.' },
];

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
  const [ratings, setRatings] = useState({
    teachingEffectiveness: 0,
    courseCoverage: 0,
    communicationSkills: 0,
    punctuality: 0,
    supportOutsideClass: 0,
  });
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
        errors[param.key] = `Please rate the '${param.label}' parameter`;
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!validateForm()) {
      // Scroll to top or error section
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setSubmitLoading(true);
    try {
      const payload = {
        facultyId,
        academicYear,
        semester,
        subjectName: subjectName.trim(),
        ratings,
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
          teachingEffectiveness: 0,
          courseCoverage: 0,
          communicationSkills: 0,
          punctuality: 0,
          supportOutsideClass: 0,
        });

        // Redirect after delay
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

  // Helper component to render stars for a rating parameter
  const StarRatingSelector = ({ paramKey, currentVal }) => {
    const [hoverVal, setHoverVal] = useState(0);

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              onClick={() => handleRatingChange(paramKey, star)}
              onMouseEnter={() => setHoverVal(star)}
              onMouseLeave={() => setHoverVal(0)}
              className="focus:outline-none transition-transform active:scale-90 duration-100"
            >
              <svg
                className={`w-8 h-8 transition-colors ${
                  star <= (hoverVal || currentVal)
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-slate-700 hover:text-slate-500'
                }`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          ))}
          
          <span className={`text-xs font-semibold px-2 py-0.5 rounded ml-2 transition-colors ${
            currentVal > 0 ? 'bg-amber-400/10 text-amber-400 border border-amber-400/20' : 'text-slate-500'
          }`}>
            {hoverVal || currentVal > 0 ? RATING_DESCRIPTIONS[hoverVal || currentVal] : 'Select Rating'}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header Info */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-black text-white">Give Academic Feedback</h1>
        <p className="text-sm text-slate-400">
          Provide anonymous constructive feedback for faculty members. Ratings and commentary are completely separate from your student records.
        </p>
      </div>

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

      {/* Main Feedback Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card Section 1: Session Details */}
        <div className="bg-slate-900/60 border border-slate-800/80 backdrop-blur-md rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-md font-bold text-white pb-2 border-b border-slate-800">1. Select Course & Instructor</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Instructor Select */}
            <div className="space-y-2">
              <label htmlFor="faculty" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
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
                  w-full bg-slate-950 border text-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/80 transition text-sm cursor-pointer
                  ${formErrors.facultyId ? 'border-rose-500/60' : 'border-slate-800 hover:border-slate-700'}
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
                <p className="text-xs text-rose-400 font-medium">{formErrors.facultyId}</p>
              )}
            </div>

            {/* Course/Subject name */}
            <div className="space-y-2">
              <label htmlFor="subjectName" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
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
                  w-full bg-slate-950 border text-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/80 transition text-sm
                  ${formErrors.subjectName ? 'border-rose-500/60' : 'border-slate-800 hover:border-slate-700'}
                `}
              />
              {formErrors.subjectName && (
                <p className="text-xs text-rose-400 font-medium">{formErrors.subjectName}</p>
              )}
            </div>

            {/* Academic Year select */}
            <div className="space-y-2">
              <label htmlFor="academicYear" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Academic Year
              </label>
              <select
                id="academicYear"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/80 transition text-sm cursor-pointer"
              >
                <option value="2026-2027">2026-2027</option>
                <option value="2025-2026">2025-2026</option>
                <option value="2027-2028">2027-2028</option>
              </select>
            </div>

            {/* Semester select */}
            <div className="space-y-2">
              <label htmlFor="semester" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
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
                  w-full bg-slate-950 border text-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/80 transition text-sm cursor-pointer
                  ${formErrors.semester ? 'border-rose-500/60' : 'border-slate-800 hover:border-slate-700'}
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
                <p className="text-xs text-rose-400 font-medium">{formErrors.semester}</p>
              )}
            </div>
          </div>
        </div>

        {/* Card Section 2: Ratings */}
        <div className="bg-slate-900/60 border border-slate-800/80 backdrop-blur-md rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-md font-bold text-white pb-2 border-b border-slate-800">2. Evaluate Academic Quality</h3>

          <div className="space-y-6">
            {RATING_PARAMETERS.map((param) => (
              <div key={param.key} className="p-4 bg-slate-950/50 border border-slate-800/55 rounded-xl space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div className="max-w-md">
                    <h4 className="text-sm font-bold text-white">{param.label}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{param.desc}</p>
                  </div>
                  <StarRatingSelector paramKey={param.key} currentVal={ratings[param.key]} />
                </div>
                {formErrors[param.key] && (
                  <p className="text-xs text-rose-400 font-medium">{formErrors[param.key]}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Card Section 3: Comments */}
        <div className="bg-slate-900/60 border border-slate-800/80 backdrop-blur-md rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-md font-bold text-white pb-2 border-b border-slate-800">3. Constructive Comments</h3>
          <div className="space-y-2">
            <label htmlFor="comments" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Additional Details / Suggestions (Optional)
            </label>
            <textarea
              id="comments"
              rows={4}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Provide comments regarding pedagogy, assignments, or suggestions for improvement..."
              className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/80 transition text-sm resize-y"
            ></textarea>
            <div className="flex justify-between text-xxs text-slate-500">
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
            className="py-3 px-6 bg-transparent hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl text-sm font-semibold text-slate-400 hover:text-slate-200 transition"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={submitLoading}
            className="py-3 px-8 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-brand-500/20 active:translate-y-px transition flex items-center gap-2"
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
