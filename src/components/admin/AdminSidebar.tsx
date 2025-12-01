/**
 * Componente: AdminSidebar
 * Version: v2.3 - OPTIMIZADO sin polling
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-26
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Settings, 
  FileText, 
  LogOut, 
  Menu, 
  X,
  GraduationCap,
  UserCheck,
  ClipboardList,
  Inbox
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

interface MenuItem {
  label: string;
  href: string;
  icon: any;
  badge?: number;
  badgeColor?: string;
}

const BASE_MENU_ITEMS: MenuItem[] = [
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
    label: 'Docentes',
    href: '/admin/docentes',
    icon: GraduationCap,
  },
  {
    label: 'Participantes',
    href: '/admin/participantes',
    icon: UserCheck,
  },
  {
    label: 'Inscripciones',
    href: '/admin/inscripciones',
    icon: ClipboardList,
  },
  {
    label: 'Solicitudes',
    href: '/admin/solicitudes',
    icon: Inbox,
    badge: 0,
    badgeColor: 'bg-blue-500',
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

// Cache key para localStorage
const CACHE_KEY = 'solicitudes_nuevas_count';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [menuItems, setMenuItems] = useState(BASE_MENU_ITEMS);

  /**
   * Obtener contador de solicitudes (CON CACHE)
   */
  const fetchSolicitudesCount = async (forceRefresh = false) => {
    try {
      // Verificar cache primero
      if (! forceRefresh) {
        const cached = localStorage. getItem(CACHE_KEY);
        if (cached) {
          const { count, timestamp } = JSON.parse(cached);
          const age = Date.now() - timestamp;
          
          // Si el cache tiene menos de 5 minutos, usarlo
          if (age < CACHE_DURATION) {
            updateBadge(count);
            return;
          }
        }
      }

      // Hacer query optimizada (solo cuenta)
      const response = await fetch('/api/solicitudes? onlyCount=true');
      if (response.ok) {
        const data = await response.json();
        const count = data.count || 0;

        // Guardar en cache
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          count,
          timestamp: Date.now(),
        }));

        updateBadge(count);
      }
    } catch (error) {
      console.error('Error al obtener contador:', error);
    }
  };

  /**
   * Actualizar badge en el menú
   */
  const updateBadge = (count: number) => {
    setMenuItems(prevItems =>
      prevItems.map(item => {
        if (item.href === '/admin/solicitudes') {
          return { ...item, badge: count };
        }
        return item;
      })
    );
  };

  /**
   * Cargar contador SOLO al montar el componente
   */
  useEffect(() => {
    fetchSolicitudesCount();
  }, []); // ✅ Solo una vez al cargar

  /**
   * Actualizar contador cuando el usuario VUELVE de /admin/solicitudes
   */
  useEffect(() => {
    // Si el usuario sale de la página de solicitudes, refrescar contador
    if (pathname !== '/admin/solicitudes') {
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          fetchSolicitudesCount(true); // Force refresh
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);
      return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }
  }, [pathname]);

  /**
   * Listener para eventos personalizados (cuando se actualiza una solicitud)
   */
  useEffect(() => {
    const handleSolicitudUpdate = () => {
      // Forzar actualización del contador
      fetchSolicitudesCount(true);
    };

    window. addEventListener('solicitudUpdated', handleSolicitudUpdate);
    return () => window.removeEventListener('solicitudUpdated', handleSolicitudUpdate);
  }, []);

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

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
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
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
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 animate-fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 w-64 h-screen 
          bg-white border-r border-gray-200 shadow-lg
          transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
          flex flex-col
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-gray-200 bg-gradient-to-r from-red-500 to-pink-500 shrink-0">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="text-2xl font-bold text-white">
              {SITE_CONFIG.name}
            </div>
          </Link>
        </div>

        {/* Navegación */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item. href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg
                    transition-all duration-200 relative
                    ${
                      active
                        ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span className="font-medium flex-1">{item.label}</span>
                  
                  {/* Badge */}
                  {item.badge !== undefined && item.badge > 0 && (
                    <span 
                      className={`
                        px-2 py-0.5 text-xs font-bold rounded-full
                        ${active 
                          ? 'bg-white text-red-500 shadow-sm' 
                          : `${item.badgeColor || 'bg-blue-500'} text-white`
                        }
                      `}
                    >
                      {item. badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Usuario y logout */}
        <div className="border-t border-gray-200 p-4 bg-white shrink-0">
          <div className="mb-3 px-4">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {user.name || 'Usuario'}
            </p>
            <p className="text-xs text-gray-600 truncate">{user.email}</p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span className="font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
}