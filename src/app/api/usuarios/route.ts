/**
 * API Route: /api/usuarios
 * Métodos: GET (listar), POST (crear)
 * Versión: 1.0
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-25
 * Seguridad: 
 * - Autenticación JWT requerida
 * - Solo usuarios ADMIN y SUPER_ADMIN
 * - Sanitización de inputs
 * - Rate limiting (implementar en producción)
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { createUserSchema } from '@/lib/validations/user.validation';
import { getUserFromToken } from '@/lib/auth';
import { auditLog } from '@/lib/audit-helper';

/**
 * GET /api/usuarios
 * Lista todos los usuarios administradores
 * 
 * Seguridad:
 * - Requiere token válido
 * - Excluye contraseñas de la respuesta
 * - Solo muestra ADMIN y SUPER_ADMIN
 */
export async function GET(request: NextRequest) {
  try {
    // 1. Verificar autenticación
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { 
          success: false,
          error: 'No autorizado - Token no encontrado' 
        },
        { status: 401 }
      );
    }

    // 2. Obtener usuario actual
    const currentUser = await getUserFromToken(token);
    
    if (!currentUser) {
      return NextResponse.json(
        { 
          success: false,
          error: 'No autorizado - Token inválido' 
        },
        { status: 401 }
      );
    }

    // 3. Verificar permisos (solo ADMIN y SUPER_ADMIN)
    if (!['ADMIN', 'SUPER_ADMIN'].includes(currentUser. role)) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Acceso denegado - Permisos insuficientes' 
        },
        { status: 403 }
      );
    }

    // 4. Obtener usuarios administradores (sin contraseñas)
    const usuarios = await prisma.user.findMany({
      where: {
        role: {
          in: ['ADMIN', 'SUPER_ADMIN'],
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        apellidos: true,
        role: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            cursosCreados: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      usuarios,
      total: usuarios.length,
    });

  } catch (error) {
    console.error('[USUARIOS_GET] Error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Error interno del servidor' 
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/usuarios
 * Crea un nuevo usuario administrador
 * 
 * Seguridad:
 * - SOLO SUPER_ADMIN puede crear usuarios
 * - Validación estricta con Zod
 * - Hash bcrypt (12 rounds)
 * - Verificación de email único
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Verificar autenticación
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { 
          success: false,
          error: 'No autorizado - Token no encontrado' 
        },
        { status: 401 }
      );
    }

    // 2. Obtener usuario actual
    const currentUser = await getUserFromToken(token);
    
    if (!currentUser) {
      return NextResponse.json(
        { 
          success: false,
          error: 'No autorizado - Token inválido' 
        },
        { status: 401 }
      );
    }

    // 3. ⚠️ IMPORTANTE: Solo SUPER_ADMIN puede crear usuarios
    if (currentUser.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { 
          success: false,
          error: 'Acceso denegado - Solo SUPER_ADMIN puede crear usuarios administradores' 
        },
        { status: 403 }
      );
    }

    // 4. Parsear y validar datos con Zod
    const body = await request.json();
    const validatedData = createUserSchema.parse(body);

    // 5. Verificar email único
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData. email },
      select: { id: true },
    });

    if (existingUser) {
      return NextResponse.json(
        { 
          success: false,
          error: 'El email ya está registrado',
          field: 'email' 
        },
        { status: 400 }
      );
    }

    // 6. Hash de contraseña (bcrypt 12 rounds)
    const hashedPassword = await hashPassword(validatedData.password);

    // 7. Crear usuario en la base de datos
    const newUser = await prisma.user. create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        name: validatedData.name,
        apellidos: validatedData.apellidos,
        role: validatedData.role,
      },
      select: {
        id: true,
        email: true,
        name: true,
        apellidos: true,
        role: true,
        createdAt: true,
      },
    });

    // 8. Log de auditoría
    await auditLog({
  request,
  action: 'USER_CREATE',
  entity:  'User',
  entityId: newUser.id,
  details: {
    email: newUser.email,
    role: newUser.role,
    name: newUser.name,
  },
});

    return NextResponse.json(
      {
        success: true,
        message: 'Usuario creado exitosamente',
        usuario: newUser,
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('[USUARIOS_POST] Error:', error);

    // Manejo de errores de validación Zod
    if (error. name === 'ZodError') {
      return NextResponse.json(
        {
          success: false,
          error: 'Datos inválidos',
          details: error.errors.map((e: any) => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }

    // Error genérico
    return NextResponse. json(
      { 
        success: false,
        error: 'Error al crear usuario' 
      },
      { status: 500 }
    );
  }
}