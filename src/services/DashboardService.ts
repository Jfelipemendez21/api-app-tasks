import { AppDataSource } from '../config/data-source';
import { Project } from '../entities/Project';
import { Task, TaskStatus } from '../entities/Task';

export class DashboardService {
  private projectRepository = AppDataSource.getRepository(Project);
  private taskRepository = AppDataSource.getRepository(Task);

  async getDashboardStats() {
    const totalProjects = await this.projectRepository.count();
    const totalTasks = await this.taskRepository.count();

    const tasksCreated = await this.taskRepository.count({
      where: { status: TaskStatus.CREATED },
    });
    const tasksInProgress = await this.taskRepository.count({
      where: { status: TaskStatus.IN_PROGRESS },
    });
    const tasksFinished = await this.taskRepository.count({
      where: { status: TaskStatus.FINISHED },
    });
    const tasksCanceled = await this.taskRepository.count({
      where: { status: TaskStatus.CANCELED },
    });

    return {
      totalProjects,
      totalTasks,
      tasksCreated,
      tasksInProgress,
      tasksFinished,
      tasksCanceled,
    };
  }
}
