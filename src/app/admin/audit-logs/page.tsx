/**
 * Página: Admin - Audit Logs
 * Version: v1.1 - CORREGIDO
 * Autor: Franz (@franzmr1)
 * Descripción: Panel para visualizar logs de auditoría
 */

'use client';

import { useEffect, useState } from 'react';
import { Shield, RefreshCw, Download, Filter } from 'lucide-react';

interface AuditLog {
  id: string;
  action: string;
  entity: string | null;
  entityId: string | null;
  details: any;
  ipAddress: string | null;
  userAgent: string | null;
  success: boolean;
  errorMessage: string | null;
  createdAt: string;
  user: {
    email: string;
    name: string | null;
  } | null;
}

interface LogStats {
  totalAcciones: number;      // ✅ CORREGIDO
  accionesFallidas: number;   // ✅ CORREGIDO
  tasaExito: string;          // ✅ CORREGIDO: Ya es string
  topAcciones: Array<{ action: string; count: number }>; // ✅ CORREGIDO
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState<LogStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/audit-logs');
      if (response.ok) {
        const data = await response.json();
        setLogs(data. logs);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    if (filter === 'all') return true;
    if (filter === 'failed') return ! log.success;
    if (filter === 'auth') return log.action. includes('LOGIN') || log.action.includes('LOGOUT');
    if (filter === 'security') {
    return [
      'BOT_DETECTED',
      'LOGIN_BLOCKED_PERMANENT',
      'RATE_LIMIT_EXCEEDED_IP',
      'RATE_LIMIT_EXCEEDED_EMAIL',
      'CAPTCHA_REQUIRED',
      'CAPTCHA_FAILED',
    ].includes(log.action);
    }
    
    if (filter === 'bots') return log.action === 'BOT_DETECTED';
    if (filter === 'blocked') return log.action === 'LOGIN_BLOCKED_PERMANENT';
    return true;
  });

  const downloadCSV = () => {
    const csv = [
      ['Fecha', 'Usuario', 'Acción', 'Entidad', 'IP', 'Éxito'],
      ...filteredLogs. map((log) => [
        new Date(log.createdAt).toLocaleString('es-PE'),
        log.user?.email || 'Anónimo',
        log.action,
        log.entity || '-',
        log.ipAddress || '-',
        log.success ?  'Sí' : 'No',
      ]),
    ]
      .map((row) => row.join(','))
      . join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window. URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#003366]">Logs de Auditoría</h1>
              <p className="text-gray-600">Registro de actividades del sistema</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={fetchLogs}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-xl font-semibold hover:bg-gray-200 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${loading ?  'animate-spin' : ''}`} />
              Actualizar
            </button>

            <button
              onClick={downloadCSV}
              disabled={filteredLogs.length === 0}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
            >
              <Download className="w-5 h-5" />
              Descargar CSV
            </button>
          </div>
        </div>

        {/* Estadísticas */}
        {stats && (
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">Total Acciones</p>
              <p className="text-2xl font-bold text-[#003366]">{stats. totalAcciones}</p>
            </div>
            <div className="bg-red-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">Fallidas</p>
              <p className="text-2xl font-bold text-red-700">{stats.accionesFallidas}</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">Tasa de Éxito</p>
              {/* ✅ CORREGIDO: stats.tasaExito ya es string */}
              <p className="text-2xl font-bold text-green-700">{stats.tasaExito}%</p>
            </div>
          </div>
        )}
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <select
            value={filter}
            onChange={(e) => setFilter(e. target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">Todas las acciones</option>
            <option value="auth">Solo autenticación</option>
            <option value="failed">Solo fallidas</option>
          </select>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <RefreshCw className="w-8 h-8 text-purple-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Cargando logs... </p>
          </div>
        ) : filteredLogs. length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-600">No hay logs para mostrar</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Fecha</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Usuario</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Acción</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">IP</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(log.createdAt). toLocaleString('es-PE', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900">
                        {log.user?. email || 'Anónimo'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono text-gray-700">{log.action}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{log.ipAddress || '-'}</td>
                    <td className="px-6 py-4">
                      {log.success ? (
                        <span className="inline-flex items-center px-2. 5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Éxito
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Fallido
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}