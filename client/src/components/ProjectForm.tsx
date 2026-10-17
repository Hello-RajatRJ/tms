import React, { useState, useEffect } from 'react';
import { X, Check, Loader2 } from 'lucide-react';
import type { Project, TeamMember, ProjectStatus, ProjectPriority } from '../types';

interface ProjectFormProps {
  project?: Project | null;
  allMembers?: TeamMember[];
  onClose: () => void;
  onSubmit: (projectData: any) => Promise<any>;
}

interface FormDataState {
  title: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  category: string;
  dueDate: string;
  budget: number;
  spent: number;
  progress: number;
  tags: string;
  teamMembers: string[];
}

/**
 * Modal form modal for creating new workspace projects or editing existing ones.
 */
export const ProjectForm: React.FC<ProjectFormProps> = ({
  project = null,
  allMembers = [],
  onClose,
  onSubmit,
}) => {
  const isEditing = !!project;

  const [formData, setFormData] = useState<FormDataState>({
    title: '',
    description: '',
    status: 'Planning',
    priority: 'Medium',
    category: 'Development',
    dueDate: '',
    budget: 0,
    spent: 0,
    progress: 0,
    tags: '',
    teamMembers: [],
  });

  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        status: project.status || 'Planning',
        priority: project.priority || 'Medium',
        category: project.category || 'Development',
        dueDate: project.dueDate ? new Date(project.dueDate).toISOString().split('T')[0] : '',
        budget: project.budget || 0,
        spent: project.spent || 0,
        progress: project.progress || 0,
        tags: Array.isArray(project.tags) ? project.tags.join(', ') : '',
        teamMembers: Array.isArray(project.teamMembers)
          ? project.teamMembers.map((m: any) => (typeof m === 'object' ? m._id : m))
          : [],
      });
    } else {
      const defaultDate = new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0];
      setFormData((prev) => ({ ...prev, dueDate: defaultDate }));
    }
  }, [project]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' || name === 'progress' ? Number(value) : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleMemberToggle = (memberId: string) => {
    setFormData((prev) => {
      const exists = prev.teamMembers.includes(memberId);
      return {
        ...prev,
        teamMembers: exists
          ? prev.teamMembers.filter((id) => id !== memberId)
          : [...prev.teamMembers, memberId],
      };
    });
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.title.trim()) {
      errs.title = 'Project title is required';
    } else if (formData.title.trim().length < 2) {
      errs.title = 'Title must be at least 2 characters';
    }

    if (!formData.description.trim()) {
      errs.description = 'Description is required';
    } else if (formData.description.trim().length < 3) {
      errs.description = 'Description must be at least 3 characters';
    }

    if (!formData.dueDate) {
      errs.dueDate = 'Due date is required';
    }

    if (formData.budget < 0) {
      errs.budget = 'Budget cannot be negative';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      const payload = {
        ...formData,
        tags: formData.tags
          ? formData.tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
          : [],
      };
      await onSubmit(payload);
      onClose();
    } catch (err: any) {
      setErrors({ form: err.message || 'Failed to save project' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-wa-backdrop overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#202C33] rounded-3xl modal-wa-container border border-[#E9EDEF] dark:border-[#2A3942] overflow-hidden my-8 animate-fade-in">
        <div className="h-1.5 w-full bg-gradient-to-r from-[#075E54] via-[#00A884] to-[#25D366]" />

        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E9EDEF] dark:border-[#2A3942] bg-[#F0F2F5]/70 dark:bg-[#182229]/80">
          <div>
            <h2 className="text-lg font-extrabold text-[#111B21] dark:text-[#E9EDEF] tracking-tight">
              {isEditing ? 'Edit Project' : 'Create New Project'}
            </h2>
            <p className="text-xs text-[#667781] dark:text-[#8696A0]">
              {isEditing
                ? 'Update project details, assignees, and timeline.'
                : 'Fill in the information to launch a new project.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#667781] hover:text-[#111B21] dark:hover:text-[#E9EDEF] hover:bg-[#E9EDEF]/60 dark:hover:bg-[#2A3942] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {errors.form && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-2xl text-xs text-rose-700 dark:text-rose-400">
              {errors.form}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#111B21] dark:text-[#E9EDEF] mb-1.5">
              Project Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Enterprise Payment Gateway Migration"
              className={`w-full px-3.5 py-2.5 text-sm rounded-2xl border bg-white dark:bg-[#222E35] text-[#111B21] dark:text-[#E9EDEF] wa-input transition-all ${
                errors.title
                  ? 'border-rose-400 focus:border-rose-500'
                  : 'border-[#E9EDEF] dark:border-[#2A3942]'
              }`}
            />
            {errors.title && <p className="text-[11px] text-rose-500 mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-[#111B21] dark:text-[#E9EDEF] mb-1.5">
              Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Outline project objectives, key deliverables, and requirements..."
              className={`w-full px-3.5 py-2.5 text-sm rounded-2xl border bg-white dark:bg-[#222E35] text-[#111B21] dark:text-[#E9EDEF] wa-input transition-all ${
                errors.description
                  ? 'border-rose-400 focus:border-rose-500'
                  : 'border-[#E9EDEF] dark:border-[#2A3942]'
              }`}
            />
            {errors.description && (
              <p className="text-[11px] text-rose-500 mt-1">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#111B21] dark:text-[#E9EDEF] mb-1.5">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm rounded-2xl border border-[#E9EDEF] dark:border-[#2A3942] bg-white dark:bg-[#222E35] text-[#111B21] dark:text-[#E9EDEF] wa-input cursor-pointer"
              >
                <option value="Planning">Planning</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111B21] dark:text-[#E9EDEF] mb-1.5">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm rounded-2xl border border-[#E9EDEF] dark:border-[#2A3942] bg-white dark:bg-[#222E35] text-[#111B21] dark:text-[#E9EDEF] wa-input cursor-pointer"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111B21] dark:text-[#E9EDEF] mb-1.5">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm rounded-2xl border border-[#E9EDEF] dark:border-[#2A3942] bg-white dark:bg-[#222E35] text-[#111B21] dark:text-[#E9EDEF] wa-input cursor-pointer"
              >
                <option value="Development">Development</option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="DevOps & Cloud">DevOps & Cloud</option>
                <option value="Fintech">Fintech</option>
                <option value="Security & Compliance">Security & Compliance</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#111B21] dark:text-[#E9EDEF] mb-1.5">
                Due Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className={`w-full px-3.5 py-2.5 text-sm rounded-2xl border bg-white dark:bg-[#222E35] text-[#111B21] dark:text-[#E9EDEF] wa-input ${
                  errors.dueDate ? 'border-rose-400' : 'border-[#E9EDEF] dark:border-[#2A3942]'
                }`}
              />
              {errors.dueDate && <p className="text-[11px] text-rose-500 mt-1">{errors.dueDate}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-[#111B21] dark:text-[#E9EDEF]">
                  Progress Percentage
                </label>
                <span className="text-xs font-extrabold text-[#00A884] dark:text-[#25D366]">
                  {formData.progress}%
                </span>
              </div>
              <input
                type="range"
                name="progress"
                min="0"
                max="100"
                step="5"
                value={formData.progress}
                onChange={handleChange}
                className="w-full accent-[#00A884] cursor-pointer h-2 bg-[#E9EDEF] dark:bg-[#2A3942] rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#111B21] dark:text-[#E9EDEF] mb-1.5">
                Budget ($)
              </label>
              <input
                type="number"
                name="budget"
                min="0"
                value={formData.budget}
                onChange={handleChange}
                placeholder="0"
                className="w-full px-3.5 py-2.5 text-sm rounded-2xl border border-[#E9EDEF] dark:border-[#2A3942] bg-white dark:bg-[#222E35] text-[#111B21] dark:text-[#E9EDEF] wa-input"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111B21] dark:text-[#E9EDEF] mb-1.5">
                Spent ($)
              </label>
              <input
                type="number"
                name="spent"
                min="0"
                value={formData.spent}
                onChange={handleChange}
                placeholder="0"
                className="w-full px-3.5 py-2.5 text-sm rounded-2xl border border-[#E9EDEF] dark:border-[#2A3942] bg-white dark:bg-[#222E35] text-[#111B21] dark:text-[#E9EDEF] wa-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#111B21] dark:text-[#E9EDEF] mb-1.5">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="Architecture, Security, Operations, Product"
              className="w-full px-3.5 py-2.5 text-sm rounded-2xl border border-[#E9EDEF] dark:border-[#2A3942] bg-white dark:bg-[#222E35] text-[#111B21] dark:text-[#E9EDEF] wa-input"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#111B21] dark:text-[#E9EDEF] mb-2">
              Assign Team Members ({formData.teamMembers.length} selected)
            </label>
            {allMembers.length === 0 ? (
              <p className="text-xs text-[#667781] dark:text-[#8696A0] italic">
                No team members available. Add them in Team Members page.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-44 overflow-y-auto p-1">
                {allMembers.map((member) => {
                  const isSelected = formData.teamMembers.includes(member._id);
                  return (
                    <button
                      key={member._id}
                      type="button"
                      onClick={() => handleMemberToggle(member._id)}
                      className={`flex items-center justify-between p-2.5 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'border-[#00A884] bg-[#E7F8F0] dark:bg-[#075E54]/30 text-[#00A884] dark:text-[#25D366] font-semibold'
                          : 'border-[#E9EDEF] dark:border-[#2A3942] hover:border-[#00A884]/40 bg-white dark:bg-[#222E35] text-[#111B21] dark:text-[#E9EDEF]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-[#E9EDEF] dark:bg-[#2A3942] flex items-center justify-center text-xs font-bold text-[#111B21] dark:text-[#E9EDEF] shrink-0">
                          {member.name.charAt(0)}
                        </div>
                        <div className="truncate">
                          <p className="text-xs font-bold truncate">{member.name}</p>
                          <p className="text-[10px] text-[#667781] dark:text-[#8696A0] truncate">{member.role}</p>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ml-2 transition-colors ${
                          isSelected
                            ? 'bg-[#00A884] text-white shadow-xs'
                            : 'border border-[#CBD5E1] dark:border-[#2A3942]'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[#E9EDEF] dark:border-[#2A3942] flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="wa-btn-secondary px-5 py-2.5 rounded-2xl text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="wa-btn-primary inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl text-xs disabled:opacity-50"
            >
              {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{isEditing ? 'Save Changes' : 'Create Project'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;
