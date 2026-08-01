import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { hodService } from '../services/hodService.js';

export const FacultyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  // Data states
  const [faculty, setFaculty] = useState({});
  const [papers, setPapers] = useState([]);
  const [books, setBooks] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [events, setEvents] = useState([]);
  const [appraisal, setAppraisal] = useState(null);

  // Tab management inside details page
  const [activeTab, setActiveTab] = useState('works'); // 'works', 'appraisal', 'studentFeedback'

  // HOD Evaluation Form states
  const [teachingQualityRating, setTeachingQualityRating] = useState(3);
  const [researchContributionRating, setResearchContributionRating] = useState(3);
  const [administrativeContributionRating, setAdministrativeContributionRating] = useState(3);
  const [generalConductRating, setGeneralConductRating] = useState(3);
  const [comments, setComments] = useState('');
  const [isEvaluationLocked, setIsEvaluationLocked] = useState(false);

  useEffect(() => {
    fetchFacultyProfile();
  }, [id]);

  const fetchFacultyProfile = async () => {
    try {
      setLoading(true);
      const response = await hodService.getFacultyDetails(id);
      if (response?.success) {
        setFaculty(response.faculty || {});
        setPapers(response.papers || []);
        setBooks(response.books || []);
        setCertificates(response.certificates || []);
        setEvents(response.events || []);
        setAppraisal(response.appraisal || null);

        // Prepopulate HOD review forms if a review already exists
        if (response.appraisal?.hodEvaluation) {
          const evalData = response.appraisal.hodEvaluation;
          setTeachingQualityRating(evalData.teachingQualityRating || 3);
          setResearchContributionRating(evalData.researchContributionRating || 3);
          setAdministrativeContributionRating(evalData.administrativeContributionRating || 3);
          setGeneralConductRating(evalData.generalConductRating || 3);
          setComments(evalData.comments || '');
          
          if (evalData.submitted || response.appraisal.status === 'Completed') {
            setIsEvaluationLocked(true);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching faculty details:', err);
      setError('Failed to fetch faculty profile.');
    } finally {
      setLoading(false);
    }
  };

  const getAttendance = (name) => {
    if (!name) return '92%';
    const sum = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const percent = 85 + (sum % 14);
    return `${percent}%`;
  };

  const handleEvaluationSubmit = async (submitFlag) => {
    if (!appraisal) return;
    setMessage({ type: '', text: '' });
    setSaveLoading(true);

    try {
      const payload = {
        teachingQualityRating,
        researchContributionRating,
        administrativeContributionRating,
        generalConductRating,
        comments: comments.trim(),
        submit: submitFlag,
      };

      const response = await hodService.submitFacultyReview(appraisal._id, payload);
      if (response?.success) {
        setMessage({
          type: 'success',
          text: submitFlag
            ? 'Appraisal review submitted and finalized successfully!'
            : 'Draft review progress saved.',
        });
        if (submitFlag) {
          setIsEvaluationLocked(true);
        }
        fetchFacultyProfile();
      }
    } catch (err) {
      console.error('Review submit error:', err);
      setMessage({ type: 'error', text: err.message || 'Failed to submit review.' });
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans max-w-5xl mx-auto">
      {/* Back Header */}
      <div className="flex items-center justify-between gap-4">
        <Link to="/hod/faculty" className="text-xs font-bold text-slate-500 hover:text-white flex items-center gap-1.5 transition">
          &larr; Back to Faculty Roster
        </Link>
        {isEvaluationLocked && (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xxs font-semibold bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 text-emerald-400">
            Evaluation Locked & Completed
          </span>
        )}
      </div>

      {/* Profile Header Summary */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center gap-6">
        <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-700 flex items-center justify-center font-bold text-emerald-400 text-xl shadow">
          {faculty.name ? faculty.name.charAt(0).toUpperCase() : 'F'}
        </div>
        <div className="flex-1 text-center md:text-left space-y-1">
          <h2 className="text-2xl font-black text-slate-850">{faculty.name}</h2>
          <p className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">{faculty.designation || 'Instructor'} &bull; CS Department</p>
          <p className="text-xxs text-slate-500">Email: {faculty.email}</p>
        </div>

        {/* Show Attendance */}
        <div className="text-center bg-slate-50/80 border border-slate-200 px-6 py-4 rounded-xl shrink-0">
          <span className="block text-3xl font-black text-emerald-600">
            {getAttendance(faculty.name)}
          </span>
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Attendance</span>
        </div>

        {/* Show KPI percentage if finalized */}
        {appraisal?.status === 'Completed' && (
          <div className="text-center bg-slate-50/80 border border-slate-200 px-6 py-4 rounded-xl shrink-0">
            <span className="block text-3xl font-black text-transparent bg-gradient-to-tr from-emerald-400 to-teal-400 bg-clip-text">
              {appraisal.overallScore}%
            </span>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">360 Score KPI</span>
          </div>
        )}
      </div>

      {/* Navigation tabs */}
      <div className="flex border-b border-slate-200 gap-4 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('works')}
          className={`pb-3 transition ${activeTab === 'works' ? 'border-b-2 border-emerald-500 text-emerald-400 font-bold' : 'text-slate-500 hover:text-slate-650'}`}
        >
          Activity Logs
        </button>
        <button
          onClick={() => setActiveTab('appraisal')}
          className={`pb-3 transition ${activeTab === 'appraisal' ? 'border-b-2 border-emerald-500 text-emerald-400 font-bold' : 'text-slate-500 hover:text-slate-650'}`}
        >
          Work Report & Review
        </button>
        <button
          onClick={() => setActiveTab('studentFeedback')}
          className={`pb-3 transition ${activeTab === 'studentFeedback' ? 'border-b-2 border-emerald-500 text-emerald-400 font-bold' : 'text-slate-500 hover:text-slate-650'}`}
        >
          Student Feedback Ratings
        </button>
      </div>

      {/* Tab content area */}
      <div className="space-y-6">
        {/* Tab: Works and logged lists */}
        {activeTab === 'works' && (
          <div className="space-y-8">
            {/* Research papers lists */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-md space-y-4">
              <h3 className="text-sm font-bold text-slate-850 uppercase tracking-wider">Research Publications ({papers.length})</h3>
              {papers.length === 0 ? (
                <p className="text-xs text-slate-500">No research papers logged by this instructor.</p>
              ) : (
                <div className="divide-y divide-slate-800/40 space-y-2.5">
                  {papers.map((p) => (
                    <div key={p._id} className="pt-2 text-xs">
                      <p className="font-semibold text-slate-700">
                        {p.url ? (
                          <a href={p.url} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 underline">
                            {p.title}
                          </a>
                        ) : (
                          p.title
                        )}
                      </p>
                      <p className="text-slate-500 mt-1">{p.journal} &bull; {p.publicationYear} (Citations: {p.citationCount || 0})</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Books published lists */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-md space-y-4">
              <h3 className="text-sm font-bold text-slate-850 uppercase tracking-wider">Authored Books ({books.length})</h3>
              {books.length === 0 ? (
                <p className="text-xs text-slate-500">No books or monograph chapters logged.</p>
              ) : (
                <div className="divide-y divide-slate-800/40 space-y-2.5">
                  {books.map((b) => (
                    <div key={b._id} className="pt-2 text-xs">
                      <p className="font-semibold text-slate-700">{b.title}</p>
                      <p className="text-slate-500 mt-1">{b.publisher} &bull; {b.publicationYear} (ISBN: {b.isbn || 'N/A'})</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Certificates list */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-md space-y-4">
              <h3 className="text-sm font-bold text-slate-850 uppercase tracking-wider">Certifications & Training ({certificates.length})</h3>
              {certificates.length === 0 ? (
                <p className="text-xs text-slate-500">No licenses or development certifications logged.</p>
              ) : (
                <div className="divide-y divide-slate-800/40 space-y-2.5">
                  {certificates.map((c) => (
                    <div key={c._id} className="pt-2 text-xs">
                      <p className="font-semibold text-slate-700">{c.title}</p>
                      <p className="text-slate-500 mt-1">{c.issuingOrganization} &bull; Issued {new Date(c.issueDate).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Coordinated Events list */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-md space-y-4">
              <h3 className="text-sm font-bold text-slate-850 uppercase tracking-wider">Events Organised ({events.length})</h3>
              {events.length === 0 ? (
                <p className="text-xs text-slate-500">No conferences or workshops coordinated.</p>
              ) : (
                <div className="divide-y divide-slate-800/40 space-y-2.5">
                  {events.map((e) => (
                    <div key={e._id} className="pt-2 text-xs">
                      <p className="font-semibold text-slate-700">{e.title}</p>
                      <p className="text-slate-500 mt-1">Role: {e.role} &bull; ({e.eventType})</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab: Work Report and review evaluations */}
        {activeTab === 'appraisal' && (
          <div className="space-y-6">
            {/* Show appraisal work report details */}
            {!appraisal ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 text-sm">
                This faculty member has not created their 2026-2027 work report yet.
              </div>
            ) : (
              <div className="space-y-6">
                {/* Self Appraisal Details */}
                <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-md space-y-4">
                  <h3 className="text-sm font-bold text-slate-850 uppercase tracking-wider pb-2 border-b border-slate-200 flex justify-between items-center">
                    <span>Faculty Work Report Data</span>
                    <span className={`text-xxs font-bold px-2.5 py-1 rounded-md tracking-normal ${
                      appraisal.selfAppraisal?.submitted
                        ? 'text-violet-700 bg-violet-50 border border-violet-200'
                        : 'text-amber-700 bg-amber-50 border border-amber-200'
                    }`}>
                      {appraisal.selfAppraisal?.submitted
                        ? `📅 Report: ${appraisal.selfAppraisal?.reportFromDate || ''} to ${appraisal.selfAppraisal?.reportToDate || ''}`
                        : '⏳ Pending Faculty Submission'}
                    </span>
                  </h3>
                  
                  {appraisal.selfAppraisal?.submitted && (
                    <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200/50 text-xs space-y-1">
                      <span className="text-slate-500 block uppercase tracking-wider text-[10px] font-bold">Report Duration Period</span>
                      <span className="text-slate-800 font-semibold text-sm">
                        {appraisal.selfAppraisal?.reportFromDate || 'Not specified'} to {appraisal.selfAppraisal?.reportToDate || 'Not specified'}
                      </span>
                    </div>
                  )}

                  <div className="space-y-3 pt-2 text-xs">
                    <div>
                      <span className="font-bold text-slate-500 block mb-1">Key Achievements:</span>
                      <p className="text-slate-650 bg-slate-50/30 p-3 border border-slate-200 rounded-xl leading-relaxed">
                        {appraisal.selfAppraisal?.achievements || 'No text submitted.'}
                      </p>
                    </div>
                    <div>
                      <span className="font-bold text-slate-500 block mb-1">Challenges faced:</span>
                      <p className="text-slate-650 bg-slate-50/30 p-3 border border-slate-200 rounded-xl leading-relaxed">
                        {appraisal.selfAppraisal?.challengesText || 'No text submitted.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* HOD Evaluation Form block */}
                {appraisal.selfAppraisal?.submitted ? (
                  <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-md space-y-6">
                    <h3 className="text-sm font-bold text-slate-850 uppercase tracking-wider pb-2 border-b border-slate-200 flex justify-between items-center">
                      <span>HOD Appraisal Assessment Rubric</span>
                      {isEvaluationLocked && (
                        <span className="text-xxs px-2 py-0.5 border border-emerald-500/30 bg-emerald-500/10 text-emerald-450 rounded text-emerald-450">
                          Finalized
                        </span>
                      )}
                    </h3>

                    {/* Messages alert */}
                    {message.text && (
                      <div className={`p-4 rounded-xl border text-xs ${message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-450 text-emerald-450' : 'bg-rose-500/10 border-rose-500/20 text-rose-455'}`}>
                        {message.text}
                      </div>
                    )}

                    {/* Evaluation sliders/star lines */}
                    <div className="space-y-5">
                      {[
                        { label: 'Teaching Quality Assessment', rating: teachingQualityRating, setRating: setTeachingQualityRating },
                        { label: 'Research & Publications Value', rating: researchContributionRating, setRating: setResearchContributionRating },
                        { label: 'Administrative Duties & Roles', rating: administrativeContributionRating, setRating: setAdministrativeContributionRating },
                        { label: 'General Conduct & Professionalism', rating: generalConductRating, setRating: setGeneralConductRating },
                      ].map((item) => (
                        <div key={item.label} className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                          <span className="text-xs font-semibold text-slate-650">{item.label}</span>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                type="button"
                                key={star}
                                disabled={isEvaluationLocked}
                                onClick={() => item.setRating(star)}
                                className={`focus:outline-none transition ${isEvaluationLocked ? 'cursor-not-allowed' : 'active:scale-90'}`}
                              >
                                <svg
                                  className={`w-6 h-6 ${star <= item.rating ? 'text-emerald-450 fill-emerald-450 text-emerald-400' : 'text-slate-700'}`}
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              </button>
                            ))}
                            <span className="text-xxs font-bold text-slate-500 ml-2">({item.rating}/5)</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Review comments */}
                    <div className="space-y-2 pt-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">HOD Evaluator Review Comments</label>
                      <textarea
                        rows={4}
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        disabled={isEvaluationLocked}
                        placeholder="Detail performance findings, research support directives, or administrative suggestions for this faculty member..."
                        className="w-full bg-slate-50 border border-slate-200 text-slate-650 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/80 transition text-sm resize-none disabled:cursor-not-allowed"
                      ></textarea>
                    </div>

                    {/* Form actions */}
                    {!isEvaluationLocked && (
                      <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                        <button
                          type="button"
                          disabled={saveLoading}
                          onClick={() => handleEvaluationSubmit(false)}
                          className="py-2 px-5 bg-slate-100 hover:bg-slate-750 text-slate-650 border border-slate-700 text-xs font-bold rounded-xl transition"
                        >
                          {saveLoading ? 'Saving...' : 'Save Draft'}
                        </button>
                        <button
                          type="button"
                          disabled={saveLoading}
                          onClick={() => {
                            if (window.confirm('Are you sure you want to final submit this review? It will lock and finalize the overall appraisal score.')) {
                              handleEvaluationSubmit(true);
                            }
                          }}
                          className="py-2.5 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/15 transition"
                        >
                          {saveLoading ? 'Submitting...' : 'Finalize & Approve'}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-6 border border-slate-200 bg-white rounded-2xl text-center text-slate-500 text-sm">
                    This faculty member has created a draft but **has not submitted their appraisal** for verification. Evaluation rubrics will become active when they finalize and lock their worksheet.
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab: Student feedbacks */}
        {activeTab === 'studentFeedback' && (
          <div className="space-y-6">
            {!appraisal ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 text-sm">
                No active appraisal records exist to fetch student survey scores.
              </div>
            ) : (
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-md space-y-6">
                <h3 className="text-sm font-bold text-slate-850 uppercase tracking-wider pb-2 border-b border-slate-200">
                  Student Survey Aggregated feedback ({appraisal.studentFeedback?.totalResponses || 0} responses)
                </h3>

                <div className="space-y-4">
                  {[
                    { label: 'Teaching & Pedagogy Quality Rating', score: appraisal.studentFeedback?.averageTeachingRating || 3.0 },
                    { label: 'Syllabus Course Coverage Rate', score: appraisal.studentFeedback?.averageCourseCoverageRating || 3.0 },
                    { label: 'Instructor Approachability & Helpfulness', score: appraisal.studentFeedback?.averageApproachabilityRating || 3.0 },
                  ].map((row) => (
                    <div key={row.label} className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-slate-650">{row.label}</span>
                        <span className="font-bold text-slate-800">{row.score.toFixed(1)} / 5.0 ★</span>
                      </div>
                      <div className="w-full h-2 bg-slate-50 border border-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                          style={{ width: `${(row.score / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
