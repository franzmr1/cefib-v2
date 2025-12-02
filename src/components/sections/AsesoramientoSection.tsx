/**
 * Componente: AsesoramientoSection
 * Version: v5.0 - Circuitos + diagonales combinados + colores suavizados
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-27
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
    <section id="asesoramiento" className="relative py-16 md:py-20 overflow-hidden bg-white">
      {/* Fondo degradado sutil */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-white to-orange-50/30" />
      
      {/* ✅ COMBINACIÓN: Circuitos + Líneas Diagonales */}
      
      {/* ✅ PATRÓN DE CIRCUITOS MÁS VISIBLE */}

{/* Circuitos - Esquina superior izquierda (AZUL) */}
<div 
  className="absolute top-0 left-0 w-1/2 md:w-2/5 h-2/5 opacity-[0.12] pointer-events-none"
  style={{
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23003366' stroke-width='2'%3E%3Ccircle cx='20' cy='20' r='4'/%3E%3Ccircle cx='80' cy='20' r='4'/%3E%3Ccircle cx='50' cy='50' r='4'/%3E%3Ccircle cx='20' cy='80' r='4'/%3E%3Ccircle cx='80' cy='80' r='4'/%3E%3Cline x1='20' y1='20' x2='50' y2='50'/%3E%3Cline x1='80' y1='20' x2='50' y2='50'/%3E%3Cline x1='50' y1='50' x2='20' y2='80'/%3E%3Cline x1='50' y1='50' x2='80' y2='80'/%3E%3C/g%3E%3C/svg%3E")`,
    backgroundSize: '100px 100px'
  }}
/>

{/* Circuitos - Esquina inferior derecha (NARANJA) */}
<div 
  className="absolute bottom-0 right-0 w-1/2 md:w-2/5 h-2/5 opacity-[0.50] pointer-events-none"
  style={{
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23FF6B35' stroke-width='2'%3E%3Ccircle cx='20' cy='20' r='4'/%3E%3Ccircle cx='80' cy='20' r='4'/%3E%3Ccircle cx='50' cy='50' r='4'/%3E%3Ccircle cx='20' cy='80' r='4'/%3E%3Ccircle cx='80' cy='80' r='4'/%3E%3Cline x1='20' y1='20' x2='50' y2='50'/%3E%3Cline x1='80' y1='20' x2='50' y2='50'/%3E%3Cline x1='50' y1='50' x2='20' y2='80'/%3E%3Cline x1='50' y1='50' x2='80' y2='80'/%3E%3C/g%3E%3C/svg%3E")`,
    backgroundSize: '100px 100px'
  }}
