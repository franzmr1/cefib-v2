/**
 * API Route: /api/asignaciones
 * Métodos: GET
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-26
 * Descripción: Ver todas las asignaciones docente-curso
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth';

/**
 * GET: Obtener todas las asignaciones
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    const currentUser = await getUserFromToken(token);
    
    if (!currentUser || !['ADMIN', 'SUPER_ADMIN'].includes(currentUser. role)) {
      return NextResponse.json(
        { success: false, error: 'Acceso denegado' },
        { status: 403 }
      );
    }

    // Obtener filtros
    const searchParams = request.nextUrl.searchParams;
    const docenteId = searchParams.get('docenteId');
    const cursoId = searchParams. get('cursoId');
    const estado = searchParams.get('estado');

    // Construir filtros
    const where: any = {};
    
    if (docenteId) {
      where.docenteId = docenteId;
    }
    
    if (cursoId) {
      where.cursoId = cursoId;
    }
    
    if (estado) {
      where.estado = estado;
    }

    // Obtener asignaciones
    const asignaciones = await prisma.cursoDocente.findMany({
      where,
      include: {
        docente: {
          select: {
            id: true,
            nombres: true,
            apellidos: true,
            email: true,
            especialidad: true,
            estado: true,
          },
        },
        curso: {
          select: {
            id: true,
            titulo: true,
            estado: true,
            fechaInicio: true,
            fechaFin: true,
            modalidad: true,
          },
        },
      },
      orderBy: {
        fechaAsignacion: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      asignaciones,
      total: asignaciones.length,
    });

  } catch (error) {
    console.error('[ASIGNACIONES_GET] Error:', error);
    return NextResponse. json(
      { success: false, error: 'Error al obtener asignaciones' },
      { status: 500 }
    );
  }
}