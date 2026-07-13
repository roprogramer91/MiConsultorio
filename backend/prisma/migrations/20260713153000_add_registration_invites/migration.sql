-- AlterTable
ALTER TABLE "Patient"
ADD COLUMN "coverageType" TEXT NOT NULL DEFAULT 'private',
ADD COLUMN "insurancePlan" TEXT,
ADD COLUMN "memberNumber" TEXT,
ADD COLUMN "registrationSource" TEXT NOT NULL DEFAULT 'doctor',
ADD COLUMN "reviewStatus" TEXT NOT NULL DEFAULT 'reviewed',
ADD COLUMN "reviewedAt" TIMESTAMP(3),
ADD COLUMN "reviewedBy" TEXT;

-- CreateTable
CREATE TABLE "RegistrationInvite" (
    "id" SERIAL NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "createdBy" TEXT NOT NULL,
    "patientId" INTEGER,

    CONSTRAINT "RegistrationInvite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RegistrationInvite_tokenHash_key" ON "RegistrationInvite"("tokenHash");

-- CreateIndex
CREATE INDEX "RegistrationInvite_status_expiresAt_idx" ON "RegistrationInvite"("status", "expiresAt");

-- AddForeignKey
ALTER TABLE "RegistrationInvite"
ADD CONSTRAINT "RegistrationInvite_patientId_fkey"
FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE SET NULL ON UPDATE CASCADE;
