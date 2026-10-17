import React, { useState } from 'react';
import {
  MoreVertical,
  Edit2,
  Trash2,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import StatusBadge from './StatusBadge';
import { useAuthStore } from '../store/useAuthStore';
import type { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  onStatusChange?: (id: string, newStatus: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { canManage, isAdmin } = useAuthStore();

  const {
    _id,
    title,
    description,
    status,
    priority,
    dueDate,
    progress = 0,
    teamMembers = [],
    category,
    tags = [],
  } = project;

  // Format Due Date
  const dateObj = new Date(dueDate);
  const formattedDate = !isNaN(dateObj.getTime())
    ? dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'No Date';

  // Days left calculation
  const now = new Date();
  const diffTime = dateObj.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const isOverdue = diffDays < 0 && status !== 'Completed';

  // Progress Bar color
  const getProgressColor = () => {
    if (progress >= 100 || status === 'Completed') return 'bg-emerald-500';
    if (progress >= 60) return 'bg-indigo-600';
    if (progress >= 30) return 'bg-blue-500';
    return 'bg-amber-500';
  };

  return (
    <div className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-800/80 transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Header Badges & Actions Menu */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <StatusBadge value={status} type="status" size="sm" />
            <StatusBadge value={priority} type="priority" size="sm" />
            {category && (
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                {category}
              </span>
            )}
          </div>

          {/* Action Menu (Restricted by Role) */}
          {canManage() && (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Project options"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {menuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg py-1 z-30 animate-fade-in text-xs font-medium">
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onEdit(project);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-left"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-indigo-500" />
                      Edit Project
                    </button>

                    {status !== 'Completed' && (
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          onStatusChange && onStatusChange(_id, 'Completed');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors text-left"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        Mark Complete
                      </button>
                    )}

                    {isAdmin() && (
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          onDelete(project);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors text-left border-t border-slate-100 dark:border-slate-700/60"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                        Delete
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Title & Description */}
        <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight mb-1.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {title}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
          {description}
        </p>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="text-[10px] font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 px-1.5 py-0.5 rounded"
              >
                #{tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="text-[10px] font-medium text-slate-400 px-1 py-0.5">
                +{tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer Details: Progress, Due Date, Team */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between items-center text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
            <span>Progress</span>
            <span className="text-slate-900 dark:text-white">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${getProgressColor()}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Due Date & Team Avatars */}
        <div className="flex items-center justify-between pt-1">
          {/* Due Date */}
          <div
            className={`flex items-center gap-1.5 text-xs font-medium ${isOverdue
              ? 'text-rose-600 dark:text-rose-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400'
              }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>
              {isOverdue ? `Overdue (${Math.abs(diffDays)}d)` : formattedDate}
            </span>
          </div>

          {/* Team Member Avatars */}
          <div className="flex items-center -space-x-2">
            {teamMembers.slice(0, 4).map((m: any, idx: number) => (
              <div
                key={m._id || idx}
                title={`${m.name} (${m.role})`}
                className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-900 overflow-hidden bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-[10px] font-bold text-indigo-700 dark:text-indigo-300 shadow-xs"
              >
                {m.avatar ? (
                  <img
                    src={m.avatar}
                    alt={m.name}
                    className="w-full h-full object-cover"
                    onError={(e: any) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <span>{m.name ? m.name.charAt(0).toUpperCase() : '?'}</span>
                )}
              </div>
            ))}
            {teamMembers.length > 4 && (
              <div className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                +{teamMembers.length - 4}
              </div>
            )}
            {teamMembers.length === 0 && (
              <span className="text-[11px] text-slate-400 italic">Unassigned</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
