/**
 * Página: Gestión de Participantes
 * Versión: 1.2 - Con Modal de Inscripción
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-26
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Loader2 } from 'lucide-react';
import ParticipanteTable from '@/components/admin/participantes/ParticipanteTable';
import InscripcionModal from '@/components/admin/participantes/InscripcionModal';

export default function ParticipantesPage() {
  const router = useRouter();
  const [participantes, setParticipantes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  
  // Estados para el modal de inscripción
  const [showInscripcionModal, setShowInscripcionModal] = useState(false);
  const [selectedParticipante, setSelectedParticipante] = useState<any | null>(null);

  const fetchParticipantes = async () => {
    try {
      const response = await fetch('/api/participantes');
      if (response. ok) {
        const data = await response.json();
        setParticipantes(data.participantes || []);
      }
    } catch (error) {
      console.error('Error fetching participantes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/usuarios/me');
        if (response.ok) {
          const data = await response.json();
          setUserRole(data.user.role);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      }
    };

    checkAuth();
    fetchParticipantes();
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    fetchParticipantes();
  };

  // Función para abrir el modal de inscripción
  const handleInscribir = (participante: any) => {
    setSelectedParticipante(participante);
    setShowInscripcionModal(true);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setShowInscripcionModal(false);
    setSelectedParticipante(null);
  };

  // Función cuando se inscribe exitosamente
  const handleInscripcionSuccess = () => {
    handleRefresh();
    handleCloseModal();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
      </div>
    );
  }

  const participantesActivos = participantes. filter(p => p.estado === 'ACTIVO');
  const participantesConInscripciones = participantes.filter(p => p._count?.inscripciones > 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Gestión de Participantes
          </h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">
            Administra los participantes y estudiantes
          </p>
        </div>
        <Link
          href="/admin/participantes/nuevo"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg font-semibold hover:from-red-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          <span>Nuevo Participante</span>
        </Link>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600">Total Participantes</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{participantes.length}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600">Participantes Activos</div>
          <div className="text-2xl font-bold text-green-600 mt-1">{participantesActivos.length}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600">Con Inscripciones</div>
          <div className="text-2xl font-bold text-purple-600 mt-1">{participantesConInscripciones.length}</div>
        </div>
      </div>

      {/* Tabla */}
      <ParticipanteTable 
        participantes={participantes} 
        onRefresh={handleRefresh} 
        currentUserRole={userRole}
        onInscribir={handleInscribir}
      />

      {/* Modal de Inscripción */}
      {showInscripcionModal && selectedParticipante && (
        <InscripcionModal
          isOpen={showInscripcionModal}
          onClose={handleCloseModal}
          participante={selectedParticipante}
          onSuccess={handleInscripcionSuccess}
        />
      )}
    </div>
  );
}