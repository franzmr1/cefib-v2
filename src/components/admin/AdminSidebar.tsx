/**
 * Componente: AdminSidebar
 * Version: v1.0
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-19
 * Descripción: Sidebar de navegación para panel admin
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, BookOpen, Users, Settings, 
  FileText, LogOut, Menu, X, ChevronDown
} from 'lucide-react';
import { SITE_CONFIG } from '@/constants';

interface AdminSidebarProps {
  user: {
    id: string;
    name: string | null;
    email: string;
    role: string;
  };
}

/**
 * Items del menú de navegación
 */
const MENU_ITEMS = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    label: 'Cursos',
    href: '/admin/cursos',
    icon: BookOpen,
  },
  {
    label: 'Usuarios',
    href: '/admin/usuarios',
    icon: Users,
  },
  {
    label: 'Reportes',
    href: '/admin/reportes',
    icon: FileText,
  },
  {
    label: 'Configuración',
    href: '/admin/configuracion',
    icon: Settings,
  },
];

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  /**
   * Maneja el logout del usuario
   */
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      {/* Botón menú móvil */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6 text-gray-700" />
        ) : (
          <Menu className="w-6 h-6 text-gray-700" />
        )}
      </button>

      {/* Overlay móvil */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 w-64 h-screen 
          bg-white border-r border-gray-200 
          transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* Logo y título */}
        <div className="h-16 flex items-center justify-center border-b border-gray-200 bg-linear-to-r from-red-500 to-pink-500">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="text-2xl font-bold text-white">
              {SITE_CONFIG.name}
            </div>
          </Link>
        </div>

        {/* Navegación */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {MENU_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg
                    transition-all duration-200
                    ${
                      isActive
                        ? 'bg-linear-to-r from-red-500 to-pink-500 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Usuario y logout */}
        <div className="border-t border-gray-200 p-4">
          <div className="mb-3 px-4">
            <p className="text-sm font-semibold text-gray-900">
              {user.name || 'Usuario'}
            </p>
            <p className="text-xs text-gray-600">{user.email}</p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
}