/**
 * Componente: Footer
 * Version: v1.1 - Corregido para Tailwind v4
 * Autor: Franz
 * Fecha: 2025-11-15
 * Descripción: Footer del sitio con información de contacto y redes sociales
 * Cambios v1.1:
 * - Actualizado flex-shrink-0 → shrink-0 (Tailwind v4)
 */

import Link from 'next/link';
import { Facebook, Instagram, Linkedin, MapPin, Phone, Mail } from 'lucide-react';
import { SITE_CONFIG, WHATSAPP_MESSAGE } from '@/constants';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: 'Facebook',
      href: SITE_CONFIG.social.facebook,
      icon: Facebook,
    },
    {
      name: 'Instagram',
      href: SITE_CONFIG.social.instagram,
      icon: Instagram,
    },
    
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Sobre Nosotros */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">
              {SITE_CONFIG.name}
            </h3>
            <p className="text-sm mb-4">
              {SITE_CONFIG.description}
            </p>
            <p className="text-xs italic text-red-400">
              {SITE_CONFIG.tagline}
            </p>
          </div>

          {/* Enlaces Rápidos */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">
              Enlaces Rápidos
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="#cursos" className="hover:text-red-400 transition-colors">
                  Nuestros Cursos
                </Link>
              </li>
              <li>
                <Link href="#nosotros" className="hover:text-red-400 transition-colors">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link href="#contacto" className="hover:text-red-400 transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Phone className="h-5 w-5 text-red-400 shrink-0" />
                <div className="text-sm">
                  {SITE_CONFIG.contact.phones.map((phone, index) => (
                    <div key={index}>
                      <a
                        href={`tel:${phone}`}
                        className="hover:text-red-400 transition-colors"
                      >
                        {phone}
                      </a>
                    </div>
                  ))}
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="h-5 w-5 text-red-400 shrink-0" />
                <a
                  href={`mailto:${SITE_CONFIG.contact.email}`}
                  className="text-sm hover:text-red-400 transition-colors"
                >
                  {SITE_CONFIG.contact.email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-red-400 shrink-0" />
                <span className="text-sm">Trujillo, Perú</span>
              </li>
            </ul>
          </div>

          {/* Redes Sociales */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">
              Síguenos
            </h3>
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-800 p-3 rounded-full hover:bg-red-500 transition-colors"
                    aria-label={social.name}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>

            {/* WhatsApp Button */}
            <a
              href={`https://wa.me/${SITE_CONFIG.contact.whatsapp}?text=${WHATSAPP_MESSAGE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Contáctanos por WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © {currentYear} {SITE_CONFIG.name}. Todos los derechos reservados.
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <Link href="/politica-privacidad" className="hover:text-red-400 transition-colors">
                Política de Privacidad
              </Link>
              <Link href="/terminos" className="hover:text-red-400 transition-colors">
                Términos de Uso
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}