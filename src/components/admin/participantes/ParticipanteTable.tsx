/**
 * Componente: ParticipanteTable
 * Versión: 1.0
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-26
 * Descripción: Tabla de participantes con acciones
 */

'use client';

import { useState } from 'react';
import { Edit, Trash2, GraduationCap, UserCheck, UserX, Plus } from 'lucide-react';
import Link from 'next/link';

interface Participante {
  id: string;
  nombres: string;
  apellidos: string;
  numeroDocumento: string;
  email: string;
  celular: string;
  estado: string;
  _count: {
    inscripciones: number;
  };
  inscripciones?: any[];
}

interface ParticipanteTableProps {
  participantes: Participante[];
  onRefresh: () => void;
  currentUserRole: string | null;
  onInscribir?: (participante: Participante) => void;
}

export default function ParticipanteTable({ 
  participantes, 
  onRefresh, 
  currentUserRole,
  onInscribir 
}: ParticipanteTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const isSuperAdmin = currentUserRole === 'SUPER_ADMIN';

  const handleDelete = async (id: string, nombre: string) => {
    if (! confirm(`¿Estás seguro de eliminar al participante "${nombre}"?`)) {
      return;
    }

    setDeletingId(id);

    try {
      const response = await fetch(`/api/participantes/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Error al eliminar participante');
        return;
      }

      alert(data.message || 'Participante eliminado exitosamente');
      onRefresh();

    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar participante');
    } finally {
      setDeletingId(null);
    }
  };

  if (participantes.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No hay participantes registrados</p>
      </div>
    );
  }

  return (
    <>
      {/* Tabla Desktop */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Participante
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Documento
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contacto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Inscripciones
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {participantes.map((participante) => (
              <tr key={participante.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center text-white font-bold">
                      {participante.nombres.charAt(0)}{participante.apellidos.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {participante.nombres} {participante.apellidos}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{participante.numeroDocumento}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{participante.email}</div>
                  <div className="text-sm text-gray-500">{participante.celular}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                    <GraduationCap className="w-3 h-3" />
                    {participante._count. inscripciones}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                      participante.estado === 'ACTIVO'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {participante.estado === 'ACTIVO' ? (
                      <UserCheck className="w-3 h-3" />
                    ) : (
                      <UserX className="w-3 h-3" />
                    )}
                    {participante.estado}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    {onInscribir && (
                      <button
                        onClick={() => onInscribir(participante)}
                        className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded-lg transition-colors"
                        title="Inscribir a curso"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    )}

                    <Link
                      href={`/admin/participantes/editar/${participante.id}`}
                      className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar participante"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>

                    {isSuperAdmin && (
                      <button
                        onClick={() => handleDelete(participante.id, `${participante.nombres} ${participante.apellidos}`)}
                        disabled={deletingId === participante. id}
                        className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Eliminar participante"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards Mobile */}
      <div className="md:hidden space-y-4">
        {participantes.map((participante) => (
          <div key={participante.id} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center text-white font-bold">
                  {participante.nombres.charAt(0)}{participante.apellidos.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {participante.nombres} {participante.apellidos}
                  </div>
                  <div className="text-xs text-gray-500">{participante.numeroDocumento}</div>
                </div>
              </div>
              <span
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                  participante.estado === 'ACTIVO'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {participante.estado === 'ACTIVO' ? (
                  <UserCheck className="w-3 h-3" />
                ) : (
                  <UserX className="w-3 h-3" />
                )}
                {participante.estado}
              </span>
            </div>

            <div className="space-y-2 text-sm mb-3">
              <div>
                <span className="text-gray-500">Email:</span>{' '}
                <span className="text-gray-900">{participante.email}</span>
              </div>
              <div>
                <span className="text-gray-500">Celular:</span>{' '}
                <span className="text-gray-900">{participante.celular}</span>
              </div>
              <div>
                <span className="text-gray-500">Inscripciones:</span>{' '}
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                  <GraduationCap className="w-3 h-3" />
                  {participante._count.inscripciones}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              {onInscribir && (
                <button
                  onClick={() => onInscribir(participante)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-50 text-green-600 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Inscribir
                </button>
              )}

              <Link
                href={`/admin/participantes/editar/${participante.id}`}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
              >
                <Edit className="w-4 h-4" />
                Editar
              </Link>

              {isSuperAdmin && (
                <button
                  onClick={() => handleDelete(participante.id, `${participante.nombres} ${participante.apellidos}`)}
                  disabled={deletingId === participante.id}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Eliminar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}