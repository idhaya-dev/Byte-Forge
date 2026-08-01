import React, { useEffect, useState } from 'react';
import { facultyService } from '../services/facultyService.js';

export const EventsOrganised = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  // Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    eventType: 'Workshop',
    startDate: '',
    endDate: '',
    role: 'Coordinator',
    description: '',
  });
  const [formErrors, setFormErrors] = useState({});

  const eventTypes = ['Workshop', 'Conference', 'Seminar', 'Webinar', 'FDP'];
  const roles = ['Coordinator', 'Convenor', 'Co-coordinator', 'Organizer'];

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await facultyService.getEvents();
      if (response?.success) {
        setEvents(response.events || []);
      }
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to fetch organized events.');
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
    if (!formData.eventType) errors.eventType = 'Event type is required';
    if (!formData.startDate) errors.startDate = 'Start date is required';
    if (!formData.endDate) errors.endDate = 'End date is required';
    if (!formData.role) errors.role = 'Role selection is required';
    
    if (formData.startDate && formData.endDate) {
      if (new Date(formData.startDate) > new Date(formData.endDate)) {
        errors.endDate = 'End date must be on or after start date';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      title: '',
      eventType: 'Workshop',
      startDate: '',
      endDate: '',
      role: 'Coordinator',
      description: '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (event) => {
    setEditingId(event._id);
    setFormData({
      title: event.title,
      eventType: event.eventType,
      startDate: event.startDate ? new Date(event.startDate).toISOString().split('T')[0] : '',
      endDate: event.endDate ? new Date(event.endDate).toISOString().split('T')[0] : '',
      role: event.role,
      description: event.description || '',
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
        response = await facultyService.updateEvent(editingId, formData);
      } else {
        response = await facultyService.createEvent(formData);
      }

      if (response?.success) {
        setMessage({
          type: 'success',
          text: editingId ? 'Event details updated successfully!' : 'Event logged successfully!',
        });
        setIsModalOpen(false);
        fetchEvents();
      }
    } catch (err) {
      console.error('Submit event error:', err);
      setMessage({ type: 'error', text: err.message || 'Failed to submit event.' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event record?')) return;
    setMessage({ type: '', text: '' });

    try {
      const response = await facultyService.deleteEvent(id);
      if (response?.success) {
        setMessage({ type: 'success', text: 'Event record deleted.' });
        fetchEvents();
      }
    } catch (err) {
      console.error('Delete event error:', err);
      setMessage({ type: 'error', text: err.message || 'Failed to delete event.' });
    }
  };

  if (loading && events.length === 0) {
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
          <h1 className="text-2xl font-black text-white">Events Organised</h1>
          <p className="text-sm text-slate-400">Log workshops, seminars, and conferences coordinated by you.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 py-2.5 px-5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold text-xs rounded-xl shadow-md shadow-violet-600/15 transition active:translate-y-px"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Event Record
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

      {/* Events List */}
      {events.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-12 text-center space-y-4">
          <div className="w-16 h-16 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-655">
            <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="max-w-sm mx-auto space-y-1">
            <h3 className="text-white font-bold">No events logged</h3>
            <p className="text-slate-400 text-xs leading-relaxed">Add details of workshops or conferences organized under your guidance to update your academic activity score.</p>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900/60 border border-slate-800/80 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 text-xxs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Event Title</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Duration</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-sm text-slate-350">
                {events.map((event) => (
                  <tr key={event._id} className="hover:bg-slate-950/30 transition">
                    <td className="px-6 py-4 font-semibold text-white max-w-xs truncate">{event.title}</td>
                    <td className="px-6 py-4 text-xs">
                      <span className="px-2 py-0.5 rounded bg-violet-500/10 border border-violet-500/25 text-violet-400 font-bold uppercase text-[9px]">
                        {event.eventType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-300">{event.role}</td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {new Date(event.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} -{' '}
                      {new Date(event.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-450 max-w-xxs truncate" title={event.description}>
                      {event.description || 'No description'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button onClick={() => handleOpenEdit(event)} className="p-1.5 rounded-lg border border-slate-800 hover:border-slate-700 hover:bg-slate-850 text-slate-400 hover:text-slate-200 transition">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button onClick={() => handleDelete(event._id)} className="p-1.5 rounded-lg border border-slate-800 hover:border-rose-900/50 hover:bg-rose-950/20 text-slate-400 hover:text-rose-400 transition">
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
                {editingId ? 'Edit Event Details' : 'Add Event Details'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 font-sans">
              {/* Event Title */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-455 uppercase tracking-widest text-slate-400">Event Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g. Workshop on Generative AI and Large Language Models"
                  className={`w-full bg-slate-950 border text-slate-350 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/80 transition text-sm ${
                    formErrors.title ? 'border-rose-500/60' : 'border-slate-800'
                  }`}
                />
                {formErrors.title && <p className="text-xxs text-rose-450 font-medium">{formErrors.title}</p>}
              </div>

              {/* Grid: Type and Role */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-455 uppercase tracking-widest text-slate-400">Event Type</label>
                  <select
                    value={formData.eventType}
                    onChange={(e) => handleInputChange('eventType', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/80 transition text-sm cursor-pointer"
                  >
                    {eventTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-455 uppercase tracking-widest text-slate-400">Your Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/80 transition text-sm cursor-pointer"
                  >
                    {roles.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Grid: Start and End Date */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-455 uppercase tracking-widest text-slate-400">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    className={`w-full bg-slate-950 border text-slate-350 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/80 transition text-sm text-slate-400 ${
                      formErrors.startDate ? 'border-rose-500/60' : 'border-slate-800'
                    }`}
                  />
                  {formErrors.startDate && <p className="text-xxs text-rose-455 font-medium">{formErrors.startDate}</p>}
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-455 uppercase tracking-widest text-slate-400">End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    className={`w-full bg-slate-950 border text-slate-350 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/80 transition text-sm text-slate-400 ${
                      formErrors.endDate ? 'border-rose-500/60' : 'border-slate-800'
                    }`}
                  />
                  {formErrors.endDate && <p className="text-xxs text-rose-455 font-medium">{formErrors.endDate}</p>}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-455 uppercase tracking-widest text-slate-400">Event Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Detail sponsorship funding, attendee counts, guest speakers, or key workshop outcomes..."
                  className="w-full bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/80 transition text-sm resize-none"
                ></textarea>
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
                  {editingId ? 'Save Changes' : 'Log Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
