import type { SignOptions } from 'jsonwebtoken';

export const jwtConfig = {
  secret: process.env.JWT_SECRET ?? 'dev_secret',
  expiresIn: '8h' as SignOptions['expiresIn']
};
