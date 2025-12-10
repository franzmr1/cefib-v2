/**
 * Audit Helper - Wrapper para simplificar auditoría
 * Version: 1.0 (NUEVO ARCHIVO)
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-12-09
 * Descripción: Simplifica el registro de auditoría en todas las rutas API
 */

import { logAudit, getClientIP, getUserAgent } from './audit-logger';
import { getUserFromToken } from './auth';
import { AuditAction } from '@prisma/client';

interface AuditParams {
  request: Request;
  action: AuditAction;
  entity?:  string;
  entityId?: string;
  details?: Record<string, any>;
  success?: boolean;
  errorMessage?: string;
}

/**
 * ✅ Función simplificada para auditar acciones
 * Uso: await auditLog({ request, action:  'DOCENTE_CREATE', entity: 'Docente', entityId: docente.id })
 */
export async function auditLog(params: AuditParams) {
  const { request, action, entity, entityId, details, success = true, errorMessage } = params;

  // Extraer datos del request
  const headers = request.headers;
  const cookieHeader = headers.get('cookie');
  const token = cookieHeader?.match(/auth-token=([^;]+)/)?.[1];
  
  const ip = getClientIP(headers);
  const userAgent = getUserAgent(headers);

  let userId: string | null = null;

  // Obtener usuario del token
  if (token) {
    try {
      const user = await getUserFromToken(token);
      userId = user?. id || null;
    } catch (error) {
      console.error('Error obteniendo usuario para audit:', error);
    }
  }

  // Registrar en audit log
  await logAudit({
    action,
    userId,
    entity,
    entityId,
    details,
    ipAddress: ip,
    userAgent,
    success,
    errorMessage,
  });
}