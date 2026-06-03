import prisma from "../prismaClient.js";

function buildPatientData(body) {
  const { name, dni, phone, email, birthDate, notes, obraSocial } = body;
  return {
    name: name?.trim(),
    dni: dni?.trim() || null,
    phone: phone?.trim() || null,
    email: email?.trim() || null,
    birthDate: birthDate ? new Date(birthDate) : null,
    notes: notes?.trim() || null,
    obraSocial: obraSocial?.trim() || null,
  };
}

export const createPatient = async (req, res) => {
  try {
    const patientData = buildPatientData(req.body);

    if (!patientData.name) {
      return res.status(400).json({ error: "El nombre es obligatorio" });
    }

    const newPatient = await prisma.patient.create({ data: patientData });
    res.status(201).json(newPatient);
  } catch (error) {
    console.error("Error al crear paciente:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getPatients = async (req, res) => {
  try {
    const { search } = req.query;

    const patients = await prisma.patient.findMany({
      where: {
        active: true,
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { dni: { contains: search } },
              ],
            }
          : {}),
      },
      orderBy: { name: "asc" },
    });

    res.json(patients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo pacientes" });
  }
};

export const getPatientById = async (req, res) => {
  try {
    const { id } = req.params;

    const patient = await prisma.patient.findUnique({
      where: { id: Number(id) },
    });

    if (!patient) {
      return res.status(404).json({ error: "Paciente no encontrado" });
    }

    res.json(patient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo paciente" });
  }
};

export const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const patientId = Number(id);

    if (Number.isNaN(patientId)) {
      return res.status(400).json({ error: "ID de paciente inválido" });
    }

    const patientData = buildPatientData(req.body);

    if (!patientData.name) {
      return res.status(400).json({ error: "El nombre es obligatorio" });
    }

    const existing = await prisma.patient.findUnique({ where: { id: patientId } });
    if (!existing) {
      return res.status(404).json({ error: "Paciente no encontrado" });
    }

    const updated = await prisma.patient.update({
      where: { id: patientId },
      data: patientData,
    });

    res.json(updated);
  } catch (error) {
    console.error("Error actualizando paciente:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Soft delete: marca el paciente como inactivo (usado por el dashboard)
export const archivePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const patientId = Number(id);

    if (Number.isNaN(patientId)) {
      return res.status(400).json({ error: "ID de paciente inválido" });
    }

    const existing = await prisma.patient.findUnique({ where: { id: patientId } });
    if (!existing) {
      return res.status(404).json({ error: "Paciente no encontrado" });
    }

    const archived = await prisma.patient.update({
      where: { id: patientId },
      data: { active: false },
    });

    res.json(archived);
  } catch (error) {
    console.error("Error archivando paciente:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Hard delete: elimina el paciente y sus turnos (usado por la app móvil)
export const deletePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const patientId = Number(id);

    if (Number.isNaN(patientId)) {
      return res.status(400).json({ error: "ID de paciente inválido" });
    }

    const existing = await prisma.patient.findUnique({ where: { id: patientId } });
    if (!existing) {
      return res.status(404).json({ error: "Paciente no encontrado" });
    }

    const deletedAppointments = await prisma.$transaction(async (tx) => {
      const result = await tx.appointment.deleteMany({ where: { patientId } });
      await tx.clinicalNote.deleteMany({ where: { patientId } });
      await tx.patient.delete({ where: { id: patientId } });
      return result.count;
    });

    res.json({ success: true, deletedAppointments });
  } catch (error) {
    console.error("Error eliminando paciente:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
