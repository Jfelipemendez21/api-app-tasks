import 'reflect-metadata';
import { AppDataSource } from '../config/data-source';
import { User, UserRole } from '../entities/User';
import { PasswordUtil } from '../utils/password.util';

export const seedAdminUser = async () => {
  const userRepository = AppDataSource.getRepository(User);

  const adminEmail = 'admin@test.com';
  const existingAdmin = await userRepository.findOne({ where: { email: adminEmail } });

  if (existingAdmin) {
    console.log('ℹ️ Admin user already exists.');
    return;
  }

  const hashedPassword = await PasswordUtil.hash('Admin123*');

  const adminUser = userRepository.create({
    email: adminEmail,
    password: hashedPassword,
    name: 'Administrador Principal',
    nickname: 'admin',
    role: UserRole.ADMIN,
  });

  await userRepository.save(adminUser);
  console.log('✅ Default Admin User seeded successfully (email: admin@test.com / pass: Admin123*)');
};

if (require.main === module) {
  AppDataSource.initialize()
    .then(async () => {
      console.log('Database connected for seeding...');
      await seedAdminUser();
      await AppDataSource.destroy();
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error during admin seeding:', error);
      process.exit(1);
    });
}
