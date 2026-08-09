CREATE TYPE "BusinessGoal" AS ENUM ('INCREASE_SALES', 'ACQUIRE_CUSTOMERS', 'BRAND_AWARENESS', 'SOCIAL_MEDIA_GROWTH', 'ONLINE_SALES', 'LAUNCH_PRODUCT', 'AUTOMATE_PROCESSES');
CREATE TYPE "SocialPlatform" AS ENUM ('FACEBOOK', 'INSTAGRAM', 'TIKTOK', 'LINKEDIN', 'YOUTUBE', 'GOOGLE', 'OTHER');
CREATE TYPE "BrandTone" AS ENUM ('PROFESSIONAL', 'FRIENDLY', 'PREMIUM', 'PLAYFUL', 'DIRECT', 'EDUCATIONAL');
CREATE TABLE "BusinessProfile" (
  "id" TEXT NOT NULL, "userId" TEXT NOT NULL, "name" TEXT NOT NULL, "industry" TEXT NOT NULL,
  "description" TEXT, "website" TEXT, "locationMarket" TEXT, "productsServices" TEXT, "primaryOffer" TEXT,
  "targetAudience" TEXT, "audienceLocation" TEXT, "customerProblem" TEXT, "goals" "BusinessGoal"[] NOT NULL,
  "brandTone" "BrandTone", "brandToneNotes" TEXT, "preferredContentLanguage" TEXT NOT NULL DEFAULT 'ka',
  "brandValues" TEXT, "socialPlatforms" "SocialPlatform"[] NOT NULL, "competitors" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "BusinessProfile_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "BusinessProfile_userId_key" ON "BusinessProfile"("userId");
ALTER TABLE "BusinessProfile" ADD CONSTRAINT "BusinessProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
