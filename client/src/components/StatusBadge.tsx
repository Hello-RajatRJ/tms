import React from 'react';

interface StatusBadgeProps {
  value: string;
  type?: 'status' | 'priority' | 'role';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Renders standardized color-coded status, priority, and role pill indicators.
 */
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
            bg: 'bg-[#E7F8F0] text-[#00A884] dark:bg-[#075E54]/30 dark:text-[#25D366] border-[#00A884]/30',
            dot: 'bg-[#00A884]',
          };
        case 'low':
        default:
          return {
            bg: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
            dot: 'bg-slate-400',
          };
      }
    }

    switch (val) {
      case 'completed':
      case 'active':
        return {
          bg: 'bg-[#E7F8F0] text-[#00A884] dark:bg-[#075E54]/40 dark:text-[#25D366] border-[#00A884]/30',
          dot: 'bg-[#25D366]',
        };
      case 'in progress':
        return {
          bg: 'bg-[#E7F8F0] text-[#128C7E] dark:bg-[#128C7E]/30 dark:text-[#25D366] border-[#128C7E]/30',
          dot: 'bg-[#00A884]',
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
          bg: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
          dot: 'bg-slate-400',
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
