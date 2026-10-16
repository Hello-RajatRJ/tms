import React from 'react';

export const StatusBadge = ({ value, type = 'status', size = 'md' }) => {
  if (!value) return null;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-medium',
    lg: 'text-sm px-3 py-1.5 font-medium',
  };

  const getStyles = () => {
    const val = String(value).toLowerCase();

    // Priority styles
    if (type === 'priority') {
      switch (val) {
        case 'urgent':
          return {
            bg: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-800/60',
            dot: 'bg-rose-500',
          };
        case 'high':
          return {
            bg: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/50 dark:text-orange-400 dark:border-orange-800/60',
            dot: 'bg-orange-500',
          };
        case 'medium':
          return {
            bg: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/50 dark:text-sky-400 dark:border-sky-800/60',
            dot: 'bg-sky-500',
          };
        case 'low':
        default:
          return {
            bg: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
            dot: 'bg-slate-400',
          };
      }
    }

    // Status styles (Project or Team Member)
    switch (val) {
      case 'completed':
      case 'active':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800/60',
          dot: 'bg-emerald-500',
        };
      case 'in progress':
        return {
          bg: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-800/60',
          dot: 'bg-blue-500',
        };
      case 'planning':
      case 'on leave':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800/60',
          dot: 'bg-amber-500',
        };
      case 'on hold':
      case 'inactive':
      default:
        return {
          bg: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
          dot: 'bg-slate-400',
        };
    }
  };

  const { bg, dot } = getStyles();

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border transition-all ${bg} ${
        sizeClasses[size] || sizeClasses.md
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      <span>{value}</span>
    </span>
  );
};

export default StatusBadge;
