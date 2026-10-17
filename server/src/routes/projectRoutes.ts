import { Router } from 'express';
import {
  getProjects,
  getProjectStats,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController';
import {
  validateBody,
  validateObjectIdParam,
  createProjectSchema,
  updateProjectSchema,
} from '../middleware/validateRequest';
import { protect, authorize } from '../middleware/authMiddleware';

const router = Router();

// Protect all project routes
router.use(protect as any);

// GET /api/projects/stats - Dashboard analytics
router.get('/stats', getProjectStats as any);

// GET /api/projects & POST /api/projects
router
  .route('/')
  .get(getProjects as any)
  .post(authorize('admin', 'manager') as any, validateBody(createProjectSchema) as any, createProject as any);

// GET, PATCH, DELETE /api/projects/:id
router
  .route('/:id')
  .all(validateObjectIdParam('id') as any)
  .get(getProjectById as any)
  .patch(authorize('admin', 'manager') as any, validateBody(updateProjectSchema) as any, updateProject as any)
  .delete(authorize('admin') as any, deleteProject as any);

export default router;
