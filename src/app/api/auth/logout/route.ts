/**
 * API Route: Logout
 * Version: v2.0 - Con revocación de refresh tokens
 * Autor: Franz (@franzmr1)
 */

import { NextRequest, NextResponse } from 'next/server';
import { revokeRefreshToken } from '@/lib/auth-helpers';
import { logAudit, getClientIP, getUserAgent } from '@/lib/audit-logger';
import { getUserFromToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    const refreshToken = request.cookies.get('refresh-token')?.value;
    
    let userId: string | undefined;

    // Intentar obtener userId del token antes de eliminarlo
    if (token) {
      const user = await getUserFromToken(token);
      userId = user?.id;
    }

    // Revocar refresh token de la base de datos
    if (refreshToken) {
      await revokeRefreshToken(refreshToken);
    }

    // ✅ MEJORA 4: Log de logout
    await logAudit({
      action: 'LOGOUT',
      userId: userId || null,
      ipAddress: getClientIP(request. headers),
      userAgent: getUserAgent(request.headers),
      success: true,
    });

    const response = NextResponse.json(
      { success: true, message: 'Sesión cerrada' },
      { status: 200 }
    );

    // Eliminar ambas cookies
    response.cookies. delete('auth-token');
    response.cookies.delete('refresh-token');

    return response;
  } catch (error) {
    console.error('Logout error:', error);

    // ✅ Log de error en logout
    await logAudit({
      action: 'LOGOUT',
      ipAddress: getClientIP(request. headers),
      userAgent: getUserAgent(request.headers),
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
    });

    const response = NextResponse.json(
      { error: 'Error al cerrar sesión' },
      { status: 500 }
    );

    response.cookies.delete('auth-token');
    response.cookies.delete('refresh-token');

    return response;
  }
}