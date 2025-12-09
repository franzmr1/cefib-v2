/**
 * Página: Detalle de Curso (Público)
 * Ruta: /cursos/[slug]
 * Version: v2.2 - Con botón inicio y listas corregidas
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-12-07
 */

import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Calendar, Clock, MapPin, Award, ArrowLeft, Home } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { SITE_CONFIG } from '@/constants';

async function getCursoBySlug(slug: string) {
  try {
    const curso = await prisma.curso.findUnique({
      where: { 
        slug,
        estado: 'ACTIVO',
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
      {/* Hero Compacto */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 text-white py-12">
        <div className="container mx-auto px-6">
          {/* Navegación mejorada */}
          <div className="flex items-center gap-4 mb-4">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <Home className="w-5 h-5" />
              Inicio
            </Link>
            <span className="text-white/50">/</span>
            <Link 
              href="/cursos" 
              className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver al catálogo
            </Link>
          </div>
          
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
            {/* Imagen destacada */}
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

            {/* Descripción con estilos COMPLETOS para listas */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">
                Descripción del Curso
              </h2>
              
              {/* ✅ ESTILOS COMPLETOS PARA LISTAS */}
              <div
                className="
                  curso-content
                  prose 
                  prose-lg 
                  max-w-none 
                  
                  prose-headings:text-gray-900
                  prose-headings:font-bold
                  
                  prose-h1:text-3xl
                  prose-h1:mb-4
                  prose-h1:mt-6
                  
                  prose-h2:text-2xl
                  prose-h2:mb-3
                  prose-h2:mt-5
                  
                  prose-h3:text-xl
                  prose-h3:mb-2
                  prose-h3:mt-4
                  
                  prose-p:text-gray-700
                  prose-p:leading-relaxed
                  prose-p:mb-4
                  
                  prose-strong:text-gray-900
                  prose-strong:font-semibold
                  
                  prose-em:text-gray-800
                  prose-em:italic
                  
                  prose-ul:list-disc
                  prose-ul:list-outside
                  prose-ul:ml-6
                  prose-ul:my-4
                  prose-ul:space-y-2
                  
                  prose-ol:list-decimal
                  prose-ol:list-outside
                  prose-ol:ml-6
                  prose-ol:my-4
                  prose-ol:space-y-2
                  
                  prose-li:text-gray-700
                  prose-li:leading-relaxed
                  prose-li:my-1
                  
                  prose-blockquote:border-l-4
                  prose-blockquote:border-blue-500
                  prose-blockquote:pl-4
                  prose-blockquote:italic
                  prose-blockquote:text-gray-600
                  prose-blockquote:my-4
                  
                  prose-a:text-blue-600
                  prose-a:underline
                  prose-a:hover:text-blue-800
                  prose-a:transition-colors
                  
                  prose-code:bg-gray-100
                  prose-code:text-red-600
                  prose-code:px-2
                  prose-code:py-1
                  prose-code:rounded
                  prose-code:text-sm
                  prose-code:font-mono
                  
                  prose-pre:bg-gray-900
                  prose-pre:text-gray-100
                  prose-pre:p-4
                  prose-pre:rounded-lg
                  prose-pre:overflow-x-auto
                  prose-pre:my-4
                  
                  prose-img:rounded-lg
                  prose-img:shadow-lg
                  prose-img:my-6
                "
                dangerouslySetInnerHTML={{
                  __html: curso.descripcion || '<p>Sin descripción disponible</p>',
                }}
              />
            </div>
          </div>

          {/* Sidebar sticky */}
          <div>
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-6 space-y-6">
              <h3 className="text-xl font-bold text-gray-900">
                Información del Curso
              </h3>

              <div className="space-y-4">
                {/* Duración */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Duración</p>
                    <p className="font-bold text-gray-900">
                      {curso.duracionHoras}h académicas
                    </p>
                  </div>
                </div>

                {/* Modalidad */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Modalidad</p>
                    <p className="font-bold text-gray-900">
                      {curso.modalidad}
                    </p>
                  </div>
                </div>

                {/* Precio */}
                {curso.precio && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 text-2xl">
                      💰
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Inversión</p>
                      <p className="font-bold text-2xl text-green-600">
                        S/ {curso.precio. toFixed(2)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Fecha de inicio */}
                {curso.fechaInicio && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-pink-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Fecha de inicio</p>
                      <p className="font-bold text-gray-900">
                        {new Date(curso.fechaInicio).toLocaleDateString('es-PE', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                )}

                {/* Certificado */}
                {curso.certificado && (
                  <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                    <Award className="w-6 h-6 text-green-600" />
                    <p className="font-bold text-green-700">Certificado incluido</p>
                  </div>
                )}
              </div>

              {/* CTA WhatsApp */}
              <a
                href={`https://wa.me/${SITE_CONFIG.contact. whatsapp}?text=Hola, me interesa el curso: ${encodeURIComponent(curso.titulo)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full block text-center bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all"
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