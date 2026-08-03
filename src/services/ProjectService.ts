import { AppDataSource } from '../config/data-source';
import { Project, ProjectStatus } from '../entities/Project';
import { Task, TaskStatus } from '../entities/Task';
import { AppError } from '../utils/appError';
import { CreateProjectDto, UpdateProjectDto } from '../validations/project.validation';
import { PaginationQueryDto } from '../validations/common.validation';
import { TimeFormatter } from '../utils/timeFormatter';

export class ProjectService {
  private projectRepository = AppDataSource.getRepository(Project);

  async createProject(dto: CreateProjectDto) {
    const project = this.projectRepository.create({
      ...dto,
      status: ProjectStatus.CREATED,
    });
    return this.projectRepository.save(project);
  }

  async getProjects(query: PaginationQueryDto) {
    const page = Math.max(1, query.page || 1);
    const pageSize = Math.max(1, Math.min(100, query.pageSize || 10));
    const skip = (page - 1) * pageSize;
    const orderDirection = (query.order || 'DESC').toUpperCase() as 'ASC' | 'DESC';

    const qb = this.projectRepository.createQueryBuilder('project')
      .leftJoinAndSelect('project.tasks', 'task');

    if (query.search || query.title) {
      const searchTerm = `%${query.search || query.title}%`;
      qb.andWhere('project.title ILIKE :search', { search: searchTerm });
    }

    if (query.status) {
      qb.andWhere('project.status = :status', { status: query.status });
    }

    qb.orderBy('project.createdAt', orderDirection);
    qb.skip(skip).take(pageSize);

    const [projects, total] = await qb.getManyAndCount();
    const totalPages = Math.ceil(total / pageSize) || 1;

    // Attach task count breakdown to each project for rich UI dashboard/lists
    const data = projects.map((p) => {
      const tasks = p.tasks || [];
      return {
        ...p,
        taskStats: {
          total: tasks.length,
          created: tasks.filter((t) => t.status === TaskStatus.CREATED).length,
          inProgress: tasks.filter((t) => t.status === TaskStatus.IN_PROGRESS).length,
          finished: tasks.filter((t) => t.status === TaskStatus.FINISHED).length,
          canceled: tasks.filter((t) => t.status === TaskStatus.CANCELED).length,
        },
      };
    });

    return {
      data,
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  async getProjectById(id: string) {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['tasks', 'tasks.assignedTo', 'tasks.createdBy'],
    });

    if (!project) {
      throw new AppError('Proyecto no encontrado', 404);
    }

    // Format usedTime for embedded tasks
    const formattedTasks = project.tasks ? project.tasks.map((task) => ({
      ...task,
      usedTime: TimeFormatter.calculateUsedTime(
        task.status,
        task.initialDateTime,
        task.finishedDateTime
      ),
    })) : [];

    return {
      ...project,
      tasks: formattedTasks,
    };
  }

  async updateProject(id: string, dto: UpdateProjectDto) {
    const project = await this.projectRepository.findOne({ where: { id } });

    if (!project) {
      throw new AppError('Proyecto no encontrado', 404);
    }

    if (dto.title !== undefined) project.title = dto.title;
    if (dto.description !== undefined) project.description = dto.description;

    // Project status is derived from its tasks (see recalculateProjectStatus),
    // so it is intentionally NOT manually editable here.
    return this.projectRepository.save(project);
  }

  async deleteProject(id: string) {
    const project = await this.projectRepository.findOne({ where: { id } });

    if (!project) {
      throw new AppError('Proyecto no encontrado', 404);
    }

    await this.projectRepository.remove(project);
    return { message: 'Proyecto eliminado correctamente' };
  }

  public static async recalculateProjectStatus(projectId: string): Promise<void> {
    const projectRepo = AppDataSource.getRepository(Project);
    const taskRepo = AppDataSource.getRepository(Task);

    const project = await projectRepo.findOne({ where: { id: projectId } });
    if (!project) return;

    const tasks = await taskRepo.find({ where: { projectId } });

    let newStatus: ProjectStatus;

    if (tasks.length === 0) {
      newStatus = ProjectStatus.CREATED;
    } else if (tasks.every((t) => t.status === TaskStatus.FINISHED)) {
      newStatus = ProjectStatus.FINISHED;
    } else if (tasks.every((t) => t.status === TaskStatus.CANCELED)) {
      newStatus = ProjectStatus.CANCELED;
    } else if (tasks.some((t) => t.status === TaskStatus.IN_PROGRESS)) {
      newStatus = ProjectStatus.IN_PROGRESS;
    } else {
      // No task started yet (all created, or mix of created/canceled)
      newStatus = ProjectStatus.CREATED;
    }

    if (project.status !== newStatus) {
      project.status = newStatus;
      await projectRepo.save(project);
    }
  }
}
