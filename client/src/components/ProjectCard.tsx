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
    if (progress >= 100 || status === 'Completed') return 'bg-[#25D366]';
    if (progress >= 60) return 'bg-[#00A884]';
    if (progress >= 30) return 'bg-[#128C7E]';
    return 'bg-amber-500';
  };

  return (
    <div className="group relative wa-card rounded-2xl p-4 sm:p-4.5 flex flex-col justify-between">
      <div>
        {/* Header Badges & Actions Menu */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <StatusBadge value={status} type="status" size="sm" />
            <StatusBadge value={priority} type="priority" size="sm" />
            {category && (
              <span className="text-[11px] font-bold text-[#00A884] dark:text-[#25D366] bg-[#E7F8F0] dark:bg-[#075E54]/40 px-2.5 py-0.5 rounded-full border border-[#00A884]/20">
                {category}
              </span>
            )}
          </div>

          {/* Action Menu (Restricted by Role) */}
          {canManage() && (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-1.5 rounded-xl text-[#667781] hover:text-[#111B21] dark:hover:text-[#E9EDEF] hover:bg-[#F0F2F5] dark:hover:bg-[#2A3942] transition-colors"
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
                  <div className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-[#222E35] border border-[#E9EDEF] dark:border-[#2A3942] rounded-2xl shadow-xl py-1.5 z-30 animate-fade-in text-xs font-semibold">
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onEdit(project);
                      }}
                      className="w-full flex items-center gap-2 px-3.5 py-2 text-[#111B21] dark:text-[#E9EDEF] hover:bg-[#F0F2F5] dark:hover:bg-[#2A3942] transition-colors text-left"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-[#00A884]" />
                      Edit Project
                    </button>

                    {status !== 'Completed' && (
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          onStatusChange && onStatusChange(_id, 'Completed');
                        }}
                        className="w-full flex items-center gap-2 px-3.5 py-2 text-[#00A884] dark:text-[#25D366] hover:bg-[#E7F8F0] dark:hover:bg-[#075E54]/30 transition-colors text-left"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#25D366]" />
                        Mark Complete
                      </button>
                    )}

                    {isAdmin() && (
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          onDelete(project);
                        }}
                        className="w-full flex items-center gap-2 px-3.5 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors text-left border-t border-[#E9EDEF] dark:border-[#2A3942]"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                        Delete Project
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Title & Description */}
        <h3 className="text-base font-extrabold text-[#111B21] dark:text-[#E9EDEF] tracking-tight mb-1.5 group-hover:text-[#00A884] dark:group-hover:text-[#25D366] transition-colors">
          {title}
        </h3>
        <p className="text-xs text-[#667781] dark:text-[#8696A0] line-clamp-2 leading-relaxed mb-3">
          {description}
        </p>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="text-[10px] font-bold text-[#667781] dark:text-[#8696A0] bg-[#F0F2F5] dark:bg-[#202C33] border border-[#E9EDEF] dark:border-[#2A3942] px-2 py-0.5 rounded-lg"
              >
                #{tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="text-[10px] font-bold text-[#667781] dark:text-[#8696A0] px-1.5 py-0.5">
                +{tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer Details: Progress, Due Date, Team */}
      <div className="pt-3 border-t border-[#E9EDEF] dark:border-[#2A3942] space-y-3">
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between items-center text-xs font-bold text-[#667781] dark:text-[#8696A0] mb-1.5">
            <span>Progress</span>
            <span className="text-[#111B21] dark:text-[#E9EDEF] font-extrabold">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-[#E9EDEF] dark:bg-[#2A3942] rounded-full overflow-hidden">
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
            className={`flex items-center gap-1.5 text-xs font-semibold ${
              isOverdue
                ? 'text-rose-600 dark:text-rose-400'
                : 'text-[#667781] dark:text-[#8696A0]'
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
                className="w-7 h-7 rounded-full border-2 border-white dark:border-[#202C33] overflow-hidden bg-[#E7F8F0] dark:bg-[#075E54]/50 flex items-center justify-center text-[10px] font-bold text-[#00A884] dark:text-[#25D366] shadow-xs"
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
              <div className="w-7 h-7 rounded-full border-2 border-white dark:border-[#202C33] bg-[#F0F2F5] dark:bg-[#2A3942] flex items-center justify-center text-[10px] font-bold text-[#667781] dark:text-[#8696A0]">
                +{teamMembers.length - 4}
              </div>
            )}
            {teamMembers.length === 0 && (
              <span className="text-[11px] text-[#667781] dark:text-[#8696A0] italic">Unassigned</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
