import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/user';


export function hashPassword(password: string): string {
   return bcrypt.hashSync(password, 10);
}

export function comparePassword(password: string, hash: string): boolean {
   return bcrypt.compareSync(password, hash);
}

export function generateToken(user: User): string {
   const JWT_SECRET = process.env.JWT_SECRET || "";
   return jwt.sign(
      { id: user.id, role: user.role }, 
      JWT_SECRET,
      { expiresIn: '1h' }
   );
}

export function verifyToken(token: string): JwtPayload {
   const JWT_SECRET = process.env.JWT_SECRET || "";
   return jwt.verify(token, JWT_SECRET) as JwtPayload;
}