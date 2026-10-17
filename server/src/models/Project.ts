import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export type ProjectStatus = 'Planning' | 'In Progress' | 'Completed' | 'On Hold';
export type ProjectPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface IProject {
  title: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  startDate: Date;
  dueDate: Date;
  budget: number;
  spent: number;
  progress: number;
  teamMembers: Types.ObjectId[];
  category: string;
  tags: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IProjectDocument extends IProject, Document {}

const projectSchema = new Schema<IProjectDocument>(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      minlength: [2, 'Project title must be at least 2 characters'],
      maxlength: [150, 'Project title cannot exceed 150 characters'],
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    status: {
      type: String,
      enum: {
        values: ['Planning', 'In Progress', 'Completed', 'On Hold'],
        message: '{VALUE} is not a valid project status',
      },
      default: 'Planning',
    },
    priority: {
      type: String,
      enum: {
        values: ['Low', 'Medium', 'High', 'Urgent'],
        message: '{VALUE} is not a valid priority level',
      },
      default: 'Medium',
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: [true, 'Project due date is required'],
    },
    budget: {
      type: Number,
      default: 0,
      min: [0, 'Budget cannot be negative'],
    },
    spent: {
      type: Number,
      default: 0,
      min: [0, 'Spent amount cannot be negative'],
    },
    progress: {
      type: Number,
      default: 0,
      min: [0, 'Progress must be between 0 and 100'],
      max: [100, 'Progress must be between 0 and 100'],
    },
    teamMembers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'TeamMember',
      },
    ],
    category: {
      type: String,
      trim: true,
      default: 'Development',
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

projectSchema.index({ title: 'text', description: 'text' });
projectSchema.index({ status: 1 });
projectSchema.index({ priority: 1 });
projectSchema.index({ dueDate: 1 });

export const Project: Model<IProjectDocument> = mongoose.model<IProjectDocument>('Project', projectSchema);
