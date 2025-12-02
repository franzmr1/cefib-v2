/**
 * Componente: AsesoramientoSection
 * Version: v2.0 - Con patrón de fondo elegante
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-27
 * Descripción: Sección de asesoramiento con diseño geométrico sofisticado
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
    <section id="asesoramiento" className="relative py-20 overflow-hidden">
      {/* Fondo con patrón diagonal elegante */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100" />
      
      {/* Patrón de líneas diagonales */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 35px,
              #003366 35px,
              #003366 37px
            ),
            repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 35px,
              #FF6B35 35px,
              #FF6B35 37px
            )
          `
        }}
      />

      {/* Círculos decorativos sutiles */}
      <div className="absolute top-10 right-10 w-64 h-64 bg-[#FF6B35] rounded-full blur-3xl opacity-5" />
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-[#003366] rounded-full blur-3xl opacity-5" />

      {/* Contenido */}
      <div className="container mx-auto px-6 relative z-10">
        {/* Título principal con fondo decorativo */}
        <div className="text-center mb-12 relative">
          {/* Línea decorativa superior */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-1 w-20 bg-gradient-to-r from-transparent to-[#FF6B35] rounded-full" />
            <div className="w-20 h-20 bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] rounded-2xl flex items-center justify-center text-white shadow-xl transform hover:scale-110 hover:rotate-6 transition-all duration-300">
              <FileText className="w-10 h-10" />
            </div>
            <div className="h-1 w-20 bg-gradient-to-l from-transparent to-[#FF6B35] rounded-full" />
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-[#003366] mb-4">
            Asesoramiento de Investigación
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Somos consultores académicos líderes en el campo del asesoramiento de documentos de investigación
          </p>

          {/* Línea decorativa inferior */}
          <div className="flex justify-center mt-6">
            <div className="h-1 w-40 bg-gradient-to-r from-[#003366] via-[#FF6B35] to-[#003366] rounded-full" />
          </div>
        </div>

        {/* Servicios de Asesoramiento - Card con patrón */}
        <div className="relative bg-white rounded-3xl p-8 md:p-12 mb-12 shadow-2xl border border-gray-200 overflow-hidden">
          {/* Patrón de fondo dentro de la card */}
          <div 
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `
                repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 20px,
                  #FF6B35 20px,
                  #FF6B35 21px
                ),
                repeating-linear-gradient(
                  90deg,
                  transparent,
                  transparent 20px,
                  #003366 20px,
                  #003366 21px
                )
              `
            }}
          />

          {/* Decoración superior izquierda */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-[#FF6B35]/10 to-transparent rounded-br-full" />
          
          {/* Decoración inferior derecha */}
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-[#003366]/10 to-transparent rounded-tl-full" />

          <h3 className="text-3xl font-bold text-[#003366] mb-8 text-center relative z-10">
            Servicios de Asesoramiento
          </h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {SERVICIOS_ASESORAMIENTO.map((servicio, idx) => (
              <div
                key={idx}
                className="group relative bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-[#FF6B35] overflow-hidden"
              >
                {/* Fondo animado al hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B35]/0 to-[#FF6B35]/0 group-hover:from-[#FF6B35]/5 group-hover:to-[#FF8C5A]/5 transition-all duration-300" />
                
                {/* Línea decorativa */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />

                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] rounded-full flex items-center justify-center text-white font-bold text-xl shrink-0 shadow-md group-hover:scale-110 transition-transform">
                    {servicio.num}
                  </div>
                  <p className="text-gray-900 font-semibold group-hover:text-[#003366] transition-colors">
                    {servicio.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Metodología y Staff */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Card Metodología */}
          <div className="group relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-200 overflow-hidden">
            {/* Patrón de fondo */}
            <div 
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `
                  repeating-linear-gradient(
                    135deg,
                    transparent,
                    transparent 10px,
                    #4F46E5 10px,
                    #4F46E5 11px
                  )
                `
              }}
            />

            {/* Decoración esquina */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-full" />

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                  <Lightbulb className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-[#003366]">Metodología</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Aplicamos metodologías de investigación rigurosas y actualizadas, adaptadas a las normas internacionales y locales, garantizando resultados de alta calidad académica.
              </p>
            </div>
          </div>

          {/* Card Staff de Asesores */}
          <div className="group relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-200 overflow-hidden">
            {/* Patrón de fondo */}
            <div 
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `
                  repeating-linear-gradient(
                    45deg,
                    transparent,
                    transparent 10px,
                    #EC4899 10px,
                    #EC4899 11px
                  )
                `
              }}
            />

            {/* Decoración esquina */}
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-500/10 to-transparent rounded-tr-full" />

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-red-600 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                  <Award className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-[#003366]">Staff de Asesores</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Contamos con un equipo de profesionales altamente calificados con grados de maestría y doctorado, especializados en diversas áreas del conocimiento.
              </p>
            </div>
          </div>
        </div>

        {/* CTA de contacto */}
        <div className="mt-12 text-center">
          <a
            href={`https://wa.me/${SITE_CONFIG.contact. whatsapp}?text=${WHATSAPP_MESSAGE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] text-white px-8 py-4 rounded-full font-bold hover:from-[#FF8C5A] hover:to-[#FF6B35] transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
          >
            <FileText className="w-5 h-5" />
            Solicitar Servicio de Asesoramiento
          </a>
        </div>
      </div>
    </section>
  );
}