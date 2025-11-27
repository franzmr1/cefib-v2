/**
 * API Route: /api/docentes/[id]
 * Métodos: GET, PUT, DELETE
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-26
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth';
import { docenteSchema } from '@/lib/validations/docente.validation';
import { ZodError } from 'zod';

/**
 * GET: Obtener un docente por ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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

    // Obtener docente
    const docente = await prisma.docente. findUnique({
      where: { id },
      include: {
        cursosAsignados: {
          include: {
            curso: {
              select: {
                id: true,
                titulo: true,
                estado: true,
                fechaInicio: true,
                fechaFin: true,
              },
            },
          },
        },
      },
    });

    if (!docente) {
      return NextResponse.json(
        { success: false, error: 'Docente no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      docente,
    });

  } catch (error) {
    console.error('[DOCENTE_GET] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener docente' },
      { status: 500 }
    );
  }
}

/**
 * PUT: Actualizar docente
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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

    // Verificar que el docente existe
    const existingDocente = await prisma. docente.findUnique({
      where: { id },
    });

    if (!existingDocente) {
      return NextResponse.json(
        { success: false, error: 'Docente no encontrado' },
        { status: 404 }
      );
    }

    // Validar datos
    const body = await request.json();
    const validatedData = docenteSchema. partial().parse(body);

    // Si se está actualizando el email, verificar que no exista
    if (validatedData.email && validatedData.email !== existingDocente.email) {
      const emailExists = await prisma.docente. findUnique({
        where: { email: validatedData.email },
      });

      if (emailExists) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'El email ya está registrado',
            field: 'email'
          },
          { status: 400 }
        );
      }
    }

    // Si se está actualizando el documento, verificar que no exista
    if (validatedData.numeroDocumento && validatedData.numeroDocumento !== existingDocente. numeroDocumento) {
      const docExists = await prisma.docente. findUnique({
        where: { numeroDocumento: validatedData.numeroDocumento },
      });

      if (docExists) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'El número de documento ya está registrado',
            field: 'numeroDocumento'
          },
          { status: 400 }
        );
      }
    }

    // Actualizar docente
    const docente = await prisma.docente.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json({
      success: true,
      docente,
      message: 'Docente actualizado exitosamente',
    });

  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Datos inválidos',
          details: error.issues.map((issue) => ({
            field: issue. path.join('.'),
            message: issue.message,
          }))
        },
        { status: 400 }
      );
    }

    console.error('[DOCENTE_PUT] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Error al actualizar docente' },
      { status: 500 }
    );
  }
}

/**
 * DELETE: Eliminar docente
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Verificar autenticación (solo SUPER_ADMIN puede eliminar)
    const token = request.cookies. get('auth-token')?.value;
    
    if (!token) {
      return NextResponse. json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    const currentUser = await getUserFromToken(token);
    
    if (!currentUser || currentUser.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Solo SUPER_ADMIN puede eliminar docentes' },
        { status: 403 }
      );
    }

    // Verificar que el docente existe
    const docente = await prisma.docente.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            cursosAsignados: true,
          },
        },
      },
    });

    if (!docente) {
      return NextResponse.json(
        { success: false, error: 'Docente no encontrado' },
        { status: 404 }
      );
    }

    // Eliminar docente (CASCADE eliminará también las asignaciones)
    await prisma.docente.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Docente eliminado exitosamente',
    });

  } catch (error) {
    console.error('[DOCENTE_DELETE] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Error al eliminar docente' },
      { status: 500 }
    );
  }
}