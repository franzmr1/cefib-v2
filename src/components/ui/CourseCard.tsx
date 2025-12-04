/**
 * Componente: CourseCard
 * Version: v2.0 - Aspect ratio 16:9
 */

import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, MapPin, Award } from 'lucide-react';

interface CourseCardProps {
  id: string;
  titulo: string;
  slug: string; // ✅ ASEGÚRATE DE TENER ESTO
  descripcionBreve: string | null;
  imagenUrl: string | null;
  fechaInicio: Date | null;
  duracionHoras: number;
  modalidad: string;
  certificado: boolean;
  precio: number | null;
}

export default function CourseCard({
  slug, // ✅ USAR SLUG
  titulo,
  descripcionBreve,
  imagenUrl,
  fechaInicio,
  duracionHoras,
  modalidad,
  certificado,
  precio,
}: CourseCardProps) {
  return (
    <Link
      href={`/cursos/${slug}`} // ✅ USAR SLUG EN VEZ DE ID
      className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
    >
      {/* Imagen - ✅ ASPECT RATIO 16:9 */}
      <div className="relative w-full aspect-video bg-gradient-to-br from-blue-100 to-purple-100 overflow-hidden">
        {imagenUrl ?  (
          <Image
            src={imagenUrl}
            alt={titulo}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl">📚</span>
          </div>
        )}

        {/* Badge modalidad */}
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-blue-600 uppercase">
            {modalidad}
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
          {titulo}
        </h3>

        {descripcionBreve && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {descripcionBreve}
          </p>
        )}

        {/* Metadata */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4 text-blue-500" />
            <span>{duracionHoras}h académicas</span>
          </div>

          {fechaInicio && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4 text-orange-500" />
              <span>Inicio: {new Date(fechaInicio).toLocaleDateString('es-PE')}</span>
            </div>
          )}

          {certificado && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <Award className="w-4 h-4" />
              <span className="font-semibold">Certificado incluido</span>
            </div>
          )}
        </div>

        {/* Precio */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          {precio ? (
            <div>
              <p className="text-sm text-gray-600">Inversión</p>
              <p className="text-2xl font-bold text-blue-600">S/ {precio.toFixed(2)}</p>
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
  );
}