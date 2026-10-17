import React from 'react';
import { AlertCircle, FolderPlus, RefreshCw } from 'lucide-react';

export const LoadingState: React.FC<{ message?: string }> = ({
  message = 'Loading projects and data...',
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="relative mb-4">
        <div className="w-12 h-12 rounded-full border-4 border-[#00A884]/20 border-t-[#00A884] animate-spin" />
      </div>
      <p className="text-sm font-semibold text-[#667781] dark:text-[#8696A0] animate-pulse">{message}</p>
    </div>
  );
};

export const CardSkeletonGrid: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="wa-card rounded-3xl p-5 animate-pulse space-y-4"
        >
          <div className="flex justify-between items-start">
            <div className="h-5 bg-[#E9EDEF] dark:bg-[#2A3942] rounded-xl w-2/3" />
            <div className="h-5 bg-[#E9EDEF] dark:bg-[#2A3942] rounded-full w-20" />
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-[#E9EDEF] dark:bg-[#2A3942] rounded-xl w-full" />
            <div className="h-3 bg-[#E9EDEF] dark:bg-[#2A3942] rounded-xl w-4/5" />
          </div>
          <div className="h-2 bg-[#E9EDEF] dark:bg-[#2A3942] rounded-full w-full" />
          <div className="pt-2 flex justify-between items-center">
            <div className="flex -space-x-2">
              <div className="w-7 h-7 rounded-full bg-[#E9EDEF] dark:bg-[#2A3942]" />
              <div className="w-7 h-7 rounded-full bg-[#E9EDEF] dark:bg-[#2A3942]" />
            </div>
            <div className="h-4 bg-[#E9EDEF] dark:bg-[#2A3942] rounded-xl w-16" />
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
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-3xl my-4">
      <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-3 shadow-xs">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-[#111B21] dark:text-[#E9EDEF] mb-1">
        Something went wrong
      </h3>
      <p className="text-sm text-[#667781] dark:text-[#8696A0] max-w-md mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-2xl shadow-xs transition-colors"
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
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed border-[#E9EDEF] dark:border-[#2A3942] rounded-3xl my-4">
      <div className="w-14 h-14 rounded-3xl bg-[#E7F8F0] dark:bg-[#075E54]/40 flex items-center justify-center text-[#00A884] dark:text-[#25D366] mb-4 shadow-xs">
        <FolderPlus className="w-7 h-7" />
      </div>
      <h3 className="text-base font-bold text-[#111B21] dark:text-[#E9EDEF] mb-1">{title}</h3>
      <p className="text-sm text-[#667781] dark:text-[#8696A0] max-w-sm mb-5">{description}</p>
      {onAction && (
        <button
          onClick={onAction}
          className="wa-btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-2xl"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default LoadingState;
