/**
 * Página:  Admin - Solicitudes de Programas Personalizados
 * Versión:  1.1 - Con exportación a CSV
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-12-07
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
import { showToast } from '@/lib/toast'; // ✅ AGREGAR

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
  const [isExporting, setIsExporting] = useState(false); // ✅ AGREGAR

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  const fetchSolicitudes = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/solicitudes');
      
      if (! response.ok) {
        throw new Error('Error al cargar solicitudes');
      }

      const data = await response.json();
      setSolicitudes(data. solicitudes || []);
      setFilteredSolicitudes(data. solicitudes || []);
      setStats(data.stats || {
        total: 0,
        nuevo: 0,
        enRevision: 0,
        contactado: 0,
        cerrado: 0,
      });
    } catch (error) {
      console.error('Error:', error);
      showToast.error('Error al cargar solicitudes'); // ✅ CAMBIADO
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
    if (filters. prioridad) {
      filtered = filtered.filter(s => s.prioridad === filters.prioridad);
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

  // ✅ FUNCIÓN MEJORADA: Exportar a CSV con formato Excel
const handleExport = () => {
  try {
    if (filteredSolicitudes.length === 0) {
      showToast. error('No hay solicitudes para exportar');
      return;
    }

    setIsExporting(true);

    // Mapeo de estados y servicios
    const ESTADO_LABELS:  Record<string, string> = {
      NUEVO: 'Nuevo',
      EN_REVISION: 'En Revisión',
      CONTACTADO: 'Contactado',
      EN_NEGOCIACION: 'En Negociación',
      CERRADO_EXITOSO: 'Cerrado Exitoso',
      CERRADO_SIN_EXITO: 'Cerrado Sin Éxito',
      CANCELADO: 'Cancelado',
    };

    const SERVICIO_LABELS: Record<string, string> = {
      PROYECTOS_PLANES: 'Proyectos Y Planes',
      SALUD:  'Salud',
      GESTION_PUBLICA: 'Gestión Pública',
      EDUCACION: 'Educación',
      TECNOLOGIA: 'Tecnología',
      ENERGIA_MINERIA: 'Energía y Minería',
      OTRO: 'Otro',
    };

    // ✅ Función para escapar campos CSV correctamente
    const escapeCsvField = (field: any): string => {
      if (field === null || field === undefined) return '';
      
      const str = String(field);
      
      // Si contiene coma, comilla doble, o salto de línea, envolver en comillas
      if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        // Escapar comillas dobles duplicándolas
        return `"${str.replace(/"/g, '""')}"`;
      }
      
      return str;
    };

    // Crear headers
    const headers = [
      'Folio',
      'Nombres',
      'Email',
      'Teléfono',
      'Empresa',
      'Cargo',
      'Servicio',
      'Tipo Programa',
      'N° Participantes',
      'Estado',
      'Prioridad',
      'Fecha Solicitud',
      'Cómo nos conoció',
      'Mensaje',
    ];

    // Crear filas de datos
    const rows = filteredSolicitudes.map(s => [
      escapeCsvField(s.folio),
      escapeCsvField(s.nombres),
      escapeCsvField(s.email),
      escapeCsvField(s.telefono || ''),
      escapeCsvField(s.empresa || ''),
      escapeCsvField(s. cargo || ''),
      escapeCsvField(SERVICIO_LABELS[s. servicioInteres] || s.servicioInteres),
      escapeCsvField(s.tipoPrograma === 'INDIVIDUAL' ? 'Individual' : 'Corporativo'),
      escapeCsvField(s.numParticipantes || ''),
      escapeCsvField(ESTADO_LABELS[s.estado] || s.estado),
      escapeCsvField(s.prioridad || ''),
      escapeCsvField(new Date(s.createdAt).toLocaleDateString('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })),
      escapeCsvField(s.comoNosConociste || ''),
      escapeCsvField(s.mensaje || ''),
    ]);

    // ✅ Combinar headers y rows con delimitador de punto y coma (mejor para Excel en español)
    const delimiter = ';'; // Punto y coma es mejor para Excel en español
    
    const csvContent = [
      headers.join(delimiter),
      ...rows.map(row => row.join(delimiter))
    ].join('\r\n'); // Usar CRLF para Windows

    // ✅ Agregar BOM UTF-8 para que Excel reconozca los caracteres especiales
    const BOM = '\uFEFF';
    
    // Crear blob con el contenido
    const blob = new Blob([BOM + csvContent], { 
      type: 'text/csv;charset=utf-8;' 
    });
    
    // Crear enlace de descarga
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    // Nombre del archivo con fecha y hora
    const now = new Date();
    const timestamp = now.toISOString().split('T')[0]; // YYYY-MM-DD
    link.download = `CEFIB_Solicitudes_${timestamp}.csv`;
    
    // Descargar
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    showToast.success(`✅ ${filteredSolicitudes.length} solicitudes exportadas exitosamente`);
  } catch (error) {
    console.error('Error al exportar:', error);
    showToast.error('Error al exportar solicitudes');
  } finally {
    setIsExporting(false);
  }
};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[#003366] to-[#004488] rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Solicitudes de Programas
            </h1>
            <p className="text-gray-600 mt-1 text-sm md:text-base">
              Gestiona las solicitudes de programas personalizados
            </p>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-5 h-5" />
            <span className="hidden sm:inline">Filtros</span>
          </button>

          {/* ✅ BOTÓN EXPORTAR ACTUALIZADO */}
          <button
            onClick={handleExport}
            disabled={isExporting || filteredSolicitudes.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="hidden sm:inline">Exportando...</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span className="hidden sm:inline">Exportar</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Total</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-xs text-gray-500 mt-1">Solicitudes</p>
        </div>

        <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-blue-600">Nuevas</span>
          </div>
          <p className="text-2xl font-bold text-blue-900">{stats.nuevo}</p>
          <p className="text-xs text-blue-600 mt-1">Sin revisar</p>
        </div>

        <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-yellow-600" />
            <span className="text-sm text-yellow-600">En Revisión</span>
          </div>
          <p className="text-2xl font-bold text-yellow-900">{stats. enRevision}</p>
          <p className="text-xs text-yellow-600 mt-1">Procesando</p>
        </div>

        <div className="bg-green-50 rounded-lg border border-green-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-600">Contactado</span>
          </div>
          <p className="text-2xl font-bold text-green-900">{stats.contactado}</p>
          <p className="text-xs text-green-600 mt-1">En seguimiento</p>
        </div>

        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-600">Cerrado</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.cerrado}</p>
          <p className="text-xs text-gray-600 mt-1">Finalizadas</p>
        </div>
      </div>

      {/* Filtros */}
      {showFilters && (
        <SolicitudFilters 
          onFilterChange={handleFilterChange}
          totalResults={filteredSolicitudes.length}
        />
      )}

      {/* Contador de resultados */}
      {filteredSolicitudes.length !== solicitudes.length && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            Mostrando <strong>{filteredSolicitudes.length}</strong> de{' '}
            <strong>{solicitudes.length}</strong> solicitudes
          </p>
        </div>
      )}

      {/* Tabla */}
      {isLoading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Loader2 className="w-12 h-12 text-[#FF6B35] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando solicitudes...</p>
        </div>
      ) : (
        <SolicitudTable
          solicitudes={filteredSolicitudes}
          onVerDetalle={(solicitud) => {
            setSelectedSolicitud(solicitud);
            setShowDetalle(true);
          }}
          onRefresh={fetchSolicitudes}
        />
      )}

      {/* Modal de Detalle */}
      {selectedSolicitud && (
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