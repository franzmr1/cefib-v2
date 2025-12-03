/**
 * API Route: Admin - Audit Logs
 * Version: v1.0
 * Descripción: Obtener logs de auditoría (solo admin)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getLogStats } from '@/lib/audit-logger';

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const user = await getUserFromToken(token);

    if (!user || !['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
      return NextResponse. json({ error: 'No autorizado' }, { status: 403 });
    }

    // Obtener logs (últimos 100)
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        user: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });

    // Obtener estadísticas
    const stats = await getLogStats(7);

    return NextResponse.json({
      logs,
      stats,
      total: logs.length,
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}