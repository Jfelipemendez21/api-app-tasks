import { TaskStatus } from '../enums';

export class TimeFormatter {
  static calculateUsedTime(
    status: TaskStatus,
    initialDateTime: Date | string | null,
    finishedDateTime: Date | string | null
  ): string | null {
    if (status !== TaskStatus.FINISHED) {
      return null;
    }

    if (!initialDateTime || !finishedDateTime) {
      return null;
    }

    const start = new Date(initialDateTime).getTime();
    const end = new Date(finishedDateTime).getTime();

    if (isNaN(start) || isNaN(end) || end < start) {
      return '0 minutos';
    }

    const totalMinutes = Math.floor((end - start) / (1000 * 60));

    if (totalMinutes < 1) {
      return 'menos de 1 minuto';
    }

    const days = Math.floor(totalMinutes / (60 * 24));
    const remainingMinutes = totalMinutes % (60 * 24);
    const hours = Math.floor(remainingMinutes / 60);
    const minutes = remainingMinutes % 60;

    const parts: string[] = [];

    if (days > 0) {
      parts.push(days === 1 ? '1 día' : `${days} días`);
    }

    if (hours > 0) {
      parts.push(hours === 1 ? '1 hora' : `${hours} horas`);
    }

    if (minutes > 0) {
      parts.push(minutes === 1 ? '1 minuto' : `${minutes} minutos`);
    }

    return parts.length > 0 ? parts.join(' ') : '0 minutos';
  }
}
