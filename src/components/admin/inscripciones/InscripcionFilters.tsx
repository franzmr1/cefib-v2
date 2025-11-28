/**
 * Componente: InscripcionFilters
 * Versión: 1.1 - Corregido loop infinito
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-26
 */

'use client';

import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface Curso {
  id: string;
  titulo: string;
}

interface FilterValues {
  search: string;
  cursoId: string;
  estadoPago: string;
  asistencia: string;
  fechaDesde: string;
  fechaHasta: string;
}

interface InscripcionFiltersProps {
  onFilterChange: (filters: FilterValues) => void;
  totalResults: number;
}

export default function InscripcionFilters({ 
  onFilterChange, 
  totalResults 
}: InscripcionFiltersProps) {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [filters, setFilters] = useState<FilterValues>({
    search: '',
    cursoId: '',
    estadoPago: '',
    asistencia: '',
    fechaDesde: '',
    fechaHasta: '',
  });

  // ✅ Cargar cursos solo una vez
  useEffect(() => {
    fetchCursos();
  }, []);

  // ✅ CORREGIDO: No poner onFilterChange en dependencias
  useEffect(() => {
    onFilterChange(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]); // Solo cuando cambian los filtros

  const fetchCursos = async () => {
    try {
      const response = await fetch('/api/cursos');
      if (response.ok) {
        const data = await response.json();
        setCursos(data. cursos || []);
      }
    } catch (error) {
      console.error('Error fetching cursos:', error);
    }
  };

  const handleChange = (key: keyof FilterValues, value: string) => {
    setFilters(prev => ({ ... prev, [key]: value }));
  };

  const handleClear = () => {
    setFilters({
      search: '',
      cursoId: '',
      estadoPago: '',
      asistencia: '',
      fechaDesde: '',
      fechaHasta: '',
    });
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== '');

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
      {/* Título y resultados */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Filtros</h3>
        <span className="text-sm text-gray-600">
          {totalResults} resultado{totalResults !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Búsqueda */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Buscar
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Nombre, documento, email..."
              value={filters.search}
              onChange={(e) => handleChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Curso */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Curso
          </label>
          <select
            value={filters.cursoId}
            onChange={(e) => handleChange('cursoId', e.target. value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
          >
            <option value="">Todos los cursos</option>
            {cursos.map(curso => (
              <option key={curso.id} value={curso.id}>
                {curso.titulo}
              </option>
            ))}
          </select>
        </div>

        {/* Estado de Pago */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estado de Pago
          </label>
          <select
            value={filters.estadoPago}
            onChange={(e) => handleChange('estadoPago', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
          >
            <option value="">Todos</option>
            <option value="PAGADO">Pagado</option>
            <option value="PENDIENTE">Pendiente</option>
            <option value="NO_PAGADO">No Pagado</option>
          </select>
        </div>

        {/* Asistencia */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Asistencia
          </label>
          <select
            value={filters.asistencia}
            onChange={(e) => handleChange('asistencia', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
          >
            <option value="">Todos</option>
            <option value="SI">Asistieron</option>
            <option value="NO">No asistieron</option>
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Botón limpiar */}
      {hasActiveFilters && (
        <div className="flex justify-end">
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