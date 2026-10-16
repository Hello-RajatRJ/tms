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

const router = Router();

// GET /api/team-members & POST /api/team-members
router
  .route('/')
  .get(getTeamMembers)
  .post(validateBody(createTeamMemberSchema), createTeamMember);

// GET, PATCH, DELETE /api/team-members/:id
router
  .route('/:id')
  .all(validateObjectIdParam('id'))
  .get(getTeamMemberById)
  .patch(validateBody(updateTeamMemberSchema), updateTeamMember)
  .delete(deleteTeamMember);

export default router;
