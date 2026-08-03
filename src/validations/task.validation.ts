import { z } from 'zod';
import { TaskPriority, TaskStatus } from '../entities/Task';

export const createTaskSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  description: z.string().optional(),
  priority: z.nativeEnum(TaskPriority, { errorMap: () => ({ message: 'Prioridad inválida' }) }).optional(),
  projectId: z.string().uuid('ID de proyecto inválido'),
  assignedToId: z.string().uuid('ID de usuario asignado inválido').nullable().optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres').optional(),
  description: z.string().optional(),
  priority: z.nativeEnum(TaskPriority, { errorMap: () => ({ message: 'Prioridad inválida' }) }).optional(),
  status: z.nativeEnum(TaskStatus, { errorMap: () => ({ message: 'Estado inválido' }) }).optional(),
  assignedToId: z.string().uuid('ID de usuario asignado inválido').nullable().optional(),
});

export type CreateTaskDto = z.infer<typeof createTaskSchema>;
export type UpdateTaskDto = z.infer<typeof updateTaskSchema>;
