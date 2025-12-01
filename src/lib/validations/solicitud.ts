/**
 * Validaciones para Solicitudes
 * Versión: 1.2 - Compatible con Zod v4
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-26
 */

import { z } from 'zod';

// Schema de validación para crear solicitud
export const solicitudCreateSchema = z.object({
  // Datos obligatorios
  nombres: z
    .string({ message: 'El nombre es requerido' })
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo se permiten letras y espacios'),
  
  email: z
    .string({ message: 'El email es requerido' })
    .email('Email inválido')
    .max(100, 'El email no puede exceder 100 caracteres')
    .toLowerCase(),
  
  servicioInteres: z. enum(
    [
      'PROYECTOS_PLANES',
      'SALUD',
      'GESTION_PUBLICA',
      'EDUCACION',
      'TECNOLOGIA',
      'ENERGIA_MINERIA',
      'OTRO',
    ],
    { 
      message: 'Debe seleccionar un servicio' 
    }
  ),
  
  tipoPrograma: z
    .enum(['INDIVIDUAL', 'CORPORATIVO'], {
      message: 'Debe seleccionar un tipo de programa'
    })
    .default('INDIVIDUAL'),
  
  mensaje: z
    .string({ message: 'El mensaje es requerido' })
    .min(10, 'El mensaje debe tener al menos 10 caracteres')
    .max(1000, 'El mensaje no puede exceder 1000 caracteres')
    .trim(),
  
  aceptoTerminos: z
    .boolean({ message: 'Debe aceptar los términos' })
    .refine((val) => val === true, {
      message: 'Debe aceptar los términos y condiciones',
    }),
  
  // Datos opcionales
  telefono: z
    .string()
    .regex(/^[0-9+\-\s()]*$/, 'Teléfono inválido')
    .min(7, 'El teléfono debe tener al menos 7 dígitos')
    .max(20, 'El teléfono no puede exceder 20 caracteres')
    .optional()
    .or(z.literal('')),
  
  empresa: z
    .string()
    .max(150, 'El nombre de la empresa no puede exceder 150 caracteres')
    .optional()
    .or(z.literal('')),
  
  cargo: z
    .string()
    .max(100, 'El cargo no puede exceder 100 caracteres')
    .optional()
    .or(z. literal('')),
  
  // ✅ CORREGIDO: numParticipantes
  numParticipantes: z
    .union([
      z.number().int('Debe ser un número entero'). min(1, 'Debe ser al menos 1'). max(1000, 'No puede exceder 1000'),
      z.null(),
      z.undefined(),
    ])
    .optional()
    .transform((val) => (val === undefined || val === null ? null : val)),
  
  comoNosConociste: z
    .string()
    . max(100)
    .optional()
    . or(z.literal('')),
})
. refine(
  (data) => {
    // Si es corporativo, debe tener número de participantes
    if (data.tipoPrograma === 'CORPORATIVO' && !data.numParticipantes) {
      return false;
    }
    return true;
  },
  {
    message: 'Para programas corporativos debe indicar el número de participantes',
    path: ['numParticipantes'],
  }
);

// Schema para actualizar solicitud (admin)
export const solicitudUpdateSchema = z.object({
  estado: z
    .enum([
      'NUEVO',
      'EN_REVISION',
      'CONTACTADO',
      'EN_NEGOCIACION',
      'CERRADO_EXITOSO',
      'CERRADO_SIN_EXITO',
      'CANCELADO',
    ])
    .optional(),
  
  prioridad: z
    .enum(['BAJA', 'NORMAL', 'ALTA', 'URGENTE'])
    .optional(),
  
  notasInternas: z
    .string()
    .max(2000, 'Las notas no pueden exceder 2000 caracteres')
    .optional()
    .nullable(),
  
  asignadoA: z
    .string()
    .optional()
    .nullable(),
  
  fechaContacto: z
    .string()
    . datetime()
    .optional()
    .nullable(),
    
  fechaCierre: z
    .string()
    . datetime()
    .optional()
    .nullable(),
});

// Tipos TypeScript derivados
export type SolicitudCreateInput = z.infer<typeof solicitudCreateSchema>;
export type SolicitudUpdateInput = z.infer<typeof solicitudUpdateSchema>;