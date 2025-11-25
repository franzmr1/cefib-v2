/**
 * Componente: AsesoramientoSection
 * Version: v1.0
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-19
 * Descripción: Sección de asesoramiento de investigación
 * Tipo: Server Component
 */

import { FileText, Lightbulb, Award } from 'lucide-react';
import { SITE_CONFIG, WHATSAPP_MESSAGE } from '@/constants';

const SERVICIOS_ASESORAMIENTO = [
  { num: '01', text: 'Planes y Proyectos' },
  { num: '02', text: 'Monografías' },
  { num: '03', text: 'Ensayos' },
  { num: '04', text: 'Tesis de Pre Grado' },
  { num: '05', text: 'Tesis de Maestría' },
  { num: '06', text: 'Tesis Doctoral' },
  { num: '07', text: 'Resolución de Similitud' },
  { num: '08', text: 'Publicación de Artículos Científicos' }
];

export default function AsesoramientoSection() {
  return (
    <section id="asesoramiento" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        {/* Título principal */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center text-white">
              <FileText className="w-10 h-10" />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-blue-900 mb-4">
            Asesoramiento de Investigación
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Somos consultores académicos líderes en el campo del asesoramiento de documentos de investigación
          </p>
        </div>

        {/* Servicios de Asesoramiento */}
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl p-8 md:p-12 mb-12">
          <h3 className="text-3xl font-bold text-blue-900 mb-8 text-center">
            Servicios de Asesoramiento
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICIOS_ASESORAMIENTO.map((servicio, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-orange-200"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-xl shrink-0">
                    {servicio.num}
                  </div>
                  <p className="text-gray-900 font-semibold">{servicio.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Metodología y Staff */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Metodología */}
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white">
                <Lightbulb className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Metodología</h3>
            </div>
            <p className="text-gray-700 leading-relaxed mb-6">
              Ayudamos a nuestros clientes a desarrollar metodologías de investigación sólidas y apropiadas
            </p>
            <a
              href={`https://wa.me/${SITE_CONFIG.contact.whatsapp}?text=${WHATSAPP_MESSAGE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:from-blue-600 hover:to-purple-600 transition-all"
            >
              Consultar Metodología
            </a>
          </div>

          {/* Staff de Asesores */}
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center text-white">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Staff de Asesores</h3>
            </div>
            <p className="text-gray-700 leading-relaxed mb-6">
              Nuestro equipo de asesores está compuesto por profesionales de alto nivel académico
            </p>
            <a
              href={`https://wa.me/${SITE_CONFIG.contact.whatsapp}?text=${WHATSAPP_MESSAGE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:from-red-600 hover:to-pink-600 transition-all"
            >
              Solicitar Asesoría
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}