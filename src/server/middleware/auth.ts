import { Request as ExpressRequest, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'purplematch-secret-key-change-in-production';

export interface AuthRequest extends ExpressRequest {
  user?: {
    id: number;
    email: string;
    handle: string;
    role: string;
  };
}

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Token de acceso requerido' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number;
      email: string;
      handle: string;
      role: string;
    };
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
}

export function optionalAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number;
      email: string;
      handle: string;
      role: string;
    };
    req.user = decoded;
  } catch (error) {
    // Token inválido pero continuamos sin usuario
  }
  
  next();
}

export function generateToken(user: { id: number; email: string; handle: string; role: string }): string {
  return jwt.sign(
    { id: user.id, email: user.email, handle: user.handle, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export { JWT_SECRET };
