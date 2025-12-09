/**
 * Página: Política de Privacidad
 * Versión: 1.0
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-12-07
 * Descripción: Política de privacidad conforme a Ley N° 29733 (Perú)
 */

import { Metadata } from 'next';
import Link from 'next/link';
import { Shield, ArrowLeft, Mail, Phone, MapPin, Calendar } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Política de Privacidad - CEFIB',
  description: 'Política de privacidad y protección de datos personales de CEFIB - Conforme a la Ley N° 29733',
};

export default function PoliticaPrivacidadPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-900 to-purple-900 text-white py-16">
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
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Política de Privacidad</h1>
              <p className="text-white/90 mt-2">
                Protección de Datos Personales - CEFIB
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
            {/* Introducción */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introducción</h2>
              <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
                <p>
                  En <strong>CEFIB - Centro de Formación y Especialización Profesional Iberoamericano</strong>, nos comprometemos 
                  a proteger y respetar tu privacidad.  Esta Política de Privacidad describe cómo recopilamos, 
                  usamos, almacenamos y protegemos tu información personal de acuerdo con la{' '}
                  <strong>Ley N° 29733 - Ley de Protección de Datos Personales del Perú</strong> y su Reglamento.
                </p>
                <p>
                  Al utilizar nuestro sitio web y servicios, aceptas las prácticas descritas en esta política. 
                </p>
              </div>
            </section>

            {/* Responsable del tratamiento */}
            <section className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Responsable del Tratamiento de Datos</h2>
              <div className="space-y-3 text-gray-700">
                <p><strong>Razón Social:</strong> CEFIB - Centro de Formación y Especialización Profesional Iberoamericano</p>
                <p className="flex items-start gap-2">
                  <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                  <span><strong>Domicilio:</strong> Trujillo, Perú</span>
                </p>
                <p className="flex items-start gap-2">
                  <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                  <span><strong>Correo electrónico:</strong> informes@cefib.pe</span>
                </p>
                <p className="flex items-start gap-2">
                  <Phone className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                  <span><strong>Teléfono:</strong> 973594951 / 982294240</span>
                </p>
              </div>
            </section>

            {/* Datos que recopilamos */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Datos Personales que Recopilamos</h2>
              <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
                <p>Recopilamos la siguiente información personal únicamente con tu consentimiento:</p>
                
                <h3 className="text-xl font-semibold text-gray-900 mt-6">3.1.  Formulario de Solicitud de Programas Personalizados</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Nombres completos</li>
                  <li>Correo electrónico</li>
                  <li>Número de teléfono/celular</li>
                  <li>Nombre de empresa o institución (opcional)</li>
                  <li>Cargo (opcional)</li>
                  <li>Tipo de programa de interés</li>
                  <li>Mensaje o consulta</li>
                  <li>Dirección IP (para fines de seguridad)</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mt-6">3.2.  Suscripción al Newsletter</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Correo electrónico</li>
                  <li>Dirección IP (para fines de seguridad)</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mt-6">3.3.  Gestión Interna (Docentes, Participantes, Inscripciones)</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Datos de identificación (nombres, apellidos, DNI)</li>
                  <li>Datos de contacto (email, teléfono, dirección)</li>
                  <li>Datos académicos y profesionales</li>
                  <li>Información de pago (solo para inscripciones)</li>
                </ul>
              </div>
            </section>

            {/* Finalidad */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Finalidad del Tratamiento de Datos</h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                <p className="font-semibold text-gray-900">Utilizamos tus datos personales exclusivamente para:</p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>
                    <strong>Contacto y comunicación:</strong> Responder a tus solicitudes de información sobre 
                    programas personalizados y cursos. 
                  </li>
                  <li>
                    <strong>Newsletter:</strong> Enviarte información relevante sobre nuestros cursos, programas 
                    y novedades (solo si te has suscrito voluntariamente).
                  </li>
                  <li>
                    <strong>Gestión administrativa:</strong> Administrar inscripciones, asistencia, certificados 
                    y pagos de participantes.
                  </li>
                  <li>
                    <strong>Gestión académica:</strong> Coordinar la asignación de docentes y seguimiento de cursos.
                  </li>
                  <li>
                    <strong>Mejora de servicios:</strong> Analizar tendencias y mejorar la calidad de nuestros programas.
                  </li>
                </ul>
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg mt-6">
                  <p className="font-semibold text-green-900">
                    ✅ No vendemos, alquilamos ni compartimos tu información con terceros con fines comerciales.
                  </p>
                </div>
              </div>
            </section>

            {/* Base legal */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Base Legal del Tratamiento</h2>
              <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
                <p>El tratamiento de tus datos personales se basa en:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Consentimiento informado:</strong> Al completar nuestros formularios, aceptas 
                    expresamente el tratamiento de tus datos para las finalidades descritas.
                  </li>
                  <li>
                    <strong>Ejecución contractual:</strong> Cuando te inscribes en un curso, el tratamiento 
                    es necesario para cumplir con el contrato de servicios educativos.
                  </li>
                  <li>
                    <strong>Cumplimiento legal:</strong> En algunos casos, estamos obligados a conservar 
                    ciertos datos por requisitos legales y contables.
                  </li>
                </ul>
              </div>
            </section>

            {/* Seguridad */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Seguridad de los Datos</h2>
              <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
                <p>Implementamos medidas técnicas y organizativas apropiadas para proteger tus datos:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Cifrado de datos en tránsito y almacenamiento (SSL/TLS)</li>
                  <li>Acceso restringido mediante autenticación de usuarios</li>
                  <li>Respaldos periódicos de la base de datos</li>
                  <li>Auditorías de seguridad y monitoreo de accesos</li>
                  <li>Servidores seguros con protección contra ataques cibernéticos</li>
                </ul>
              </div>
            </section>

            {/* Derechos ARCO */}
            <section className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-r-xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Tus Derechos (Derechos ARCO)</h2>
              <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
                <p>De acuerdo con la Ley N° 29733, tienes derecho a:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Acceso:</strong> Conocer qué datos personales tenemos sobre ti. </li>
                  <li><strong>Rectificación:</strong> Solicitar la corrección de datos inexactos o incompletos.</li>
                  <li><strong>Cancelación:</strong> Solicitar la eliminación de tus datos personales. </li>
                  <li><strong>Oposición:</strong> Oponerte al tratamiento de tus datos en ciertos casos.</li>
                  <li><strong>Revocación del consentimiento:</strong> Retirar tu consentimiento en cualquier momento.</li>
                </ul>
                <p className="mt-4">
                  Para ejercer estos derechos, envía un correo a{' '}
                  <a href="mailto:informes@cefib.pe" className="text-purple-600 font-semibold">
                    informes@cefib.pe
                  </a>{' '}
                  con el asunto "Ejercicio de Derechos ARCO" e incluye:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Nombre completo</li>
                  <li>Copia de DNI</li>
                  <li>Descripción del derecho que deseas ejercer</li>
                </ul>
                <p className="text-sm text-gray-600 mt-4">
                  Responderemos a tu solicitud en un plazo máximo de 10 días hábiles.
                </p>
              </div>
            </section>

            {/* Retención */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Tiempo de Retención de Datos</h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Solicitudes de información:</strong> Hasta 2 años después de la última interacción. 
                  </li>
                  <li>
                    <strong>Newsletter:</strong> Hasta que solicites tu baja o des de baja tu suscripción.
                  </li>
                  <li>
                    <strong>Datos de participantes e inscripciones:</strong> Hasta 5 años por requisitos contables 
                    y fiscales.
                  </li>
                  <li>
                    <strong>Datos de docentes:</strong> Mientras exista la relación laboral o contractual, 
                    más el tiempo legal requerido.
                  </li>
                </ul>
              </div>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Cookies y Tecnologías Similares</h2>
              <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
                <p>
                  Nuestro sitio web utiliza cookies esenciales para su funcionamiento. No utilizamos cookies 
                  de publicidad ni seguimiento de terceros. 
                </p>
                <p className="text-sm text-gray-600">
                  Puedes configurar tu navegador para rechazar cookies, pero esto puede afectar la funcionalidad 
                  del sitio. 
                </p>
              </div>
            </section>

            {/* Transferencias */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Transferencias Internacionales</h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                <p>
                  Actualmente no realizamos transferencias internacionales de datos personales. Todos tus datos 
                  son almacenados en servidores ubicados en ubicaciones seguras con cumplimiento de estándares 
                  internacionales de seguridad.
                </p>
              </div>
            </section>

            {/* Menores */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Menores de Edad</h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                <p>
                  Nuestros servicios están dirigidos a personas mayores de 18 años.  Si eres menor de edad, 
                  necesitas el consentimiento de tus padres o tutores para proporcionar datos personales.
                </p>
              </div>
            </section>

            {/* Cambios */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Cambios en la Política de Privacidad</h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                <p>
                  Nos reservamos el derecho de actualizar esta Política de Privacidad.  Te notificaremos de 
                  cambios significativos mediante aviso en nuestro sitio web o por correo electrónico.
                </p>
              </div>
            </section>

            {/* Contacto */}
            <section className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13.  Contacto</h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                <p>Para cualquier consulta sobre esta Política de Privacidad, contáctanos:</p>
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
          </div>
        </div>
      </div>
    </div>
  );
}