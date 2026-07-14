import crypto from "node:crypto";
import prisma from "../prismaClient.js";

const INVITE_DURATION_MS = 30 * 60 * 1000;
const VALID_TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/;

function clean(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeDni(value) {
  return clean(value).replace(/\D/g, "");
}

function normalizePhone(value) {
  return clean(value).replace(/[^\d+]/g, "");
}

function normalizeEmail(value) {
  return clean(value).toLowerCase();
}

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function publicInviteStatus(invite, now = new Date()) {
  if (!invite || invite.status === "revoked") return "unavailable";
  if (invite.status === "used") return "used";
  if (invite.status === "expired" || invite.expiresAt <= now) return "expired";
  return invite.status === "pending" ? "valid" : "unavailable";
}

function validateRegistration(body) {
  const firstName = clean(body.firstName);
  const lastName = clean(body.lastName);
  const dni = normalizeDni(body.dni);
  const phone = normalizePhone(body.phone);
  const email = normalizeEmail(body.email) || null;
  const coverageType = clean(body.coverageType).toLowerCase();
  const obraSocial = clean(body.obraSocial) || null;
  const insurancePlan = clean(body.insurancePlan) || null;
  const memberNumber = clean(body.memberNumber) || null;
  const birthDate = new Date(body.birthDate);
  const errors = {};

  if (!firstName) errors.firstName = "El nombre es obligatorio";
  if (!lastName) errors.lastName = "El apellido es obligatorio";
  if (dni.length < 7 || dni.length > 9) errors.dni = "Ingresá un DNI válido";
  if (Number.isNaN(birthDate.getTime()) || birthDate > new Date()) {
    errors.birthDate = "Ingresá una fecha de nacimiento válida";
  }
  if (phone.replace(/\D/g, "").length < 8) errors.phone = "Ingresá un teléfono válido";
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Ingresá un correo válido";
  }
  if (!["private", "insurance"].includes(coverageType)) {
    errors.coverageType = "Seleccioná Particular u Obra social";
  }
  if (coverageType === "insurance") {
    if (!obraSocial) errors.obraSocial = "La obra social es obligatoria";
    if (!memberNumber) errors.memberNumber = "El número de afiliado es obligatorio";
  }

  return {
    errors,
    data: {
      firstName,
      lastName,
      name: `${firstName} ${lastName}`.trim(),
      dni,
      phone,
      email,
      birthDate,
      coverageType,
      obraSocial: coverageType === "insurance" ? obraSocial : null,
      insurancePlan: coverageType === "insurance" ? insurancePlan : null,
      memberNumber: coverageType === "insurance" ? memberNumber : null,
    },
  };
}

export async function createRegistrationInvite(req, res) {
  try {
    const token = crypto.randomBytes(32).toString("base64url");
    const expiresAt = new Date(Date.now() + INVITE_DURATION_MS);
    const invite = await prisma.registrationInvite.create({
      data: {
        tokenHash: hashToken(token),
        expiresAt,
        createdBy: req.user.uid || req.user.email || "doctor",
      },
    });
    const baseUrl = process.env.REGISTRATION_FORM_URL?.replace(/\/+$/, "");
    const registrationPath = `/registro/${token}`;

    return res.status(201).json({
      id: invite.id,
      status: invite.status,
      createdAt: invite.createdAt,
      expiresAt: invite.expiresAt,
      registrationPath,
      registrationUrl: baseUrl ? `${baseUrl}${registrationPath}` : null,
    });
  } catch (error) {
    console.error("Error creando invitación:", error);
    return res.status(500).json({ error: "No se pudo generar el enlace" });
  }
}

