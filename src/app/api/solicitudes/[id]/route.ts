/**
 * API: Actualizar Solicitud por ID
 * Versión: 1.0
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-26
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth';
import { solicitudUpdateSchema } from '@/lib/validations/solicitud';

/**
 * PUT /api/solicitudes/[id]
 * Actualizar solicitud (SOLO ADMIN)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // SEGURIDAD: Verificar autenticación
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

    // Verificar que la solicitud existe
    const existingSolicitud = await prisma. solicitud.findUnique({
      where: { id },
    });

    if (!existingSolicitud) {
      return NextResponse.json(
        { success: false, error: 'Solicitud no encontrada' },
        { status: 404 }
      );
    }

    // Validar datos
    const body = await request.json();
    const validationResult = solicitudUpdateSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Datos inválidos',
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Preparar datos para actualizar
    const updateData: any = {};

    if (data.estado !== undefined) updateData.estado = data.estado;
    if (data.prioridad !== undefined) updateData.prioridad = data. prioridad;
    if (data.notasInternas !== undefined) updateData.notasInternas = data.notasInternas;
    if (data.asignadoA !== undefined) updateData.asignadoA = data.asignadoA;
    if (data.fechaContacto !== undefined) updateData.fechaContacto = data.fechaContacto ?  new Date(data.fechaContacto) : null;
    if (data.fechaCierre !== undefined) updateData.fechaCierre = data.fechaCierre ? new Date(data.fechaCierre) : null;

    // Actualizar
    const solicitud = await prisma.solicitud. update({
      where: { id },
      data: updateData,
      include: {
        asignadoUsuario: {
          select: {
            id: true,
            name: true,
            apellidos: true,
            email: true,
          },
        },
      },
    });

    // Log de auditoría
    console.log(`[SOLICITUD_ACTUALIZADA] ID: ${id}, Usuario: ${currentUser.email}, Estado: ${solicitud.estado}`);

    return NextResponse.json({
      success: true,
      solicitud,
      message: 'Solicitud actualizada exitosamente',
    });

  } catch (error: any) {
    console.error('[SOLICITUD_PUT] Error:', error);
    
    return NextResponse.json(
      { success: false, error: 'Error al actualizar solicitud' },
      { status: 500 }
    );
  }
}