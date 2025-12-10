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

// ============================================
// ✅ EXTENSIONES DE SEGURIDAD
// Autor: Franz (@franzmr1)
// Fecha: 2025-12-07
// ============================================

// Configuración adicional
const PERMANENT_BLOCK_THRESHOLD = 10;
const permanentBlocks = new Set<string>();

interface ExtendedRateLimitResult {
  success: boolean;
  remainingAttempts: number;
  retryAfter?: number;
  requiresCaptcha:  boolean;  // ✅ NUEVO
  isPermanentlyBlocked: boolean;  // ✅ NUEVO
}

/**
 * ✅ NUEVO: Verificar bloqueo permanente
 */
export function isPermanentlyBlocked(ip: string): boolean {
  return permanentBlocks.has(ip);
}

/**
 * ✅ NUEVO:  Agregar a blacklist permanente
 */
export function addToPermanentBlacklist(ip: string): void {
  permanentBlocks.add(ip);
  console.warn(`🚨 IP bloqueada permanentemente: ${ip}`);
}

/**
 * ✅ NUEVO: Rate limit extendido con captcha y bloqueo permanente
 */
export function checkIPRateLimitExtended(
  ip: string,
  maxAttempts: number = 5,
  windowMs: number = 60 * 1000
): ExtendedRateLimitResult {
  // Verificar bloqueo permanente
  if (isPermanentlyBlocked(ip)) {
    return {
      success: false,
      remainingAttempts: 0,
      requiresCaptcha: true,
      isPermanentlyBlocked: true,
    };
  }

  const now = Date.now();
  const record = loginAttempts. get(ip);

  // Si está bloqueado temporalmente
  if (record?. blockedUntil && now < record.blockedUntil) {
    return {
      success: false,
      remainingAttempts: 0,
      retryAfter: Math.ceil((record.blockedUntil - now) / 1000),
      requiresCaptcha: true,
      isPermanentlyBlocked: false,
    };
  }

  // Si no hay registro o expiró
  if (!record || now > record.resetAt) {
    loginAttempts.set(ip, {
      count: 1,
      resetAt: now + windowMs,
    });
    return {
      success: true,
      remainingAttempts: maxAttempts - 1,
      requiresCaptcha: false,
      isPermanentlyBlocked: false,
    };
  }

  // Incrementar contador
  record.count++;

  // ✅ Bloqueo permanente si excede umbral
  if (record.count >= PERMANENT_BLOCK_THRESHOLD) {
    addToPermanentBlacklist(ip);
    return {
      success: false,
      remainingAttempts: 0,
      requiresCaptcha: true,
      isPermanentlyBlocked: true,
    };
  }

  // Bloqueo temporal
  if (record.count >= maxAttempts) {
    record.blockedUntil = now + 15 * 60 * 1000;
    return {
      success: false,
      remainingAttempts: 0,
      retryAfter: 900,
      requiresCaptcha: true,
      isPermanentlyBlocked: false,
    };
  }

  return {
    success: true,
    remainingAttempts: maxAttempts - record.count,
    requiresCaptcha: record.count >= 3, // ✅ Captcha después de 3 intentos
    isPermanentlyBlocked: false,
  };
}

/**
 * ✅ NUEVO: Email rate limit extendido
 */
export function checkEmailRateLimitExtended(
  email:  string,
  maxAttempts: number = 3,
  windowMs: number = 60 * 1000
): ExtendedRateLimitResult {
  const now = Date.now();
  const normalizedEmail = email.toLowerCase();
  const record = emailAttempts.get(normalizedEmail);

  if (record?.blockedUntil && now < record.blockedUntil) {
    return {
      success:  false,
      remainingAttempts: 0,
      retryAfter: Math.ceil((record.blockedUntil - now) / 1000),
      requiresCaptcha: true,
      isPermanentlyBlocked: false,
    };
  }

  if (!record || now > record.resetAt) {
    emailAttempts.set(normalizedEmail, {
      count: 1,
      resetAt: now + windowMs,
    });
    return {
      success: true,
      remainingAttempts: maxAttempts - 1,
      requiresCaptcha: false,
      isPermanentlyBlocked: false,
    };
  }

  record.count++;

  if (record.count >= maxAttempts) {
    record.blockedUntil = now + 30 * 60 * 1000;
    return {
      success: false,
      remainingAttempts: 0,
      retryAfter: 1800,
      requiresCaptcha: true,
      isPermanentlyBlocked: false,
    };
  }

  return {
    success: true,
    remainingAttempts: maxAttempts - record.count,
    requiresCaptcha: record. count >= 2, // ✅ Captcha después de 2 intentos
    isPermanentlyBlocked: false,
  };
}