import { Router } from 'express';
import { ProjectController } from '../controllers/ProjectController';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createProjectSchema, updateProjectSchema } from '../validations/project.validation';
import { paginationQuerySchema } from '../validations/common.validation';

const router = Router();
const projectController = new ProjectController();

router.use(authMiddleware);

/**
 * @openapi
 * /api/projects:
 *   post:
 *     summary: Crear un proyecto
 *     tags:
 *       - Proyectos
 *     security:
 *       - bearerAuth: []
 *   get:
 *     summary: Listar proyectos paginados con búsqueda y filtro de estado
 *     tags:
 *       - Proyectos
 *     security:
 *       - bearerAuth: []
 */
router.post('/', validate(createProjectSchema), projectController.createProject);
router.get('/', validate(paginationQuerySchema, 'query'), projectController.getProjects);
router.get('/:id', projectController.getProjectById);
router.put('/:id', validate(updateProjectSchema), projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

export default router;
