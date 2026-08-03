import { Router } from 'express';
import { TaskController } from '../controllers/TaskController';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createTaskSchema, updateTaskSchema } from '../validations/task.validation';
import { paginationQuerySchema } from '../validations/common.validation';

const router = Router();
const taskController = new TaskController();

router.use(authMiddleware);

/**
 * @openapi
 * /api/tasks:
 *   post:
 *     summary: Crear una tarea
 *     tags:
 *       - Tareas
 *     security:
 *       - bearerAuth: []
 *   get:
 *     summary: Listar tareas paginadas con filtros por búsqueda, estado, prioridad y usuario asignado
 *     tags:
 *       - Tareas
 *     security:
 *       - bearerAuth: []
 */
router.post('/', validate(createTaskSchema), taskController.createTask);
router.get('/', validate(paginationQuerySchema, 'query'), taskController.getTasks);
router.get('/:id', taskController.getTaskById);
router.put('/:id', validate(updateTaskSchema), taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

export default router;
