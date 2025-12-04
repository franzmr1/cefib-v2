/**
 * Componente: CursosSection
 * Version: v2.0 - Mejorado con límite y botón "Ver todos"
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-12-03
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, ChevronRight } from 'lucide-react';
import CourseCard from '@/components/ui/CourseCard';

interface Curso {
  id: string;
  titulo: string;
  slug: string;
  descripcionBreve: string | null;
  imagenUrl: string | null;
  fechaInicio: Date | null;
  duracionHoras: number;
  modalidad: string;
  certificado: boolean;
  precio: number | null;
}

export default function CursosSection() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/cursos')
      .then(res => res.json())
      .then(data => {
        setCursos(data.cursos || []);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error loading courses:', err);
        setIsLoading(false);
      });
  }, []);

  // ✅ NUEVO: Mostrar solo 6 cursos en home
  const cursosLimitados = cursos.slice(0, 6);

  return (
    <section id="cursos" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        {/* Título de sección */}
        <div className="text-center mb-12">
          <div className="text-red-500 font-semibold mb-4 uppercase tracking-wider">
            Cursos Disponibles
          </div>
          <h2 className="text-4xl font-bold text-blue-900 mb-4">
            PROGRAMAS DE FORMACIÓN PROFESIONAL
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubre nuestra oferta actualizada de cursos y especializaciones
          </p>
        </div>

        {/* Estado de carga */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
            <p className="mt-4 text-gray-600">Cargando cursos...</p>
          </div>
        ) : cursos.length > 0 ? (
          <>
            {/* Grid de cursos - ✅ LIMITADO A 6 */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cursosLimitados.map((curso: Curso) => (
                <CourseCard key={curso. id} {...curso} />
              ))}
            </div>

            {/* Botón ver todos - ✅ SIEMPRE VISIBLE SI HAY CURSOS */}
            <div className="text-center mt-12">
              <Link
                href="/cursos"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full font-bold hover:from-red-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <BookOpen className="mr-2 h-5 w-5" />
                Ver Todos los Cursos ({cursos.length})
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-2xl">
            <BookOpen className="h-20 w-20 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-700 mb-2">
              Próximamente Nuevos Cursos
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Estamos preparando nuevos programas de formación
            </p>
          </div>
        )}
      </div>
    </section>
  );
}