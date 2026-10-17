import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Plus,
  LayoutGrid,
  List,
  Trash2,
  CheckCircle,
} from 'lucide-react';
import ProjectCard from '../components/ProjectCard';
import ProjectForm from '../components/ProjectForm';
import StatusBadge from '../components/StatusBadge';
import ThemeToggle from '../components/ThemeToggle';
import ProfileMenu from '../components/ProfileMenu';
import { CardSkeletonGrid, ErrorState, EmptyState } from '../components/LoadingState';
import { useAuthStore } from '../store/useAuthStore';
import { useProjectStore } from '../store/useProjectStore';
import { useTeamMemberStore } from '../store/useTeamMemberStore';
import type { Project } from '../types';

export const Projects: React.FC = () => {
  const { canManage, isAdmin, user } = useAuthStore();
  const {
    projects,
    loading,
    error,
    toast,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    updateProjectStatus,
  } = useProjectStore();

  const { teamMembers, fetchTeamMembers } = useTeamMemberStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const [activeModalProject, setActiveModalProject] = useState<Partial<Project> | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  useEffect(() => {
    fetchProjects();
    fetchTeamMembers();
  }, [fetchProjects, fetchTeamMembers]);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchSearch =
        !searchTerm ||
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchStatus = selectedStatus === 'All' || p.status === selectedStatus;
      const matchPriority = selectedPriority === 'All' || p.priority === selectedPriority;

      return matchSearch && matchStatus && matchPriority;
    });
  }, [projects, searchTerm, selectedStatus, selectedPriority]);

  const handleSaveProject = async (data: any) => {
    if (activeModalProject && activeModalProject._id) {
      await updateProject(activeModalProject._id, data);
    } else {
      await createProject(data);
    }
  };

  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;
    try {
      await deleteProject(projectToDelete._id);
      setProjectToDelete(null);
    } catch {}
  };

  const handleStatusChange = async (projectId: string, newStatus: string) => {
    await updateProjectStatus(projectId, newStatus);
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
            Projects Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Create, track, filter, and organize all project deliverables and team assignments.
          </p>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <ThemeToggle />
          <ProfileMenu />

          {canManage() ? (
            <button
              onClick={() => setActiveModalProject({})}
              className="wa-btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-2xl shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              New Project
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
            placeholder="Search projects by title, description or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-2xl border border-[#E9EDEF] dark:border-[#2A3942] bg-[#F0F2F5]/70 dark:bg-[#182229]/60 text-[#111B21] dark:text-[#E9EDEF] wa-input"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#00A884] hover:text-[#075E54]"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 bg-[#F0F2F5]/70 dark:bg-[#182229]/60 border border-[#E9EDEF] dark:border-[#2A3942] rounded-2xl px-3 py-2">
            <span className="text-[11px] font-bold text-[#667781] dark:text-[#8696A0]">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs font-semibold bg-transparent text-[#111B21] dark:text-[#E9EDEF] focus:outline-none cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Planning">Planning</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-[#F0F2F5]/70 dark:bg-[#182229]/60 border border-[#E9EDEF] dark:border-[#2A3942] rounded-2xl px-3 py-2">
            <span className="text-[11px] font-bold text-[#667781] dark:text-[#8696A0]">Priority:</span>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="text-xs font-semibold bg-transparent text-[#111B21] dark:text-[#E9EDEF] focus:outline-none cursor-pointer"
            >
              <option value="All">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>

          <div className="flex items-center border border-[#E9EDEF] dark:border-[#2A3942] rounded-2xl p-1 bg-[#F0F2F5]/70 dark:bg-[#182229]/60">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-xl transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-[#202C33] text-[#00A884] dark:text-[#25D366] shadow-xs font-bold'
                  : 'text-[#667781] dark:text-[#8696A0] hover:text-[#111B21]'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-xl transition-colors ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-[#202C33] text-[#00A884] dark:text-[#25D366] shadow-xs font-bold'
                  : 'text-[#667781] dark:text-[#8696A0] hover:text-[#111B21]'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <CardSkeletonGrid count={6} />
      ) : error ? (
        <ErrorState message={error} onRetry={() => fetchProjects()} />
      ) : filteredProjects.length === 0 ? (
        <EmptyState
          title={searchTerm || selectedStatus !== 'All' ? 'No matching projects' : 'No projects created yet'}
          description={
            searchTerm || selectedStatus !== 'All'
              ? 'Try modifying your search keywords or resetting filters.'
              : 'Launch your first project to start tracking tasks and deadlines.'
          }
          actionText={searchTerm || selectedStatus !== 'All' ? 'Reset Filters' : 'Create First Project'}
          onAction={() => {
            if (searchTerm || selectedStatus !== 'All' || selectedPriority !== 'All') {
              setSearchTerm('');
              setSelectedStatus('All');
              setSelectedPriority('All');
            } else {
              setActiveModalProject({});
            }
          }}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onEdit={(p) => setActiveModalProject(p)}
              onDelete={(p) => setProjectToDelete(p)}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      ) : (
        <div className="wa-card rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E9EDEF] dark:border-[#2A3942] text-[11px] uppercase tracking-wider text-[#667781] dark:text-[#8696A0] font-bold bg-[#F0F2F5]/70 dark:bg-[#182229]/80">
                  <th className="py-3.5 px-4">Title</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Progress</th>
                  <th className="py-3.5 px-4">Due Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9EDEF] dark:divide-[#2A3942] text-xs">
                {filteredProjects.map((p) => {
                  const dateStr = new Date(p.dueDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });
                  return (
                    <tr
                      key={p._id}
                      className="hover:bg-[#F0F2F5]/60 dark:hover:bg-[#222E35]/60 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-bold text-[#111B21] dark:text-[#E9EDEF] max-w-xs">
                        <span className="truncate block">{p.title}</span>
                        <span className="text-[11px] font-normal text-[#667781] dark:text-[#8696A0] truncate block">
                          {p.description}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge value={p.status} type="status" size="sm" />
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge value={p.priority} type="priority" size="sm" />
                      </td>
                      <td className="py-3.5 px-4 text-[#667781] dark:text-[#8696A0] font-medium">
                        {p.category || 'General'}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-[#E9EDEF] dark:bg-[#2A3942] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#00A884] rounded-full"
                              style={{ width: `${p.progress}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-bold text-[#111B21] dark:text-[#E9EDEF]">
                            {p.progress}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-[#667781] dark:text-[#8696A0] font-medium">{dateStr}</td>
                      <td className="py-3.5 px-4 text-right">
                        {canManage() ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setActiveModalProject(p)}
                              className="px-2.5 py-1 text-[11px] font-semibold text-[#111B21] dark:text-[#E9EDEF] hover:bg-[#F0F2F5] dark:hover:bg-[#2A3942] rounded-lg transition-colors"
                            >
                              Edit
                            </button>
                            {isAdmin() && (
                              <button
                                onClick={() => setProjectToDelete(p)}
                                className="px-2.5 py-1 text-[11px] font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        ) : (
                          <span className="text-[11px] text-[#667781] dark:text-[#8696A0] font-medium">Read Only</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeModalProject !== null && (
        <ProjectForm
          project={activeModalProject._id ? (activeModalProject as Project) : null}
          allMembers={teamMembers}
          onClose={() => setActiveModalProject(null)}
          onSubmit={handleSaveProject}
        />
      )}

      {projectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-wa-backdrop animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-[#202C33] rounded-3xl modal-wa-container border border-[#E9EDEF] dark:border-[#2A3942] p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto shadow-xs">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#111B21] dark:text-[#E9EDEF]">
                Delete Project?
              </h3>
              <p className="text-xs text-[#667781] dark:text-[#8696A0] mt-1 leading-relaxed">
                Are you sure you want to delete{' '}
                <span className="font-bold text-[#111B21] dark:text-[#E9EDEF]">
                  "{projectToDelete.title}"
                </span>
                ? This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setProjectToDelete(null)}
                className="wa-btn-secondary px-5 py-2.5 rounded-2xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-2xl shadow-sm transition-colors"
              >
                Yes, Delete Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
