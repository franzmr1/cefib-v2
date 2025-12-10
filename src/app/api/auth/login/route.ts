/**
 * API Route:  Login de Usuario
 * Version: v4.0 - Seguridad Multicapa Completa
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-12-07
 * Descripción: Login ultra seguro con: 
 * - Rate limiting progresivo
 * - Bloqueo permanente de IPs sospechosas
 * - Google reCAPTCHA v3
 * - Honeypot para detectar bots
 * - Audit logs completos
 * - Prevención de timing attacks
 */

import { NextRequest, NextResponse } from 'next/server';
import { authenticate, createToken } from '@/lib/auth';
import { createRefreshToken } from '@/lib/auth-helpers';
import { loginSchema } from '@/lib/validators/auth';
import {
  checkIPRateLimitExtended,      // ✅ CAMBIADO: Versión extendida
  checkEmailRateLimitExtended,    // ✅ CAMBIADO:  Versión extendida
  resetRateLimit,
  getClientIP,                    // ✅ MOVIDO desde rate-limit
} from '@/lib/rate-limit';
import { logAudit, getUserAgent } from '@/lib/audit-logger';

/**
 * ✅ Delay para prevenir timing attacks
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const body = await request.json();

    // ✅ NUEVO: Honeypot - Detectar bots automáticos
    if (body.website || body.phone_number || body.company) {
      // Campo trampa activado = probablemente es un bot
      await delay(Math.random() * 2000 + 1000); // Delay aleatorio 1-3 segundos
      
      await logAudit({
        action: 'BOT_DETECTED',
        details: { fields: Object.keys(body) },
        ipAddress: getClientIP(request.headers),
        userAgent: getUserAgent(request.headers),
        success: false,
        errorMessage: 'Honeypot field filled',
      });

      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      );
    }

    // Validar datos de entrada
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      const firstError = validation.error.issues[0];
      return NextResponse.json(
        { error: firstError.message },
        { status: 400 }
      );
    }

    const { email, password, captchaToken } = validation.data;

    // Obtener IP y User Agent
    const ip = getClientIP(request.headers);
    const userAgent = getUserAgent(request. headers);

    // ✅ MEJORADO: Rate Limiting por IP con bloqueo permanente
    const ipLimit = checkIPRateLimitExtended(ip);
    
    // Verificar si IP está bloqueada permanentemente
    if (ipLimit. isPermanentlyBlocked) {
      await logAudit({
        action: 'LOGIN_BLOCKED_PERMANENT',
        details: { email, reason: 'IP bloqueada permanentemente' },
        ipAddress: ip,
        userAgent,
        success: false,
        errorMessage: 'IP en blacklist permanente',
      });

      return NextResponse.json(
        {
          error: 'Tu IP ha sido bloqueada permanentemente por actividad sospechosa. Contacta a soporte.',
          isPermanentlyBlocked: true,
          supportEmail: 'informes@cefib.pe',
        },
        { status: 403 }
      );
    }

    // Verificar rate limit por IP
    if (! ipLimit.success) {
      await logAudit({
        action: 'RATE_LIMIT_EXCEEDED_IP',
        details: { email, retryAfter: ipLimit.retryAfter },
        ipAddress: ip,
        userAgent,
        success: false,
        errorMessage: 'Demasiados intentos desde esta IP',
      });

      return NextResponse.json(
        {
          error: `Demasiados intentos desde esta IP. Intenta en ${ipLimit.retryAfter} segundos.`,
          retryAfter: ipLimit.retryAfter,
          requiresCaptcha: ipLimit.requiresCaptcha,
        },
        { status: 429 }
      );
    }

    // ✅ MEJORADO: Rate Limiting por Email
    const emailLimit = checkEmailRateLimitExtended(email);
    
    if (!emailLimit.success) {
      await logAudit({
        action: 'RATE_LIMIT_EXCEEDED_EMAIL',
        details: { email, retryAfter: emailLimit.retryAfter },
        ipAddress: ip,
        userAgent,
        success: false,
        errorMessage: 'Demasiados intentos para este usuario',
      });

      return NextResponse.json(
        {
          error: `Demasiados intentos para este usuario.  Intenta en ${emailLimit. retryAfter} segundos. `,
          retryAfter: emailLimit.retryAfter,
          requiresCaptcha: emailLimit.requiresCaptcha,
        },
        { status: 429 }
      );
    }

    // ✅ NUEVO: Validar CAPTCHA si es requerido
    if (ipLimit.requiresCaptcha || emailLimit.requiresCaptcha) {
      if (!captchaToken) {
        await logAudit({
          action: 'CAPTCHA_REQUIRED',
          details:  { email },
          ipAddress: ip,
          userAgent,
          success:  false,
          errorMessage: 'Token CAPTCHA no proporcionado',
        });

        return NextResponse.json(
          {
            error: 'Verificación de seguridad requerida. Por favor completa el CAPTCHA.',
            requiresCaptcha: true,
          },
          { status: 400 }
        );
      }

      // Validar CAPTCHA con Google reCAPTCHA v3
      const captchaValid = await validateCaptcha(captchaToken);
      
      if (!captchaValid) {
        await logAudit({
          action: 'CAPTCHA_FAILED',
          details: { email },
          ipAddress: ip,
          userAgent,
          success:  false,
          errorMessage: 'Validación CAPTCHA fallida',
        });

        return NextResponse. json(
          {
            error: 'Verificación de seguridad falló.  Intenta nuevamente.',
            requiresCaptcha: true,
          },
          { status: 400 }
        );
      }
    }

    // ✅ MEJORADO:  Autenticación con delay para prevenir timing attacks
    const authPromise = authenticate(email, password);
    const minDelay = delay(500); // Mínimo 500ms
    
    const [user] = await Promise.all([authPromise, minDelay]);

    if (!user) {
      // Login fallido
      await logAudit({
        action: 'LOGIN_FAILED',
        details: { 
          email, 
          reason: 'Invalid credentials',
          remainingAttempts: Math.min(
            ipLimit.remainingAttempts,
            emailLimit.remainingAttempts
          ),
        },
        ipAddress:  ip,
        userAgent,
        success: false,
        errorMessage: 'Credenciales inválidas',
      });

      // Normalizar tiempo de respuesta (mínimo 1 segundo total)
      const elapsed = Date.now() - startTime;
      if (elapsed < 1000) {
        await delay(1000 - elapsed);
      }

      return NextResponse.json(
        {
          error: 'Credenciales inválidas',
          remainingAttempts: Math.min(
            ipLimit. remainingAttempts,
            emailLimit.remainingAttempts
          ),
          requiresCaptcha: ipLimit.requiresCaptcha || emailLimit.requiresCaptcha,
        },
        { status:  401 }
      );
    }

    // ✅ Login exitoso: Resetear contadores
    resetRateLimit(ip, email);

    // Log de login exitoso
    await logAudit({
      action:  'LOGIN_SUCCESS',
      userId: user.userId,
      details: { email, role: user.role },
      ipAddress: ip,
      userAgent,
      success: true,
    });

    // Generar Access Token (1 hora)
    const token = await createToken(user);

    // Generar Refresh Token con CSRF Token (1 hora)
    const tokens = await createRefreshToken(user.userId);

    const response = NextResponse. json(
      {
        success: true,
        user: {
          id: user.userId,
          email: user.email,
          role: user.role,
        },
        // ✅ Devolver CSRF token al cliente
        csrfToken: tokens. csrfToken,
      },
      { status: 200 }
    );

    // ✅ MEJORADO: Cookies con flags de seguridad máxima
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const, // ✅ Cambiado a 'strict' para mayor seguridad
      path: '/',
    };

    // Access Token (1 hora)
    response.cookies.set('auth-token', token, {
      ...cookieOptions,
      maxAge: 60 * 60, // 1 hora
    });

    // Refresh Token (1 hora)
    response.cookies.set('refresh-token', tokens.refreshToken, {
      ...cookieOptions,
      maxAge: 60 * 60, // 1 hora
    });

    return response;

  } catch (error) {
    console.error('[LOGIN] Error:', error);

    // Log de error del servidor
    await logAudit({
      action:  'LOGIN_ERROR',
      details: { 
        error: error instanceof Error ?  error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
      ipAddress: getClientIP(request.headers),
      userAgent: getUserAgent(request. headers),
      success: false,
      errorMessage: 'Error interno del servidor',
    });

    // Normalizar tiempo de respuesta
    const elapsed = Date.now() - startTime;
    if (elapsed < 1000) {
      await delay(1000 - elapsed);
    }

    return NextResponse.json(
      { error: 'Error en el servidor.  Intenta nuevamente.' },
      { status: 500 }
    );
  }
}

/**
 * ✅ NUEVO: Validar Google reCAPTCHA v3
 * @param token - Token de reCAPTCHA del cliente
 * @returns true si es válido y score >= 0.5
 */
async function validateCaptcha(token: string): Promise<boolean> {
  // Verificar si está configurado
  if (!process.env.RECAPTCHA_SECRET_KEY) {
    console.warn('⚠️ RECAPTCHA_SECRET_KEY no está configurado en . env');
    
    // En desarrollo, permitir sin captcha
    if (process.env.NODE_ENV === 'development') {
      return true;
    }
    
    return false;
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
    });

    if (!response.ok) {
      console.error('[CAPTCHA] Error en respuesta de Google:', response.status);
      return false;
    }

    const data = await response. json();

    // Verificar éxito y score mínimo
    // Score:  0.0 = bot, 1.0 = humano
    const isValid = data.success && data.score >= 0.5;

    // Log para debugging
    console.log('[CAPTCHA] Validación:', {
      success: data.success,
      score: data.score,
      action: data.action,
      isValid,
    });

    return isValid;

  } catch (error) {
    console.error('[CAPTCHA] Error validando:', error);
    return false;
  }
}