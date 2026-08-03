import { AppDataSource } from '../config/data-source';
import { User, UserRole } from '../entities/User';
import { PasswordUtil } from '../utils/password.util';
import { AppError } from '../utils/appError';
import { CreateUserDto, UpdateUserDto } from '../validations/user.validation';
import { PaginationQueryDto } from '../validations/common.validation';

export class UserService {
  private userRepository = AppDataSource.getRepository(User);

  async createUser(dto: CreateUserDto) {
    const existing = await this.userRepository.findOne({ where: { email: dto.email } });
    if (existing) {
      throw new AppError('El correo electrónico ya está registrado', 400);
    }

    const hashedPassword = await PasswordUtil.hash(dto.password);

    const user = this.userRepository.create({
      ...dto,
      password: hashedPassword,
    });

    const saved = await this.userRepository.save(user);
    const { password: _, ...result } = saved;
    return result;
  }

  async getUsers(query: PaginationQueryDto) {
    const page = Math.max(1, query.page || 1);
    const pageSize = Math.max(1, Math.min(100, query.pageSize || 10));
    const skip = (page - 1) * pageSize;
    const orderDirection = (query.order || 'DESC').toUpperCase() as 'ASC' | 'DESC';

    const qb = this.userRepository.createQueryBuilder('user');

    if (query.search || query.title) {
      const searchTerm = `%${query.search || query.title}%`;
      qb.andWhere(
        '(user.name ILIKE :search OR user.nickname ILIKE :search OR user.email ILIKE :search)',
        { search: searchTerm }
      );
    }

    if (query.role && Object.values(UserRole).includes(query.role as UserRole)) {
      qb.andWhere('user.role = :role', { role: query.role });
    }

    qb.orderBy('user.createdAt', orderDirection);
    qb.skip(skip).take(pageSize);

    const [users, total] = await qb.getManyAndCount();
    const totalPages = Math.ceil(total / pageSize) || 1;

    return {
      data: users,
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  async getUserById(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new AppError('Usuario no encontrado', 404);
    }
    return user;
  }

  async updateUser(id: string, dto: UpdateUserDto) {
    const user = await this.getUserById(id);

    if (dto.email && dto.email !== user.email) {
      const existing = await this.userRepository.findOne({ where: { email: dto.email } });
      if (existing) {
        throw new AppError('El correo electrónico ya está en uso por otro usuario', 400);
      }
      user.email = dto.email;
    }

    if (dto.name) user.name = dto.name;
    if (dto.nickname) user.nickname = dto.nickname;
    if (dto.role) user.role = dto.role;

    if (dto.password) {
      user.password = await PasswordUtil.hash(dto.password);
    }

    const updated = await this.userRepository.save(user);
    const { password: _, ...result } = updated;
    return result;
  }

  async deleteUser(id: string) {
    const user = await this.getUserById(id);
    await this.userRepository.remove(user);
    return { message: 'Usuario eliminado correctamente' };
  }
}
