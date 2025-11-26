/*
  Warnings:

  - The values [USER] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
ALTER TYPE "EstadoCurso" ADD VALUE 'ARCHIVADO';

-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('ADMIN', 'SUPER_ADMIN');
ALTER TABLE "public"."users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "public"."UserRole_old";
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'ADMIN';
COMMIT;

-- DropForeignKey
ALTER TABLE "cursos" DROP CONSTRAINT "cursos_creadorId_fkey";

-- AlterTable
ALTER TABLE "cursos" ALTER COLUMN "estado" SET DEFAULT 'BORRADOR';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "apellidos" TEXT,
ALTER COLUMN "role" SET DEFAULT 'ADMIN';

-- CreateIndex
CREATE INDEX "cursos_estado_idx" ON "cursos"("estado");

-- CreateIndex
CREATE INDEX "cursos_creadorId_idx" ON "cursos"("creadorId");

-- CreateIndex
CREATE INDEX "cursos_slug_idx" ON "cursos"("slug");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- AddForeignKey
ALTER TABLE "cursos" ADD CONSTRAINT "cursos_creadorId_fkey" FOREIGN KEY ("creadorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
