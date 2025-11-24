/**
 * API Route: Login de Usuario
 * Version: v2.0
 * Autor: Franz
 * Descripción: Maneja la autenticación de usuarios y generación de JWT tokens
 */

import { NextRequest, NextResponse } from 'next/server';
import { authenticate, createToken } from '@/lib/auth';
import { loginSchema } from '@/lib/validators/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar datos de entrada con Zod
    const validation = loginSchema.safeParse(body);
    
    if (!validation.success) {
      // FIX v2: Zod v4 usa .issues en lugar de .errors
      const firstError = validation.error.issues[0];
      
      return NextResponse.json(
        { error: firstError.message },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    // Autenticar usuario contra la base de datos
    const user = await authenticate(email, password);

    if (!user) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Generar JWT token
    const token = await createToken(user);

    // Crear respuesta exitosa
    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: user.userId,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    );

    // Setear cookie httpOnly para seguridad
    // httpOnly: No accesible desde JavaScript del cliente
    // secure: Solo HTTPS en producción
    // sameSite: Protección contra CSRF
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 horas en segundos
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Error en el servidor' },
      { status: 500 }
    );
  }
}