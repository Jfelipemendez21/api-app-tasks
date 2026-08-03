import { Request, Response, NextFunction } from 'express';
import { TaskService } from '../services/TaskService';
import { ApiResponse } from '../utils/apiResponse';

export class TaskController {
  private taskService = new TaskService();

  createTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const currentUserId = req.user!.id;
      const task = await this.taskService.createTask(req.body, currentUserId);
      return ApiResponse.success(res, task, 'Tarea creada exitosamente', 201);
    } catch (error) {
      next(error);
    }
  };

  getTasks = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.taskService.getTasks(req.query as any);
      return ApiResponse.paginated(res, result, 'Tareas obtenidas correctamente');
    } catch (error) {
      next(error);
    }
  };

  getTaskById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const task = await this.taskService.getTaskById(req.params.id);
      return ApiResponse.success(res, task, 'Tarea obtenida correctamente');
    } catch (error) {
      next(error);
    }
  };

  updateTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const task = await this.taskService.updateTask(req.params.id, req.body);
      return ApiResponse.success(res, task, 'Tarea actualizada exitosamente');
    } catch (error) {
      next(error);
    }
  };

  deleteTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.taskService.deleteTask(req.params.id);
      return ApiResponse.success(res, result, 'Tarea eliminada exitosamente');
    } catch (error) {
      next(error);
    }
  };
}
