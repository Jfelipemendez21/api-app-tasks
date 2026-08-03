import { Request, Response, NextFunction } from 'express';
import { DashboardService } from '../services/DashboardService';
import { ApiResponse } from '../utils/apiResponse';

export class DashboardController {
  private dashboardService = new DashboardService();

  getStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = await this.dashboardService.getDashboardStats();
      return ApiResponse.success(res, stats, 'Estadísticas del panel de control obtenidas exitosamente');
    } catch (error) {
      next(error);
    }
  };
}
