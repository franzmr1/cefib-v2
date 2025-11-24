/**
 * Página: Dashboard Admin
 * Version: v1.1 - Corregido tipos TypeScript
 * Autor: Franz
 * Fecha: 2025-11-18
 * Tecnologías: Next.js 15.5.4, TypeScript 5.9.3
 * Descripción: Panel de administración con estadísticas
 */

import Link from 'next/link';
import { 
  BookOpen, Users, FileText, TrendingUp, 
  Plus, Settings
} from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { Card, CardBody } from '@/components/ui/Card';

/**
 * Tipo: Estadísticas del sistema
 */
interface Estadisticas {
  totalCursos: number;
  cursosActivos: number;
  totalUsuarios: number;
  cursosBorrador: number;
}

/**
 * Tipo: Curso reciente
 */
interface CursoReciente {
  id: string;
  titulo: string;
  estado: string;
  createdAt: Date;
}

/**
 * Obtiene estadísticas del sistema
 */
async function getEstadisticas(): Promise<Estadisticas> {
  try {
    const [totalCursos, cursosActivos, totalUsuarios] = await Promise.all([
      prisma.curso.count(),
      prisma.curso.count({ where: { estado: 'ACTIVO' } }),
      prisma.user.count(),
    ]);

    return {
      totalCursos,
      cursosActivos,
      totalUsuarios,
      cursosBorrador: totalCursos - cursosActivos,
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    return {
      totalCursos: 0,
      cursosActivos: 0,
      totalUsuarios: 0,
      cursosBorrador: 0,
    };
  }
}

/**
 * Obtiene cursos recientes
 */
async function getCursosRecientes(): Promise<CursoReciente[]> {
  try {
    const cursos = await prisma.curso.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        titulo: true,
        estado: true,
        createdAt: true,
      },
    });
    return cursos;
  } catch (error) {
    console.error('Error fetching recent courses:', error);
    return [];
  }
}

export default async function AdminDashboard() {
  const stats = await getEstadisticas();
  const cursosRecientes = await getCursosRecientes();

  const estadisticasCards = [
    {
      titulo: 'Total Cursos',
      valor: stats.totalCursos,
      icon: BookOpen,
      color: 'from-blue-500 to-blue-600',
      href: '/admin/cursos',
    },
    {
      titulo: 'Cursos Activos',
      valor: stats.cursosActivos,
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
      href: '/admin/cursos?filtro=activos',
    },
    {
      titulo: 'En Borrador',
      valor: stats.cursosBorrador,
      icon: FileText,
      color: 'from-orange-500 to-orange-600',
      href: '/admin/cursos?filtro=borrador',
    },
    {
      titulo: 'Usuarios',
      valor: stats.totalUsuarios,
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      href: '/admin/usuarios',
    },
  ];

  const accionesRapidas = [
    {
      titulo: 'Nuevo Curso',
      descripcion: 'Crear un nuevo programa',
      icon: Plus,
      href: '/admin/cursos/nuevo',
      color: 'bg-linear-to-r from-red-500 to-pink-500',
    },
    {
      titulo: 'Gestionar Cursos',
      descripcion: 'Ver y editar cursos',
      icon: BookOpen,
      href: '/admin/cursos',
      color: 'bg-linear-to-r from-blue-500 to-purple-500',
    },
    {
      titulo: 'Configuración',
      descripcion: 'Ajustes del sistema',
      icon: Settings,
      href: '/admin/configuracion',
      color: 'bg-linear-to-r from-gray-600 to-gray-700',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Panel de Administración
          </h1>
          <p className="text-gray-600 mt-1">
            Bienvenido al sistema de gestión de CEFIB
          </p>
        </div>
        <Link
          href="/admin/cursos/nuevo"
          className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-red-500 to-pink-500 text-white rounded-lg font-semibold hover:from-red-600 hover:to-pink-600 transition-all"
        >
          <Plus className="w-5 h-5" />
          Nuevo Curso
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {estadisticasCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Link key={index} href={stat.href}>
              <Card className="hover:shadow-xl transition-all cursor-pointer group">
                <CardBody className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{stat.titulo}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.valor}</p>
                    </div>
                    <div className={`w-16 h-16 rounded-2xl bg-linear-to-br ${stat.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                      <Icon className="w-8 h-8" />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Link>
          );
        })}
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Acciones Rápidas
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {accionesRapidas.map((accion, index) => {
            const Icon = accion.icon;
            return (
              <Link key={index} href={accion.href}>
                <Card className="hover:shadow-xl transition-all cursor-pointer group h-full">
                  <CardBody className="p-6">
                    <div className={`w-14 h-14 rounded-xl ${accion.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {accion.titulo}
                    </h3>
                    <p className="text-gray-600">{accion.descripcion}</p>
                  </CardBody>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Cursos Recientes
          </h2>
          <Link href="/admin/cursos" className="text-red-500 hover:text-red-600 font-semibold">
            Ver todos →
          </Link>
        </div>

        <Card>
          <CardBody className="p-0">
            {cursosRecientes.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {/* FIX v1.1: Tipado explícito del parámetro curso */}
                {cursosRecientes.map((curso: CursoReciente) => (
                  <Link
                    key={curso.id}
                    href={`/admin/cursos/editar/${curso.id}`}
                    className="block p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {curso.titulo}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Creado el{' '}
                          {new Date(curso.createdAt).toLocaleDateString('es-PE', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          curso.estado === 'ACTIVO'
                            ? 'bg-green-100 text-green-800'
                            : curso.estado === 'BORRADOR'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {curso.estado}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No hay cursos registrados</p>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}