import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { env } from './env.config';
import { User } from '../entities/User';
import { Project } from '../entities/Project';
import { Task } from '../entities/Task';
import path from 'path';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.db.host,
  port: env.db.port,
  username: env.db.username,
  password: env.db.password,
  database: env.db.database,
  ssl: {
    rejectUnauthorized: false,
  },
  synchronize: false, // MANDATORY: synchronize=false
  logging: env.nodeEnv === 'development' ? ['error', 'warn'] : false,
  entities: [User, Project, Task],
  migrations: [path.join(__dirname, '../migrations/*.{ts,js}')],
  subscribers: [],
});
