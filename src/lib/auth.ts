import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';
import { randomBytes } from 'crypto';
import { generateCSRFToken, hashToken } from './csrf';

const getSecretKey = () => {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    throw new Error(
      '❌ ERROR CRÍTICO: JWT_SECRET no está configurado en .env\n' +
      'Genera uno con: openssl rand -base64 32'
    );
  }

  if (secret.length < 32) {
    throw new Error(
      '❌ ERROR: JWT_SECRET debe tener al menos 32 caracteres\n' +
      `Actual: ${secret.length} caracteres`
    );
  }

  return new TextEncoder().encode(secret);
};

const secret = getSecretKey();

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

/**
 * Hash de password
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

/**
 * Verificar password
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * Crear JWT token
 */
export async function createToken(payload:  TokenPayload): Promise<string> {
  return new SignJWT(payload as any)
    .setProtectedHeader({ alg:  'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')  // ✅ 1 hora
    .sign(secret);
}

/**
 * Verificar y decodificar JWT token
 */
export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as TokenPayload;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

/**
 * Autenticar usuario
 */
export async function authenticate(
  email: string,
  password: string
): Promise<TokenPayload | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
      },
    });

    if (!user?.password) {
      return null;
    }

    const isValid = await verifyPassword(password, user.password);

    if (!isValid) {
      return null;
    }

    return {
      userId: user.id,
      email: user.email,
      role: user.role,
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

/**
 * Obtener usuario desde token
 */
export async function getUserFromToken(token: string) {
  const payload = await verifyToken(token);
  
  if (!payload) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      image: true,
    },
  });

  return user;
}


