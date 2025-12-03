/**
 * API Route: Refresh Token
 * Version: v1. 0
 * Autor: Franz (@franzmr1)
 * Descripción: Renovar access token usando refresh token
 */

import { NextRequest, NextResponse } from 'next/server';
import { createToken } from '@/lib/auth';
import { verifyRefreshToken } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import { logAudit, getClientIP, getUserAgent } from '@/lib/audit-logger';


export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get('refresh-token')?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'No hay refresh token' },
        { status: 401 }
      );
    }

    // Verificar refresh token
    const userId = await verifyRefreshToken(refreshToken);

    if (!userId) {
      const response = NextResponse.json(
        { error: 'Refresh token inválido o expirado' },
        { status: 401 }
      );
      
      // Limpiar cookies inválidas
      response.cookies.delete('auth-token');
      response. cookies.delete('refresh-token');
      
      return response;
    }

    // Obtener usuario actualizado
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Crear nuevo access token
    const newToken = await createToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // ✅ MEJORA 4: Log de refresh token
    await logAudit({
    action: 'TOKEN_REFRESH',
    userId: user. id,
    details: { email: user.email },
    ipAddress: getClientIP(request.headers),
    userAgent: getUserAgent(request.headers),
    success: true,
    });

    const response = NextResponse.json(
      { success: true, message: 'Token renovado' },
      { status: 200 }
    );

    // Setear nuevo access token
    response.cookies.set('auth-token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60, // 15 minutos
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Refresh token error:', error);
    return NextResponse.json(
      { error: 'Error en el servidor' },
      { status: 500 }
    );
  }
}