/**
 * Componente: AdminHeader
 * Version: v2.0 - TAILWIND V4 COMPLIANT
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-25
 * Descripción: Header del panel admin - Sintaxis v4 + Sticky correcto
 */

'use client';

import { usePathname } from 'next/navigation';
import { Bell, Search } from 'lucide-react';

interface AdminHeaderProps {
  user: {
    id: string;
    name: string | null;
    email: string;
    role: string;
  };
}

/**
 * Genera breadcrumbs desde la ruta actual
 */
function getBreadcrumbs(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  
  const breadcrumbs = segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/');
    const label = segment.charAt(0).toUpperCase() + segment.slice(1);
    return { label, href };
  });

  return breadcrumbs;
}

export default function AdminHeader({ user }: AdminHeaderProps) {
  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 h-16 shadow-sm">
      <div className="h-full px-4 md:px-6 flex items-center justify-between">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.href} className="flex items-center gap-2">
              {index > 0 && <span className="text-gray-400">/</span>}
              <span
                className={
                  index === breadcrumbs.length - 1
                    ? 'text-gray-900 font-semibold'
                    : 'text-gray-600'
                }
              >
                {crumb.label}
              </span>
            </div>
          ))}
        </div>

        {/* Acciones del header */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Buscador */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="search"
              placeholder="Buscar..."
              className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Notificaciones */}
          <button
            className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Notificaciones"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Avatar del usuario */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
              {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}