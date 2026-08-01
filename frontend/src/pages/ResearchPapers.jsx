import React, { useEffect, useState } from 'react';
import { facultyService } from '../services/facultyService.js';

export const ResearchPapers = () => {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    journal: '',
    publicationYear: new Date().getFullYear(),
    doi: '',
    citationCount: 0,
    url: '',
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchPapers();
  }, []);

  const fetchPapers = async () => {
    try {
      setLoading(true);
      const response = await facultyService.getResearchPapers();
      if (response?.success) {
        setPapers(response.papers || []);
      }
    } catch (err) {
      console.error('Error fetching research papers:', err);
      setError('Failed to fetch research papers.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.journal.trim()) errors.journal = 'Journal name is required';
    if (!formData.publicationYear) {
      errors.publicationYear = 'Publication year is required';
    } else {
      const year = Number(formData.publicationYear);
      if (isNaN(year) || year < 1900 || year > new Date().getFullYear() + 1) {
        errors.publicationYear = 'Invalid publication year';
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      title: '',
      journal: '',
      publicationYear: new Date().getFullYear(),
      doi: '',
      citationCount: 0,
      url: '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (paper) => {
    setEditingId(paper._id);
    setFormData({
      title: paper.title,
      journal: paper.journal,
      publicationYear: paper.publicationYear,
      doi: paper.doi || '',
      citationCount: paper.citationCount || 0,
      url: paper.url || '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    if (!validate()) return;

    try {
      let response;
      if (editingId) {
        response = await facultyService.updateResearchPaper(editingId, formData);
      } else {
        response = await facultyService.createResearchPaper(formData);
      }

      if (response?.success) {
        setMessage({
          type: 'success',
          text: editingId ? 'Research paper updated successfully!' : 'Research paper added successfully!',
        });
        setIsModalOpen(false);
        fetchPapers();
      }
    } catch (err) {
      console.error('Submit paper error:', err);
      setMessage({ type: 'error', text: err.message || 'Failed to submit publication record.' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this research paper?')) return;
    setMessage({ type: '', text: '' });

    try {
      const response = await facultyService.deleteResearchPaper(id);
      if (response?.success) {
        setMessage({ type: 'success', text: 'Research paper deleted successfully.' });
        fetchPapers();
      }
    } catch (err) {
      console.error('Delete paper error:', err);
      setMessage({ type: 'error', text: err.message || 'Failed to delete research paper.' });
    }
  };

  if (loading && papers.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Research Papers</h1>
          <p className="text-sm text-slate-400">Log and manage your journal publications and research works.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 py-2.5 px-5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold text-xs rounded-xl shadow-md shadow-violet-600/15 transition active:translate-y-px"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Research Paper
        </button>
      </div>

      {/* Message Banner */}
      {message.text && (
        <div
          className={`p-4 rounded-xl border text-sm flex gap-3 animate-fade-in ${
            message.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
          }`}
        >
          <p className="flex-1">{message.text}</p>
          <button onClick={() => setMessage({ type: '', text: '' })} className="text-xs font-bold underline focus:outline-none">
            Dismiss
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
          {error}
        </div>
      )}

      {/* Data Table */}
      {papers.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-12 text-center space-y-4">
          <div className="w-16 h-16 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-650">
            <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="max-w-sm mx-auto space-y-1">
            <h3 className="text-white font-bold">No research papers logged</h3>
            <p className="text-slate-400 text-xs leading-relaxed">Add details of your published research works to update your academic performance KPIs.</p>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900/60 border border-slate-800/80 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 text-xxs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Journal</th>
                  <th className="px-6 py-4">Year</th>
                  <th className="px-6 py-4">Citations</th>
                  <th className="px-6 py-4">DOI</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-sm text-slate-350">
                {papers.map((paper) => (
                  <tr key={paper._id} className="hover:bg-slate-950/30 transition">
                    <td className="px-6 py-4 font-semibold text-white max-w-xs truncate">
                      {paper.url ? (
                        <a href={paper.url} target="_blank" rel="noopener noreferrer" className="hover:text-violet-400 underline transition">
                          {paper.title}
                        </a>
                      ) : (
                        paper.title
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-xs">{paper.journal}</td>
                    <td className="px-6 py-4 text-xs">{paper.publicationYear}</td>
                    <td className="px-6 py-4 text-xs font-semibold">{paper.citationCount}</td>
                    <td className="px-6 py-4 text-xs text-slate-450 truncate max-w-[120px]" title={paper.doi}>
                      {paper.doi || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button onClick={() => handleOpenEdit(paper)} className="p-1.5 rounded-lg border border-slate-800 hover:border-slate-700 hover:bg-slate-850 text-slate-400 hover:text-slate-200 transition">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button onClick={() => handleDelete(paper._id)} className="p-1.5 rounded-lg border border-slate-800 hover:border-rose-900/50 hover:bg-rose-950/20 text-slate-400 hover:text-rose-400 transition">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative">
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none"></div>

            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
              <h3 className="font-bold text-white text-md">
                {editingId ? 'Edit Research Paper' : 'Add Research Paper'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Paper Title */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest text-slate-400">Paper Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g. A Deep Learning Approach to Stock Market Prediction"
                  className={`w-full bg-slate-950 border text-slate-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/80 transition text-sm ${
                    formErrors.title ? 'border-rose-500/60' : 'border-slate-800'
                  }`}
                />
                {formErrors.title && <p className="text-xxs text-rose-400 font-medium">{formErrors.title}</p>}
              </div>

              {/* Journal */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest text-slate-400">Journal Name</label>
                <input
                  type="text"
                  value={formData.journal}
                  onChange={(e) => handleInputChange('journal', e.target.value)}
                  placeholder="e.g. IEEE Transactions on Neural Networks"
                  className={`w-full bg-slate-950 border text-slate-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/80 transition text-sm ${
                    formErrors.journal ? 'border-rose-500/60' : 'border-slate-800'
                  }`}
                />
                {formErrors.journal && <p className="text-xxs text-rose-400 font-medium">{formErrors.journal}</p>}
              </div>

              {/* Grid: Year and Citation Count */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest text-slate-400">Publication Year</label>
                  <input
                    type="number"
                    value={formData.publicationYear}
                    onChange={(e) => handleInputChange('publicationYear', e.target.value)}
                    className={`w-full bg-slate-950 border text-slate-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/80 transition text-sm ${
                      formErrors.publicationYear ? 'border-rose-500/60' : 'border-slate-800'
                    }`}
                  />
                  {formErrors.publicationYear && <p className="text-xxs text-rose-400 font-medium">{formErrors.publicationYear}</p>}
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest text-slate-400">Citation Count</label>
                  <input
                    type="number"
                    value={formData.citationCount}
                    onChange={(e) => handleInputChange('citationCount', Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/80 transition text-sm"
                  />
                </div>
              </div>

              {/* DOI */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest text-slate-400">DOI (Digital Object Identifier)</label>
                <input
                  type="text"
                  value={formData.doi}
                  onChange={(e) => handleInputChange('doi', e.target.value)}
                  placeholder="e.g. 10.1109/TNNLS.2026.12345"
                  className="w-full bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/80 transition text-sm"
                />
              </div>

              {/* Paper Link */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest text-slate-400">Publication URL</label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => handleInputChange('url', e.target.value)}
                  placeholder="e.g. https://ieeexplore.ieee.org/document/..."
                  className="w-full bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/80 transition text-sm"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="py-2 px-5 bg-transparent hover:bg-slate-800 border border-slate-800 text-slate-450 text-xs font-semibold rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-6 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold text-xs rounded-xl shadow-md transition"
                >
                  {editingId ? 'Save Changes' : 'Publish Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
