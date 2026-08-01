import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService.js';

export const StudentRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    registerNumber: '',
    department: '',
    year: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState('');

  const departments = [
    'Computer Science',
    'Information Technology',
    'Electronics & Communication',
    'Electrical & Electronics',
    'Mechanical Engineering',
    'Civil Engineering',
  ];

  const years = [
    '1st Year',
    '2nd Year',
    '3rd Year',
    '4th Year',
  ];

  const handleInputChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const errors = {};
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

    if (!formData.name.trim()) {
      errors.name = 'Full Name is required';
    }

    if (!formData.registerNumber.trim()) {
      errors.registerNumber = 'Register Number is required';
    }

    if (!formData.department) {
      errors.department = 'Department selection is required';
    }

    if (!formData.year) {
      errors.year = 'Year selection is required';
    }

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        name: formData.name.trim(),
        registerNumber: formData.registerNumber.trim(),
        department: formData.department,
        year: formData.year,
        email: formData.email.trim(),
        password: formData.password,
      };

      const response = await authService.registerStudent(payload);
      if (response?.success) {
        setSuccessMsg('Registration successful! Redirecting to login page...');
        setTimeout(() => {
          navigate('/login');
        }, 2500);
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Decorative Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-slate-100 rounded-full blur-3xl -z-10"></div>

      {/* Main Container */}
      <div className="w-full max-w-lg">
        {/* Logo Section */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-black text-xl shadow-lg mb-3">
            360
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-800 mb-1">
            Academic 360°
          </h1>
          <p className="text-xs font-semibold tracking-wider text-blue-600 uppercase">
            Create Student Account
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-xl">
          {error && (
            <div className="mb-5 p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-605 text-rose-600 text-sm flex gap-2 items-start">
              <svg className="w-5 h-5 shrink-0 text-rose-550" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-5 p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm flex gap-2 items-center">
              <svg className="w-5 h-5 shrink-0 text-emerald-550" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Grid 1: Name and Register Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g. John Doe"
                  className={`
                    w-full px-3 py-2 bg-white border rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition text-sm
                    ${fieldErrors.name ? 'border-rose-450 ring-1 ring-rose-500/10' : 'border-slate-200 hover:border-slate-350'}
                  `}
                />
                {fieldErrors.name && (
                  <p className="mt-1 text-[11px] text-rose-500 font-medium">{fieldErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                  Register Number
                </label>
                <input
                  type="text"
                  value={formData.registerNumber}
                  onChange={(e) => handleInputChange('registerNumber', e.target.value)}
                  placeholder="e.g. CS2026004"
                  className={`
                    w-full px-3 py-2 bg-white border rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition text-sm
                    ${fieldErrors.registerNumber ? 'border-rose-450 ring-1 ring-rose-500/10' : 'border-slate-200 hover:border-slate-350'}
                  `}
                />
                {fieldErrors.registerNumber && (
                  <p className="mt-1 text-[11px] text-rose-500 font-medium">{fieldErrors.registerNumber}</p>
                )}
              </div>
            </div>

            {/* Grid 2: Department and Year */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                  Department
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  className={`
                    w-full px-3 py-2.5 bg-white border rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition text-sm cursor-pointer
                    ${fieldErrors.department ? 'border-rose-450' : 'border-slate-200 hover:border-slate-350'}
                  `}
                >
                  <option value="">Select Department</option>
                  {departments.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                {fieldErrors.department && (
                  <p className="mt-1 text-[11px] text-rose-500 font-medium">{fieldErrors.department}</p>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                  Year
                </label>
                <select
                  value={formData.year}
                  onChange={(e) => handleInputChange('year', e.target.value)}
                  className={`
                    w-full px-3 py-2.5 bg-white border rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition text-sm cursor-pointer
                    ${fieldErrors.year ? 'border-rose-450' : 'border-slate-200 hover:border-slate-350'}
                  `}
                >
                  <option value="">Select Year</option>
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
                {fieldErrors.year && (
                  <p className="mt-1 text-[11px] text-rose-500 font-medium">{fieldErrors.year}</p>
                )}
              </div>
            </div>

            {/* Email (Full Width) */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="student@university.edu"
                className={`
                  w-full px-3 py-2 bg-white border rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition text-sm
                  ${fieldErrors.email ? 'border-rose-450 ring-1 ring-rose-500/10' : 'border-slate-200 hover:border-slate-350'}
                `}
              />
              {fieldErrors.email && (
                <p className="mt-1 text-[11px] text-rose-500 font-medium">{fieldErrors.email}</p>
              )}
            </div>

            {/* Grid 3: Password and Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="••••••••"
                  className={`
                    w-full px-3 py-2 bg-white border rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition text-sm
                    ${fieldErrors.password ? 'border-rose-450 ring-1 ring-rose-500/10' : 'border-slate-200 hover:border-slate-350'}
                  `}
                />
                {fieldErrors.password && (
                  <p className="mt-1 text-[11px] text-rose-500 font-medium">{fieldErrors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="••••••••"
                  className={`
                    w-full px-3 py-2 bg-white border rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition text-sm
                    ${fieldErrors.confirmPassword ? 'border-rose-450 ring-1 ring-rose-500/10' : 'border-slate-200 hover:border-slate-350'}
                  `}
                />
                {fieldErrors.confirmPassword && (
                  <p className="mt-1 text-[11px] text-rose-500 font-medium">{fieldErrors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg active:translate-y-px transition flex justify-center items-center gap-2 text-sm"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign Up</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Redirection Link */}
          <div className="mt-6 text-center text-xs">
            <span className="text-slate-500">Already have an account? </span>
            <Link to="/login" className="font-semibold text-blue-600 hover:underline transition">
              Sign In
            </Link>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center text-xxs text-slate-400">
          <p>Registration credentials are secure. Academic 360° uses industry standard SHA-256 password hashing logic.</p>
        </div>
      </div>
    </div>
  );
};
