/**
 * Componente: ServiciosSection
 * Versión: 2.1 - Corregido tipado
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-26
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  Heart, 
  CheckCircle, 
  GraduationCap, 
  Monitor, 
  Flame,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { SERVICIOS, ServicioData } from '@/data/servicios';
import ServicioModal from './ServicioModal';
import SolicitudProgramaForm from '@/components/public/SolicitudProgramaForm';


// Mapeo de iconos
const ICON_MAP: Record<string, any> = {
  'briefcase': Briefcase,
  'heart': Heart,
  'check-circle': CheckCircle,
  'graduation-cap': GraduationCap,
  'monitor': Monitor,
  'flame': Flame,
};

// Variantes de animación (corregidas)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    }
  }
};

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 50,
    scale: 0.9
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 100,
      damping: 12
    }
  }
};

const iconHoverVariants = {
  rest: { scale: 1, rotate: 0 },
  hover: { 
    scale: 1.1, 
    rotate: [0, -10, 10, -10, 0],
    transition: {
      duration: 0.5
    }
  }
};

export default function ServiciosSection() {
  const [selectedServicio, setSelectedServicio] = useState<ServicioData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // ✅ NUEVO: Estado para formulario de solicitud
  const [showSolicitudForm, setShowSolicitudForm] = useState(false);
  const [servicioPreseleccionado, setServicioPreseleccionado] = useState<string>('');

  const handleLeerMas = (servicio: ServicioData) => {
    setSelectedServicio(servicio);
    setIsModalOpen(true);
  };

  // ✅ NUEVO: Handler para abrir formulario
  const handleSolicitarPrograma = (servicioId?: string) => {
    setServicioPreseleccionado(servicioId || '');
    setShowSolicitudForm(true);
  };
  

  return (
    <>
      <section className="py-16 lg:py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        {/* Decoraciones de fondo animadas */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -top-24 -right-24 w-96 h-96 bg-[#FF6B35] rounded-full opacity-5"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div
            className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#003366] rounded-full opacity-5"
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, -90, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header con animación */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 lg:mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="inline-flex items-center gap-2 mb-4"
            >
              <Sparkles className="w-5 h-5 text-[#FF6B35]" />
              <span className="text-[#FF6B35] font-semibold text-sm lg:text-base tracking-wide uppercase">
                Nuestros Servicios
              </span>
              <Sparkles className="w-5 h-5 text-[#FF6B35]" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#003366] mb-4"
            >
              PROGRAMAS DE{' '}
              <span className="bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] bg-clip-text text-transparent">
                CAPACITACIÓN
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-gray-600 text-base lg:text-lg max-w-2xl mx-auto"
            >
              Programas especializados diseñados para impulsar tu desarrollo profesional
            </motion.p>
          </motion.div>

          {/* Grid de Cards con animación */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {SERVICIOS.map((servicio) => {
              const Icon = ICON_MAP[servicio.icono] || Briefcase;

              return (
                <motion. div
                  key={servicio.id}
                  variants={cardVariants}
                  whileHover={{ y: -10 }}
                  className="group relative"
                >
                  {/* Card */}
                  <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 lg:p-8 h-full flex flex-col overflow-hidden">
                    {/* Efecto de brillo al hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B35]/0 to-[#FF6B35]/0 group-hover:from-[#FF6B35]/5 group-hover:to-[#003366]/5 transition-all duration-500 rounded-2xl" />

                    {/* Borde animado */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#FF6B35]/20 transition-all duration-300" />

                    {/* Contenido */}
                    <div className="relative z-10">
                      {/* Icono con animación */}
                      <motion.div
                        variants={iconHoverVariants}
                        initial="rest"
                        whileHover="hover"
                        className={`w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br ${servicio.color} rounded-2xl flex items-center justify-center mb-5 shadow-lg group-hover:shadow-xl transition-shadow`}
                      >
                        <Icon className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
                      </motion.div>

                      {/* Título */}
                      <h3 className="text-xl lg:text-2xl font-bold text-[#003366] mb-3 group-hover:text-[#FF6B35] transition-colors">
                        {servicio.titulo}
                      </h3>

                      {/* Descripción */}
                      <p className="text-gray-600 text-sm lg:text-base leading-relaxed mb-6 flex-grow">
                        {servicio.descripcion}
                      </p>

                      {/* Badge de módulos */}
                      <div className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1. 5 rounded-full mb-4">
                        <Sparkles className="w-4 h-4 text-[#FF6B35]" />
                        <span className="text-xs font-semibold text-gray-700">
                          {servicio. temario. length} módulos
                        </span>
                      </div>

                      {/* Botón Leer Más con animación */}
                      <motion.button
                        onClick={() => handleLeerMas(servicio)}
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center gap-2 text-[#FF6B35] font-semibold text-sm lg:text-base group/btn"
                      >
                        <span>Leer Más</span>
                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{ 
                            duration: 1.5, 
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                        </motion. div>
                      </motion. button>
                    </div>

                    {/* Partículas decorativas */}
                    <motion.div
                      className="absolute top-4 right-4 w-20 h-20 bg-[#FF6B35] rounded-full opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500"
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </div>
                </motion. div>
              );
            })}
          </motion.div>

                    {/* CTA Section con animación */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 lg:mt-16 text-center"
          >
            <div className="inline-block bg-gradient-to-r from-[#003366] to-[#004488] rounded-2xl p-8 lg:p-10 shadow-2xl">
              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                ¿No encuentras lo que buscas?
              </h3>
              <p className="text-gray-200 mb-6 max-w-lg mx-auto">
                Diseñamos programas personalizados según las necesidades de tu organización
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSolicitarPrograma()} // ✅ CAMBIADO
                className="inline-flex items-center gap-2 bg-[#FF6B35] hover:bg-[#FF8C5A] text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Solicitar Programa Personalizado
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </motion. div>
        </div>
      </section>

      {/* Modal */}
      {selectedServicio && (
        <ServicioModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setTimeout(() => setSelectedServicio(null), 300);
          }}
          servicio={selectedServicio}
        />
      )}
      
      {/* ✅ NUEVO: Modal de Solicitud */}
      <SolicitudProgramaForm
        isOpen={showSolicitudForm}
        onClose={() => setShowSolicitudForm(false)}
        servicioPreseleccionado={servicioPreseleccionado}
      />
    </>
  );
}