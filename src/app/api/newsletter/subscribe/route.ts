/**
 * API Route: Newsletter Subscribe
 * Version: v1.0
 * Descripción: Endpoint para guardar emails de suscriptores
 */

import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const SUBSCRIBERS_FILE = path.join(DATA_DIR, 'subscribers.json');

// Interfaz de suscriptor
interface Subscriber {
  id: string;
  email: string;
  subscribedAt: string;
  ipAddress?: string;
}

// Asegurar que existe el directorio
async function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true });
  }
}

// Leer suscriptores
async function getSubscribers(): Promise<Subscriber[]> {
  await ensureDataDir();
  
  if (!existsSync(SUBSCRIBERS_FILE)) {
    return [];
  }

  const data = await readFile(SUBSCRIBERS_FILE, 'utf-8');
  return JSON.parse(data);
}

// Guardar suscriptores
async function saveSubscribers(subscribers: Subscriber[]) {
  await ensureDataDir();
  await writeFile(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2));
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validación
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email es requerido' },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      );
    }

    // Leer suscriptores existentes
    const subscribers = await getSubscribers();

    // Verificar si ya existe
    const exists = subscribers.find(
      (sub) => sub.email.toLowerCase() === email.toLowerCase()
    );

    if (exists) {
      return NextResponse. json(
        { error: 'Este email ya está suscrito' },
        { status: 409 }
      );
    }

    // Crear nuevo suscriptor
    const newSubscriber: Subscriber = {
      id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email: email.toLowerCase(),
      subscribedAt: new Date().toISOString(),
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
    };

    // Agregar y guardar
    subscribers.push(newSubscriber);
    await saveSubscribers(subscribers);

    return NextResponse.json(
      {
        success: true,
        message: 'Suscripción exitosa',
        subscriber: {
          id: newSubscriber. id,
          email: newSubscriber.email,
          subscribedAt: newSubscriber.subscribedAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error en suscripción:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// Endpoint para obtener todos los suscriptores (solo admin)
export async function GET(request: NextRequest) {
  try {
    // TODO: Agregar autenticación aquí
    const authHeader = request.headers.get('authorization');
    
    // Protección básica (cambiar por autenticación real)
    if (authHeader !== `Bearer ${process.env.ADMIN_SECRET_KEY}`) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const subscribers = await getSubscribers();

    return NextResponse.json({
      total: subscribers.length,
      subscribers: subscribers.sort(
        (a, b) => new Date(b.subscribedAt).getTime() - new Date(a.subscribedAt).getTime()
      ),
    });
  } catch (error) {
    console.error('Error al obtener suscriptores:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}