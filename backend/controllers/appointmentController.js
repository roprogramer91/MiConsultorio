import prisma from "../prismaClient.js";

function normalizeAppointmentData(body) {
  const { patientId, date, time, status, notes } = body;

  return {
    patientId: patientId ? Number(patientId) : undefined,
    date: date?.trim(),
    time: time?.trim(),
    status: status?.trim() || "pendiente",
    notes: notes?.trim() || null,
  };
}

async function ensureAppointmentSlotAvailable({ date, time, excludeId }) {
  const existingAppointment = await prisma.appointment.findFirst({
    where: {
      date,
      time,
      ...(excludeId ? { id: { not: excludeId } } : {}),
    },
  });

  return !existingAppointment;
}


//CREAR TURNO
export const createAppointment = async (req, res) => {
  try {
    const appointmentData = normalizeAppointmentData(req.body);

    if (!appointmentData.patientId || !appointmentData.date || !appointmentData.time) {
      return res.status(400).json({
        error: "patientId, date y time son obligatorios"
      });
    }

    const slotAvailable = await ensureAppointmentSlotAvailable({
      date: appointmentData.date,
      time: appointmentData.time,
    });

    if (!slotAvailable) {
      return res.status(400).json({
        error: "Ya existe un turno en ese día y horario"
      });
    }

    const appointment = await prisma.appointment.create({
      data: appointmentData
    });

    res.status(201).json(appointment);

  } catch (error) {
    console.error("Error creando turno:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

//OBTENER TURNOS POR FECHA
export const getAppointmentsByDate = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        error: "Debes enviar una fecha",
      });
    }

    const appointments = await prisma.appointment.findMany({
      where: {
        date: date,
      },
      include: {
        patient: true,
      },
      orderBy: {
        time: "asc",
      },
    });

    res.json(appointments);
  } catch (error) {
    console.error("Error obteniendo turnos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

//OBTENER TURNOS POR PACIENTE
export const getAppointmentsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;

    const appointments = await prisma.appointment.findMany({
      where: {
        patientId: Number(patientId),
      },
      orderBy: [
        { date: "desc" },
        { time: "desc" }
      ],
    });

    res.json(appointments);
  } catch (error) {
    console.error("Error obteniendo historial del paciente:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const appointmentId = Number(id);

    if (Number.isNaN(appointmentId)) {
      return res.status(400).json({ error: "ID de turno invalido" });
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        patient: true,
      },
    });

    if (!appointment) {
      return res.status(404).json({ error: "Turno no encontrado" });
    }

    res.json(appointment);
  } catch (error) {
    console.error("Error obteniendo turno:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const appointmentId = Number(id);

    if (Number.isNaN(appointmentId)) {
      return res.status(400).json({ error: "ID de turno invalido" });
    }

    const appointmentData = normalizeAppointmentData(req.body);

    if (!appointmentData.patientId || !appointmentData.date || !appointmentData.time) {
      return res.status(400).json({
        error: "patientId, date y time son obligatorios"
      });
    }

    const existingAppointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!existingAppointment) {
      return res.status(404).json({ error: "Turno no encontrado" });
    }

    const slotAvailable = await ensureAppointmentSlotAvailable({
      date: appointmentData.date,
      time: appointmentData.time,
      excludeId: appointmentId,
    });

    if (!slotAvailable) {
      return res.status(400).json({
        error: "Ya existe un turno en ese día y horario"
      });
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: appointmentData,
      include: {
        patient: true,
      },
    });

    res.json(updatedAppointment);
  } catch (error) {
    console.error("Error actualizando turno:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

//ACTUALIZAR ESTADO DEL TURNO   
export const updateAppointmentStatus = async (req, res) => {
  try {

    const { id } = req.params;
    const { status } = req.body;

    const appointment = await prisma.appointment.update({
      where: {
        id: Number(id)
      },
      data: {
        status
      }
    });

    res.json(appointment);

  } catch (error) {

    console.error("Error actualizando turno:", error);

    res.status(500).json({
      error: "Error actualizando turno"
    });

  }
};

//OBTENER TODOS LOS TURNOS 
export const getUpcomingAppointments = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const appointments = await prisma.appointment.findMany({
      where: {
        date: {
          gte: today,
        },
      },
      include: {
        patient: true,
      },
      orderBy: [
        { date: "asc" },
        { time: "asc" }
      ],
    });

    res.json(appointments);
  } catch (error) {
    console.error("Error obteniendo próximos turnos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
