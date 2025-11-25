/**
 * Componente: StaffSection
 * Version: v1.0
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-19
 * Descripción: Sección de staff de profesionales
 * Tipo: Server Component
 */

import { Users } from 'lucide-react';

interface Profesional {
  id: number;
  nombre: string;
  especialidad: string;
  descripcion: string;
}

const PROFESIONALES: Profesional[] = [
  {
    id: 1,
    nombre: 'Yuleisi Macalupu',
    especialidad: 'Especialista Gestión de Seguridad',
    descripcion: 'Ingeniera ambiental, experiencia en la implementación y auditoría de sistemas de gestión bajo normas ISO (9001, 14001, 45001, entre otras). Actualmente cursa una Maestría en Gerencia Empresarial en la Universidad Nacional de Piura.'
  },
  {
    id: 2,
    nombre: 'Dennis Paredes',
    especialidad: 'Especialista Gestión Pública',
    descripcion: 'Ingeniero de sistemas colegiado con más de 15 años de experiencia en sectores público y privado. Posee una maestría y un doctorado en Gestión Pública y Gobernabilidad.'
  },
  {
    id: 3,
    nombre: 'Liliana Perez',
    especialidad: 'Especialista Gestión Pedagógica',
    descripcion: 'Especialista Pedagógico Regional, capacitador docente en Temas de Gestión Escolar y Liderazgo Pedagógico, Evaluación Formativa en El CNEB en la UNT.'
  },
  {
    id: 4,
    nombre: 'Daniel Alva',
    especialidad: 'Especialista en Investigación',
    descripcion: 'Ingeniero de Sistemas, docente y analista de datos con experiencia en análisis de datos para el banco de la nación, MEF, Servir y Migraciones.'
  },
  {
    id: 5,
    nombre: 'Edith Pérez',
    especialidad: 'Especialista Gestión Pública',
    descripcion: 'Profesional altamente capacitada y experimentada en los campos de la gestión pública, la educación y la salud comunitaria.'
  },
  {
    id: 6,
    nombre: 'Juan Uceda',
    especialidad: 'Especialista Metodología de la Investigación',
    descripcion: 'Con 15 años de experiencia en Educación Básica Regular y Universitaria, especialista en Didáctica de la Matemática, Didáctica de las Ciencias Sociales y Metodología de la Investigación.'
  }
];

export default function StaffSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        {/* Título de sección */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-blue-900 mb-4">
            Staff de Profesionales
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            CEFIB se dedica a la capacitación y formación profesional, ofreciendo programas de alta calidad
            con un equipo de expertos comprometidos
          </p>
        </div>

        {/* Lista de profesionales */}
        <div className="space-y-4">
          {PROFESIONALES.map((profesional) => (
            <div
              key={profesional.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
            >
              <div className="p-6 flex items-center gap-6">
                {/* Número identificador */}
                <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-2xl shrink-0">
                  {profesional.id}
                </div>

                {/* Información del profesional */}
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {profesional.nombre}
                  </h3>
                  <p className="text-orange-500 font-semibold mb-2">
                    {profesional.especialidad}
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {profesional.descripcion}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}