/**
 * Página: Admin - Suscriptores Newsletter
 * Version: v1. 0
 * Descripción: Panel para ver emails suscritos
 */

'use client';

import { useEffect, useState } from 'react';
import { Mail, Download, RefreshCw, Users } from 'lucide-react';

interface Subscriber {
  id: string;
  email: string;
  subscribedAt: string;
  ipAddress?: string;
}

export default function SubscribersAdminPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSubscribers = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        headers: {
          'Authorization': `Bearer ${process.env. NEXT_PUBLIC_ADMIN_SECRET_KEY}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al cargar suscriptores');
      }

      const data = await response.json();
      setSubscribers(data.subscribers);
    } catch (err) {
      setError('Error al cargar los datos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const downloadCSV = () => {
    const csv = [
      ['Email', 'Fecha de Suscripción', 'IP'],
      ...subscribers.map((sub) => [
        sub. email,
        new Date(sub.subscribedAt).toLocaleString('es-PE'),
        sub.ipAddress || 'N/A',
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document. createElement('a');
    a. href = url;
    a. download = `suscriptores_${new Date().toISOString().split('T')[0]}. csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] rounded-2xl flex items-center justify-center">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#003366]">
                  Suscriptores Newsletter
                </h1>
                <p className="text-gray-600">
                  Total: {subscribers.length} {subscribers. length === 1 ? 'suscriptor' : 'suscriptores'}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={fetchSubscribers}
                disabled={loading}
                className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-xl font-semibold hover:bg-gray-200 transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${loading ?  'animate-spin' : ''}`} />
                Actualizar
              </button>

              <button
                onClick={downloadCSV}
                disabled={subscribers.length === 0}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
              >
                <Download className="w-5 h-5" />
                Descargar CSV
              </button>
            </div>
          </div>

          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">Total Suscriptores</p>
              <p className="text-2xl font-bold text-[#003366]">{subscribers. length}</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">Esta Semana</p>
              <p className="text-2xl font-bold text-green-700">
                {subscribers.filter((sub) => {
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return new Date(sub.subscribedAt) > weekAgo;
                }).length}
              </p>
            </div>
            <div className="bg-orange-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">Hoy</p>
              <p className="text-2xl font-bold text-[#FF6B35]">
                {subscribers.filter((sub) => {
                  const today = new Date(). toDateString();
                  return new Date(sub.subscribedAt). toDateString() === today;
                }).length}
              </p>
            </div>
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {loading ?  (
            <div className="p-12 text-center">
              <RefreshCw className="w-8 h-8 text-[#FF6B35] animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Cargando suscriptores...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center">
              <p className="text-red-600">{error}</p>
            </div>
          ) : subscribers.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No hay suscriptores aún</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">#</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Fecha de Suscripción</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">IP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {subscribers.map((subscriber, idx) => (
                    <tr key={subscriber.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-600">{idx + 1}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-[#FF6B35]" />
                          <span className="font-medium text-gray-900">{subscriber.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(subscriber.subscribedAt).toLocaleString('es-PE', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {subscriber.ipAddress || 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}