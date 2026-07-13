-- CreateTable
CREATE TABLE "RegistrationSubmission" (
    "id" SERIAL NOT NULL,
    "inviteId" INTEGER NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "dni" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "coverageType" TEXT NOT NULL,
    "obraSocial" TEXT,
    "insurancePlan" TEXT,
    "memberNumber" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "possibleDuplicatePatientId" INTEGER,
    "patientId" INTEGER,
    "reviewedAt" TIMESTAMP(3),
    "reviewedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RegistrationSubmission_pkey" PRIMARY KEY ("id")
);

-- Preserve self-service records created by the first development iteration as pending submissions.
INSERT INTO "RegistrationSubmission" (
    "inviteId", "firstName", "lastName", "dni", "phone", "email", "birthDate",
    "coverageType", "obraSocial", "insurancePlan", "memberNumber", "status",
    "patientId", "createdAt"
)
SELECT
    i."id",
    split_part(p."name", ' ', 1),
    CASE
        WHEN position(' ' in p."name") > 0 THEN substring(p."name" from position(' ' in p."name") + 1)
        ELSE '-'
    END,
    COALESCE(p."dni", ''),
    COALESCE(p."phone", ''),
    p."email",
    COALESCE(p."birthDate", p."createdAt"),
    p."coverageType",
    p."obraSocial",
    p."insurancePlan",
    p."memberNumber",
    'pending',
    p."id",
    p."createdAt"
FROM "Patient" p
JOIN "RegistrationInvite" i ON i."patientId" = p."id"
WHERE p."registrationSource" = 'self_service'
  AND p."reviewStatus" IN ('pending', 'duplicate_review')
ON CONFLICT DO NOTHING;

-- Pending submissions must not appear as active patients before medical review.
UPDATE "Patient" p
SET "active" = false
WHERE EXISTS (
    SELECT 1 FROM "RegistrationSubmission" s WHERE s."patientId" = p."id" AND s."status" = 'pending'
);

-- CreateIndex
CREATE UNIQUE INDEX "RegistrationSubmission_inviteId_key" ON "RegistrationSubmission"("inviteId");

-- CreateIndex
CREATE INDEX "RegistrationSubmission_status_createdAt_idx" ON "RegistrationSubmission"("status", "createdAt");

-- AddForeignKey
ALTER TABLE "RegistrationSubmission"
ADD CONSTRAINT "RegistrationSubmission_inviteId_fkey"
FOREIGN KEY ("inviteId") REFERENCES "RegistrationInvite"("id") ON DELETE CASCADE ON UPDATE CASCADE;
