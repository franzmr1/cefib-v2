/**
 * Componente: ServicioModal
 * Versión: 1.3 - Con imágenes funcionando
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-26
 */

'use client';

import { useEffect } from 'react';
import { X, CheckCircle, ArrowRight } from 'lucide-react';
import { ServicioData } from '@/data/servicios';

interface ServicioModalProps {
  isOpen: boolean;
  onClose: () => void;
  servicio: ServicioData;
}

export default function ServicioModal({ isOpen, onClose, servicio }: ServicioModalProps) {
  useEffect(() => {
    if (isOpen) {
      document. body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e. key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-[#003366] bg-opacity-95 transition-opacity animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="fixed inset-0 flex items-center justify-center p-2 sm:p-4 lg:p-8">
        <div className="relative bg-white rounded-xl lg:rounded-2xl shadow-2xl w-full max-w-7xl h-[95vh] lg:h-[90vh] overflow-hidden animate-scaleIn flex flex-col">
          {/* Botón Cerrar */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-all group"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5 text-gray-600 group-hover:text-[#FF6B35] transition-colors" />
          </button>

          {/* Grid */}
          <div className="grid lg:grid-cols-5 flex-1 overflow-hidden">
            {/* COLUMNA IZQUIERDA */}
            <div className="lg:col-span-2 bg-gradient-to-br from-[#003366] to-[#004488] p-4 sm:p-6 lg:p-8 flex flex-col justify-between text-white relative overflow-y-auto">
              {/* Logo */}
              <div className="mb-4 lg:mb-6">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">CEFIB</div>
                <div className="text-xs lg:text-sm text-orange-400 tracking-wider">TRAIN WIN LEADERS</div>
              </div>

              {/* Imagen del Servicio - ✅ CORREGIDO */}
              <div className="relative w-full aspect-video rounded-lg lg:rounded-xl overflow-hidden shadow-2xl mb-4 lg:mb-6">
                {/* Fondo de respaldo */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#003366] to-[#0055AA] z-0">
                  <div className="text-center px-4">
                    <span className="text-white text-lg lg:text-2xl font-bold block mb-2">
                      {servicio.titulo}
                    </span>
                    <div className="w-16 h-1 bg-[#FF6B35] mx-auto rounded-full"></div>
                  </div>
                </div>
                
                {/* Imagen real */}
                <img
                  src={servicio.imagenUrl}
                  alt={servicio.titulo}
                  className="absolute inset-0 w-full h-full object-cover z-10"
                  onLoad={(e) => {
                    // Cuando carga exitosamente, agregar efecto fade-in
                    e.currentTarget.style.  opacity = '1';
                  }}
                  onError={(e) => {
                    // Si falla, ocultar y mostrar solo el fondo
                    e.currentTarget.style.display = 'none';
                    console.error('Error cargando imagen:', servicio.imagenUrl);
                  }}
                  style={{ opacity: 0, transition: 'opacity 0. 3s ease-in' }}
                />
              </div>

              {/* Título y Descripción */}
              <div className="flex-grow">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 lg:mb-4">
                  {servicio.titulo}
                </h2>
                <p className="text-gray-200 text-sm lg:text-base leading-relaxed">
                  {servicio.descripcion}
                </p>
              </div>

              {/* Decoración geométrica */}
              <div className="absolute top-0 right-0 w-20 h-20 lg:w-32 lg:h-32 bg-[#FF6B35] opacity-20 rounded-bl-full" />
              <div className="absolute bottom-0 left-0 w-16 h-16 lg:w-24 lg:h-24 bg-[#FF6B35] opacity-20 rounded-tr-full" />
            </div>

            {/* COLUMNA DERECHA */}
            <div className="lg:col-span-3 bg-white flex flex-col overflow-hidden">
              {/* Header - FIJO */}
              <div className="p-4 sm:p-6 lg:p-8 border-b border-gray-200 flex-shrink-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1 h-6 lg:h-8 bg-[#FF6B35]" />
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#003366]">
                    TEMARIO DE SERVICIOS
                  </h3>
                </div>
                <p className="text-gray-600 text-xs sm:text-sm">
                  Programa completo de capacitación profesional - {servicio.temario.length} módulos
                </p>
              </div>

              {/* Lista - SCROLLABLE */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                <div className="space-y-2 lg:space-y-3">
                  {servicio. temario.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 lg:gap-3 group hover:bg-gray-50 p-2 lg:p-3 rounded-lg transition-all"
                    >
                      <div className="flex-shrink-0 w-6 h-6 lg:w-7 lg:h-7 bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] rounded-full flex items-center justify-center mt-0.5">
                        <CheckCircle className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
                      </div>
                      <span className="text-xs sm:text-sm lg:text-base text-gray-700 group-hover:text-[#003366] leading-relaxed flex-1">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA - FIJO */}
              <div className="p-4 sm:p-6 lg:p-8 border-t border-gray-200 bg-gray-50 flex-shrink-0">
                <div className="bg-gradient-to-r from-[#003366] to-[#004488] rounded-lg lg:rounded-xl p-4 lg:p-6 text-white text-center">
                  <p className="font-semibold mb-3 text-sm lg:text-base">
                    ¿Interesado en este programa?
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      window.location.href = '/contacto';
                    }}
                    className="inline-flex items-center gap-2 bg-[#FF6B35] hover:bg-[#FF8C5A] text-white px-6 lg:px-8 py-2.5 lg:py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg text-sm lg:text-base"
                  >
                    Solicitar Información
                    <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        . animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}