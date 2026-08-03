import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/UserService';
import { ApiResponse } from '../utils/apiResponse';

export class UserController {
  private userService = new UserService();

  createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.createUser(req.body);
      return ApiResponse.success(res, user, 'Usuario creado exitosamente', 201);
    } catch (error) {
      next(error);
    }
  };

  getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.userService.getUsers(req.query as any);
      return ApiResponse.paginated(res, result, 'Usuarios obtenidos correctamente');
    } catch (error) {
      next(error);
    }
  };

  getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.getUserById(req.params.id);
      return ApiResponse.success(res, user, 'Usuario obtenido correctamente');
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.updateUser(req.params.id, req.body);
      return ApiResponse.success(res, user, 'Usuario actualizado exitosamente');
    } catch (error) {
      next(error);
    }
  };

  deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.userService.deleteUser(req.params.id);
      return ApiResponse.success(res, result, 'Usuario eliminado exitosamente');
    } catch (error) {
      next(error);
    }
  };
}
