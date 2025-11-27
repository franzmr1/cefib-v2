/**
 * API Route: /api/cursos
 * Version: v1.0
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-19
 * Descripción: GET (listar) y POST (crear) cursos
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET - Listar cursos activos
 */
export async function GET(request: NextRequest) {
  try {
    // Obtener parámetros de búsqueda
    const { searchParams } = new URL(request.url);
    const estado = searchParams.get('estado');

    // Construir filtros
    const where: any = {};
    
    if (estado) {
      where.estado = estado;
    }

    // Obtener cursos (SIN select, devuelve todos los campos)
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
    return NextResponse.json(
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
    if (!titulo || !slug || !duracionHoras || !modalidad || !creadorId) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    // Verificar que el slug no exista
    const existingCurso = await prisma.curso.findUnique({
      where: { slug },
    });

    if (existingCurso) {
      return NextResponse.json(
        { error: 'El slug ya existe. Por favor usa otro.' },
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
        fechaInicio: fechaInicio ? new Date(fechaInicio) : null,
        fechaFin: fechaFin ? new Date(fechaFin) : null,
        duracionHoras: Number(duracionHoras),
        modalidad,
        certificado: Boolean(certificado),
        precio: precio ? Number(precio) : null,
        cupoMaximo: cupoMaximo ? Number(cupoMaximo) : null,
        estado: estado || 'BORRADOR',
        creadorId,
      },
    });

    return NextResponse.json({ curso }, { status: 201 });
  } catch (error) {
    console.error('Error creating curso:', error);
    return NextResponse.json(
      { error: 'Error al crear curso' },
      { status: 500 }
    );
  }
}