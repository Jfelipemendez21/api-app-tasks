import { z } from 'zod';
import { UserRole } from '../entities/User';

export const createUserSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  nickname: z.string().min(2, 'El nickname debe tener al menos 2 caracteres'),
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  role: z.nativeEnum(UserRole, { errorMap: () => ({ message: 'Rol inválido' }) }),
});

export const updateUserSchema = z.object({
  email: z.string().email('Email inválido').optional(),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').optional(),
  nickname: z.string().min(2, 'El nickname debe tener al menos 2 caracteres').optional(),
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').optional(),
  role: z.nativeEnum(UserRole, { errorMap: () => ({ message: 'Rol inválido' }) }).optional(),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
