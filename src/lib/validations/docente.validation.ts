/**
 * Validaciones:  Docente
 * Versión: 1.1 - Campos opcionales corregidos
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-12-07
 */

import { z } from 'zod';

export const docenteSchema = z. object({
  nombres: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .regex(/^[a-záéíóúñA-ZÁÉÍÓÚÑ\s]+$/, 'Solo se permiten letras y espacios'),
  
  apellidos: z.string()
    .min(2, 'Los apellidos deben tener al menos 2 caracteres')
    .max(100, 'Los apellidos no pueden exceder 100 caracteres')
    .regex(/^[a-záéíóúñA-ZÁÉÍÓÚÑ\s]+$/, 'Solo se permiten letras y espacios'),
  
  tipoDocumento: z.enum(['DNI', 'CARNET_EXTRANJERIA', 'PASAPORTE', 'RUC'])
    .default('DNI'),
  
  numeroDocumento: z.string()
    .min(8, 'El número de documento debe tener al menos 8 caracteres')
    .max(20, 'El número de documento no puede exceder 20 caracteres')
    .regex(/^[a-zA-Z0-9]+$/, 'Solo se permiten letras y números'),
  
  email: z.string()
    .email('Email inválido')
    .toLowerCase(),
  
  // ✅ CAMBIO 1: Teléfono es opcional - permitir vacío o null
  telefono: z.string()
    .regex(/^[0-9]{6,15}$/, 'Teléfono inválido (6-15 dígitos)')
    .or(z.literal('')) // ✅ Permitir string vacío
    .optional()
    .nullable()
    .transform(val => val === '' ? null : val), // ✅ Convertir '' a null
  
  celular: z.string()
    .regex(/^9[0-9]{8}$/, 'Celular inválido (debe empezar con 9 y tener 9 dígitos)'),
  
  // ✅ CAMBIO 2: Dirección es opcional - permitir vacío o null
  direccion: z.string()
    .max(200, 'La dirección no puede exceder 200 caracteres')
    .or(z.literal('')) // ✅ Permitir string vacío
    .optional()
    .nullable()
    .transform(val => val === '' ? null :  val), // ✅ Convertir '' a null
  
  especialidad: z.string()
    .min(3, 'La especialidad debe tener al menos 3 caracteres')
    .max(100, 'La especialidad no puede exceder 100 caracteres'),
  
  // ✅ CAMBIO 3: Experiencia es opcional - permitir vacío o null
  experiencia: z.string()
    .max(500, 'La experiencia no puede exceder 500 caracteres')
    .or(z.literal('')) // ✅ Permitir string vacío
    .optional()
    .nullable()
    .transform(val => val === '' ? null : val), // ✅ Convertir '' a null
  
  estado: z.enum(['ACTIVO', 'INACTIVO']).default('ACTIVO'),
});

export const asignarCursoSchema = z.object({
  docenteId: z.string().cuid('ID de docente inválido'),
  cursoId: z.string().cuid('ID de curso inválido'),
});

export type DocenteInput = z.infer<typeof docenteSchema>;
export type AsignarCursoInput = z.infer<typeof asignarCursoSchema>;