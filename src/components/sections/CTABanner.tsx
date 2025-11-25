/**
 * Componente: CTABanner
 * Version: v2.0 - TAILWIND V4 COMPLIANT
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-25
 * Descripción: Banner de llamado a la acción - Sintaxis v4 + Responsive
 */

import { SITE_CONFIG, WHATSAPP_MESSAGE } from '@/constants';

export default function CTABanner() {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-r from-red-500 to-pink-500">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white max-w-3xl">
            Reta tu futuro potenciando tu presente, Gestiona, Lidera e Impacta
          </h2>
          <a
            href={`https://wa.me/${SITE_CONFIG.contact.whatsapp}?text=${WHATSAPP_MESSAGE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-red-500 px-8 md:px-10 py-3 md:py-4 rounded-full font-bold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:scale-110 whitespace-nowrap text-sm md:text-base"
          >
            Contáctanos Ahora
          </a>
        </div>
      </div>
    </section>
  );
}