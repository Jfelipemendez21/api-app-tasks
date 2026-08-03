import { AppDataSource } from '../config/data-source';
import { Task, TaskStatus } from '../entities/Task';
import { User } from '../entities/User';
import { Project } from '../entities/Project';
import { AppError } from '../utils/appError';
import { CreateTaskDto, UpdateTaskDto } from '../validations/task.validation';
import { PaginationQueryDto } from '../validations/common.validation';
import { TimeFormatter } from '../utils/timeFormatter';
import { ALLOWED_TASK_TRANSITIONS } from '../utils/taskTransitions';
import { ProjectService } from './ProjectService';

export class TaskService {
  private taskRepository = AppDataSource.getRepository(Task);
  private userRepository = AppDataSource.getRepository(User);
  private projectRepository = AppDataSource.getRepository(Project);

  async createTask(dto: CreateTaskDto, currentUserId: string) {
    const project = await this.projectRepository.findOne({ where: { id: dto.projectId } });
    if (!project) {
      throw new AppError('Proyecto no encontrado', 404);
    }

    const creator = await this.userRepository.findOne({ where: { id: currentUserId } });
    if (!creator) {
      throw new AppError('Usuario creador no encontrado', 404);
    }

    let assignedUser: User | null = null;
    if (dto.assignedToId) {
      assignedUser = await this.userRepository.findOne({ where: { id: dto.assignedToId } });
      if (!assignedUser) {
        throw new AppError('Usuario asignado no encontrado', 404);
      }
    }

    const task = this.taskRepository.create({
      title: dto.title,
      description: dto.description,
      priority: dto.priority,
      status: TaskStatus.CREATED,
      initialDateTime: null,
      finishedDateTime: null,
      project,
      createdBy: creator,
      assignedTo: assignedUser,
    });

    const saved = await this.taskRepository.save(task);

    // Trigger project status recalculation
    await ProjectService.recalculateProjectStatus(dto.projectId);

    return this.getTaskById(saved.id);
  }

  async getTasks(query: PaginationQueryDto) {
    const page = Math.max(1, query.page || 1);
    const pageSize = Math.max(1, Math.min(100, query.pageSize || 10));
    const skip = (page - 1) * pageSize;
    const orderDirection = (query.order || 'DESC').toUpperCase() as 'ASC' | 'DESC';

    const qb = this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.assignedTo', 'assignedTo')
      .leftJoinAndSelect('task.createdBy', 'createdBy')
      .leftJoinAndSelect('task.project', 'project');

    if (query.search || query.title) {
      const searchTerm = `%${query.search || query.title}%`;
      qb.andWhere('task.title ILIKE :search', { search: searchTerm });
    }

    if (query.status) {
      qb.andWhere('task.status = :status', { status: query.status });
    }

    if (query.priority) {
      qb.andWhere('task.priority = :priority', { priority: query.priority });
    }

    if (query.assignedTo) {
      qb.andWhere('task.assignedToId = :assignedTo', { assignedTo: query.assignedTo });
    }

    if (query.projectId) {
      qb.andWhere('task.projectId = :projectId', { projectId: query.projectId });
    }

    qb.orderBy('task.createdAt', orderDirection);
    qb.skip(skip).take(pageSize);

    const [tasks, total] = await qb.getManyAndCount();
    const totalPages = Math.ceil(total / pageSize) || 1;

    const data = tasks.map((task) => ({
      ...task,
      usedTime: TimeFormatter.calculateUsedTime(
        task.status,
        task.initialDateTime,
        task.finishedDateTime
      ),
    }));

    return {
      data,
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  async getTaskById(id: string) {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['assignedTo', 'createdBy', 'project'],
    });

    if (!task) {
      throw new AppError('Tarea no encontrada', 404);
    }

    return {
      ...task,
      usedTime: TimeFormatter.calculateUsedTime(
        task.status,
        task.initialDateTime,
        task.finishedDateTime
      ),
    };
  }

  async updateTask(id: string, dto: UpdateTaskDto) {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['project'],
    });

    if (!task) {
      throw new AppError('Tarea no encontrada', 404);
    }

    if (dto.title !== undefined) task.title = dto.title;
    if (dto.description !== undefined) task.description = dto.description;
    if (dto.priority !== undefined) task.priority = dto.priority;

    if (dto.assignedToId !== undefined) {
      if (dto.assignedToId === null) {
        task.assignedTo = null;
        task.assignedToId = null;
      } else {
        const assignedUser = await this.userRepository.findOne({ where: { id: dto.assignedToId } });
        if (!assignedUser) {
          throw new AppError('Usuario asignado no encontrado', 404);
        }
        task.assignedTo = assignedUser;
        task.assignedToId = assignedUser.id;
      }
    }

    if (dto.status !== undefined && dto.status !== task.status) {
      const allowed = ALLOWED_TASK_TRANSITIONS[task.status];
      if (!allowed.includes(dto.status)) {
        throw new AppError(
          `Transición de estado no permitida: de "${task.status}" a "${dto.status}"`,
          400
        );
      }

      const newStatus = dto.status;
      task.status = newStatus;

      // Handle initialDateTime timestamp rule: set once when entering in_progress
      if (newStatus === TaskStatus.IN_PROGRESS && !task.initialDateTime) {
        task.initialDateTime = new Date();
      }

      // Handle finishedDateTime timestamp rule: set once when entering finished
      if (newStatus === TaskStatus.FINISHED && !task.finishedDateTime) {
        task.finishedDateTime = new Date();
      }
    }

    await this.taskRepository.save(task);

    // Recalculate project status
    if (task.projectId) {
      await ProjectService.recalculateProjectStatus(task.projectId);
    }

    return this.getTaskById(id);
  }

  async deleteTask(id: string) {
    const task = await this.taskRepository.findOne({ where: { id } });

    if (!task) {
      throw new AppError('Tarea no encontrada', 404);
    }

    const projectId = task.projectId;
    await this.taskRepository.remove(task);

    // Recalculate project status after deletion
    if (projectId) {
      await ProjectService.recalculateProjectStatus(projectId);
    }

    return { message: 'Tarea eliminada correctamente' };
  }
}
