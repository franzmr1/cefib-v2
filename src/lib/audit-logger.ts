/**
 * Audit Logger - Sistema de auditoría
 * Version: v1.0
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-27
 * Descripción: Utilidad para registrar acciones en audit logs
 */

import { prisma } from './prisma';
import { AuditAction } from '@prisma/client';

interface LogAuditParams {
  action: AuditAction;
  userId?: string | null;
  entity?: string;
  entityId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  success?: boolean;
  errorMessage?: string;
}

/**
 * Registrar acción en audit log
 */
export async function logAudit({
  action,
  userId = null,
  entity,
  entityId,
  details,
  ipAddress,
  userAgent,
  success = true,
  errorMessage,
}: LogAuditParams): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        action,
        userId,
        entity,
        entityId,
        details: details ?  JSON.parse(JSON.stringify(details)) : null,
        ipAddress,
        userAgent,
        success,
        errorMessage,
      },
    });
  } catch (error) {
    // No fallar la operación principal si falla el logging
    console.error('Error creating audit log:', error);
  }
}

/**
 * Obtener IP del cliente desde headers
 */
export function getClientIP(headers: Headers): string {
  return (
    headers.get('x-forwarded-for')?.split(',')[0]. trim() ||
    headers.get('x-real-ip') ||
    'unknown'
  );
}

/**
 * Obtener User Agent desde headers
 */
export function getUserAgent(headers: Headers): string {
  return headers.get('user-agent') || 'unknown';
}

/**
 * Limpiar logs antiguos (ejecutar periódicamente)
 * @param daysToKeep - Días a mantener (default: 90 días)
 */
export async function cleanOldLogs(daysToKeep: number = 90): Promise<number> {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const result = await prisma.auditLog.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate,
        },
      },
    });

    return result.count;
  } catch (error) {
    console.error('Error cleaning old logs:', error);
    return 0;
  }
}

/**
 * Obtener logs recientes de un usuario
 */
export async function getUserLogs(userId: string, limit: number = 50) {
  return prisma.auditLog.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      user: {
        select: {
          email: true,
          name: true,
        },
      },
    },
  });
}

/**
 * Obtener estadísticas de logs
 */
export async function getLogStats(days: number = 7) {
  const since = new Date();
  since. setDate(since.getDate() - days);

  const [total, failed, byAction] = await Promise.all([
    // Total de logs
    prisma.auditLog.count({
      where: { createdAt: { gte: since } },
    }),

    // Acciones fallidas
    prisma. auditLog.count({
      where: {
        createdAt: { gte: since },
        success: false,
      },
    }),

    // Por tipo de acción
    prisma. auditLog.groupBy({
      by: ['action'],
      where: { createdAt: { gte: since } },
      _count: true,
      orderBy: {
        _count: {
          action: 'desc',
        },
      },
    }),
  ]);

  return {
    total,
    failed,
    successRate: total > 0 ? ((total - failed) / total) * 100 : 100,
    byAction: byAction.map((item) => ({
      action: item.action,
      count: item._count,
    })),
  };
}