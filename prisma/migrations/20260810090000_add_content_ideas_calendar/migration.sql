ALTER TYPE "AIFeature" ADD VALUE 'CONTENT_IDEAS';
ALTER TYPE "ContentSource" ADD VALUE 'AI_CONTENT_IDEA';
ALTER TABLE "ContentItem" ADD COLUMN "notes" TEXT;
CREATE INDEX "ContentItem_userId_status_idx" ON "ContentItem"("userId", "status");
