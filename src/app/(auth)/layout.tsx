/**
 * Layout: Grupo de Autenticación
 * Version: v1.0
 * Autor: Franz
 * Fecha: 2025-11-15
 * Descripción: Layout para páginas de autenticación (login, registro, etc.)
 * Sin header ni footer
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Autenticación',
  robots: {
    index: false, // No indexar páginas de auth
    follow: false,
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}