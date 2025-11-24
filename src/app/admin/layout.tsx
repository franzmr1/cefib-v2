/**
 * Layout: Admin Dashboard
 * Version: v1.0
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-19
 * Descripción: Layout para panel de administración con sidebar y header
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
  const token = cookieStore.get('auth-token')?.value;

  if (!token) {
    redirect('/login');
  }

  const user = await getUserFromToken(token);

  if (!user || user.role !== 'ADMIN') {
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
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar fijo a la izquierda */}
      <AdminSidebar user={user} />

      {/* Contenido principal con margen para el sidebar */}
      <div className="lg:pl-64">
        {/* Header superior */}
        <AdminHeader user={user} />

        {/* Área de contenido principal */}
        <main className="p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}