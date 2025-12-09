/**
 * Theme Toggle Button
 * Version: v2.0 - Optimizado con animaciones mejoradas
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-12-07
 */

'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, systemTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevenir hydration mismatch
  if (!mounted) {
    return (
      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
    );
  }

  const currentTheme = theme === 'system' ? systemTheme : theme;

  return (
    <div className="relative group">
      <button
        onClick={() => setTheme(currentTheme === 'dark' ? 'light' : 'dark')}
        className="relative w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 group"
        aria-label="Cambiar tema"
        title={currentTheme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      >
        {/* Icono con transición suave */}
        <div className="relative w-5 h-5">
          <Sun 
            className={`absolute inset-0 w-5 h-5 text-yellow-500 transition-all duration-300 ${
              currentTheme === 'dark' 
                ? 'rotate-90 scale-0 opacity-0' 
                : 'rotate-0 scale-100 opacity-100'
            }`} 
          />
          <Moon 
            className={`absolute inset-0 w-5 h-5 text-blue-500 transition-all duration-300 ${
              currentTheme === 'dark' 
                ? 'rotate-0 scale-100 opacity-100' 
                : '-rotate-90 scale-0 opacity-0'
            }`} 
          />
        </div>

        {/* Tooltip */}
        <span className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-gray-700 text-white text-xs px-3 py-1. 5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-50">
          {currentTheme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
        </span>
      </button>
    </div>
  );
}