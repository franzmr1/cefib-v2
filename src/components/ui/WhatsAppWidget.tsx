/**
 * WhatsApp Widget Flotante
 * Version: v1.0
 * Autor: Franz (@franzmr1)
 */

'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { SITE_CONFIG } from '@/constants';

export default function WhatsAppWidget() {
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Mostrar widget después de 3 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      // Mostrar tooltip inicial
      setTimeout(() => setShowTooltip(true), 500);
      // Ocultar tooltip después de 5 segundos
      setTimeout(() => setShowTooltip(false), 5500);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      '¡Hola! Me gustaría obtener más información sobre los cursos de CEFIB.'
    );
    const whatsappUrl = `https://wa.me/${SITE_CONFIG.contact.whatsapp}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Tooltip */}
      {showTooltip && (
        <div className="fixed bottom-24 right-6 z-40 animate-bounce">
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 max-w-xs">
            <button
              onClick={() => setShowTooltip(false)}
              className="absolute -top-2 -right-2 w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <X className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </button>
            
            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
              ¿Necesitas ayuda?
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Escríbenos por WhatsApp y te responderemos en minutos
            </p>

            {/* Flecha */}
            <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white dark:bg-gray-800 transform rotate-45" />
          </div>
        </div>
      )}

      {/* Botón flotante */}
      <button
        onClick={handleWhatsAppClick}
        className="fixed bottom-6 right-6 z-50 group"
        aria-label="Contactar por WhatsApp"
      >
        {/* Pulso animado */}
        <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75" />
        
        {/* Botón principal */}
        <div className="relative w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full shadow-2xl flex items-center justify-center transform transition-all duration-300 hover:scale-110 hover:shadow-green-500/50 group-hover:rotate-12">
          <MessageCircle className="w-8 h-8 text-white" />
          
          {/* Badge de "nuevo" */}
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse">
            1
          </span>
        </div>

        {/* Texto hover */}
        <span className="absolute right-20 top-1/2 -translate-y-1/2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          Chatea con nosotros
        </span>
      </button>
    </>
  );
}