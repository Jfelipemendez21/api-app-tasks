import { describe, it, expect } from 'vitest';
import { ALLOWED_TASK_TRANSITIONS, isAllowedTransition } from './taskTransitions';
import { TaskStatus } from '../enums';

describe('ALLOWED_TASK_TRANSITIONS', () => {
  it('allows created -> in_progress', () => {
    expect(isAllowedTransition(TaskStatus.CREATED, TaskStatus.IN_PROGRESS)).toBe(true);
  });

  it('blocks created -> finished (must pass through in_progress)', () => {
    expect(isAllowedTransition(TaskStatus.CREATED, TaskStatus.FINISHED)).toBe(false);
  });

  it('blocks reverting from in_progress to created', () => {
    expect(isAllowedTransition(TaskStatus.IN_PROGRESS, TaskStatus.CREATED)).toBe(false);
  });

  it('allows in_progress -> finished and in_progress -> canceled', () => {
    expect(isAllowedTransition(TaskStatus.IN_PROGRESS, TaskStatus.FINISHED)).toBe(true);
    expect(isAllowedTransition(TaskStatus.IN_PROGRESS, TaskStatus.CANCELED)).toBe(true);
  });

  it('treats finished and canceled as terminal states', () => {
    expect(ALLOWED_TASK_TRANSITIONS[TaskStatus.FINISHED]).toEqual([TaskStatus.FINISHED]);
    expect(ALLOWED_TASK_TRANSITIONS[TaskStatus.CANCELED]).toEqual([TaskStatus.CANCELED]);
    expect(isAllowedTransition(TaskStatus.FINISHED, TaskStatus.IN_PROGRESS)).toBe(false);
    expect(isAllowedTransition(TaskStatus.CANCELED, TaskStatus.CREATED)).toBe(false);
  });

  it('allows every status to stay in the same status', () => {
    (Object.keys(ALLOWED_TASK_TRANSITIONS) as TaskStatus[]).forEach((status) => {
      expect(isAllowedTransition(status, status)).toBe(true);
    });
  });
});
