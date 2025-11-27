/**
 * API Route: /api/inscripciones/[id]
 * Métodos: GET, PUT, DELETE
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-26
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth';
import { inscripcionSchema } from '@/lib/validations/participante.validation';
import { ZodError } from 'zod';

/**
 * GET: Obtener una inscripción por ID
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

    // Obtener inscripción
    const inscripcion = await prisma.inscripcion.findUnique({
      where: { id },
      include: {
        participante: true,
        curso: true,
        registradoPor: {
          select: {
            name: true,
            apellidos: true,
            email: true,
          },
        },
      },
    });

    if (!inscripcion) {
      return NextResponse.json(
        { success: false, error: 'Inscripción no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      inscripcion,
    });

  } catch (error) {
    console.error('[INSCRIPCION_GET] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener inscripción' },
      { status: 500 }
    );
  }
}

/**
 * PUT: Actualizar inscripción (principalmente estado de pago y asistencia)
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

    // Verificar que la inscripción existe
    const existingInscripcion = await prisma.inscripcion.findUnique({
      where: { id },
    });

    if (! existingInscripcion) {
      return NextResponse.json(
        { success: false, error: 'Inscripción no encontrada' },
        { status: 404 }
      );
    }

    // Validar datos (solo campos que se pueden actualizar)
    const body = await request.json();
    
    const updateData: any = {};
    
    if (body.estadoPago !== undefined) {
      updateData. estadoPago = body.estadoPago;
    }
    
    if (body.montoPagado !== undefined) {
      updateData.montoPagado = body.montoPagado;
    }
    
    if (body.fechaPago !== undefined) {
      updateData.fechaPago = body.fechaPago ?  new Date(body.fechaPago) : null;
    }
    
    if (body.metodoPago !== undefined) {
      updateData.metodoPago = body.metodoPago;
    }
    
    if (body. asistio !== undefined) {
      updateData.asistio = body.asistio;
    }
    
    if (body.observaciones !== undefined) {
      updateData.observaciones = body.observaciones;
    }

    // Actualizar inscripción
    const inscripcion = await prisma.inscripcion.update({
      where: { id },
      data: updateData,
      include: {
        participante: {
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

    return NextResponse. json({
      success: true,
      inscripcion,
      message: 'Inscripción actualizada exitosamente',
    });

  } catch (error) {
    console.error('[INSCRIPCION_PUT] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Error al actualizar inscripción' },
      { status: 500 }
    );
  }
}

/**
 * DELETE: Eliminar inscripción
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
        { success: false, error: 'Solo SUPER_ADMIN puede eliminar inscripciones' },
        { status: 403 }
      );
    }

    // Verificar que la inscripción existe
    const inscripcion = await prisma.inscripcion.findUnique({
      where: { id },
      include: {
        curso: true,
      },
    });

    if (! inscripcion) {
      return NextResponse.json(
        { success: false, error: 'Inscripción no encontrada' },
        { status: 404 }
      );
    }

    // Eliminar inscripción y actualizar cupo en una transacción
    await prisma.$transaction(async (tx) => {
      // Eliminar inscripción
      await tx. inscripcion.delete({
        where: { id },
      });

      // Decrementar cupo del curso
      await tx.curso.update({
        where: { id: inscripcion.cursoId },
        data: {
          cupoActual: {
            decrement: 1,
          },
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: 'Inscripción eliminada exitosamente',
    });

  } catch (error) {
    console.error('[INSCRIPCION_DELETE] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Error al eliminar inscripción' },
      { status: 500 }
    );
  }
}