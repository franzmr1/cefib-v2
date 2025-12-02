/**
 * Componente: NewsletterSection
 * Version: v2.0 - Con funcionalidad de suscripción
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-27
 * Descripción: Newsletter con guardado de emails en base de datos
 */

'use client';

import { useState } from 'react';
import { Mail, Send, Facebook, Instagram, CheckCircle2, AlertCircle } from 'lucide-react';
import { SITE_CONFIG } from '@/constants';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error');
      setMessage('Por favor ingresa un email válido');
      return;
    }

    setStatus('loading');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('¡Gracias por suscribirte!  Te mantendremos informado.');
        setEmail('');
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
        setMessage(data.error || 'Hubo un error.  Intenta nuevamente.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Error de conexión. Intenta más tarde.');
    }
  };

  return (
    <section className="relative py-16 md:py-20 overflow-hidden bg-gradient-to-r from-[#FF6B35] via-[#FF7A4D] to-[#FF8C5A]">
      {/* Patrón de fondo */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25. 98 15v30L30 60 4.02 45V15z' fill='none' stroke='white' stroke-width='2'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Icono */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl">
              <Mail className="w-8 h-8 md:w-10 md:h-10 text-white" />
            </div>
          </div>

          {/* Título */}
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
            SUSCRÍBETE
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-10">
            Para Mantenerte Informado
          </p>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-10">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ingresa tu email..."
                disabled={status === 'loading'}
                className="flex-1 px-6 py-4 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed text-base"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="inline-flex items-center justify-center gap-2 bg-white text-[#FF6B35] px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {status === 'loading' ?  (
                  <>
                    <div className="w-5 h-5 border-2 border-[#FF6B35] border-t-transparent rounded-full animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Suscribirme
                  </>
                )}
              </button>
            </div>

            {/* Mensajes de estado */}
            {status === 'success' && (
              <div className="mt-4 flex items-center justify-center gap-2 text-white bg-green-600/20 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/20">
                <CheckCircle2 className="w-5 h-5" />
                <p>{message}</p>
              </div>
            )}

            {status === 'error' && (
              <div className="mt-4 flex items-center justify-center gap-2 text-white bg-red-600/20 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/20">
                <AlertCircle className="w-5 h-5" />
                <p>{message}</p>
              </div>
            )}
          </form>

          {/* Redes sociales */}
          <div className="text-center">
            <p className="text-white/90 font-semibold mb-4">Síguenos en:</p>
            <div className="flex items-center justify-center gap-4">
              <a
                href={SITE_CONFIG.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white hover:text-[#FF6B35] transition-all transform hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a
                href={SITE_CONFIG.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white hover:text-[#FF6B35] transition-all transform hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}