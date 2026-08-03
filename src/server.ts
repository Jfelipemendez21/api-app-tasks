import app from './app';
import { AppDataSource } from './config/data-source';
import { env } from './config/env.config';
import { seedAdminUser } from './seeders/admin.seeder';

const startServer = async () => {
  try {
    console.log('Connecting to PostgreSQL database via TypeORM...');
    await AppDataSource.initialize();
    console.log('✅ Database connected successfully.');

    // Apply pending migrations automatically (safe: TypeORM tracks applied ones)
    await AppDataSource.runMigrations();
    console.log('✅ Migrations applied.');

    // Auto seed admin user if not existing
    await seedAdminUser();

    app.listen(env.port, () => {
      console.log(`🚀 Backend Server running on http://localhost:${env.port}`);
      console.log(`📚 Swagger OpenAPI Documentation: http://localhost:${env.port}/api-docs`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
