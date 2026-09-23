-- CreateEnum
CREATE TYPE "ServiceMediaType" AS ENUM ('IMAGE', 'VIDEO');

-- CreateTable
CREATE TABLE "ServiceMedia" (
  "id" TEXT NOT NULL,
  "serviceId" TEXT NOT NULL,
  "type" "ServiceMediaType" NOT NULL,
  "url" TEXT NOT NULL,
  "publicId" TEXT NOT NULL,
  "width" INTEGER,
  "height" INTEGER,
  "duration" DOUBLE PRECISION,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ServiceMedia_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ServiceMedia_publicId_key" ON "ServiceMedia"("publicId");
CREATE INDEX "ServiceMedia_serviceId_sortOrder_idx" ON "ServiceMedia"("serviceId", "sortOrder");
ALTER TABLE "ServiceMedia" ADD CONSTRAINT "ServiceMedia_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "CatalogServiceOverride"("serviceId") ON DELETE CASCADE ON UPDATE CASCADE;
