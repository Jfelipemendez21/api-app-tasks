import { AppDataSource } from '../config/data-source';
import { User } from '../entities/User';
import { PasswordUtil } from '../utils/password.util';
import { JwtUtil } from '../utils/jwt.util';
import { AppError } from '../utils/appError';
import { LoginDto } from '../validations/auth.validation';

export class AuthService {
  private userRepository = AppDataSource.getRepository(User);

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
      select: ['id', 'email', 'password', 'name', 'nickname', 'role', 'createdAt'],
    });

    if (!user) {
      throw new AppError('Credenciales inválidas (email o contraseña incorrectos)', 401);
    }

    const isPasswordValid = await PasswordUtil.compare(loginDto.password, user.password);

    if (!isPasswordValid) {
      throw new AppError('Credenciales inválidas (email o contraseña incorrectos)', 401);
    }

    const token = JwtUtil.generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  }
}
