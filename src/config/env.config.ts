import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const nodeEnv = process.env.NODE_ENV || 'development';

if (nodeEnv === 'production' && !process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is required in production environment.');
}

export const env = {
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv,
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'task_management_db',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'super_secret_jwt_key_senior_fullstack_2026',
    expiresIn: process.env.JWT_EXPIRES_IN || '8h',
  },
  corsOrigin: '*',
};
