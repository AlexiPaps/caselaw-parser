-- CreateTable
CREATE TABLE "CaseLaw" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "decisionType" TEXT NOT NULL,
    "dateOfDecision" TIMESTAMP(3) NOT NULL,
    "office" TEXT NOT NULL,
    "court" TEXT NOT NULL,
    "caseNumber" INTEGER NOT NULL,
    "summary" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CaseLaw_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CaseLaw_caseNumber_dateOfDecision_idx" ON "CaseLaw"("caseNumber", "dateOfDecision");
