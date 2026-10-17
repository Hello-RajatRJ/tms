import React from 'react';

interface StatusBadgeProps {
  value: string;
  type?: 'status' | 'priority' | 'role';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  value,
  type = 'status',
  size = 'md',
  className = '',
}) => {
  if (!value) return null;

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-medium',
    lg: 'text-sm px-3 py-1.5 font-medium',
  }[size];

  const getStyles = () => {
    const val = String(value).toLowerCase();

    // Priority styles
    if (type === 'priority') {
      switch (val) {
        case 'urgent':
          return {
            bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
            dot: 'bg-rose-500',
          };
        case 'high':
          return {
            bg: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
            dot: 'bg-orange-500',
          };
        case 'medium':
          return {
            bg: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
            dot: 'bg-sky-500',
          };
        case 'low':
        default:
          return {
            bg: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
            dot: 'bg-slate-400',
          };
      }
    }

    // Status styles (Project or Team Member)
    switch (val) {
      case 'completed':
      case 'active':
        return {
          bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
          dot: 'bg-emerald-500',
        };
      case 'in progress':
        return {
          bg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
          dot: 'bg-indigo-500',
        };
      case 'planning':
      case 'on leave':
        return {
          bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
          dot: 'bg-amber-500',
        };
      case 'on hold':
      case 'inactive':
        return {
          bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
          dot: 'bg-purple-500',
        };
      default:
        return {
          bg: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
          dot: 'bg-slate-400',
        };
    }
  };

  const style = getStyles();

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${style.bg} ${sizeClasses} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      <span>{value}</span>
    </span>
  );
};

export default StatusBadge;
