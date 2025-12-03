/**
 * Rate Limiting - Protección contra fuerza bruta
 * Version: v1. 0
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-27
 */

interface RateLimitRecord {
  count: number;
  resetAt: number;
  blockedUntil?: number;
}

// Almacenamiento en memoria (en producción usar Redis)
const loginAttempts = new Map<string, RateLimitRecord>();
const emailAttempts = new Map<string, RateLimitRecord>();

/**
 * Limpiar registros antiguos cada 10 minutos
 */
setInterval(() => {
  const now = Date.now();
  
  for (const [key, record] of loginAttempts.entries()) {
    if (now > record.resetAt && (! record.blockedUntil || now > record.blockedUntil)) {
      loginAttempts. delete(key);
    }
  }

  for (const [key, record] of emailAttempts.entries()) {
    if (now > record.resetAt && (!record. blockedUntil || now > record.blockedUntil)) {
      emailAttempts. delete(key);
    }
  }
}, 10 * 60 * 1000); // 10 minutos

/**
 * Verificar rate limit por IP
 * @param ip - Dirección IP del cliente
 * @param maxAttempts - Máximo de intentos permitidos (default: 5)
 * @param windowMs - Ventana de tiempo en ms (default: 1 minuto)
 * @returns {success: boolean, remainingAttempts: number, retryAfter?: number}
 */
export function checkIPRateLimit(
  ip: string,
  maxAttempts: number = 5,
  windowMs: number = 60 * 1000
): { success: boolean; remainingAttempts: number; retryAfter?: number } {
  const now = Date.now();
  const record = loginAttempts.get(ip);

  // Si está bloqueado
  if (record?. blockedUntil && now < record.blockedUntil) {
    return {
      success: false,
      remainingAttempts: 0,
      retryAfter: Math.ceil((record.blockedUntil - now) / 1000),
    };
  }

  // Si no hay registro o ya expiró
  if (!record || now > record.resetAt) {
    loginAttempts.set(ip, {
      count: 1,
      resetAt: now + windowMs,
    });
    return { success: true, remainingAttempts: maxAttempts - 1 };
  }

  // Si alcanzó el límite
  if (record.count >= maxAttempts) {
    // Bloquear por 15 minutos
    record.blockedUntil = now + 15 * 60 * 1000;
    return {
      success: false,
      remainingAttempts: 0,
      retryAfter: 900, // 15 minutos
    };
  }

  // Incrementar contador
  record.count++;
  return {
    success: true,
    remainingAttempts: maxAttempts - record.count,
  };
}

/**
 * Verificar rate limit por Email
 * Protege contra intentos de fuerza bruta a un usuario específico
 */
export function checkEmailRateLimit(
  email: string,
  maxAttempts: number = 3,
  windowMs: number = 60 * 1000
): { success: boolean; remainingAttempts: number; retryAfter?: number } {
  const now = Date.now();
  const normalizedEmail = email.toLowerCase();
  const record = emailAttempts.get(normalizedEmail);

  // Si está bloqueado
  if (record?.blockedUntil && now < record. blockedUntil) {
    return {
      success: false,
      remainingAttempts: 0,
      retryAfter: Math.ceil((record.blockedUntil - now) / 1000),
    };
  }

  // Si no hay registro o ya expiró
  if (!record || now > record.resetAt) {
    emailAttempts.set(normalizedEmail, {
      count: 1,
      resetAt: now + windowMs,
    });
    return { success: true, remainingAttempts: maxAttempts - 1 };
  }

  // Si alcanzó el límite
  if (record.count >= maxAttempts) {
    // Bloquear por 30 minutos
    record.blockedUntil = now + 30 * 60 * 1000;
    return {
      success: false,
      remainingAttempts: 0,
      retryAfter: 1800, // 30 minutos
    };
  }

  // Incrementar contador
  record.count++;
  return {
    success: true,
    remainingAttempts: maxAttempts - record.count,
  };
}

/**
 * Resetear rate limit después de login exitoso
 */
export function resetRateLimit(ip: string, email: string) {
  loginAttempts.delete(ip);
  emailAttempts.delete(email. toLowerCase());
}

/**
 * Obtener IP real del cliente (considerando proxies)
 */
export function getClientIP(headers: Headers): string {
  return (
    headers.get('x-forwarded-for')?.split(',')[0]. trim() ||
    headers.get('x-real-ip') ||
    'unknown'
  );
}