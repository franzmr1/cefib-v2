/**
 * Componente: CursoForm
 * Version: v2.0 - CON VALIDACIONES COMPLETAS
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-21
 * Descripción: Formulario completo para crear/editar cursos con validaciones
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, X, AlertCircle } from 'lucide-react';
import ImageUploader from './ImageUploader';

interface CursoFormProps {
  userId: string;
  cursoData?: {
    id: string;
    titulo: string;
    slug: string;
    descripcionBreve: string | null;
    descripcion: string | null;
    imagenUrl: string | null;
    fechaInicio: Date | null;
    fechaFin: Date | null;
    duracionHoras: number;
    modalidad: string;
    certificado: boolean;
    precio: number | null;
    cupoMaximo: number | null;
    estado: string;
  };
}

export default function CursoForm({ userId, cursoData }: CursoFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    titulo: cursoData?.titulo || '',
    slug: cursoData?.slug || '',
    descripcionBreve: cursoData?.descripcionBreve || '',
    descripcion: cursoData?.descripcion || '',
    imagenUrl: cursoData?.imagenUrl || '',
    fechaInicio: cursoData?.fechaInicio
      ? new Date(cursoData.fechaInicio).toISOString().split('T')[0]
      : '',
    fechaFin: cursoData?.fechaFin
      ? new Date(cursoData.fechaFin).toISOString().split('T')[0]
      : '',
    duracionHoras: cursoData?.duracionHoras || 40,
    modalidad: cursoData?.modalidad || 'VIRTUAL',
    certificado: cursoData?.certificado !== undefined ? cursoData.certificado : true,
    precio: cursoData?.precio || '',
    cupoMaximo: cursoData?.cupoMaximo || '',
    estado: cursoData?.estado || 'BORRADOR',
  });

  /**
   * Generar slug automático desde el título
   */
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTituloChange = (value: string) => {
    setFormData({
      ...formData,
      titulo: value,
      slug: generateSlug(value),
    });
    // Limpiar error de título si existe
    if (validationErrors.titulo) {
      const newErrors = { ...validationErrors };
      delete newErrors.titulo;
      setValidationErrors(newErrors);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // Limpiar error del campo al modificarlo
    if (validationErrors[name]) {
      const newErrors = { ...validationErrors };
      delete newErrors[name];
      setValidationErrors(newErrors);
    }
  };

  const handleImageUploaded = (url: string) => {
    setFormData({ ...formData, imagenUrl: url });
  };

  /**
   * VALIDACIÓN COMPLETA DEL FORMULARIO
   */
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Validar título
    if (!formData.titulo || formData.titulo.trim().length < 5) {
      errors.titulo = 'El título debe tener al menos 5 caracteres';
    }
    if (formData.titulo.length > 200) {
      errors.titulo = 'El título no puede exceder 200 caracteres';
    }

    // Validar slug
    if (!formData.slug || formData.slug.trim().length < 3) {
      errors.slug = 'El slug debe tener al menos 3 caracteres';
    }

    // Validar duración
    if (!formData.duracionHoras || Number(formData.duracionHoras) < 1) {
      errors.duracionHoras = 'La duración debe ser al menos 1 hora';
    }
    if (Number(formData.duracionHoras) > 500) {
      errors.duracionHoras = 'La duración no puede exceder 500 horas';
    }

    // Validar fecha inicio (NO anterior a hoy)
    if (formData.fechaInicio) {
      const fechaInicio = new Date(formData.fechaInicio);
      fechaInicio.setHours(0, 0, 0, 0);
      
      if (fechaInicio < today) {
        errors.fechaInicio = 'La fecha de inicio no puede ser anterior a hoy';
      }
    }

    // Validar fecha fin (posterior a fecha inicio)
    if (formData.fechaInicio && formData.fechaFin) {
      const fechaInicio = new Date(formData.fechaInicio);
      const fechaFin = new Date(formData.fechaFin);
      
      if (fechaFin <= fechaInicio) {
        errors.fechaFin = 'La fecha de fin debe ser posterior a la fecha de inicio';
      }
    }

    // Validar precio
    if (formData.precio && Number(formData.precio) < 0) {
      errors.precio = 'El precio no puede ser negativo';
    }
    if (formData.precio && Number(formData.precio) > 10000) {
      errors.precio = 'El precio no puede exceder S/ 10,000';
    }

    // Validar cupo
    if (formData.cupoMaximo && Number(formData.cupoMaximo) < 1) {
      errors.cupoMaximo = 'El cupo debe ser al menos 1 persona';
    }
    if (formData.cupoMaximo && Number(formData.cupoMaximo) > 100) {
      errors.cupoMaximo = 'El cupo no puede exceder 100 personas';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // VALIDAR ANTES DE ENVIAR
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    try {
      const url = cursoData ? `/api/cursos/${cursoData.id}` : '/api/cursos';
      const method = cursoData ? 'PATCH' : 'POST';

      const payload = {
        ...formData,
        duracionHoras: Number(formData.duracionHoras),
        precio: formData.precio ? Number(formData.precio) : null,
        cupoMaximo: formData.cupoMaximo ? Number(formData.cupoMaximo) : null,
        fechaInicio: formData.fechaInicio || null,
        fechaFin: formData.fechaFin || null,
        creadorId: userId,
      };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al guardar');
      }

      alert(cursoData ? 'Curso actualizado exitosamente' : 'Curso creado exitosamente');
      router.push('/admin/cursos');
      router.refresh();
    } catch (error: any) {
      console.error('Error:', error);
      alert(error.message || 'Error al guardar el curso');
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Alerta de errores general */}
      {Object.keys(validationErrors).length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-800">
                Hay {Object.keys(validationErrors).length} error(es) en el formulario
              </h3>
              <p className="text-sm text-red-700 mt-1">
                Por favor revisa los campos marcados en rojo
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Información Básica */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Información Básica</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Título */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Título del Curso *
            </label>
            <input
              type="text"
              name="titulo"
              value={formData.titulo}
              onChange={(e) => handleTituloChange(e.target.value)}
              required
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                validationErrors.titulo
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-red-500'
              }`}
              placeholder="Ej: Diplomado en Gestión Pública"
            />
            {validationErrors.titulo && (
              <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {validationErrors.titulo}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {formData.titulo.length}/200 caracteres
            </p>
          </div>

          {/* Slug */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Slug (URL amigable) *
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 bg-gray-50 ${
                validationErrors.slug
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-red-500'
              }`}
              placeholder="diplomado-gestion-publica"
            />
            {validationErrors.slug && (
              <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {validationErrors.slug}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              URL: /cursos/{formData.slug || 'slug-del-curso'}
            </p>
          </div>

          {/* Descripción Breve */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Descripción Breve
            </label>
            <input
              type="text"
              name="descripcionBreve"
              value={formData.descripcionBreve}
              onChange={handleChange}
              maxLength={150}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Resumen corto del curso (máx. 150 caracteres)"
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.descripcionBreve.length}/150 caracteres
            </p>
          </div>

          {/* Descripción Completa */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Descripción Completa
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Descripción detallada del curso, objetivos, contenido..."
            />
          </div>

          {/* Imagen */}
          <div className="md:col-span-2">
            <ImageUploader
              currentImage={formData.imagenUrl}
              onImageUploaded={handleImageUploaded}
            />
          </div>
        </div>
      </div>

      {/* Detalles del Curso */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Detalles del Curso</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Fecha Inicio */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Fecha de Inicio
            </label>
            <input
              type="date"
              name="fechaInicio"
              value={formData.fechaInicio}
              onChange={handleChange}
              min={today}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                validationErrors.fechaInicio
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-red-500'
              }`}
            />
            {validationErrors.fechaInicio && (
              <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {validationErrors.fechaInicio}
              </p>
            )}
          </div>

          {/* Fecha Fin */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Fecha de Fin
            </label>
            <input
              type="date"
              name="fechaFin"
              value={formData.fechaFin}
              onChange={handleChange}
              min={formData.fechaInicio || today}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                validationErrors.fechaFin
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-red-500'
              }`}
            />
            {validationErrors.fechaFin && (
              <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {validationErrors.fechaFin}
              </p>
            )}
          </div>

          {/* Duración */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Duración (horas) *
            </label>
            <input
              type="number"
              name="duracionHoras"
              value={formData.duracionHoras}
              onChange={handleChange}
              required
              min="1"
              max="500"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                validationErrors.duracionHoras
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-red-500'
              }`}
            />
            {validationErrors.duracionHoras && (
              <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {validationErrors.duracionHoras}
              </p>
            )}
          </div>

          {/* Modalidad */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Modalidad *
            </label>
            <select
              name="modalidad"
              value={formData.modalidad}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="VIRTUAL">Virtual</option>
              <option value="PRESENCIAL">Presencial</option>
              <option value="HIBRIDO">Híbrido</option>
            </select>
          </div>

          {/* Precio */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Precio (S/)
            </label>
            <input
              type="number"
              name="precio"
              value={formData.precio}
              onChange={handleChange}
              min="0"
              max="10000"
              step="0.01"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                validationErrors.precio
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-red-500'
              }`}
              placeholder="0.00"
            />
            {validationErrors.precio && (
              <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {validationErrors.precio}
              </p>
            )}
          </div>

          {/* Cupo Máximo */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Cupo Máximo
            </label>
            <input
              type="number"
              name="cupoMaximo"
              value={formData.cupoMaximo}
              onChange={handleChange}
              min="1"
              max="100"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                validationErrors.cupoMaximo
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-red-500'
              }`}
              placeholder="Ej: 30"
            />
            {validationErrors.cupoMaximo && (
              <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {validationErrors.cupoMaximo}
              </p>
            )}
          </div>

          {/* Estado */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Estado *
            </label>
            <select
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="BORRADOR">Borrador (no visible)</option>
              <option value="ACTIVO">Activo (público)</option>
              <option value="ARCHIVADO">Archivado</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {formData.estado === 'ACTIVO' && '✅ Se mostrará en la landing page'}
              {formData.estado === 'BORRADOR' && '📝 Solo visible para admins'}
              {formData.estado === 'ARCHIVADO' && '🗄️ Oculto, guardado para futuro'}
            </p>
          </div>

          {/* Certificado */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="certificado"
              id="certificado"
              checked={formData.certificado}
              onChange={handleChange}
              className="w-5 h-5 text-red-500 border-gray-300 rounded focus:ring-red-500"
            />
            <label htmlFor="certificado" className="ml-3 text-sm font-semibold text-gray-700">
              Incluye certificado
            </label>
          </div>
        </div>
      </div>

      {/* Botones */}
      <div className="flex items-center justify-end gap-4 pt-6 border-t">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
        >
          <X className="w-5 h-5" />
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-red-500 to-pink-500 text-white rounded-lg font-semibold hover:from-red-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-5 h-5" />
          {isSubmitting ? 'Guardando...' : cursoData ? 'Actualizar Curso' : 'Crear Curso'}
        </button>
      </div>
    </form>
  );
}