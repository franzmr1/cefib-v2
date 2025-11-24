/**
 * Componente: UbicacionSection
 * Version: v1.0
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-19
 * Descripción: Sección de ubicación con mapa y datos de contacto
 * Tipo: Server Component
 */

import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { SITE_CONFIG, WHATSAPP_MESSAGE } from '@/constants';

export default function UbicacionSection() {
  return (
    <section id="ubicacion" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        {/* Título de sección */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-linear-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center text-white">
              <MapPin className="w-10 h-10" />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-blue-900 mb-4">
            ¿Cómo Llegar?
          </h2>
          <p className="text-xl text-gray-600">
            Visítanos en nuestra oficina principal
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Información de contacto */}
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Nuestra Dirección
            </h3>
            <div className="space-y-6">
              {/* Dirección */}
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-red-500 shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900">Dirección</p>
                  <p className="text-gray-700">MZA. S LOTE. 9 URB. COVICORTI</p>
                  <p className="text-gray-700">Trujillo, Perú</p>
                </div>
              </div>

              {/* Teléfonos */}
              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-red-500 shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900">Teléfonos</p>
                  <p className="text-gray-700">{SITE_CONFIG.contact.phones[0]}</p>
                  <p className="text-gray-700">{SITE_CONFIG.contact.phones[1]}</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-red-500 shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900">Email</p>
                  <p className="text-gray-700">{SITE_CONFIG.contact.email}</p>
                </div>
              </div>

              {/* Horario */}
              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-red-500 shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900">Horario de Atención</p>
                  <p className="text-gray-700">Lunes a Viernes</p>
                  <p className="text-gray-700">{SITE_CONFIG.contact.schedule}</p>
                </div>
              </div>
            </div>

            {/* Botón de contacto */}
            <a
              href={`https://wa.me/${SITE_CONFIG.contact.whatsapp}?text=${WHATSAPP_MESSAGE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 w-full inline-flex items-center justify-center gap-2 bg-linear-to-r from-red-500 to-pink-500 text-white px-8 py-4 rounded-full font-semibold hover:from-red-600 hover:to-pink-600 transition-all transform hover:scale-105"
            >
              <Phone className="w-5 h-5" />
              Contáctanos Ahora
            </a>
          </div>

          {/* Mapa de Google */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-xl">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d718.7153312853152!2d-79.04387278993265!3d-8.109010717247466!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sS%2C%20Trujillo%2013011!5e0!3m2!1ses-419!2spe!4v1761276110256!5m2!1ses-419!2spe" 
              width="100%" 
              height="100%" 
              style={{ border: 0, minHeight: '450px' }}
              allowFullScreen={true}
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}