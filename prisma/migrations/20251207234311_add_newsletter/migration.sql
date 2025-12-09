-- CreateTable
CREATE TABLE "newsletter" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "ip" TEXT,
    "userAgent" TEXT,
    "origen" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "newsletter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "newsletter_email_key" ON "newsletter"("email");

-- CreateIndex
CREATE INDEX "newsletter_email_idx" ON "newsletter"("email");

-- CreateIndex
CREATE INDEX "newsletter_activo_idx" ON "newsletter"("activo");

-- CreateIndex
CREATE INDEX "newsletter_createdAt_idx" ON "newsletter"("createdAt");
