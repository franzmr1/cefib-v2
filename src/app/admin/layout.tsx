/**
 * Layout: Admin Dashboard
 * Version: v2.1 - ROLES CORREGIDOS
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-25
 * Descripción: Layout para panel de administración - Soporta ADMIN y SUPER_ADMIN
 */

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getUserFromToken } from '@/lib/auth';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

/**
 * Verificar autenticación del usuario
 */
async function verificarAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?. value;

  if (!token) {
    redirect('/login');
  }

  const user = await getUserFromToken(token);

  // ✅ CORREGIDO: Permitir ADMIN y SUPER_ADMIN
  if (!user || !['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
    redirect('/login');
  }

  return user;
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await verificarAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar fijo a la izquierda */}
      <AdminSidebar user={user} />

      {/* Contenido principal con margen correcto para el sidebar */}
      <div className="lg:ml-64 min-h-screen">
        {/* Header superior */}
        <AdminHeader user={user} />

        {/* Área de contenido principal */}
        <main className="p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}