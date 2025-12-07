/**
 * Layout: Root Layout
 * Version: v2.1 - Con Dark Mode, Toast y WhatsApp Widget
 * Autor: Franz (@franzmr1)
 */

import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { Toaster } from 'react-hot-toast';
import WhatsAppWidget from '@/components/ui/WhatsAppWidget';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const poppins = Poppins({ 
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'CEFIB - Train Win Leaders',
  description: 'Centro de Formación y Especialización Profesional Iberoamericano',
  keywords: ['formación', 'capacitación', 'cursos', 'diplomados', 'certificación'],
};

export default function RootLayout({ children }: { children: React. ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning className={`${inter.variable} ${poppins.variable}`}>
      <body suppressHydrationWarning className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        <ThemeProvider 
          attribute="class" 
          defaultTheme="light" 
          enableSystem
          disableTransitionOnChange
        >
          {children}
          
          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            reverseOrder={false}
            gutter={8}
            toastOptions={{
              duration: 4000,
              className: 'dark:bg-gray-800 dark:text-white',
              style: {
                background: 'var(--toast-bg, #fff)',
                color: 'var(--toast-color, #363636)',
                padding: '16px',
                borderRadius: '12px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
              loading: {
                iconTheme: {
                  primary: '#3b82f6',
                  secondary: '#fff',
                },
              },
            }}
          />

          {/* WhatsApp Widget */}
          <WhatsAppWidget />
        </ThemeProvider>
      </body>
    </html>
  );
}