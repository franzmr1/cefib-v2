/**
 * Componente: ServiciosSection
 * Version: v1.0
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-19
 * Descripción: Sección de servicios/programas de capacitación
 * Tipo: Server Component
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
    <section id="servicios" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        {/* Título de sección */}
        <div className="text-center mb-16">
          <div className="text-red-500 font-semibold mb-4 uppercase tracking-wider">
            Nuestros Servicios
          </div>
          <h2 className="text-4xl font-bold text-blue-900 mb-4">
            PROGRAMAS DE CAPACITACIÓN
          </h2>
        </div>

        {/* Grid de servicios */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICIOS.map((servicio) => {
            const Icon = servicio.icon;
            return (
              <div
                key={servicio.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group transform hover:-translate-y-2"
              >
                <div className="p-8">
                  <div className={`w-20 h-20 bg-linear-to-br ${servicio.color} rounded-2xl flex items-center justify-center text-white mb-6 transform group-hover:scale-110 transition-transform`}>
                    <Icon className="w-12 h-12" />
                  </div>
                  <h3 className="text-2xl font-bold text-blue-900 mb-4">
                    {servicio.titulo}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {servicio.descripcion}
                  </p>
                  <button className="inline-flex items-center text-red-500 font-semibold hover:gap-3 transition-all group">
                    Leer Más
                    <ChevronRight className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
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