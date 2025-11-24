/**
 * API Route: /api/cursos/[id]
 * Version: v2.0 - COMPATIBLE CON NEXT.JS 16
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-21
 * Descripción: GET, PATCH (editar), DELETE (eliminar) curso específico
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
    const { id } = await params; // ← AWAIT AQUÍ

    const curso = await prisma.curso.findUnique({
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
    const { id } = await params; // ← AWAIT AQUÍ
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
    } = body;

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

    // Si se cambia el slug, verificar que no exista otro con ese slug
    if (slug && slug !== existingCurso.slug) {
      const slugExists = await prisma.curso.findUnique({
        where: { slug },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: 'El slug ya existe. Por favor usa otro.' },
          { status: 400 }
        );
      }
    }

    // Actualizar curso
    const curso = await prisma.curso.update({
      where: { id },
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
        estado,
      },
    });

    console.log('Curso actualizado exitosamente:', curso.titulo);
    return NextResponse.json({ curso });
  } catch (error) {
    console.error('Error updating curso:', error);
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
    const { id } = await params; // ← AWAIT AQUÍ

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

    // Eliminar curso
    await prisma.curso.delete({
      where: { id },
    });

    console.log('Curso eliminado exitosamente:', existingCurso.titulo);
    return NextResponse.json({ 
      message: 'Curso eliminado exitosamente',
      curso: existingCurso
    });
  } catch (error) {
    console.error('Error deleting curso:', error);
    return NextResponse.json(
      { error: 'Error al eliminar curso' },
      { status: 500 }
    );
  }
}