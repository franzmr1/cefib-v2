/**
 * Página: Detalle de Curso (Público)
 * Ruta: /cursos/[slug]
 * Version: v2. 0
 */

import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Calendar, Clock, MapPin, Award, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { SITE_CONFIG } from '@/constants';

async function getCursoBySlug(slug: string) {
  try {
    const curso = await prisma.curso.findUnique({
      where: { 
        slug,
        estado: 'ACTIVO', // ✅ Solo cursos activos
      },
    });
    
    return curso;
  } catch (error) {
    console.error('Error fetching curso:', error);
    return null;
  }
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CursoPublicoPage({ params }: PageProps) {
  const { slug } = await params;
  const curso = await getCursoBySlug(slug);

  if (!curso) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Compacto - ✅ REDUCIDO py-12 */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 text-white py-12">
        <div className="container mx-auto px-6">
          <Link href="/cursos" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Volver al catálogo
          </Link>
          <h1 className="text-4xl font-bold">{curso.titulo}</h1>
          {curso.descripcionBreve && (
            <p className="text-xl text-white/90 mt-3">{curso.descripcionBreve}</p>
          )}
        </div>
      </div>

      {/* Contenido */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Imagen destacada - ✅ ASPECT RATIO 16:9 MÁS GRANDE */}
            {curso.imagenUrl && (
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={curso.imagenUrl}
                  alt={curso.titulo}
                  fill
                  className="object-cover"
                  priority
                  unoptimized
                />
              </div>
            )}

            {/* Descripción */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Descripción del Curso</h2>
              <div
                className="prose prose-lg max-w-none text-gray-700"
                dangerouslySetInnerHTML={{
                  __html: curso. descripcion || '<p>Sin descripción disponible</p>',
                }}
              />
            </div>
          </div>

          {/* Sidebar sticky */}
          <div>
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-6 space-y-6">
              <h3 className="text-xl font-bold text-gray-900">Información del Curso</h3>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Duración</p>
                    <p className="font-bold text-gray-900">{curso.duracionHoras}h académicas</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Modalidad</p>
                    <p className="font-bold text-gray-900">{curso.modalidad}</p>
                  </div>
                </div>

                {curso.precio && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 text-2xl">
                      💰
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Inversión</p>
                      <p className="font-bold text-2xl text-green-600">S/ {curso.precio. toFixed(2)}</p>
                    </div>
                  </div>
                )}

                {curso.fechaInicio && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-pink-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Fecha de inicio</p>
                      <p className="font-bold text-gray-900">
                        {new Date(curso.fechaInicio).toLocaleDateString('es-PE', {
                          dateStyle: 'long'
                        })}
                      </p>
                    </div>
                  </div>
                )}

                {curso.certificado && (
                  <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                    <Award className="w-6 h-6 text-green-600" />
                    <p className="font-bold text-green-700">Certificado incluido</p>
                  </div>
                )}
              </div>

              {/* CTA WhatsApp */}
              <a
                href={`https://wa.me/${SITE_CONFIG.contact. whatsapp}?text=Hola, me interesa el curso: ${curso.titulo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full block text-center bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-xl font-bold hover:shadow-xl transition-all"
              >
                💬 Consultar por WhatsApp
              </a>

              <p className="text-xs text-center text-gray-500">
                Respuesta en menos de 24 horas
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}