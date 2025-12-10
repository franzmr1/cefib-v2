/**
 * Validadores de Autenticación
 * Version: v2.0 - Contraseñas robustas
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-12-07
 */

import { z } from 'zod';

// ✅ Schema de contraseña robusta para nuevos usuarios
const strongPasswordSchema = z.string()
  .min(12, 'Mínimo 12 caracteres')
  .max(128, 'Máximo 128 caracteres')
  .regex(/[a-z]/, 'Debe contener al menos una minúscula')
  .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
  .regex(/[0-9]/, 'Debe contener al menos un número')
  .regex(/[^a-zA-Z0-9]/, 'Debe contener al menos un carácter especial (! @#$%^&*)');

// ✅ Schema de login (contraseña básica, validamos lo que ya existe)
export const loginSchema = z.object({
  email: z.string()
    .email('Email inválido')
    .toLowerCase()
    .trim(),
  
  password: z.string()
    .min(1, 'Contraseña requerida'),
  
  captchaToken: z.string().optional(), // ✅ NUEVO:  Para Google reCAPTCHA
});

// ✅ Schema de registro (contraseña robusta obligatoria)
export const registerSchema = z.object({
  email: z.string()
    .email('Email inválido')
    .toLowerCase()
    .trim(),
  
  password: strongPasswordSchema,
  
  name: z.string()
    .min(2, 'Mínimo 2 caracteres')
    .max(100, 'Máximo 100 caracteres'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;