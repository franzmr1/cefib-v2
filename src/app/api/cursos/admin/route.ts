/**
 * API Route: /api/cursos/admin
 * Version: v1.0
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-21
 * Descripción: GET todos los cursos (incluye borradores y archivados) - Solo ADMIN
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { getUserFromToken } from '@/lib/auth';

/**
 * GET - Listar TODOS los cursos (admin)
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const user = await getUserFromToken(token);

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    // Obtener TODOS los cursos (sin filtro de estado)
    const cursos = await prisma.curso.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        creador: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ cursos });
  } catch (error) {
    console.error('Error fetching cursos:', error);
    return NextResponse.json(
      { error: 'Error al obtener cursos' },
      { status: 500 }
    );
  }
}