/**
 * API Route: /api/participantes
 * Métodos: GET, POST
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-26
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth';
import { participanteSchema } from '@/lib/validations/participante.validation';
import { ZodError } from 'zod';

/**
 * GET: Obtener todos los participantes
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
    const estado = searchParams.get('estado');
    const search = searchParams.get('search');
    const cursoId = searchParams.get('cursoId'); // Filtrar por curso

    // Construir filtros
    const where: any = {};
    
    if (estado) {
      where. estado = estado;
    }
    
    if (search) {
      where.OR = [
        { nombres: { contains: search, mode: 'insensitive' } },
        { apellidos: { contains: search, mode: 'insensitive' } },
        { numeroDocumento: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Filtrar por curso si se especifica
    if (cursoId) {
      where.inscripciones = {
        some: {
          cursoId,
        },
      };
    }

    // Obtener participantes con sus inscripciones
    const participantes = await prisma.participante.findMany({
      where,
      include: {
        inscripciones: {
          include: {
            curso: {
              select: {
                id: true,
                titulo: true,
                estado: true,
              },
            },
          },
          orderBy: {
            fechaInscripcion: 'desc',
          },
        },
        _count: {
          select: {
            inscripciones: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      participantes,
      total: participantes.length,
    });

  } catch (error) {
    console.error('[PARTICIPANTES_GET] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener participantes' },
      { status: 500 }
    );
  }
}

/**
 * POST: Crear nuevo participante
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
    const validatedData = participanteSchema.parse(body);

    // Verificar si el documento ya existe
    const existingParticipante = await prisma.participante.findUnique({
      where: { numeroDocumento: validatedData.numeroDocumento },
    });

    if (existingParticipante) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'El número de documento ya está registrado',
          field: 'numeroDocumento'
        },
        { status: 400 }
      );
    }

    // Verificar si el email ya existe
    const existingEmail = await prisma.participante.findUnique({
      where: { email: validatedData.email },
    });

    if (existingEmail) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'El email ya está registrado',
          field: 'email'
        },
        { status: 400 }
      );
    }

    // Crear participante
    const participante = await prisma.participante.create({
      data: validatedData,
    });

    return NextResponse.json({
      success: true,
      participante,
      message: 'Participante creado exitosamente',
    }, { status: 201 });

  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Datos inválidos',
          details: error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          }))
        },
        { status: 400 }
      );
    }

    console.error('[PARTICIPANTES_POST] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Error al crear participante' },
      { status: 500 }
    );
  }
}