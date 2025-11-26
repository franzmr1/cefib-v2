/**
 * Página: Crear Nuevo Curso
 * Version: v1.1 - Roles corregidos
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-26
 * Descripción: Formulario para crear un nuevo curso
 */

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getUserFromToken } from '@/lib/auth';
import CursoForm from '@/components/admin/cursos/CursoForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

async function verificarAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?. value;

  if (!token) {
    redirect('/login');
  }

  const user = await getUserFromToken(token);

  // ✅ CORREGIDO: Permitir ADMIN y SUPER_ADMIN
  if (! user || !['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
    redirect('/login');
  }

  return user;
}

export default async function NuevoCursoPage() {
  const user = await verificarAuth();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/cursos"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Crear Nuevo Curso</h1>
          <p className="text-gray-600 mt-1">
            Completa la información del nuevo programa de formación
          </p>
        </div>
      </div>

      {/* Formulario */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <CursoForm userId={user.id} />
      </div>
    </div>
  );
}