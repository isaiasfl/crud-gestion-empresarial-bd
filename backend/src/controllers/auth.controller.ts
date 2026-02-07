import bcrypt from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { generateToken } from "../utils/jwt.utils.js";
import { loginSchema, registerSchema } from "../validators/auth.validator.js";

/**
 * Controlador de autenticación
 * Maneja registro, login y obtención de información del usuario
 */

/**
 * POST /api/auth/register
 * Registra un nuevo usuario
 */
export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    // Validar datos de entrada
    const data = registerSchema.parse(req.body);

    // Verificar si el email ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      res.status(409).json({
        error: "Conflicto",
        message: "El email ya está registrado",
      });
      return;
    }

    // Hashear la contraseña (10 rounds de bcrypt)
    const passwordHash = await bcrypt.hash(data.password, 10);

    // Crear el usuario
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        name: data.name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    // Generar JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    // Responder con el usuario y el token
    res.status(201).json({
      message: "Usuario registrado exitosamente",
      user,
      token,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/auth/login
 * Inicia sesión con email y contraseña
 */
export async function login(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    // Validar datos de entrada
    const data = loginSchema.parse(req.body);

    // Buscar usuario por email
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      res.status(401).json({
        error: "No autorizado",
        message: "Credenciales inválidas",
      });
      return;
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(
      data.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      res.status(401).json({
        error: "No autorizado",
        message: "Credenciales inválidas",
      });
      return;
    }

    // Generar JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    // Responder con el usuario (sin password) y el token
    res.status(200).json({
      message: "Login exitoso",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/auth/me
 * Obtiene la información del usuario autenticado
 * Requiere token JWT válido
 */
export async function getMe(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    // El middleware requireAuth ya verificó el token y adjuntó req.user
    if (!req.user) {
      res.status(401).json({
        error: "No autorizado",
        message: "Token requerido",
      });
      return;
    }

    // Buscar usuario en la base de datos
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      res.status(404).json({
        error: "No encontrado",
        message: "Usuario no encontrado",
      });
      return;
    }

    res.status(200).json({
      user,
    });
  } catch (error) {
    next(error);
  }
}
