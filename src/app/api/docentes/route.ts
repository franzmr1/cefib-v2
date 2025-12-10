/**
 * API Route: /api/docentes
 * Métodos: GET, POST
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-26
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth';
import { docenteSchema } from '@/lib/validations/docente.validation';
import { ZodError } from 'zod';
import { auditLog } from '@/lib/audit-helper';

/**
 * GET: Obtener todos los docentes
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

    // Construir filtros
    const where: any = {};
    
    if (estado) {
      where.estado = estado;
    }
    
    if (search) {
      where.OR = [
        { nombres: { contains: search, mode: 'insensitive' } },
        { apellidos: { contains: search, mode: 'insensitive' } },
        { numeroDocumento: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Obtener docentes con sus cursos asignados
    const docentes = await prisma.docente.findMany({
      where,
      include: {
        cursosAsignados: {
          where: {
            estado: 'ACTIVO',
          },
          include: {
            curso: {
              select: {
                id: true,
                titulo: true,
                estado: true,
              },
            },
          },
        },
        _count: {
          select: {
            cursosAsignados: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      docentes,
      total: docentes.length,
    });

  } catch (error) {
    console.error('[DOCENTES_GET] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener docentes' },
      { status: 500 }
    );
  }
}

/**
 * POST: Crear nuevo docente
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
    const validatedData = docenteSchema.parse(body);

    // Verificar si el documento ya existe
    const existingDocente = await prisma. docente.findUnique({
      where: { numeroDocumento: validatedData. numeroDocumento },
    });

    if (existingDocente) {
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
    const existingEmail = await prisma.docente. findUnique({
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

    // Crear docente
    const docente = await prisma.docente.create({
      data: validatedData,
    });
    // ✅ AGREGAR auditoría
    await auditLog({
      request,
      action: 'DOCENTE_CREATE',
      entity:  'Docente',
      entityId: docente.id,
      details: {
        nombres: docente.nombres,
        apellidos: docente.apellidos,
        email: docente.email,
      },
    });
    return NextResponse.json({
      success: true,
      docente,
      message: 'Docente creado exitosamente',
    }, { status: 201 });

  } catch (error) {
    // ✅ CORREGIDO: Manejo de errores Zod
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

    console.error('[DOCENTES_POST] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Error al crear docente' },
      { status: 500 }
    );
  }
}