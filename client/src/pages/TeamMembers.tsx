import React, { useState, useEffect, useMemo } from 'react';
import {
  Users2,
  Plus,
  Search,
  Mail,
  Phone,
  Briefcase,
  FolderKanban,
  Edit2,
  Trash2,
  CheckCircle,
  X,
  Loader2,
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import ThemeToggle from '../components/ThemeToggle';
import ProfileMenu from '../components/ProfileMenu';
import { CardSkeletonGrid, ErrorState, EmptyState } from '../components/LoadingState';
import { useAuthStore } from '../store/useAuthStore';
import { useTeamMemberStore } from '../store/useTeamMemberStore';
import type { TeamMember, TeamStatus } from '../types';

export const TeamMembers: React.FC = () => {
  const { canManage, isAdmin, user } = useAuthStore();
  const {
    teamMembers,
    loading,
    error,
    toast,
    fetchTeamMembers,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember,
  } = useTeamMemberStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedDepartment, setSelectedDepartment] = useState('All');

  const [activeModalMember, setActiveModalMember] = useState<Partial<TeamMember> | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null);

  useEffect(() => {
    fetchTeamMembers();
  }, [fetchTeamMembers]);

  const departments = [
    'Engineering',
    'Product Design',
    'Infrastructure',
    'Quality Assurance',
    'Marketing',
    'Management',
  ];

  const filteredMembers = useMemo(() => {
    return teamMembers.filter((m) => {
      const matchSearch =
        !searchTerm ||
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.role.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = selectedStatus === 'All' || m.status === selectedStatus;
      const matchDept = selectedDepartment === 'All' || m.department === selectedDepartment;

      return matchSearch && matchStatus && matchDept;
    });
  }, [teamMembers, searchTerm, selectedStatus, selectedDepartment]);

  const handleSaveMember = async (formData: any) => {
    if (activeModalMember && activeModalMember._id) {
      await updateTeamMember(activeModalMember._id, formData);
    } else {
      await createTeamMember(formData);
    }
  };

  const handleConfirmDelete = async () => {
    if (!memberToDelete) return;
    try {
      await deleteTeamMember(memberToDelete._id, memberToDelete.name);
      setMemberToDelete(null);
    } catch {}
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in flex items-center gap-2 px-4 py-3 bg-slate-900 text-white text-xs font-semibold rounded-2xl shadow-xl border border-slate-700">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast.message}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Team Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your project collaborators, engineers, designers, and managers.
          </p>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <ThemeToggle />
          <ProfileMenu />

          {canManage() ? (
            <button
              onClick={() => setActiveModalMember({})}
              className="wa-btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-2xl shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              Add Member
            </button>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#202C33] text-[#667781] dark:text-[#8696A0] text-xs font-semibold border border-[#E9EDEF] dark:border-[#2A3942]">
              Role: <strong className="text-[#111B21] dark:text-[#E9EDEF] capitalize">{user?.role}</strong> (View Only)
            </span>
          )}
        </div>
      </div>

      <div className="wa-card rounded-2xl p-3 sm:p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-2.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#667781] dark:text-[#8696A0] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-2xl border border-[#E9EDEF] dark:border-[#2A3942] bg-[#F0F2F5]/70 dark:bg-[#182229]/60 text-[#111B21] dark:text-[#E9EDEF] wa-input"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 bg-[#F0F2F5]/70 dark:bg-[#182229]/60 border border-[#E9EDEF] dark:border-[#2A3942] rounded-2xl px-3 py-1.5">
            <span className="text-[11px] font-bold text-[#667781] dark:text-[#8696A0]">Department:</span>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="text-xs font-semibold bg-transparent text-[#111B21] dark:text-[#E9EDEF] focus:outline-none cursor-pointer"
            >
              <option value="All">All Departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-[#F0F2F5]/70 dark:bg-[#182229]/60 border border-[#E9EDEF] dark:border-[#2A3942] rounded-2xl px-3 py-1.5">
            <span className="text-[11px] font-bold text-[#667781] dark:text-[#8696A0]">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs font-semibold bg-transparent text-[#111B21] dark:text-[#E9EDEF] focus:outline-none cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="On Leave">On Leave</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <CardSkeletonGrid count={6} />
      ) : error ? (
        <ErrorState message={error} onRetry={() => fetchTeamMembers()} />
      ) : filteredMembers.length === 0 ? (
        <EmptyState
          title="No team members found"
          description="Add your first team member to start assigning projects."
          actionText="Add Team Member"
          onAction={() => setActiveModalMember({})}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map((member) => (
            <div
              key={member._id}
              className="wa-card rounded-2xl p-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#075E54] via-[#00A884] to-[#25D366] p-0.5 shadow-xs">
                      <div className="w-full h-full rounded-[14px] bg-white dark:bg-[#202C33] overflow-hidden flex items-center justify-center font-extrabold text-base text-[#00A884] dark:text-[#25D366]">
                        {member.avatar ? (
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-full h-full object-cover"
                            onError={(e: any) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        ) : (
                          member.name.charAt(0).toUpperCase()
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-[#111B21] dark:text-[#E9EDEF] leading-tight">
                        {member.name}
                      </h3>
                      <p className="text-xs text-[#00A884] dark:text-[#25D366] font-semibold mt-0.5">
                        {member.role}
                      </p>
                    </div>
                  </div>

                  {canManage() && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setActiveModalMember(member)}
                        className="p-1.5 rounded-xl text-[#667781] hover:text-[#111B21] dark:hover:text-[#E9EDEF] hover:bg-[#F0F2F5] dark:hover:bg-[#2A3942] transition-colors"
                        title="Edit Member"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {isAdmin() && (
                        <button
                          onClick={() => setMemberToDelete(member)}
                          className="p-1.5 rounded-xl text-[#667781] hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Delete Member"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-1.5 text-xs text-[#667781] dark:text-[#8696A0] mb-3">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-[#00A884] shrink-0" />
                    <span className="truncate">{member.email}</span>
                  </div>
                  {member.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-[#00A884] shrink-0" />
                      <span>{member.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-3.5 h-3.5 text-[#00A884] shrink-0" />
                    <span>{member.department || 'Engineering'}</span>
                  </div>
                </div>

                {member.skills && member.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {member.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-bold bg-[#F0F2F5] dark:bg-[#202C33] text-[#667781] dark:text-[#8696A0] px-2 py-0.5 rounded-lg border border-[#E9EDEF] dark:border-[#2A3942]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-2.5 border-t border-[#E9EDEF] dark:border-[#2A3942] flex items-center justify-between">
                <StatusBadge value={member.status || 'Active'} type="status" size="sm" />
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#111B21] dark:text-[#E9EDEF]">
                  <FolderKanban className="w-3.5 h-3.5 text-[#00A884]" />
                  <span>{member.projectCount || 0} Projects</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeModalMember !== null && (
        <MemberFormModal
          member={activeModalMember._id ? (activeModalMember as TeamMember) : null}
          departments={departments}
          onClose={() => setActiveModalMember(null)}
          onSubmit={handleSaveMember}
        />
      )}

      {memberToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-wa-backdrop animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-[#202C33] rounded-3xl modal-wa-container border border-[#E9EDEF] dark:border-[#2A3942] p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto shadow-xs">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#111B21] dark:text-[#E9EDEF]">
                Remove Team Member?
              </h3>
              <p className="text-xs text-[#667781] dark:text-[#8696A0] mt-1 leading-relaxed">
                Are you sure you want to remove{' '}
                <span className="font-bold text-[#111B21] dark:text-[#E9EDEF]">
                  "{memberToDelete.name}"
                </span>
                ? They will be unassigned from all associated projects.
              </p>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setMemberToDelete(null)}
                className="wa-btn-secondary px-5 py-2.5 rounded-2xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-2xl shadow-sm transition-colors"
              >
                Yes, Remove Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MemberFormModal: React.FC<{
  member?: TeamMember | null;
  departments: string[];
  onClose: () => void;
  onSubmit: (formData: any) => Promise<void>;
}> = ({ member, departments, onClose, onSubmit }) => {
  const isEditing = !!member;

  const [formData, setFormData] = useState({
    name: member?.name || '',
    email: member?.email || '',
    role: member?.role || 'Frontend Developer',
    department: member?.department || 'Engineering',
    phone: member?.phone || '',
    avatar: member?.avatar || '',
    status: member?.status || 'Active',
    skills: Array.isArray(member?.skills) ? member.skills.join(', ') : '',
  });

  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email format';
    }
    if (!formData.role.trim()) errs.role = 'Role is required';

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
        skills: formData.skills
          ? formData.skills
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
      };
      await onSubmit(payload);
      onClose();
    } catch (err: any) {
      setErrors({ form: err.message || 'Failed to save team member' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-wa-backdrop animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#202C33] rounded-3xl modal-wa-container border border-[#E9EDEF] dark:border-[#2A3942] overflow-hidden my-8">
        <div className="h-1.5 w-full bg-gradient-to-r from-[#075E54] via-[#00A884] to-[#25D366]" />

        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E9EDEF] dark:border-[#2A3942] bg-[#F0F2F5]/70 dark:bg-[#182229]/80">
          <div>
            <h2 className="text-base font-extrabold text-[#111B21] dark:text-[#E9EDEF]">
              {isEditing ? 'Edit Team Member' : 'Add Team Member'}
            </h2>
            <p className="text-xs text-[#667781] dark:text-[#8696A0]">
              {isEditing ? 'Update profile and contact information.' : 'Invite a new contributor to projects.'}
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
              Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Alex Morgan"
              className={`w-full px-3.5 py-2.5 text-sm rounded-2xl border bg-white dark:bg-[#222E35] text-[#111B21] dark:text-[#E9EDEF] wa-input ${
                errors.name ? 'border-rose-400' : 'border-[#E9EDEF] dark:border-[#2A3942]'
              }`}
            />
            {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-[#111B21] dark:text-[#E9EDEF] mb-1.5">
              Work Email <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="alex.morgan@company.com"
              className={`w-full px-3.5 py-2.5 text-sm rounded-2xl border bg-white dark:bg-[#222E35] text-[#111B21] dark:text-[#E9EDEF] wa-input ${
                errors.email ? 'border-rose-400' : 'border-[#E9EDEF] dark:border-[#2A3942]'
              }`}
            />
            {errors.email && <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#111B21] dark:text-[#E9EDEF] mb-1.5">
                Role / Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="Senior Technical Lead"
                className="w-full px-3.5 py-2.5 text-sm rounded-2xl border border-[#E9EDEF] dark:border-[#2A3942] bg-white dark:bg-[#222E35] text-[#111B21] dark:text-[#E9EDEF] wa-input"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111B21] dark:text-[#E9EDEF] mb-1.5">
                Department
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm rounded-2xl border border-[#E9EDEF] dark:border-[#2A3942] bg-white dark:bg-[#222E35] text-[#111B21] dark:text-[#E9EDEF] wa-input cursor-pointer"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#111B21] dark:text-[#E9EDEF] mb-1.5">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 555-0145"
                className="w-full px-3.5 py-2.5 text-sm rounded-2xl border border-[#E9EDEF] dark:border-[#2A3942] bg-white dark:bg-[#222E35] text-[#111B21] dark:text-[#E9EDEF] wa-input"
              />
            </div>

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
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="On Leave">On Leave</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#111B21] dark:text-[#E9EDEF] mb-1.5">
              Avatar Image URL (optional)
            </label>
            <input
              type="text"
              name="avatar"
              value={formData.avatar}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2.5 text-sm rounded-2xl border border-[#E9EDEF] dark:border-[#2A3942] bg-white dark:bg-[#222E35] text-[#111B21] dark:text-[#E9EDEF] wa-input"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#111B21] dark:text-[#E9EDEF] mb-1.5">
              Skills (comma-separated)
            </label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="Architecture, Cloud, Operations, Quality"
              className="w-full px-3.5 py-2.5 text-sm rounded-2xl border border-[#E9EDEF] dark:border-[#2A3942] bg-white dark:bg-[#222E35] text-[#111B21] dark:text-[#E9EDEF] wa-input"
            />
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
              <span>{isEditing ? 'Save Changes' : 'Add Member'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeamMembers;
