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

router.use(protect as any);

router
  .route('/')
  .get(getTeamMembers as any)
  .post(authorize('admin', 'manager') as any, validateBody(createTeamMemberSchema) as any, createTeamMember as any);

router
  .route('/:id')
  .all(validateObjectIdParam('id') as any)
  .get(getTeamMemberById as any)
  .patch(authorize('admin', 'manager') as any, validateBody(updateTeamMemberSchema) as any, updateTeamMember as any)
  .delete(authorize('admin') as any, deleteTeamMember as any);

export default router;
