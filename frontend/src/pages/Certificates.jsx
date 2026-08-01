import React, { useEffect, useState } from 'react';
import { facultyService } from '../services/facultyService.js';

export const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  // Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    issuingOrganization: '',
    issueDate: '',
    expirationDate: '',
    credentialId: '',
    credentialUrl: '',
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const response = await facultyService.getCertificates();
      if (response?.success) {
        setCertificates(response.certificates || []);
      }
    } catch (err) {
      console.error('Error fetching certificates:', err);
      setError('Failed to fetch certificates.');
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
    if (!formData.issuingOrganization.trim()) errors.issuingOrganization = 'Issuing organization is required';
    if (!formData.issueDate) errors.issueDate = 'Issue date is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      title: '',
      issuingOrganization: '',
      issueDate: '',
      expirationDate: '',
      credentialId: '',
      credentialUrl: '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cert) => {
    setEditingId(cert._id);
    setFormData({
      title: cert.title,
      issuingOrganization: cert.issuingOrganization,
      issueDate: cert.issueDate ? new Date(cert.issueDate).toISOString().split('T')[0] : '',
      expirationDate: cert.expirationDate ? new Date(cert.expirationDate).toISOString().split('T')[0] : '',
      credentialId: cert.credentialId || '',
      credentialUrl: cert.credentialUrl || '',
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
      const payload = {
        ...formData,
        expirationDate: formData.expirationDate || undefined,
      };

      if (editingId) {
        response = await facultyService.updateCertificate(editingId, payload);
      } else {
        response = await facultyService.createCertificate(payload);
      }

      if (response?.success) {
        setMessage({
          type: 'success',
          text: editingId ? 'Certificate updated successfully!' : 'Certificate recorded successfully!',
        });
        setIsModalOpen(false);
        fetchCertificates();
      }
    } catch (err) {
      console.error('Submit certificate error:', err);
      setMessage({ type: 'error', text: err.message || 'Failed to submit certificate.' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this certificate?')) return;
    setMessage({ type: '', text: '' });

    try {
      const response = await facultyService.deleteCertificate(id);
      if (response?.success) {
        setMessage({ type: 'success', text: 'Certificate record deleted.' });
        fetchCertificates();
      }
    } catch (err) {
      console.error('Delete cert error:', err);
      setMessage({ type: 'error', text: err.message || 'Failed to delete certificate.' });
    }
  };

  if (loading && certificates.length === 0) {
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
          <h1 className="text-2xl font-black text-slate-850">Certifications & FDP</h1>
          <p className="text-sm text-slate-500">Log professional training certificates, license courses, or faculty development programs.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 py-2.5 px-5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold text-xs rounded-xl shadow-md shadow-violet-600/15 transition active:translate-y-px"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Certificate
        </button>
      </div>

      {/* Messages */}
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

      {/* Certificates list */}
      {certificates.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-4">
          <div className="w-16 h-16 bg-white border border-slate-200 rounded-full flex items-center justify-center mx-auto text-slate-650">
            <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z" />
            </svg>
          </div>
          <div className="max-w-sm mx-auto space-y-1">
            <h3 className="text-slate-850 font-bold">No certificates logged</h3>
            <p className="text-slate-500 text-xs leading-relaxed">Add training credentials, technical certifications, or course certificates to boost your appraisal profile.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <div key={cert._id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-lg flex flex-col justify-between hover:border-slate-300 hover:bg-white transition relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition duration-300"></div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-3">
                  <h4 className="font-bold text-slate-850 text-sm hover:text-violet-400 transition leading-snug">
                    {cert.credentialUrl ? (
                      <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="underline">
                        {cert.title}
                      </a>
                    ) : (
                      cert.title
                    )}
                  </h4>
                </div>
                
                <p className="text-xs text-slate-500 font-semibold">{cert.issuingOrganization}</p>

                <div className="grid grid-cols-2 gap-2 text-xxs p-3 bg-slate-50/40 border border-slate-200/30 rounded-xl">
                  <div>
                    <span className="text-slate-500 block">Issue Date</span>
                    <span className="text-slate-650 font-medium">
                      {new Date(cert.issueDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Expiration</span>
                    <span className="text-slate-650 font-medium">
                      {cert.expirationDate
                        ? new Date(cert.expirationDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })
                        : 'No Expiry'}
                    </span>
                  </div>
                </div>

                {cert.credentialId && (
                  <p className="text-xxs text-slate-500">
                    <span className="font-semibold text-slate-500">ID:</span> {cert.credentialId}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-200 pt-4 mt-5">
                <button onClick={() => handleOpenEdit(cert)} className="py-1.5 px-3.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-855 text-slate-500 hover:text-slate-700 text-xxs font-semibold transition">
                  Edit
                </button>
                <button onClick={() => handleDelete(cert._id)} className="py-1.5 px-3.5 rounded-lg border border-slate-200 hover:border-rose-900/50 hover:bg-rose-955/20 text-slate-500 hover:text-rose-400 text-xxs font-semibold transition">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-50/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative">
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none"></div>

            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-white">
              <h3 className="font-bold text-slate-850 text-md">
                {editingId ? 'Edit Certificate' : 'Add Certificate'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white transition">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Title */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest text-slate-500 font-sans">Certificate Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g. AWS Certified Solutions Architect"
                  className={`w-full bg-slate-50 border text-slate-650 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/80 transition text-sm ${
                    formErrors.title ? 'border-rose-500/60' : 'border-slate-200'
                  }`}
                />
                {formErrors.title && <p className="text-xxs text-rose-450 font-medium">{formErrors.title}</p>}
              </div>

              {/* Issuing Org */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest text-slate-500 font-sans">Issuing Organization</label>
                <input
                  type="text"
                  value={formData.issuingOrganization}
                  onChange={(e) => handleInputChange('issuingOrganization', e.target.value)}
                  placeholder="e.g. Amazon Web Services (AWS)"
                  className={`w-full bg-slate-50 border text-slate-650 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/80 transition text-sm ${
                    formErrors.issuingOrganization ? 'border-rose-500/60' : 'border-slate-200'
                  }`}
                />
                {formErrors.issuingOrganization && <p className="text-xxs text-rose-450 font-medium">{formErrors.issuingOrganization}</p>}
              </div>

              {/* Grid: Issue Date & Expiry Date */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest text-slate-500 font-sans">Issue Date</label>
                  <input
                    type="date"
                    value={formData.issueDate}
                    onChange={(e) => handleInputChange('issueDate', e.target.value)}
                    className={`w-full bg-slate-50 border text-slate-650 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/80 transition text-sm text-slate-500 ${
                      formErrors.issueDate ? 'border-rose-500/60' : 'border-slate-200'
                    }`}
                  />
                  {formErrors.issueDate && <p className="text-xxs text-rose-450 font-medium">{formErrors.issueDate}</p>}
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest text-slate-500 font-sans">Expiration Date (Optional)</label>
                  <input
                    type="date"
                    value={formData.expirationDate}
                    onChange={(e) => handleInputChange('expirationDate', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-650 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/80 transition text-sm text-slate-500"
                  />
                </div>
              </div>

              {/* Credential ID */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest text-slate-500 font-sans">Credential ID</label>
                <input
                  type="text"
                  value={formData.credentialId}
                  onChange={(e) => handleInputChange('credentialId', e.target.value)}
                  placeholder="e.g. AWS-12345678"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-650 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/80 transition text-sm"
                />
              </div>

              {/* Credential Link */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest text-slate-500 font-sans">Verification URL</label>
                <input
                  type="url"
                  value={formData.credentialUrl}
                  onChange={(e) => handleInputChange('credentialUrl', e.target.value)}
                  placeholder="e.g. https://www.credly.com/..."
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/80 transition text-sm"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="py-2 px-5 bg-transparent hover:bg-slate-100 border border-slate-200 text-slate-500 text-xs font-semibold rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-6 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold text-xs rounded-xl shadow-md transition"
                >
                  {editingId ? 'Save Changes' : 'Log Certificate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
