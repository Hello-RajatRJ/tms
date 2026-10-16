import React, { useState, useEffect } from 'react';
import { X, Check, Loader2, Users, Calendar, DollarSign, Tag, Layers } from 'lucide-react';

export const ProjectForm = ({ project = null, allMembers = [], onClose, onSubmit }) => {
  const isEditing = !!project;

  const [formData, setFormData] = useState({
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

  const [errors, setErrors] = useState({});
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
          ? project.teamMembers.map((m) => (typeof m === 'object' ? m._id : m))
          : [],
      });
    } else {
      // Default due date: 14 days from now
      const defaultDate = new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0];
      setFormData((prev) => ({ ...prev, dueDate: defaultDate }));
    }
  }, [project]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' || name === 'progress' ? Number(value) : value,
    }));
    // Clear validation error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleMemberToggle = (memberId) => {
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
    const errs = {};
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

  const handleSubmit = async (e) => {
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
    } catch (err) {
      setErrors({ form: err.message || 'Failed to save project' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8 animate-fade-in">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {isEditing ? 'Edit Project' : 'Create New Project'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isEditing
                ? 'Update project details, assignees, and timeline.'
                : 'Fill in the information to launch a new project.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {errors.form && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-700 dark:text-rose-400">
              {errors.form}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Project Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Enterprise Payment Gateway Migration"
              className={`w-full px-3.5 py-2 text-sm rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${errors.title
                ? 'border-rose-400 focus:border-rose-500'
                : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500'
                }`}
            />
            {errors.title && <p className="text-[11px] text-rose-500 mt-1">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Outline project objectives, key deliverables, and requirements..."
              className={`w-full px-3.5 py-2 text-sm rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${errors.description
                ? 'border-rose-400 focus:border-rose-500'
                : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500'
                }`}
            />
            {errors.description && (
              <p className="text-[11px] text-rose-500 mt-1">{errors.description}</p>
            )}
          </div>

          {/* Status, Priority, Category (3 Columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Planning">Planning</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
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

          {/* Due Date & Progress Slider */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Due Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className={`w-full px-3.5 py-2 text-sm rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 ${errors.dueDate ? 'border-rose-400' : 'border-slate-200 dark:border-slate-700'
                  }`}
              />
              {errors.dueDate && <p className="text-[11px] text-rose-500 mt-1">{errors.dueDate}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Progress Percentage
                </label>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
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
                className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
              />
            </div>
          </div>

          {/* Budget & Spent */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Budget ($)
              </label>
              <input
                type="number"
                name="budget"
                min="0"
                value={formData.budget}
                onChange={handleChange}
                placeholder="0"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Spent ($)
              </label>
              <input
                type="number"
                name="spent"
                min="0"
                value={formData.spent}
                onChange={handleChange}
                placeholder="0"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="React, AWS, Security, UI"
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Assign Team Members Multi-select */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Assign Team Members ({formData.teamMembers.length} selected)
            </label>
            {allMembers.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No team members available. Add them in Team Members page.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-1">
                {allMembers.map((member) => {
                  const isSelected = formData.teamMembers.includes(member._id);
                  return (
                    <button
                      key={member._id}
                      type="button"
                      onClick={() => handleMemberToggle(member._id)}
                      className={`flex items-center justify-between p-2 rounded-xl border text-left transition-all ${isSelected
                        ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-700 dark:text-slate-300 shrink-0">
                          {member.name.charAt(0)}
                        </div>
                        <div className="truncate">
                          <p className="text-xs font-semibold truncate">{member.name}</p>
                          <p className="text-[10px] text-slate-400 truncate">{member.role}</p>
                        </div>
                      </div>
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ml-2 ${isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'border border-slate-300 dark:border-slate-600'
                          }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Modal Footer Buttons */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm hover:shadow transition-all disabled:opacity-50"
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
