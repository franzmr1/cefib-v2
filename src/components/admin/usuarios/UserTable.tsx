/**
 * Componente: UserTable
 * Versión: 1.1 - Con Ver Cursos
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-26
 * Descripción: Tabla responsive de usuarios con acciones y ver cursos
 */

'use client';

import { useState } from 'react';
import { Eye, Edit, Trash2, Shield, ShieldCheck, BookOpen } from 'lucide-react';
import EditUserModal from './EditUserModal';
import DeleteUserModal from './DeleteUserModal';
import ViewUserCoursesModal from './ViewUserCoursesModal';

interface User {
  id: string;
  email: string;
  name: string | null;
  apellidos: string | null;
  role: string;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    cursosCreados: number;
  };
}

interface UserTableProps {
  usuarios: User[];
  onRefresh: () => void;
  currentUserRole: string | null;
}

export default function UserTable({ usuarios, onRefresh, currentUserRole }: UserTableProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewCoursesModalOpen, setIsViewCoursesModalOpen] = useState(false);

  const isSuperAdmin = currentUserRole === 'SUPER_ADMIN';

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleViewCourses = (user: User) => {
    setSelectedUser(user);
    setIsViewCoursesModalOpen(true);
  };

  if (usuarios.length === 0) {
    return (
      <div className="text-center py-12">
        <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No hay usuarios para mostrar</p>
      </div>
    );
  }

  return (
    <>
      {/* Tabla Desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rol
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cursos Creados
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha Creación
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {usuarios.map((usuario) => (
              <tr key={usuario.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center text-white font-bold">
                      {usuario.name?. charAt(0) || usuario.email. charAt(0). toUpperCase()}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {usuario.name} {usuario.apellidos}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{usuario.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                      usuario. role === 'SUPER_ADMIN'
                        ?  'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {usuario.role === 'SUPER_ADMIN' ? (
                      <ShieldCheck className="w-3 h-3" />
                    ) : (
                      <Shield className="w-3 h-3" />
                    )}
                    {usuario.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleViewCourses(usuario)}
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <BookOpen className="w-4 h-4" />
                    {usuario._count. cursosCreados} curso{usuario._count.cursosCreados !== 1 ? 's' : ''}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(usuario.createdAt). toLocaleDateString('es-PE')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    {/* Botón Editar - Solo SUPER_ADMIN */}
                    {isSuperAdmin && (
                      <button
                        onClick={() => handleEdit(usuario)}
                        className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar usuario"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}

                    {/* Botón Eliminar - Solo SUPER_ADMIN y no puede eliminar otro SUPER_ADMIN */}
                    {isSuperAdmin && usuario.role !== 'SUPER_ADMIN' && (
                      <button
                        onClick={() => handleDelete(usuario)}
                        className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar usuario"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards Mobile */}
      <div className="md:hidden divide-y divide-gray-200">
        {usuarios.map((usuario) => (
          <div key={usuario.id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center text-white font-bold">
                  {usuario.name?.charAt(0) || usuario. email.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {usuario.name} {usuario.apellidos}
                  </div>
                  <div className="text-xs text-gray-500">{usuario.email}</div>
                </div>
              </div>
              <span
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                  usuario.role === 'SUPER_ADMIN'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {usuario.role === 'SUPER_ADMIN' ? (
                  <ShieldCheck className="w-3 h-3" />
                ) : (
                  <Shield className="w-3 h-3" />
                )}
                {usuario.role === 'SUPER_ADMIN' ?  'Super' : 'Admin'}
              </span>
            </div>

            {/* Cursos creados */}
            <button
              onClick={() => handleViewCourses(usuario)}
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium mb-3"
            >
              <BookOpen className="w-4 h-4" />
              {usuario._count.cursosCreados} curso{usuario._count.cursosCreados !== 1 ? 's' : ''} creado{usuario._count. cursosCreados !== 1 ? 's' : ''}
            </button>

            <div className="text-xs text-gray-500 mb-3">
              Creado: {new Date(usuario.createdAt).toLocaleDateString('es-PE')}
            </div>

            {/* Acciones Mobile */}
            {isSuperAdmin && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(usuario)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Editar
                </button>
                {usuario.role !== 'SUPER_ADMIN' && (
                  <button
                    onClick={() => handleDelete(usuario)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Eliminar
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modales */}
      {selectedUser && (
        <>
          <EditUserModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedUser(null);
            }}
            onSuccess={onRefresh}
            usuario={selectedUser}
          />
          <DeleteUserModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setSelectedUser(null);
            }}
            onSuccess={onRefresh}
            usuario={selectedUser}
          />
          <ViewUserCoursesModal
            isOpen={isViewCoursesModalOpen}
            onClose={() => {
              setIsViewCoursesModalOpen(false);
              setSelectedUser(null);
            }}
            usuario={selectedUser}
          />
        </>
      )}
    </>
  );
}