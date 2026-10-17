import { Request } from 'express';
import { Document, Types } from 'mongoose';

export type UserRole = 'admin' | 'manager' | 'member';

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export type IUserDocument = IUser & Document;

export type ProjectStatus = 'Planning' | 'In Progress' | 'Completed' | 'On Hold';
export type ProjectPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface IProject {
  _id: Types.ObjectId;
  title: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  startDate?: Date;
  endDate?: Date;
  budget: number;
  progress: number;
  assignedTo?: Types.ObjectId;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type IProjectDocument = IProject & Document;

export type TeamDepartment = 'Engineering' | 'Design' | 'Product' | 'Marketing' | 'Operations' | 'Sales';

export interface ITeamMember {
  _id: Types.ObjectId;
  name: string;
  email: string;
  role: string;
  department: TeamDepartment;
  avatar?: string;
  projectsAssigned: number;
  skills: string[];
  status: 'Active' | 'On Leave' | 'Inactive';
  createdAt: Date;
  updatedAt: Date;
}

export type ITeamMemberDocument = ITeamMember & Document;

export interface AuthUserPayload {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthRequest extends Request {
  user?: AuthUserPayload;
}
