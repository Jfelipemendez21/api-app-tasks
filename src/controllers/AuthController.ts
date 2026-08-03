import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';
import { ApiResponse } from '../utils/apiResponse';

export class AuthController {
  private authService = new AuthService();

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.authService.login(req.body);
      return ApiResponse.success(res, result, 'Inicio de sesión exitoso');
    } catch (error) {
      next(error);
    }
  };
}
