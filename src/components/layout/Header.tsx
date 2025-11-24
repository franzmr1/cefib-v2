/**
 * Componente: Header
 * Version: v1.1 - Corregido para Tailwind v4
 * Autor: Franz
 * Fecha: 2025-11-15
 * Descripción: Header principal del sitio con navegación responsive
 * Cambios v1.1:
 * - Actualizado bg-gradient-to-r → bg-linear-to-r (Tailwind v4)
 * - Removido prop asChild del Button (no soportado)
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
      <div className="bg-linear-to-r from-red-500 to-pink-500 text-white">
        <div className="container mx-auto px-4 py-2">
          <div className="flex flex-wrap items-center justify-between text-sm">
            {/* Teléfonos */}
            <div className="flex items-center gap-4">
              <a
                href={`tel:${SITE_CONFIG.contact.phones[0]}`}
                className="flex items-center gap-1 hover:underline"
              >
                <Phone className="h-4 w-4" />
                <span>{SITE_CONFIG.contact.phones[0]}</span>
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
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href={ROUTES.HOME} className="flex items-center gap-3">
            <div className="relative h-12 w-12">
              <Image
                src="/logo.png"
                alt={`Logo ${SITE_CONFIG.name}`}
                fill
                className="object-contain"
                priority
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-linear-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                {SITE_CONFIG.name}
              </h1>
              <p className="text-xs text-gray-600 hidden md:block">
                {SITE_CONFIG.tagline}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-red-500 font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {/* FIX v1.1: Removido asChild, usar Link directamente con estilos */}
            <Link
              href={ROUTES.LOGIN}
              className="inline-flex items-center justify-center px-4 py-2 text-base font-semibold rounded-lg bg-linear-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Ingresar
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-700 hover:text-red-500"
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
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-200">
            <div className="flex flex-col gap-4 pt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-700 hover:text-red-500 font-medium transition-colors px-2 py-1"
                >
                  {link.label}
                </Link>
              ))}
              {/* FIX v1.1: Link directo con estilos de botón */}
              <Link
                href={ROUTES.LOGIN}
                onClick={() => setIsMobileMenuOpen(false)}
                className="inline-flex items-center justify-center mt-2 px-4 py-2 text-base font-semibold rounded-lg bg-linear-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 transition-all duration-200"
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