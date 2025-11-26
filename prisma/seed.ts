/**
 * Seed Script - Crear usuario SUPER_ADMIN inicial
 * Ejecutar: npx prisma db seed
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // Crear usuario SUPER_ADMIN
  const hashedPassword = await bcrypt.hash('admin123', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@cefib.pe' },
    update: {
      role: 'SUPER_ADMIN', // ✅ Actualiza a SUPER_ADMIN si ya existe
      apellidos: 'CEFIB',   // ✅ Asegura que tenga apellidos
    },
    create: {
      email: 'admin@cefib.pe',
      password: hashedPassword,
      name: 'Administrador',
      apellidos: 'CEFIB',
      role: 'SUPER_ADMIN', // ✅ ROL SUPER_ADMIN
    },
  });

  console. log('✅ Usuario SUPER_ADMIN creado/actualizado:', admin.email);

  // Crear curso de ejemplo (opcional)
  const curso = await prisma.curso.upsert({
    where: { slug: 'curso-gestion-publica' },
    update: {},
    create: {
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

  console. log('✅ Curso de ejemplo creado:', curso.titulo);

  console.log('\n🎉 Seed completado! ');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📧 Email: admin@cefib.pe');
  console.log('🔑 Contraseña: admin123');
  console.log('👑 Rol: SUPER_ADMIN');
  console.log('⚠️  Recuerda cambiar la contraseña después del primer login');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process. exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });