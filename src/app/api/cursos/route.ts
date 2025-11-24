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
    const cursos = await prisma.curso.findMany({
      where: { estado: 'ACTIVO' },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        titulo: true,
        slug: true,
        descripcionBreve: true,
        imagenUrl: true,
        fechaInicio: true,
        duracionHoras: true,
        modalidad: true,
        certificado: true,
        precio: true,
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