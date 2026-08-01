import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { studentService } from '../services/studentService.js';

export const FeedbackHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await studentService.getFeedbackHistory();
        setHistory(response?.history || []);
      } catch (err) {
        console.error('Error fetching feedback history:', err);
        setError('Failed to retrieve feedback history logs.');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filteredHistory = history.filter((item) => {
    const nameMatch = item.facultyId?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const subjectMatch = item.subjectName?.toLowerCase().includes(searchQuery.toLowerCase());
    const deptMatch = item.facultyId?.department?.toLowerCase().includes(searchQuery.toLowerCase());
    return nameMatch || subjectMatch || deptMatch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-500"></div>
          <p className="text-sm text-slate-500">Loading submission logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-850">Feedback Submission Logs</h1>
          <p className="text-sm text-slate-500">
            A comprehensive history of evaluation questionnaires you have completed.
          </p>
        </div>

        {/* Search Input */}
        {history.length > 0 && (
          <div className="relative w-full md:w-80">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search faculty, subject, department..."
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/80 transition text-sm rounded-xl text-slate-700 placeholder-slate-500"
            />
          </div>
        )}
      </div>

      {/* Security alert regarding anonymity */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs text-slate-500 flex items-start gap-3">
        <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 shrink-0">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <div>
          <p className="font-bold text-slate-650">Anonymity Safeguard Policy</p>
          <p className="mt-1 leading-relaxed">
            The items in the log below show only the date, course, and instructor you evaluated. This prevents you from submitting duplicate evaluations. The database does **not** link these logs with the actual scores, ratings, or comment fields, ensuring complete confidentiality.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
          {error}
        </div>
      )}

      {/* Main Table or Card View */}
      {filteredHistory.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-4">
          <div className="w-16 h-16 bg-white border border-slate-200 rounded-full flex items-center justify-center mx-auto text-slate-600">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <div className="space-y-2 max-w-sm mx-auto">
            <h3 className="text-slate-850 font-bold">No evaluation logs found</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              {searchQuery ? 'No match found for your search term. Try checking for typos or searching general terms.' : "You haven't submitted any feedback evaluations for this term yet."}
            </p>
          </div>
          {!searchQuery && (
            <Link
              to="/student/feedback"
              className="inline-flex items-center gap-2 py-2 px-5 bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs rounded-xl shadow-md shadow-brand-600/10 transition mt-2"
            >
              Start Evaluating Faculty
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden">
          {/* Table view (Desktop) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/60 border-b border-slate-200 text-slate-500 text-xxs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Faculty Instructor</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Course / Subject Name</th>
                  <th className="px-6 py-4">Term</th>
                  <th className="px-6 py-4">Date Completed</th>
                  <th className="px-6 py-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-sm text-slate-650">
                {filteredHistory.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/30 transition">
                    <td className="px-6 py-4 font-semibold text-white">
                      {item.facultyId?.name || 'Unknown Faculty'}
                      <span className="block text-xxs text-slate-500 font-normal">
                        {item.facultyId?.designation || 'Instructor'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {item.facultyId?.department || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-650">
                      {item.subjectName}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      <div>{item.academicYear}</div>
                      <div className="text-xxs text-slate-500">{item.semester}</div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {new Date(item.submittedAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        Anonymous Submitted
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Card list view (Mobile) */}
          <div className="md:hidden divide-y divide-slate-800/60">
            {filteredHistory.map((item) => (
              <div key={item._id} className="p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-850 text-sm">
                      {item.facultyId?.name || 'Unknown Faculty'}
                    </h4>
                    <p className="text-xxs text-slate-500">
                      {item.facultyId?.department || 'N/A'} &bull; {item.facultyId?.designation || 'Instructor'}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-semibold">
                    Anonymous
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xxs p-3 bg-slate-50/40 rounded-xl border border-slate-200/40">
                  <div>
                    <span className="text-slate-500 block">Subject</span>
                    <span className="text-slate-650 font-medium">{item.subjectName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Academic Term</span>
                    <span className="text-slate-650 font-medium">
                      {item.academicYear} ({item.semester.split(' ')[0]})
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xxs text-slate-500 pt-1">
                  <span>Completed on:</span>
                  <span>
                    {new Date(item.submittedAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
