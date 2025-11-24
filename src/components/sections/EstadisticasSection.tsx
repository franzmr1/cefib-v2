/**
 * Componente: EstadisticasSection
 * Version: v1.0
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-19
 * Descripción: Sección de estadísticas con números de impacto
 * Tipo: Server Component
 */

import { Target, BookOpen, TrendingUp, Users } from 'lucide-react';

interface Estadistica {
  number: string;
  label: string;
  icon: typeof Target;
}

const STATS: Estadistica[] = [
  { number: '368', label: 'Proyectos de éxito', icon: Target },
  { number: '180', label: 'Actividades de medios', icon: BookOpen },
  { number: '12', label: 'Staff Profesional', icon: TrendingUp },
  { number: '26K', label: 'Clientes Satisfechos', icon: Users },
];

export default function EstadisticasSection() {
  return (
    <section className="py-16 bg-linear-to-r from-gray-900 to-blue-900">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="text-center transform hover:scale-110 transition-all">
                <div className="w-20 h-20 bg-linear-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                  <Icon className="w-8 h-8" />
                </div>
                <div className="text-4xl font-bold text-white mb-2">
                  {stat.number}+
                </div>
                <div className="text-gray-300">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}