/**
 * Componente: CreateUserModal
 * Versión: 1.0
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-25
 * Descripción: Modal para crear nuevos usuarios administradores
 * Seguridad: Solo SUPER_ADMIN puede acceder
 */

'use client';

import { useState } from 'react';
import { X, Loader2, Eye, EyeOff, Shield, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateUserModal({ isOpen, onClose, onSuccess }: CreateUserModalProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    apellidos: '',
    role: 'ADMIN' as 'ADMIN' | 'SUPER_ADMIN',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  /**
   * Manejar cambios en el formulario
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpiar error del campo
    if (errors[name]) {
      setErrors((prev) => ({ ... prev, [name]: '' }));
    }
  };

  /**
   * Enviar formulario
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await fetch('/api/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (! response.ok) {
        // Manejar errores de validación
        if (data.details) {
          const newErrors: Record<string, string> = {};
          data.details.forEach((error: any) => {
            newErrors[error.field] = error.message;
          });
          setErrors(newErrors);
          toast.error('Por favor corrige los errores del formulario');
          return;
        }

        // Error de email duplicado
        if (data. field === 'email') {
          setErrors({ email: data.error });
          toast.error(data.error);
          return;
        }

        toast.error(data.error || 'Error al crear usuario');
        return;
      }

      toast.success('Usuario creado exitosamente');
      onSuccess();
      handleClose();
    } catch (error) {
      console.error('Error creating user:', error);
      toast. error('Error al crear usuario');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Cerrar modal y limpiar formulario
   */
  const handleClose = () => {
    setFormData({
      email: '',
      password: '',
      name: '',
      apellidos: '',
      role: 'ADMIN',
    });
    setErrors({});
    setShowPassword(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Crear Nuevo Usuario</h2>
              <p className="text-sm text-gray-600 mt-1">
                Completa los datos para crear un nuevo administrador
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors ${
                  errors. email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="usuario@cefib.pe"
                disabled={isSubmitting}
                required
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Contraseña */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors pr-12 ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Mínimo 8 caracteres"
                  disabled={isSubmitting}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Debe contener: mayúscula, minúscula, número y carácter especial (@$!%*? &#)
              </p>
            </div>

            {/* Nombre */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData. name}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Juan"
                disabled={isSubmitting}
                required
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Apellidos */}
            <div>
              <label htmlFor="apellidos" className="block text-sm font-medium text-gray-700 mb-2">
                Apellidos <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="apellidos"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors ${
                  errors.apellidos ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Pérez García"
                disabled={isSubmitting}
                required
              />
              {errors.apellidos && (
                <p className="mt-1 text-sm text-red-600">{errors.apellidos}</p>
              )}
            </div>

            {/* Rol */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                Rol <span className="text-red-500">*</span>
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                disabled={isSubmitting}
              >
                <option value="ADMIN">Administrador</option>
                <option value="SUPER_ADMIN">Super Administrador</option>
              </select>
              <div className="mt-2 space-y-2">
                <div className="flex items-start gap-2 text-xs text-gray-600">
                  <Shield className="w-4 h-4 text-blue-500 shrink-0 mt-0. 5" />
                  <span>
                    <strong>Admin:</strong> Puede gestionar cursos y ver usuarios
                  </span>
                </div>
                <div className="flex items-start gap-2 text-xs text-gray-600">
                  <ShieldCheck className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Super Admin:</strong> Puede crear, editar y eliminar usuarios
                  </span>
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="w-full sm:flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creando...
                  </>
                ) : (
                  'Crear Usuario'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}