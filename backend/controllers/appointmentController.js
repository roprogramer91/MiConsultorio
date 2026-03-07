import prisma from "../prismaClient.js";


//CREAR TURNO
export const createAppointment = async (req, res) => {
  try {
    const { patientId, date, time, status, notes } = req.body;

    if (!patientId || !date || !time) {
      return res.status(400).json({
        error: "patientId, date y time son obligatorios"
      });
    }

    const existingAppointment = await prisma.appointment.findFirst({
  where: {
    date,
    time
  }
});

if (existingAppointment) {
  return res.status(400).json({
    error: "Ya existe un turno en ese día y horario"
  });
}

    const appointment = await prisma.appointment.create({
      data: {
        patientId,
        date,
        time,
        status,
        notes
      }
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
    const appointments = await prisma.appointment.findMany({
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