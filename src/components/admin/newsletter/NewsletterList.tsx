/**
 * Componente: Lista de Newsletter
 * Version: v1.0
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-12-07
 */

'use client';

import { useState, useEffect } from 'react';
import { Mail, Calendar, Globe, Search, Download, CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface Suscriptor {
  id: string;
  email: string;
  subscribedAt: string;
  activo: boolean;
  origen: string | null;
  ipAddress: string | null;
}

export default function NewsletterList() {
  const [suscriptores, setSuscriptores] = useState<Suscriptor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchSuscriptores();
  }, [filter]);

  const fetchSuscriptores = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter === 'active') params.set('activo', 'true');
      if (filter === 'inactive') params. set('activo', 'false');

      const response = await fetch(`/api/newsletter/subscribe?${params}`);
      const data = await response.json();

      if (response.ok) {
        setSuscriptores(data. subscribers || []);
        setTotal(data.total || 0);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
  // ✅ Función para escapar campos CSV correctamente
  const escapeCsvField = (field: any): string => {
    if (field === null || field === undefined) return '';
    
    const str = String(field);
    
    // Si contiene coma, comilla doble, punto y coma, o salto de línea, envolver en comillas
    if (str.includes(',') || str.includes('"') || str.includes(';') || str.includes('\n') || str.includes('\r')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    
    return str;
  };

  // Headers
  const headers = ['Email', 'Estado', 'Fecha de Suscripción', 'Origen', 'IP'];

  // Filas de datos
  const rows = filteredSuscriptores.map(s => [
    escapeCsvField(s.email),
    escapeCsvField(s.activo ? 'Activo' : 'Inactivo'),
    escapeCsvField(
      new Date(s.subscribedAt).toLocaleDateString('es-PE', {
        day: '2-digit',
        month:  '2-digit',
        year:  'numeric',
      })
    ),
    escapeCsvField(s.origen || 'N/A'),
    escapeCsvField(s.ipAddress || 'N/A'),
  ]);

  // ✅ Usar punto y coma como delimitador (mejor para Excel en español)
  const delimiter = ';';

  const csvContent = [
    headers.join(delimiter),
    ...rows.map(row => row.join(delimiter))
  ].join('\r\n'); // CRLF para Windows

  // ✅ Agregar BOM UTF-8 para caracteres especiales
  const BOM = '\uFEFF';

  const blob = new Blob([BOM + csvContent], { 
    type: 'text/csv;charset=utf-8;' 
  });
  
  const url = window.URL.createObjectURL(blob);
  const a = document. createElement('a');
  a.href = url;
  
  // Nombre descriptivo con fecha
  const timestamp = new Date().toISOString().split('T')[0];
  a.download = `CEFIB_Newsletter_${timestamp}.csv`;
  
  a.click();
  window.URL.revokeObjectURL(url);
};

  const filteredSuscriptores = suscriptores. filter(s =>
    s.email.toLowerCase(). includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Filtros */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Búsqueda */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por email..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Botón exportar */}
          <button
            onClick={exportToCSV}
            disabled={filteredSuscriptores.length === 0}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            Exportar CSV
          </button>
        </div>

        {/* Filtros de estado */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filter === 'all'
                ? 'bg-orange-100 text-orange-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todos ({total})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
              filter === 'active'
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            Activos
          </button>
          <button
            onClick={() => setFilter('inactive')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
              filter === 'inactive'
                ? 'bg-red-100 text-red-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <XCircle className="w-4 h-4" />
            Inactivos
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Cargando suscriptores...</p>
          </div>
        ) : filteredSuscriptores.length === 0 ? (
          <div className="p-12 text-center">
            <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl font-semibold text-gray-900 mb-2">
              {search ? 'No se encontraron resultados' : 'No hay suscriptores'}
            </p>
            <p className="text-gray-600">
              {search ? 'Intenta con otro término de búsqueda' : 'Los suscriptores aparecerán aquí'}
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Estado
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Origen
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Fecha de suscripción
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  IP
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSuscriptores.map((suscriptor) => (
                <tr key={suscriptor.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-orange-600" />
                      </div>
                      <span className="font-medium text-gray-900">
                        {suscriptor. email}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1. 5 px-3 py-1 rounded-full text-xs font-semibold ${
                        suscriptor.activo
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${
                        suscriptor.activo ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      {suscriptor.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Globe className="w-4 h-4" />
                      <span className="capitalize">{suscriptor.origen || 'Website'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(suscriptor.subscribedAt).toLocaleDateString('es-PE', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500 font-mono">
                      {suscriptor.ipAddress || 'N/A'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer con contador */}
      {! loading && filteredSuscriptores.length > 0 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            Mostrando <span className="font-semibold text-gray-900">{filteredSuscriptores.length}</span> de{' '}
            <span className="font-semibold text-gray-900">{total}</span> suscriptores
          </p>
        </div>
      )}
    </div>
  );
}