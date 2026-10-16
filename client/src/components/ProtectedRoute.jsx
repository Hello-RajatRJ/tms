import React, { useEffect } from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Lock, ArrowLeft } from 'lucide-react';
import LoadingState from './LoadingState';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, loading, user, hasRole, checkAuth } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <LoadingState message="Verifying authentication credentials..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && !hasRole(...allowedRoles)) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center shadow-xl animate-fade-in space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 mx-auto shadow-xs">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 px-2.5 py-1 rounded-full">
              Access Restricted
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-3">
              Role Permission Required
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Your account currently has the{' '}
              <strong className="text-slate-800 dark:text-slate-200 uppercase font-bold">
                {user?.role}
              </strong>{' '}
              role. This section requires one of the following permissions:{' '}
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                [{allowedRoles.join(', ')}]
              </span>
              .
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
