/**
 * Página: Admin - Newsletter
 * Ruta: /admin/newsletter
 * Version: v1.0
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-12-07
 */

import { Metadata } from 'next';
import { Mail, Download, Users, TrendingUp } from 'lucide-react';
import NewsletterList from '@/components/admin/newsletter/NewsletterList';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Newsletter - Admin CEFIB',
  description: 'Gestión de suscriptores del newsletter',
};

async function getStats() {
  const [total, activos, ultimos30dias] = await Promise.all([
    prisma. newsletter.count(),
    prisma.newsletter.count({ where: { activo: true } }),
    prisma.newsletter.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    }),
  ]);

  return { total, activos, ultimos30dias };
}

export default async function NewsletterAdminPage() {
  const stats = await getStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Newsletter</h1>
              <p className="text-gray-600">Gestiona los suscriptores del newsletter</p>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Suscriptores</p>
                <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-green-600 font-medium">Activos</p>
                <p className="text-2xl font-bold text-green-900">{stats. activos}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-purple-600 font-medium">Últimos 30 días</p>
                <p className="text-2xl font-bold text-purple-900">{stats.ultimos30dias}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de suscriptores */}
      <NewsletterList />
    </div>
  );
}