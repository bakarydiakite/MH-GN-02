-- AlterTable: position GPS à l'enregistrement (visibilité superviseur / carte)
ALTER TABLE "naissances" ADD COLUMN IF NOT EXISTS "enregistrement_latitude" DOUBLE PRECISION;
ALTER TABLE "naissances" ADD COLUMN IF NOT EXISTS "enregistrement_longitude" DOUBLE PRECISION;
ALTER TABLE "naissances" ADD COLUMN IF NOT EXISTS "enregistrement_precision_m" DOUBLE PRECISION;
ALTER TABLE "naissances" ADD COLUMN IF NOT EXISTS "enregistrement_capture_le" TIMESTAMP(3);
