import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extender la interfaz Request de Express para guardar los datos del usuario autenticado
export interface AuthenticatedRequest extends Request {
  user?: any;
}

export const requireAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // 1. Obtener el token del header Authorization
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Acceso denegado. Petición sin sesión válida o token faltante.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // 2. Verificar que el token sea válido y no haya expirado
    const secretKey = process.env.JWT_SECRET || 'secreto_super_seguro_upb';
    const decoded = jwt.verify(token, secretKey);
    
    // Adjuntar los datos decoded a la petición para los siguientes controladores
    req.user = decoded;
    
    // Dar paso a la ruta protegida
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Sesión no válida o expirada. Por favor vuelve a iniciar sesión.' });
  }
};