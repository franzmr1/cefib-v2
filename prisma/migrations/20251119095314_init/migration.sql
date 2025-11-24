-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "EstadoCurso" AS ENUM ('ACTIVO', 'INACTIVO', 'BORRADOR');

-- CreateEnum
CREATE TYPE "Modalidad" AS ENUM ('PRESENCIAL', 'VIRTUAL', 'HIBRIDO');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cursos" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "descripcion" TEXT,
    "descripcionBreve" TEXT,
    "imagenUrl" TEXT,
    "fechaInicio" TIMESTAMP(3),
    "fechaFin" TIMESTAMP(3),
    "duracionHoras" INTEGER NOT NULL DEFAULT 0,
    "modalidad" "Modalidad" NOT NULL DEFAULT 'VIRTUAL',
    "certificado" BOOLEAN NOT NULL DEFAULT true,
    "precio" DOUBLE PRECISION,
    "cupoMaximo" INTEGER,
    "estado" "EstadoCurso" NOT NULL DEFAULT 'ACTIVO',
    "creadorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cursos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "cursos_slug_key" ON "cursos"("slug");

-- AddForeignKey
ALTER TABLE "cursos" ADD CONSTRAINT "cursos_creadorId_fkey" FOREIGN KEY ("creadorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
