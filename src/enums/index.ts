// Pure domain enums, kept free of TypeORM/entity dependencies so that
// utility modules and unit tests can import them without side effects.
export enum UserRole {
  ADMIN = 'admin',
  REGULAR = 'regular',
}

export enum ProjectStatus {
  CREATED = 'created',
  IN_PROGRESS = 'in_progress',
  FINISHED = 'finished',
  CANCELED = 'canceled',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum TaskStatus {
  CREATED = 'created',
  IN_PROGRESS = 'in_progress',
  FINISHED = 'finished',
  CANCELED = 'canceled',
}
