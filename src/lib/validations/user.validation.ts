/**
 * Validaciones: User Schema
 * Versión: 1.1 - Compatible con Zod v4
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-25
 * Descripción: Esquemas de validación para usuarios administradores
 * Seguridad: Validaciones estrictas con sanitización
 */

import { z } from 'zod';

/**
 * Regex para contraseña fuerte:
 * - Mínimo 8 caracteres
 * - Al menos una mayúscula
 * - Al menos una minúscula
 * - Al menos un número
 * - Al menos un carácter especial
 */
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]/;

/**
 * Regex para nombres (solo letras y espacios, incluyendo tildes)
 */
const NAME_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

/**
 * Schema para crear usuario administrador
 * Solo SUPER_ADMIN puede ejecutar esta acción
 */
export const createUserSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Formato de email inválido')
    .toLowerCase()
    .trim()
    .max(255, 'El email es demasiado largo'),
  
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(100, 'La contraseña no puede exceder 100 caracteres')
    . regex(
      PASSWORD_REGEX,
      'La contraseña debe contener: mayúscula, minúscula, número y carácter especial (@$!%*?&#)'
    ),
  
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres')
    . trim()
    .regex(NAME_REGEX, 'El nombre solo puede contener letras y espacios'),
  
  apellidos: z
    .string()
    .min(2, 'Los apellidos deben tener al menos 2 caracteres')
    .max(100, 'Los apellidos no pueden exceder 100 caracteres')
    .trim()
    . regex(NAME_REGEX, 'Los apellidos solo pueden contener letras y espacios'),
  
  role: z.enum(['ADMIN', 'SUPER_ADMIN']). default('ADMIN'),
});

/**
 * Schema para actualizar usuario
 * Todos los campos son opcionales excepto al menos uno debe estar presente
 */
export const updateUserSchema = z
  .object({
    email: z
      .string()
      .min(1, 'El email no puede estar vacío')
      .email('Formato de email inválido')
      .toLowerCase()
      .trim()
      .max(255, 'El email es demasiado largo')
      .optional(),
    
    password: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .max(100, 'La contraseña no puede exceder 100 caracteres')
      .regex(
        PASSWORD_REGEX,
        'La contraseña debe contener: mayúscula, minúscula, número y carácter especial'
      )
      .optional(),
    
    name: z
      .string()
      .min(2, 'El nombre debe tener al menos 2 caracteres')
      .max(50, 'El nombre no puede exceder 50 caracteres')
      .trim()
      .regex(NAME_REGEX, 'El nombre solo puede contener letras y espacios')
      .optional(),
    
    apellidos: z
      .string()
      .min(2, 'Los apellidos deben tener al menos 2 caracteres')
      .max(100, 'Los apellidos no pueden exceder 100 caracteres')
      .trim()
      .regex(NAME_REGEX, 'Los apellidos solo pueden contener letras y espacios')
      .optional(),
    
    role: z.enum(['ADMIN', 'SUPER_ADMIN']).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Debe proporcionar al menos un campo para actualizar',
  });

/**
 * Tipos TypeScript inferidos
 */
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;