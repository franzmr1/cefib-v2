-- CreateEnum
CREATE TYPE "ServicioSolicitud" AS ENUM ('PROYECTOS_PLANES', 'SALUD', 'GESTION_PUBLICA', 'EDUCACION', 'TECNOLOGIA', 'ENERGIA_MINERIA', 'OTRO');

-- CreateEnum
CREATE TYPE "TipoProgramaSolicitud" AS ENUM ('INDIVIDUAL', 'CORPORATIVO');

-- CreateEnum
CREATE TYPE "EstadoSolicitud" AS ENUM ('NUEVO', 'EN_REVISION', 'CONTACTADO', 'EN_NEGOCIACION', 'CERRADO_EXITOSO', 'CERRADO_SIN_EXITO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "PrioridadSolicitud" AS ENUM ('BAJA', 'NORMAL', 'ALTA', 'URGENTE');

-- CreateTable
CREATE TABLE "solicitudes" (
    "id" TEXT NOT NULL,
    "folio" TEXT NOT NULL,
    "nombres" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT,
    "empresa" TEXT,
    "cargo" TEXT,
    "servicioInteres" "ServicioSolicitud" NOT NULL,
    "tipoPrograma" "TipoProgramaSolicitud" NOT NULL DEFAULT 'INDIVIDUAL',
    "numParticipantes" INTEGER,
    "mensaje" TEXT NOT NULL,
    "comoNosConociste" TEXT,
    "estado" "EstadoSolicitud" NOT NULL DEFAULT 'NUEVO',
    "prioridad" "PrioridadSolicitud" NOT NULL DEFAULT 'NORMAL',
    "notasInternas" TEXT,
    "asignadoA" TEXT,
    "ip" TEXT,
    "userAgent" TEXT,
    "origen" TEXT,
    "aceptoTerminos" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "fechaContacto" TIMESTAMP(3),
    "fechaCierre" TIMESTAMP(3),

    CONSTRAINT "solicitudes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "solicitudes_folio_key" ON "solicitudes"("folio");

-- CreateIndex
CREATE INDEX "solicitudes_estado_idx" ON "solicitudes"("estado");

-- CreateIndex
CREATE INDEX "solicitudes_servicioInteres_idx" ON "solicitudes"("servicioInteres");

-- CreateIndex
CREATE INDEX "solicitudes_createdAt_idx" ON "solicitudes"("createdAt");

-- CreateIndex
CREATE INDEX "solicitudes_asignadoA_idx" ON "solicitudes"("asignadoA");

-- AddForeignKey
ALTER TABLE "solicitudes" ADD CONSTRAINT "solicitudes_asignadoA_fkey" FOREIGN KEY ("asignadoA") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
