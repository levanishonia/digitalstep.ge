CREATE TABLE "CatalogServiceOverride" (
  "serviceId" TEXT NOT NULL,
  "titleKa" TEXT NOT NULL,
  "titleEn" TEXT NOT NULL,
  "descriptionKa" TEXT NOT NULL,
  "descriptionEn" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "priceMinor" INTEGER NOT NULL,
  "deliveryDays" INTEGER NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'ACTIVE',
  "packages" JSONB,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "updatedByUserId" TEXT NOT NULL,
  CONSTRAINT "CatalogServiceOverride_pkey" PRIMARY KEY ("serviceId")
);
