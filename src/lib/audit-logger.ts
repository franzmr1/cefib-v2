/**
 * Audit Logger - Sistema de auditoría
 * Version: v1.2 - Con getLogStats
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-12-03
 * Descripción: Utilidad para registrar acciones en audit logs
 */

import { prisma } from './prisma';
import { AuditAction } from '@prisma/client';

interface LogAuditParams {
  action: AuditAction;
  userId?: string | null;
  entity?: string;
  entityId?: string | null;
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
        entityId: entityId || null,
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
 * Obtener estadísticas de logs
 */
export async function getLogStats(daysToAnalyze: number = 30) {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToAnalyze);

    // Total de acciones en el período
    const totalAcciones = await prisma.auditLog.count({
      where: {
        createdAt: {
          gte: cutoffDate,
        },
      },
    });

    // Acciones fallidas
    const accionesFallidas = await prisma.auditLog.count({
      where: {
        createdAt: {
          gte: cutoffDate,
        },
        success: false,
      },
    });

    // Top acciones más comunes
    const topAcciones = await prisma.auditLog. groupBy({
      by: ['action'],
      where: {
        createdAt: {
          gte: cutoffDate,
        },
      },
      _count: {
        action: true,
      },
      orderBy: {
        _count: {
          action: 'desc',
        },
      },
      take: 10,
    });

    // ✅ CORREGIDO: Validar que sean números antes de calcular
    const total = totalAcciones ??  0;
    const fallidas = accionesFallidas ?? 0;
    
    const tasaExito = total > 0 
      ? ((total - fallidas) / total * 100).toFixed(1) 
      : '0.0'; // ✅ String con un decimal

    return {
      totalAcciones: total,
      accionesFallidas: fallidas,
      tasaExito, // Ya es string con formato "81.8"
      topAcciones: topAcciones.map(item => ({
        action: item.action,
        count: item._count.action,
      })),
    };
  } catch (error) {
    console.error('Error getting log stats:', error);
    // ✅ Retornar valores seguros en caso de error
    return {
      totalAcciones: 0,
      accionesFallidas: 0,
      tasaExito: '0.0',
      topAcciones: [],
    };
  }
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