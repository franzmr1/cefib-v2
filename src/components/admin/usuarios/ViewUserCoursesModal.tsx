/**
 * Componente: ViewUserCoursesModal
 * Versión: 1.0
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-26
 * Descripción: Modal para ver cursos creados por un usuario
 */

'use client';

import { useState, useEffect } from 'react';
import { X, BookOpen, Loader2, Calendar, Award } from 'lucide-react';

interface Curso {
  id: string;
  titulo: string;
  slug: string;
  estado: string;
  modalidad: string;
  duracionHoras: number;
  precio: number | null;
  createdAt: string;
}

interface User {
  id: string;
  email: string;
  name: string | null;
  apellidos: string | null;
}

interface ViewUserCoursesModalProps {
  isOpen: boolean;
  onClose: () => void;
  usuario: User;
}

export default function ViewUserCoursesModal({ isOpen, onClose, usuario }: ViewUserCoursesModalProps) {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen && usuario) {
      fetchCursos();
    }
  }, [isOpen, usuario]);

  const fetchCursos = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/usuarios/${usuario.id}/cursos`);
      if (response.ok) {
        const data = await response.json();
        setCursos(data. cursos || []);
      }
    } catch (error) {
      console.error('Error fetching cursos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Cursos Creados</h2>
              <p className="text-sm text-gray-600 mt-1">
                {usuario.name} {usuario.apellidos} ({usuario.email})
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
                <p className="ml-3 text-gray-600">Cargando cursos...</p>
              </div>
            ) : cursos.length === 0 ?  (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Este usuario no ha creado cursos aún</p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 mb-4">
                  Total: <span className="font-semibold text-gray-900">{cursos.length}</span> curso{cursos.length !== 1 ? 's' : ''}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cursos.map((curso) => (
                    <div
                      key={curso.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-gray-900 flex-1 line-clamp-2">
                          {curso.titulo}
                        </h3>
                        <span
                          className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                            curso.estado === 'ACTIVO'
                              ? 'bg-green-100 text-green-800'
                              : curso.estado === 'BORRADOR'
                              ? 'bg-yellow-100 text-yellow-800'
                              : curso.estado === 'INACTIVO'
                              ? 'bg-gray-100 text-gray-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {curso.estado}
                        </span>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-blue-500" />
                          <span className="capitalize">{curso.modalidad. toLowerCase()}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-purple-500" />
                          <span>{curso.duracionHoras}h de duración</span>
                        </div>

                        {curso.precio && (
                          <div className="flex items-center gap-2">
                            <span className="text-green-600 font-semibold">
                              S/ {curso.precio.toFixed(2)}
                            </span>
                          </div>
                        )}

                        <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
                          Creado: {new Date(curso.createdAt).toLocaleDateString('es-PE')}
                        </div>
                      </div>

                      <a
                          href={`/admin/cursos/${curso.id}`}
                        className="mt-3 inline-block text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Ver detalles →
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex justify-end border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}