/**
 * Componente: SolicitudDetalle
 * Versión: 1.0
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-26
 */

'use client';

import { useState } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Building2, 
  Briefcase,
  Calendar,
  MessageSquare,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
  FileText,
  Users,
  Globe
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface SolicitudDetalleProps {
  solicitud: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const SERVICIO_LABELS: Record<string, string> = {
  PROYECTOS_PLANES: 'Proyectos Y Planes',
  SALUD: 'Salud',
  GESTION_PUBLICA: 'Gestión Pública',
  EDUCACION: 'Educación',
  TECNOLOGIA: 'Tecnología',
  ENERGIA_MINERIA: 'Energía y Minería',
  OTRO: 'Otro',
};

export default function SolicitudDetalle({ 
  solicitud, 
  isOpen, 
  onClose,
  onUpdate 
}: SolicitudDetalleProps) {
  const [estado, setEstado] = useState(solicitud.estado);
  const [prioridad, setPrioridad] = useState(solicitud.prioridad);
  const [notasInternas, setNotasInternas] = useState(solicitud.notasInternas || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  if (!isOpen) return null;

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setSaveError('');
      setSaveSuccess(false);

      const response = await fetch(`/api/solicitudes/${solicitud.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          estado,
          prioridad,
          notasInternas: notasInternas.trim() || null,
          fechaContacto: estado === 'CONTACTADO' && ! solicitud.fechaContacto 
            ? new Date(). toISOString() 
            : solicitud.fechaContacto,
          fechaCierre: ['CERRADO_EXITOSO', 'CERRADO_SIN_EXITO', 'CANCELADO']. includes(estado) && !solicitud.fechaCierre
            ? new Date().toISOString()
            : solicitud.fechaCierre,
        }),
      });

      if (! response.ok) {
        throw new Error('Error al actualizar');
      }

      setSaveSuccess(true);
      // ✅ NUEVO: Disparar evento para actualizar badge
        window.dispatchEvent(new CustomEvent('solicitudUpdated'));
    
        // ✅ NUEVO: Limpiar cache
        localStorage.removeItem('solicitudes_nuevas_count');
      setTimeout(() => {
        onUpdate();
        onClose();
      }, 1500);

    } catch (error) {
      console.error('Error:', error);
      setSaveError('Error al guardar cambios');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#003366] to-[#004488] p-6 text-white sticky top-0 z-10">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
                {solicitud.nombres.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-1">
                  {solicitud.nombres}
                </h2>
                <div className="flex items-center gap-3 text-sm text-blue-100">
                  <span className="font-mono">{solicitud.folio}</span>
                  <span>•</span>
                  <span>{format(new Date(solicitud.createdAt), "dd 'de' MMMM, yyyy", { locale: es })}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Columna Izquierda: Datos del Solicitante */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-[#FF6B35]" />
                    Datos del Solicitante
                  </h3>

                  <div className="space-y-3">
                    {/* Email */}
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <Mail className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs text-gray-600 mb-0.5">Email</div>
                        <a href={`mailto:${solicitud.email}`} className="text-sm font-medium text-[#003366] hover:text-[#FF6B35]">
                          {solicitud. email}
                        </a>
                      </div>
                    </div>

                    {/* Teléfono */}
                    {solicitud.telefono && (
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <Phone className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="text-xs text-gray-600 mb-0.5">Teléfono</div>
                          <a href={`tel:${solicitud.telefono}`} className="text-sm font-medium text-[#003366] hover:text-[#FF6B35]">
                            {solicitud.telefono}
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Empresa */}
                    {solicitud. empresa && (
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <Building2 className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="text-xs text-gray-600 mb-0.5">Empresa</div>
                          <div className="text-sm font-medium text-gray-900">{solicitud.empresa}</div>
                        </div>
                      </div>
                    )}

                    {/* Cargo */}
                    {solicitud.cargo && (
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <Briefcase className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="text-xs text-gray-600 mb-0. 5">Cargo</div>
                          <div className="text-sm font-medium text-gray-900">{solicitud.cargo}</div>
                        </div>
                      </div>
                    )}

                    {/* Cómo nos conoció */}
                    {solicitud.comoNosConociste && (
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <Globe className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="text-xs text-gray-600 mb-0. 5">¿Cómo nos conoció?</div>
                          <div className="text-sm font-medium text-gray-900">{solicitud.comoNosConociste}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Detalles del Programa */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#FF6B35]" />
                    Detalles del Programa
                  </h3>

                  <div className="space-y-3">
                    {/* Servicio */}
                    <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="text-xs text-orange-700 mb-0.5 font-medium">Servicio de Interés</div>
                      <div className="text-sm font-semibold text-orange-900">
                        {SERVICIO_LABELS[solicitud.servicioInteres]}
                      </div>
                    </div>

                    {/* Tipo de Programa */}
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-xs text-gray-600 mb-0.5">Tipo de Programa</div>
                      <div className="text-sm font-medium text-gray-900">
                        {solicitud.tipoPrograma === 'CORPORATIVO' ?  'Corporativo' : 'Individual'}
                      </div>
                    </div>

                    {/* Participantes */}
                    {solicitud.tipoPrograma === 'CORPORATIVO' && solicitud.numParticipantes && (
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <Users className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="text-xs text-gray-600 mb-0.5">Número de Participantes</div>
                          <div className="text-sm font-medium text-gray-900">{solicitud.numParticipantes}</div>
                        </div>
                      </div>
                    )}

                    {/* Mensaje */}
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="w-4 h-4 text-gray-400" />
                        <div className="text-xs text-gray-600 font-medium">Mensaje</div>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {solicitud.mensaje}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Columna Derecha: Gestión */}
              <div className="space-y-6">
                {/* Estado y Prioridad */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#FF6B35]" />
                    Gestión de la Solicitud
                  </h3>

                  <div className="space-y-4">
                    {/* Estado */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Estado
                      </label>
                      <select
                        value={estado}
                        onChange={(e) => setEstado(e.target.value)}
                        className="w-full px-4 py-2. 5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                      >
                        <option value="NUEVO">Nuevo</option>
                        <option value="EN_REVISION">En Revisión</option>
                        <option value="CONTACTADO">Contactado</option>
                        <option value="EN_NEGOCIACION">En Negociación</option>
                        <option value="CERRADO_EXITOSO">Cerrado Exitoso</option>
                        <option value="CERRADO_SIN_EXITO">Cerrado Sin Éxito</option>
                        <option value="CANCELADO">Cancelado</option>
                      </select>
                    </div>

                    {/* Prioridad */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prioridad
                      </label>
                      <select
                        value={prioridad}
                        onChange={(e) => setPrioridad(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                      >
                        <option value="BAJA">Baja</option>
                        <option value="NORMAL">Normal</option>
                        <option value="ALTA">Alta</option>
                        <option value="URGENTE">Urgente</option>
                      </select>
                    </div>

                    {/* Notas Internas */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notas Internas
                      </label>
                      <textarea
                        value={notasInternas}
                        onChange={(e) => setNotasInternas(e.target.value)}
                        rows={6}
                        placeholder="Agrega notas internas sobre esta solicitud..."
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent resize-none"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Estas notas solo son visibles para el equipo administrativo
                      </p>
                    </div>
                  </div>
                </div>

                {/* Metadata */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Información del Sistema</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fecha de solicitud:</span>
                      <span className="font-medium text-gray-900">
                        {format(new Date(solicitud.createdAt), "dd/MM/yyyy HH:mm", { locale: es })}
                      </span>
                    </div>
                    {solicitud.fechaContacto && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fecha de contacto:</span>
                        <span className="font-medium text-gray-900">
                          {format(new Date(solicitud.fechaContacto), "dd/MM/yyyy HH:mm", { locale: es })}
                        </span>
                      </div>
                    )}
                    {solicitud.ip && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">IP:</span>
                        <span className="font-mono text-gray-900">{solicitud.ip}</span>
                      </div>
                    )}
                    {solicitud.origen && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Origen:</span>
                        <span className="font-medium text-gray-900 truncate max-w-[200px]" title={solicitud.origen}>
                          {solicitud.origen}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Mensajes de estado */}
                {saveSuccess && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-green-800 font-medium">Cambios guardados exitosamente</span>
                  </div>
                )}

                {saveError && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <span className="text-sm text-red-800 font-medium">{saveError}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4 flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={isSaving}
              className="px-6 py-2. 5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              Cerrar
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#FF6B35] hover:bg-[#FF8C5A] text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Guardar Cambios
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}