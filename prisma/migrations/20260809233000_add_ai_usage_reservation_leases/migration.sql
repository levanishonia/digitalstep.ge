CREATE TABLE "AIUsageReservation" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "feature" "AIFeature" NOT NULL,
  "periodKey" TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AIUsageReservation_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AIUsageReservation_userId_feature_periodKey_expiresAt_idx"
  ON "AIUsageReservation"("userId", "feature", "periodKey", "expiresAt");
CREATE INDEX "AIUsageReservation_expiresAt_idx" ON "AIUsageReservation"("expiresAt");

ALTER TABLE "AIUsageReservation" ADD CONSTRAINT "AIUsageReservation_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "AIUsage" DROP COLUMN "reservedCount";
