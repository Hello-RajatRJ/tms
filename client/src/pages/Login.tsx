import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import {
  CheckSquare2,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Briefcase,
  User as UserIcon,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    try {
      setLoading(true);
      setError('');
      await login(demoEmail, demoPassword);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 transition-colors duration-200 relative">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-indigo-500/25">
            <CheckSquare2 className="w-8 h-8 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Welcome to TMS
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Sign in to access your projects, team workspace, and tasks.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-7 shadow-xl shadow-slate-200/40 dark:shadow-none animate-fade-in space-y-5">
          {error && (
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl flex items-center gap-2.5 text-xs text-rose-700 dark:text-rose-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Sign In to Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Login Chips */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center">
              ⚡ 1-Click Quick Demo Login
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin@tms.io', 'Admin@123')}
                className="p-2 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/60 dark:bg-indigo-950/40 hover:bg-indigo-100/80 text-center transition-all group"
              >
                <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                <p className="text-[11px] font-bold text-indigo-950 dark:text-indigo-200 leading-tight">Admin</p>
                <p className="text-[9px] text-indigo-600 dark:text-indigo-400 font-medium">Full Access</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('manager@tms.io', 'Manager@123')}
                className="p-2 rounded-xl border border-sky-200 dark:border-sky-900/60 bg-sky-50/60 dark:bg-sky-950/40 hover:bg-sky-100/80 text-center transition-all group"
              >
                <Briefcase className="w-4 h-4 text-sky-600 dark:text-sky-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                <p className="text-[11px] font-bold text-sky-950 dark:text-sky-200 leading-tight">Manager</p>
                <p className="text-[9px] text-sky-600 dark:text-sky-400 font-medium">Projects Lead</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('member@tms.io', 'Member@123')}
                className="p-2 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/60 dark:bg-emerald-950/40 hover:bg-emerald-100/80 text-center transition-all group"
              >
                <UserIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                <p className="text-[11px] font-bold text-emerald-950 dark:text-emerald-200 leading-tight">Member</p>
                <p className="text-[9px] text-emerald-600 dark:text-emerald-400 font-medium">Read Only</p>
              </button>
            </div>
          </div>
        </div>

        {/* Sign up prompt */}
        <p className="text-center text-xs text-slate-500 dark:text-slate-400">
          Need a new account?{' '}
          <Link
            to="/register"
            className="font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
