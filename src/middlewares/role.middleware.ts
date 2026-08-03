import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../entities/User';
import { ApiResponse } from '../utils/apiResponse';

export const roleMiddleware = (roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return ApiResponse.error(res, 'Usuario no autenticado', 401);
    }

    if (!roles.includes(req.user.role)) {
      return ApiResponse.error(res, 'Acceso denegado: permisos insuficientes', 403);
    }

    next();
  };
};
