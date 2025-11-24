/**
 * Componente: LoginForm
 * Version: v1.1 - Corregido para Tailwind v4
 * Autor: Franz
 * Fecha: 2025-11-15
 * Descripción: Formulario de autenticación con validación y manejo de estados
 * Tecnologías: React Hook Form + Zod + JWT
 * Cambios v1.1:
 * - Actualizado flex-shrink-0 → shrink-0 (Tailwind v4)
 */

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { loginSchema, type LoginInput } from '@/lib/validators/auth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { LogIn, AlertCircle } from 'lucide-react';

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Configuración de React Hook Form con validación Zod
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  /**
   * Maneja el envío del formulario de login
   * @param data - Datos validados del formulario
   */
  const onSubmit = async (data: LoginInput) => {
    try {
      setIsLoading(true);
      setServerError(null);

      // Llamada a la API de login
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        // Manejo de errores del servidor
        setServerError(result.error || 'Error al iniciar sesión');
        return;
      }

      // Login exitoso - redirigir al dashboard
      router.push('/admin');
      router.refresh(); // Refrescar para actualizar el middleware
    } catch (error) {
      console.error('Login error:', error);
      setServerError('Error de conexión. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Error del servidor */}
      {serverError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{serverError}</p>
        </div>
      )}

      {/* Campo Email */}
      <Input
        label="Email"
        type="email"
        placeholder="correo@ejemplo.com"
        autoComplete="email"
        error={errors.email?.message}
        {...register('email')}
      />

      {/* Campo Contraseña */}
      <Input
        label="Contraseña"
        type="password"
        placeholder="••••••••"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register('password')}
      />

      {/* Botón de envío */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isLoading}
        className="w-full"
      >
        <LogIn className="mr-2 h-5 w-5" />
        Iniciar Sesión
      </Button>
    </form>
  );
}