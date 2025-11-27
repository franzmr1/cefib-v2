'use client';

import { useState } from 'react';
import { Edit, Trash2, BookOpen, UserCheck, UserX, Plus } from 'lucide-react';
import Link from 'next/link';
import AsignarCursoModal from './AsignarCursoModal';  // ← AGREGAR IMPORT

interface Docente {
  id: string;
  nombres: string;
  apellidos: string;
  numeroDocumento: string;
  email: string;
  celular: string;
  especialidad: string;
  estado: string;
  _count: {
    cursosAsignados: number;
  };
}

interface DocenteTableProps {
  docentes: Docente[];
  onRefresh: () => void;
  currentUserRole: string | null;
}

export default function DocenteTable({ docentes, onRefresh, currentUserRole }: DocenteTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  // ✅ AGREGAR ESTOS ESTADOS
  const [showAsignarModal, setShowAsignarModal] = useState(false);
  const [selectedDocente, setSelectedDocente] = useState<Docente | null>(null);

  const isSuperAdmin = currentUserRole === 'SUPER_ADMIN';

  const handleDelete = async (id: string, nombre: string) => {
    if (! confirm(`¿Estás seguro de eliminar al docente "${nombre}"?`)) {
      return;
    }

    setDeletingId(id);

    try {
      const response = await fetch(`/api/docentes/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Error al eliminar docente');
        return;
      }

      alert(data.message || 'Docente eliminado exitosamente');
      onRefresh();

    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar docente');
    } finally {
      setDeletingId(null);
    }
  };

  // ✅ AGREGAR ESTA FUNCIÓN
  const handleAsignarCurso = (docente: Docente) => {
    setSelectedDocente(docente);
    setShowAsignarModal(true);
  };

  if (docentes.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No hay docentes registrados</p>
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
                Docente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Documento
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contacto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Especialidad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cursos
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
            {docentes.map((docente) => (
              <tr key={docente.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                      {docente.nombres. charAt(0)}{docente.apellidos.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {docente.nombres} {docente.apellidos}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{docente.numeroDocumento}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{docente.email}</div>
                  <div className="text-sm text-gray-500">{docente.celular}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{docente.especialidad}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    <BookOpen className="w-3 h-3" />
                    {docente._count.cursosAsignados}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                      docente.estado === 'ACTIVO'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {docente.estado === 'ACTIVO' ? (
                      <UserCheck className="w-3 h-3" />
                    ) : (
                      <UserX className="w-3 h-3" />
                    )}
                    {docente. estado}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    {/* ✅ AGREGAR ESTE BOTÓN */}
                    <button
                      onClick={() => handleAsignarCurso(docente)}
                      className="text-purple-600 hover:text-purple-900 p-2 hover:bg-purple-50 rounded-lg transition-colors"
                      title="Asignar a curso"
                    >
                      <Plus className="w-4 h-4" />
                    </button>

                    <Link
                      href={`/admin/docentes/editar/${docente.id}`}
                      className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar docente"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>

                    {isSuperAdmin && (
                      <button
                        onClick={() => handleDelete(docente.id, `${docente.nombres} ${docente.apellidos}`)}
                        disabled={deletingId === docente. id}
                        className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Eliminar docente"
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
        {docentes.map((docente) => (
          <div key={docente.id} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                  {docente. nombres.charAt(0)}{docente.apellidos.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {docente.nombres} {docente.apellidos}
                  </div>
                  <div className="text-xs text-gray-500">{docente.numeroDocumento}</div>
                </div>
              </div>
              <span
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                  docente. estado === 'ACTIVO'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {docente.estado === 'ACTIVO' ? (
                  <UserCheck className="w-3 h-3" />
                ) : (
                  <UserX className="w-3 h-3" />
                )}
                {docente.estado}
              </span>
            </div>

            <div className="space-y-2 text-sm mb-3">
              <div>
                <span className="text-gray-500">Email:</span>{' '}
                <span className="text-gray-900">{docente.email}</span>
              </div>
              <div>
                <span className="text-gray-500">Celular:</span>{' '}
                <span className="text-gray-900">{docente.celular}</span>
              </div>
              <div>
                <span className="text-gray-500">Especialidad:</span>{' '}
                <span className="text-gray-900">{docente. especialidad}</span>
              </div>
              <div>
                <span className="text-gray-500">Cursos asignados:</span>{' '}
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  <BookOpen className="w-3 h-3" />
                  {docente._count.cursosAsignados}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              {/* ✅ AGREGAR ESTE BOTÓN */}
              <button
                onClick={() => handleAsignarCurso(docente)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-purple-50 text-purple-600 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Asignar
              </button>

              <Link
                href={`/admin/docentes/editar/${docente.id}`}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
              >
                <Edit className="w-4 h-4" />
                Editar
              </Link>

              {isSuperAdmin && (
                <button
                  onClick={() => handleDelete(docente.id, `${docente.nombres} ${docente.apellidos}`)}
                  disabled={deletingId === docente.id}
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

      {/* ✅ AGREGAR EL MODAL */}
      {showAsignarModal && selectedDocente && (
        <AsignarCursoModal
          isOpen={showAsignarModal}
          onClose={() => {
            setShowAsignarModal(false);
            setSelectedDocente(null);
          }}
          docente={selectedDocente}
          onSuccess={() => {
            onRefresh();
            setShowAsignarModal(false);
            setSelectedDocente(null);
          }}
        />
      )}
    </>
  );
}