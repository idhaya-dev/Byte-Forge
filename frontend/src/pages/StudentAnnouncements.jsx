import React, { useEffect, useState } from 'react';
import { studentService } from '../services/studentService.js';

export const StudentAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await studentService.getAnnouncements();
        setAnnouncements(response?.announcements || []);
      } catch (err) {
        console.error('Error fetching announcements:', err);
        setError('Failed to retrieve announcements list.');
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  const filteredAnnouncements = announcements.filter((ann) => {
    const titleMatch = ann.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const contentMatch = ann.content?.toLowerCase().includes(searchQuery.toLowerCase());
    const posterMatch = ann.postedBy?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return titleMatch || contentMatch || posterMatch;
  });

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-500"></div>
          <p className="text-sm text-slate-400">Fetching announcements board...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Announcements Board</h1>
          <p className="text-sm text-slate-400">
            Important notices and updates concerning evaluations, schedules, and terms.
          </p>
        </div>

        {/* Search Bar */}
        {announcements.length > 0 && (
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
              placeholder="Search announcements..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/80 transition text-sm rounded-xl text-slate-200 placeholder-slate-500"
            />
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
          {error}
        </div>
      )}

      {/* Main List */}
      {filteredAnnouncements.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-12 text-center space-y-4">
          <div className="w-16 h-16 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-600">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <div className="space-y-2 max-w-sm mx-auto">
            <h3 className="text-white font-bold">No announcements to display</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              {searchQuery ? 'Your search query did not yield any results. Try refining your filters.' : 'University administrators or HODs have not posted any bulletins to the student stream.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredAnnouncements.map((ann) => {
            const isExpanded = expandedId === ann._id;
            return (
              <div
                key={ann._id}
                className="bg-slate-900/60 hover:bg-slate-900/80 border border-slate-800/80 backdrop-blur-md rounded-2xl p-6 shadow-lg transition duration-200"
              >
                {/* Meta details */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-indigo-400">
                      {ann.postedBy?.name ? ann.postedBy.name.charAt(0).toUpperCase() : 'A'}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        {ann.postedBy?.name || 'Administrator'}
                      </h4>
                      <p className="text-xxs text-slate-500">
                        {ann.postedBy?.email || 'admin@university.edu'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                      {ann.postedBy?.role || 'Admin'}
                    </span>
                    <span className="text-xxs text-slate-500">
                      {new Date(ann.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-white hover:text-brand-400 transition cursor-pointer" onClick={() => toggleExpand(ann._id)}>
                    {ann.title}
                  </h3>
                  
                  <p className={`text-sm text-slate-300 leading-relaxed whitespace-pre-wrap ${!isExpanded && 'line-clamp-3'}`}>
                    {ann.content}
                  </p>

                  {/* Read More button if text is long */}
                  {ann.content.length > 250 && (
                    <button
                      onClick={() => toggleExpand(ann._id)}
                      className="text-xs font-semibold text-brand-400 hover:text-brand-300 transition flex items-center gap-1 focus:outline-none pt-1"
                    >
                      <span>{isExpanded ? 'Collapse Notice' : 'Read Full Notice'}</span>
                      <svg
                        className={`w-3.5 h-3.5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
