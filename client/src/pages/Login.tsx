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
            Welcome to TMS
          </h1>
          <p className="text-xs text-[#667781] dark:text-[#8696A0]">
            Sign in to access your projects, team workspace, and tasks.
          </p>
        </div>

        <div className="bg-white dark:bg-[#202C33] border border-[#E9EDEF] dark:border-[#2A3942] rounded-3xl p-7 modal-wa-container animate-fade-in space-y-5 overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#075E54] via-[#00A884] to-[#25D366]" />

          {error && (
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-2xl flex items-center gap-2.5 text-xs text-rose-700 dark:text-rose-400 mt-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 pt-1">
            <div>
              <label className="block text-xs font-bold text-[#111B21] dark:text-[#E9EDEF] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#667781] dark:text-[#8696A0] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@tms.io"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-2xl border border-[#E9EDEF] dark:border-[#2A3942] bg-[#F0F2F5]/70 dark:bg-[#182229]/60 text-[#111B21] dark:text-[#E9EDEF] wa-input"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111B21] dark:text-[#E9EDEF] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#667781] dark:text-[#8696A0] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-2xl border border-[#E9EDEF] dark:border-[#2A3942] bg-[#F0F2F5]/70 dark:bg-[#182229]/60 text-[#111B21] dark:text-[#E9EDEF] wa-input"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="wa-btn-primary w-full py-3 px-4 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-50"
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

          <div className="pt-4 border-t border-[#E9EDEF] dark:border-[#2A3942] space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#667781] dark:text-[#8696A0] text-center">
              ⚡ 1-Click Quick Demo Login
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin@tms.io', 'Admin@123')}
                className="p-2.5 rounded-2xl border border-[#00A884]/30 bg-[#E7F8F0] dark:bg-[#075E54]/40 hover:bg-[#00A884]/20 text-center transition-all group"
              >
                <ShieldCheck className="w-4 h-4 text-[#00A884] dark:text-[#25D366] mx-auto mb-1 group-hover:scale-110 transition-transform" />
                <p className="text-[11px] font-bold text-[#111B21] dark:text-[#E9EDEF] leading-tight">Admin</p>
                <p className="text-[9px] text-[#00A884] dark:text-[#25D366] font-semibold">Full Access</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('manager@tms.io', 'Manager@123')}
                className="p-2.5 rounded-2xl border border-[#128C7E]/30 bg-[#F0F2F5] dark:bg-[#202C33] hover:bg-[#E9EDEF] dark:hover:bg-[#2A3942] text-center transition-all group"
              >
                <Briefcase className="w-4 h-4 text-[#128C7E] dark:text-[#25D366] mx-auto mb-1 group-hover:scale-110 transition-transform" />
                <p className="text-[11px] font-bold text-[#111B21] dark:text-[#E9EDEF] leading-tight">Manager</p>
                <p className="text-[9px] text-[#128C7E] dark:text-[#25D366] font-semibold">Projects Lead</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('member@tms.io', 'Member@123')}
                className="p-2.5 rounded-2xl border border-[#25D366]/30 bg-[#E7F8F0] dark:bg-[#075E54]/30 hover:bg-[#25D366]/20 text-center transition-all group"
              >
                <UserIcon className="w-4 h-4 text-[#00A884] dark:text-[#25D366] mx-auto mb-1 group-hover:scale-110 transition-transform" />
                <p className="text-[11px] font-bold text-[#111B21] dark:text-[#E9EDEF] leading-tight">Member</p>
                <p className="text-[9px] text-[#00A884] dark:text-[#25D366] font-semibold">Read Only</p>
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-[#667781] dark:text-[#8696A0]">
          Need a new account?{' '}
          <Link
            to="/register"
            className="font-bold text-[#00A884] dark:text-[#25D366] hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
