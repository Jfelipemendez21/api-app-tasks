import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import { UserRole } from '../entities/User';
import { createUserSchema, updateUserSchema } from '../validations/user.validation';
import { paginationQuerySchema } from '../validations/common.validation';

const router = Router();
const userController = new UserController();

// Every user in the system must be authenticated
router.use(authMiddleware);

/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: Listar usuarios paginados con búsqueda (cualquier usuario autenticado)
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 */
router.get('/', validate(paginationQuerySchema, 'query'), userController.getUsers);

// Write operations (and reading a single user) are restricted to ADMIN only
router.post(
  '/',
  roleMiddleware([UserRole.ADMIN]),
  validate(createUserSchema),
  userController.createUser
);
router.get('/:id', roleMiddleware([UserRole.ADMIN]), userController.getUserById);
router.put(
  '/:id',
  roleMiddleware([UserRole.ADMIN]),
  validate(updateUserSchema),
  userController.updateUser
);
router.delete('/:id', roleMiddleware([UserRole.ADMIN]), userController.deleteUser);

export default router;
