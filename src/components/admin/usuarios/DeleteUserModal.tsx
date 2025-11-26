/**
 * Componente: DeleteUserModal
 * Versión: 1.0
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-25
 * Descripción: Modal de confirmación para eliminar usuarios
 * Seguridad: Solo SUPER_ADMIN puede acceder
 */

'use client';

import { useState } from 'react';
import { X, Loader2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  name: string | null;
  apellidos: string | null;
  role: string;
  _count?: {
    cursosCreados: number;
  };
}

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  usuario: User;
}

export default function DeleteUserModal({ isOpen, onClose, onSuccess, usuario }: DeleteUserModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  /**
   * Confirmar eliminación
   */
  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/usuarios/${usuario.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Error al eliminar usuario');
        return;
      }

      toast.success('Usuario eliminado exitosamente');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Error al eliminar usuario');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  const cursosCount = usuario._count?.cursosCreados || 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Confirmar Eliminación</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={isDeleting}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4">
            <p className="text-gray-700">
              ¿Estás seguro de que deseas eliminar al usuario{' '}
              <strong className="text-gray-900">
                {usuario.name} {usuario.apellidos}
              </strong>
              ? 
            </p>

            {/* Información del usuario */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium text-gray-900">{usuario. email}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Rol:</span>
                <span className="font-medium text-gray-900">
                  {usuario.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Cursos creados:</span>
                <span className="font-medium text-gray-900">{cursosCount}</span>
              </div>
            </div>

            {/* Advertencia */}
            {cursosCount > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-semibold mb-1">Advertencia</p>
                    <p>
                      Este usuario tiene {cursosCount} curso{cursosCount !== 1 ? 's' : ''} creado
                      {cursosCount !== 1 ? 's' : ''}. Al eliminarlo, también se eliminarán estos cursos.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <p className="text-sm text-red-600 font-medium">
              Esta acción no se puede deshacer. 
            </p>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 flex flex-col-reverse sm:flex-row gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
              disabled={isDeleting}
            >
              Cancelar
            </button>
            <button
              onClick={handleDelete}
              className="w-full sm:flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Eliminando...
                </>
              ) : (
                'Eliminar Usuario'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}