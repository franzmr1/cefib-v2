/**
 * Seed Script - Crear usuario admin inicial
 * Ejecutar: npx prisma db seed
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // Crear usuario admin
  const hashedPassword = await bcrypt.hash('admin123', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@cefib.pe' },
    update: {},
    create: {
      email: 'admin@cefib.pe',
      password: hashedPassword,
      name: 'Administrador CEFIB',
      role: 'ADMIN',
    },
  });

  console.log('✅ Usuario admin creado:', admin.email);

  // Crear curso de ejemplo (opcional)
  const curso = await prisma.curso.create({
    data: {
      titulo: 'Curso de Gestión Pública',
      slug: 'curso-gestion-publica',
      descripcionBreve: 'Aprende gestión pública moderna',
      descripcion: 'Curso completo de gestión pública con enfoque práctico',
      duracionHoras: 40,
      modalidad: 'VIRTUAL',
      certificado: true,
      precio: 150.00,
      estado: 'ACTIVO',
      creadorId: admin.id,
    },
  });

  console.log('✅ Curso de ejemplo creado:', curso.titulo);
  console.log('🎉 Seed completado!');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });