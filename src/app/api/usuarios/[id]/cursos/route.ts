/**
 * API Route: /api/usuarios/[id]/cursos
 * Método: GET
 * Versión: 1.0
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-26
 * Descripción: Obtiene los cursos creados por un usuario específico
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Verificar autenticación
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    const currentUser = await getUserFromToken(token);
    
    if (!currentUser || !['ADMIN', 'SUPER_ADMIN'].includes(currentUser.role)) {
      return NextResponse.json(
        { success: false, error: 'Acceso denegado' },
        { status: 403 }
      );
    }

    // Obtener cursos del usuario
    const cursos = await prisma.curso.findMany({
      where: {
        creadorId: id,
      },
      select: {
        id: true,
        titulo: true,
        slug: true,
        estado: true,
        modalidad: true,
        duracionHoras: true,
        precio: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      cursos,
      total: cursos.length,
    });

  } catch (error) {
    console.error('[USUARIO_CURSOS_GET] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener cursos' },
      { status: 500 }
    );
  }
}