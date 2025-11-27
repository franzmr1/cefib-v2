/**
 * API Route: /api/participantes/[id]
 * Métodos: GET, PUT, DELETE
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-26
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth';
import { participanteSchema } from '@/lib/validations/participante.validation';
import { ZodError } from 'zod';

/**
 * GET: Obtener un participante por ID
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

    // Obtener participante
    const participante = await prisma.participante. findUnique({
      where: { id },
      include: {
        inscripciones: {
          include: {
            curso: {
              select: {
                id: true,
                titulo: true,
                estado: true,
                fechaInicio: true,
                fechaFin: true,
                precio: true,
              },
            },
            registradoPor: {
              select: {
                name: true,
                apellidos: true,
                email: true,
              },
            },
          },
          orderBy: {
            fechaInscripcion: 'desc',
          },
        },
      },
    });

    if (! participante) {
      return NextResponse.json(
        { success: false, error: 'Participante no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      participante,
    });

  } catch (error) {
    console. error('[PARTICIPANTE_GET] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener participante' },
      { status: 500 }
    );
  }
}

/**
 * PUT: Actualizar participante
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

    // Verificar que el participante existe
    const existingParticipante = await prisma.participante.findUnique({
      where: { id },
    });

    if (!existingParticipante) {
      return NextResponse.json(
        { success: false, error: 'Participante no encontrado' },
        { status: 404 }
      );
    }

    // Validar datos
    const body = await request. json();
    const validatedData = participanteSchema.partial().parse(body);

    // Si se está actualizando el email, verificar que no exista
    if (validatedData.email && validatedData.email !== existingParticipante.email) {
      const emailExists = await prisma.participante.findUnique({
        where: { email: validatedData. email },
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
    if (validatedData.numeroDocumento && validatedData.numeroDocumento !== existingParticipante.numeroDocumento) {
      const docExists = await prisma.participante. findUnique({
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

    // Actualizar participante
    const participante = await prisma.participante.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse. json({
      success: true,
      participante,
      message: 'Participante actualizado exitosamente',
    });

  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse. json(
        { 
          success: false, 
          error: 'Datos inválidos',
          details: error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue. message,
          }))
        },
        { status: 400 }
      );
    }

    console.error('[PARTICIPANTE_PUT] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Error al actualizar participante' },
      { status: 500 }
    );
  }
}

/**
 * DELETE: Eliminar participante
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
        { success: false, error: 'Solo SUPER_ADMIN puede eliminar participantes' },
        { status: 403 }
      );
    }

    // Verificar que el participante existe
    const participante = await prisma.participante.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            inscripciones: true,
          },
        },
      },
    });

    if (!participante) {
      return NextResponse.json(
        { success: false, error: 'Participante no encontrado' },
        { status: 404 }
      );
    }

    // Eliminar participante (CASCADE eliminará también las inscripciones)
    await prisma.participante.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Participante eliminado exitosamente',
    });

  } catch (error) {
    console.error('[PARTICIPANTE_DELETE] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Error al eliminar participante' },
      { status: 500 }
    );
  }
}