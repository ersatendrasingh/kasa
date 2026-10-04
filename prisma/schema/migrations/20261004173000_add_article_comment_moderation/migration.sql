-- CreateEnum
CREATE TYPE "ArticleCommentStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "ArticleComment"
ADD COLUMN "parentId" TEXT,
ADD COLUMN "status" "ArticleCommentStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN "moderatedAt" TIMESTAMP(3),
ADD COLUMN "moderatedById" TEXT;

-- CreateIndex
CREATE INDEX "ArticleComment_articleId_parentId_status_createdAt_idx" ON "ArticleComment"("articleId", "parentId", "status", "createdAt");
CREATE INDEX "ArticleComment_status_createdAt_idx" ON "ArticleComment"("status", "createdAt");
CREATE INDEX "ArticleComment_moderatedById_idx" ON "ArticleComment"("moderatedById");

-- AddForeignKey
ALTER TABLE "ArticleComment" ADD CONSTRAINT "ArticleComment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ArticleComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ArticleComment" ADD CONSTRAINT "ArticleComment_moderatedById_fkey" FOREIGN KEY ("moderatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
