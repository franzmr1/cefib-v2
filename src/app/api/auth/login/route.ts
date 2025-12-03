/**
 * API Route: Login de Usuario
 * Version: v3. 0 - Con Rate Limiting + Audit Logs
 * Autor: Franz (@franzmr1)
 * Descripción: Login seguro con protección anti fuerza bruta y auditoría
 */

import { NextRequest, NextResponse } from 'next/server';
import { authenticate, createToken } from '@/lib/auth';
import { createRefreshToken } from '@/lib/auth-helpers';
import { loginSchema } from '@/lib/validators/auth';
import {
  checkIPRateLimit,
  checkEmailRateLimit,
  resetRateLimit,
} from '@/lib/rate-limit';
import { logAudit, getClientIP, getUserAgent } from '@/lib/audit-logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar datos de entrada
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      const firstError = validation.error.issues[0];
      return NextResponse.json({ error: firstError.message }, { status: 400 });
    }

    const { email, password } = validation. data;

    // ✅ Obtener IP y User Agent UNA SOLA VEZ
    const ip = getClientIP(request. headers);
    const userAgent = getUserAgent(request. headers);

    // ✅ MEJORA 2: Rate Limiting por IP
    const ipLimit = checkIPRateLimit(ip);
    if (! ipLimit.success) {
      return NextResponse.json(
        {
          error: `Demasiados intentos desde esta IP. Intenta en ${ipLimit.retryAfter} segundos.`,
          retryAfter: ipLimit. retryAfter,
        },
        { status: 429 }
      );
    }

    // ✅ MEJORA 2: Rate Limiting por Email
    const emailLimit = checkEmailRateLimit(email);
    if (!emailLimit.success) {
      return NextResponse.json(
        {
          error: `Demasiados intentos para este usuario. Intenta en ${emailLimit.retryAfter} segundos.`,
          retryAfter: emailLimit.retryAfter,
        },
        { status: 429 }
      );
    }

    // Autenticar usuario
    const user = await authenticate(email, password);

    if (!user) {
      // ✅ MEJORA 4: Log de login fallido
      await logAudit({
        action: 'LOGIN_FAILED',
        details: { email, reason: 'Invalid credentials' },
        ipAddress: ip,
        userAgent,
        success: false,
        errorMessage: 'Credenciales inválidas',
      });

      return NextResponse. json(
        {
          error: 'Credenciales inválidas',
          remainingAttempts: Math.min(
            ipLimit.remainingAttempts,
            emailLimit.remainingAttempts
          ),
        },
        { status: 401 }
      );
    }

    // ✅ Login exitoso: Resetear contadores
    resetRateLimit(ip, email);

    // ✅ MEJORA 4: Log de login exitoso
    await logAudit({
      action: 'LOGIN_SUCCESS',
      userId: user.userId,
      details: { email, role: user.role },
      ipAddress: ip,
      userAgent,
      success: true,
    });

    // ✅ MEJORA 3: Generar Access Token (15 minutos)
    const token = await createToken(user);

    // ✅ MEJORA 3 + 5: Generar Refresh Token con CSRF Token
    const tokens = await createRefreshToken(user.userId);

    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: user.userId,
          email: user.email,
          role: user.role,
        },
        // ✅ MEJORA 5: Devolver CSRF token al cliente
        csrfToken: tokens.csrfToken,
      },
      { status: 200 }
    );

    // ✅ Access Token (15 minutos)
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60,
      path: '/',
    });

    // ✅ Refresh Token (7 días)
    response.cookies.set('refresh-token', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);

    // ✅ Log de error del servidor
    await logAudit({
      action: 'LOGIN_FAILED',
      details: { error: error instanceof Error ? error.message : 'Unknown error' },
      ipAddress: getClientIP(request.headers),
      userAgent: getUserAgent(request.headers),
      success: false,
      errorMessage: 'Error interno del servidor',
    });

    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
  }
}