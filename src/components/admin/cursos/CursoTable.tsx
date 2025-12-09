/**
 * Componente: CursoTable
 * Version: v2.1 - Con slug y nueva pestaña
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-12-07
 * Descripción: Tabla de cursos con acciones y callback de refresh
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Edit, Trash2, Eye, Calendar, Clock } from 'lucide-react';

interface Curso {
  id: string;
  titulo: string;
  slug: string;  // ✅ AGREGADO
  estado: string;
  modalidad: string;
  duracionHoras: number;
  precio: number | null;
  fechaInicio: Date | null;
  createdAt: Date;
  creador: {
    name: string | null;
    email: string;
  };
}

interface CursoTableProps {
  cursos: Curso[];
  onRefresh?: () => void;
}

export default function CursoTable({ cursos, onRefresh }: CursoTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, titulo: string) => {
    if (! confirm(`¿Estás seguro de eliminar el curso "${titulo}"?\n\nEsta acción no se puede deshacer.`)) {
      return;
    }

    setDeletingId(id);

    try {
      const response = await fetch(`/api/cursos/${id}`, {
        method: 'DELETE',
      });

      if (! response.ok) {
        throw new Error('Error al eliminar');
      }

      alert('Curso eliminado exitosamente');
      
      // Llamar callback de refresh si existe
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar el curso');
    } finally {
      setDeletingId(null);
    }
  };

  const getEstadoBadge = (estado: string) => {
    const badges: Record<string, string> = {
      ACTIVO: 'bg-green-100 text-green-800',
      BORRADOR: 'bg-yellow-100 text-yellow-800',
      ARCHIVADO: 'bg-gray-100 text-gray-800',
    };
    return badges[estado] || 'bg-gray-100 text-gray-800';
  };

  const getModalidadBadge = (modalidad: string) => {
    const badges: Record<string, string> = {
      VIRTUAL: 'bg-blue-100 text-blue-800',
      PRESENCIAL: 'bg-purple-100 text-purple-800',
      HIBRIDO: 'bg-orange-100 text-orange-800',
    };
    return badges[modalidad] || 'bg-gray-100 text-gray-800';
  };

  if (cursos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">No hay cursos que coincidan con los filtros</p>
        <Link
          href="/admin/cursos/nuevo"
          className="inline-block mt-4 text-red-500 hover:text-red-600 font-semibold"
        >
          Crear primer curso →
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Curso
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Modalidad
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Duración
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Precio
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Fecha Inicio
            </th>
            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {cursos.map((curso) => (
            <tr key={curso.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4">
                <div>
                  <p className="font-semibold text-gray-900">{curso.titulo}</p>
                  <p className="text-sm text-gray-500">
                    Creado por {curso.creador.name || curso.creador.email}
                  </p>
                </div>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getEstadoBadge(
                    curso.estado
                  )}`}
                >
                  {curso.estado}
                </span>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getModalidadBadge(
                    curso.modalidad
                  )}`}
                >
                  {curso.modalidad}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-700">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-gray-400" />
                  {curso.duracionHoras}h
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-700">
                {curso.precio ?  `S/ ${curso.precio. toFixed(2)}` : 'Consultar'}
              </td>
              <td className="px-6 py-4 text-sm text-gray-700">
                {curso.fechaInicio ? (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {new Date(curso.fechaInicio).toLocaleDateString('es-PE')}
                  </div>
                ) : (
                  'Por definir'
                )}
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  {/* ✅ BOTÓN "VER CURSO" ACTUALIZADO */}
                  <a
                    href={`/cursos/${curso.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Ver curso en nueva pestaña"
                  >
                    <Eye className="w-4 h-4" />
                  </a>
                  <Link
                    href={`/admin/cursos/${curso.id}`}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Editar curso"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(curso.id, curso. titulo)}
                    disabled={deletingId === curso.id}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Eliminar curso"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}