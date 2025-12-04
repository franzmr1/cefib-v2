/**
 * API Route: /api/cursos/[id]
 * Version: v3.0 - CON AUDIT LOGGING Y REVALIDACIÓN
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-12-03
 * Descripción: GET, PATCH (editar), DELETE (eliminar) curso específico
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logAudit, getClientIP, getUserAgent } from '@/lib/audit-logger';
import { getUserFromToken } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET - Obtener curso por ID
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;

    const curso = await prisma.curso. findUnique({
      where: { id },
    });

    if (!curso) {
      return NextResponse.json(
        { error: 'Curso no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ curso });
  } catch (error) {
    console.error('Error fetching curso:', error);
    return NextResponse.json(
      { error: 'Error al obtener curso' },
      { status: 500 }
    );
  }
}

/**
 * PATCH - Actualizar curso
 */
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;

    // Verificar autenticación
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const user = await getUserFromToken(token);

    if (!user || !['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
      return NextResponse. json({ error: 'No autorizado' }, { status: 403 });
    }

    // Verificar que el curso existe
    const existingCurso = await prisma.curso.findUnique({
      where: { id },
    });

    if (!existingCurso) {
      return NextResponse.json(
        { error: 'Curso no encontrado' },
        { status: 404 }
      );
    }

    const body = await request.json();

    // Guardar estado anterior para audit log
    const cambios: any = {};
    if (body.estado && body.estado !== existingCurso.estado) {
      cambios.estado = {
        antes: existingCurso.estado,
        despues: body. estado,
      };
    }
    if (body.titulo && body.titulo !== existingCurso.titulo) {
      cambios.titulo = {
        antes: existingCurso.titulo,
        despues: body. titulo,
      };
    }

    // Actualizar curso
    const updatedCurso = await prisma.curso.update({
      where: { id },
      data: {
        ...body,
        fechaInicio: body.fechaInicio ? new Date(body. fechaInicio) : undefined,
        fechaFin: body.fechaFin ? new Date(body.fechaFin) : undefined,
        duracionHoras: body.duracionHoras ? Number(body.duracionHoras) : undefined,
        precio: body.precio !== undefined ? Number(body.precio) : undefined,
        cupoMaximo: body.cupoMaximo !== undefined ? Number(body.cupoMaximo) : undefined,
        certificado: body.certificado !== undefined ? Boolean(body.certificado) : undefined,
      },
    });

    // ✅ REGISTRAR EN AUDIT LOG
    await logAudit({
      action: 'CURSO_UPDATE',
      userId: user.id,
      entity: 'Curso',
      entityId: updatedCurso.id,
      details: {
        titulo: updatedCurso.titulo,
        cambios,
      },
      ipAddress: getClientIP(request.headers),
      userAgent: getUserAgent(request. headers),
      success: true,
    });

    // ✅ REVALIDAR CACHE
    revalidatePath('/cursos');
    revalidatePath(`/cursos/${updatedCurso. slug}`);
    revalidatePath('/admin/cursos');

    console.log('✅ Curso actualizado:', updatedCurso. titulo);
    return NextResponse.json({ curso: updatedCurso });
  } catch (error) {
    console.error('Error updating curso:', error);

    // Log de error
    const token = request. cookies.get('auth-token')?.value;
    const user = token ? await getUserFromToken(token) : null;

    if (user) {
      const { id } = await params;
      await logAudit({
        action: 'CURSO_UPDATE',
        userId: user.id,
        entity: 'Curso',
        entityId: id,
        details: { error: String(error) },
        ipAddress: getClientIP(request. headers),
        userAgent: getUserAgent(request.headers),
        success: false,
        errorMessage: String(error),
      });
    }

    return NextResponse.json(
      { error: 'Error al actualizar curso' },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Eliminar curso
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;

    // Verificar autenticación
    const token = request.cookies.get('auth-token')?. value;
    
    if (! token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const user = await getUserFromToken(token);

    if (!user || !['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    // Verificar que el curso existe
    const existingCurso = await prisma.curso. findUnique({
      where: { id },
    });

    if (!existingCurso) {
      return NextResponse.json(
        { error: 'Curso no encontrado' },
        { status: 404 }
      );
    }

    // Eliminar curso
    await prisma.curso.delete({
      where: { id },
    });

    // ✅ REGISTRAR EN AUDIT LOG
    await logAudit({
      action: 'CURSO_DELETE',
      userId: user.id,
      entity: 'Curso',
      entityId: existingCurso.id,
      details: {
        titulo: existingCurso.titulo,
        slug: existingCurso.slug,
        estado: existingCurso.estado,
      },
      ipAddress: getClientIP(request.headers),
      userAgent: getUserAgent(request.headers),
      success: true,
    });

    // ✅ REVALIDAR CACHE
    revalidatePath('/cursos');
    revalidatePath(`/cursos/${existingCurso.slug}`);
    revalidatePath('/admin/cursos');

    console.log('Curso eliminado exitosamente:', existingCurso.titulo);
    return NextResponse.json({ 
      message: 'Curso eliminado exitosamente',
      curso: existingCurso
    });
  } catch (error) {
    console.error('Error deleting curso:', error);

    // Log de error
    const token = request.cookies.get('auth-token')?.value;
    const user = token ? await getUserFromToken(token) : null;

    if (user) {
      const { id } = await params;
      await logAudit({
        action: 'CURSO_DELETE',
        userId: user. id,
        entity: 'Curso',
        entityId: id,
        details: { error: String(error) },
        ipAddress: getClientIP(request.headers),
        userAgent: getUserAgent(request.headers),
        success: false,
        errorMessage: String(error),
      });
    }

    return NextResponse.json(
      { error: 'Error al eliminar curso' },
      { status: 500 }
    );
  }
}