-- CreateEnum
CREATE TYPE "TipoDocumento" AS ENUM ('DNI', 'CARNET_EXTRANJERIA', 'PASAPORTE', 'RUC');

-- CreateEnum
CREATE TYPE "EstadoDocente" AS ENUM ('ACTIVO', 'INACTIVO');

-- CreateEnum
CREATE TYPE "EstadoAsignacion" AS ENUM ('ACTIVO', 'FINALIZADO');

-- CreateEnum
CREATE TYPE "EstadoParticipante" AS ENUM ('ACTIVO', 'INACTIVO');

-- CreateEnum
CREATE TYPE "EstadoPago" AS ENUM ('PAGADO', 'PENDIENTE', 'NO_PAGADO');

-- CreateEnum
CREATE TYPE "MetodoPago" AS ENUM ('EFECTIVO', 'TRANSFERENCIA', 'YAPE', 'PLIN', 'TARJETA', 'OTRO');

-- AlterTable
ALTER TABLE "cursos" ADD COLUMN     "cupoActual" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "docentes" (
    "id" TEXT NOT NULL,
    "nombres" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "tipoDocumento" "TipoDocumento" NOT NULL DEFAULT 'DNI',
    "numeroDocumento" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT,
    "celular" TEXT NOT NULL,
    "direccion" TEXT,
    "especialidad" TEXT NOT NULL,
    "experiencia" TEXT,
    "estado" "EstadoDocente" NOT NULL DEFAULT 'ACTIVO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "docentes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "curso_docente" (
    "id" TEXT NOT NULL,
    "cursoId" TEXT NOT NULL,
    "docenteId" TEXT NOT NULL,
    "fechaAsignacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" "EstadoAsignacion" NOT NULL DEFAULT 'ACTIVO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "curso_docente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "participantes" (
    "id" TEXT NOT NULL,
    "nombres" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "tipoDocumento" "TipoDocumento" NOT NULL DEFAULT 'DNI',
    "numeroDocumento" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT,
    "celular" TEXT NOT NULL,
    "direccion" TEXT,
    "estado" "EstadoParticipante" NOT NULL DEFAULT 'ACTIVO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "participantes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inscripciones" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "participanteId" TEXT NOT NULL,
    "cursoId" TEXT NOT NULL,
    "fechaInscripcion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estadoPago" "EstadoPago" NOT NULL DEFAULT 'PENDIENTE',
    "montoPagado" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "fechaPago" TIMESTAMP(3),
    "metodoPago" "MetodoPago",
    "asistio" BOOLEAN NOT NULL DEFAULT false,
    "observaciones" TEXT,
    "registradoPorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inscripciones_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "docentes_numeroDocumento_key" ON "docentes"("numeroDocumento");

-- CreateIndex
CREATE UNIQUE INDEX "docentes_email_key" ON "docentes"("email");

-- CreateIndex
CREATE INDEX "docentes_numeroDocumento_idx" ON "docentes"("numeroDocumento");

-- CreateIndex
CREATE INDEX "docentes_email_idx" ON "docentes"("email");

-- CreateIndex
CREATE INDEX "docentes_estado_idx" ON "docentes"("estado");

-- CreateIndex
CREATE INDEX "curso_docente_cursoId_idx" ON "curso_docente"("cursoId");

-- CreateIndex
CREATE INDEX "curso_docente_docenteId_idx" ON "curso_docente"("docenteId");

-- CreateIndex
CREATE UNIQUE INDEX "curso_docente_cursoId_docenteId_key" ON "curso_docente"("cursoId", "docenteId");

-- CreateIndex
CREATE UNIQUE INDEX "participantes_numeroDocumento_key" ON "participantes"("numeroDocumento");

-- CreateIndex
CREATE UNIQUE INDEX "participantes_email_key" ON "participantes"("email");

-- CreateIndex
CREATE INDEX "participantes_numeroDocumento_idx" ON "participantes"("numeroDocumento");

-- CreateIndex
CREATE INDEX "participantes_email_idx" ON "participantes"("email");

-- CreateIndex
CREATE INDEX "participantes_estado_idx" ON "participantes"("estado");

-- CreateIndex
CREATE UNIQUE INDEX "inscripciones_codigo_key" ON "inscripciones"("codigo");

-- CreateIndex
CREATE INDEX "inscripciones_cursoId_idx" ON "inscripciones"("cursoId");

-- CreateIndex
CREATE INDEX "inscripciones_participanteId_idx" ON "inscripciones"("participanteId");

-- CreateIndex
CREATE INDEX "inscripciones_estadoPago_idx" ON "inscripciones"("estadoPago");

-- CreateIndex
CREATE INDEX "inscripciones_registradoPorId_idx" ON "inscripciones"("registradoPorId");

-- CreateIndex
CREATE UNIQUE INDEX "inscripciones_participanteId_cursoId_key" ON "inscripciones"("participanteId", "cursoId");

-- AddForeignKey
ALTER TABLE "curso_docente" ADD CONSTRAINT "curso_docente_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "cursos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "curso_docente" ADD CONSTRAINT "curso_docente_docenteId_fkey" FOREIGN KEY ("docenteId") REFERENCES "docentes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscripciones" ADD CONSTRAINT "inscripciones_participanteId_fkey" FOREIGN KEY ("participanteId") REFERENCES "participantes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscripciones" ADD CONSTRAINT "inscripciones_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "cursos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscripciones" ADD CONSTRAINT "inscripciones_registradoPorId_fkey" FOREIGN KEY ("registradoPorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
