/**
 * Componente: EstadisticasSection
 * Version: v3.0 - TAILWIND V4 COMPLIANT
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-25
 * Descripción: Estadísticas - Completamente centrado con sintaxis v4
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
    <section className="py-12 md:py-16 bg-gradient-to-r from-gray-900 to-blue-900">
      <div className="container mx-auto px-4 md:px-6">
        {/* Grid centrado y responsive */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto">
          {STATS.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div 
                key={idx} 
                className="text-center transform hover:scale-110 transition-all duration-300"
              >
                {/* Icono con gradiente v4 */}
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white mx-auto mb-3 md:mb-4 shadow-lg">
                  <Icon className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                
                {/* Número */}
                <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
                  {stat.number}+
                </div>
                
                {/* Label */}
                <div className="text-xs md:text-sm lg:text-base text-gray-300 px-2">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}