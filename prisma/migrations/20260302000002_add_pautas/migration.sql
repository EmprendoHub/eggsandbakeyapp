-- Add PAUTA to PublicacionTipo enum
ALTER TYPE "PublicacionTipo" ADD VALUE IF NOT EXISTS 'PAUTA';

-- Add pautasCount to ContentPlan
ALTER TABLE "ContentPlan" ADD COLUMN IF NOT EXISTS "pautasCount" INTEGER NOT NULL DEFAULT 0;
