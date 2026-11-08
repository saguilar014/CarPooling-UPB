import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
  try {
    const { nombreCompleto, correo, password } = req.body;

    // 1. Validar dominio institucional UPB
    if (!correo.endsWith('@upb.edu.co')) {
      res.status(400).json({ error: 'Debe usar un correo institucional @upb.edu.co' });
      return;
    }

    // 2. Verificar existencia previa
    const existingUser = await prisma.user.findUnique({ where: { correo } });
    if (existingUser) {
      res.status(400).json({ error: 'El correo ya se encuentra registrado' });
      return;
    }

    // Validar que la contraseña tenga al menos 8 caracteres (o los que prefieras, ej: 8 o más)
    if (!password || password.length < 8) {
    return res.status(400).json({ 
        error: 'La contraseña debe tener al menos 8 caracteres.' 
    });
    }

    // 3. Encriptar contraseña y guardar en PostgreSQL (Neon)
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        nombreCompleto,
        correo,
        password: hashedPassword,
      },
    });

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: { id: newUser.id, nombreCompleto: newUser.nombreCompleto, correo: newUser.correo },
    });
  } catch (error) {
    res.status(500).json({ error: 'Error interno en el servidor al registrar usuario' });
  }
};