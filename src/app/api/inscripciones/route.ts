/**
 * API Route: /api/inscripciones
 * Métodos: GET, POST
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-26
 * Descripción: Gestión de inscripciones de participantes a cursos
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth';
import { inscripcionSchema } from '@/lib/validations/participante.validation';
import { ZodError } from 'zod';

/**
 * GET: Obtener todas las inscripciones
 */
export async function GET(request: NextRequest) {
  try {
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

    // Obtener filtros de la query
    const searchParams = request.nextUrl.searchParams;
    const cursoId = searchParams.get('cursoId');
    const participanteId = searchParams.get('participanteId');
    const estadoPago = searchParams.get('estadoPago');

    // Construir filtros
    const where: any = {};
    
    if (cursoId) {
      where.cursoId = cursoId;
    }
    
    if (participanteId) {
      where.participanteId = participanteId;
    }
    
    if (estadoPago) {
      where.estadoPago = estadoPago;
    }

    // Obtener inscripciones
    const inscripciones = await prisma.inscripcion.findMany({
      where,
      include: {
        participante: {
          select: {
            id: true,
            nombres: true,
            apellidos: true,
            numeroDocumento: true,
            email: true,
            celular: true,
          },
        },
        curso: {
          select: {
            id: true,
            titulo: true,
            estado: true,
            precio: true,
            cupoMaximo: true,
            cupoActual: true,
            fechaInicio: true,
            fechaFin: true,
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
    });

    return NextResponse.json({
      success: true,
      inscripciones,
      total: inscripciones.length,
    });

  } catch (error) {
    console.error('[INSCRIPCIONES_GET] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener inscripciones' },
      { status: 500 }
    );
  }
}

/**
 * POST: Crear nueva inscripción
 */
export async function POST(request: NextRequest) {
  try {
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

    // Validar datos
    const body = await request.json();
    const validatedData = inscripcionSchema.parse(body);

    // Verificar que el participante existe
    const participante = await prisma.participante. findUnique({
      where: { id: validatedData.participanteId },
    });

    if (!participante) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Participante no encontrado',
          field: 'participanteId'
        },
        { status: 404 }
      );
    }

    // Verificar que el curso existe
    const curso = await prisma.curso.findUnique({
      where: { id: validatedData.cursoId },
    });

    if (!curso) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Curso no encontrado',
          field: 'cursoId'
        },
        { status: 404 }
      );
    }

    // Verificar que el participante no esté ya inscrito
    const existingInscripcion = await prisma. inscripcion.findUnique({
      where: {
        participanteId_cursoId: {
          participanteId: validatedData. participanteId,
          cursoId: validatedData.cursoId,
        },
      },
    });

    if (existingInscripcion) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'El participante ya está inscrito en este curso',
        },
        { status: 400 }
      );
    }

    // Verificar cupo disponible
    if (curso.cupoMaximo && curso.cupoActual >= curso.cupoMaximo) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'El curso ha alcanzado el cupo máximo',
          cupoMaximo: curso.cupoMaximo,
          cupoActual: curso.cupoActual,
        },
        { status: 400 }
      );
    }

    // Generar código de inscripción
    const year = new Date().getFullYear();
    const lastInscripcion = await prisma.inscripcion.findFirst({
      where: {
        codigo: {
          startsWith: `INS-${year}-`,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    let nextNumber = 1;
    if (lastInscripcion) {
      const lastNumber = parseInt(lastInscripcion.codigo.split('-')[2]);
      nextNumber = lastNumber + 1;
    }

    const codigo = `INS-${year}-${String(nextNumber).padStart(5, '0')}`;

    // Crear inscripción y actualizar cupo en una transacción
    const inscripcion = await prisma.$transaction(async (tx) => {
      // Crear inscripción
      const newInscripcion = await tx. inscripcion.create({
        data: {
          codigo,
          participanteId: validatedData.participanteId,
          cursoId: validatedData.cursoId,
          estadoPago: validatedData.estadoPago,
          montoPagado: validatedData.montoPagado,
          fechaPago: validatedData.fechaPago ?  new Date(validatedData.fechaPago) : null,
          metodoPago: validatedData.metodoPago,
          asistio: validatedData.asistio,
          observaciones: validatedData.observaciones,
          registradoPorId: currentUser.id,
        },
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
              precio: true,
            },
          },
        },
      });

      // Actualizar cupo del curso
      await tx.curso.update({
        where: { id: validatedData.cursoId },
        data: {
          cupoActual: {
            increment: 1,
          },
        },
      });

      return newInscripcion;
    });

    return NextResponse.json({
      success: true,
      inscripcion,
      message: 'Inscripción creada exitosamente',
    }, { status: 201 });

  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Datos inválidos',
          details: error.issues. map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          }))
        },
        { status: 400 }
      );
    }

    console.error('[INSCRIPCIONES_POST] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Error al crear inscripción' },
      { status: 500 }
    );
  }
}