/>

      {/* Líneas diagonales decorativas */}
      <div className="absolute top-24 left-0 w-48 md:w-80 h-px bg-gradient-to-r from-[#003366]/15 to-transparent rotate-45 origin-left pointer-events-none" />
      <div className="absolute top-32 right-0 w-56 md:w-96 h-px bg-gradient-to-l from-[#FF6B35]/15 to-transparent -rotate-45 origin-right pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-40 md:w-72 h-px bg-gradient-to-r from-[#FF6B35]/12 to-transparent rotate-45 origin-left pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-40 md:w-72 h-px bg-gradient-to-l from-[#003366]/12 to-transparent -rotate-45 origin-right pointer-events-none" />
      <div className="absolute bottom-32 left-0 w-52 md:w-80 h-px bg-gradient-to-r from-[#003366]/15 to-transparent rotate-45 origin-left pointer-events-none" />
      <div className="absolute bottom-24 right-0 w-48 md:w-72 h-px bg-gradient-to-l from-[#FF6B35]/15 to-transparent -rotate-45 origin-right pointer-events-none" />

      {/* Contenido */}
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Título principal */}
        <div className="text-center mb-10 md:mb-14 relative">
          <div className="flex items-center justify-center gap-3 md:gap-4 mb-6 md:mb-8">
            <div className="h-0.5 w-12 md:w-20 bg-gradient-to-r from-transparent via-[#FF6B35] to-[#FF6B35] rounded-full" />
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] rounded-2xl flex items-center justify-center text-white shadow-xl transform hover:scale-110 hover:rotate-6 transition-all duration-300">
              <FileText className="w-8 h-8 md:w-10 md:h-10" />
            </div>
            <div className="h-0.5 w-12 md:w-20 bg-gradient-to-l from-transparent via-[#FF6B35] to-[#FF6B35] rounded-full" />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#003366] mb-3 md:mb-4 px-4">
            Asesoramiento de Investigación
          </h2>
          
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Somos consultores académicos líderes en el campo del asesoramiento de documentos de investigación
          </p>

          <div className="flex justify-center mt-6 md:mt-8">
            <div className="h-1 w-32 md:w-40 bg-gradient-to-r from-[#003366] via-[#FF6B35] to-[#003366] rounded-full" />
          </div>
        </div>

        {/* Card de Servicios */}
        <div className="relative bg-white rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-12 mb-10 md:mb-12 shadow-xl md:shadow-2xl border-2 border-gray-100 overflow-hidden">
          {/* Patrón de líneas cruzadas + circuitos combinados */}
          <div 
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(45deg, #003366 1px, transparent 1px),
                linear-gradient(-45deg, #FF6B35 1px, transparent 1px)
              `,
              backgroundSize: '30px 30px'
            }}
          />

          <div className="absolute top-0 left-0 w-full h-1. 5 md:h-2 bg-gradient-to-r from-[#003366] via-[#FF6B35] to-[#003366]" />

          <div className="absolute -top-10 -left-10 w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-[#FF6B35]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-32 h-32 md:w-40 md:h-40 bg-gradient-to-tl from-[#003366]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

          <h3 className="text-2xl sm:text-3xl font-bold text-[#003366] mb-6 md:mb-8 text-center relative z-10">
            Servicios de Asesoramiento
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 relative z-10">
            {SERVICIOS_ASESORAMIENTO.map((servicio, idx) => (
              <div
                key={idx}
                className="group relative bg-white rounded-xl p-4 md:p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 md:hover:-translate-y-2 border-2 border-gray-100 hover:border-[#FF6B35] overflow-hidden touch-manipulation"
              >
                <div className="absolute left-0 top-0 w-1 h-0 bg-gradient-to-b from-[#FF6B35] to-[#FF8C5A] group-hover:h-full transition-all duration-500" />
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50/0 to-orange-50/0 group-hover:from-orange-50/60 group-hover:to-transparent transition-all duration-300 pointer-events-none" />

                <div className="flex items-center gap-3 md:gap-4 relative z-10">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] rounded-full flex items-center justify-center text-white font-bold text-lg md:text-xl shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                    {servicio.num}
                  </div>
                  <p className="text-sm md:text-base text-gray-900 font-semibold group-hover:text-[#003366] transition-colors leading-tight">
                    {servicio. text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Metodología y Staff */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Card Metodología */}
          <div className="group relative bg-white rounded-xl md:rounded-2xl p-6 md:p-8 shadow-lg md:shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-blue-100 overflow-hidden touch-manipulation">
            {/* Patrón de ondas */}
            <div 
              className="absolute inset-0 opacity-[0.05] pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10 Q 12. 5 0, 25 10 T 50 10 T 75 10 T 100 10' stroke='%234F46E5' stroke-width='2' fill='none'/%3E%3C/svg%3E")`,
                backgroundSize: '100px 20px'
              }}
            />

            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                  <Lightbulb className="w-7 h-7 md:w-8 md:h-8" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-[#003366]">Metodología</h3>
              </div>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                Aplicamos metodologías de investigación rigurosas y actualizadas, adaptadas a las normas internacionales y locales, garantizando resultados de alta calidad académica.
              </p>
            </div>
          </div>

          {/* ✅ Card Staff - COLORES SUAVIZADOS */}
          <div className="group relative bg-white rounded-xl md:rounded-2xl p-6 md:p-8 shadow-lg md:shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 overflow-hidden touch-manipulation">
            {/* Patrón zigzag MÁS SUTIL */}
            <div 
              className="absolute inset-0 opacity-[0.02] pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 20 L 10 10 L 20 20 L 30 10 L 40 20' stroke='%23E11D48' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,
                backgroundSize: '40px 40px'
              }}
            />

            {/* Borde superior MÁS DISCRETO */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-400 via-pink-400 to-rose-400" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                {/* Icono con colores más suaves */}
                <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                  <Award className="w-7 h-7 md:w-8 md:h-8" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-[#003366]">Staff de Asesores</h3>
              </div>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                Contamos con un equipo de profesionales altamente calificados con grados de maestría y doctorado, especializados en diversas áreas del conocimiento. 
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 md:mt-12 text-center px-4">
          <a
            href={`https://wa.me/${SITE_CONFIG.contact. whatsapp}?text=${WHATSAPP_MESSAGE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 md:gap-3 bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-bold hover:from-[#FF8C5A] hover:to-[#FF6B35] transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 text-sm md:text-base touch-manipulation w-full sm:w-auto max-w-md"
          >
            <FileText className="w-5 h-5 shrink-0" />
            <span>Solicitar Servicio de Asesoramiento</span>
          </a>
        </div>
      </div>
    </section>
  );
}