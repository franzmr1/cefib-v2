/**
 * API Route: /api/cursos
 * Version: v2. 1 - Filtro ACTIVO por defecto
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-12-03
 * Descripción: GET (listar) y POST (crear) cursos
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logAudit, getClientIP, getUserAgent } from '@/lib/audit-logger';
import { getUserFromToken } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

/**
 * GET - Listar cursos activos (por defecto)
 */
export async function GET(request: NextRequest) {
  try {
    // Obtener parámetros de búsqueda
    const { searchParams } = new URL(request.url);
    const estadoParam = searchParams.get('estado');

    // ✅ Por defecto solo mostrar ACTIVOS
    const where: any = {
      estado: estadoParam || 'ACTIVO',
    };

    // Obtener cursos
    const cursos = await prisma.curso.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      cursos,
    });

  } catch (error) {
    console.error('[CURSOS_GET] Error:', error);
    return NextResponse. json(
      { success: false, error: 'Error al obtener cursos' },
      { status: 500 }
    );
  }
}

/**
 * POST - Crear nuevo curso
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const user = await getUserFromToken(token);

    if (!user || !['ADMIN', 'SUPER_ADMIN'].includes(user. role)) {
      return NextResponse. json({ error: 'No autorizado' }, { status: 403 });
    }

    const body = await request.json();

    const {
      titulo,
      slug,
      descripcionBreve,
      descripcion,
      imagenUrl,
      fechaInicio,
      fechaFin,
      duracionHoras,
      modalidad,
      certificado,
      precio,
      cupoMaximo,
      estado,
      creadorId,
    } = body;

    // Validaciones básicas
    if (!titulo || ! slug || !duracionHoras || !modalidad || !creadorId) {
      await logAudit({
        action: 'CURSO_CREATE',
        userId: user.id,
        entity: 'Curso',
        entityId: null,
        details: { error: 'Faltan campos requeridos', body },
        ipAddress: getClientIP(request. headers),
        userAgent: getUserAgent(request. headers),
        success: false,
        errorMessage: 'Faltan campos requeridos',
      });

      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    // Verificar que el slug no exista
    const existingCurso = await prisma.curso. findUnique({
      where: { slug },
    });

    if (existingCurso) {
      await logAudit({
        action: 'CURSO_CREATE',
        userId: user.id,
        entity: 'Curso',
        entityId: null,
        details: { error: 'Slug duplicado', slug },
        ipAddress: getClientIP(request.headers),
        userAgent: getUserAgent(request. headers),
        success: false,
        errorMessage: 'El slug ya existe',
      });

      return NextResponse.json(
        { error: 'El slug ya existe.  Por favor usa otro.' },
        { status: 400 }
      );
    }

    // Crear curso
    const curso = await prisma.curso.create({
      data: {
        titulo,
        slug,
        descripcionBreve: descripcionBreve || null,
        descripcion: descripcion || null,
        imagenUrl: imagenUrl || null,
        fechaInicio: fechaInicio ?   new Date(fechaInicio) : null,
        fechaFin: fechaFin ? new Date(fechaFin) : null,
        duracionHoras: Number(duracionHoras),
        modalidad,
        certificado: Boolean(certificado),
        precio: precio ?   Number(precio) : null,
        cupoMaximo: cupoMaximo ?  Number(cupoMaximo) : null,
        estado: estado || 'BORRADOR',
        creadorId,
      },
    });

    // ✅ REGISTRAR EN AUDIT LOG
    await logAudit({
      action: 'CURSO_CREATE',
      userId: user.id,
      entity: 'Curso',
      entityId: curso.id,
      details: {
        titulo: curso.titulo,
        slug: curso.slug,
        estado: curso.estado,
        modalidad: curso.modalidad,
      },
      ipAddress: getClientIP(request.headers),
      userAgent: getUserAgent(request. headers),
      success: true,
    });

    // ✅ REVALIDAR CACHE si está ACTIVO
    if (curso.estado === 'ACTIVO') {
      revalidatePath('/cursos');
      revalidatePath(`/cursos/${curso.slug}`);
    }
    revalidatePath('/admin/cursos');

    console.log('✅ Curso creado:', curso. titulo);
    return NextResponse.json({ curso }, { status: 201 });
  } catch (error) {
    console.error('Error creating curso:', error);

    // Log de error
    const token = request.cookies.get('auth-token')?.value;
    const user = token ? await getUserFromToken(token) : null;

    if (user) {
      await logAudit({
        action: 'CURSO_CREATE',
        userId: user.id,
        entity: 'Curso',
        entityId: null,
        details: { error: String(error) },
        ipAddress: getClientIP(request.headers),
        userAgent: getUserAgent(request. headers),
        success: false,
        errorMessage: String(error),
      });
    }

    return NextResponse.json(
      { error: 'Error al crear curso' },
      { status: 500 }
    );
  }
}