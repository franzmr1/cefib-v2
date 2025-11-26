/**
 * API Route: /api/usuarios/[id]
 * Métodos: GET, PUT, DELETE
 * Versión: 1.1 - Solo SUPER_ADMIN puede editar/eliminar
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-25
 * Seguridad:
 * - GET: ADMIN y SUPER_ADMIN pueden ver
 * - PUT: Solo SUPER_ADMIN puede editar
 * - DELETE: Solo SUPER_ADMIN puede eliminar
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { updateUserSchema } from '@/lib/validations/user.validation';
import { getUserFromToken } from '@/lib/auth';

/**
 * GET /api/usuarios/[id]
 * Obtiene un usuario por ID
 * Permisos: ADMIN y SUPER_ADMIN
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Verificar autenticación
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    const currentUser = await getUserFromToken(token);
    
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: 'Token inválido' },
        { status: 401 }
      );
    }

    // 2. Verificar que sea ADMIN o SUPER_ADMIN
    if (! ['ADMIN', 'SUPER_ADMIN'].includes(currentUser.role)) {
      return NextResponse.json(
        { success: false, error: 'Acceso denegado' },
        { status: 403 }
      );
    }

    // 3. Buscar usuario
    const usuario = await prisma.user.findUnique({
      where: { id },
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
    });

    if (!usuario) {
      return NextResponse.json(
        { success: false, error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      usuario 
    });

  } catch (error) {
    console.error('[USUARIO_GET] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener usuario' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/usuarios/[id]
 * Actualiza un usuario
 * Permisos: Solo SUPER_ADMIN
 * 
 * Seguridad:
 * - Valida email único si se actualiza
 * - Hash de nueva contraseña si se proporciona
 * - Solo SUPER_ADMIN puede cambiar roles
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Verificar autenticación
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    const currentUser = await getUserFromToken(token);
    
    if (! currentUser) {
      return NextResponse.json(
        { success: false, error: 'Token inválido' },
        { status: 401 }
      );
    }

    // 2. ⚠️ Solo SUPER_ADMIN puede editar usuarios
    if (currentUser.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { 
          success: false,
          error: 'Solo SUPER_ADMIN puede editar usuarios' 
        },
        { status: 403 }
      );
    }

    // 3.  Verificar que el usuario a editar existe
    const existingUser = await prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, role: true },
    });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // 4. Parsear y validar datos
    const body = await request.json();
    const validatedData = updateUserSchema.parse(body);

    // 5.  Verificar email único si se actualiza
    if (validatedData.email && validatedData.email !== existingUser.email) {
      const emailExists = await prisma.user. findUnique({
        where: { email: validatedData.email },
        select: { id: true },
      });

      if (emailExists) {
        return NextResponse. json(
          { 
            success: false,
            error: 'El email ya está registrado',
            field: 'email'
          },
          { status: 400 }
        );
      }
    }

    // 6.  Preparar datos para actualizar
    const updateData: any = {};

    if (validatedData.email) updateData.email = validatedData. email;
    if (validatedData.name) updateData.name = validatedData.name;
    if (validatedData.apellidos) updateData.apellidos = validatedData.apellidos;
    if (validatedData.role) updateData.role = validatedData.role;

    // 7. Hash de nueva contraseña si se proporciona
    if (validatedData.password) {
      updateData.password = await hashPassword(validatedData.password);
    }

    // 8.  Actualizar usuario
    const updatedUser = await prisma.user. update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        apellidos: true,
        role: true,
        updatedAt: true,
      },
    });

    // 9. Log de auditoría
    console.log(`[AUDIT] Usuario actualizado: ${updatedUser.email} por SUPER_ADMIN ${currentUser.email}`);

    return NextResponse. json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      usuario: updatedUser,
    });

  } catch (error: any) {
    console.error('[USUARIO_PUT] Error:', error);

    if (error.name === 'ZodError') {
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

    return NextResponse.json(
      { success: false, error: 'Error al actualizar usuario' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/usuarios/[id]
 * Elimina un usuario
 * Permisos: Solo SUPER_ADMIN
 * 
 * Seguridad:
 * - Solo SUPER_ADMIN puede eliminar
 * - No puede eliminarse a sí mismo
 * - No puede eliminar a otro SUPER_ADMIN
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Verificar autenticación
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    const currentUser = await getUserFromToken(token);
    
    if (! currentUser) {
      return NextResponse.json(
        { success: false, error: 'Token inválido' },
        { status: 401 }
      );
    }

    // 2. ⚠️ Solo SUPER_ADMIN puede eliminar usuarios
    if (currentUser.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { 
          success: false,
          error: 'Solo SUPER_ADMIN puede eliminar usuarios' 
        },
        { status: 403 }
      );
    }

    // 3.  No puede eliminarse a sí mismo
    if (currentUser.id === id) {
      return NextResponse.json(
        { 
          success: false,
          error: 'No puedes eliminar tu propia cuenta' 
        },
        { status: 400 }
      );
    }

    // 4. Verificar que el usuario existe y obtener su rol
    const userToDelete = await prisma.user. findUnique({
      where: { id },
      select: { id: true, email: true, role: true },
    });

    if (!userToDelete) {
      return NextResponse.json(
        { success: false, error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // 5. No puede eliminar a otro SUPER_ADMIN
    if (userToDelete. role === 'SUPER_ADMIN') {
      return NextResponse.json(
        { 
          success: false,
          error: 'No se puede eliminar a otro SUPER_ADMIN' 
        },
        { status: 403 }
      );
    }

    // 6. Eliminar usuario (CASCADE eliminará sus cursos creados)
    await prisma. user.delete({
      where: { id },
    });

    // 7. Log de auditoría
    console. log(`[AUDIT] Usuario eliminado: ${userToDelete.email} (${userToDelete.role}) por SUPER_ADMIN ${currentUser.email}`);

    return NextResponse.json({
      success: true,
      message: 'Usuario eliminado exitosamente',
    });

  } catch (error) {
    console.error('[USUARIO_DELETE] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Error al eliminar usuario' },
      { status: 500 }
    );
  }
}