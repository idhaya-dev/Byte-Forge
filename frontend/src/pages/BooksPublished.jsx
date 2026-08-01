import React, { useEffect, useState } from 'react';
import { facultyService } from '../services/facultyService.js';

export const BooksPublished = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  // Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    publisher: '',
    isbn: '',
    publicationYear: new Date().getFullYear(),
    url: '',
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await facultyService.getBooks();
      if (response?.success) {
        setBooks(response.books || []);
      }
    } catch (err) {
      console.error('Error fetching books:', err);
      setError('Failed to fetch books list.');
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
    if (!formData.publisher.trim()) errors.publisher = 'Publisher is required';
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
      publisher: '',
      isbn: '',
      publicationYear: new Date().getFullYear(),
      url: '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (book) => {
    setEditingId(book._id);
    setFormData({
      title: book.title,
      publisher: book.publisher,
      isbn: book.isbn || '',
      publicationYear: book.publicationYear,
      url: book.url || '',
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
        response = await facultyService.updateBook(editingId, formData);
      } else {
        response = await facultyService.createBook(formData);
      }

      if (response?.success) {
        setMessage({
          type: 'success',
          text: editingId ? 'Book entry updated successfully!' : 'Book publication record added!',
        });
        setIsModalOpen(false);
        fetchBooks();
      }
    } catch (err) {
      console.error('Submit book error:', err);
      setMessage({ type: 'error', text: err.message || 'Failed to submit book publication.' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book publication?')) return;
    setMessage({ type: '', text: '' });

    try {
      const response = await facultyService.deleteBook(id);
      if (response?.success) {
        setMessage({ type: 'success', text: 'Book publication deleted.' });
        fetchBooks();
      }
    } catch (err) {
      console.error('Delete book error:', err);
      setMessage({ type: 'error', text: err.message || 'Failed to delete book.' });
    }
  };

  if (loading && books.length === 0) {
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
          <h1 className="text-2xl font-black text-white">Books Published</h1>
          <p className="text-sm text-slate-400">Log and manage your published text books, research monographs, or book chapters.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 py-2.5 px-5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold text-xs rounded-xl shadow-md shadow-violet-600/15 transition active:translate-y-px"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Book Entry
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

      {/* Books Table */}
      {books.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-12 text-center space-y-4">
          <div className="w-16 h-16 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-650">
            <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div className="max-w-sm mx-auto space-y-1">
            <h3 className="text-white font-bold">No books logged</h3>
            <p className="text-slate-400 text-xs leading-relaxed">Add details of books published or book chapters authored to update your performance metrics.</p>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900/60 border border-slate-800/80 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 text-xxs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Publisher</th>
                  <th className="px-6 py-4">Year</th>
                  <th className="px-6 py-4">ISBN</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-sm text-slate-350">
                {books.map((book) => (
                  <tr key={book._id} className="hover:bg-slate-950/30 transition">
                    <td className="px-6 py-4 font-semibold text-white max-w-xs truncate">
                      {book.url ? (
                        <a href={book.url} target="_blank" rel="noopener noreferrer" className="hover:text-violet-400 underline transition">
                          {book.title}
                        </a>
                      ) : (
                        book.title
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-xs">{book.publisher}</td>
                    <td className="px-6 py-4 text-xs">{book.publicationYear}</td>
                    <td className="px-6 py-4 text-xs text-slate-450">{book.isbn || 'N/A'}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button onClick={() => handleOpenEdit(book)} className="p-1.5 rounded-lg border border-slate-800 hover:border-slate-700 hover:bg-slate-850 text-slate-400 hover:text-slate-200 transition">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button onClick={() => handleDelete(book._id)} className="p-1.5 rounded-lg border border-slate-800 hover:border-rose-900/50 hover:bg-rose-950/20 text-slate-400 hover:text-rose-400 transition">
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
                {editingId ? 'Edit Book Entry' : 'Add Book Entry'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Book Title */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-455 uppercase tracking-widest text-slate-400">Book Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g. Core Principles of Machine Learning"
                  className={`w-full bg-slate-950 border text-slate-350 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/80 transition text-sm ${
                    formErrors.title ? 'border-rose-500/60' : 'border-slate-800'
                  }`}
                />
                {formErrors.title && <p className="text-xxs text-rose-450 font-medium">{formErrors.title}</p>}
              </div>

              {/* Publisher */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-455 uppercase tracking-widest text-slate-400">Publisher</label>
                <input
                  type="text"
                  value={formData.publisher}
                  onChange={(e) => handleInputChange('publisher', e.target.value)}
                  placeholder="e.g. Oxford University Press"
                  className={`w-full bg-slate-950 border text-slate-350 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/80 transition text-sm ${
                    formErrors.publisher ? 'border-rose-500/60' : 'border-slate-800'
                  }`}
                />
                {formErrors.publisher && <p className="text-xxs text-rose-450 font-medium">{formErrors.publisher}</p>}
              </div>

              {/* Grid: Year and ISBN */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-455 uppercase tracking-widest text-slate-400">Publication Year</label>
                  <input
                    type="number"
                    value={formData.publicationYear}
                    onChange={(e) => handleInputChange('publicationYear', e.target.value)}
                    className={`w-full bg-slate-950 border text-slate-350 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/80 transition text-sm ${
                      formErrors.publicationYear ? 'border-rose-500/60' : 'border-slate-800'
                    }`}
                  />
                  {formErrors.publicationYear && <p className="text-xxs text-rose-450 font-medium">{formErrors.publicationYear}</p>}
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-455 uppercase tracking-widest text-slate-400">ISBN</label>
                  <input
                    type="text"
                    value={formData.isbn}
                    onChange={(e) => handleInputChange('isbn', e.target.value)}
                    placeholder="e.g. 978-3-16-148410-0"
                    className="w-full bg-slate-950 border border-slate-800 text-slate-350 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/80 transition text-sm"
                  />
                </div>
              </div>

              {/* Book Link */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-455 uppercase tracking-widest text-slate-400">Book URL</label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => handleInputChange('url', e.target.value)}
                  placeholder="e.g. https://www.amazon.com/..."
                  className="w-full bg-slate-950 border border-slate-800 text-slate-350 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/80 transition text-sm"
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
                  {editingId ? 'Save Changes' : 'Publish Book'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
