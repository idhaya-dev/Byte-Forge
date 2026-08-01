import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { hodService } from '../services/hodService.js';

export const FacultyManagement = () => {
  const [faculties, setFaculties] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFacultyList();
  }, []);

  const fetchFacultyList = async () => {
    try {
      setLoading(true);
      const response = await hodService.getDepartmentFaculty();
      if (response?.success) {
        setFaculties(response.faculties || []);
      }
    } catch (err) {
      console.error('Error fetching department faculty:', err);
      setError('Failed to fetch faculty list.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-500/10 text-emerald-450 border-emerald-500/20';
      case 'Submitted By Faculty':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Under Review By HOD':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Draft':
        return 'bg-slate-100 text-slate-500 border-slate-700';
      default:
        return 'bg-white text-slate-500 border-slate-200';
    }
  };

  const filteredFaculties = faculties.filter((fac) => {
    const matchesSearch =
      fac.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fac.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fac.designation.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || fac.appraisalStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-850">Faculty Management</h1>
        <p className="text-sm text-slate-500">Review appraisal worksheets, self evaluation ratings, and performance details of your department roster.</p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
          {error}
        </div>
      )}

      {/* Roster Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 border border-slate-200 rounded-2xl">
        <div className="relative w-full sm:max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, email or role..."
            className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 text-white placeholder-slate-400 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label className="text-xs text-slate-500 shrink-0 uppercase tracking-widest font-semibold">Status Filter</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-44 bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-650 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer transition"
          >
            <option value="All">All Statuses</option>
            <option value="Not Started">Not Started</option>
            <option value="Draft">Draft</option>
            <option value="Submitted By Faculty">Submitted By Faculty</option>
            <option value="Under Review By HOD">Under Review By HOD</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Roster Table */}
      {filteredFaculties.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 text-sm">
          No faculty members matching the search query or status criteria.
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/60 border-b border-slate-200 text-slate-500 text-xxs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Instructor Name</th>
                  <th className="px-6 py-4">Designation</th>
                  <th className="px-6 py-4">Self Evaluation</th>
                  <th className="px-6 py-4">Appraisal Status</th>
                  <th className="px-6 py-4">Score (KPI)</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-sm text-slate-650">
                {filteredFaculties.map((fac) => (
                  <tr key={fac._id} className="hover:bg-slate-50/20 transition">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-slate-700">{fac.name}</p>
                        <p className="text-xxs text-slate-500">{fac.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-500">{fac.designation}</td>
                    <td className="px-6 py-4 text-xs font-semibold">
                      {fac.selfRating ? (
                        <span className="text-emerald-450">{fac.selfRating} / 5 ★</span>
                      ) : (
                        <span className="text-slate-500">Not Submitted</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${getStatusBadgeClass(fac.appraisalStatus)}`}>
                        {fac.appraisalStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {fac.appraisalStatus === 'Completed' ? (
                        <span className="text-sm font-black text-transparent bg-gradient-to-tr from-emerald-450 to-teal-450 bg-clip-text text-emerald-400">
                          {fac.overallScore}%
                        </span>
                      ) : (
                        <span className="text-xs text-slate-500 font-medium">Pending Review</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/hod/faculty/${fac._id}`}
                        className={`
                          inline-flex items-center justify-center gap-1 py-1.5 px-4 font-bold text-xxs rounded-lg border transition duration-150
                          ${fac.appraisalStatus === 'Submitted By Faculty' || fac.appraisalStatus === 'Under Review By HOD'
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-600 hover:border-emerald-500 shadow-sm shadow-emerald-500/10'
                            : 'bg-transparent hover:bg-slate-100 text-slate-500 hover:text-slate-700 border-slate-200'
                          }
                        `}
                      >
                        {fac.appraisalStatus === 'Submitted By Faculty' || fac.appraisalStatus === 'Under Review By HOD'
                          ? 'Review Sheet'
                          : 'View Profile'}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
