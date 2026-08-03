import { describe, it, expect } from 'vitest';
import { TimeFormatter } from './timeFormatter';
import { TaskStatus } from '../enums';

describe('TimeFormatter.calculateUsedTime', () => {
  it('returns null when the task is not finished', () => {
    expect(
      TimeFormatter.calculateUsedTime(
        TaskStatus.IN_PROGRESS,
        new Date('2026-01-01T10:00:00Z'),
        null
      )
    ).toBeNull();
  });

  it('returns null when timestamps are missing', () => {
    expect(TimeFormatter.calculateUsedTime(TaskStatus.FINISHED, null, null)).toBeNull();
  });

  it('returns "0 minutos" when end is before start', () => {
    const start = new Date('2026-01-01T12:00:00Z');
    const end = new Date('2026-01-01T10:00:00Z');
    expect(TimeFormatter.calculateUsedTime(TaskStatus.FINISHED, start, end)).toBe('0 minutos');
  });

  it('formats 2 hours 30 minutes', () => {
    const start = new Date('2026-01-01T10:00:00Z');
    const end = new Date('2026-01-01T12:30:00Z');
    expect(TimeFormatter.calculateUsedTime(TaskStatus.FINISHED, start, end)).toBe(
      '2 horas 30 minutos'
    );
  });

  it('formats 1 day 1 hour 1 minute', () => {
    const start = new Date('2026-01-01T10:00:00Z');
    const end = new Date('2026-01-02T11:01:00Z');
    expect(TimeFormatter.calculateUsedTime(TaskStatus.FINISHED, start, end)).toBe(
      '1 día 1 hora 1 minuto'
    );
  });

  it('returns "menos de 1 minuto" for sub-minute durations', () => {
    const start = new Date('2026-01-01T10:00:00Z');
    const end = new Date('2026-01-01T10:00:30Z');
    expect(TimeFormatter.calculateUsedTime(TaskStatus.FINISHED, start, end)).toBe(
      'menos de 1 minuto'
    );
  });
});
