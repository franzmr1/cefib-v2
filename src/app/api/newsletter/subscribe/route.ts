/**
 * API Route: Newsletter Subscribe
 * Version: v2. 0 - Migrado a Prisma
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-12-07
 * Descripción: Endpoint para suscripciones al newsletter (ahora con DB)
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logAudit, getClientIP, getUserAgent } from '@/lib/audit-logger';
import { getUserFromToken } from '@/lib/auth';

/**
 * POST - Suscribirse al newsletter
 */
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validación de email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email es requerido' },
        { status: 400 }
      );
    }

    // Validar formato
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      );
    }

    const emailNormalized = email.toLowerCase(). trim();

    // Verificar si ya existe
    const existente = await prisma.newsletter.findUnique({
      where: { email: emailNormalized },
    });

    if (existente) {
      // Si existe pero está inactivo, reactivarlo
      if (! existente.activo) {
        const reactivado = await prisma.newsletter.update({
          where: { email: emailNormalized },
          data: { 
            activo: true,
            ip: getClientIP(request. headers),
            userAgent: getUserAgent(request.headers),
            updatedAt: new Date(),
          },
        });

        await logAudit({
          action: 'NEWSLETTER_SUBSCRIBE',
          entity: 'Newsletter',
          entityId: reactivado.id,
          details: { email: reactivado.email, accion: 'reactivacion' },
          ipAddress: getClientIP(request.headers),
          userAgent: getUserAgent(request.headers),
          success: true,
        });

        return NextResponse.json({
          success: true,
          message: 'Suscripción reactivada exitosamente',
          subscriber: {
            id: reactivado.id,
            email: reactivado.email,
            subscribedAt: reactivado.createdAt,
          },
        });
      }

      return NextResponse.json(
        { error: 'Este email ya está suscrito' },
        { status: 409 }
      );
    }

    // Crear nueva suscripción
    const nuevoSuscriptor = await prisma.newsletter.create({
      data: {
        email: emailNormalized,
        ip: getClientIP(request.headers),
        userAgent: getUserAgent(request.headers),
        origen: 'website',
      },
    });

    // Registrar en audit log
    await logAudit({
      action: 'NEWSLETTER_SUBSCRIBE',
      entity: 'Newsletter',
      entityId: nuevoSuscriptor.id,
      details: { email: nuevoSuscriptor.email },
      ipAddress: getClientIP(request.headers),
      userAgent: getUserAgent(request.headers),
      success: true,
    });

    console.log('✅ Nueva suscripción:', nuevoSuscriptor.email);

    return NextResponse.json(
      {
        success: true,
        message: '¡Gracias por suscribirte!  Te mantendremos informado.',
        subscriber: {
          id: nuevoSuscriptor.id,
          email: nuevoSuscriptor.email,
          subscribedAt: nuevoSuscriptor.createdAt,
        },
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error en suscripción newsletter:', error);

    await logAudit({
      action: 'NEWSLETTER_SUBSCRIBE',
      entity: 'Newsletter',
      details: { error: String(error) },
      ipAddress: getClientIP(request.headers),
      userAgent: getUserAgent(request. headers),
      success: false,
      errorMessage: String(error),
    });

    return NextResponse.json(
      { error: 'Error al procesar suscripción' },
      { status: 500 }
    );
  }
}

/**
 * GET - Obtener suscriptores (Solo Admin)
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación con token de cookie
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const user = await getUserFromToken(token);

    if (!user || !['ADMIN', 'SUPER_ADMIN'].includes(user. role)) {
      return NextResponse.json(
        { error: 'No autorizado - Solo administradores' },
        { status: 403 }
      );
    }

    // Obtener parámetros de consulta
    const { searchParams } = new URL(request.url);
    const activo = searchParams.get('activo');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams. get('limit') || '100');

    const skip = (page - 1) * limit;

    // Filtros
    const where: any = {};
    if (activo !== null && activo !== undefined) {
      where.activo = activo === 'true';
    }

    // Obtener suscriptores
    const [subscribers, total] = await Promise. all([
      prisma.newsletter.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          activo: true,
          origen: true,
          ip: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.newsletter. count({ where }),
    ]);

    // Registrar acceso
    await logAudit({
      action: 'ADMIN_ACCESS',
      userId: user.id,
      entity: 'Newsletter',
      details: { accion: 'listar_suscriptores', total },
      ipAddress: getClientIP(request.headers),
      userAgent: getUserAgent(request.headers),
      success: true,
    });

    return NextResponse. json({
      total,
      subscribers: subscribers.map(sub => ({
        id: sub. id,
        email: sub. email,
        subscribedAt: sub.createdAt,
        activo: sub. activo,
        origen: sub.origen,
        ipAddress: sub.ip,
      })),
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });

  } catch (error) {
    console. error('Error al obtener suscriptores:', error);
    return NextResponse.json(
      { error: 'Error al obtener suscriptores' },
      { status: 500 }
    );
  }
}