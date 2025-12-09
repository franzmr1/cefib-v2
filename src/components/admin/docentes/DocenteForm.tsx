/**
 * Componente: DocenteForm
 * Versión: 1.1 - Con Toast Notifications y validación corregida
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-12-07
 * Descripción: Formulario para crear/editar docentes
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, AlertCircle } from 'lucide-react';
import { showToast } from '@/lib/toast'; // ✅ IMPORTAR TOAST

interface DocenteFormProps {
  docenteData?: any;
  onSuccess?: () => void;
}

export default function DocenteForm({ docenteData, onSuccess }: DocenteFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    nombres: docenteData?.nombres || '',
    apellidos: docenteData?.apellidos || '',
    tipoDocumento: docenteData?.tipoDocumento || 'DNI',
    numeroDocumento: docenteData?. numeroDocumento || '',
    email: docenteData?.email || '',
    telefono: docenteData?.telefono || '',
    celular: docenteData?.celular || '',
    direccion: docenteData?.direccion || '',
    especialidad: docenteData?.especialidad || '',
    experiencia: docenteData?.experiencia || '',
    estado: docenteData?.estado || 'ACTIVO',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpiar error del campo al escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React. FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const url = docenteData 
        ? `/api/docentes/${docenteData.id}`
        : '/api/docentes';
      
      const method = docenteData ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.details) {
          // Errores de validación Zod
          const fieldErrors: Record<string, string> = {};
          data.details.forEach((detail: any) => {
            fieldErrors[detail.field] = detail.message;
          });
          setErrors(fieldErrors);
          
          // ✅ TOAST DE ERROR CON DETALLES
          showToast. error('Por favor corrige los errores en el formulario');
        } else if (data.field) {
          // Error específico de campo
          setErrors({ [data.field]: data.error });
          showToast.error(data.error);
        } else {
          // Error general
          showToast.error(data.error || 'Error al guardar docente'); // ✅ TOAST
        }
        return;
      }

      // ✅ ÉXITO CON TOAST
      showToast.success(data.message || 'Docente guardado exitosamente');
      
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/admin/docentes');
        router.refresh();
      }

    } catch (error) {
      console.error('Error:', error);
      showToast.error('Error de conexión.  Intenta nuevamente. '); // ✅ TOAST
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ✅ MENSAJE DE ERROR GENERAL */}
      {Object.keys(errors).length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-red-800 mb-1">
                Hay errores en el formulario
              </h3>
              <p className="text-sm text-red-700">
                Por favor revisa los campos marcados en rojo
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Datos Personales */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Datos Personales
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nombres */}
          <div>
            <label htmlFor="nombres" className="block text-sm font-medium text-gray-700 mb-1">
              Nombres <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="nombres"
              name="nombres"
              value={formData.nombres}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                errors.nombres ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              required
            />
            {errors. nombres && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.nombres}
              </p>
            )}
          </div>

          {/* Apellidos */}
          <div>
            <label htmlFor="apellidos" className="block text-sm font-medium text-gray-700 mb-1">
              Apellidos <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="apellidos"
              name="apellidos"
              value={formData.apellidos}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                errors.apellidos ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              required
            />
            {errors.apellidos && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.apellidos}
              </p>
            )}
          </div>

          {/* Tipo Documento */}
          <div>
            <label htmlFor="tipoDocumento" className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Documento <span className="text-red-500">*</span>
            </label>
            <select
              id="tipoDocumento"
              name="tipoDocumento"
              value={formData.tipoDocumento}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            >
              <option value="DNI">DNI</option>
              <option value="CARNET_EXTRANJERIA">Carnet de Extranjería</option>
              <option value="PASAPORTE">Pasaporte</option>
              <option value="RUC">RUC</option>
            </select>
          </div>

          {/* Número Documento */}
          <div>
            <label htmlFor="numeroDocumento" className="block text-sm font-medium text-gray-700 mb-1">
              Número de Documento <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="numeroDocumento"
              name="numeroDocumento"
              value={formData.numeroDocumento}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                errors. numeroDocumento ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              required
              disabled={!! docenteData}
            />
            {errors.numeroDocumento && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.numeroDocumento}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Datos de Contacto */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Datos de Contacto
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              required
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors. email}
              </p>
            )}
          </div>

          {/* Celular */}
          <div>
            <label htmlFor="celular" className="block text-sm font-medium text-gray-700 mb-1">
              Celular <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="celular"
              name="celular"
              value={formData.celular}
              onChange={handleChange}
              placeholder="987654321"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                errors.celular ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              required
            />
            {errors.celular && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.celular}
              </p>
            )}
          </div>

          {/* Teléfono - ✅ OPCIONAL, SIN REQUIRED */}
          <div>
            <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono <span className="text-gray-400 text-xs">(Opcional)</span>
            </label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              value={formData. telefono}
              onChange={handleChange}
              placeholder="014567890"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          {/* Dirección - ✅ OPCIONAL, SIN REQUIRED */}
          <div>
            <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-1">
              Dirección <span className="text-gray-400 text-xs">(Opcional)</span>
            </label>
            <input
              type="text"
              id="direccion"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Datos Profesionales */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Datos Profesionales
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Especialidad */}
          <div>
            <label htmlFor="especialidad" className="block text-sm font-medium text-gray-700 mb-1">
              Especialidad <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="especialidad"
              name="especialidad"
              value={formData.especialidad}
              onChange={handleChange}
              placeholder="Ej: Gestión Pública, Derecho, etc."
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                errors.especialidad ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              required
            />
            {errors. especialidad && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.especialidad}
              </p>
            )}
          </div>

          {/* Estado */}
          <div>
            <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              id="estado"
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="ACTIVO">Activo</option>
              <option value="INACTIVO">Inactivo</option>
            </select>
          </div>

          {/* Experiencia - ✅ OPCIONAL, SIN REQUIRED */}
          <div className="md:col-span-2">
            <label htmlFor="experiencia" className="block text-sm font-medium text-gray-700 mb-1">
              Experiencia <span className="text-gray-400 text-xs">(Opcional)</span>
            </label>
            <textarea
              id="experiencia"
              name="experiencia"
              value={formData.experiencia}
              onChange={handleChange}
              rows={3}
              placeholder="Breve descripción de la experiencia profesional..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
            />
            <p className="mt-1 text-xs text-gray-500">
              Describe brevemente la trayectoria y experiencia del docente
            </p>
          </div>
        </div>
      </div>

      {/* Botones */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg font-semibold hover:from-red-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all hover:shadow-lg"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {isSubmitting ? 'Guardando...' : docenteData ?  'Actualizar Docente' : 'Crear Docente'}
        </button>

        <button
          type="button"
          onClick={() => router. back()}
          disabled={isSubmitting}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}