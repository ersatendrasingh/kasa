-- AlterTable
ALTER TABLE "AtsResumeVisitor"
  ADD COLUMN "candidateNameEncrypted" TEXT,
  ADD COLUMN "emailEncrypted" TEXT,
  ADD COLUMN "phoneEncrypted" TEXT;
