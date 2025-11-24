/**
 * Página: 404 - Curso no encontrado
 * Version: v1.0
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-21
 */

import Link from 'next/link';
import { SearchX, Home, BookOpen } from 'lucide-react';

export default function CursoNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="text-center max-w-2xl">
        {/* Icono */}
        <div className="mb-8">
          <SearchX className="w-32 h-32 text-gray-400 mx-auto" />
        </div>

        {/* Título */}
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Curso no encontrado
        </h2>

        {/* Descripción */}
        <p className="text-xl text-gray-600 mb-8">
          El curso que buscas no existe o ha sido movido.
        </p>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-linear-to-r from-red-500 to-pink-500 text-white rounded-full font-bold hover:from-red-600 hover:to-pink-600 transition-all shadow-lg"
          >
            <Home className="w-5 h-5" />
            Volver al Inicio
          </Link>
          <Link
            href="/#cursos"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-full font-bold hover:bg-gray-50 transition-all"
          >
            <BookOpen className="w-5 h-5" />
            Ver Todos los Cursos
          </Link>
        </div>
      </div>
    </div>
  );
}