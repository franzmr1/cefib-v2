/**
 * Página: Términos y Condiciones
 * Versión: 1.0
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-12-07
 * Descripción: Términos y condiciones de uso del sitio web y servicios de CEFIB
 */

import { Metadata } from 'next';
import Link from 'next/link';
import { FileText, ArrowLeft, Mail, Phone, Calendar, AlertTriangle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Términos y Condiciones - CEFIB',
  description: 'Términos y condiciones de uso del sitio web y servicios de CEFIB',
};

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-900 to-blue-900 text-white py-16">
        <div className="container mx-auto px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al inicio
          </Link>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Términos y Condiciones</h1>
              <p className="text-white/90 mt-2">
                Condiciones de uso del sitio web y servicios
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-white/70">
            <Calendar className="w-4 h-4" />
            <span>Última actualización: 07 de diciembre de 2025</span>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-8">
            {/* Aceptación */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Aceptación de los Términos</h2>
              <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
                <p>
                  Al acceder y utilizar el sitio web de{' '}
                  <strong>CEFIB - Centro de Formación y Especialización Profesional Iberoamericano</strong> (en adelante, "el Sitio"), 
                  aceptas estar vinculado por estos Términos y Condiciones, todas las leyes y regulaciones aplicables, 
                  y aceptas que eres responsable del cumplimiento de las leyes locales aplicables.
                </p>
                <p>
                  Si no estás de acuerdo con alguno de estos términos, no debes usar este sitio.
                </p>
              </div>
            </section>

            {/* Uso del sitio */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Uso del Sitio Web</h2>
              <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">2.1.  Uso Permitido</h3>
                <p>Este sitio web está destinado para:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Informarte sobre nuestros cursos, diplomados y programas de formación</li>
                  <li>Solicitar información sobre programas personalizados</li>
                  <li>Suscribirte a nuestro newsletter</li>
                  <li>Inscribirte en nuestros cursos y programas</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mt-6">2.2. Uso Prohibido</h3>
                <p>No está permitido:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Usar el sitio para cualquier propósito ilegal o no autorizado</li>
                  <li>Intentar acceder a áreas restringidas del sitio</li>
                  <li>Interferir con la seguridad o funcionalidad del sitio</li>
                  <li>Transmitir virus, malware o código malicioso</li>
                  <li>Realizar scraping automatizado de contenido sin autorización</li>
                  <li>Hacerse pasar por otra persona o entidad</li>
                </ul>
              </div>
            </section>

            {/* Servicios */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Servicios Ofrecidos</h2>
              <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">3.1. Cursos y Programas de Formación</h3>
                <p>CEFIB ofrece:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Cursos virtuales, presenciales e híbridos</li>
                  <li>Diplomados especializados</li>
                  <li>Programas personalizados corporativos e individuales</li>
                  <li>Certificaciones profesionales</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mt-6">3.2. Inscripciones y Pagos</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Las inscripciones se realizan según disponibilidad de cupos</li>
                  <li>Los precios están sujetos a cambios sin previo aviso</li>
                  <li>Los métodos de pago aceptados se informarán en cada curso</li>
                  <li>Una vez confirmada la inscripción, recibirás un correo de confirmación</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mt-6">3.3.  Certificados</h3>
                <p>
                  Los certificados se emitirán al completar satisfactoriamente el curso, cumpliendo con los 
                  requisitos de asistencia y evaluación establecidos. 
                </p>
              </div>
            </section>

            {/* Propiedad intelectual */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Propiedad Intelectual</h2>
              <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
                <p>
                  Todo el contenido del sitio, incluyendo pero no limitado a textos, gráficos, logotipos, 
                  imágenes, videos, materiales de curso y software, es propiedad de CEFIB o sus proveedores 
                  de contenido y está protegido por las leyes de propiedad intelectual del Perú y tratados 
                  internacionales.
                </p>
                <p>
                  No está permitido reproducir, distribuir, modificar o crear obras derivadas sin autorización 
                  expresa por escrito de CEFIB. 
                </p>
              </div>
            </section>

            {/* Responsabilidad */}
            <section className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
                5. Limitación de Responsabilidad
              </h2>
              <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
                <p>
                  CEFIB se esfuerza por mantener la información del sitio actualizada y precisa. Sin embargo:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    No garantizamos la disponibilidad ininterrumpida del sitio
                  </li>
                  <li>
                    No nos hacemos responsables de errores técnicos o interrupciones del servicio
                  </li>
                  <li>
                    No somos responsables de daños derivados del uso o imposibilidad de uso del sitio
                  </li>
                  <li>
                    No garantizamos que el sitio esté libre de virus u otros componentes dañinos
                  </li>
                </ul>
                <p className="font-semibold text-gray-900">
                  En caso de cursos virtuales, CEFIB no se responsabiliza por problemas de conectividad 
                  de internet del participante.
                </p>
              </div>
            </section>

            {/* Cancelaciones */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Políticas de Cancelación y Reembolso</h2>
              <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">6.1. Cancelación por el Participante</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Más de 7 días antes del inicio:</strong> Reembolso del 80% del monto pagado
                  </li>
                  <li>
                    <strong>Entre 7 y 3 días antes del inicio:</strong> Reembolso del 50% del monto pagado
                  </li>
                  <li>
                    <strong>Menos de 3 días antes del inicio:</strong> No hay reembolso
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mt-6">6.2.  Cancelación por CEFIB</h3>
                <p>
                  CEFIB se reserva el derecho de cancelar un curso si no se alcanza el número mínimo de 
                  participantes.  En este caso, se reembolsará el 100% del monto pagado o se ofrecerá la 
                  opción de transferir la inscripción a otro curso.
                </p>
              </div>
            </section>

            {/* Enlaces externos */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Enlaces a Sitios de Terceros</h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                <p>
                  Este sitio puede contener enlaces a sitios web de terceros.  CEFIB no tiene control sobre 
                  el contenido de estos sitios y no se responsabiliza de su contenido, políticas de privacidad 
                  o prácticas. 
                </p>
              </div>
            </section>

            {/* Modificaciones */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8.  Modificaciones de los Términos</h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                <p>
                  CEFIB se reserva el derecho de modificar estos Términos y Condiciones en cualquier momento. 
                  Las modificaciones entrarán en vigencia inmediatamente después de su publicación en el sitio.  
                  Tu uso continuado del sitio después de dichas modificaciones constituye tu aceptación de los 
                  nuevos términos.
                </p>
              </div>
            </section>

            {/* Ley aplicable */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Ley Aplicable y Jurisdicción</h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                <p>
                  Estos Términos y Condiciones se rigen por las leyes de la República del Perú.  Cualquier 
                  disputa que surja en relación con estos términos será sometida a la jurisdicción exclusiva 
                  de los tribunales de Trujillo, La Libertad, Perú.
                </p>
              </div>
            </section>

            {/* Privacidad */}
            <section className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Privacidad de Datos</h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                <p>
                  El tratamiento de tus datos personales está regulado por nuestra{' '}
                  <Link href="/politica-privacidad" className="text-blue-600 font-semibold underline">
                    Política de Privacidad
                  </Link>
                  , la cual forma parte integral de estos Términos y Condiciones.
                </p>
              </div>
            </section>

            {/* Contacto */}
            <section className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contacto</h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                <p>Para consultas sobre estos Términos y Condiciones, contáctanos:</p>
                <div className="space-y-2 mt-4">
                  <p className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <a href="mailto:informes@cefib.pe" className="text-blue-600 font-semibold">
                      informes@cefib.pe
                    </a>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-blue-600" />
                    <span>973594951 / 982294240</span>
                  </p>
                </div>
              </div>
            </section>

            {/* Aceptación final */}
            <section className="bg-purple-50 border border-purple-200 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Aceptación</h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                <p className="font-semibold">
                  Al usar este sitio web, confirmas que has leído, comprendido y aceptado estos Términos y 
                  Condiciones en su totalidad.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}