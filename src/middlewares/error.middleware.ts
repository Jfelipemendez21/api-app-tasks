import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';
import { ApiResponse } from '../utils/apiResponse';

export const errorMiddleware = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Centralized Error Handler caught error:', err);

  if (err instanceof AppError) {
    return ApiResponse.error(res, err.message, err.statusCode);
  }

  // Handle TypeORM or driver errors
  if (err.name === 'QueryFailedError') {
    return ApiResponse.error(res, 'Error en la consulta de base de datos', 400);
  }

  return ApiResponse.error(res, 'Error interno del servidor', 500);
};
