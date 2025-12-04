/**
 * Componente: Grid de Cursos con Filtros
 * Version: v1.0
 * Autor: Franz (@franzmr1)
 */

'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, MapPin, Award, Search, Filter } from 'lucide-react';
import { BookOpen } from 'lucide-react';

interface Curso {
  id: string;
  titulo: string;
  slug: string;
  descripcionBreve: string | null;
  imagenUrl: string | null;
  duracionHoras: number;
  modalidad: string;
  precio: number | null;
  certificado: boolean;
  fechaInicio: string | null;
  sector?: string | null;
}

interface CursosGridProps {
  showFilters?: boolean;
  limit?: number;
}

export default function CursosGrid({ showFilters = false, limit }: CursosGridProps) {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [filteredCursos, setFilteredCursos] = useState<Curso[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalidadFilter, setModalidadFilter] = useState('');
  const [sectorFilter, setSectorFilter] = useState('');

  useEffect(() => {
    fetch('/api/cursos')
      .then(res => res.json())
      .then(data => {
        const cursosData = data.cursos || [];
        setCursos(cursosData);
        setFilteredCursos(limit ? cursosData. slice(0, limit) : cursosData);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error loading courses:', err);
        setIsLoading(false);
      });
  }, [limit]);

  // Aplicar filtros
  useEffect(() => {
    let result = cursos;

    // Filtro de búsqueda
    if (searchTerm) {
      result = result.filter(curso =>
        curso.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        curso.descripcionBreve?. toLowerCase().includes(searchTerm. toLowerCase())
      );
    }

    // Filtro de modalidad
    if (modalidadFilter) {
      result = result.filter(curso => curso. modalidad === modalidadFilter);
    }

    // Filtro de sector
    if (sectorFilter) {
      result = result.filter(curso => curso.sector === sectorFilter);
    }

    setFilteredCursos(limit ? result.slice(0, limit) : result);
  }, [searchTerm, modalidadFilter, sectorFilter, cursos, limit]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Filtros */}
      {showFilters && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Filtrar Cursos</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {/* Búsqueda */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar curso..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Modalidad */}
            <select
              value={modalidadFilter}
              onChange={(e) => setModalidadFilter(e. target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas las modalidades</option>
              <option value="VIRTUAL">Virtual</option>
              <option value="PRESENCIAL">Presencial</option>
              <option value="HIBRIDO">Híbrido</option>
            </select>

            {/* Sector */}
            <select
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los sectores</option>
              <option value="GESTION_PUBLICA">Gestión Pública</option>
              <option value="SALUD">Salud</option>
              <option value="TECNOLOGIA">Tecnología</option>
              <option value="EDUCACION">Educación</option>
            </select>
          </div>

          {/* Resultados */}
          <p className="text-sm text-gray-600 mt-4">
            Mostrando {filteredCursos.length} de {cursos.length} cursos
          </p>
        </div>
      )}

      {/* Grid de cursos */}
      {filteredCursos.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-600 text-lg">No se encontraron cursos</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCursos.map((curso) => (
            <Link
              key={curso.id}
              href={`/cursos/${curso.slug}`}
              className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              {/* Imagen - ASPECT RATIO 16:9 */}
              <div className="relative w-full aspect-video bg-gradient-to-br from-blue-100 to-purple-100 overflow-hidden">
                {curso.imagenUrl ?  (
                  <Image
                    src={curso.imagenUrl}
                    alt={curso. titulo}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen className="w-16 h-16 text-gray-300" />
                  </div>
                )}

                {/* Badge modalidad */}
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-blue-600">
                    {curso.modalidad}
                  </span>
                </div>
              </div>

              {/* Contenido */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {curso.titulo}
                </h3>

                {curso.descripcionBreve && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {curso.descripcionBreve}
                  </p>
                )}

                {/* Metadata */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span>{curso.duracionHoras}h académicas</span>
                  </div>

                  {curso.fechaInicio && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-orange-500" />
                      <span>Inicio: {new Date(curso.fechaInicio).toLocaleDateString('es-PE')}</span>
                    </div>
                  )}

                  {curso.certificado && (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <Award className="w-4 h-4" />
                      <span className="font-semibold">Certificado incluido</span>
                    </div>
                  )}
                </div>

                {/* Precio */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  {curso.precio ?  (
                    <div>
                      <p className="text-sm text-gray-600">Inversión</p>
                      <p className="text-2xl font-bold text-blue-600">S/ {curso.precio.toFixed(2)}</p>
                    </div>
                  ) : (
                    <p className="text-lg font-semibold text-gray-600">Consultar precio</p>
                  )}

                  <button className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full font-semibold hover:shadow-lg transition-all">
                    Ver más
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Ver todos (si hay límite) */}
      {limit && cursos.length > limit && (
        <div className="text-center pt-8">
          <Link
            href="/cursos"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:shadow-xl transition-all"
          >
            Ver todos los cursos ({cursos.length})
          </Link>
        </div>
      )}
    </div>
  );
}