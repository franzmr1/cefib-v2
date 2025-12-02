/**
 * Componente: NosotrosSection
 * Version: v3.0 - Con paginación tipo libro
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-27
 * Descripción: Sistema de paginación elegante para Misión/Visión y Objetivos
 */

'use client';

import { useState } from 'react';
import { SITE_CONFIG, WHATSAPP_MESSAGE } from '@/constants';
import Image from 'next/image';
import { Target, Rocket, Users, TrendingUp, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NosotrosSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 2;

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Variantes de animación
  const pageVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  // ✅ CORREGIDO: Añadido 'as const'
  const pageTransition = {
    type: 'tween' as const,
    ease: 'anticipate' as const,
    duration: 0.5,
  };

  return (
    <section id="nosotros" className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-br from-[#001a33] via-[#002244] to-[#001a33]">
      {/* Patrón de fondo sutil NARANJA */}
      <div 
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill='none' stroke='%23FF6B35' stroke-width='2'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Elementos decorativos */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-[#FF6B35] rounded-full blur-3xl opacity-5 pointer-events-none" />
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#003366] rounded-full blur-3xl opacity-5 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header fijo */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-bold mb-4 border border-white/20 shadow-xl">
            <Users className="w-4 h-4" />
            CEFIB TRAIN WIN LEADERS
          </div>
          
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
            QUIÉNES SOMOS
          </h2>

          <div className="flex justify-center mt-6">
            <div className="h-1 w-32 bg-gradient-to-r from-[#FF6B35] via-white to-[#FF6B35] rounded-full" />
          </div>
        </div>

        {/* Contenedor tipo libro con paginación */}
        <div className="relative max-w-7xl mx-auto">
          {/* Indicador de página superior */}
          <div className="flex items-center justify-between mb-6 px-4">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`p-3 rounded-full backdrop-blur-md transition-all ${
                currentPage === 1
                  ? 'bg-white/5 text-gray-600 cursor-not-allowed'
                  : 'bg-white/10 text-white hover:bg-white/20 hover:scale-110'
              }`}
              aria-label="Página anterior"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="text-white text-sm md:text-base font-semibold bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/20">
              <span className="text-[#FF6B35] text-lg">{currentPage}</span> / {totalPages}
            </div>

            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className={`p-3 rounded-full backdrop-blur-md transition-all ${
                currentPage === totalPages
                  ? 'bg-white/5 text-gray-600 cursor-not-allowed'
                  : 'bg-white/10 text-white hover:bg-white/20 hover:scale-110'
              }`}
              aria-label="Página siguiente"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Área de páginas con click */}
          <div
            onClick={nextPage}
            className={`relative min-h-[600px] md:min-h-[700px] ${
              currentPage < totalPages ?  'cursor-pointer' : 'cursor-default'
            }`}
          >
            <AnimatePresence initial={false} custom={currentPage} mode="wait">
              {/* PÁGINA 1: Misión y Visión */}
              {currentPage === 1 && (
                <motion.div
                  key="page1"
                  custom={1}
                  variants={pageVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={pageTransition}
                  className="space-y-12 md:space-y-16"
                >
                  {/* Misión */}
                  <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
                    <div className="relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden shadow-2xl group">
                      <Image
                        src="/images/NosotrosSection/Vision-mision.png"
                        alt="Misión CEFIB"
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#003366]/20 to-transparent" />
                      <div className="absolute bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] rounded-2xl flex items-center justify-center shadow-xl transform group-hover:scale-110 group-hover:rotate-12 transition-all">
                        <Target className="w-8 h-8 text-white" />
                      </div>
                    </div>

                    <div className="flex flex-col justify-center bg-white/5 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/10">
                      <div className="inline-flex items-center gap-2 text-[#FF8C5A] mb-4">
                        <div className="w-12 h-1 bg-[#FF8C5A] rounded-full" />
                        <span className="text-sm font-bold uppercase tracking-wider">Nuestra Misión</span>
                      </div>

                      <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        CEFIB Train Win Leaders
                      </h3>

                      <p className="text-base md:text-lg text-gray-300 leading-relaxed mb-6">
                        Fortalecer el rendimiento de las personas, organizaciones e instituciones mediante el conocimiento, aprendizaje y desarrollo de habilidades efectivas.
                      </p>

                      <div className="space-y-3 mb-8">
                        {[
                          'Capacitación profesional de alta calidad',
                          'Metodologías innovadoras y prácticas',
                          'Enfoque en resultados medibles'
                        ].map((item, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
                            <span className="text-gray-200">{item}</span>
                          </div>
                        ))}
                      </div>

                      <a
                        href={`https://wa.me/${SITE_CONFIG.contact. whatsapp}?text=${WHATSAPP_MESSAGE}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] text-white px-8 py-4 rounded-full font-bold hover:from-[#FF8C5A] hover:to-[#FF6B35] transition-all shadow-xl hover:shadow-2xl hover:shadow-[#FF6B35]/50 transform hover:scale-105 w-full sm:w-auto"
                      >
                        <Target className="w-5 h-5" />
                        Contáctenos
                      </a>
                    </div>
                  </div>

                  {/* Visión */}
                  <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
                    <div className="flex flex-col justify-center order-2 lg:order-1 bg-white/5 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/10">
                      <div className="inline-flex items-center gap-2 text-blue-400 mb-4">
                        <div className="w-12 h-1 bg-blue-400 rounded-full" />
                        <span className="text-sm font-bold uppercase tracking-wider">Nuestra Visión</span>
                      </div>

                      <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Líderes del Futuro
                      </h3>

                      <p className="text-base md:text-lg text-gray-300 leading-relaxed mb-6">
                        Ser líderes en el desarrollo y formación competitiva de personas y organizaciones, manteniendo el ritmo de la evolución y liderando en un mundo competitivo y en constante cambio.
                      </p>

                      <div className="space-y-3 mb-8">
                        {[
                          'Innovación constante en metodologías',
                          'Adaptación a las tendencias globales',
                          'Formación de líderes transformadores'
                        ].map((item, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
                            <span className="text-gray-200">{item}</span>
                          </div>
                        ))}
                      </div>

                      <a
                        href={`https://wa.me/${SITE_CONFIG. contact.whatsapp}?text=${WHATSAPP_MESSAGE}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 bg-white text-[#003366] px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl hover:shadow-white/30 transform hover:scale-105 w-full sm:w-auto"
                      >
                        <Rocket className="w-5 h-5" />
                        Conoce Más
                      </a>
                    </div>

                    <div className="relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden shadow-2xl group order-1 lg:order-2">
                      <Image
                        src="/images/NosotrosSection/Vision.jpg"
                        alt="Visión CEFIB"
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#003366]/20 to-transparent" />
                      <div className="absolute bottom-6 left-6 w-16 h-16 bg-gradient-to-br from-[#003366] to-[#004488] rounded-2xl flex items-center justify-center shadow-xl transform group-hover:scale-110 group-hover:rotate-12 transition-all">
                        <Rocket className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Hint para pasar página */}
                  <div className="text-center mt-8">
                    <p className="text-gray-400 text-sm flex items-center justify-center gap-2">
                      <span>Haz click para ver Objetivos Estratégicos</span>
                      <ChevronRight className="w-4 h-4 animate-pulse" />
                    </p>
                  </div>
                </motion.div>
              )}

              {/* PÁGINA 2: Objetivos Estratégicos */}
              {currentPage === 2 && (
                <motion.div
                  key="page2"
                  custom={2}
                  variants={pageVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={pageTransition}
                  className="grid lg:grid-cols-2 gap-8 md:gap-12"
                >
                  {/* Contenido de Objetivos */}
                  <div className="flex flex-col justify-center bg-white/5 backdrop-blur-sm rounded-2xl p-8 md:p-10 border border-white/10">
                    <div className="inline-flex items-center gap-2 text-[#FF6B35] mb-6">
                      <Users className="w-6 h-6" />
                      <span className="text-sm font-bold uppercase tracking-wider">Objetivos Estratégicos</span>
                    </div>

                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                      CEFIB Train Win Leaders
                    </h3>

                    {/* Objetivo 1 */}
                    <div className="mb-8 p-6 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] rounded-xl flex items-center justify-center shrink-0 shadow-lg">
                          <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-white mb-3">
                            Programas de Alta Calidad
                          </h4>
                          <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                            Desarrollar e implementar programas de alta calidad y competitividad, donde el cliente valore y ejecute eficientemente contenidos actualizados, prácticos y con un enfoque aplicativo a resultados. 
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Objetivo 2 */}
                    <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#003366] to-[#004488] rounded-xl flex items-center justify-center shrink-0 shadow-lg">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-white mb-3">
                            Equipos Multidisciplinarios
                          </h4>
                          <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                            Consolidar equipos multidisciplinarios inteligentes y talentosos que desarrollen capacidades y competencias aplicables en sus actividades y tareas para el logro de sus metas.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="mt-8">
                      <a
                        href={`https://wa.me/${SITE_CONFIG.contact. whatsapp}?text=${WHATSAPP_MESSAGE}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#003366] via-[#004488] to-[#003366] text-white px-10 py-5 rounded-full font-bold hover:shadow-2xl transform hover:scale-105 transition-all w-full sm:w-auto"
                      >
                        <Rocket className="w-6 h-6" />
                        Únete a Nuestra Visión
                      </a>
                    </div>
                  </div>

                  {/* Imagen de Objetivos */}
                  <div className="relative h-[400px] md:h-[600px] rounded-2xl overflow-hidden shadow-2xl group">
                    <Image
                      src="/images/NosotrosSection/Objetivos.jpg"
                      alt="Objetivos Estratégicos CEFIB"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#003366]/30 to-transparent" />
                    
                    {/* Iconos flotantes */}
                    <div className="absolute top-6 right-6 w-14 h-14 bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] rounded-xl flex items-center justify-center shadow-xl">
                      <TrendingUp className="w-7 h-7 text-white" />
                    </div>
                    <div className="absolute bottom-6 left-6 w-14 h-14 bg-gradient-to-br from-[#003366] to-[#004488] rounded-xl flex items-center justify-center shadow-xl">
                      <Users className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}