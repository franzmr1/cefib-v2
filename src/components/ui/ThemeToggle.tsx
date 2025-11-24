/**
 * Componente: ThemeToggle
 * Version: v2.1 - Sin conflictos de CSS
 */

'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-14 h-7 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="relative flex items-center w-14 h-7 bg-gray-200 dark:bg-gray-700 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-orange focus:ring-offset-2 dark:focus:ring-offset-dark-bg group hover:shadow-lg hover:scale-105"
      aria-label={`Cambiar a modo ${theme === 'dark' ? 'claro' : 'oscuro'}`}
      title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
    >
      {/* Fondo con gradiente animado */}
      <span 
        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"
        style={{
          background: 'linear-gradient(to right, #003D5B, #FF6B35)'
        }}
      />
      
      {/* Switch deslizante con icono - SIN inline-block */}
      <span
        className={`flex items-center justify-center w-5 h-5 transform transition-all duration-300 ease-in-out rounded-full bg-white dark:bg-dark-bg shadow-lg ${
          theme === 'dark' ? 'translate-x-8' : 'translate-x-1'
        } group-hover:shadow-xl`}
      >
        {theme === 'dark' ? (
          <Moon className="w-3 h-3 text-primary-orange" />
        ) : (
          <Sun className="w-3 h-3 text-primary-blue" />
        )}
      </span>
      
      {/* Iconos de fondo con animación */}
      <Sun className={`w-3 h-3 absolute left-2 transition-all duration-300 ${
        theme === 'dark' 
          ? 'opacity-20 text-gray-400 scale-90' 
          : 'opacity-50 text-yellow-500 scale-100'
      }`} />
      <Moon className={`w-3 h-3 absolute right-2 transition-all duration-300 ${
        theme === 'dark' 
          ? 'opacity-50 text-blue-400 scale-100' 
          : 'opacity-20 text-gray-400 scale-90'
      }`} />
    </button>
  );
}