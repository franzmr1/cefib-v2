import { z } from 'zod';

export const cursoSchema = z.object({
  titulo: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  descripcion: z.string().optional(),
  descripcionBreve: z.string().max(200, 'Máximo 200 caracteres').optional(),
  imagenUrl: z.string().url('URL inválida').optional(),
  fechaInicio: z.string().optional(),
  fechaFin: z.string().optional(),
  duracionHoras: z.number().min(0).default(0),
  modalidad: z.enum(['PRESENCIAL', 'VIRTUAL', 'HIBRIDO']).default('VIRTUAL'),
  certificado: z.boolean().default(true),
  precio: z.number().min(0).optional(),
  cupoMaximo: z.number().min(1).optional(),
});

export type CursoInput = z.infer<typeof cursoSchema>;