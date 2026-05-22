/*
  Warnings:

  - The values [BIMESTRAL] on the enum `Cadencia` will be removed. If these variants are still used in the database, this will fail.
  - The values [PUBLICADO] on the enum `PublicacionEstado` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "WorkOrderStatus" AS ENUM ('PENDIENTE', 'EN_PROCESO', 'COMPLETADA');

-- AlterEnum
BEGIN;
CREATE TYPE "Cadencia_new" AS ENUM ('MENSUAL', 'TRIMESTRAL', 'SEMESTRAL', 'ANUAL');
ALTER TABLE "ContentPlan" ALTER COLUMN "cadence" TYPE "Cadencia_new" USING ("cadence"::text::"Cadencia_new");
ALTER TYPE "Cadencia" RENAME TO "Cadencia_old";
ALTER TYPE "Cadencia_new" RENAME TO "Cadencia";
DROP TYPE "Cadencia_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "PublicacionEstado_new" AS ENUM ('PENDIENTE', 'EN_PROCESO', 'COMPLETADA');
ALTER TABLE "Publication" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Publication" ALTER COLUMN "status" TYPE "PublicacionEstado_new" USING ("status"::text::"PublicacionEstado_new");
ALTER TYPE "PublicacionEstado" RENAME TO "PublicacionEstado_old";
ALTER TYPE "PublicacionEstado_new" RENAME TO "PublicacionEstado";
DROP TYPE "PublicacionEstado_old";
ALTER TABLE "Publication" ALTER COLUMN "status" SET DEFAULT 'PENDIENTE';
COMMIT;

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'AGENTE';

-- AlterTable
ALTER TABLE "ContentPlan" ADD COLUMN     "pautaMonto" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Publication" ADD COLUMN     "assignedAgentId" TEXT,
ADD COLUMN     "contentUrl" TEXT,
ADD COLUMN     "monto" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "clientId" TEXT,
    "publicationId" TEXT,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readAt" TIMESTAMP(3),

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublicationHistory" (
    "id" TEXT NOT NULL,
    "publicationId" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "fromStatus" "PublicacionEstado",
    "toStatus" "PublicacionEstado",
    "fromAgentId" TEXT,
    "toAgentId" TEXT,
    "contentUrl" TEXT,
    "title" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PublicationHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkOrder" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "publicationType" "PublicacionTipo" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "status" "WorkOrderStatus" NOT NULL DEFAULT 'PENDIENTE',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkOrder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_clientId_idx" ON "Notification"("clientId");

-- CreateIndex
CREATE INDEX "Notification_publicationId_idx" ON "Notification"("publicationId");

-- CreateIndex
CREATE INDEX "PublicationHistory_publicationId_idx" ON "PublicationHistory"("publicationId");

-- CreateIndex
CREATE INDEX "PublicationHistory_userId_idx" ON "PublicationHistory"("userId");

-- CreateIndex
CREATE INDEX "WorkOrder_agentId_idx" ON "WorkOrder"("agentId");

-- CreateIndex
CREATE INDEX "WorkOrder_clientId_idx" ON "WorkOrder"("clientId");

-- CreateIndex
CREATE INDEX "Publication_assignedAgentId_idx" ON "Publication"("assignedAgentId");

-- AddForeignKey
ALTER TABLE "Publication" ADD CONSTRAINT "Publication_assignedAgentId_fkey" FOREIGN KEY ("assignedAgentId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "Publication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicationHistory" ADD CONSTRAINT "PublicationHistory_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "Publication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicationHistory" ADD CONSTRAINT "PublicationHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkOrder" ADD CONSTRAINT "WorkOrder_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkOrder" ADD CONSTRAINT "WorkOrder_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
