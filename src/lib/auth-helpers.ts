/**
 * Auth Helpers - Funciones auxiliares que usan Node.js crypto
 * Version: v1.0
 * Autor: Franz (@franzmr1)
 * Descripción: Funciones que NO pueden usarse en Edge Runtime
 */

import { randomBytes } from 'crypto';
import { prisma } from './prisma';

/**
 * Crear Refresh Token en base de datos
 * ⚠️ Solo usar en API Routes (NO en middleware)
 */
export async function createRefreshToken(userId: string): Promise<{
  refreshToken: string;
  csrfToken: string;
}> {
  const refreshToken = randomBytes(32).toString('hex');
  const csrfToken = randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // ✅ 1 hora (3600 segundos)

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId,
      expiresAt,
      csrfToken, // Por ahora sin hash, lo haremos después
    },
  });

  return {
    refreshToken,
    csrfToken,
  };
}

/**
 * Verificar Refresh Token
 * ⚠️ Solo usar en API Routes (NO en middleware)
 */
export async function verifyRefreshToken(token: string): Promise<string | null> {
  try {
    const refreshToken = await prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (! refreshToken) {
      return null;
    }

    // Verificar si expiró
    if (refreshToken.expiresAt < new Date()) {
      await prisma. refreshToken.delete({ where: { id: refreshToken.id } });
      return null;
    }

    return refreshToken.userId;
  } catch (error) {
    console.error('Error verifying refresh token:', error);
    return null;
  }
}

/**
 * Eliminar Refresh Token (logout)
 */
export async function revokeRefreshToken(token: string): Promise<void> {
  try {
    await prisma.refreshToken.deleteMany({
      where: { token },
    });
  } catch (error) {
    console. error('Error revoking refresh token:', error);
  }
}

/**
 * Limpiar tokens expirados
 */
export async function cleanExpiredTokens(): Promise<number> {
  try {
    const result = await prisma.refreshToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    return result.count;
  } catch (error) {
    console.error('Error cleaning expired tokens:', error);
    return 0;
  }
}