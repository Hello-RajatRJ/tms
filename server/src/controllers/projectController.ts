import { Request, Response, NextFunction } from 'express';
import { Project } from '../models/Project';
import { TeamMember } from '../models/TeamMember';

export const getProjects = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, priority, category, search, sort = 'createdAt:desc' } = req.query as {
      status?: string;
      priority?: string;
      category?: string;
      search?: string;
      sort?: string;
    };

    const query: any = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    if (priority && priority !== 'All') {
      query.priority = priority;
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { tags: { $in: [searchRegex] } },
      ];
    }

    const sortParts = (sort || 'createdAt:desc').split(':');
    const sortField = sortParts[0] || 'createdAt';
    const sortOrder = sortParts[1] === 'asc' ? 1 : -1;
    const sortObj: any = { [sortField]: sortOrder };

    const projects = await Project.find(query)
      .populate('teamMembers', 'name email role avatar department status')
      .sort(sortObj);

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (err) {
    next(err);
  }
};

export const getProjectStats = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const totalProjects = await Project.countDocuments();
    const completedProjects = await Project.countDocuments({ status: 'Completed' });
    const inProgressProjects = await Project.countDocuments({ status: 'In Progress' });
    const planningProjects = await Project.countDocuments({ status: 'Planning' });
    const onHoldProjects = await Project.countDocuments({ status: 'On Hold' });

    const totalTeamMembers = await TeamMember.countDocuments();
    const activeTeamMembers = await TeamMember.countDocuments({ status: 'Active' });

    const financialAggregate = await Project.aggregate([
      {
        $group: {
          _id: null,
          totalBudget: { $sum: '$budget' },
          totalSpent: { $sum: '$spent' },
          avgProgress: { $avg: '$progress' },
        },
      },
    ]);

    const finances = financialAggregate[0] || { totalBudget: 0, totalSpent: 0, avgProgress: 0 };

    const priorityAggregate = await Project.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 },
        },
      },
    ]);

    const priorityMap: Record<string, number> = { Urgent: 0, High: 0, Medium: 0, Low: 0 };
    priorityAggregate.forEach((item) => {
      if (item._id && priorityMap.hasOwnProperty(item._id)) {
        priorityMap[item._id] = item.count;
      }
    });

    const upcomingDeadlines = await Project.find({
      status: { $ne: 'Completed' },
      dueDate: { $gte: new Date() },
    })
      .sort({ dueDate: 1 })
      .limit(5)
      .select('title dueDate status priority progress');

    res.status(200).json({
      success: true,
      data: {
        totalProjects,
        statusCounts: {
          completed: completedProjects,
          inProgress: inProgressProjects,
          planning: planningProjects,
          onHold: onHoldProjects,
        },
        priorityCounts: priorityMap,
        totalTeamMembers,
        activeTeamMembers,
        totalBudget: finances.totalBudget,
        totalSpent: finances.totalSpent,
        avgProgress: Math.round(finances.avgProgress || 0),
        upcomingDeadlines,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getProjectById = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  try {
    const project = await Project.findById(req.params.id).populate(
      'teamMembers',
      'name email role avatar department status'
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: `Project with ID '${req.params.id}' was not found.`,
      });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (err) {
    next(err);
  }
};

export const createProject = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  try {
    if (req.body.teamMembers && req.body.teamMembers.length > 0) {
      const validMembers = await TeamMember.find({ _id: { $in: req.body.teamMembers } });
      if (validMembers.length !== req.body.teamMembers.length) {
        return res.status(400).json({
          success: false,
          message: 'One or more assigned team member IDs do not exist.',
        });
      }
    }

    const newProject = await Project.create(req.body);
    const populated = await Project.findById(newProject._id).populate(
      'teamMembers',
      'name email role avatar department status'
    );

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: populated,
    });
  } catch (err) {
    next(err);
  }
};

export const updateProject = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  try {
    if (req.body.teamMembers && req.body.teamMembers.length > 0) {
      const validMembers = await TeamMember.find({ _id: { $in: req.body.teamMembers } });
      if (validMembers.length !== req.body.teamMembers.length) {
        return res.status(400).json({
          success: false,
          message: 'One or more assigned team member IDs do not exist.',
        });
      }
    }

    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('teamMembers', 'name email role avatar department status');

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: `Project with ID '${req.params.id}' was not found.`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteProject = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: `Project with ID '${req.params.id}' was not found.`,
      });
    }

    await project.deleteOne();

    res.status(200).json({
      success: true,
      message: `Project '${project.title}' deleted successfully.`,
      data: { id: req.params.id },
    });
  } catch (err) {
    next(err);
  }
};
