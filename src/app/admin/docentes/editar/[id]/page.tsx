/**
 * Página: Editar Docente
 * Versión: 1.0
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-26
 */

import { notFound, redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getUserFromToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
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

async function getDocente(id: string) {
  try {
    const docente = await prisma.docente.findUnique({
      where: { id },
      include: {
        cursosAsignados: {
          include: {
            curso: {
              select: {
                id: true,
                titulo: true,
                estado: true,
              },
            },
          },
        },
      },
    });
    return docente;
  } catch (error) {
    console.error('Error fetching docente:', error);
    return null;
  }
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarDocentePage({ params }: PageProps) {
  await verificarAuth();
  const { id } = await params;
  const docente = await getDocente(id);

  if (! docente) {
    notFound();
  }

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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Editar Docente</h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">
            {docente.nombres} {docente.apellidos}
          </p>
        </div>
      </div>

      {/* Información de Cursos Asignados */}
      {docente.cursosAsignados.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">
            Cursos Asignados ({docente.cursosAsignados.length})
          </h3>
          <div className="space-y-1">
            {docente.cursosAsignados.map((asignacion) => (
              <div key={asignacion.id} className="text-sm text-blue-800">
                • {asignacion.curso.titulo} 
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${
                  asignacion.curso.estado === 'ACTIVO' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {asignacion.curso.estado}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Formulario */}
      <DocenteForm docenteData={docente} />
    </div>
  );
}