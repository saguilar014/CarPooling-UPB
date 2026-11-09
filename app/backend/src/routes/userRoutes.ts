import express, { Response } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middlewares/auth.middleware';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// Endpoint para obtener los datos del perfil y estadísticas del usuario
router.get('/profile', requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || req.user?.userId; 
    console.log("🔍 Buscando perfil para el usuario con ID:", userId);

    if (!userId) {
      res.status(400).json({ error: 'Token no contiene un ID de usuario válido.' });
      return;
    }

    const rows: any = await prisma.$queryRaw`
      SELECT * FROM "User" 
      WHERE id = ${userId}
    `;

    const dbUser = rows[0];

    if (!dbUser) {
      res.status(404).json({ error: 'Usuario no encontrado.' });
      return;
    }

    // Excluimos la contraseña por seguridad antes de enviarlo al frontend
    const { password, ...user } = dbUser;

    console.log("📤 Objeto limpio enviado al frontend:", user);
    res.json({ user });
  } catch (error) {
    console.error('Error al obtener perfil desde Neon con queryRaw:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

export default router;