/**
 * Página: Login
 * Version: v1.0
 * Autor: Franz
 * Fecha: 2025-11-15
 * Descripción: Página de autenticación para acceso al panel admin
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { SITE_CONFIG } from '@/constants';
import LoginForm from '@/components/forms/LoginForm';
import { LogIn, Shield, Lock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Iniciar Sesión',
  description: 'Acceso al panel de administración de CEFIB',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 flex items-center justify-center p-4">
      {/* Patrón de fondo */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500 rounded-full blur-3xl"></div>
      </div>

      {/* Contenedor del formulario */}
      <div className="w-full max-w-md relative z-10">
        {/* Card de login */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header con logo y título */}
          <div className="bg-li-to-r from-red-500 to-pink-500 p-8 text-white text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-12 h-12 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold mb-2">{SITE_CONFIG.name}</h1>
            <p className="text-sm text-red-100">Panel de Administración</p>
          </div>

          {/* Contenido del formulario */}
          <div className="p-8">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Bienvenido
              </h2>
              <p className="text-gray-600">
                Ingresa tus credenciales para acceder
              </p>
            </div>

            {/* Formulario de login */}
            <LoginForm />

            {/* Información adicional */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿Problemas para acceder?{' '}
                <a
                  href={`mailto:${SITE_CONFIG.contact.email}`}
                  className="text-red-500 hover:text-red-600 font-semibold"
                >
                  Contacta soporte
                </a>
              </p>
            </div>
          </div>

          {/* Footer del card */}
          <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <Lock className="w-4 h-4" />
              <span>Conexión segura y encriptada</span>
            </div>
          </div>
        </div>

        {/* Enlace de regreso */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white hover:text-gray-200 transition-colors"
          >
            ← Volver al sitio principal
          </Link>
        </div>

        {/* Información de seguridad */}
        <div className="mt-6 bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-4">
          <div className="flex items-start gap-3 text-white text-sm">
            <Shield className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-1">Seguridad de acceso</p>
              <p className="text-xs text-gray-300">
                Tu información está protegida con encriptación de última generación.
                Solo personal autorizado puede acceder al panel administrativo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}