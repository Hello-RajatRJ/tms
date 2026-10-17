import { Request, Response, NextFunction } from 'express';
import { TeamMember } from '../models/TeamMember';
import { Project } from '../models/Project';

// GET /api/team-members - List all team members
export const getTeamMembers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { search, status, department } = req.query as {
      search?: string;
      status?: string;
      department?: string;
    };

    const query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } },
      ];
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (department && department !== 'All') {
      query.department = department;
    }

    const members = await TeamMember.find(query).sort({ createdAt: -1 });

    // Attach assigned project counts
    const membersWithProjectCounts = await Promise.all(
      members.map(async (member) => {
        const projectCount = await Project.countDocuments({ teamMembers: member._id });
        const memberObj = member.toObject();
        return {
          ...memberObj,
          projectCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: membersWithProjectCounts.length,
      data: membersWithProjectCounts,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/team-members/:id - Get single team member
export const getTeamMemberById = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  try {
    const member = await TeamMember.findById(req.params.id);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: `Team member with ID '${req.params.id}' was not found.`,
      });
    }

    const assignedProjects = await Project.find({ teamMembers: member._id }).select(
      'title status priority dueDate progress'
    );

    const memberObj = member.toObject();

    res.status(200).json({
      success: true,
      data: {
        ...memberObj,
        assignedProjects,
      },
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/team-members - Add new team member
export const createTeamMember = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  try {
    const { email } = req.body;
    const existing = await TeamMember.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: `A team member with email '${email}' already exists.`,
      });
    }

    const newMember = await TeamMember.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Team member created successfully',
      data: newMember,
    });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/team-members/:id - Update team member
export const updateTeamMember = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  try {
    if (req.body.email) {
      const conflict = await TeamMember.findOne({
        email: req.body.email.toLowerCase(),
        _id: { $ne: req.params.id },
      });
      if (conflict) {
        return res.status(409).json({
          success: false,
          message: `Email '${req.body.email}' is already taken by another team member.`,
        });
      }
    }

    const updatedMember = await TeamMember.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedMember) {
      return res.status(404).json({
        success: false,
        message: `Team member with ID '${req.params.id}' was not found.`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Team member updated successfully',
      data: updatedMember,
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/team-members/:id - Delete team member
export const deleteTeamMember = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  try {
    const member = await TeamMember.findById(req.params.id);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: `Team member with ID '${req.params.id}' was not found.`,
      });
    }

    // Unassign from projects before deleting
    await Project.updateMany({ teamMembers: member._id }, { $pull: { teamMembers: member._id } });

    await member.deleteOne();

    res.status(200).json({
      success: true,
      message: `Team member '${member.name}' deleted successfully.`,
      data: { id: req.params.id },
    });
  } catch (err) {
    next(err);
  }
};
