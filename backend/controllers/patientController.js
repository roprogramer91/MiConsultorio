import prisma from "../prismaClient.js";

export const createPatient = async (req, res) => {
  try {
    const { name, phone, email, notes } = req.body;

    if (!name) {
      return res.status(400).json({ error: "El nombre es obligatorio" });
    }

    const newPatient = await prisma.patient.create({
      data: {
        name,
        phone,
        email,
        notes,
      },
    });

    res.status(201).json(newPatient);
  } catch (error) {
    console.error("Error al crear paciente:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getPatients = async (req, res) => {
  try {

    const patients = await prisma.patient.findMany({
      orderBy: {
        name: "asc"
      }
    });

    res.json(patients);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error obteniendo pacientes"
    });

  }
};

export const getPatientById = async (req, res) => {
  try {
    const { id } = req.params;

    const patient = await prisma.patient.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!patient) {
      return res.status(404).json({
        error: "Paciente no encontrado",
      });
    }

    res.json(patient);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error obteniendo paciente",
    });
  }
};