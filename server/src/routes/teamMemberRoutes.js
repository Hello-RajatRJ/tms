import { Router } from 'express';
import {
  getTeamMembers,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from '../controllers/teamMemberController.js';
import {
  validateBody,
  validateObjectIdParam,
  createTeamMemberSchema,
  updateTeamMemberSchema,
} from '../middleware/validateRequest.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = Router();

// Protect all team member routes
router.use(protect);

// GET /api/team-members & POST /api/team-members
router
  .route('/')
  .get(getTeamMembers)
  .post(authorize('admin', 'manager'), validateBody(createTeamMemberSchema), createTeamMember);

// GET, PATCH, DELETE /api/team-members/:id
router
  .route('/:id')
  .all(validateObjectIdParam('id'))
  .get(getTeamMemberById)
  .patch(authorize('admin', 'manager'), validateBody(updateTeamMemberSchema), updateTeamMember)
  .delete(authorize('admin'), deleteTeamMember);

export default router;
