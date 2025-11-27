/**
 * Página: Crear Docente
 * Versión: 1.0
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-26
 */

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getUserFromToken } from '@/lib/auth';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import DocenteForm from '@/components/admin/docentes/DocenteForm';

async function verificarAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  if (!token) {
    redirect('/login');
  }

  const user = await getUserFromToken(token);

  if (!user || !['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
    redirect('/login');
  }

  return user;
}

export default async function NuevoDocentePage() {
  await verificarAuth();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/docentes"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Nuevo Docente</h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">
            Registra un nuevo docente o instructor
          </p>
        </div>
      </div>

      {/* Formulario */}
      <DocenteForm />
    </div>
  );
}