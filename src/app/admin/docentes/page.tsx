/**
 * Página: Gestión de Docentes
 * Versión: 1.1 - Client Component
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-26
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Loader2 } from 'lucide-react';
import DocenteTable from '@/components/admin/docentes/DocenteTable';

export default function DocentesPage() {
  const router = useRouter();
  const [docentes, setDocentes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  const fetchDocentes = async () => {
    try {
      const response = await fetch('/api/docentes');
      if (response.ok) {
        const data = await response.json();
        setDocentes(data. docentes || []);
      }
    } catch (error) {
      console.error('Error fetching docentes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Obtener rol del usuario desde cookie o API
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/usuarios/me');
        if (response.ok) {
          const data = await response.json();
          setUserRole(data.user.role);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      }
    };

    checkAuth();
    fetchDocentes();
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    fetchDocentes();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
      </div>
    );
  }

  const docentesActivos = docentes.filter(d => d.estado === 'ACTIVO');
  const docentesConCursos = docentes.filter(d => d._count?. cursosAsignados > 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Gestión de Docentes
          </h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">
            Administra los docentes e instructores
          </p>
        </div>
        <Link
          href="/admin/docentes/nuevo"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg font-semibold hover:from-red-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          <span>Nuevo Docente</span>
        </Link>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600">Total Docentes</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{docentes.length}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600">Docentes Activos</div>
          <div className="text-2xl font-bold text-green-600 mt-1">{docentesActivos.length}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600">Con Cursos Asignados</div>
          <div className="text-2xl font-bold text-blue-600 mt-1">{docentesConCursos.length}</div>
        </div>
      </div>

      {/* Tabla */}
      <DocenteTable 
        docentes={docentes} 
        onRefresh={handleRefresh} 
        currentUserRole={userRole}
      />
    </div>
  );
}