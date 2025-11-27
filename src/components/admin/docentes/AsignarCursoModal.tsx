/**
 * Componente: AsignarCursoModal
 * Versión: 1.0
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-26
 * Descripción: Modal para asignar docente a un curso
 */

'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, Search, CheckCircle } from 'lucide-react';

interface Curso {
  id: string;
  titulo: string;
  estado: string;
  modalidad: string;
  fechaInicio: string | null;
  fechaFin: string | null;
}

interface Docente {
  id: string;
  nombres: string;
  apellidos: string;
  email: string;
  especialidad: string;
}

interface AsignarCursoModalProps {
  isOpen: boolean;
  onClose: () => void;
  docente?: Docente;
  onSuccess: () => void;
}

export default function AsignarCursoModal({ 
  isOpen, 
  onClose, 
  docente, 
  onSuccess 
}: AsignarCursoModalProps) {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [isLoadingCursos, setIsLoadingCursos] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCursoId, setSelectedCursoId] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchCursos();
    }
  }, [isOpen]);

  const fetchCursos = async () => {
    setIsLoadingCursos(true);
    try {
      const response = await fetch('/api/cursos');
      if (response.ok) {
        const data = await response.json();
        // Filtrar cursos activos y en borrador
        const cursosDisponibles = data.cursos?. filter((c: Curso) => 
          c.estado === 'ACTIVO' || c.estado === 'BORRADOR'
        ) || [];
        setCursos(cursosDisponibles);
      }
    } catch (error) {
      console.error('Error fetching cursos:', error);
    } finally {
      setIsLoadingCursos(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCursoId) {
      alert('Selecciona un curso');
      return;
    }

    if (!docente) {
      alert('No hay docente seleccionado');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/cursos/${selectedCursoId}/docentes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          docenteId: docente.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Error al asignar docente');
        return;
      }

      alert(data.message || 'Docente asignado exitosamente');
      onSuccess();
      handleClose();

    } catch (error) {
      console.error('Error:', error);
      alert('Error al asignar docente');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedCursoId('');
    setSearchTerm('');
    onClose();
  };

  const filteredCursos = cursos.filter(curso =>
    curso.titulo.toLowerCase(). includes(searchTerm.toLowerCase())
  );

  const selectedCurso = cursos.find(c => c.id === selectedCursoId);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Asignar a Curso</h2>
              {docente && (
                <p className="text-sm text-gray-600 mt-1">
                  {docente.nombres} {docente.apellidos} - {docente.especialidad}
                </p>
              )}
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Seleccionar Curso */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seleccionar Curso <span className="text-red-500">*</span>
              </label>

              {/* Buscador */}
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar curso..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              {/* Lista de Cursos */}
              {isLoadingCursos ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 text-red-500 animate-spin" />
                  <p className="ml-3 text-gray-600">Cargando cursos...</p>
                </div>
              ) : filteredCursos.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No hay cursos disponibles
                </div>
              ) : (
                <div className="border border-gray-300 rounded-lg max-h-96 overflow-y-auto">
                  {filteredCursos.map((curso) => (
                    <div
                      key={curso.id}
                      onClick={() => setSelectedCursoId(curso.id)}
                      className={`p-4 border-b border-gray-200 last:border-b-0 cursor-pointer transition-colors ${
                        selectedCursoId === curso.id
                          ? 'bg-red-50 border-l-4 border-l-red-500'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{curso.titulo}</h4>
                          <div className="flex items-center gap-3 mt-2 text-sm">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                              curso.estado === 'ACTIVO'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {curso.estado}
                            </span>
                            <span className="text-gray-600">{curso.modalidad}</span>
                            {curso.fechaInicio && (
                              <span className="text-gray-500 text-xs">
                                Inicio: {new Date(curso. fechaInicio).toLocaleDateString('es-PE')}
                              </span>
                            )}
                          </div>
                        </div>
                        {selectedCursoId === curso. id && (
                          <CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Información del Curso Seleccionado */}
            {selectedCurso && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Curso Seleccionado:</h4>
                <p className="text-blue-800">{selectedCurso. titulo}</p>
                <p className="text-sm text-blue-700 mt-1">
                  {selectedCurso.modalidad} • {selectedCurso.estado}
                </p>
              </div>
            )}

            {/* Botones */}
            <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting || !selectedCursoId}
                className="flex-1 px-6 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg font-semibold hover:from-red-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSubmitting ?  'Asignando...' : 'Asignar Docente'}
              </button>

              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}