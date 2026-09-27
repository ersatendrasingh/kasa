-- CreateEnum
CREATE TYPE "AtsCheckStatus" AS ENUM ('COMPLETED', 'UNREADABLE', 'INVALID_INPUT', 'FAILED');

-- CreateTable
CREATE TABLE "AtsResumeVisitor" (
    "id" TEXT NOT NULL,
    "visitorKey" TEXT NOT NULL,
    "firstSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalChecks" INTEGER NOT NULL DEFAULT 0,
    "completedChecks" INTEGER NOT NULL DEFAULT 0,
    "failedChecks" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "AtsResumeVisitor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AtsResumeDocument" (
    "id" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "fingerprint" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL DEFAULT 'text',
    "fileExtension" TEXT,
    "fileSizeBytes" INTEGER,
    "firstSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AtsResumeDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AtsResumeCheck" (
    "id" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "documentId" TEXT,
    "status" "AtsCheckStatus" NOT NULL,
    "atsScore" INTEGER,
    "jobMatchScore" INTEGER,
    "targetRole" TEXT,
    "roleFamily" TEXT,
    "experienceLevel" TEXT,
    "hasJobDescription" BOOLEAN NOT NULL DEFAULT false,
    "fileExtension" TEXT,
    "errorCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AtsResumeCheck_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AtsResumeVisitor_visitorKey_key" ON "AtsResumeVisitor"("visitorKey");
CREATE INDEX "AtsResumeVisitor_lastSeenAt_idx" ON "AtsResumeVisitor"("lastSeenAt");
CREATE INDEX "AtsResumeVisitor_totalChecks_idx" ON "AtsResumeVisitor"("totalChecks");
CREATE UNIQUE INDEX "AtsResumeDocument_visitorId_fingerprint_key" ON "AtsResumeDocument"("visitorId", "fingerprint");
CREATE INDEX "AtsResumeDocument_sourceType_idx" ON "AtsResumeDocument"("sourceType");
CREATE INDEX "AtsResumeDocument_lastSeenAt_idx" ON "AtsResumeDocument"("lastSeenAt");
CREATE INDEX "AtsResumeCheck_createdAt_idx" ON "AtsResumeCheck"("createdAt");
CREATE INDEX "AtsResumeCheck_status_createdAt_idx" ON "AtsResumeCheck"("status", "createdAt");
CREATE INDEX "AtsResumeCheck_visitorId_createdAt_idx" ON "AtsResumeCheck"("visitorId", "createdAt");
CREATE INDEX "AtsResumeCheck_documentId_createdAt_idx" ON "AtsResumeCheck"("documentId", "createdAt");
CREATE INDEX "AtsResumeCheck_targetRole_idx" ON "AtsResumeCheck"("targetRole");

-- AddForeignKey
ALTER TABLE "AtsResumeDocument" ADD CONSTRAINT "AtsResumeDocument_visitorId_fkey" FOREIGN KEY ("visitorId") REFERENCES "AtsResumeVisitor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AtsResumeCheck" ADD CONSTRAINT "AtsResumeCheck_visitorId_fkey" FOREIGN KEY ("visitorId") REFERENCES "AtsResumeVisitor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AtsResumeCheck" ADD CONSTRAINT "AtsResumeCheck_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "AtsResumeDocument"("id") ON DELETE SET NULL ON UPDATE CASCADE;
