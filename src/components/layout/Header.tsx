/**
 * Componente: Header
 * Version: v3.0 - TAILWIND V4 COMPLIANT
 * Autor: Franz
 * Fecha: 2025-11-25
 * Descripción: Header principal del sitio - Sintaxis v4 + Responsive optimizado
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Phone, Mail } from 'lucide-react';
import { SITE_CONFIG, ROUTES } from '@/constants';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: ROUTES.HOME, label: 'Inicio' },
    { href: '#cursos', label: 'Cursos' },
    { href: '#nosotros', label: 'Nosotros' },
    { href: '#contacto', label: 'Contacto' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      {/* Top Bar - Información de Contacto */}
      <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white">
        <div className="container mx-auto px-4 py-2">
          <div className="flex flex-wrap items-center justify-between text-xs md:text-sm">
            {/* Teléfonos */}
            <div className="flex items-center gap-2 md:gap-4">
              <a
                href={`tel:${SITE_CONFIG.contact.phones[0]}`}
                className="flex items-center gap-1 hover:underline"
              >
                <Phone className="h-3 w-3 md:h-4 md:w-4" />
                <span className="hidden sm:inline">{SITE_CONFIG.contact.phones[0]}</span>
              </a>
              <a
                href={`mailto:${SITE_CONFIG.contact.email}`}
                className="hidden md:flex items-center gap-1 hover:underline"
              >
                <Mail className="h-4 w-4" />
                <span>{SITE_CONFIG.contact.email}</span>
              </a>
            </div>

            {/* Horario */}
            <div className="hidden sm:block text-xs">
              Horario: {SITE_CONFIG.contact.schedule}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
<Link 
  href={ROUTES.HOME} 
  className="flex items-center gap-2 md:gap-3 group"
>
  {/* Solo logo "C" */}
  <div className="relative h-11 w-11 md:h-14 md:w-14 shrink-0 group-hover:scale-110 transition-transform duration-300">
    <Image
      src="/images/logo/logo-C.png"
      alt="Logo CEFIB"
      fill
      className="object-contain drop-shadow-md"
      priority
      unoptimized
    />
  </div>

  {/* Texto HTML (oculto en móvil pequeño) */}
  <div className="hidden sm:block">
    <h1 className="text-xl md:text-2xl font-bold text-[#003366] leading-tight">
      CEFIB
    </h1>
    <p className="text-[10px] md:text-xs text-[#FF6B35] font-bold tracking-widest uppercase">
      Train Win Leaders
    </p>
  </div>
</Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-red-500 font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={ROUTES.LOGIN}
              className="inline-flex items-center justify-center px-4 py-2 text-base font-semibold rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-md hover:shadow-lg"
            >
              Ingresar
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-700 hover:text-red-500 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-200 animate-fade-in">
            <div className="flex flex-col gap-2 pt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-700 hover:text-red-500 hover:bg-gray-50 font-medium transition-colors px-3 py-2 rounded-lg"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href={ROUTES.LOGIN}
                onClick={() => setIsMobileMenuOpen(false)}
                className="inline-flex items-center justify-center mt-2 px-4 py-2 text-base font-semibold rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-md"
              >
                Ingresar
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}