/**
 * Página: Editar Curso (ADMIN)
 * Version: v1.0
 */

import { notFound, redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getUserFromToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import CursoForm from '@/components/admin/cursos/CursoForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

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

async function getCurso(id: string) {
  try {
    const curso = await prisma.curso.findUnique({
      where: { id },
    });
    return curso;
  } catch (error) {
    console.error('Error fetching curso:', error);
    return null;
  }
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarCursoPage({ params }: PageProps) {
  const user = await verificarAuth();
  const { id } = await params;
  const curso = await getCurso(id);

  if (!curso) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/cursos"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Editar Curso</h1>
          <p className="text-gray-600 mt-1">{curso.titulo}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <CursoForm userId={user.id} cursoData={curso} />
      </div>
    </div>
  );
}