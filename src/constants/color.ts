/**
 * Paleta de colores oficial CEFIB
 * Extraída del branding corporativo
 */

export const COLORS = {
  // Colores principales
  primary: {
    orange: '#FF6B35', // Naranja vibrante CEFIB
    blue: '#003D5B',   // Azul marino profundo CEFIB
    blueDark: '#002A40', // Azul más oscuro
  },
  
  // Colores secundarios
  secondary: {
    lightOrange: '#FF8F5E',
    lightBlue: '#0A5A7D',
    white: '#FFFFFF',
    offWhite: '#F8F9FA',
  },

  // Grises
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },

  // Estados
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
} as const;