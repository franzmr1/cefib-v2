/**
 * Theme Provider - Dark/Light Mode
 * Version: v1.1 - Corregido
 * Autor: Franz (@franzmr1)
 */

'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ComponentProps } from 'react';

type ThemeProviderProps = ComponentProps<typeof NextThemesProvider>;

export function ThemeProvider({ children, ... props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}