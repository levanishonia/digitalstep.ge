CREATE TYPE "AIMessageRole" AS ENUM ('USER', 'ASSISTANT');
CREATE TYPE "AIFeature" AS ENUM ('AI_ASSISTANT');

CREATE TABLE "AIConversation" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AIConversation_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "AIMessage" (
  "id" TEXT NOT NULL,
  "conversationId" TEXT NOT NULL,
  "role" "AIMessageRole" NOT NULL,
  "content" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AIMessage_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "AIUsage" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "feature" "AIFeature" NOT NULL,
  "periodKey" TEXT NOT NULL,
  "requestCount" INTEGER NOT NULL DEFAULT 0,
  "reservedCount" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AIUsage_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "AIConversation_userId_updatedAt_idx" ON "AIConversation"("userId", "updatedAt");
CREATE INDEX "AIMessage_conversationId_createdAt_idx" ON "AIMessage"("conversationId", "createdAt");
CREATE UNIQUE INDEX "AIUsage_userId_feature_periodKey_key" ON "AIUsage"("userId", "feature", "periodKey");
ALTER TABLE "AIConversation" ADD CONSTRAINT "AIConversation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AIMessage" ADD CONSTRAINT "AIMessage_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "AIConversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AIUsage" ADD CONSTRAINT "AIUsage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
