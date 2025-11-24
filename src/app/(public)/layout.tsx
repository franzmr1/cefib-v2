/**
 * Layout: Grupo de Rutas Públicas
 * Version: v1.0
 * Autor: Franz
 * Fecha: 2025-11-15
 * Descripción: Layout para páginas públicas (landing, cursos, etc.)
 * Incluye Header y Footer
 */

import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/constants';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: {
    default: `${SITE_CONFIG.name} - ${SITE_CONFIG.tagline}`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: [
    'capacitación profesional',
    'cursos',
    'diplomados',
    'especialización',
    'formación',
    'CEFIB',
    'educación',
  ],
  authors: [{ name: SITE_CONFIG.name }],
  openGraph: {
    type: 'website',
    locale: 'es_PE',
    url: SITE_CONFIG.url,
    title: SITE_CONFIG.fullName,
    description: SITE_CONFIG.description,
    siteName: SITE_CONFIG.name,
  },
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Header con navegación */}
      <Header />
      
      {/* Contenido principal */}
      <main className="min-h-screen">
        {children}
      </main>
      
      {/* Footer con información de contacto */}
      <Footer />
    </>
  );
}