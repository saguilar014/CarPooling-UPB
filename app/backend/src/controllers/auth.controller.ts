import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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

export const loginUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({ error: 'Por favor ingresa correo y contraseña.' });
    }

    const user = await prisma.user.findUnique({
      where: { correo }
    });

    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas. Revisa tu correo o contraseña.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Credenciales inválidas. Revisa tu correo o contraseña.' });
    }

    // 1. Crear el token JWT (Expira en 24h)
    const secretKey = process.env.JWT_SECRET || 'secreto_super_seguro_upb';
    const token = jwt.sign(
      { id: user.id, correo: user.correo },
      secretKey,
      { expiresIn: '24h' }
    );

    // 2. Responder con el token y los datos del usuario
    return res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token, // <--- Enviamos el token al frontend
      user: {
        id: user.id,
        nombreCompleto: user.nombreCompleto,
        correo: user.correo
      }
    });

  } catch (error: any) {
    return res.status(500).json({ error: 'Error interno del servidor en el login.' });
  }
};