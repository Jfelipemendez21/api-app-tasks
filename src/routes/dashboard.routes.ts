import { Router } from 'express';
import { DashboardController } from '../controllers/DashboardController';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const dashboardController = new DashboardController();

router.use(authMiddleware);

/**
 * @openapi
 * /api/dashboard/stats:
 *   get:
 *     summary: Obtener indicadores del panel de control
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 */
router.get('/stats', dashboardController.getStats);

export default router;
