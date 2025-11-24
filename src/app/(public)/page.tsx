/**
 * Página: Landing Page Principal CEFIB
 * Version: v3.0 - Completamente Componentizada
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-19
 * Descripción: Landing page modular con todos los componentes separados
 * Arquitectura: Componentes reutilizables en src/components/sections/
 */

import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/constants';

// Importar componentes de secciones
import HeroSection from '@/components/sections/HeroSection';
import EstadisticasSection from '@/components/sections/EstadisticasSection';
import ServiciosSection from '@/components/sections/ServiciosSection';
import CTABanner from '@/components/sections/CTABanner';
import CursosSection from '@/components/sections/CursosSection';
import AsesoramientoSection from '@/components/sections/AsesoramientoSection';
import StaffSection from '@/components/sections/StaffSection';
import NosotrosSection from '@/components/sections/NosotrosSection';
import UbicacionSection from '@/components/sections/UbicacionSection';
import NewsletterSection from '@/components/sections/NewsletterSection';

/**
 * Metadata para SEO
 */
export const metadata: Metadata = {
  title: `${SITE_CONFIG.name} - ${SITE_CONFIG.tagline}`,
  description: SITE_CONFIG.description,
  keywords: [
    'capacitación profesional',
    'cursos',
    'diplomados',
    'CEFIB',
    'formación',
    'educación',
    'Trujillo',
    'Perú',
  ],
  openGraph: {
    title: SITE_CONFIG.fullName,
    description: SITE_CONFIG.description,
    type: 'website',
    locale: 'es_PE',
    url: SITE_CONFIG.url,
  },
};

/**
 * Componente principal de la landing page
 * Estructura modular: cada sección es un componente independiente
 */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Sección Hero - Banner principal */}
      <HeroSection />

      {/* Sección de Servicios */}
      <ServiciosSection />

      {/* Banner CTA - Llamado a la acción */}
      <CTABanner />

      {/* Sección de Estadísticas */}
      <EstadisticasSection />

      {/* Sección de Cursos Dinámicos (Client Component) */}
      <CursosSection />

      {/* Sección de Asesoramiento de Investigación */}
      <AsesoramientoSection />

      {/* Sección Staff de Profesionales */}
      <StaffSection />

      {/* Sección Nosotros - Misión, Visión, Objetivos */}
      <NosotrosSection />

      {/* Sección de Ubicación con mapa */}
      <UbicacionSection />

      {/* Sección Newsletter y redes sociales */}
      <NewsletterSection />
    </div>
  );
}