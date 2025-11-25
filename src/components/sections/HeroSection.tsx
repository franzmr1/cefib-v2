/**
 * Componente: HeroSection
 * Version: v3.0 - TAILWIND V4 COMPLIANT
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-25
 * Descripción: Banner principal - Sintaxis Tailwind v4 + Centrado responsive
 */

import { Phone, BookOpen, CheckCircle } from 'lucide-react';
import { SITE_CONFIG, WHATSAPP_MESSAGE } from '@/constants';

const HERO_ITEMS = [
  'DIPLOMADOS Y ESPECIALIZACIONES',
  'CURSOS A MEDIDA',
  'IN HOUSE',
  'PLANES Y PROYECTOS'
];

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 py-16 md:py-24 overflow-hidden">
      {/* Patrón de fondo animado */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-pink-500 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 md:w-96 md:h-96 bg-orange-500 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center text-white max-w-4xl mx-auto">
          {/* Título principal */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in-up">
            IMPULSAMOS TU <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-400">
              CARRERA PROFESIONAL
            </span>
          </h1>
          
          {/* Lista de servicios */}
          <div className="space-y-2 md:space-y-3 mb-8">
            {HERO_ITEMS.map((item, idx) => (
              <div key={idx} className="flex items-center justify-center gap-2 md:gap-3 text-base md:text-lg">
                <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-orange-400 shrink-0" />
                <span className="font-medium">{item}</span>
              </div>
            ))}
          </div>

          {/* Contacto destacado */}
          <div className="inline-block bg-white bg-opacity-10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 mt-6 md:mt-8 w-full max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
              <Phone className="w-6 h-6 md:w-8 md:h-8 text-green-400 animate-pulse shrink-0" />
              <div className="text-center sm:text-left">
                <div className="text-lg md:text-2xl font-bold">
                  {SITE_CONFIG.contact.phones[0]}
                </div>
                <div className="text-xs md:text-sm text-gray-200 mt-1">
                  {SITE_CONFIG.contact.email}
                </div>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 mt-6 md:mt-8 px-4">
            <a
              href="#cursos"
              className="inline-flex items-center justify-center px-6 md:px-8 py-3 md:py-4 bg-white text-red-500 rounded-full font-bold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Ver Cursos
            </a>
            <a
              href={`https://wa.me/${SITE_CONFIG.contact.whatsapp}?text=${WHATSAPP_MESSAGE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 md:px-8 py-3 md:py-4 bg-green-500 text-white rounded-full font-bold hover:bg-green-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Phone className="mr-2 h-5 w-5" />
              Contactar
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}