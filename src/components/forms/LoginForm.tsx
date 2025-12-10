/**
 * Componente:  LoginForm
 * Version: v2.0 - Con seguridad multicapa
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-12-07
 */

'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { loginSchema, type LoginInput } from '@/lib/validators/auth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { LogIn, AlertCircle, Shield, AlertTriangle } from 'lucide-react';
import { showToast } from '@/lib/toast';

// ✅ Declarar reCAPTCHA global
declare global {
  interface Window {
    grecaptcha:  any;
  }
}

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [requiresCaptcha, setRequiresCaptcha] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const [isPermanentlyBlocked, setIsPermanentlyBlocked] = useState(false);
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);

  const {
    register,
    handleSubmit,
    formState:  { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  // ✅ Cargar Google reCAPTCHA v3
  useEffect(() => {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  
  if (!siteKey) {
    console.warn('⚠️ RECAPTCHA_SITE_KEY no configurado');
    setRecaptchaLoaded(true);
    return;
  }

  // ✅ No cargar en rutas de admin
  const isAdminRoute = window.location. pathname.startsWith('/admin');
  if (isAdminRoute) {
    console.log('🔒 reCAPTCHA deshabilitado en admin');
    setRecaptchaLoaded(true);
    return;
  }

  // Verificar si ya está cargado
  if (window.grecaptcha) {
    setRecaptchaLoaded(true);
    return;
  }

  const script = document.createElement('script');
  script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
  script.async = true;
  script.defer = true;
  script.id = 'recaptcha-script'; // ✅ AGREGAR ID para fácil identificación
  
  script.onload = () => {
    setRecaptchaLoaded(true);
    console.log('✅ reCAPTCHA cargado');
  };

  script.onerror = () => {
    console.error('❌ Error cargando reCAPTCHA');
    setRecaptchaLoaded(true);
  };

  document.head.appendChild(script);

  // ✅ MEJORADO: Cleanup completo al desmontar
  return () => {
    console.log('🧹 Limpiando reCAPTCHA.. .');
    
    // Remover script
    const existingScript = document.getElementById('recaptcha-script');
    if (existingScript) {
      document.head.removeChild(existingScript);
    }

    // Remover todos los scripts de reCAPTCHA
    const allRecaptchaScripts = document. querySelectorAll('script[src*="recaptcha"]');
    allRecaptchaScripts.forEach(script => {
      script.remove();
    });

    // Remover badge
    const badge = document.querySelector('.grecaptcha-badge');
    if (badge) {
      badge.remove();
    }

    // Remover iframes de reCAPTCHA
    const recaptchaIframes = document. querySelectorAll('iframe[src*="recaptcha"]');
    recaptchaIframes. forEach(iframe => {
      iframe.remove();
    });

    // Limpiar variable global
    if (window.grecaptcha) {
      delete window.grecaptcha;
    }

    console.log('✅ reCAPTCHA limpiado completamente');
  };
}, []);

  // ✅ NUEVO: Agregar otro useEffect para limpiar al navegar
useEffect(() => {
  const handleRouteChange = () => {
    // Si navegamos a admin, limpiar reCAPTCHA
    if (window. location.pathname.startsWith('/admin')) {
      console.log('🚀 Navegando a admin, limpiando reCAPTCHA.. .');
      
      const badge = document.querySelector('.grecaptcha-badge');
      if (badge) {
        badge.remove();
      }

      const recaptchaIframes = document.querySelectorAll('iframe[src*="recaptcha"]');
      recaptchaIframes.forEach(iframe => iframe.remove());
    }
  };

  // Ejecutar al montar si ya estamos en admin
  handleRouteChange();

  // Escuchar cambios de ruta
  window.addEventListener('popstate', handleRouteChange);

  return () => {
    window.removeEventListener('popstate', handleRouteChange);
  };
}, []);

  /**
   * ✅ Obtener token de reCAPTCHA
   */
  const getCaptchaToken = async (): Promise<string | null> => {
    const siteKey = process.env. NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    
    if (!siteKey || !window.grecaptcha) {
      return null;
    }

    try {
      const token = await window.grecaptcha.execute(siteKey, {
        action: 'login',
      });
      return token;
    } catch (error) {
      console.error('Error obteniendo token CAPTCHA:', error);
      return null;
    }
  };

  const onSubmit = async (data: LoginInput) => {
    try {
      setIsLoading(true);
      setServerError(null);

      // ✅ Obtener token de CAPTCHA si es necesario
      let captchaToken:  string | undefined;
      
      if (requiresCaptcha) {
        showToast.info('Verificando que eres humano.. .');
        captchaToken = (await getCaptchaToken()) || undefined;
        
        if (!captchaToken) {
          showToast.error('Error en verificación de seguridad');
          setServerError('Error al validar CAPTCHA.  Recarga la página.');
          setIsLoading(false);
          return;
        }
      }

      const response = await fetch('/api/auth/login', {
        method:  'POST',
        headers:  {
          'Content-Type':  'application/json',
        },
        body: JSON.stringify({
          ... data,
          captchaToken,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        // ✅ Manejar bloqueo permanente
        if (result.isPermanentlyBlocked) {
          setIsPermanentlyBlocked(true);
          setServerError(result.error);
          showToast.error('IP bloqueada permanentemente');
          return;
        }

        // ✅ Manejar rate limiting
        if (result.retryAfter) {
          const minutes = Math.ceil(result.retryAfter / 60);
          showToast.error(
            `Demasiados intentos.  Espera ${minutes} minuto${minutes > 1 ? 's' : ''}`
          );
        }

        // ✅ Activar CAPTCHA si es necesario
        if (result.requiresCaptcha && !requiresCaptcha) {
          setRequiresCaptcha(true);
          showToast.warning('Verificación de seguridad activada');
        }

        setServerError(result.error || 'Error al iniciar sesión');
        setRemainingAttempts(result. remainingAttempts ??  null);
        return;
      }

      // ✅ Login exitoso
      showToast. success('¡Bienvenido! Redirigiendo...');
      
      // Guardar CSRF token en localStorage si existe
      if (result.csrfToken) {
        localStorage.setItem('csrf-token', result.csrfToken);
      }

      setTimeout(() => {
        router.push('/admin');
        router.refresh();
      }, 500);

    } catch (error) {
      console.error('Login error:', error);
      showToast.error('Error de conexión. Intenta nuevamente.');
      setServerError('Error de conexión. Verifica tu internet.');
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Vista de bloqueo permanente
  if (isPermanentlyBlocked) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-red-900 mb-2">
                Acceso Bloqueado
              </h3>
              <p className="text-sm text-red-800 mb-4">
                Tu dirección IP ha sido bloqueada permanentemente debido a múltiples intentos 
                fallidos de inicio de sesión. 
              </p>
              <div className="bg-white rounded-lg p-4 border border-red-200">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>¿Necesitas ayuda?</strong>
                </p>
                <p className="text-sm text-gray-600">
                  Contacta a soporte: 
                  <a 
                    href="mailto:informes@cefib.pe" 
                    className="text-red-600 font-semibold ml-1 hover:underline"
                  >
                    informes@cefib.pe
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* ✅ Error del servidor */}
      {serverError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-800 font-semibold">{serverError}</p>
            {remainingAttempts !== null && remainingAttempts > 0 && (
              <p className="text-xs text-red-600 mt-1">
                ⚠️ Intentos restantes: <strong>{remainingAttempts}</strong>
              </p>
            )}
          </div>
        </div>
      )}

      {/* ✅ Indicador de CAPTCHA activo */}
      {requiresCaptcha && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
          <Shield className="w-5 h-5 text-blue-600 shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-blue-800 font-semibold">
              Verificación de seguridad activada
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Se validará automáticamente que eres humano
            </p>
          </div>
        </div>
      )}

      {/* ✅ HONEYPOT FIELDS - Campos trampa invisibles */}
      <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
        <input 
          type="text" 
          name="website" 
          tabIndex={-1} 
          autoComplete="off" 
        />
        <input 
          type="text" 
          name="phone_number" 
          tabIndex={-1} 
          autoComplete="off" 
        />
        <input 
          type="text" 
          name="company" 
          tabIndex={-1} 
          autoComplete="off" 
        />
      </div>

      {/* Campo Email */}
      <Input
        label="Email"
        type="email"
        placeholder="correo@ejemplo.com"
        autoComplete="email"
        error={errors.email?. message}
        disabled={isLoading}
        {... register('email')}
      />

      {/* Campo Contraseña */}
      <Input
        label="Contraseña"
        type="password"
        placeholder="••••••••"
        autoComplete="current-password"
        error={errors.password?.message}
        disabled={isLoading}
        {... register('password')}
      />

      {/* Botón de envío */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isLoading}
        disabled={isLoading || isPermanentlyBlocked}
        className="w-full"
      >
        {isLoading ?  (
          <>
            <LogIn className="w-5 h-5 mr-2 animate-spin" />
            {requiresCaptcha ? 'Verificando...' : 'Iniciando sesión... '}
          </>
        ) : (
          <>
            <LogIn className="w-5 h-5 mr-2" />
            Iniciar Sesión
          </>
        )}
      </Button>

      {/* ✅ reCAPTCHA badge notice */}
      {recaptchaLoaded && process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
        <p className="text-xs text-center text-gray-500">
          Este sitio está protegido por reCAPTCHA y se aplican la{' '}
          <a 
            href="https://policies.google.com/privacy" 
            className="underline hover:text-gray-700" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Política de Privacidad
          </a>
          {' '}y los{' '}
          <a 
            href="https://policies.google.com/terms" 
            className="underline hover:text-gray-700" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Términos de Servicio
          </a>
          {' '}de Google.
        </p>
      )}
    </form>
  );
}