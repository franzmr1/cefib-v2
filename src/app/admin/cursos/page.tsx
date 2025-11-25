/**
 * Página: Gestión de Cursos
 * Version: v3.0 - TAILWIND V4 COMPLIANT
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-25
 * Descripción: Lista y gestión de cursos - Sintaxis v4 + UI mejorado
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Filter, Loader2 } from 'lucide-react';
import CursoTable from '@/components/admin/cursos/CursoTable';

interface Curso {
  id: string;
  titulo: string;
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

export default function CursosPage() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [filteredCursos, setFilteredCursos] = useState<Curso[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('');
  const [modalidadFilter, setModalidadFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Cargar todos los cursos al montar el componente
   */
  useEffect(() => {
    fetchCursos();
  }, []);

  const fetchCursos = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/cursos/admin');
      if (response.ok) {
        const data = await response.json();
        setCursos(data.cursos || []);
        setFilteredCursos(data.cursos || []);
      }
    } catch (error) {
      console.error('Error loading cursos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Aplicar filtros cada vez que cambien los criterios
   */
  useEffect(() => {
    let filtered = [...cursos];

    // Filtro por búsqueda (título o descripción)
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (curso) =>
          curso.titulo.toLowerCase().includes(searchLower) ||
          (curso.creador.name && curso.creador.name.toLowerCase().includes(searchLower))
      );
    }

    // Filtro por estado
    if (estadoFilter) {
      filtered = filtered.filter((curso) => curso.estado === estadoFilter);
    }

    // Filtro por modalidad
    if (modalidadFilter) {
      filtered = filtered.filter((curso) => curso.modalidad === modalidadFilter);
    }

    setFilteredCursos(filtered);
  }, [searchTerm, estadoFilter, modalidadFilter, cursos]);

  /**
   * Limpiar todos los filtros
   */
  const clearFilters = () => {
    setSearchTerm('');
    setEstadoFilter('');
    setModalidadFilter('');
  };

  /**
   * Estadísticas calculadas
   */
  const stats = {
    total: cursos.length,
    activos: cursos.filter((c) => c.estado === 'ACTIVO').length,
    borradores: cursos.filter((c) => c.estado === 'BORRADOR').length,
    archivados: cursos.filter((c) => c.estado === 'ARCHIVADO').length,
  };

  const hasActiveFilters = searchTerm || estadoFilter || modalidadFilter;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Gestión de Cursos</h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">
            Administra todos los cursos y programas de formación
          </p>
        </div>
        <Link
          href="/admin/cursos/nuevo"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg font-semibold hover:from-red-600 hover:to-pink-600 transition-all shadow-md hover:shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>Nuevo Curso</span>
        </Link>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h2 className="font-semibold text-gray-900">Filtros</h2>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="ml-auto text-sm text-red-500 hover:text-red-600 font-semibold"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Búsqueda */}
          <div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="search"
                placeholder="Buscar cursos por título..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Filtro por estado */}
          <div>
            <select
              value={estadoFilter}
              onChange={(e) => setEstadoFilter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white text-sm"
            >
              <option value="">Todos los estados</option>
              <option value="ACTIVO">Activos</option>
              <option value="BORRADOR">Borradores</option>
              <option value="ARCHIVADO">Archivados</option>
            </select>
          </div>

          {/* Filtro por modalidad */}
          <div>
            <select
              value={modalidadFilter}
              onChange={(e) => setModalidadFilter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white text-sm"
            >
              <option value="">Todas las modalidades</option>
              <option value="VIRTUAL">Virtual</option>
              <option value="PRESENCIAL">Presencial</option>
              <option value="HIBRIDO">Híbrido</option>
            </select>
          </div>
        </div>

        {/* Contador de resultados */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Mostrando{' '}
            <span className="font-semibold text-gray-900">{filteredCursos.length}</span> de{' '}
            <span className="font-semibold text-gray-900">{stats.total}</span> cursos
            {hasActiveFilters && ' (filtrado)'}
          </p>
        </div>
      </div>

      {/* Tabla de cursos */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
            <p className="ml-3 text-gray-600">Cargando cursos...</p>
          </div>
        ) : (
          <CursoTable cursos={filteredCursos} onRefresh={fetchCursos} />
        )}
      </div>

      {/* Resumen de estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-blue-50 rounded-lg p-4 md:p-6">
          <p className="text-xs md:text-sm text-blue-600 font-semibold">Total Cursos</p>
          <p className="text-2xl md:text-3xl font-bold text-blue-900 mt-2">{stats.total}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 md:p-6">
          <p className="text-xs md:text-sm text-green-600 font-semibold">Activos</p>
          <p className="text-2xl md:text-3xl font-bold text-green-900 mt-2">{stats.activos}</p>
        </div>
        <div className="bg-orange-50 rounded-lg p-4 md:p-6">
          <p className="text-xs md:text-sm text-orange-600 font-semibold">Borradores</p>
          <p className="text-2xl md:text-3xl font-bold text-orange-900 mt-2">{stats.borradores}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 md:p-6">
          <p className="text-xs md:text-sm text-gray-600 font-semibold">Archivados</p>
          <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">{stats.archivados}</p>
        </div>
      </div>
    </div>
  );
}