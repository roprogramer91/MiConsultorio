import prisma from "../prismaClient.js";

export const getStats = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const [totalPatients, todayCount, nextAppointment] = await Promise.all([
      prisma.patient.count({ where: { active: true } }),

      prisma.appointment.count({
        where: { date: today, status: "pendiente" },
      }),

      prisma.appointment.findFirst({
        where: {
          date: { gte: today },
          status: "pendiente",
        },
        include: { patient: { select: { id: true, name: true } } },
        orderBy: [{ date: "asc" }, { time: "asc" }],
      }),
    ]);

    res.json({
      totalPatients,
      todayAppointments: todayCount,
      nextAppointment: nextAppointment
        ? {
            id: nextAppointment.id,
            date: nextAppointment.date,
            time: nextAppointment.time,
            patientName: nextAppointment.patient.name,
          }
        : null,
    });
  } catch (error) {
    console.error("Error obteniendo estadísticas:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
