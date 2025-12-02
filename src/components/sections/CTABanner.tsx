/**
 * Componente: CTABanner
 * Version: v3.0 - Con imagen de fondo corporativa
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-27
 * Descripción: Banner CTA con imagen de fondo y overlay elegante
 */

'use client';

import { SITE_CONFIG, WHATSAPP_MESSAGE } from '@/constants';
import Image from 'next/image';

export default function CTABanner() {
  return (
    <section className="relative py-16 md:py-20 overflow-hidden">
      {/* Imagen de fondo */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/CTA-banner/CTA-banner.png"
          alt="Equipo profesional trabajando"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        
        {/* Overlay degradado rosa/rojo */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/85 via-pink-600/80 to-red-500/85" />

        
        {/* Patrón de puntos decorativo */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle, #ffffff 1. 5px, transparent 1.5px)',
            backgroundSize: '30px 30px'
          }}
        />
      </div>

      {/* Elementos decorativos */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full blur-3xl opacity-10" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-200 rounded-full blur-3xl opacity-10" />
      </div>

      {/* Contenido */}
      <div className="container mx-auto px-4 md:px-6 relative z-20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 text-center md:text-left">
          {/* Texto principal con sombra */}
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white max-w-3xl drop-shadow-2xl">
            Reta tu futuro potenciando tu presente,{' '}
            <span className="block mt-2 text-yellow-300 drop-shadow-lg">
              Gestiona, Lidera e Impacta
            </span>
          </h2>

          {/* Botón CTA mejorado */}
          <a
            href={`https://wa.me/${SITE_CONFIG. contact.whatsapp}?text=${WHATSAPP_MESSAGE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white text-red-500 px-8 md:px-10 py-4 md:py-5 rounded-full font-bold hover:bg-yellow-300 hover:text-red-600 transition-all shadow-2xl hover:shadow-white/50 transform hover:scale-110 whitespace-nowrap text-sm md:text-base"
          >
            <span className="inline-flex items-center gap-2">
              Contáctanos Ahora
              <svg 
                className="w-5 h-5 group-hover:translate-x-1 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}