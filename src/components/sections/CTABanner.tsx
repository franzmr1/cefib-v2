/**
 * Componente: CTABanner
 * Version: v1.0
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-19
 * Descripción: Banner de llamado a la acción
 * Tipo: Server Component
 */

import { SITE_CONFIG, WHATSAPP_MESSAGE } from '@/constants';

export default function CTABanner() {
  return (
    <section className="py-16 bg-linear-to-r from-red-500 to-pink-500">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <h2 className="text-3xl font-bold text-white">
          Reta tu futuro potenciando tu presente, Gestiona, Lidera e Impacta
        </h2>
        <a
          href={`https://wa.me/${SITE_CONFIG.contact.whatsapp}?text=${WHATSAPP_MESSAGE}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white text-red-500 px-10 py-4 rounded-full font-bold hover:bg-gray-100 transition-all shadow-lg transform hover:scale-110 whitespace-nowrap"
        >
          Contáctanos Ahora
        </a>
      </div>
    </section>
  );
}