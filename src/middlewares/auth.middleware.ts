import { Request, Response, NextFunction } from 'express';
import { JwtUtil } from '../utils/jwt.util';
import { ApiResponse } from '../utils/apiResponse';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return ApiResponse.error(res, 'Token no proporcionado o formato inválido', 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = JwtUtil.verifyToken(token);
    req.user = payload;
    next();
  } catch (error) {
    return ApiResponse.error(res, 'Token inválido o expirado', 401);
  }
};
