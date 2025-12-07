/**
 * Componente: SolicitudProgramaForm
 * Versión: 1.0
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-26
 * Descripción: Formulario para solicitar programa personalizado
 */

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Send, 
  User, 
  Mail, 
  Phone, 
  Building2, 
  Briefcase,
  MessageSquare,
  Users,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface SolicitudFormProps {
  isOpen: boolean;
  onClose: () => void;
  servicioPreseleccionado?: string;
}

export default function SolicitudProgramaForm({ 
  isOpen, 
  onClose,
  servicioPreseleccionado 
}: SolicitudFormProps) {
  const [formData, setFormData] = useState({
    nombres: '',
    email: '',
    telefono: '',
    empresa: '',
    cargo: '',
    servicioInteres: servicioPreseleccionado || '',
    tipoPrograma: 'INDIVIDUAL' as 'INDIVIDUAL' | 'CORPORATIVO',
    numParticipantes: '',
    mensaje: '',
    comoNosConociste: '',
    aceptoTerminos: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [folio, setFolio] = useState('');

  // Bloquear scroll cuando está abierto
   useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document. body.style.overflow = 'unset';
    };
  }, [isOpen]); // ✅ Depende de isOpen

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : value,
    }));

    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ... prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Preparar datos
      const payload = {
        ... formData,
        numParticipantes: formData.numParticipantes 
          ? parseInt(formData. numParticipantes) 
          : null,
      };

      const response = await fetch('/api/solicitudes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (! response.ok) {
        if (data.details) {
          // Errores de validación por campo
          setErrors(data.details);
        } else {
          setErrors({ general: data.error || 'Error al enviar solicitud' });
        }
        setSubmitStatus('error');
        return;
      }

      // Éxito
      setFolio(data.data.folio);
      setSubmitStatus('success');

      // Auto-cerrar después de 5 segundos
      setTimeout(() => {
        onClose();
        resetForm();
      }, 5000);

    } catch (error) {
      console.error('Error:', error);
      setErrors({ general: 'Error de conexión.  Intente nuevamente.' });
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nombres: '',
      email: '',
      telefono: '',
      empresa: '',
      cargo: '',
      servicioInteres: servicioPreseleccionado || '',
      tipoPrograma: 'INDIVIDUAL',
      numParticipantes: '',
      mensaje: '',
      comoNosConociste: '',
      aceptoTerminos: false,
    });
    setErrors({});
    setSubmitStatus('idle');
    setFolio('');
  };

  if (!isOpen) return null;

  // Vista de éxito
  if (submitStatus === 'success') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="fixed inset-0 bg-[#003366] bg-opacity-95"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center"
        >
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-[#003366] mb-2">
              ¡Solicitud Enviada!
            </h3>
            <p className="text-gray-600">
              Hemos recibido tu solicitud exitosamente
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-600 mb-1">Número de folio:</p>
            <p className="text-xl font-bold text-[#FF6B35]">{folio}</p>
          </div>

          <p className="text-sm text-gray-600 mb-6">
            Nos contactaremos contigo pronto para brindarte más información sobre el programa personalizado.
          </p>

          <button
            onClick={() => {
              onClose();
              resetForm();
            }}
            className="w-full bg-[#003366] hover:bg-[#004488] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Cerrar
          </button>
        </motion.div>
      </div>
    );
  }

  // Formulario
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-[#003366] bg-opacity-95"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#003366] to-[#004488] p-6 text-white relative overflow-hidden">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-6 h-6 text-[#FF6B35]" />
              <h2 className="text-2xl font-bold">Solicitar Programa Personalizado</h2>
            </div>
            <p className="text-blue-100">
              Completa el formulario y nos contactaremos contigo
            </p>

            {/* Decoración */}
            <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-[#FF6B35] opacity-10 rounded-full" />
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            {/* Error general */}
            {errors.general && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{errors.general}</p>
              </div>
            )}

            <div className="space-y-6">
              {/* Datos Personales */}
              <div>
                <h3 className="text-lg font-semibold text-[#003366] mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Datos Personales
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Nombres */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombres Completos <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="nombres"
                      value={formData.nombres}
                      onChange={handleChange}
                      className={`w-full px-4 py-2. 5 border rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition-all ${
                        errors.nombres ?  'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Ej: Juan Carlos"
                    />
                    {errors.nombres && (
                      <p className="text-xs text-red-600 mt-1">{errors. nombres}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition-all ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="tu@email.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-xs text-red-600 mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* Teléfono */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono / Celular
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition-all ${
                          errors.telefono ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="987654321"
                      />
                    </div>
                    {errors.telefono && (
                      <p className="text-xs text-red-600 mt-1">{errors.telefono}</p>
                    )}
                  </div>

                  {/* Empresa */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Empresa / Institución
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="empresa"
                        value={formData.empresa}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition-all"
                        placeholder="Nombre de la empresa"
                      />
                    </div>
                  </div>

                  {/* Cargo */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cargo
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="cargo"
                        value={formData.cargo}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition-all"
                        placeholder="Tu cargo actual"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Detalles del Programa */}
              <div>
                <h3 className="text-lg font-semibold text-[#003366] mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Detalles del Programa
                </h3>

                <div className="space-y-4">
                  {/* Servicio de Interés */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Servicio de Interés <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="servicioInteres"
                      value={formData.servicioInteres}
                      onChange={handleChange}
                      className={`w-full px-4 py-2. 5 border rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition-all ${
                        errors.servicioInteres ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Selecciona un servicio</option>
                      <option value="PROYECTOS_PLANES">Proyectos Y Planes</option>
                      <option value="SALUD">Salud</option>
                      <option value="GESTION_PUBLICA">Gestión Pública</option>
                      <option value="EDUCACION">Educación</option>
                      <option value="TECNOLOGIA">Tecnología</option>
                      <option value="ENERGIA_MINERIA">Energía y Minería</option>
                      <option value="OTRO">Otro</option>
                    </select>
                    {errors.servicioInteres && (
                      <p className="text-xs text-red-600 mt-1">{errors.servicioInteres}</p>
                    )}
                  </div>

                  {/* Tipo de Programa */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Programa <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.tipoPrograma === 'INDIVIDUAL'
                          ? 'border-[#FF6B35] bg-orange-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}>
                        <input
                          type="radio"
                          name="tipoPrograma"
                          value="INDIVIDUAL"
                          checked={formData.tipoPrograma === 'INDIVIDUAL'}
                          onChange={handleChange}
                          className="w-4 h-4 text-[#FF6B35]"
                        />
                        <div>
                          <div className="font-semibold text-gray-900">Individual</div>
                          <div className="text-xs text-gray-600">Para una persona</div>
                        </div>
                      </label>

                      <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.tipoPrograma === 'CORPORATIVO'
                          ? 'border-[#FF6B35] bg-orange-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}>
                        <input
                          type="radio"
                          name="tipoPrograma"
                          value="CORPORATIVO"
                          checked={formData. tipoPrograma === 'CORPORATIVO'}
                          onChange={handleChange}
                          className="w-4 h-4 text-[#FF6B35]"
                        />
                        <div>
                          <div className="font-semibold text-gray-900">Corporativo</div>
                          <div className="text-xs text-gray-600">Para grupo</div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Número de Participantes (solo si es corporativo) */}
                  {formData.tipoPrograma === 'CORPORATIVO' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Número de Participantes <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="number"
                          name="numParticipantes"
                          value={formData.numParticipantes}
                          onChange={handleChange}
                          min="1"
                          className={`w-full pl-10 pr-4 py-2. 5 border rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition-all ${
                            errors.numParticipantes ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Ej: 20"
                        />
                      </div>
                      {errors.numParticipantes && (
                        <p className="text-xs text-red-600 mt-1">{errors.numParticipantes}</p>
                      )}
                    </div>
                  )}

                  {/* Mensaje */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Describe tus necesidades <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <textarea
                        name="mensaje"
                        value={formData.mensaje}
                        onChange={handleChange}
                        rows={4}
                        className={`w-full pl-10 pr-4 py-2. 5 border rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition-all resize-none ${
                          errors. mensaje ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Cuéntanos qué tipo de programa personalizado necesitas..."
                      />
                    </div>
                    {errors.mensaje && (
                      <p className="text-xs text-red-600 mt-1">{errors.mensaje}</p>
                    )}
                  </div>

                  {/* Cómo nos conociste */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ¿Cómo nos conociste?
                    </label>
                    <select
                      name="comoNosConociste"
                      value={formData.comoNosConociste}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition-all"
                    >
                      <option value="">Selecciona una opción</option>
                      <option value="Google">Google</option>
                      <option value="Redes Sociales">Redes Sociales</option>
                      <option value="Recomendación">Recomendación</option>
                      <option value="Publicidad">Publicidad</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Términos y Condiciones */}
              <div>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    name="aceptoTerminos"
                    checked={formData.aceptoTerminos}
                    onChange={handleChange}
                    className="mt-1 w-4 h-4 text-[#FF6B35] border-gray-300 rounded focus:ring-[#FF6B35]"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">
                    Acepto los términos y condiciones, y autorizo el tratamiento de mis datos personales para que CEFIB se contacte conmigo.  <span className="text-red-500">*</span>
                  </span>
                </label>
                {errors.aceptoTerminos && (
                  <p className="text-xs text-red-600 mt-1 ml-7">{errors.aceptoTerminos}</p>
                )}
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-3 mt-8 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] hover:from-[#FF8C5A] hover:to-[#FF6B35] text-white px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Enviar Solicitud
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}