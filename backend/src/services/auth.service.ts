import bcrypt from 'bcryptjs';
import jwt, { type Secret } from 'jsonwebtoken';
import { User } from '../models/index.js';
import { jwtConfig } from '../config/jwt.js';

export async function login(username: string, password: string) {
  const user = await User.findOne({ where: { username } });
  if (!user) throw Object.assign(new Error('用户名或密码错误'), { status: 401 });
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw Object.assign(new Error('用户名或密码错误'), { status: 401 });
  const payload = { id: user.id, username: user.username, role: user.role, employeeId: user.employeeId, storeId: user.storeId };
  const token = jwt.sign(payload, jwtConfig.secret as Secret, { expiresIn: jwtConfig.expiresIn });
  return { token, user: payload };
}
