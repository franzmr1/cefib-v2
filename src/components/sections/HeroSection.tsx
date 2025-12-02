/**
 * Componente: HeroSection
 * Version: v5.0 - Slider automático con 3 imágenes
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-27
 * Descripción: Hero con carrusel de imágenes corporativas
 */

'use client';

import { useState, useEffect } from 'react';
import { Phone, BookOpen, CheckCircle } from 'lucide-react';
import { SITE_CONFIG, WHATSAPP_MESSAGE } from '@/constants';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const HERO_ITEMS = [
  'DIPLOMADOS Y ESPECIALIZACIONES',
  'CURSOS A MEDIDA',
  'IN HOUSE',
  'PLANES Y PROYECTOS'
];

// ✅ Array de imágenes corporativas
const BACKGROUND_IMAGES = [
  {
    url: '/images/heroSection/prueba.png',
    alt: 'Equipo ejecutivo en sala de juntas'
  },
  {
    url: '/images/heroSection/prueba02.png',
    alt: 'Profesionales en oficina corporativa'
  },
  {
    url: '/images/heroSection/prueba03.png',
    alt: 'Ejecutivos en pasillo corporativo'
  }
];

export default function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // ✅ Cambio automático cada 6 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => 
        prev === BACKGROUND_IMAGES.length - 1 ? 0 : prev + 1
      );
    }, 6000); // 6 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative bg-[#003366] min-h-[600px] md:min-h-[750px] flex items-center overflow-hidden">
      {/* Slider de imágenes de fondo */}
<div className="absolute inset-0 z-0">
  <AnimatePresence mode="wait">
    <motion.div
      key={currentImageIndex}
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 1.5, ease: 'easeInOut' }}
      className="absolute inset-0"
    >
      <Image
        src={BACKGROUND_IMAGES[currentImageIndex].url}
        alt={BACKGROUND_IMAGES[currentImageIndex].alt}
        fill
        className="object-cover object-center"
        priority={currentImageIndex === 0}
        sizes="100vw"
      />
    </motion.div>
  </AnimatePresence>
  
  {/* ✅ OVERLAY OSCURO MEJORADO */}
  <div className="absolute inset-0 bg-gradient-to-br from-black/65 via-[#003366]/75 to-[#003366]/70" />
<div className="absolute inset-0 bg-[#003366]/20" />
  
  {/* Patrón de puntos más sutil */}
  <div 
    className="absolute inset-0 opacity-5" 
    style={{
      backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
      backgroundSize: '40px 40px'
    }} 
  />
</div>

      {/* Círculos más pequeños */}
<div className="absolute inset-0 z-10 pointer-events-none">
  {/* De 80 → 60 */}
  <div className="absolute top-10 right-10 w-48 h-48 md:w-60 md:h-60 bg-[#FF6B35] rounded-full blur-3xl opacity-4" />
  
  {/* De 72 → 56 */}
  <div 
    className="absolute bottom-10 left-10 w-40 h-40 md:w-56 md:h-56 bg-[#FF8C5A] rounded-full blur-3xl opacity-3" 
  />
</div>

      {/* Contenido principal */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20 py-16 md:py-20">
        <div className="text-center text-white max-w-5xl mx-auto">
          {/* Título principal */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 md:mb-8 leading-tight">
            IMPULSAMOS TU <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] via-[#FF8C5A] to-[#FFA07A] drop-shadow-lg">
              CARRERA PROFESIONAL
            </span>
          </h1>
          
          {/* Lista de servicios */}
          <div className="grid sm:grid-cols-2 gap-3 md:gap-4 mb-8 md:mb-10 max-w-3xl mx-auto">
            {HERO_ITEMS.map((item, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-center sm:justify-start gap-3 text-base md:text-lg bg-white/5 backdrop-blur-sm rounded-lg p-3 md:p-4 border border-white/10 hover:bg-white/10 transition-all"
              >
                <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-[#FF6B35] shrink-0" />
                <span className="font-semibold text-sm md:text-base">{item}</span>
              </div>
            ))}
          </div>

          {/* Card de contacto */}
          <div className="inline-block bg-white/10 backdrop-blur-md rounded-2xl p-5 md:p-7 mt-6 md:mt-8 w-full max-w-lg mx-auto border border-white/20 shadow-2xl">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
              <div className="p-3 bg-green-500/20 rounded-full">
                <Phone className="w-7 h-7 md:w-9 md:h-9 text-green-400 animate-pulse" />
              </div>
              <div className="text-center sm:text-left">
                <div className="text-xl md:text-3xl font-bold text-white">
                  {SITE_CONFIG.contact.phones[0]}
                </div>
                <div className="text-xs md:text-sm text-gray-200 mt-1 flex items-center gap-2 justify-center sm:justify-start">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  {SITE_CONFIG.contact.email}
                </div>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 mt-8 md:mt-10 px-4">
            <a
              href="#cursos"
              className="group inline-flex items-center justify-center px-7 md:px-10 py-4 md:py-5 bg-white text-[#003366] rounded-xl font-bold hover:bg-gray-50 transition-all shadow-2xl hover:shadow-[#FF6B35]/50 hover:scale-105 text-base md:text-lg"
            >
              <BookOpen className="mr-2 h-5 w-5 md:h-6 md:w-6 group-hover:scale-110 transition-transform" />
              Ver Cursos
            </a>
            <a
              href={`https://wa.me/${SITE_CONFIG.contact.whatsapp}?text=${WHATSAPP_MESSAGE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center px-7 md:px-10 py-4 md:py-5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold hover:from-green-600 hover:to-green-700 transition-all shadow-2xl hover:shadow-green-500/50 hover:scale-105 text-base md:text-lg"
            >
              <Phone className="mr-2 h-5 w-5 md:h-6 md:w-6 group-hover:rotate-12 transition-transform" />
              Contactar
            </a>
          </div>
        </div>
      </div>

      {/* Indicador de scroll REPOSICIONADO MÁS ABAJO */}
      <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-20 hidden lg:block">
        <div className="flex flex-col items-center gap-2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/40 rounded-full p-1">
            <div className="w-1. 5 h-3 bg-white/70 rounded-full mx-auto animate-pulse" />
          </div>
          <span className="text-xs text-white/60 font-medium">Desliza</span>
        </div>
      </div>

      {/* Indicadores de slider (puntos) */}
      <div className="absolute bottom-16 md:bottom-20 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {BACKGROUND_IMAGES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`transition-all ${
              index === currentImageIndex
                ? 'w-8 bg-white'
                : 'w-2 bg-white/40 hover:bg-white/60'
            } h-2 rounded-full`}
            aria-label={`Ir a imagen ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}