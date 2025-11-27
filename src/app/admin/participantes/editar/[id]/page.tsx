/**
 * Página: Editar Participante
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
import ParticipanteForm from '@/components/admin/participantes/ParticipanteForm';

async function verificarAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  if (!token) {
    redirect('/login');
  }

  const user = await getUserFromToken(token);

  if (!user || ! ['ADMIN', 'SUPER_ADMIN'].includes(user. role)) {
    redirect('/login');
  }

  return user;
}

async function getParticipante(id: string) {
  try {
    const participante = await prisma.participante.findUnique({
      where: { id },
      include: {
        inscripciones: {
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
    return participante;
  } catch (error) {
    console.error('Error fetching participante:', error);
    return null;
  }
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarParticipantePage({ params }: PageProps) {
  await verificarAuth();
  const { id } = await params;
  const participante = await getParticipante(id);

  if (!participante) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/participantes"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Editar Participante</h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">
            {participante.nombres} {participante.apellidos}
          </p>
        </div>
      </div>

      {/* Información de Inscripciones */}
      {participante.inscripciones.length > 0 && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h3 className="font-semibold text-purple-900 mb-2">
            Inscripciones ({participante.inscripciones. length})
          </h3>
          <div className="space-y-1">
            {participante.inscripciones.map((inscripcion) => (
              <div key={inscripcion.id} className="text-sm text-purple-800">
                • {inscripcion.curso. titulo}
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${
                  inscripcion. estadoPago === 'PAGADO' 
                    ? 'bg-green-100 text-green-800' 
                    : inscripcion.estadoPago === 'PENDIENTE'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {inscripcion.estadoPago}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Formulario */}
      <ParticipanteForm participanteData={participante} />
    </div>
  );
}