/**
 * Componente: InscripcionTable
 * Versión: 1.0
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-26
 * Descripción: Tabla de inscripciones con edición de pago y asistencia
 */

'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, DollarSign, Calendar, Trash2, Edit2, Save, X } from 'lucide-react';

interface Inscripcion {
  id: string;
  codigo: string;
  fechaInscripcion: string;
  estadoPago: string;
  montoPagado: number;
  fechaPago: string | null;
  metodoPago: string | null;
  asistio: boolean;
  observaciones: string | null;
  participante: {
    nombres: string;
    apellidos: string;
    numeroDocumento: string;
    email: string;
    celular: string;
  };
  curso: {
    titulo: string;
    precio: number | null;
  };
}

interface InscripcionTableProps {
  inscripciones: Inscripcion[];
  onRefresh: () => void;
  currentUserRole: string | null;
}

export default function InscripcionTable({ inscripciones, onRefresh, currentUserRole }: InscripcionTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const isSuperAdmin = currentUserRole === 'SUPER_ADMIN';

  const handleEdit = (inscripcion: Inscripcion) => {
    setEditingId(inscripcion.id);
    setEditData({
      estadoPago: inscripcion.estadoPago,
      montoPagado: inscripcion.montoPagado,
      fechaPago: inscripcion.fechaPago || '',
      metodoPago: inscripcion.metodoPago || '',
      asistio: inscripcion.asistio,
      observaciones: inscripcion.observaciones || '',
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleSave = async (id: string) => {
    setIsSaving(true);

    try {
      const response = await fetch(`/api/inscripciones/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      });

      const data = await response.json();

      if (! response.ok) {
        alert(data.error || 'Error al actualizar inscripción');
        return;
      }

      alert(data.message || 'Inscripción actualizada exitosamente');
      setEditingId(null);
      setEditData({});
      onRefresh();

    } catch (error) {
      console.error('Error:', error);
      alert('Error al actualizar inscripción');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, codigo: string) => {
    if (! confirm(`¿Estás seguro de eliminar la inscripción "${codigo}"?`)) {
      return;
    }

    setDeletingId(id);

    try {
      const response = await fetch(`/api/inscripciones/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (! response.ok) {
        alert(data.error || 'Error al eliminar inscripción');
        return;
      }

      alert(data.message || 'Inscripción eliminada exitosamente');
      onRefresh();

    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar inscripción');
    } finally {
      setDeletingId(null);
    }
  };

  const handleQuickTogglePago = async (inscripcion: Inscripcion) => {
    const nuevoEstado = inscripcion.estadoPago === 'PAGADO' ? 'PENDIENTE' : 'PAGADO';
    
    try {
      const response = await fetch(`/api/inscripciones/${inscripcion.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          estadoPago: nuevoEstado,
          montoPagado: nuevoEstado === 'PAGADO' ? (inscripcion.curso.precio || 0) : 0,
          fechaPago: nuevoEstado === 'PAGADO' ?  new Date().toISOString() : null,
        }),
      });

      if (response.ok) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleQuickToggleAsistencia = async (inscripcion: Inscripcion) => {
    try {
      const response = await fetch(`/api/inscripciones/${inscripcion.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          asistio: !inscripcion.asistio,
        }),
      });

      if (response.ok) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (inscripciones.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No hay inscripciones registradas</p>
      </div>
    );
  }

  return (
    <>
      {/* Tabla Desktop */}
      <div className="hidden lg:block overflow-x-auto bg-white rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Código
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Participante
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Curso
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Pago
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Asistencia
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Fecha Inscripción
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {inscripciones.map((inscripcion) => {
              const isEditing = editingId === inscripcion.id;

              return (
                <tr key={inscripcion.id} className="hover:bg-gray-50 transition-colors">
                  {/* Código */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-sm font-mono text-gray-900">{inscripcion.codigo}</span>
                  </td>

                  {/* Participante */}
                  <td className="px-4 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {inscripcion. participante.nombres} {inscripcion.participante.apellidos}
                    </div>
                    <div className="text-sm text-gray-500">{inscripcion.participante.numeroDocumento}</div>
                  </td>

                  {/* Curso */}
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900">{inscripcion.curso.titulo}</div>
                    {inscripcion.curso.precio !== null && (
                      <div className="text-sm text-green-600 font-semibold">
                        S/ {inscripcion.curso. precio. toFixed(2)}
                      </div>
                    )}
                  </td>

                  {/* Estado de Pago */}
                  <td className="px-4 py-4">
                    {isEditing ? (
                      <div className="space-y-2">
                        <select
                          value={editData.estadoPago}
                          onChange={(e) => setEditData({ ...editData, estadoPago: e.target.value })}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                        >
                          <option value="PENDIENTE">Pendiente</option>
                          <option value="PAGADO">Pagado</option>
                          <option value="NO_PAGADO">No Pagado</option>
                        </select>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="Monto"
                          value={editData. montoPagado}
                          onChange={(e) => setEditData({ ...editData, montoPagado: parseFloat(e.target.value) })}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                        />
                        {editData.estadoPago === 'PAGADO' && (
                          <>
                            <select
                              value={editData. metodoPago}
                              onChange={(e) => setEditData({ ... editData, metodoPago: e.target.value })}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                            >
                              <option value="">Método... </option>
                              <option value="EFECTIVO">Efectivo</option>
                              <option value="TRANSFERENCIA">Transferencia</option>
                              <option value="YAPE">Yape</option>
                              <option value="PLIN">Plin</option>
                              <option value="TARJETA">Tarjeta</option>
                            </select>
                            <input
                              type="date"
                              value={editData.fechaPago}
                              onChange={(e) => setEditData({ ...editData, fechaPago: e.target.value })}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                            />
                          </>
                        )}
                      </div>
                    ) : (
                      <div>
                        <button
                          onClick={() => handleQuickTogglePago(inscripcion)}
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                            inscripcion. estadoPago === 'PAGADO'
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : inscripcion.estadoPago === 'PENDIENTE'
                              ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                        >
                          <DollarSign className="w-3 h-3" />
                          {inscripcion.estadoPago}
                        </button>
                        {inscripcion.montoPagado > 0 && (
                          <div className="text-sm text-gray-600 mt-1">
                            S/ {inscripcion.montoPagado.toFixed(2)}
                          </div>
                        )}
                        {inscripcion.metodoPago && (
                          <div className="text-xs text-gray-500 mt-1">
                            {inscripcion.metodoPago}
                          </div>
                        )}
                      </div>
                    )}
                  </td>

                  {/* Asistencia */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    {isEditing ? (
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={editData.asistio}
                          onChange={(e) => setEditData({ ...editData, asistio: e.target. checked })}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <span className="text-sm">Asistió</span>
                      </label>
                    ) : (
                      <button
                        onClick={() => handleQuickToggleAsistencia(inscripcion)}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                          inscripcion.asistio
                            ?  'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {inscripcion.asistio ?  (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        {inscripcion.asistio ?  'Asistió' : 'No asistió'}
                      </button>
                    )}
                  </td>

                  {/* Fecha Inscripción */}
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(inscripcion.fechaInscripcion).toLocaleDateString('es-PE')}
                  </td>

                  {/* Acciones */}
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {isEditing ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleSave(inscripcion.id)}
                          disabled={isSaving}
                          className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Guardar"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          disabled={isSaving}
                          className="text-gray-600 hover:text-gray-900 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Cancelar"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(inscripcion)}
                          className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        {isSuperAdmin && (
                          <button
                            onClick={() => handleDelete(inscripcion. id, inscripcion.codigo)}
                            disabled={deletingId === inscripcion.id}
                            className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Cards Mobile */}
      <div className="lg:hidden space-y-4">
        {inscripciones.map((inscripcion) => (
          <div key={inscripcion.id} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className="text-xs font-mono text-gray-500">{inscripcion.codigo}</span>
                <h4 className="text-sm font-semibold text-gray-900 mt-1">
                  {inscripcion. participante.nombres} {inscripcion.participante.apellidos}
                </h4>
                <p className="text-xs text-gray-600 mt-1">{inscripcion.curso.titulo}</p>
              </div>
            </div>

            <div className="space-y-2 mb-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pago:</span>
                <button
                  onClick={() => handleQuickTogglePago(inscripcion)}
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                    inscripcion.estadoPago === 'PAGADO'
                      ? 'bg-green-100 text-green-800'
                      : inscripcion. estadoPago === 'PENDIENTE'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  <DollarSign className="w-3 h-3" />
                  {inscripcion.estadoPago}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Asistencia:</span>
                <button
                  onClick={() => handleQuickToggleAsistencia(inscripcion)}
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                    inscripcion.asistio
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {inscripcion.asistio ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : (
                    <XCircle className="w-3 h-3" />
                  )}
                  {inscripcion.asistio ? 'Asistió' : 'No asistió'}
                </button>
              </div>

              {inscripcion.montoPagado > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Monto:</span>
                  <span className="text-sm font-semibold text-green-600">
                    S/ {inscripcion.montoPagado.toFixed(2)}
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-3 border-t border-gray-200">
              <button
                onClick={() => handleEdit(inscripcion)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100"
              >
                <Edit2 className="w-4 h-4" />
                Editar
              </button>

              {isSuperAdmin && (
                <button
                  onClick={() => handleDelete(inscripcion. id, inscripcion.codigo)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100"
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