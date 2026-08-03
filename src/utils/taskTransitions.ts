import { TaskStatus } from '../enums';

// Allowed status transitions. 'finished' and 'canceled' are terminal states,
// and a task must pass through 'in_progress' before reaching 'finished'
// (so initialDateTime is always set before finishedDateTime).
export const ALLOWED_TASK_TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
  [TaskStatus.CREATED]: [TaskStatus.CREATED, TaskStatus.IN_PROGRESS, TaskStatus.CANCELED],
  [TaskStatus.IN_PROGRESS]: [TaskStatus.IN_PROGRESS, TaskStatus.FINISHED, TaskStatus.CANCELED],
  [TaskStatus.FINISHED]: [TaskStatus.FINISHED],
  [TaskStatus.CANCELED]: [TaskStatus.CANCELED],
};

export const isAllowedTransition = (from: TaskStatus, to: TaskStatus): boolean => {
  return ALLOWED_TASK_TRANSITIONS[from].includes(to);
};
