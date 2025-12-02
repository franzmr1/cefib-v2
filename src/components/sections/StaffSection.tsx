/**
 * Componente: StaffSection
 * Version: v3.0 - Diseño acordeón expandible
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-27
 * Descripción: Sección de staff con expansión inline
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Users, Award, CheckCircle } from 'lucide-react';
import { PROFESIONALES, Profesional } from '@/data/profesionales';
import Image from 'next/image';

export default function StaffSection() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 lg:mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-blue-50 text-[#003366] px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Users className="w-4 h-4" />
            Nuestro Equipo
          </div>

          {/* Título con colores personalizados */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-[#003366]">Staff de </span>
            <span className="text-[#FF6B35]">Profesionales</span>
          </h2>

          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            CEFIB se dedica a la capacitación y formación profesional, ofreciendo programas de alta calidad
            con un equipo de expertos comprometidos
          </p>
        </motion.div>

        {/* Grid de profesionales */}
        <div className="space-y-4 max-w-6xl mx-auto">
          {PROFESIONALES. map((profesional, index) => (
            <motion.div
              key={profesional.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              {/* Card colapsada */}
              <div
                onClick={() => toggleExpand(profesional.id)}
                className="p-6 lg:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 cursor-pointer group"
              >
                {/* Número identificador */}
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] rounded-full flex items-center justify-center text-white font-bold text-2xl lg:text-3xl shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {profesional.id}
                </div>

                {/* Información básica */}
                <div className="flex-1">
                  <h3 className="text-xl lg:text-2xl font-bold text-[#003366] mb-2 group-hover:text-[#004488] transition-colors">
                    {profesional.nombre}
                  </h3>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-1 bg-[#FF6B35] rounded-full" />
                    <p className="text-[#FF6B35] font-semibold text-sm lg:text-base">
                      {profesional.especialidad}
                    </p>
                  </div>

                  <p className="text-gray-600 text-sm lg:text-base leading-relaxed">
                    {profesional.descripcionCorta}
                  </p>
                </div>

                {/* Botón expandir */}
                <motion.div
                  animate={{ rotate: expandedId === profesional.id ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="shrink-0"
                >
                  <div className="w-10 h-10 bg-[#003366] rounded-full flex items-center justify-center text-white group-hover:bg-[#FF6B35] transition-colors">
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </motion.div>
              </div>

              {/* Contenido expandido */}
              <AnimatePresence>
                {expandedId === profesional.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-gray-200 bg-gradient-to-br from-gray-50 to-white">
                      <div className="p-6 lg:p-8">
                        <div className="grid lg:grid-cols-[2fr_1fr] gap-6 lg:gap-8">
                          {/* Columna Izquierda: Información completa */}
                          <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-6"
                          >
                            {/* Badge de experiencia */}
                            {profesional.experiencia && (
                              <div className="inline-flex items-center gap-2 bg-blue-100 text-[#003366] px-4 py-2 rounded-full text-sm font-semibold">
                                <Award className="w-4 h-4" />
                                {profesional.experiencia} de experiencia
                              </div>
                            )}

                            {/* Descripción completa */}
                            <div className="space-y-3">
                              {profesional.descripcionCompleta. split('\n\n').map((parrafo, idx) => (
                                <motion.p
                                  key={idx}
                                  initial={{ y: 10, opacity: 0 }}
                                  animate={{ y: 0, opacity: 1 }}
                                  transition={{ delay: 0.3 + idx * 0.1 }}
                                  className="text-gray-700 text-sm lg:text-base leading-relaxed"
                                >
                                  {parrafo}
                                </motion.p>
                              ))}
                            </div>

                            {/* Certificaciones */}
                            {profesional.certificaciones && profesional.certificaciones.length > 0 && (
                              <div className="pt-4 border-t border-gray-200">
                                <div className="flex items-center gap-2 mb-4">
                                  <Award className="w-5 h-5 text-[#FF6B35]" />
                                  <h4 className="text-lg font-bold text-[#003366]">
                                    Certificaciones y Formación
                                  </h4>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-2">
                                  {profesional.certificaciones.map((cert, idx) => (
                                    <motion.div
                                      key={idx}
                                      initial={{ x: -10, opacity: 0 }}
                                      animate={{ x: 0, opacity: 1 }}
                                      transition={{ delay: 0.4 + idx * 0.05 }}
                                      className="flex items-start gap-2 text-gray-700 bg-white p-2. 5 rounded-lg border border-gray-100"
                                    >
                                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                      <span className="text-xs lg:text-sm">{cert}</span>
                                    </motion.div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </motion.div>

                          {/* Columna Derecha: Imagen pequeña */}
                          <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="relative"
                          >
                            <div className="sticky top-24">
                              <div className="relative aspect-[3/4] max-w-[280px] mx-auto rounded-2xl overflow-hidden shadow-xl">
                                {/* Imagen del profesional */}
                                <div className="absolute inset-0 bg-gradient-to-br from-[#003366] to-[#0055AA]">
                                  <Image
                                    src={profesional. imagen}
                                    alt={profesional.nombre}
                                    fill
                                    className="object-cover object-center"
                                    sizes="(max-width: 768px) 100vw, 280px"
                                    onError={(e) => {
                                      // Fallback si no hay imagen
                                      const target = e.currentTarget as HTMLImageElement;
                                      target.style.display = 'none';
                                    }}
                                  />
                                </div>

                                {/* Overlay decorativo */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#003366]/60 to-transparent" />

                                {/* Badge con número */}
                                <div className="absolute bottom-4 right-4 w-14 h-14 bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                  {profesional.id}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </motion. div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}