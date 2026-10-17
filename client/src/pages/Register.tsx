import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import type { UserRole } from '../types';
import {
  CheckSquare2,
  Lock,
  Mail,
  User as UserIcon,
  ArrowRight,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

export const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'member' as UserRole,
    title: 'Software Developer',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await register(formData);
      navigate('/', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F0F2F5] dark:bg-[#111B21] transition-colors duration-200 relative">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#075E54] via-[#128C7E] to-[#25D366] flex items-center justify-center text-white mx-auto shadow-lg shadow-[#00A884]/25">
            <CheckSquare2 className="w-8 h-8 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-black text-[#111B21] dark:text-[#E9EDEF] tracking-tight">
            Create Your Account
          </h1>
          <p className="text-xs text-[#667781] dark:text-[#8696A0]">
            Join the TMS workspace to collaborate on projects.
          </p>
        </div>

        <div className="bg-white dark:bg-[#202C33] border border-[#E9EDEF] dark:border-[#2A3942] rounded-3xl p-7 modal-wa-container animate-fade-in space-y-4 overflow-hidden relative">
          {/* Top Emerald Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#075E54] via-[#00A884] to-[#25D366]" />

          {error && (
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-2xl flex items-center gap-2.5 text-xs text-rose-700 dark:text-rose-400 mt-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5 pt-1">
            <div>
              <label className="block text-xs font-bold text-[#111B21] dark:text-[#E9EDEF] mb-1">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-[#667781] dark:text-[#8696A0] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Jordan Bell"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-2xl border border-[#E9EDEF] dark:border-[#2A3942] bg-[#F0F2F5]/70 dark:bg-[#182229]/60 text-[#111B21] dark:text-[#E9EDEF] wa-input"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111B21] dark:text-[#E9EDEF] mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#667781] dark:text-[#8696A0] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-2xl border border-[#E9EDEF] dark:border-[#2A3942] bg-[#F0F2F5]/70 dark:bg-[#182229]/60 text-[#111B21] dark:text-[#E9EDEF] wa-input"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111B21] dark:text-[#E9EDEF] mb-1">
                Password (min. 6 characters)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#667781] dark:text-[#8696A0] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-2xl border border-[#E9EDEF] dark:border-[#2A3942] bg-[#F0F2F5]/70 dark:bg-[#182229]/60 text-[#111B21] dark:text-[#E9EDEF] wa-input"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-bold text-[#111B21] dark:text-[#E9EDEF] mb-1">
                  Assigned Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 text-xs font-bold rounded-2xl border border-[#E9EDEF] dark:border-[#2A3942] bg-[#F0F2F5]/70 dark:bg-[#182229]/60 text-[#111B21] dark:text-[#E9EDEF] wa-input cursor-pointer"
                >
                  <option value="member">Member (Read Only)</option>
                  <option value="manager">Manager (Manage Projects)</option>
                  <option value="admin">Admin (Full Control)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111B21] dark:text-[#E9EDEF] mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Lead Engineer"
                  className="w-full px-3 py-2.5 text-xs font-medium rounded-2xl border border-[#E9EDEF] dark:border-[#2A3942] bg-[#F0F2F5]/70 dark:bg-[#182229]/60 text-[#111B21] dark:text-[#E9EDEF] wa-input"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="wa-btn-primary w-full py-3 px-4 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-[#667781] dark:text-[#8696A0]">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-bold text-[#00A884] dark:text-[#25D366] hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
