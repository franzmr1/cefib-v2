/**
 * Página: Admin - Solicitudes de Programas Personalizados
 * Versión: 1.0
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-26
 */

'use client';

import { useEffect, useState } from 'react';
import { 
  FileText, 
  Filter, 
  Search, 
  Download,
  Eye,
  Loader2,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import SolicitudTable from '@/components/admin/solicitudes/SolicitudTable';
import SolicitudFilters from '@/components/admin/solicitudes/SolicitudFilters';
import SolicitudDetalle from '@/components/admin/solicitudes/SolicitudDetalle';

export default function SolicitudesAdminPage() {
  const [solicitudes, setSolicitudes] = useState<any[]>([]);
  const [filteredSolicitudes, setFilteredSolicitudes] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    nuevo: 0,
    enRevision: 0,
    contactado: 0,
    cerrado: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSolicitud, setSelectedSolicitud] = useState<any>(null);
  const [showDetalle, setShowDetalle] = useState(false);

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  const fetchSolicitudes = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/solicitudes');
      
      if (!response.ok) {
        throw new Error('Error al cargar solicitudes');
      }

      const data = await response.json();
      setSolicitudes(data. solicitudes || []);
      setFilteredSolicitudes(data.solicitudes || []);
      setStats(data.stats || {
        total: 0,
        nuevo: 0,
        enRevision: 0,
        contactado: 0,
        cerrado: 0,
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (filters: any) => {
    let filtered = [...solicitudes];

    // Filtro por búsqueda
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(s =>
        s.nombres.toLowerCase().includes(searchLower) ||
        s.email.toLowerCase().includes(searchLower) ||
        s.empresa?. toLowerCase().includes(searchLower) ||
        s.folio. toLowerCase().includes(searchLower)
      );
    }

    // Filtro por estado
    if (filters.estado) {
      filtered = filtered.filter(s => s.estado === filters.estado);
    }

    // Filtro por servicio
    if (filters.servicio) {
      filtered = filtered.filter(s => s.servicioInteres === filters.servicio);
    }

    // Filtro por prioridad
    if (filters.prioridad) {
      filtered = filtered.filter(s => s.prioridad === filters. prioridad);
    }

    // Filtro por fechas
    if (filters.fechaDesde) {
      filtered = filtered.filter(s => 
        new Date(s.createdAt) >= new Date(filters.fechaDesde)
      );
    }

    if (filters.fechaHasta) {
      filtered = filtered.filter(s => 
        new Date(s.createdAt) <= new Date(filters.fechaHasta)
      );
    }

    setFilteredSolicitudes(filtered);
  };

  const handleVerDetalle = (solicitud: any) => {
    setSelectedSolicitud(solicitud);
    setShowDetalle(true);
  };

  const handleExportarExcel = () => {
    // TODO: Implementar exportación a Excel
    console.log('Exportar a Excel');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FileText className="w-8 h-8 text-[#FF6B35]" />
            Solicitudes de Programas
          </h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">
            Gestiona las solicitudes de programas personalizados
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              showFilters
                ? 'bg-[#FF6B35] text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filtros
          </button>

          <button
            onClick={handleExportarExcel}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Exportar</span>
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total</span>
            <FileText className="w-5 h-5 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-xs text-gray-500 mt-1">Solicitudes</div>
        </div>

        {/* Nuevas */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-blue-700 font-medium">Nuevas</span>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-900">{stats.nuevo}</div>
          <div className="text-xs text-blue-600 mt-1">Sin revisar</div>
        </div>

        {/* En Revisión */}
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200 p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-yellow-700 font-medium">En Revisión</span>
            <Clock className="w-5 h-5 text-yellow-600" />
          </div>
          <div className="text-2xl font-bold text-yellow-900">{stats.enRevision}</div>
          <div className="text-xs text-yellow-600 mt-1">Procesando</div>
        </div>

        {/* Contactadas */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-purple-700 font-medium">Contactadas</span>
            <CheckCircle2 className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-900">{stats.contactado}</div>
          <div className="text-xs text-purple-600 mt-1">En seguimiento</div>
        </div>

        {/* Cerradas */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-green-700 font-medium">Cerradas</span>
            <AlertCircle className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-900">{stats.cerrado}</div>
          <div className="text-xs text-green-600 mt-1">Finalizadas</div>
        </div>
      </div>

      {/* Filtros */}
      {showFilters && (
        <SolicitudFilters 
          onFilterChange={handleFilterChange}
          totalResults={filteredSolicitudes.length}
        />
      )}

      {/* Tabla */}
      <SolicitudTable
        solicitudes={filteredSolicitudes}
        onVerDetalle={handleVerDetalle}
        onRefresh={fetchSolicitudes}
      />

      {/* Modal Detalle */}
      {showDetalle && selectedSolicitud && (
        <SolicitudDetalle
          solicitud={selectedSolicitud}
          isOpen={showDetalle}
          onClose={() => {
            setShowDetalle(false);
            setSelectedSolicitud(null);
          }}
          onUpdate={fetchSolicitudes}
        />
      )}
    </div>
  );
}