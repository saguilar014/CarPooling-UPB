import express, { Response } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middlewares/auth.middleware';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// Endpoint para obtener los datos del perfil y estadísticas del usuario
router.get('/profile', requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || req.user?.userId; 

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
    res.json({ user: dbUser });
  } catch (error) {
    console.error('Error al consultar GET /users/me', error);
    res.status(500).json({ error: 'Error interno del servidor al consultar el perfil.' });
  }
});

// Endpoint previo de retrocompatibilidad (profile)
router.get('/profile', requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || req.user?.userId;
    if (!userId) {
      res.status(400).json({ error: 'Token no contiene un ID de usuario válido.' });
      return;
    }
    const rows: any = await prisma.$queryRaw`
      SELECT * FROM "User" WHERE id = ${userId}
    `;
    const dbUser = rows[0];
    if (!dbUser) {
      res.status(404).json({ error: 'Usuario no encontrado.' });
      return;
    }
    const { password, ...user } = dbUser;
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

router.patch('/me/roles', requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || req.user?.userId;

    if (!userId) {
      res.status(400).json({ error: 'Token no contiene un ID de usuario válido.' });
      return;
    }

    const { roles, telefono, programa, semestre } = req.body;

    // Validación estricta de roles permitidos (conductor, pasajero, ambos)
    const validRoles = ['conductor', 'pasajero', 'ambos'];
    if (!roles || !validRoles.includes(roles.toLowerCase().trim())) {
      res.status(400).json({ 
        error: 'El rol es obligatorio y debe ser únicamente: conductor, pasajero o ambos.' 
      });
      return;
    }

    // Actualizamos en la base de datos de Neon usando Prisma
    const updatedRows: any = await prisma.$queryRaw`
      UPDATE "User"
      SET 
        roles = COALESCE(${roles}, roles),
        telefono = COALESCE(${telefono}, telefono),
        programa = COALESCE(${programa}, programa),
        semestre = COALESCE(${semestre}, semestre),
        "updatedAt" = NOW()
      WHERE id = ${userId}
      RETURNING id, "nombreCompleto", correo, roles, telefono, programa, semestre, viajes_realizados, km_compartidos, calificacion;
    `;

    const updatedUser = updatedRows[0];

    if (!updatedUser) {
      res.status(404).json({ error: 'Usuario no encontrado para actualizar.' });
      return;
    }

    console.log("✅ Perfil y roles actualizados exitosamente:", updatedUser);
    res.json({ 
      message: 'Roles e información actualizados correctamente', 
      user: updatedUser 
    });

  } catch (error) {
    console.error('Error al actualizar roles PATCH /users/me/roles:', error);
    res.status(500).json({ error: 'Error interno del servidor al actualizar los roles.' });
  }
});

export default router;