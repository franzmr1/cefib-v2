/**
 * Componente: ServiciosSection
 * Version: v3.0 - TAILWIND V4 COMPLIANT
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-25
 * Descripción: Sección de servicios - Sintaxis v4 + Diseño mejorado y centrado
 */

import { 
  Briefcase, Heart, CheckCircle, GraduationCap, 
  Monitor, Flame, ChevronRight 
} from 'lucide-react';

interface Servicio {
  id: number;
  titulo: string;
  descripcion: string;
  icon: typeof Briefcase;
  color: string;
}

const SERVICIOS: Servicio[] = [
  {
    id: 1,
    titulo: 'Proyectos Y Planes',
    descripcion: 'Un plan está constituido por un conjunto de programas integrados que buscan alcanzar objetivos estratégicos.',
    icon: Briefcase,
    color: 'from-red-500 to-pink-500'
  },
  {
    id: 2,
    titulo: 'Salud',
    descripcion: 'Programas especializados en gestión hospitalaria, emergencias médicas y salud ocupacional.',
    icon: Heart,
    color: 'from-red-500 to-pink-500'
  },
  {
    id: 3,
    titulo: 'Gestión Pública',
    descripcion: 'Desarrollo de competencias para liderar y transformar instituciones del Estado.',
    icon: CheckCircle,
    color: 'from-red-500 to-pink-500'
  },
  {
    id: 4,
    titulo: 'Educación',
    descripcion: 'Pedagogía moderna, diseño curricular, evaluación por competencias y liderazgo pedagógico.',
    icon: GraduationCap,
    color: 'from-red-500 to-pink-500'
  },
  {
    id: 5,
    titulo: 'Tecnología',
    descripcion: 'Transformación digital, ciberseguridad, cloud computing e inteligencia artificial.',
    icon: Monitor,
    color: 'from-red-500 to-pink-500'
  },
  {
    id: 6,
    titulo: 'Energía Y Minería',
    descripcion: 'Gestión minera sostenible, seguridad y salud ocupacional, gestión ambiental.',
    icon: Flame,
    color: 'from-red-500 to-pink-500'
  }
];

export default function ServiciosSection() {
  return (
    <section id="servicios" className="py-16 md:py-20 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        {/* Título de sección */}
        <div className="text-center mb-12 md:mb-16">
          <div className="text-red-500 font-semibold mb-3 md:mb-4 uppercase tracking-wider text-sm md:text-base">
            Nuestros Servicios
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-900 mb-4">
            PROGRAMAS DE CAPACITACIÓN
          </h2>
        </div>

        {/* Grid de servicios - CENTRADO Y RESPONSIVE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
          {SERVICIOS.map((servicio) => {
            const Icon = servicio.icon;
            return (
              <div
                key={servicio.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group transform hover:-translate-y-2"
              >
                <div className="p-6 md:p-8">
                  {/* Icono con gradiente v4 */}
                  <div className={`w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br ${servicio.color} rounded-2xl flex items-center justify-center text-white mb-4 md:mb-6 transform group-hover:scale-110 transition-transform shadow-lg`}>
                    <Icon className="w-8 h-8 md:w-12 md:h-12" />
                  </div>
                  
                  {/* Título */}
                  <h3 className="text-xl md:text-2xl font-bold text-blue-900 mb-3 md:mb-4">
                    {servicio.titulo}
                  </h3>
                  
                  {/* Descripción */}
                  <p className="text-gray-600 mb-4 md:mb-6 leading-relaxed text-sm md:text-base">
                    {servicio.descripcion}
                  </p>
                  
                  {/* Botón leer más */}
                  <button className="inline-flex items-center text-red-500 font-semibold hover:gap-3 transition-all group text-sm md:text-base">
                    Leer Más
                    <ChevronRight className="ml-2 w-4 h-4 md:w-5 md:h-5 transform group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}