export async function listRegistrationInvites(_req, res) {
  try {
    const now = new Date();
    await prisma.registrationInvite.updateMany({
      where: { status: "pending", expiresAt: { lte: now } },
      data: { status: "expired" },
    });
    const invites = await prisma.registrationInvite.findMany({
      select: {
        id: true,
        status: true,
        createdAt: true,
        expiresAt: true,
        usedAt: true,
        revokedAt: true,
        patientId: true,
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return res.json(invites);
  } catch (error) {
    console.error("Error listando invitaciones:", error);
    return res.status(500).json({ error: "No se pudieron obtener los enlaces" });
  }
}

export async function listRegistrationReviews(_req, res) {
  try {
    const submissions = await prisma.registrationSubmission.findMany({
      where: { status: { in: ["pending", "duplicate_review"] } },
      orderBy: { createdAt: "desc" },
    });
    const duplicateIds = [...new Set(
      submissions.map((item) => item.possibleDuplicatePatientId).filter(Boolean),
    )];
    const duplicatePatients = duplicateIds.length
      ? await prisma.patient.findMany({
          where: { id: { in: duplicateIds }, active: true },
          select: { id: true, name: true, dni: true, phone: true, birthDate: true },
        })
      : [];
    const duplicatesById = new Map(duplicatePatients.map((patient) => [patient.id, patient]));
    return res.json(submissions.map((submission) => ({
      ...submission,
      possibleDuplicate: submission.possibleDuplicatePatientId
        ? duplicatesById.get(submission.possibleDuplicatePatientId) || null
        : null,
    })));
  } catch (error) {
    console.error("Error listando registros pendientes:", error);
    return res.status(500).json({ error: "No se pudieron obtener los registros pendientes" });
  }
}

export async function reviewRegistration(req, res) {
  const submissionId = Number(req.params.submissionId);
  if (!Number.isInteger(submissionId)) return res.status(400).json({ error: "ID inválido" });

  try {
    const submission = await prisma.registrationSubmission.findFirst({
      where: { id: submissionId, status: { in: ["pending", "duplicate_review"] } },
    });
    if (!submission) {
      return res.status(404).json({ error: "Registro pendiente no encontrado" });
    }

    const candidate = {
      firstName: req.body?.firstName ?? submission.firstName,
      lastName: req.body?.lastName ?? submission.lastName,
      dni: req.body?.dni ?? submission.dni,
      phone: req.body?.phone ?? submission.phone,
      email: req.body?.email ?? submission.email,
      birthDate: req.body?.birthDate ?? submission.birthDate,
      coverageType: req.body?.coverageType ?? submission.coverageType,
      obraSocial: req.body?.obraSocial ?? submission.obraSocial,
      insurancePlan: req.body?.insurancePlan ?? submission.insurancePlan,
      memberNumber: req.body?.memberNumber ?? submission.memberNumber,
    };
    const { errors, data } = validateRegistration(candidate);
    if (Object.keys(errors).length > 0) return res.status(400).json({ errors });

    const reviewedAt = new Date();
    const reviewedBy = req.user.uid || req.user.email || "doctor";
    const patient = await prisma.$transaction(async (tx) => {
      const claimed = await tx.registrationSubmission.updateMany({
        where: { id: submissionId, status: { in: ["pending", "duplicate_review"] } },
        data: { status: "approving" },
      });
      if (claimed.count !== 1) {
        const conflict = new Error("REVIEW_CONFLICT");
        conflict.code = "REVIEW_CONFLICT";
        throw conflict;
      }

      const duplicate = await tx.patient.findFirst({
        where: {
          dni: data.dni,
          active: true,
          ...(submission.patientId ? { id: { not: submission.patientId } } : {}),
        },
        select: { id: true, name: true },
      });
      if (duplicate && !req.body?.allowDuplicate) {
        const conflict = new Error("DUPLICATE_PATIENT");
        conflict.code = "DUPLICATE_PATIENT";
        conflict.duplicate = duplicate;
        throw conflict;
      }

      const { firstName: _firstName, lastName: _lastName, ...patientData } = data;
      const approvedPatient = submission.patientId
        ? await tx.patient.update({
            where: { id: submission.patientId },
            data: {
              ...patientData,
              active: true,
              registrationSource: "self_service",
              reviewStatus: "reviewed",
              reviewedAt,
              reviewedBy,
            },
          })
        : await tx.patient.create({
            data: {
              ...patientData,
              registrationSource: "self_service",
              reviewStatus: "reviewed",
              reviewedAt,
              reviewedBy,
            },
          });

      await tx.registrationSubmission.update({
        where: { id: submissionId },
        data: {
          ...candidate,
          birthDate: data.birthDate,
          status: "approved",
          patientId: approvedPatient.id,
          reviewedAt,
          reviewedBy,
        },
      });
      await tx.registrationInvite.update({
        where: { id: submission.inviteId },
        data: { patientId: approvedPatient.id },
      });
      return approvedPatient;
    });
    return res.json(patient);
  } catch (error) {
    if (error.code === "DUPLICATE_PATIENT") {
      await prisma.registrationSubmission.updateMany({
        where: { id: submissionId, status: { in: ["pending", "duplicate_review"] } },
        data: {
          status: "duplicate_review",
          possibleDuplicatePatientId: error.duplicate.id,
        },
      }).catch((updateError) => {
        console.error("Error marcando posible duplicado:", updateError);
      });
      return res.status(409).json({
        error: "Ya existe un paciente activo con ese DNI",
        code: error.code,
        duplicate: error.duplicate,
      });
    }
    if (error.code === "REVIEW_CONFLICT") {
      return res.status(409).json({ error: "Este registro ya fue revisado" });
    }
    console.error("Error revisando registro:", error);
    return res.status(500).json({ error: "No se pudo marcar el registro como revisado" });
  }
}

export async function rejectRegistration(req, res) {
  const submissionId = Number(req.params.submissionId);
  if (!Number.isInteger(submissionId)) return res.status(400).json({ error: "ID inválido" });

  try {
    const reviewedAt = new Date();
    const reviewedBy = req.user.uid || req.user.email || "doctor";
    const result = await prisma.registrationSubmission.updateMany({
      where: { id: submissionId, status: { in: ["pending", "duplicate_review"] } },
      data: { status: "rejected", reviewedAt, reviewedBy },
    });
    if (result.count !== 1) {
      return res.status(409).json({ error: "Esta solicitud ya fue procesada" });
    }
    return res.json({ id: submissionId, status: "rejected", reviewedAt });
  } catch (error) {
    console.error("Error rechazando registro:", error);
    return res.status(500).json({ error: "No se pudo rechazar la solicitud" });
  }
}

export async function linkRegistrationToPatient(req, res) {
  const submissionId = Number(req.params.submissionId);
  const requestedPatientId = Number(req.body?.patientId);
  if (!Number.isInteger(submissionId) || !Number.isInteger(requestedPatientId)) {
    return res.status(400).json({ error: "Solicitud o paciente inválido" });
  }

  try {
    const reviewedAt = new Date();
    const reviewedBy = req.user.uid || req.user.email || "doctor";
    const patient = await prisma.$transaction(async (tx) => {
      const submission = await tx.registrationSubmission.findFirst({
        where: { id: submissionId, status: "duplicate_review" },
      });
      if (!submission) {
        const conflict = new Error("REVIEW_CONFLICT");
        conflict.code = "REVIEW_CONFLICT";
        throw conflict;
      }

      const existingPatient = await tx.patient.findFirst({
        where: { id: requestedPatientId, active: true },
      });
      if (!existingPatient) {
        const missing = new Error("PATIENT_NOT_FOUND");
        missing.code = "PATIENT_NOT_FOUND";
        throw missing;
      }

      const claimed = await tx.registrationSubmission.updateMany({
        where: { id: submissionId, status: "duplicate_review" },
        data: {
          status: "linked",
          patientId: existingPatient.id,
          reviewedAt,
          reviewedBy,
        },
      });
      if (claimed.count !== 1) {
        const conflict = new Error("REVIEW_CONFLICT");
        conflict.code = "REVIEW_CONFLICT";
        throw conflict;
      }
      await tx.registrationInvite.update({
        where: { id: submission.inviteId },
        data: { patientId: existingPatient.id },
      });
      return existingPatient;
    });
    return res.json(patient);
  } catch (error) {
    if (error.code === "REVIEW_CONFLICT") {
      return res.status(409).json({ error: "Esta solicitud ya fue procesada" });
    }
    if (error.code === "PATIENT_NOT_FOUND") {
      return res.status(404).json({ error: "El paciente existente ya no está disponible" });
    }
    console.error("Error vinculando registro:", error);
    return res.status(500).json({ error: "No se pudo vincular la solicitud" });
  }
}

export async function revokeRegistrationInvite(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "ID inválido" });

  try {
    const revokedAt = new Date();
    const result = await prisma.registrationInvite.updateMany({
      where: { id, status: "pending", expiresAt: { gt: revokedAt } },
      data: { status: "revoked", revokedAt },
    });
    if (result.count === 0) {
      return res.status(409).json({ error: "El enlace ya no puede revocarse" });
    }
    return res.json({ id, status: "revoked", revokedAt });
  } catch (error) {
    console.error("Error revocando invitación:", error);
    return res.status(500).json({ error: "No se pudo revocar el enlace" });
  }
}

export async function getPublicRegistrationStatus(req, res) {
  const { token } = req.params;
  if (!VALID_TOKEN_PATTERN.test(token)) return res.json({ status: "unavailable" });

  try {
    const invite = await prisma.registrationInvite.findUnique({
      where: { tokenHash: hashToken(token) },
      select: { status: true, expiresAt: true },
    });
    const status = publicInviteStatus(invite);
    return res.json({
      status,
      expiresAt: status === "valid" ? invite.expiresAt : undefined,
    });
  } catch (error) {
    console.error("Error validando invitación:", error);
    return res.status(500).json({ error: "No se pudo validar el enlace" });
  }
}

export async function submitPublicRegistration(req, res) {
  const { token } = req.params;
  if (!VALID_TOKEN_PATTERN.test(token)) return res.status(410).json({ status: "unavailable" });

  const { errors, data } = validateRegistration(req.body || {});
  if (Object.keys(errors).length > 0) return res.status(400).json({ errors });

  try {
    const now = new Date();
    const tokenHash = hashToken(token);
    const submission = await prisma.$transaction(async (tx) => {
      const invite = await tx.registrationInvite.findUnique({ where: { tokenHash } });
      const status = publicInviteStatus(invite, now);
      if (status !== "valid") {
        const unavailable = new Error(status);
        unavailable.code = "INVITE_UNAVAILABLE";
        throw unavailable;
      }

      const claimed = await tx.registrationInvite.updateMany({
        where: { id: invite.id, status: "pending", expiresAt: { gt: now } },
        data: { status: "used", usedAt: now },
      });
      if (claimed.count !== 1) {
        const unavailable = new Error("used");
        unavailable.code = "INVITE_UNAVAILABLE";
        throw unavailable;
      }

      const possibleDuplicate = await tx.patient.findFirst({
        where: { dni: data.dni, active: true },
        select: { id: true },
      });
      const created = await tx.registrationSubmission.create({
        data: {
          inviteId: invite.id,
          firstName: data.firstName,
          lastName: data.lastName,
          dni: data.dni,
          phone: data.phone,
          email: data.email,
          birthDate: data.birthDate,
          coverageType: data.coverageType,
          obraSocial: data.obraSocial,
          insurancePlan: data.insurancePlan,
          memberNumber: data.memberNumber,
          status: possibleDuplicate ? "duplicate_review" : "pending",
          possibleDuplicatePatientId: possibleDuplicate?.id || null,
        },
      });
      return created;
    });

    return res.status(201).json({
      registration: {
        id: submission.id,
        name: `${submission.firstName} ${submission.lastName}`,
        coverageType: submission.coverageType,
      },
      message: "Tus datos se registraron correctamente. La Dra. Adriana los revisará y confirmará tu turno por WhatsApp.",
    });
  } catch (error) {
    if (error.code === "INVITE_UNAVAILABLE") {
      return res.status(410).json({ status: error.message });
    }
    console.error("Error registrando paciente:", error);
    return res.status(500).json({ error: "No se pudo completar el registro" });
  }
}
