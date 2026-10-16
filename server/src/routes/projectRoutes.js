import { Router } from 'express';
import {
  getProjects,
  getProjectStats,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js';
import {
  validateBody,
  validateObjectIdParam,
  createProjectSchema,
  updateProjectSchema,
} from '../middleware/validateRequest.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = Router();

// Protect all project routes
router.use(protect);

// GET /api/projects/stats - Dashboard analytics
router.get('/stats', getProjectStats);

// GET /api/projects & POST /api/projects
router
  .route('/')
  .get(getProjects)
  .post(authorize('admin', 'manager'), validateBody(createProjectSchema), createProject);

// GET, PATCH, DELETE /api/projects/:id
router
  .route('/:id')
  .all(validateObjectIdParam('id'))
  .get(getProjectById)
  .patch(authorize('admin', 'manager'), validateBody(updateProjectSchema), updateProject)
  .delete(authorize('admin'), deleteProject);

export default router;
