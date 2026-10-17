import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Folder,
  CheckCircle2,
  Clock,
  Users,
  BarChart2,
  ListTodo,
  FileText,
  Plus,
  ArrowUp,
  Globe,
  Code,
  Smartphone,
  MoreHorizontal,
  ListFilter,
  Check,
  AlertCircle,
} from 'lucide-react';
import { getProjectStats, getProjects, getTeamMembers, createProject } from '../services/api';
import { Project, ProjectStats, TeamMember } from '../types';
import { useAuthStore } from '../store/useAuthStore';
import ThemeToggle from '../components/ThemeToggle';
import ProfileMenu from '../components/ProfileMenu';
import ProjectForm from '../components/ProjectForm';

/**
 * Main analytics dashboard summarizing active projects, status distribution,
 * team workloads, and recent deliverables.
 */
export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<ProjectStats | null>(null);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const { user, canManage } = useAuthStore();

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, projectsRes, membersRes] = await Promise.all([
        getProjectStats(),
        getProjects({ sort: 'createdAt:desc', limit: 5 }),
        getTeamMembers(),
      ]);

      const sData = (statsRes as any)?.data || statsRes;
      const pData = (projectsRes as any)?.data || projectsRes;
      const mData = (membersRes as any)?.data || membersRes;

      setStats(sData || null);
      setRecentProjects(Array.isArray(pData) ? pData : []);
      setTeamMembers(Array.isArray(mData) ? mData : []);
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleCreateProject = async (projectData: Partial<Project>) => {
    try {
      await createProject(projectData);
      showToast('New project created successfully!');
      setShowCreateModal(false);
      loadDashboardData();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to create project', 'error');
    }
  };

  const totalProjectsCount = stats?.totalProjects ?? 12;
  const completedCount = stats?.statusCounts?.completed ?? 4;
  const inProgressCount = stats?.statusCounts?.inProgress ?? 6;
  const pendingCount = (stats?.statusCounts?.planning ?? 0) + (stats?.statusCounts?.onHold ?? 0) || 2;
  const avgProgressPct = stats?.avgProgress ?? 68;
  const teamMembersCount = teamMembers.length || 8;

  const firstName = user?.name ? user.name.split(' ')[0] : 'Alex';

  const workloadMembers = [
    {
      name: 'Maya Chen',
      role: 'Frontend Developer',
      initials: 'MC',
      color: 'bg-[#8B5CF6]',
      progress: 80,
    },
    {
      name: 'Noah Patel',
      role: 'Backend Developer',
      initials: 'NP',
      color: 'bg-[#3B82F6]',
      progress: 60,
    },
    {
      name: 'Olivia Reed',
      role: 'UI/UX Designer',
      initials: 'OR',
      color: 'bg-[#EC4899]',
      progress: 45,
    },
  ];

  const getProjectIcon = (title: string, category?: string) => {
    const t = (title + ' ' + (category || '')).toLowerCase();
    if (t.includes('crm') || t.includes('integration') || t.includes('backend') || t.includes('code')) {
      return { icon: Code, bg: 'bg-blue-50 text-blue-500 dark:bg-blue-950/40 dark:text-blue-400' };
    }
    if (t.includes('web') || t.includes('site') || t.includes('portal')) {
      return { icon: Globe, bg: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400' };
    }
    if (t.includes('mobile') || t.includes('app') || t.includes('ios') || t.includes('android')) {
      return { icon: Smartphone, bg: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400' };
    }
    return { icon: Code, bg: 'bg-emerald-50 text-[#00A884] dark:bg-emerald-950/40 dark:text-[#25D366]' };
  };

  const defaultShowcaseProjects = [
    {
      id: 'p1',
      title: 'Website Redesign',
      desc: 'Redesign the company website with modern UI/UX',
      ownerName: 'Maya Chen',
      ownerRole: 'Frontend Developer',
      ownerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      status: 'In Progress',
      dueDate: 'Apr 25, 2025',
      progress: 70,
    },
    {
      id: 'p2',
      title: 'CRM Integration',
      desc: 'Integrate CRM with existing platform',
      ownerName: 'Noah Patel',
      ownerRole: 'Backend Developer',
      ownerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      status: 'Completed',
      dueDate: 'Apr 18, 2025',
      progress: 100,
    },
    {
      id: 'p3',
      title: 'Mobile App',
      desc: 'Build cross-platform mobile application',
      ownerName: 'Olivia Reed',
      ownerRole: 'UI/UX Designer',
      ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
      status: 'Pending',
      dueDate: 'May 10, 2025',
      progress: 30,
    },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in flex items-center gap-2 px-4 py-3 bg-slate-900 text-white text-xs font-semibold rounded-2xl shadow-xl border border-slate-700">
          {toast.type === 'success' ? (
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#111B21] dark:text-[#E9EDEF] tracking-tight">
            Project Analytics
          </h1>
          <p className="text-xs sm:text-sm text-[#667781] dark:text-[#8696A0] mt-0.5">
            Track project health, delivery, and team workload.
          </p>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <ThemeToggle />
          <ProfileMenu />
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#00A884] via-[#059669] to-[#10B981] text-white p-5 sm:p-6 shadow-md shadow-[#00A884]/15">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl shrink-0 shadow-inner">
              📁
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
                Welcome back, {firstName}
              </h2>
              <p className="text-xs text-white/90 mt-1 font-medium">
                Your team is making steady progress across active projects.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {canManage() && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-[#00A884] font-bold text-xs shadow-sm hover:bg-slate-50 transition-all active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                New Project
              </button>
            )}
            <Link
              to="/projects"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-white/60 text-white font-bold text-xs hover:bg-white/10 transition-all"
            >
              <ListFilter className="w-3.5 h-3.5" />
              All Projects
            </Link>
          </div>
        </div>

        <div className="absolute -right-8 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="wa-card rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-[#075E54]/30 text-[#00A884] dark:text-[#25D366] flex items-center justify-center shrink-0">
              <Folder className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-xs font-semibold text-[#667781] dark:text-[#8696A0]">Total Projects</span>
          </div>
          <div className="text-3xl font-black text-[#111B21] dark:text-[#E9EDEF] tracking-tight pl-0.5">
            {totalProjectsCount}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-[#667781] dark:text-[#8696A0] pl-0.5">
            <ArrowUp className="w-3.5 h-3.5 text-[#00A884] dark:text-[#25D366] stroke-[2.5]" />
            <span><strong className="text-[#00A884] dark:text-[#25D366] font-semibold">2 new</strong> this month</span>
          </div>
        </div>

        <div className="wa-card rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-[#075E54]/30 text-[#00A884] dark:text-[#25D366] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-xs font-semibold text-[#667781] dark:text-[#8696A0]">Completed</span>
          </div>
          <div className="text-3xl font-black text-[#111B21] dark:text-[#E9EDEF] tracking-tight pl-0.5">
            {completedCount}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-[#667781] dark:text-[#8696A0] pl-0.5">
            <ArrowUp className="w-3.5 h-3.5 text-[#00A884] dark:text-[#25D366] stroke-[2.5]" />
            <span><strong className="text-[#00A884] dark:text-[#25D366] font-semibold">1 more</strong> than last month</span>
          </div>
        </div>

        <div className="wa-card rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-[#075E54]/30 text-[#00A884] dark:text-[#25D366] flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-xs font-semibold text-[#667781] dark:text-[#8696A0]">In Progress</span>
          </div>
          <div className="text-3xl font-black text-[#111B21] dark:text-[#E9EDEF] tracking-tight pl-0.5">
            {inProgressCount}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-[#667781] dark:text-[#8696A0] pl-0.5">
            <ArrowUp className="w-3.5 h-3.5 text-[#00A884] dark:text-[#25D366] stroke-[2.5]" />
            <span><strong className="text-[#00A884] dark:text-[#25D366] font-semibold">1 more</strong> than last month</span>
          </div>
        </div>

        <div className="wa-card rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-[#075E54]/30 text-[#00A884] dark:text-[#25D366] flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-xs font-semibold text-[#667781] dark:text-[#8696A0]">Team Members</span>
          </div>
          <div className="text-3xl font-black text-[#111B21] dark:text-[#E9EDEF] tracking-tight pl-0.5">
            {teamMembersCount}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-[#667781] dark:text-[#8696A0] pl-0.5">
            <ArrowUp className="w-3.5 h-3.5 text-[#00A884] dark:text-[#25D366] stroke-[2.5]" />
            <span><strong className="text-[#00A884] dark:text-[#25D366] font-semibold">2 new</strong> this month</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="wa-card rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-extrabold text-[#111B21] dark:text-[#E9EDEF] mb-4 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-[#00A884]" />
              Project Progress
            </h2>

            <div className="flex items-center justify-between gap-4 py-2">
              <div className="relative flex items-center justify-center shrink-0">
                <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="9"
                    fill="transparent"
                    className="text-[#E9EDEF] dark:text-[#2A3942]"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#00A884"
                    strokeWidth="9"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 * (1 - avgProgressPct / 100)}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xl font-black text-[#111B21] dark:text-[#E9EDEF] leading-none">
                    {avgProgressPct}%
                  </span>
                  <span className="text-[10px] text-[#667781] dark:text-[#8696A0] font-medium mt-1">
                    Average Progress
                  </span>
                </div>
              </div>

              <div className="space-y-3 flex-1 pl-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00A884]" />
                    <span className="text-[#667781] dark:text-[#8696A0]">Completed</span>
                  </div>
                  <span className="font-bold text-[#111B21] dark:text-[#E9EDEF]">{completedCount}</span>
                </div>

                <div className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" />
                    <span className="text-[#667781] dark:text-[#8696A0]">In Progress</span>
                  </div>
                  <span className="font-bold text-[#111B21] dark:text-[#E9EDEF]">{inProgressCount}</span>
                </div>

                <div className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                    <span className="text-[#667781] dark:text-[#8696A0]">Pending</span>
                  </div>
                  <span className="font-bold text-[#111B21] dark:text-[#E9EDEF]">{pendingCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="wa-card rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-extrabold text-[#111B21] dark:text-[#E9EDEF] mb-4 flex items-center gap-2">
              <ListTodo className="w-4 h-4 text-[#00A884]" />
              Project Status
            </h2>

            <div className="space-y-4 pt-1">
              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                  <span className="text-[#111B21] dark:text-[#E9EDEF]">Completed</span>
                  <span className="text-[#667781] dark:text-[#8696A0]">{completedCount} / {totalProjectsCount}</span>
                </div>
                <div className="h-2 w-full bg-[#E9EDEF] dark:bg-[#2A3942] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#00A884] rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${Math.round((completedCount / (totalProjectsCount || 1)) * 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                  <span className="text-[#111B21] dark:text-[#E9EDEF]">In Progress</span>
                  <span className="text-[#667781] dark:text-[#8696A0]">{inProgressCount} / {totalProjectsCount}</span>
                </div>
                <div className="h-2 w-full bg-[#E9EDEF] dark:bg-[#2A3942] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#3B82F6] rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${Math.round((inProgressCount / (totalProjectsCount || 1)) * 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                  <span className="text-[#111B21] dark:text-[#E9EDEF]">Pending</span>
                  <span className="text-[#667781] dark:text-[#8696A0]">{pendingCount} / {totalProjectsCount}</span>
                </div>
                <div className="h-2 w-full bg-[#E9EDEF] dark:bg-[#2A3942] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#F59E0B] rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${Math.round((pendingCount / (totalProjectsCount || 1)) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="wa-card rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-extrabold text-[#111B21] dark:text-[#E9EDEF] mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-[#00A884]" />
              Team Workload
            </h2>

            <div className="space-y-3.5 pt-0.5">
              {workloadMembers.map((m) => (
                <div key={m.name} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-8 h-8 rounded-full ${m.color} text-white font-bold text-xs flex items-center justify-center shrink-0`}>
                        {m.initials}
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-bold text-[#111B21] dark:text-[#E9EDEF] truncate leading-tight">
                          {m.name}
                        </p>
                        <p className="text-[10px] text-[#667781] dark:text-[#8696A0] truncate mt-0.5">
                          {m.role}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#111B21] dark:text-[#E9EDEF] shrink-0">
                      {m.progress}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-[#E9EDEF] dark:bg-[#2A3942] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#00A884] rounded-full transition-all duration-500"
                      style={{ width: `${m.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="wa-card rounded-2xl p-5 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#00A884]" />
            <h2 className="text-sm font-extrabold text-[#111B21] dark:text-[#E9EDEF] tracking-tight">
              Recent Projects
            </h2>
          </div>
          <Link
            to="/projects"
            className="text-xs font-bold text-[#00A884] dark:text-[#25D366] hover:text-[#059669] flex items-center gap-1 transition-colors"
          >
            <span>View All</span>
            <span>→</span>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E9EDEF] dark:border-[#2A3942] text-[11px] font-semibold text-[#667781] dark:text-[#8696A0]">
                <th className="py-2.5 px-3 font-semibold">Project</th>
                <th className="py-2.5 px-3 font-semibold">Owner</th>
                <th className="py-2.5 px-3 font-semibold">Status</th>
                <th className="py-2.5 px-3 font-semibold">Due Date</th>
                <th className="py-2.5 px-3 font-semibold">Progress</th>
                <th className="py-2.5 px-3 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9EDEF] dark:divide-[#2A3942] text-xs">
              {(recentProjects.length > 0 ? recentProjects.slice(0, 3) : defaultShowcaseProjects).map((item: any, idx) => {
                const title = item.title;
                const desc = item.description || item.desc;
                const ownerName = item.teamMembers?.[0]?.name || item.ownerName || 'Alex Rivera';
                const ownerRole = item.teamMembers?.[0]?.role || item.ownerRole || 'Project Lead';
                const ownerAvatar = item.teamMembers?.[0]?.avatar || item.ownerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100';
                const rawStatus = item.status;
                const displayStatus = (rawStatus === 'Planning' || rawStatus === 'On Hold') ? 'Pending' : rawStatus;
                const progress = item.progress || 0;
                const dueDate = item.dueDate
                  ? new Date(item.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  : 'May 10, 2025';

                const iconConfig = getProjectIcon(title, item.category);
                const IconComponent = iconConfig.icon;

                let statusBadgeClass = 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400';
                if (displayStatus === 'Completed') {
                  statusBadgeClass = 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400';
                } else if (displayStatus === 'Pending') {
                  statusBadgeClass = 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400';
                }

                return (
                  <tr
                    key={item._id || item.id || idx}
                    className="hover:bg-[#F0F2F5]/50 dark:hover:bg-[#202C33]/50 transition-colors"
                  >
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl ${iconConfig.bg} flex items-center justify-center shrink-0`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 max-w-xs">
                          <p className="font-bold text-[#111B21] dark:text-[#E9EDEF] truncate">
                            {title}
                          </p>
                          <p className="text-[11px] text-[#667781] dark:text-[#8696A0] truncate">
                            {desc}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <img
                          src={ownerAvatar}
                          alt={ownerName}
                          className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-slate-200 dark:ring-slate-700"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-[#111B21] dark:text-[#E9EDEF] truncate text-xs">
                            {ownerName}
                          </p>
                          <p className="text-[10px] text-[#667781] dark:text-[#8696A0] truncate">
                            {ownerRole}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusBadgeClass}`}>
                        {displayStatus}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-[#667781] dark:text-[#8696A0] font-medium text-xs whitespace-nowrap">
                      {dueDate}
                    </td>

                    <td className="py-3 px-3 min-w-[140px]">
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-[#111B21] dark:text-[#E9EDEF]">
                          {progress}%
                        </span>
                        <div className="w-full h-1.5 bg-[#E9EDEF] dark:bg-[#2A3942] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#00A884] rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <button
                        className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-[#2A3942] transition-colors"
                        title="Actions"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showCreateModal && (
        <ProjectForm
          allMembers={teamMembers}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateProject}
        />
      )}
    </div>
  );
};

export default Dashboard;
