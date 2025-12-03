/**
 * CSRF Protection - Protección contra Cross-Site Request Forgery
 * Version: v1.0
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-27
 * Descripción: Generación y validación de tokens CSRF
 */

import { randomBytes, createHash } from 'crypto';

/**
 * Generar token CSRF aleatorio
 */
export function generateCSRFToken(): string {
  return randomBytes(32). toString('hex');
}

/**
 * Crear hash del token para comparación segura
 */
export function hashToken(token: string): string {
  return createHash('sha256'). update(token).digest('hex');
}

/**
 * Verificar token CSRF
 * Usa comparación de tiempo constante para prevenir timing attacks
 */
export function verifyCSRFToken(token: string, hashedToken: string): boolean {
  if (!token || !hashedToken) {
    return false;
  }

  const tokenHash = hashToken(token);

  // Comparación de tiempo constante
  if (tokenHash. length !== hashedToken.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < tokenHash.length; i++) {
    result |= tokenHash. charCodeAt(i) ^ hashedToken.charCodeAt(i);
  }

  return result === 0;
}

/**
 * Extraer token CSRF del header
 */
export function getCSRFTokenFromHeaders(headers: Headers): string | null {
  // Intentar obtener de header personalizado
  const headerToken = headers.get('x-csrf-token');
  if (headerToken) {
    return headerToken;
  }

  // Intentar obtener de header estándar
  const csrfToken = headers.get('csrf-token');
  if (csrfToken) {
    return csrfToken;
  }

  return null;
}