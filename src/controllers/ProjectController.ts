import { Request, Response, NextFunction } from 'express';
import { ProjectService } from '../services/ProjectService';
import { ApiResponse } from '../utils/apiResponse';

export class ProjectController {
  private projectService = new ProjectService();

  createProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const project = await this.projectService.createProject(req.body);
      return ApiResponse.success(res, project, 'Proyecto creado exitosamente', 201);
    } catch (error) {
      next(error);
    }
  };

  getProjects = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.projectService.getProjects(req.query as any);
      return ApiResponse.paginated(res, result, 'Proyectos obtenidos correctamente');
    } catch (error) {
      next(error);
    }
  };

  getProjectById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const project = await this.projectService.getProjectById(req.params.id);
      return ApiResponse.success(res, project, 'Proyecto obtenido correctamente');
    } catch (error) {
      next(error);
    }
  };

  updateProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const project = await this.projectService.updateProject(req.params.id, req.body);
      return ApiResponse.success(res, project, 'Proyecto actualizado exitosamente');
    } catch (error) {
      next(error);
    }
  };

  deleteProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.projectService.deleteProject(req.params.id);
      return ApiResponse.success(res, result, 'Proyecto eliminado exitosamente');
    } catch (error) {
      next(error);
    }
  };
}
