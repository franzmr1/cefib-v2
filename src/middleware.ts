import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './lib/auth';

const PROTECTED_ROUTES = ['/admin'];
const AUTH_ROUTES = ['/login'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies. get('auth-token')?.value;

  // Verificar si la ruta es protegida
  const isProtectedRoute = PROTECTED_ROUTES.some(route =>
    pathname.startsWith(route)
  );

  const isAuthRoute = AUTH_ROUTES.some(route =>
    pathname.startsWith(route)
  );

  // Si es ruta protegida
  if (isProtectedRoute) {
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl. searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    const payload = await verifyToken(token);

    if (!payload) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('auth-token');
      return response;
    }

    // ✅ CORREGIDO: Verificar que sea ADMIN o SUPER_ADMIN
    if (! ['ADMIN', 'SUPER_ADMIN'].includes(payload.role)) {
      return NextResponse. redirect(new URL('/unauthorized', request.url));
    }
  }

  // Si ya está autenticado y trata de ir a login
  if (isAuthRoute && token) {
    const payload = await verifyToken(token);
    if (payload) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/login',
  ],
};