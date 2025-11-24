/**
 * Componente: NewsletterSection
 * Version: v1.0
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-19
 * Descripción: Sección de suscripción a newsletter y redes sociales
 * Tipo: Client Component (maneja estado del formulario)
 */

'use client';

import { useState } from 'react';
import { Facebook, Instagram } from 'lucide-react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      alert('Por favor ingresa un email válido');
      return;
    }

    setIsSubscribing(true);
    
    // Simular suscripción (aquí irías a tu API)
    setTimeout(() => {
      alert('¡Gracias por suscribirte! Te mantendremos informado.');
      setEmail('');
      setIsSubscribing(false);
    }, 1000);
  };

  return (
    <section className="py-20 bg-linear-to-r from-red-400 via-orange-400 to-red-500">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center text-white">
          {/* Título */}
          <h2 className="text-4xl font-bold mb-4">SUSCRÍBETE</h2>
          <h3 className="text-2xl mb-8">Para Mantenerte Informado</h3>

          {/* Formulario de suscripción */}
          <form onSubmit={handleSubscribe} className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto mb-8">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ingresa tu email..."
              className="flex-1 px-6 py-4 rounded-full text-gray-900 border-4 border-white focus:outline-none focus:ring-2 focus:ring-white transition-all"
              disabled={isSubscribing}
            />
            <button
              type="submit"
              disabled={isSubscribing}
              className={`bg-white text-red-500 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-all ${
                isSubscribing ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubscribing ? 'Enviando...' : 'Suscribirme'}
            </button>
          </form>
          
          {/* Redes Sociales */}
          <div className="mt-12">
            <h4 className="text-2xl font-bold mb-6">Síguenos en:</h4>
            <div className="flex justify-center gap-6">
              <a
                href="https://www.facebook.com/cefib.sac"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white bg-opacity-20 hover:bg-opacity-30 p-4 rounded-full transition-all transform hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="w-8 h-8" />
              </a>
              <a
                href="https://www.instagram.com/cefibsac"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white bg-opacity-20 hover:bg-opacity-30 p-4 rounded-full transition-all transform hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram className="w-8 h-8" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}