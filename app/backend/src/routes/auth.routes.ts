import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { register, loginUser } from '../controllers/auth.controller';

const router = Router();
const prisma = new PrismaClient();

router.post('/register', async (req, res) => {
  try {
    const { nombreCompleto, correo, password } = req.body;

    // 1. Validaciones básicas
    if (!nombreCompleto || !correo || !password) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    // 2. Validar correo UPB
    if (!correo.endsWith('@upb.edu.co')) {
      return res.status(400).json({ error: 'Debes registrarte con un correo @upb.edu.co' });
    }

    // 3. Verificar si el usuario ya existe (usando el campo "correo" del esquema)
    const usuarioExistente = await prisma.user.findUnique({
      where: { correo: correo }
    });

    if (usuarioExistente) {
      return res.status(400).json({ error: 'El correo ya se encuentra registrado.' });
    }

    // 4. Encriptar y guardar en la BD
    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoUsuario = await prisma.user.create({
      data: {
        nombreCompleto,
        correo,
        password: hashedPassword,
      }
    });

    return res.status(201).json({
      message: 'Usuario registrado con éxito',
      user: { id: nuevoUsuario.id, correo: nuevoUsuario.correo }
    });

  } catch (error) {
    console.error('Error en /register:', error);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

router.post('/login', loginUser);

export default router;