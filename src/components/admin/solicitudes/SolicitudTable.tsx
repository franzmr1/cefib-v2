/**
 * Componente: SolicitudTable
 * Versión: 1.0
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-26
 */

'use client';

import { useState } from 'react';
import { 
  Eye, 
  Mail, 
  Phone, 
  Building2,
  Calendar,
  AlertCircle,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface SolicitudTableProps {
  solicitudes: any[];
  onVerDetalle: (solicitud: any) => void;
  onRefresh: () => void;
}

const ESTADO_CONFIG = {
  NUEVO: {
    label: 'Nuevo',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: TrendingUp,
  },
  EN_REVISION: {
    label: 'En Revisión',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: Clock,
  },
  CONTACTADO: {
    label: 'Contactado',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: CheckCircle2,
  },
  EN_NEGOCIACION: {
    label: 'En Negociación',
    color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    icon: AlertCircle,
  },
  CERRADO_EXITOSO: {
    label: 'Cerrado Exitoso',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle2,
  },
  CERRADO_SIN_EXITO: {
    label: 'Cerrado Sin Éxito',
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: XCircle,
  },
  CANCELADO: {
    label: 'Cancelado',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: XCircle,
  },
};

const PRIORIDAD_CONFIG = {
  BAJA: { label: 'Baja', color: 'bg-gray-100 text-gray-700' },
  NORMAL: { label: 'Normal', color: 'bg-blue-100 text-blue-700' },
  ALTA: { label: 'Alta', color: 'bg-orange-100 text-orange-700' },
  URGENTE: { label: 'Urgente', color: 'bg-red-100 text-red-700' },
};

const SERVICIO_LABELS: Record<string, string> = {
  PROYECTOS_PLANES: 'Proyectos Y Planes',
  SALUD: 'Salud',
  GESTION_PUBLICA: 'Gestión Pública',
  EDUCACION: 'Educación',
  TECNOLOGIA: 'Tecnología',
  ENERGIA_MINERIA: 'Energía y Minería',
  OTRO: 'Otro',
};

export default function SolicitudTable({ 
  solicitudes, 
  onVerDetalle,
  onRefresh 
}: SolicitudTableProps) {
  
  if (solicitudes.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No hay solicitudes
        </h3>
        <p className="text-gray-600">
          No se encontraron solicitudes con los filtros aplicados
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Folio
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Solicitante
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Servicio
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Prioridad
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {solicitudes.map((solicitud) => {
              const estadoConfig = ESTADO_CONFIG[solicitud.estado as keyof typeof ESTADO_CONFIG];
              const prioridadConfig = PRIORIDAD_CONFIG[solicitud.prioridad as keyof typeof PRIORIDAD_CONFIG];
              const EstadoIcon = estadoConfig.icon;

              return (
                <tr 
                  key={solicitud. id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {/* Folio */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-mono font-semibold text-gray-900">
                        {solicitud.folio. substring(0, 8)}
                      </div>
                    </div>
                  </td>

                  {/* Solicitante */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] rounded-full flex items-center justify-center text-white font-semibold">
                        {solicitud.nombres.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {solicitud.nombres}
                        </div>
                        <div className="text-xs text-gray-600 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {solicitud.email}
                        </div>
                        {solicitud.empresa && (
                          <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                            <Building2 className="w-3 h-3" />
                            {solicitud.empresa}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Servicio */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {SERVICIO_LABELS[solicitud.servicioInteres]}
                    </div>
                    <div className="text-xs text-gray-500">
                      {solicitud.tipoPrograma === 'CORPORATIVO' 
                        ? `Corporativo (${solicitud.numParticipantes || 0} personas)`
                        : 'Individual'
                      }
                    </div>
                  </td>

                  {/* Estado */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1. 5 px-3 py-1 rounded-full text-xs font-medium border ${estadoConfig.color}`}>
                      <EstadoIcon className="w-3. 5 h-3.5" />
                      {estadoConfig.label}
                    </span>
                  </td>

                  {/* Prioridad */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2. 5 py-1 rounded-full text-xs font-medium ${prioridadConfig.color}`}>
                      {prioridadConfig.label}
                    </span>
                  </td>

                  {/* Fecha */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1. 5 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {format(new Date(solicitud.createdAt), 'dd MMM yyyy', { locale: es })}
                    </div>
                    <div className="text-xs text-gray-500">
                      {format(new Date(solicitud. createdAt), 'HH:mm')}
                    </div>
                  </td>

                  {/* Acciones */}
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => onVerDetalle(solicitud)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#003366] hover:bg-[#004488] text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      Ver
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden divide-y divide-gray-200">
        {solicitudes.map((solicitud) => {
          const estadoConfig = ESTADO_CONFIG[solicitud.estado as keyof typeof ESTADO_CONFIG];
          const prioridadConfig = PRIORIDAD_CONFIG[solicitud.prioridad as keyof typeof PRIORIDAD_CONFIG];
          const EstadoIcon = estadoConfig.icon;

          return (
            <div key={solicitud.id} className="p-4 hover:bg-gray-50 transition-colors">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] rounded-full flex items-center justify-center text-white font-semibold text-lg">
                    {solicitud.nombres.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {solicitud.nombres}
                    </div>
                    <div className="text-xs text-gray-600 font-mono">
                      {solicitud.folio.substring(0, 8)}
                    </div>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${prioridadConfig.color}`}>
                  {prioridadConfig.label}
                </span>
              </div>

              {/* Info */}
              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4 text-gray-400" />
                  {solicitud.email}
                </div>
                {solicitud.empresa && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    {solicitud.empresa}
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  {format(new Date(solicitud.createdAt), "dd MMM yyyy 'a las' HH:mm", { locale: es })}
                </div>
              </div>

              {/* Servicio */}
              <div className="mb-3">
                <div className="text-sm font-medium text-gray-900">
                  {SERVICIO_LABELS[solicitud.servicioInteres]}
                </div>
                <div className="text-xs text-gray-500">
                  {solicitud.tipoPrograma === 'CORPORATIVO' 
                    ? `Corporativo (${solicitud.numParticipantes || 0} personas)`
                    : 'Individual'
                  }
                </div>
              </div>

              {/* Estado y Acción */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${estadoConfig.color}`}>
                  <EstadoIcon className="w-3.5 h-3.5" />
                  {estadoConfig.label}
                </span>
                <button
                  onClick={() => onVerDetalle(solicitud)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#003366] hover:bg-[#004488] text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  Ver
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}