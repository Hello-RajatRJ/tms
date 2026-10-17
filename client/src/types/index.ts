export type UserRole = 'admin' | 'manager' | 'member';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  title?: string;
  createdAt?: string;
}

export type TeamStatus = 'Active' | 'Inactive' | 'On Leave';

export interface TeamMember {
  _id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  avatar?: string;
  phone?: string;
  status: TeamStatus;
  skills: string[];
  projectCount?: number;
  assignedProjects?: Array<{
    _id: string;
    title: string;
    status: string;
    priority: string;
    dueDate: string;
    progress: number;
  }>;
  createdAt?: string;
  updatedAt?: string;
}

export type ProjectStatus = 'Planning' | 'In Progress' | 'Completed' | 'On Hold';
export type ProjectPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface Project {
  _id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  startDate?: string;
  dueDate: string;
  budget: number;
  spent: number;
  progress: number;
  teamMembers: TeamMember[];
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectStats {
  totalProjects: number;
  statusCounts: {
    completed: number;
    inProgress: number;
    planning: number;
    onHold: number;
  };
  priorityCounts: {
    Urgent: number;
    High: number;
    Medium: number;
    Low: number;
  };
  totalTeamMembers: number;
  activeTeamMembers: number;
  totalBudget: number;
  totalSpent: number;
  avgProgress: number;
  upcomingDeadlines: Array<{
    _id: string;
    title: string;
    dueDate: string;
    status: ProjectStatus;
    priority: ProjectPriority;
    progress: number;
  }>;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  count?: number;
}
