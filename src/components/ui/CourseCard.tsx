/**
 * Componente: CourseCard (ACTUALIZADO)
 * Version: v2.0
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-21
 */

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, MapPin, Award } from 'lucide-react';

interface CourseCardProps {
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

export default function CourseCard({
  id,
  titulo,
  slug,
  descripcionBreve,
  imagenUrl,
  fechaInicio,
  duracionHoras,
  modalidad,
  certificado,
  precio,
}: CourseCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group transform hover:-translate-y-2">
      {/* Imagen */}
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        {imagenUrl ? (
          <Image
            src={imagenUrl}
            alt={titulo}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-500">
            <span className="text-white text-6xl">📚</span>
          </div>
        )}

        {/* Badge de modalidad */}
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold rounded-full">
            {modalidad}
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-red-500 transition-colors">
          {titulo}
        </h3>

        {descripcionBreve && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {descripcionBreve}
          </p>
        )}

        {/* Información del curso */}
        <div className="space-y-2 mb-4">
          {fechaInicio && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4 text-red-500" />
              <span>Inicio: {new Date(fechaInicio).toLocaleDateString('es-PE')}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4 text-red-500" />
            <span>{duracionHoras} horas académicas</span>
          </div>

          {certificado && (
            <div className="flex items-center gap-2 text-sm text-green-600 font-semibold">
              <Award className="w-4 h-4" />
              <span>Certificado incluido</span>
            </div>
          )}
        </div>

        {/* Precio y botón */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div>
            {precio ? (
              <>
                <p className="text-sm text-gray-600">Inversión</p>
                <p className="text-2xl font-bold text-gray-900">
                  S/ {precio.toFixed(2)}
                </p>
              </>
            ) : (
              <p className="text-lg font-bold text-gray-900">Consultar precio</p>
            )}
          </div>

          <Link
            href={`/cursos/${id}`}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full font-semibold hover:from-red-600 hover:to-pink-600 transition-all shadow-md hover:shadow-lg"
          >
            Ver más
          </Link>
        </div>
      </div>
    </div>
  );
}