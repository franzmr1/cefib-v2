/**
 * Página: Gestión de Usuarios Administradores
 * Versión: 1.0
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-25
 * Descripción: Lista y gestión de usuarios administradores
 * Seguridad: Solo SUPER_ADMIN puede crear/editar/eliminar
 */

'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Shield, ShieldCheck, Loader2 } from 'lucide-react';
import UserTable from '@/components/admin/usuarios/UserTable';
import CreateUserModal from '@/components/admin/usuarios/CreateUserModal';

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

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);

  /**
   * Obtener rol del usuario actual desde cookies
   */
  useEffect(() => {
    // Aquí podrías hacer una llamada a una API para obtener el usuario actual
    // Por ahora, asumimos que el componente solo se muestra si el usuario está autenticado
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      // Esta función debería obtener el usuario actual
      // Por ahora la dejamos como placeholder
      // En producción, deberías tener un endpoint /api/auth/me
      setCurrentUserRole('SUPER_ADMIN'); // Temporal
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  /**
   * Cargar usuarios al montar el componente
   */
  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/usuarios');
      if (response.ok) {
        const data = await response.json();
        setUsuarios(data. usuarios || []);
        setFilteredUsuarios(data.usuarios || []);
      } else {
        console.error('Error al cargar usuarios');
      }
    } catch (error) {
      console.error('Error loading usuarios:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Aplicar filtros
   */
  useEffect(() => {
    let filtered = [... usuarios];

    // Filtro por búsqueda
    if (searchTerm. trim()) {
      const searchLower = searchTerm. toLowerCase();
      filtered = filtered. filter(
        (usuario) =>
          usuario.email.toLowerCase().includes(searchLower) ||
          usuario. name?.toLowerCase().includes(searchLower) ||
          usuario.apellidos?.toLowerCase().includes(searchLower)
      );
    }

    // Filtro por rol
    if (roleFilter) {
      filtered = filtered.filter((usuario) => usuario.role === roleFilter);
    }

    setFilteredUsuarios(filtered);
  }, [searchTerm, roleFilter, usuarios]);

  /**
   * Limpiar filtros
   */
  const clearFilters = () => {
    setSearchTerm('');
    setRoleFilter('');
  };

  /**
   * Estadísticas
   */
  const stats = {
    total: usuarios.length,
    superAdmins: usuarios.filter((u) => u.role === 'SUPER_ADMIN').length,
    admins: usuarios.filter((u) => u.role === 'ADMIN').length,
  };

  const hasActiveFilters = searchTerm || roleFilter;

  const isSuperAdmin = currentUserRole === 'SUPER_ADMIN';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Gestión de Usuarios
          </h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">
            Administra los usuarios con acceso al panel administrativo
          </p>
        </div>

        {/* Botón Crear Usuario - Solo SUPER_ADMIN */}
        {isSuperAdmin && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg font-semibold hover:from-red-600 hover:to-pink-600 transition-all shadow-md hover:shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>Nuevo Usuario</span>
          </button>
        )}
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Search className="w-5 h-5 text-gray-600" />
          <h2 className="font-semibold text-gray-900">Filtros</h2>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="ml-auto text-sm text-red-500 hover:text-red-600 font-semibold"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Búsqueda */}
          <div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="search"
                placeholder="Buscar por nombre, apellidos o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Filtro por rol */}
          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white text-sm"
            >
              <option value="">Todos los roles</option>
              <option value="SUPER_ADMIN">Super Administradores</option>
              <option value="ADMIN">Administradores</option>
            </select>
          </div>
        </div>

        {/* Contador de resultados */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Mostrando{' '}
            <span className="font-semibold text-gray-900">{filteredUsuarios.length}</span> de{' '}
            <span className="font-semibold text-gray-900">{stats.total}</span> usuarios
            {hasActiveFilters && ' (filtrado)'}
          </p>
        </div>
      </div>

      {/* Tabla de usuarios */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
            <p className="ml-3 text-gray-600">Cargando usuarios...</p>
          </div>
        ) : (
          <UserTable 
            usuarios={filteredUsuarios} 
            onRefresh={fetchUsuarios}
            currentUserRole={currentUserRole}
          />
        )}
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-blue-50 rounded-lg p-4 md:p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs md:text-sm text-blue-600 font-semibold">Total Usuarios</p>
              <p className="text-2xl md:text-3xl font-bold text-blue-900 mt-1">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4 md:p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs md:text-sm text-purple-600 font-semibold">Super Admins</p>
              <p className="text-2xl md:text-3xl font-bold text-purple-900 mt-1">{stats.superAdmins}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4 md:p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs md:text-sm text-green-600 font-semibold">Admins</p>
              <p className="text-2xl md:text-3xl font-bold text-green-900 mt-1">{stats.admins}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Crear Usuario */}
      {isSuperAdmin && (
        <CreateUserModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={fetchUsuarios}
        />
      )}
    </div>
  );
}