import mongoose, { Document, Model, Schema } from 'mongoose';

export type TeamStatus = 'Active' | 'Inactive' | 'On Leave';

export interface ITeamMember {
  name: string;
  email: string;
  role: string;
  department: string;
  avatar: string;
  phone: string;
  status: TeamStatus;
  skills: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITeamMemberDocument extends ITeamMember, Document {}

const teamMemberSchema = new Schema<ITeamMemberDocument>(
  {
    name: {
      type: String,
      required: [true, 'Team member name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      trim: true,
      default: 'Developer',
    },
    department: {
      type: String,
      trim: true,
      default: 'Engineering',
    },
    avatar: {
      type: String,
      trim: true,
      default: '',
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: ['Active', 'Inactive', 'On Leave'],
        message: '{VALUE} is not a valid status',
      },
      default: 'Active',
    },
    skills: {
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

teamMemberSchema.virtual('assignedProjects', {
  ref: 'Project',
  localField: '_id',
  foreignField: 'teamMembers',
  count: true,
});

export const TeamMember: Model<ITeamMemberDocument> = mongoose.model<ITeamMemberDocument>(
  'TeamMember',
  teamMemberSchema
);
