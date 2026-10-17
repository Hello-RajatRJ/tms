import React from 'react';
import { AlertCircle, FolderPlus, RefreshCw } from 'lucide-react';

export const LoadingState: React.FC<{ message?: string }> = ({
  message = 'Loading projects and data...',
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="relative mb-4">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-100 dark:border-indigo-950 border-t-indigo-600 animate-spin" />
      </div>
      <p className="text-sm font-medium text-slate-600 dark:text-slate-400 animate-pulse">{message}</p>
    </div>
  );
};

export const CardSkeletonGrid: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs animate-pulse space-y-4"
        >
          <div className="flex justify-between items-start">
            <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
            <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-full w-20" />
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full" />
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-4/5" />
          </div>
          <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full w-full" />
          <div className="pt-2 flex justify-between items-center">
            <div className="flex -space-x-2">
              <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800" />
              <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800" />
            </div>
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-16" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const ErrorState: React.FC<{
  message?: string;
  onRetry?: () => void;
}> = ({ message = 'Failed to load data', onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-2xl my-4">
      <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1">
        Something went wrong
      </h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Try Again
        </button>
      )}
    </div>
  );
};

export const EmptyState: React.FC<{
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}> = ({
  title = 'No items found',
  description = 'Get started by creating your first record.',
  actionText = 'Create New',
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl my-4">
      <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4 shadow-xs">
        <FolderPlus className="w-7 h-7" />
      </div>
      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-5">{description}</p>
      {onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition-all hover:shadow hover:scale-[1.02]"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default LoadingState;
