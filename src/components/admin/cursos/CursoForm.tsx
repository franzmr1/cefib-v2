/**
 * Componente: Formulario de Curso (Mejorado)
 * Version: v2.0
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-12-03
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  Save, 
  ArrowLeft, 
  Upload, 
  Eye, 
  EyeOff, 
  Info,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface CursoFormProps {
  userId: string;
  cursoData?: any;
}

export default function CursoForm({ userId, cursoData }: CursoFormProps) {
  const router = useRouter();
  const isEditing = !!cursoData;

  // Estados del formulario
  const [formData, setFormData] = useState({
    titulo: cursoData?. titulo || '',
    slug: cursoData?.slug || '',
    descripcionBreve: cursoData?.descripcionBreve || '',
    descripcion: cursoData?.descripcion || '',
    imagenUrl: cursoData?.imagenUrl || '',
    fechaInicio: cursoData?.fechaInicio?. split('T')[0] || '',
    fechaFin: cursoData?.fechaFin?.split('T')[0] || '',
    duracionHoras: cursoData?. duracionHoras || '',
    modalidad: cursoData?.modalidad || 'VIRTUAL',
    sector: cursoData?.sector || '',
    certificado: cursoData?.certificado || false,
    precio: cursoData?.precio || '',
    cupoMaximo: cursoData?.cupoMaximo || '',
    estado: cursoData?. estado || 'BORRADOR',
    creadorId: userId,
  });

  // Estados UI
  const [imagePreview, setImagePreview] = useState<string | null>(cursoData?.imagenUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(false);
  
  // Secciones colapsables
  const [expandedSections, setExpandedSections] = useState({
    basico: true,
    contenido: true,
    logistica: false,
    comercial: false,
  });

  // Auto-generar slug desde título
  useEffect(() => {
    if (! isEditing && formData.titulo) {
      const slug = formData.titulo
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Quitar acentos
        .replace(/[^a-z0-9\s-]/g, '') // Solo letras, números, espacios y guiones
        .trim()
        .replace(/\s+/g, '-') // Espacios a guiones
        .replace(/-+/g, '-'); // Múltiples guiones a uno solo

      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData. titulo, isEditing]);

  // Validación en tiempo real
  const validateField = (name: string, value: any): string => {
    switch (name) {
      case 'titulo':
        return ! value ?  'El título es obligatorio' : '';
      case 'slug':
        return !value ? 'El slug es obligatorio' : '';
      case 'duracionHoras':
        return ! value || value <= 0 ? 'La duración debe ser mayor a 0' : '';
      case 'precio':
        return value && value < 0 ? 'El precio no puede ser negativo' : '';
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setFormData(prev => ({ ...prev, [name]: finalValue }));

    // Validar campo
    const error = validateField(name, finalValue);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  // Upload de imagen
  const handleImageUpload = async (e: React. ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (! file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida');
      return;
    }

    // Validar tamaño (max 5MB)
    if (file. size > 5 * 1024 * 1024) {
      alert('La imagen no debe superar 5MB');
      return;
    }

    setIsUploading(true);

    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      if (! response.ok) throw new Error('Error al subir imagen');

      const data = await response.json();
      setFormData(prev => ({ ...prev, imagenUrl: data.url }));
      setImagePreview(data.url);
    } catch (error) {
      console. error('Error uploading image:', error);
      alert('Error al subir la imagen.  Intenta de nuevo.');
    } finally {
      setIsUploading(false);
    }
  };

  // Enviar formulario
  const handleSubmit = async (e: React. FormEvent) => {
    e.preventDefault();

    // Validar campos obligatorios
    const requiredErrors: Record<string, string> = {};
    if (!formData.titulo) requiredErrors.titulo = 'El título es obligatorio';
    if (! formData.slug) requiredErrors.slug = 'El slug es obligatorio';
    if (!formData.duracionHoras) requiredErrors. duracionHoras = 'La duración es obligatoria';

    if (Object.keys(requiredErrors).length > 0) {
      setErrors(requiredErrors);
      alert('Por favor completa los campos obligatorios');
      return;
    }

    setIsSaving(true);

    try {
      const url = isEditing ? `/api/cursos/${cursoData. id}` : '/api/cursos';
      const method = isEditing ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al guardar el curso');
      }

      alert(isEditing ? 'Curso actualizado exitosamente' : 'Curso creado exitosamente');
      router.push('/admin/cursos');
      router.refresh();
    } catch (error: any) {
      console.error('Error saving curso:', error);
      alert(error.message || 'Error al guardar el curso');
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle sección
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header con acciones */}
      <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Editar Curso' : 'Nuevo Curso'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Completa los campos obligatorios (*)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowPreview(! showPreview)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
          >
            {showPreview ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            {showPreview ? 'Ocultar' : 'Preview'}
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Guardando... 
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                {isEditing ? 'Actualizar' : 'Crear'} Curso
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Columna principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* SECCIÓN: Información Básica */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection('basico')}
              className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 transition-colors"
            >
              <h3 className="text-lg font-bold text-gray-900">📋 Información Básica</h3>
              {expandedSections.basico ?  <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>

            {expandedSections.basico && (
              <div className="p-6 space-y-4">
                {/* Título */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Título del Curso <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleChange}
                    placeholder="Ej: Diplomado en Gestión Pública"
                    className={`w-full px-4 py-3 border ${errors.titulo ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.titulo && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.titulo}
                    </p>
                  )}
                </div>

                {/* Slug */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    URL Amigable (Slug) <span className="text-red-500">*</span>
                    <div className="group relative">
                      <Info className="w-4 h-4 text-gray-400 cursor-help" />
                      <div className="hidden group-hover:block absolute left-0 top-6 bg-gray-900 text-white text-xs rounded-lg p-2 w-48 z-10">
                        Se genera automáticamente del título.  Ej: diplomado-gestion-publica
                      </div>
                    </div>
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    placeholder="diplomado-gestion-publica"
                    className={`w-full px-4 py-3 border ${errors.slug ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm`}
                    readOnly={! isEditing}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Preview: <code className="bg-gray-100 px-2 py-1 rounded">/cursos/{formData.slug || 'tu-slug'}</code>
                  </p>
                </div>

                {/* Descripción Breve */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Descripción Breve
                  </label>
                  <textarea
                    name="descripcionBreve"
                    value={formData.descripcionBreve}
                    onChange={handleChange}
                    rows={2}
                    maxLength={160}
                    placeholder="Resumen corto que aparece en las tarjetas (máx. 160 caracteres)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                  <p className="mt-1 text-xs text-gray-500 text-right">
                    {formData. descripcionBreve. length}/160 caracteres
                  </p>
                </div>

                {/* Modalidad y Sector */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Modalidad <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="modalidad"
                      value={formData. modalidad}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="VIRTUAL">🌐 Virtual</option>
                      <option value="PRESENCIAL">🏫 Presencial</option>
                      <option value="HIBRIDO">🔀 Híbrido</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Sector
                    </label>
                    <select
                      name="sector"
                      value={formData.sector}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Seleccionar... </option>
                      <option value="GESTION_PUBLICA">🏛️ Gestión Pública</option>
                      <option value="SALUD">🏥 Salud</option>
                      <option value="TECNOLOGIA">💻 Tecnología</option>
                      <option value="EDUCACION">📚 Educación</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECCIÓN: Contenido */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection('contenido')}
              className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-green-50 to-teal-50 hover:from-green-100 hover:to-teal-100 transition-colors"
            >
              <h3 className="text-lg font-bold text-gray-900">📝 Contenido del Curso</h3>
              {expandedSections.contenido ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>

            {expandedSections. contenido && (
              <div className="p-6 space-y-4">
                {/* Descripción Completa */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Descripción Completa
                  </label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    rows={8}
                    placeholder="Descripción detallada del curso, objetivos, temario, beneficios..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    💡 Tip: Usa HTML para formato (ej: &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;)
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* SECCIÓN: Logística */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection('logistica')}
              className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 transition-colors"
            >
              <h3 className="text-lg font-bold text-gray-900">📅 Logística y Fechas</h3>
              {expandedSections.logistica ?  <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>

            {expandedSections.logistica && (
              <div className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Duración */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Duración (horas) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="duracionHoras"
                      value={formData.duracionHoras}
                      onChange={handleChange}
                      min="1"
                      placeholder="40"
                      className={`w-full px-4 py-3 border ${errors.duracionHoras ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
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
                      placeholder="30"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

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
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECCIÓN: Comercial */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection('comercial')}
              className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-colors"
            >
              <h3 className="text-lg font-bold text-gray-900">💰 Información Comercial</h3>
              {expandedSections.comercial ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>

            {expandedSections.comercial && (
              <div className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
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
                      step="0.01"
                      placeholder="150. 00"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Estado */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Estado de Publicación <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="estado"
                      value={formData.estado}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="BORRADOR">📝 Borrador (No visible)</option>
                      <option value="ACTIVO">✅ Activo (Publicado)</option>
                      <option value="INACTIVO">⏸️ Inactivo (Pausado)</option>
                      <option value="ARCHIVADO">📦 Archivado</option>
                    </select>
                  </div>
                </div>

                {/* Certificado */}
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                  <input
                    type="checkbox"
                    id="certificado"
                    name="certificado"
                    checked={formData.certificado}
                    onChange={handleChange}
                    className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                  />
                  <label htmlFor="certificado" className="flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    Incluye Certificado
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Columna lateral - Preview e Imagen */}
        <div className="space-y-6">
          {/* Upload de Imagen */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">🖼️ Imagen del Curso</h3>

            {/* Preview */}
            <div className="relative w-full aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl overflow-hidden mb-4">
              {imagePreview ?  (
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                  <Upload className="w-12 h-12 mb-2" />
                  <p className="text-sm">Sin imagen</p>
                </div>
              )}
            </div>

            {/* Botón Upload */}
            <label className="block">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={isUploading}
              />
              <div className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-center cursor-pointer hover:shadow-lg transition-all flex items-center justify-center gap-2">
                {isUploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Subiendo...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    {imagePreview ?  'Cambiar' : 'Subir'} Imagen
                  </>
                )}
              </div>
            </label>

            <p className="text-xs text-gray-500 mt-2 text-center">
              Recomendado: 1200x675px (16:9) | Máx. 5MB
            </p>
          </div>

          {/* Info del Estado */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">ℹ️ Estado Actual</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Publicación:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  formData.estado === 'ACTIVO' ? 'bg-green-100 text-green-700' :
                  formData.estado === 'BORRADOR' ? 'bg-yellow-100 text-yellow-700' :
                  formData.estado === 'INACTIVO' ? 'bg-gray-100 text-gray-700' :
                  'bg-purple-100 text-purple-700'
                }`}>
                  {formData.estado}
                </span>
              </div>

              {formData.estado === 'ACTIVO' && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700">
                    ✅ Este curso será visible en la web pública
                  </p>
                </div>
              )}

              {formData.estado === 'BORRADOR' && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-700">
                    ⚠️ Borrador: Solo visible para administradores
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}