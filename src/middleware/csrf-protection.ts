/**
 * CSRF Protection Middleware
 * Version: 1.0
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-12-07
 * Descripción: Validación CSRF para rutas protegidas
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyCSRFToken, getCSRFTokenFromHeaders } from '@/lib/csrf';

/**
 * ✅ Validar CSRF en peticiones que modifican datos
 */
export async function validateCSRF(
  request: NextRequest,
  expectedCSRFHash: string
): Promise<boolean> {
  // Solo validar en métodos peligrosos
  const dangerousMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];
  
  if (! dangerousMethods.includes(request.method)) {
    return true; // No requiere validación
  }

  const csrfToken = getCSRFTokenFromHeaders(request.headers);
  
  if (!csrfToken) {
    console.warn('[CSRF] Token no encontrado en headers');
    return false;
  }

  return verifyCSRFToken(csrfToken, expectedCSRFHash);
}

/**
 * ✅ Middleware para proteger rutas
 */
export function csrfProtectionMiddleware(expectedCSRFHash: string) {
  return async (request: NextRequest): Promise<NextResponse | null> => {
    const isValid = await validateCSRF(request, expectedCSRFHash);

    if (!isValid) {
      return NextResponse.json(
        { 
          error: 'Token CSRF inválido',
          code: 'CSRF_VALIDATION_FAILED',
        },
        { status:  403 }
      );
    }

    return null; // Continuar
  };
}