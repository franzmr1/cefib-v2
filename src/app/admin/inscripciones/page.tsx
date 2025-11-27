/**
 * Página: Gestión de Inscripciones
 * Versión: 1.3 - Client Component
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-26
 */

'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import InscripcionTable from '@/components/admin/inscripciones/InscripcionTable';

export default function InscripcionesPage() {
  const [inscripciones, setInscripciones] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pagadas: 0,
    pendientes: 0,
    asistieron: 0,
    totalRecaudado: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  const fetchInscripciones = async () => {
    try {
      const response = await fetch('/api/inscripciones');
      if (response.ok) {
        const data = await response.json();
        setInscripciones(data.inscripciones || []);
        
        // Calcular estadísticas
        const inscripcionesData = data.inscripciones || [];
        const pagadas = inscripcionesData. filter((i: any) => i.estadoPago === 'PAGADO'). length;
        const pendientes = inscripcionesData.filter((i: any) => i.estadoPago === 'PENDIENTE').length;
        const asistieron = inscripcionesData. filter((i: any) => i.asistio). length;
        const totalRecaudado = inscripcionesData. reduce((sum: number, i: any) => sum + (i.montoPagado || 0), 0);

        setStats({
          total: inscripcionesData.length,
          pagadas,
          pendientes,
          asistieron,
          totalRecaudado,
        });
      }
    } catch (error) {
      console.error('Error fetching inscripciones:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/usuarios/me');
        if (response.ok) {
          const data = await response. json();
          setUserRole(data.user.role);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      }
    };

    checkAuth();
    fetchInscripciones();
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    fetchInscripciones();
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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Gestión de Inscripciones
          </h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">
            Administra las inscripciones, pagos y asistencias
          </p>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600">Total Inscripciones</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600">Pagos Completados</div>
          <div className="text-2xl font-bold text-green-600 mt-1">{stats.pagadas}</div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600">Pagos Pendientes</div>
          <div className="text-2xl font-bold text-yellow-600 mt-1">{stats.pendientes}</div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600">Asistieron</div>
          <div className="text-2xl font-bold text-blue-600 mt-1">{stats.asistieron}</div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600">Total Recaudado</div>
          <div className="text-2xl font-bold text-green-600 mt-1">
            S/ {stats.totalRecaudado.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Filtros Rápidos */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-700">Filtros rápidos:</span>
          <button className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition-colors">
            Todos
          </button>
          <button className="px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded-full text-sm transition-colors">
            Pagados
          </button>
          <button className="px-3 py-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-full text-sm transition-colors">
            Pendientes
          </button>
          <button className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full text-sm transition-colors">
            Asistieron
          </button>
        </div>
      </div>

      {/* Tabla */}
      <InscripcionTable 
        inscripciones={inscripciones} 
        onRefresh={handleRefresh} 
        currentUserRole={userRole}
      />
    </div>
  );
}