/**
 * Componente: Toaster
 * Sistema de notificaciones toast elegante
 */

'use client';

import { Toaster as SonnerToaster } from 'sonner';
import { useTheme } from 'next-themes';

export default function Toaster() {
  const { theme } = useTheme();

  return (
    <SonnerToaster
      theme={theme as 'light' | 'dark'}
      position="top-right"
      expand={false}
      richColors
      closeButton
      toastOptions={{
        style: {
          fontFamily: 'var(--font-poppins)',
        },
        className: 'toast-custom',
      }}
    />
  );
}