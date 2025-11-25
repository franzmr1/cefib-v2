/**
 * Componente: NosotrosSection
 * Version: v1.0
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-19
 * Descripción: Sección Quiénes Somos - Misión, Visión y Objetivos
 * Tipo: Server Component
 */

import { SITE_CONFIG, WHATSAPP_MESSAGE } from '@/constants';

export default function NosotrosSection() {
  return (
    <section id="nosotros" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        {/* Título principal */}
        <div className="text-center mb-12">
          <div className="text-red-500 font-semibold mb-4 uppercase tracking-wider">
            CEFIB Train Win Leaders
          </div>
          <h2 className="text-4xl font-bold text-blue-900">
            QUIÉNES SOMOS
          </h2>
        </div>

        {/* Misión y Visión */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          {/* Misión */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
            <h3 className="text-3xl font-bold text-red-500 mb-4">Misión</h3>
            <div className="text-xl font-semibold text-gray-900 mb-4">
              CEFIB Train Win Leaders
            </div>
            <p className="text-gray-700 leading-relaxed text-lg mb-6">
              Fortalecer el rendimiento de las personas, organizaciones e instituciones
              mediante el conocimiento, aprendizaje y desarrollo de habilidades efectivas.
            </p>
            <a
              href={`https://wa.me/${SITE_CONFIG.contact.whatsapp}?text=${WHATSAPP_MESSAGE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:from-red-600 hover:to-pink-600 transition-all shadow-lg"
            >
              Contáctenos
            </a>
          </div>

          {/* Visión */}
          <div className="bg-gradient-to-br from-pink-50 to-red-50 rounded-2xl p-8">
            <h3 className="text-3xl font-bold text-red-500 mb-4">Visión</h3>
            <div className="text-xl font-semibold text-gray-900 mb-4">
              Líderes del futuro
            </div>
            <p className="text-gray-700 leading-relaxed text-lg mb-6">
              Ser líderes en el desarrollo y formación competitiva de personas y organizaciones,
              manteniendo el ritmo de la evolución y liderando en un mundo competitivo y en constante cambio.
            </p>
            <a
              href={`https://wa.me/${SITE_CONFIG.contact.whatsapp}?text=${WHATSAPP_MESSAGE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:from-red-600 hover:to-pink-600 transition-all shadow-lg"
            >
              Conoce Más
            </a>
          </div>
        </div>

        {/* Objetivos Estratégicos */}
        <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-3xl shadow-2xl overflow-hidden">
          {/* Header del card */}
          <div className="p-8 text-center">
            <h3 className="text-4xl font-bold text-white mb-2">
              Objetivos Estratégicos
            </h3>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-pink-400 mx-auto mt-4"></div>
          </div>

          {/* Contenido */}
          <div className="p-12 bg-white">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Objetivo 1 */}
              <div className="flex gap-4">
                <div className="shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                    1
                  </div>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    Programas de Alta Calidad
                  </h4>
                  <p className="text-gray-700">
                    Desarrollar e implementar programas de alta calidad y competitividad,
                    donde el cliente valore y ejecute eficientemente contenidos actualizados,
                    prácticos y con un enfoque aplicativo a resultados.
                  </p>
                </div>
              </div>

              {/* Objetivo 2 */}
              <div className="flex gap-4">
                <div className="shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    2
                  </div>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    Equipos Multidisciplinarios
                  </h4>
                  <p className="text-gray-700">
                    Consolidar equipos multidisciplinarios inteligentes y talentosos que
                    desarrollen capacidades y competencias aplicables en sus actividades
                    y tareas para el logro de sus metas.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8 text-center">
              <a
                href={`https://wa.me/${SITE_CONFIG.contact.whatsapp}?text=${WHATSAPP_MESSAGE}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white px-10 py-4 rounded-full font-semibold hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105"
              >
                Únete a Nuestra Visión
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}