/**
 * API: Solicitudes de Programas Personalizados
 * Versión: 1.0
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-26
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth'; // ✅ TU función existente
import { solicitudCreateSchema } from '@/lib/validations/solicitud';

// Simple rate limiter en memoria
const requestCounts = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string, maxRequests: number = 3): boolean {
  const now = Date.now();
  const hourInMs = 60 * 60 * 1000;
  
  const record = requestCounts.get(ip);
  
  if (!record || now > record.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + hourInMs });
    return true;
  }
  
  if (record.count >= maxRequests) {
    return false;
  }
  
  record. count++;
  return true;
}

/**
 * POST /api/solicitudes
 * Crear nueva solicitud (PÚBLICO - sin autenticación)
 */
export async function POST(request: NextRequest) {
  try {
    // SEGURIDAD: Rate limiting por IP
    const ip = request.headers.get('x-forwarded-for') ?? 
           request.headers.get('x-real-ip') ?? 
           'unknown';
    
    if (!checkRateLimit(ip)) {
      return NextResponse. json(
        { 
          error: 'Demasiadas solicitudes.  Por favor, intente más tarde.',
          details: 'Máximo 3 solicitudes por hora'
        },
        { status: 429 }
      );
    }

    // Obtener y validar datos
    const body = await request. json();
    const validationResult = solicitudCreateSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse. json(
        {
          error: 'Datos inválidos',
          details: validationResult.error.flatten(). fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Sanitización y preparación de datos
    const sanitizedData = {
      nombres: data.nombres.trim(),
      email: data.email.trim(). toLowerCase(),
      telefono: data.telefono?.trim() || null,
      empresa: data.empresa?.trim() || null,
      cargo: data.cargo?.trim() || null,
      servicioInteres: data.servicioInteres,
      tipoPrograma: data.tipoPrograma,
      numParticipantes: data.numParticipantes || null,
      mensaje: data.mensaje.trim(),
      comoNosConociste: data.comoNosConociste?. trim() || null,
      aceptoTerminos: data.aceptoTerminos,
      // Metadata de seguridad
      ip,
      userAgent: request.headers.get('user-agent') || null,
      origen: request.headers.get('referer') || null,
    };

    // Crear solicitud en BD
    const solicitud = await prisma.solicitud.create({
      data: sanitizedData,
      select: {
        id: true,
        folio: true,
        nombres: true,
        email: true,
        servicioInteres: true,
        createdAt: true,
      },
    });

    // Log de auditoría
    console.log(`[SOLICITUD_CREADA] Folio: ${solicitud.folio}, Email: ${solicitud.email}`);

    return NextResponse.json(
      {
        success: true,
        message: 'Solicitud enviada exitosamente',
        data: {
          folio: solicitud.folio,
          nombres: solicitud.nombres,
        },
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('[SOLICITUDES_POST] Error:', error);
    
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/solicitudes
 * Listar solicitudes (SOLO ADMIN)
 * Query params:
 *   - onlyCount=true : Retorna solo el contador (optimizado)
 *   - estado, servicio, prioridad, search : Filtros
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const onlyCount = searchParams.get('onlyCount') === 'true';

    // SEGURIDAD: Verificar autenticación
    const token = request.cookies. get('auth-token')?.value;
    
    if (!token) {
      return NextResponse. json(
        onlyCount 
          ? { success: true, count: 0 } 
          : { success: false, error: 'No autorizado' },
        { status: onlyCount ? 200 : 401 }
      );
    }

    const currentUser = await getUserFromToken(token);
    
    if (!currentUser || ! ['ADMIN', 'SUPER_ADMIN'].includes(currentUser.role)) {
      return NextResponse.json(
        onlyCount 
          ? { success: true, count: 0 } 
          : { success: false, error: 'Acceso denegado' },
        { status: onlyCount ? 200 : 403 }
      );
    }

    // ✅ OPTIMIZACIÓN: Si solo piden contador
    if (onlyCount) {
      const count = await prisma.solicitud.count({
        where: { estado: 'NUEVO' },
      });

      return NextResponse.json({ 
        success: true,
        count 
      });
    }

    // ✅ FLUJO NORMAL: Listar todas las solicitudes con filtros
    const estado = searchParams.get('estado');
    const servicio = searchParams.get('servicio');
    const prioridad = searchParams. get('prioridad');
    const search = searchParams.get('search');

    // Construir filtros
    const where: any = {};

    if (estado) where.estado = estado;
    if (servicio) where.servicioInteres = servicio;
    if (prioridad) where.prioridad = prioridad;
    
    if (search) {
      where. OR = [
        { nombres: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { empresa: { contains: search, mode: 'insensitive' } },
        { folio: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Obtener solicitudes
    const solicitudes = await prisma.solicitud. findMany({
      where,
      include: {
        asignadoUsuario: {
          select: {
            id: true,
            name: true,
            apellidos: true,
            email: true,
          },
        },
      },
      orderBy: [
        { prioridad: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    // Estadísticas
    const stats = {
      total: solicitudes.length,
      nuevo: solicitudes.filter(s => s.estado === 'NUEVO').length,
      enRevision: solicitudes.filter(s => s.estado === 'EN_REVISION').length,
      contactado: solicitudes.filter(s => s.estado === 'CONTACTADO').length,
      cerrado: solicitudes.filter(s => s.estado. startsWith('CERRADO')). length,
    };

    return NextResponse.json({
      success: true,
      solicitudes,
      stats,
      total: solicitudes.length,
    });

  } catch (error: any) {
    console.error('[SOLICITUDES_GET] Error:', error);
    
    return NextResponse.json(
      { success: false, error: 'Error al obtener solicitudes' },
      { status: 500 }
    );
  }
}