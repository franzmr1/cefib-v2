/**
 * API Route: /api/cursos/[id]/docentes
 * Métodos: GET, POST, DELETE
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-26
 * Descripción: Asignar/desasignar docentes a cursos
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth';
import { asignarCursoSchema } from '@/lib/validations/docente.validation';
import { ZodError } from 'zod';

/**
 * GET: Obtener docentes asignados a un curso
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: cursoId } = await params;

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

    // Verificar que el curso existe
    const curso = await prisma.curso.findUnique({
      where: { id: cursoId },
    });

    if (!curso) {
      return NextResponse.json(
        { success: false, error: 'Curso no encontrado' },
        { status: 404 }
      );
    }

    // Obtener docentes asignados
    const asignaciones = await prisma.cursoDocente.findMany({
      where: {
        cursoId,
      },
      include: {
        docente: {
          select: {
            id: true,
            nombres: true,
            apellidos: true,
            email: true,
            celular: true,
            especialidad: true,
            estado: true,
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
      curso: {
        id: curso.id,
        titulo: curso.titulo,
      },
    });

  } catch (error) {
    console.error('[CURSO_DOCENTES_GET] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener docentes del curso' },
      { status: 500 }
    );
  }
}

/**
 * POST: Asignar docente a curso
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: cursoId } = await params;

    // Verificar autenticación
    const token = request.cookies.get('auth-token')?. value;
    
    if (! token) {
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

    // Validar datos
    const body = await request.json();
    const { docenteId } = body;

    if (! docenteId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'El ID del docente es requerido',
          field: 'docenteId'
        },
        { status: 400 }
      );
    }

    // Verificar que el curso existe
    const curso = await prisma.curso.findUnique({
      where: { id: cursoId },
    });

    if (!curso) {
      return NextResponse.json(
        { success: false, error: 'Curso no encontrado' },
        { status: 404 }
      );
    }

    // Verificar que el docente existe
    const docente = await prisma.docente.findUnique({
      where: { id: docenteId },
    });

    if (!docente) {
      return NextResponse.json(
        { success: false, error: 'Docente no encontrado' },
        { status: 404 }
      );
    }

    // Verificar si ya está asignado
    const existingAsignacion = await prisma.cursoDocente.findUnique({
      where: {
        cursoId_docenteId: {
          cursoId,
          docenteId,
        },
      },
    });

    if (existingAsignacion) {
      // Si existe pero está finalizado, reactivar
      if (existingAsignacion.estado === 'FINALIZADO') {
        const asignacion = await prisma.cursoDocente.update({
          where: { id: existingAsignacion.id },
          data: {
            estado: 'ACTIVO',
            fechaAsignacion: new Date(),
          },
          include: {
            docente: {
              select: {
                nombres: true,
                apellidos: true,
                email: true,
              },
            },
            curso: {
              select: {
                titulo: true,
              },
            },
          },
        });

        return NextResponse.json({
          success: true,
          asignacion,
          message: 'Docente reasignado al curso exitosamente',
        });
      }

      return NextResponse.json(
        { 
          success: false, 
          error: 'El docente ya está asignado a este curso',
        },
        { status: 400 }
      );
    }

    // Crear asignación
    const asignacion = await prisma.cursoDocente.create({
      data: {
        cursoId,
        docenteId,
      },
      include: {
        docente: {
          select: {
            nombres: true,
            apellidos: true,
            email: true,
            especialidad: true,
          },
        },
        curso: {
          select: {
            titulo: true,
          },
        },
      },
    });

    return NextResponse. json({
      success: true,
      asignacion,
      message: 'Docente asignado al curso exitosamente',
    }, { status: 201 });

  } catch (error) {
    console.error('[CURSO_DOCENTES_POST] Error:', error);
    return NextResponse. json(
      { success: false, error: 'Error al asignar docente al curso' },
      { status: 500 }
    );
  }
}

/**
 * DELETE: Desasignar docente de curso
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: cursoId } = await params;

    // Verificar autenticación
    const token = request.cookies. get('auth-token')?.value;
    
    if (!token) {
      return NextResponse. json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    const currentUser = await getUserFromToken(token);
    
    if (!currentUser || ! ['ADMIN', 'SUPER_ADMIN'].includes(currentUser.role)) {
      return NextResponse.json(
        { success: false, error: 'Acceso denegado' },
        { status: 403 }
      );
    }

    // Obtener docenteId del body
    const body = await request.json();
    const { docenteId } = body;

    if (!docenteId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'El ID del docente es requerido',
        },
        { status: 400 }
      );
    }

    // Verificar que la asignación existe
    const asignacion = await prisma.cursoDocente.findUnique({
      where: {
        cursoId_docenteId: {
          cursoId,
          docenteId,
        },
      },
    });

    if (!asignacion) {
      return NextResponse.json(
        { success: false, error: 'Asignación no encontrada' },
        { status: 404 }
      );
    }

    // Marcar como finalizado (no eliminar, para mantener historial)
    await prisma.cursoDocente. update({
      where: { id: asignacion.id },
      data: {
        estado: 'FINALIZADO',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Docente desasignado del curso exitosamente',
    });

  } catch (error) {
    console.error('[CURSO_DOCENTES_DELETE] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Error al desasignar docente del curso' },
      { status: 500 }
    );
  }
}