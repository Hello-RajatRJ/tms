import { Router } from 'express';
import {
  getTeamMembers,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from '../controllers/teamMemberController';
import {
  validateBody,
  validateObjectIdParam,
  createTeamMemberSchema,
  updateTeamMemberSchema,
} from '../middleware/validateRequest';
import { protect, authorize } from '../middleware/authMiddleware';

const router = Router();

// Protect all team member routes
router.use(protect as any);

// GET /api/team-members & POST /api/team-members
router
  .route('/')
  .get(getTeamMembers as any)
  .post(authorize('admin', 'manager') as any, validateBody(createTeamMemberSchema) as any, createTeamMember as any);

// GET, PATCH, DELETE /api/team-members/:id
router
  .route('/:id')
  .all(validateObjectIdParam('id') as any)
  .get(getTeamMemberById as any)
  .patch(authorize('admin', 'manager') as any, validateBody(updateTeamMemberSchema) as any, updateTeamMember as any)
  .delete(authorize('admin') as any, deleteTeamMember as any);

export default router;
