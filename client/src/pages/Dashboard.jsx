import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Users2,
  ArrowRight,
  Plus,
  TrendingUp,
  DollarSign,
  Briefcase,
} from 'lucide-react';
import { projectService, teamMemberService } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import { LoadingState, ErrorState } from '../components/LoadingState';
import ProjectForm from '../components/ProjectForm';

export const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentProjects, setRecentProjects] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [statsRes, projectsRes, membersRes] = await Promise.all([
        projectService.getStats(),
        projectService.getAll({ sort: 'createdAt:desc' }),
        teamMemberService.getAll(),
      ]);

      setStats(statsRes.data);
      setRecentProjects(projectsRes.data ? projectsRes.data.slice(0, 5) : []);
      setTeamMembers(membersRes.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleCreateProject = async (data) => {
    await projectService.create(data);
    fetchDashboardData();
  };

  const handleQuickStatusChange = async (projectId, newStatus) => {
    try {
      await projectService.update(projectId, { status: newStatus });
      fetchDashboardData();
    } catch (err) {
      alert(err.message || 'Failed to update status');
    }
  };

  if (loading) {
    return <LoadingState message="Loading dashboard insights and analytics..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchDashboardData} />;
  }

  const statCards = [
    {
      title: 'Total Projects',
      value: stats?.totalProjects || 0,
      sub: `${stats?.statusCounts?.inProgress || 0} currently active`,
      icon: FolderKanban,
      gradient: 'from-blue-600 to-indigo-600',
      bgLight: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400',
    },
    {
      title: 'Completed',
      value: stats?.statusCounts?.completed || 0,
      sub: `${stats?.totalProjects ? Math.round(((stats.statusCounts.completed || 0) / stats.totalProjects) * 100) : 0}% completion rate`,
      icon: CheckCircle2,
      gradient: 'from-emerald-600 to-teal-600',
      bgLight: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400',
    },
    {
      title: 'In Progress',
      value: stats?.statusCounts?.inProgress || 0,
      sub: `${stats?.statusCounts?.planning || 0} in planning phase`,
      icon: Clock,
      gradient: 'from-amber-600 to-orange-600',
      bgLight: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400',
    },
    {
      title: 'Team Members',
      value: stats?.totalTeamMembers || 0,
      sub: `${stats?.activeTeamMembers || 0} active members`,
      icon: Users2,
      gradient: 'from-purple-600 to-pink-600',
      bgLight: 'bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-700 text-white p-6 sm:p-8 shadow-md">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-xs text-indigo-100 mb-2">
              <TrendingUp className="w-3.5 h-3.5" /> Workspace Overview
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back to TMS
            </h1>
            <p className="text-sm text-indigo-100/90 mt-1 max-w-xl">
              Track project milestones, monitor team velocity, and drive projects across the finish line.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-indigo-700 hover:bg-indigo-50 font-semibold text-xs shadow-sm transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              New Project
            </button>
            <Link
              to="/projects"
              className="inline-flex items-center gap-1 px-4 py-2.5 rounded-xl bg-indigo-500/30 hover:bg-indigo-500/40 text-white font-semibold text-xs border border-white/20 transition-colors"
            >
              View All
            </Link>
          </div>
        </div>
        <div className="absolute right-0 -bottom-10 w-96 h-96 bg-white/5 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Metrics Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {card.title}
                </span>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${card.bgLight}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  {card.value}
                </span>
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium">{card.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Second Row: Status & Priority Visual Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Status Breakdown */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
            Status Breakdown
          </h2>
          <div className="space-y-3">
            {[
              { label: 'Completed', count: stats?.statusCounts?.completed || 0, color: 'bg-emerald-500' },
              { label: 'In Progress', count: stats?.statusCounts?.inProgress || 0, color: 'bg-blue-500' },
              { label: 'Planning', count: stats?.statusCounts?.planning || 0, color: 'bg-amber-500' },
              { label: 'On Hold', count: stats?.statusCounts?.onHold || 0, color: 'bg-slate-400' },
            ].map((item) => {
              const total = stats?.totalProjects || 1;
              const pct = Math.round((item.count / total) * 100);
              return (
                <div key={item.label} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-600 dark:text-slate-400">{item.label}</span>
                    <span className="text-slate-900 dark:text-white font-bold">
                      {item.count} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Budget & Spend summary */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-center">
            <div className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
              <span className="text-[11px] font-medium text-slate-400 block">Total Budget</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                ${(stats?.totalBudget || 0).toLocaleString()}
              </span>
            </div>
            <div className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
              <span className="text-[11px] font-medium text-slate-400 block">Total Spent</span>
              <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                ${(stats?.totalSpent || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Priority Counts */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
            Priority Distribution
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Urgent', count: stats?.priorityCounts?.Urgent || 0, bg: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200 dark:border-rose-900' },
              { label: 'High', count: stats?.priorityCounts?.High || 0, bg: 'bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400 border-orange-200 dark:border-orange-900' },
              { label: 'Medium', count: stats?.priorityCounts?.Medium || 0, bg: 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400 border-sky-200 dark:border-sky-900' },
              { label: 'Low', count: stats?.priorityCounts?.Low || 0, bg: 'bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700' },
            ].map((p) => (
              <div key={p.label} className={`p-4 rounded-xl border flex flex-col justify-between ${p.bg}`}>
                <span className="text-xs font-semibold">{p.label}</span>
                <span className="text-2xl font-black mt-2">{p.count}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Average Completion</span>
              <span className="font-bold text-slate-900 dark:text-white">{stats?.avgProgress || 0}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full"
                style={{ width: `${stats?.avgProgress || 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Upcoming Deadlines
              </h2>
            </div>

            {stats?.upcomingDeadlines && stats.upcomingDeadlines.length > 0 ? (
              <div className="space-y-3">
                {stats.upcomingDeadlines.map((proj) => {
                  const d = new Date(proj.dueDate);
                  const formatted = !isNaN(d) ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';
                  return (
                    <div
                      key={proj._id}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{proj.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <StatusBadge value={proj.priority} type="priority" size="sm" />
                          <span className="text-[11px] text-slate-400">Due {formatted}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{proj.progress}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic py-6 text-center">No upcoming critical deadlines.</p>
            )}
          </div>

          <Link
            to="/projects"
            className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700"
          >
            <span>Browse All Projects</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Recent Projects Table / List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Recent Projects</h2>
            <p className="text-xs text-slate-400">Latest active projects across the workspace</p>
          </div>
          <Link
            to="/projects"
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700"
          >
            View all ({stats?.totalProjects || 0})
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                <th className="py-3 px-3">Project</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Priority</th>
                <th className="py-3 px-3">Progress</th>
                <th className="py-3 px-3">Due Date</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {recentProjects.map((p) => {
                const dateStr = new Date(p.dueDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });
                return (
                  <tr key={p._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white max-w-xs truncate">
                      {p.title}
                      <span className="block text-[11px] font-normal text-slate-400">{p.category}</span>
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge value={p.status} type="status" size="sm" />
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge value={p.priority} type="priority" size="sm" />
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-600 rounded-full"
                            style={{ width: `${p.progress}%` }}
                          />
                        </div>
                        <span className="text-[11px] text-slate-500 font-medium">{p.progress}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-500">{dateStr}</td>
                    <td className="py-3 px-3 text-right">
                      {p.status !== 'Completed' ? (
                        <button
                          onClick={() => handleQuickStatusChange(p._id, 'Completed')}
                          className="px-2.5 py-1 text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg transition-colors"
                        >
                          Complete
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400">Done</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Project Modal */}
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
