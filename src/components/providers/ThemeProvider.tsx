/**
 * Theme Provider - Dark/Light Mode
 * Version: v2.0 - Optimizado
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-12-07
 */

'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ReactNode } from 'react';

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
      storageKey="cefib-theme"
    >
      {children}
    </NextThemesProvider>
  );
}