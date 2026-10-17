import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  Users2,
  ArrowRight,
  Plus,
  TrendingUp,
  DollarSign,
  Activity,
  Calendar,
  Sparkles,
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { LoadingState, ErrorState } from '../components/LoadingState';
import ProjectForm from '../components/ProjectForm';
import ThemeToggle from '../components/ThemeToggle';
import ProfileMenu from '../components/ProfileMenu';
import { useAuthStore } from '../store/useAuthStore';
import { useProjectStore } from '../store/useProjectStore';
import { useTeamMemberStore } from '../store/useTeamMemberStore';

// Animated Counter Hook with smooth cubic-bezier easing
const useAnimatedCounter = (target: number, duration: number = 1000): number => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target === 0) {
      setCount(0);
      return;
    }

    let start = 0;
    const startTime = performance.now();

    const updateCounter = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Easing out cubic: 1 - pow(1 - progress, 3)
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.round(start + (target - start) * easeProgress);

      setCount(currentVal);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        setCount(target);
      }
    };

    requestAnimationFrame(updateCounter);
  }, [target, duration]);

  return count;
};

// Animated Radial Progress Ring
const AnimatedProgressRing: React.FC<{ progress: number; size?: number; strokeWidth?: number }> = ({
  progress,
  size = 120,
  strokeWidth = 10,
}) => {
  const animatedProgress = useAnimatedCounter(progress, 1400);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (animatedProgress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-100 dark:text-slate-800"
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#gradient-progress)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
          fill="transparent"
        />
        <defs>
          <linearGradient id="gradient-progress" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00A884" />
            <stop offset="100%" stopColor="#25D366" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-2xl font-black text-[#111B21] dark:text-[#E9EDEF] tracking-tight">
          {animatedProgress}%
        </span>
        <span className="text-[10px] font-bold text-[#667781] dark:text-[#8696A0] uppercase tracking-wider">
          Avg Progress
        </span>
      </div>
    </div>
  );
};

export const Dashboard: React.FC = () => {
  const { user, canManage } = useAuthStore();
  const {
    stats,
    projects,
    statsLoading,
    error,
    fetchStats,
    fetchProjects,
    createProject,
    updateProjectStatus,
  } = useProjectStore();

  const { teamMembers, fetchTeamMembers } = useTeamMemberStore();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchDashboardData = async () => {
    await Promise.all([
      fetchStats(),
      fetchProjects({ sort: 'createdAt:desc' }),
      fetchTeamMembers(),
    ]);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleCreateProject = async (data: any) => {
    await createProject(data);
  };

  const handleQuickStatusChange = async (projectId: string, newStatus: string) => {
    await updateProjectStatus(projectId, newStatus);
  };

  const recentProjects = projects.slice(0, 5);
  const loading = statsLoading && projects.length === 0;

  // Animated metric counters
  const animatedTotalProjects = useAnimatedCounter(stats?.totalProjects || 0, 1000);
  const animatedCompleted = useAnimatedCounter(stats?.statusCounts?.completed || 0, 1200);
  const animatedInProgress = useAnimatedCounter(stats?.statusCounts?.inProgress || 0, 1100);
  const animatedMembers = useAnimatedCounter(stats?.totalTeamMembers || 0, 1000);
  const animatedBudget = useAnimatedCounter(stats?.totalBudget || 0, 1400);
  const animatedSpent = useAnimatedCounter(stats?.totalSpent || 0, 1400);

  if (loading) {
    return <LoadingState message="Loading dashboard insights and animated analytics..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchDashboardData} />;
  }

  const statCards = [
    {
      title: 'Total Projects',
      value: animatedTotalProjects,
      sub: `${stats?.statusCounts?.inProgress || 0} active in sprint`,
      icon: FolderKanban,
      bgLight: 'bg-[#E7F8F0] text-[#00A884] dark:bg-[#075E54]/40 dark:text-[#25D366]',
      borderHover: 'hover:border-[#00A884]/40',
    },
    {
      title: 'Completed',
      value: animatedCompleted,
      sub: `${stats?.totalProjects ? Math.round(((stats.statusCounts?.completed || 0) / stats.totalProjects) * 100) : 0}% delivery rate`,
      icon: CheckCircle2,
      bgLight: 'bg-emerald-50 text-[#25D366] dark:bg-emerald-950/60 dark:text-[#25D366]',
      borderHover: 'hover:border-[#25D366]/40',
    },
    {
      title: 'In Progress',
      value: animatedInProgress,
      sub: `${stats?.statusCounts?.planning || 0} in planning phase`,
      icon: Clock,
      bgLight: 'bg-[#E7F8F0] text-[#128C7E] dark:bg-[#128C7E]/30 dark:text-[#25D366]',
      borderHover: 'hover:border-[#128C7E]/40',
    },
    {
      title: 'Team Directory',
      value: animatedMembers,
      sub: `${stats?.activeTeamMembers || 0} active contributors`,
      icon: Users2,
      bgLight: 'bg-[#E7F8F0] text-[#075E54] dark:bg-[#075E54]/40 dark:text-[#25D366]',
      borderHover: 'hover:border-[#075E54]/40',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header Row with Theme Toggle & Profile Menu */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#111B21] dark:text-[#E9EDEF] tracking-tight flex items-center gap-2">
            <span>Project Analytics & Operations</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-pulse" />
          </h1>
          <p className="text-xs sm:text-sm text-[#667781] dark:text-[#8696A0] mt-0.5">
            Real-time project telemetry, financial health, and workload metrics
          </p>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <ThemeToggle />
          <ProfileMenu />
        </div>
      </div>

      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#075E54] via-[#128C7E] to-[#00A884] text-white p-6 sm:p-8 shadow-xl shadow-[#00A884]/20 border border-[#25D366]/20">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white mb-3 border border-white/25">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              TypeScript & Zustand Engine Active
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              Welcome back, {user?.name || 'Workspace Leader'}
            </h2>
            <p className="text-xs sm:text-sm text-white/90 mt-2 leading-relaxed">
              Track active deliverables, budget utilization, and assignees with synchronized live telemetry.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {canManage() && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white text-[#075E54] hover:bg-[#F0F2F5] font-extrabold text-xs shadow-md transition-all hover:scale-105 active:scale-95"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                New Project
              </button>
            )}
            <Link
              to="/projects"
              className="inline-flex items-center gap-1 px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs border border-white/25 backdrop-blur-md transition-all"
            >
              All Projects
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="absolute -right-10 -bottom-16 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Animated Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className={`wa-card rounded-3xl p-5 group ${card.borderHover}`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[#667781] dark:text-[#8696A0]">
                  {card.title}
                </span>
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center ${card.bgLight} transition-transform duration-300 group-hover:scale-110 shadow-xs`}
                >
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#111B21] dark:text-[#E9EDEF] tracking-tight">
                  {card.value}
                </span>
              </div>
              <p className="text-xs text-[#667781] dark:text-[#8696A0] mt-1.5 font-medium">{card.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Analytics Visualization Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress & Financial Overview Card */}
        <div className="wa-card rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-extrabold text-[#111B21] dark:text-[#E9EDEF] flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#00A884]" />
                Portfolio Velocity
              </h2>
              <span className="text-[11px] font-bold text-[#00A884] dark:text-[#25D366] bg-[#E7F8F0] dark:bg-[#075E54]/40 px-2.5 py-0.5 rounded-full border border-[#00A884]/20">
                Active
              </span>
            </div>

            {/* Circular Gauge */}
            <div className="flex justify-center my-4 py-2">
              <AnimatedProgressRing progress={stats?.avgProgress || 0} size={130} strokeWidth={11} />
            </div>
          </div>

          {/* Budget & Spend Analytics */}
          <div className="pt-4 border-t border-[#E9EDEF] dark:border-[#2A3942] grid grid-cols-2 gap-3">
            <div className="p-3 bg-[#F0F2F5] dark:bg-[#222E35] rounded-2xl border border-[#E9EDEF] dark:border-[#2A3942] text-center">
              <span className="text-[10px] font-bold text-[#667781] dark:text-[#8696A0] uppercase tracking-wider block">
                Total Budget
              </span>
              <span className="text-base font-black text-[#111B21] dark:text-[#E9EDEF] mt-0.5 block">
                ${animatedBudget.toLocaleString()}
              </span>
            </div>
            <div className="p-3 bg-[#F0F2F5] dark:bg-[#222E35] rounded-2xl border border-[#E9EDEF] dark:border-[#2A3942] text-center">
              <span className="text-[10px] font-bold text-[#667781] dark:text-[#8696A0] uppercase tracking-wider block">
                Allocated / Spent
              </span>
              <span className="text-base font-black text-[#00A884] dark:text-[#25D366] mt-0.5 block">
                ${animatedSpent.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Project Status Breakdown */}
        <div className="wa-card rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-extrabold text-[#111B21] dark:text-[#E9EDEF] mb-4 flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-[#00A884]" />
              Status Lifecycle
            </h2>

            <div className="space-y-4">
              {[
                {
                  label: 'Completed',
                  count: stats?.statusCounts?.completed || 0,
                  color: 'bg-[#25D366]',
                  textColor: 'text-[#25D366]',
                },
                {
                  label: 'In Progress',
                  count: stats?.statusCounts?.inProgress || 0,
                  color: 'bg-[#00A884]',
                  textColor: 'text-[#00A884] dark:text-[#25D366]',
                },
                {
                  label: 'Planning',
                  count: stats?.statusCounts?.planning || 0,
                  color: 'bg-amber-500',
                  textColor: 'text-amber-600 dark:text-amber-400',
                },
                {
                  label: 'On Hold',
                  count: stats?.statusCounts?.onHold || 0,
                  color: 'bg-[#8696A0]',
                  textColor: 'text-[#667781] dark:text-[#8696A0]',
                },
              ].map((item) => {
                const total = stats?.totalProjects || 1;
                const pct = Math.round((item.count / total) * 100);
                return (
                  <div key={item.label} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-[#111B21] dark:text-[#E9EDEF]">{item.label}</span>
                      <span className={item.textColor}>
                        {item.count} ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 w-full bg-[#E9EDEF] dark:bg-[#2A3942] rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full transition-all duration-700 ease-out`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E9EDEF] dark:border-[#2A3942] text-xs text-[#667781] dark:text-[#8696A0] font-medium text-center">
            Distribution across all registered projects
          </div>
        </div>

        {/* Priority Distribution Matrix */}
        <div className="wa-card rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-extrabold text-[#111B21] dark:text-[#E9EDEF] mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#00A884]" />
              Priority Severity Matrix
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  label: 'Urgent',
                  count: stats?.priorityCounts?.Urgent || 0,
                  bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
                  badge: 'Critical',
                },
                {
                  label: 'High',
                  count: stats?.priorityCounts?.High || 0,
                  bg: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
                  badge: 'High Impact',
                },
                {
                  label: 'Medium',
                  count: stats?.priorityCounts?.Medium || 0,
                  bg: 'bg-[#E7F8F0] text-[#00A884] dark:bg-[#075E54]/30 dark:text-[#25D366] border-[#00A884]/30',
                  badge: 'Standard',
                },
                {
                  label: 'Low',
                  count: stats?.priorityCounts?.Low || 0,
                  bg: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
                  badge: 'Backlog',
                },
              ].map((p) => (
                <div
                  key={p.label}
                  className={`p-4 rounded-2xl border flex flex-col justify-between transition-transform duration-200 hover:scale-[1.02] ${p.bg}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">{p.label}</span>
                    <span className="text-[10px] opacity-75 font-semibold">{p.badge}</span>
                  </div>
                  <span className="text-2xl font-black mt-3">{p.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E9EDEF] dark:border-[#2A3942] text-xs text-[#667781] dark:text-[#8696A0] font-medium text-center">
            Resource allocation mapped by priority level
          </div>
        </div>
      </div>

      {/* Recent Projects Table / Cards Section */}
      <div className="wa-card rounded-3xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-extrabold text-[#111B21] dark:text-[#E9EDEF] tracking-tight">
              Recent Projects
            </h2>
            <p className="text-xs text-[#667781] dark:text-[#8696A0]">Latest active initiatives in your workspace</p>
          </div>
          <Link
            to="/projects"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00A884] dark:text-[#25D366] hover:text-[#075E54]"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentProjects.length === 0 ? (
          <div className="text-center py-10 text-[#667781] dark:text-[#8696A0] text-xs italic">
            No projects found. Launch your first project above!
          </div>
        ) : (
          <div className="divide-y divide-[#E9EDEF] dark:divide-[#2A3942]">
            {recentProjects.map((p) => (
              <div
                key={p._id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-bold text-[#111B21] dark:text-[#E9EDEF] truncate group-hover:text-[#00A884] dark:group-hover:text-[#25D366] transition-colors">
                      {p.title}
                    </h3>
                    <StatusBadge value={p.status} type="status" size="sm" />
                    <StatusBadge value={p.priority} type="priority" size="sm" />
                  </div>
                  <p className="text-xs text-[#667781] dark:text-[#8696A0] truncate">
                    {p.description}
                  </p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="w-28 text-right hidden md:block">
                    <span className="text-xs font-bold text-[#111B21] dark:text-[#E9EDEF]">
                      {p.progress}% done
                    </span>
                    <div className="w-full h-1.5 bg-[#E9EDEF] dark:bg-[#2A3942] rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full bg-[#00A884] rounded-full transition-all duration-500"
                        style={{ width: `${p.progress}%` }}
                      />
                    </div>
                  </div>

                  {canManage() && p.status !== 'Completed' && (
                    <button
                      onClick={() => handleQuickStatusChange(p._id, 'Completed')}
                      className="px-3.5 py-1.5 rounded-xl bg-[#E7F8F0] dark:bg-[#075E54]/40 text-[#00A884] dark:text-[#25D366] hover:bg-[#00A884]/20 text-xs font-bold transition-colors"
                    >
                      Complete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Project Form Modal */}
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
