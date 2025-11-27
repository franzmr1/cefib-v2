/**
 * Componente: InscripcionModal
 * Versión: 1.1 - Con mejor manejo de errores
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-26
 */

'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, Search, CheckCircle, AlertCircle } from 'lucide-react';

interface Curso {
  id: string;
  titulo: string;
  estado: string;
  precio: number | null;
  cupoMaximo: number | null;
  cupoActual: number;
  fechaInicio: string | null;
  fechaFin: string | null;
}

interface Participante {
  id: string;
  nombres: string;
  apellidos: string;
  email: string;
  numeroDocumento: string;
}

interface InscripcionModalProps {
  isOpen: boolean;
  onClose: () => void;
  participante?: Participante;
  onSuccess: () => void;
}

export default function InscripcionModal({ 
  isOpen, 
  onClose, 
  participante, 
  onSuccess 
}: InscripcionModalProps) {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [isLoadingCursos, setIsLoadingCursos] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCursoId, setSelectedCursoId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    estadoPago: 'PENDIENTE',
    montoPagado: 0,
    metodoPago: '',
    fechaPago: '',
    asistio: false,
    observaciones: '',
  });

  useEffect(() => {
    if (isOpen) {
      fetchCursos();
    }
  }, [isOpen]);

  const fetchCursos = async () => {
  setIsLoadingCursos(true);
  setErrorMessage('');
  
  try {
    const response = await fetch('/api/cursos');
    
    if (!response. ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Filtrar cursos activos o publicados
    const cursosActivos = (data.cursos || []).filter((c: Curso) => 
      c.estado === 'ACTIVO' || c.estado === 'PUBLICADO'
    );
    
    setCursos(cursosActivos);
    
    if (cursosActivos.length === 0) {
      setErrorMessage('No hay cursos disponibles para inscripción.');
    }
    
  } catch (error) {
    console.error('Error al cargar cursos:', error); // ✅ SOLO este log de error
    setErrorMessage('Error al cargar los cursos. Por favor, intenta de nuevo.');
    setCursos([]);
  } finally {
    setIsLoadingCursos(false);
  }
};

  const handleSubmit = async (e: React. FormEvent) => {
    e.preventDefault();

    if (!selectedCursoId) {
      alert('Selecciona un curso');
      return;
    }

    if (! participante) {
      alert('No hay participante seleccionado');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        participanteId: participante.id,
        cursoId: selectedCursoId,
        estadoPago: formData.estadoPago,
        montoPagado: parseFloat(formData.montoPagado.toString()) || 0,
        metodoPago: formData.metodoPago || null,
        fechaPago: formData.fechaPago || null,
        asistio: formData.asistio,
        observaciones: formData. observaciones || null,
      };

      console.log('📤 Enviando inscripción:', payload);

      const response = await fetch('/api/inscripciones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      console.log('📥 Respuesta inscripción:', data);

      if (!response.ok) {
        alert(data.error || 'Error al inscribir participante');
        return;
      }

      alert(data.message || 'Participante inscrito exitosamente');
      onSuccess();
      handleClose();

    } catch (error) {
      console.error('❌ Error:', error);
      alert('Error al inscribir participante');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedCursoId('');
    setSearchTerm('');
    setErrorMessage('');
    setFormData({
      estadoPago: 'PENDIENTE',
      montoPagado: 0,
      metodoPago: '',
      fechaPago: '',
      asistio: false,
      observaciones: '',
    });
    onClose();
  };

  const filteredCursos = cursos.filter(curso =>
    curso.titulo.toLowerCase(). includes(searchTerm.toLowerCase())
  );

  const selectedCurso = cursos.find(c => c.id === selectedCursoId);

  if (! isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Inscribir a Curso</h2>
              {participante && (
                <p className="text-sm text-gray-600 mt-1">
                  {participante.nombres} {participante. apellidos} ({participante.numeroDocumento})
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
                  disabled={isLoadingCursos}
                />
              </div>

              {/* Lista de Cursos */}
              {isLoadingCursos ?  (
                <div className="flex items-center justify-center py-8 border border-gray-300 rounded-lg">
                  <Loader2 className="w-6 h-6 text-red-500 animate-spin" />
                  <p className="ml-3 text-gray-600">Cargando cursos...</p>
                </div>
              ) : errorMessage ? (
                <div className="flex items-center justify-center py-8 border border-red-300 bg-red-50 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-red-500" />
                  <p className="ml-3 text-red-600">{errorMessage}</p>
                </div>
              ) : filteredCursos.length === 0 ? (
                <div className="text-center py-8 border border-gray-300 rounded-lg">
                  <p className="text-gray-500">
                    {searchTerm 
                      ? `No se encontraron cursos con "${searchTerm}"`
                      : 'No hay cursos activos disponibles'}
                  </p>
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm('')}
                      className="mt-2 text-sm text-red-600 hover:underline"
                    >
                      Limpiar búsqueda
                    </button>
                  )}
                </div>
              ) : (
                <div className="border border-gray-300 rounded-lg max-h-60 overflow-y-auto">
                  {filteredCursos.map((curso) => {
                    const cupoDisponible = curso.cupoMaximo ? curso. cupoMaximo - curso.cupoActual : null;
                    const cupoLleno = curso.cupoMaximo ? curso.cupoActual >= curso.cupoMaximo : false;

                    return (
                      <div
                        key={curso. id}
                        onClick={() => ! cupoLleno && setSelectedCursoId(curso.id)}
                        className={`p-4 border-b border-gray-200 last:border-b-0 cursor-pointer transition-colors ${
                          selectedCursoId === curso.id
                            ? 'bg-red-50 border-l-4 border-l-red-500'
                            : cupoLleno
                            ?  'bg-gray-50 cursor-not-allowed opacity-60'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{curso.titulo}</h4>
                            <div className="flex items-center gap-3 mt-2 text-sm">
                              {curso.precio !== null && (
                                <span className="text-green-600 font-semibold">
                                  S/ {curso.precio.toFixed(2)}
                                </span>
                              )}
                              {curso.cupoMaximo && (
                                <span className={`${cupoLleno ? 'text-red-600' : 'text-gray-600'}`}>
                                  Cupos: {curso.cupoActual}/{curso.cupoMaximo}
                                  {cupoDisponible !== null && cupoDisponible > 0 && (
                                    <span className="text-green-600 ml-1">
                                      ({cupoDisponible} disponibles)
                                    </span>
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                          {selectedCursoId === curso.id && (
                            <CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                          )}
                          {cupoLleno && (
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Información del Curso Seleccionado */}
            {selectedCurso && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Curso Seleccionado:</h4>
                <p className="text-blue-800">{selectedCurso.titulo}</p>
                {selectedCurso.precio !== null && (
                  <p className="text-sm text-blue-700 mt-1">
                    Precio: S/ {selectedCurso.precio.toFixed(2)}
                  </p>
                )}
              </div>
            )}

            {/* Datos de Pago */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Datos de Pago</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Estado de Pago */}
                <div>
                  <label htmlFor="estadoPago" className="block text-sm font-medium text-gray-700 mb-1">
                    Estado de Pago
                  </label>
                  <select
                    id="estadoPago"
                    value={formData.estadoPago}
                    onChange={(e) => setFormData(prev => ({ ...prev, estadoPago: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  >
                    <option value="PENDIENTE">Pendiente</option>
                    <option value="PAGADO">Pagado</option>
                    <option value="NO_PAGADO">No Pagado</option>
                  </select>
                </div>

                {/* Monto Pagado */}
                <div>
                  <label htmlFor="montoPagado" className="block text-sm font-medium text-gray-700 mb-1">
                    Monto Pagado (S/)
                  </label>
                  <input
                    type="number"
                    id="montoPagado"
                    step="0.01"
                    min="0"
                    value={formData.montoPagado}
                    onChange={(e) => setFormData(prev => ({ ...prev, montoPagado: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                </div>

                {/* Método de Pago */}
                {formData.estadoPago === 'PAGADO' && (
                  <>
                    <div>
                      <label htmlFor="metodoPago" className="block text-sm font-medium text-gray-700 mb-1">
                        Método de Pago
                      </label>
                      <select
                        id="metodoPago"
                        value={formData.metodoPago}
                        onChange={(e) => setFormData(prev => ({ ...prev, metodoPago: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                      >
                        <option value="">Seleccionar... </option>
                        <option value="EFECTIVO">Efectivo</option>
                        <option value="TRANSFERENCIA">Transferencia</option>
                        <option value="YAPE">Yape</option>
                        <option value="PLIN">Plin</option>
                        <option value="TARJETA">Tarjeta</option>
                        <option value="OTRO">Otro</option>
                      </select>
                    </div>

                    {/* Fecha de Pago */}
                    <div>
                      <label htmlFor="fechaPago" className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha de Pago
                      </label>
                      <input
                        type="date"
                        id="fechaPago"
                        value={formData. fechaPago}
                        onChange={(e) => setFormData(prev => ({ ...prev, fechaPago: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Asistencia */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="asistio"
                checked={formData.asistio}
                onChange={(e) => setFormData(prev => ({ ...prev, asistio: e.target.checked }))}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <label htmlFor="asistio" className="text-sm font-medium text-gray-700">
                Marcó asistencia
              </label>
            </div>

            {/* Observaciones */}
            <div>
              <label htmlFor="observaciones" className="block text-sm font-medium text-gray-700 mb-1">
                Observaciones (Opcional)
              </label>
              <textarea
                id="observaciones"
                rows={3}
                value={formData.observaciones}
                onChange={(e) => setFormData(prev => ({ ...prev, observaciones: e. target.value }))}
                placeholder="Notas adicionales..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Botones */}
            <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting || !selectedCursoId}
                className="flex-1 px-6 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg font-semibold hover:from-red-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSubmitting ? 'Inscribiendo...' : 'Inscribir'}
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