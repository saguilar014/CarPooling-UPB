import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// POST /auth/register (HU-01 / SCRUM-10)
router.post('/register', async (req: Request, res: Response) => {
  const { nombreCompleto, correo, rol, password, confirmPassword } = req.body;

  // 1. Validar campos obligatorios
  if (!nombreCompleto || !correo || !rol || !password || !confirmPassword) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  // 2. Validar coincidencia de contraseñas
  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Las contraseñas no coinciden' });
  }

  // 3. Validar dominio del correo institucional UPB
  if (!correo.endsWith('@upb.edu.co')) {
    return res.status(400).json({ 
      error: 'Dominio no permitido. Debe utilizar su correo institucional (@upb.edu.co).' 
    });
  }

  try {
    // 4. Evitar correos duplicados
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { correo }
    });

    if (usuarioExistente) {
      return res.status(400).json({ error: 'El correo ya se encuentra registrado' });
    }

    // 5. Hash seguro de contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // 6. Crear el registro del usuario
    const nuevoUsuario = await prisma.usuario.create({
      data: {
        nombreCompleto,
        correo,
        rol,
        password: hashedPassword
      }
    });

    return res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      usuario: {
        id: nuevoUsuario.id,
        nombreCompleto: nuevoUsuario.nombreCompleto,
        correo: nuevoUsuario.correo,
        rol: nuevoUsuario.rol
      }
    });

  } catch (error) {
    return res.status(500).json({ error: 'Error al registrar el usuario' });
  }
});

export default router;
