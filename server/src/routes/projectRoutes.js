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

const router = Router();

// GET /api/projects/stats - Dashboard analytics
router.get('/stats', getProjectStats);

// GET /api/projects & POST /api/projects
router
  .route('/')
  .get(getProjects)
  .post(validateBody(createProjectSchema), createProject);

// GET, PATCH, DELETE /api/projects/:id
router
  .route('/:id')
  .all(validateObjectIdParam('id'))
  .get(getProjectById)
  .patch(validateBody(updateProjectSchema), updateProject)
  .delete(deleteProject);

export default router;
