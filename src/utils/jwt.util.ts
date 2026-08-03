import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { env } from '../config/env.config';
import { UserRole } from '../entities/User';

export interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

export class JwtUtil {
  static generateToken(payload: JwtPayload): string {
    const options: SignOptions = {
      expiresIn: env.jwt.expiresIn as any,
    };
    return jwt.sign(payload, env.jwt.secret as Secret, options);
  }

  static verifyToken(token: string): JwtPayload {
    return jwt.verify(token, env.jwt.secret as Secret) as JwtPayload;
  }
}
