/**
 * Página: Vista Pública de Curso
 * Version: v1.1 - CORREGIDO
 */

import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Calendar, Clock, MapPin, Award, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { SITE_CONFIG } from '@/constants';

async function getCurso(id: string) {
  try {
    const curso = await prisma.curso.findUnique({
      where: { id },
      include: {
        creador: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
    
    console.log('Curso encontrado:', curso); // Debug
    return curso;
  } catch (error) {
    console.error('Error fetching curso:', error);
    return null;
  }
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CursoPublicoPage({ params }: PageProps) {
  const { id } = await params;
  const curso = await getCurso(id);

  if (!curso) {
    console.log('Curso no encontrado, ID:', id); // Debug
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 text-white py-20">
        <div className="container mx-auto px-6">
          <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6">
            <ArrowLeft className="w-5 h-5" />
            Volver
          </Link>
          <h1 className="text-4xl font-bold mb-4">{curso.titulo}</h1>
          {curso.descripcionBreve && (
            <p className="text-xl text-white/90">{curso.descripcionBreve}</p>
          )}
        </div>
      </div>

      {/* Contenido */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {curso.imagenUrl && (
              <div className="relative w-full h-96 rounded-2xl overflow-hidden mb-8">
                <Image
                  src={curso.imagenUrl}
                  alt={curso.titulo}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-4">Descripción</h2>
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{
                  __html: curso.descripcion || 'Sin descripción',
                }}
              />
            </div>
          </div>

          <div>
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-6">
              <h3 className="text-xl font-bold mb-6">Información</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600">Duración</p>
                    <p className="font-bold">{curso.duracionHoras}h</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-600">Modalidad</p>
                    <p className="font-bold">{curso.modalidad}</p>
                  </div>
                </div>

                {curso.precio && (
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">💰</div>
                    <div>
                      <p className="text-sm text-gray-600">Precio</p>
                      <p className="font-bold">S/ {curso.precio.toFixed(2)}</p>
                    </div>
                  </div>
                )}

                {curso.fechaInicio && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-pink-500" />
                    <div>
                      <p className="text-sm text-gray-600">Inicio</p>
                      <p className="font-bold">
                        {new Date(curso.fechaInicio).toLocaleDateString('es-PE')}
                      </p>
                    </div>
                  </div>
                )}

                {curso.certificado && (
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-green-500" />
                    <p className="font-bold text-green-600">Certificado incluido</p>
                  </div>
                )}
              </div>

              <a
                href={`https://wa.me/${SITE_CONFIG.contact.whatsapp}?text=Hola, me interesa: ${curso.titulo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 w-full block text-center bg-green-500 text-white px-6 py-3 rounded-full font-bold hover:bg-green-600"
              >
                💬 Consultar por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}