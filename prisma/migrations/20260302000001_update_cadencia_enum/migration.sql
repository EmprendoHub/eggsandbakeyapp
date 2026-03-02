-- Add new cadence values to the Cadencia enum
ALTER TYPE "Cadencia" ADD VALUE IF NOT EXISTS 'SEMESTRAL';
ALTER TYPE "Cadencia" ADD VALUE IF NOT EXISTS 'ANUAL';

-- NOTE: PostgreSQL does not support DROP VALUE from an enum.
-- BIMESTRAL is kept in the DB enum for backward compatibility with any existing rows.
-- New plans will only use MENSUAL, TRIMESTRAL, SEMESTRAL, ANUAL.
