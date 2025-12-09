/**
 * Página: Catálogo Completo de Cursos
 * Ruta: /cursos
 * Version: v1.1 - Con botón de volver al inicio
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-12-07
 */

import { Metadata } from 'next';
import CursosGrid from '@/components/sections/CursosGrid';
import { BookOpen, Home } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cursos - CEFIB',
  description: 'Catálogo completo de cursos y programas de formación profesional',
};

export default function CursosPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-400 to-blue-900 text-white py-16">
        <div className="container mx-auto px-6">
          {/* Botón volver al inicio */}
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors group"
          >
            <Home className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Volver al inicio</span>
          </Link>

          {/* Título y descripción */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Catálogo de Cursos</h1>
              <p className="text-white/90 mt-2">
                Descubre todos nuestros programas de formación profesional
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de cursos */}
      <div className="container mx-auto px-6 py-12">
        <CursosGrid showFilters={true} />
      </div>
    </div>
  );
}