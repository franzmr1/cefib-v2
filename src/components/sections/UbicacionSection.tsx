/**
 * Componente: UbicacionSection
 * Version: v4.0 - Diseño balanceado con mejor distribución
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-27
 * Descripción: Sección de ubicación con layout optimizado
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin, Phone, Mail, Clock, Navigation } from 'lucide-react';
import { SITE_CONFIG, WHATSAPP_MESSAGE } from '@/constants';

export default function UbicacionSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -100px 0px' }
    );

    if (sectionRef.current) {
      observer. observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const contactInfo = [
    {
      icon: MapPin,
      label: 'Dirección',
      value: 'MZA.  S LOTE.  9 URB. COVICORTI',
      value2: 'Trujillo, Perú',
    },
    {
      icon: Phone,
      label: 'Teléfonos',
      value: SITE_CONFIG.contact.phones[0],
      value2: SITE_CONFIG.contact.phones[1],
    },
    {
      icon: Mail,
      label: 'Email',
      value: SITE_CONFIG.contact.email,
    },
    {
      icon: Clock,
      label: 'Horario',
      value: 'Lunes a Viernes',
      value2: SITE_CONFIG.contact.schedule,
    },
  ];

  return (
    <section
      id="ubicacion"
      ref={sectionRef}
      className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-b from-gray-50 via-white to-gray-50"
    >
      {/* Patrón de fondo sutil */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25. 98 15v30L30 60 4.02 45V15z' fill='none' stroke='%23FF6B35' stroke-width='2'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header con icono decorativo */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ?  'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {/* Icono decorativo */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] rounded-2xl flex items-center justify-center text-white shadow-2xl transform hover:scale-110 hover:rotate-6 transition-all duration-300">
                <MapPin className="w-10 h-10 md:w-12 md:h-12" />
              </div>
              {/* Ping animation */}
              <span className="absolute -top-1 -right-1 flex h-5 w-5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6B35] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-5 w-5 bg-[#FF6B35]"></span>
              </span>
            </div>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#003366] mb-4">
            ¿Cómo Llegar? 
          </h2>
          <p className="text-lg md:text-xl text-gray-600">
            Visítanos en nuestra oficina principal en Trujillo
          </p>
          <div className="flex justify-center mt-6">
            <div className="h-1 w-24 bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] rounded-full" />
          </div>
        </div>

        {/* Grid balanceado: 45% info / 55% mapa */}
        <div className="max-w-6xl mx-auto">
          <div
            className={`grid lg:grid-cols-12 gap-8 md:gap-10 transition-all duration-1000 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            {/* Información de contacto - 5 columnas (más ancho) */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl p-8 md:p-10 shadow-lg border border-gray-100 h-full">
                <h3 className="text-2xl md:text-3xl font-bold text-[#003366] mb-8">
                  Nuestra Dirección
                </h3>

                <div className="space-y-8">
                  {contactInfo. map((item, idx) => {
                    const Icon = item. icon;
                    return (
                      <div key={idx} className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] rounded-xl flex items-center justify-center shrink-0 shadow-md">
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-500 mb-1. 5">
                            {item. label}
                          </p>
                          <p className="text-gray-900 font-medium leading-relaxed">
                            {item.value}
                          </p>
                          {item.value2 && (
                            <p className="text-gray-900 font-medium leading-relaxed">
                              {item.value2}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Botones con más padding */}
                <div className="space-y-4 mt-10">
                  <a
                    href={`https://wa.me/${SITE_CONFIG.contact.whatsapp}?text=${WHATSAPP_MESSAGE}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl hover:shadow-[#FF6B35]/30 transform hover:scale-105 transition-all"
                  >
                    <Phone className="w-5 h-5" />
                    Contáctanos por WhatsApp
                  </a>

                  <a
                    href="https://www.google.com/maps/dir//S+Trujillo+13011/@-8.1092937,-79.0437594,19z/data=!4m8!4m7!1m0!1m5!1m1!1s0x91ad3da2443c0993:0xaf5c72bfb630dda4!2m2!1d-79.0437594!2d-8.1092937?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-3 bg-white text-[#003366] border-2 border-[#003366] px-8 py-4 rounded-xl font-semibold hover:bg-[#003366] hover:text-white transition-all"
                  >
                    <Navigation className="w-5 h-5" />
                    Cómo Llegar
                  </a>
                </div>
              </div>
            </div>

            {/* Mapa - 7 columnas */}
            <div className="lg:col-span-7">
              <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 h-full min-h-[500px] md:min-h-[600px]">
                {/* Badge flotante */}
                <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-sm px-4 py-3 rounded-xl shadow-md">
                  <p className="text-sm font-bold text-[#003366] flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#FF6B35]" />
                    CEFIB - Trujillo, Perú
                  </p>
                </div>

                {/* Iframe del mapa */}
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d718.7153312853152!2d-79.04387278993265!3d-8.109010717247466!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sS%2C%20Trujillo%2013011!5e0!3m2!1ses-419!2spe!4v1761276110256!5m2!1ses-419!2spe"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                  title="Mapa de ubicación CEFIB Trujillo"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div
          className={`mt-12 text-center transition-all duration-1000 delay-400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <p className="text-gray-600 text-sm md:text-base flex items-center justify-center gap-2">
            <Clock className="w-4 h-4 text-[#FF6B35]" />
            Te esperamos de{' '}
            <span className="font-semibold text-[#003366]">
              Lunes a Viernes, {SITE_CONFIG.contact.schedule}
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}