/**
 * Componente: SolicitudFilters
 * Versión: 1.0
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-26
 */

'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';

interface FilterValues {
  search: string;
  estado: string;
  servicio: string;
  prioridad: string;
  fechaDesde: string;
  fechaHasta: string;
}

interface SolicitudFiltersProps {
  onFilterChange: (filters: FilterValues) => void;
  totalResults: number;
}

export default function SolicitudFilters({ 
  onFilterChange, 
  totalResults 
}: SolicitudFiltersProps) {
  const [filters, setFilters] = useState<FilterValues>({
    search: '',
    estado: '',
    servicio: '',
    prioridad: '',
    fechaDesde: '',
    fechaHasta: '',
  });

  const handleChange = (key: keyof FilterValues, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClear = () => {
    const emptyFilters = {
      search: '',
      estado: '',
      servicio: '',
      prioridad: '',
      fechaDesde: '',
      fechaHasta: '',
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== '');

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <Search className="w-5 h-5 text-[#FF6B35]" />
          Filtros de Búsqueda
        </h3>
        <span className="text-sm text-gray-600">
          {totalResults} resultado{totalResults !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Búsqueda */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Buscar
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Nombre, email, empresa, folio..."
              value={filters.search}
              onChange={(e) => handleChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2. 5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Estado */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estado
          </label>
          <select
            value={filters.estado}
            onChange={(e) => handleChange('estado', e.target.value)}
            className="w-full px-4 py-2. 5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent text-sm"
          >
            <option value="">Todos los estados</option>
            <option value="NUEVO">Nuevo</option>
            <option value="EN_REVISION">En Revisión</option>
            <option value="CONTACTADO">Contactado</option>
            <option value="EN_NEGOCIACION">En Negociación</option>
            <option value="CERRADO_EXITOSO">Cerrado Exitoso</option>
            <option value="CERRADO_SIN_EXITO">Cerrado Sin Éxito</option>
            <option value="CANCELADO">Cancelado</option>
          </select>
        </div>

        {/* Servicio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Servicio
          </label>
          <select
            value={filters.servicio}
            onChange={(e) => handleChange('servicio', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent text-sm"
          >
            <option value="">Todos los servicios</option>
            <option value="PROYECTOS_PLANES">Proyectos Y Planes</option>
            <option value="SALUD">Salud</option>
            <option value="GESTION_PUBLICA">Gestión Pública</option>
            <option value="EDUCACION">Educación</option>
            <option value="TECNOLOGIA">Tecnología</option>
            <option value="ENERGIA_MINERIA">Energía Y Minería</option>
            <option value="OTRO">Otro</option>
          </select>
        </div>

        {/* Prioridad */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prioridad
          </label>
          <select
            value={filters.prioridad}
            onChange={(e) => handleChange('prioridad', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent text-sm"
          >
            <option value="">Todas las prioridades</option>
            <option value="BAJA">Baja</option>
            <option value="NORMAL">Normal</option>
            <option value="ALTA">Alta</option>
            <option value="URGENTE">Urgente</option>
          </select>
        </div>

        {/* Fecha Desde */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Desde
          </label>
          <input
            type="date"
            value={filters.fechaDesde}
            onChange={(e) => handleChange('fechaDesde', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent text-sm"
          />
        </div>

        {/* Fecha Hasta */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hasta
          </label>
          <input
            type="date"
            value={filters.fechaHasta}
            onChange={(e) => handleChange('fechaHasta', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Botón Limpiar */}
      {hasActiveFilters && (
        <div className="flex justify-end pt-2">
          <button
            onClick={handleClear}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
}