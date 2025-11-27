/**
 * Validaciones: Participante
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-26
 */

import { z } from 'zod';

export const participanteSchema = z.object({
  nombres: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .regex(/^[a-záéíóúñA-ZÁÉÍÓÚÑ\s]+$/, 'Solo se permiten letras y espacios'),
  
  apellidos: z.string()
    .min(2, 'Los apellidos deben tener al menos 2 caracteres')
    .max(100, 'Los apellidos no pueden exceder 100 caracteres')
    .regex(/^[a-záéíóúñA-ZÁÉÍÓÚÑ\s]+$/, 'Solo se permiten letras y espacios'),
  
  // ✅ CORREGIDO: Sin errorMap
  tipoDocumento: z.enum(['DNI', 'CARNET_EXTRANJERIA', 'PASAPORTE', 'RUC'])
    .default('DNI'),
  
  numeroDocumento: z.string()
    .min(8, 'El número de documento debe tener al menos 8 caracteres')
    .max(20, 'El número de documento no puede exceder 20 caracteres')
    .regex(/^[a-zA-Z0-9]+$/, 'Solo se permiten letras y números'),
  
  email: z.string()
    . email('Email inválido')
    .toLowerCase(),
  
  telefono: z.string()
    .regex(/^[0-9]{6,15}$/, 'Teléfono inválido (6-15 dígitos)')
    .optional()
    .nullable(),
  
  celular: z.string()
    .regex(/^9[0-9]{8}$/, 'Celular inválido (debe empezar con 9 y tener 9 dígitos)'),
  
  direccion: z.string()
    .max(200, 'La dirección no puede exceder 200 caracteres')
    . optional()
    .nullable(),
  
  estado: z.enum(['ACTIVO', 'INACTIVO']).default('ACTIVO'),
});

export const inscripcionSchema = z.object({
  participanteId: z.string().cuid('ID de participante inválido'),
  cursoId: z.string().cuid('ID de curso inválido'),
  estadoPago: z.enum(['PAGADO', 'PENDIENTE', 'NO_PAGADO']).default('PENDIENTE'),
  montoPagado: z.number(). min(0, 'El monto no puede ser negativo').default(0),
  fechaPago: z.string().datetime(). optional(). nullable(),
  metodoPago: z.enum(['EFECTIVO', 'TRANSFERENCIA', 'YAPE', 'PLIN', 'TARJETA', 'OTRO']).optional().nullable(),
  asistio: z.boolean().default(false),
  observaciones: z.string().max(500). optional().nullable(),
});

export type ParticipanteInput = z.infer<typeof participanteSchema>;
export type InscripcionInput = z.infer<typeof inscripcionSchema>;