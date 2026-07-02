import cron from "node-cron";
import prisma from "../prismaClient.js";
import { notifyDoctor } from "./whatsappService.js";

// Argentina es UTC-3 (sin horario de verano)
function nowArgentina() {
  return new Date(Date.now() - 3 * 60 * 60 * 1000);
}

function toDateString(d) {
  return d.toISOString().split("T")[0];
}

function toTimeString(d) {
  const h = String(d.getUTCHours()).padStart(2, "0");
  const m = String(d.getUTCMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

// IDs de turnos para los que ya se mandó el recordatorio de 1 hora
// Se resetea al reiniciar el servidor (aceptable para este caso de uso)
const sentOneHourReminders = new Set();

// Recordatorio 1 hora antes — corre cada 30 minutos
// Busca turnos cuya hora esté entre 50 y 80 minutos desde ahora
async function checkOneHourReminders() {
  try {
    const now = nowArgentina();
    const in50 = new Date(now.getTime() + 50 * 60 * 1000);
    const in80 = new Date(now.getTime() + 80 * 60 * 1000);

    const today = toDateString(now);
    const timeMin = toTimeString(in50);
    const timeMax = toTimeString(in80);

    const appointments = await prisma.appointment.findMany({
      where: {
        date: today,
        time: { gte: timeMin, lte: timeMax },
        status: { in: ["pendiente", "reservado"] },
      },
      include: { patient: true },
    });

    for (const appt of appointments) {
      if (sentOneHourReminders.has(appt.id)) continue;

      await notifyDoctor(
        `⏰ En ~1 hora: ${appt.patient.name} a las ${appt.time} hs\nhttps://miconsultorio-production.up.railway.app/open/appointments/${appt.id}`
      );

      sentOneHourReminders.add(appt.id);
      console.log(`[Scheduler] Recordatorio 1h enviado: turno #${appt.id} — ${appt.patient.name} ${appt.time}`);
    }
  } catch (error) {
    console.error("[Scheduler] Error en recordatorio 1h:", error);
  }
}

// Resumen del día siguiente — corre todos los días a las 20:00 Argentina (23:00 UTC)
async function sendTomorrowSummary() {
  try {
    const now = nowArgentina();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const tomorrowStr = toDateString(tomorrow);

    const appointments = await prisma.appointment.findMany({
      where: {
        date: tomorrowStr,
        status: { in: ["pendiente", "reservado"] },
      },
      include: { patient: true },
      orderBy: { time: "asc" },
    });

    if (!appointments.length) return;

    const lista = appointments
      .map((a) => `• ${a.time} hs — ${a.patient.name}`)
      .join("\n");

    await notifyDoctor(`📅 Turnos de mañana:\n${lista}`);

    console.log(`[Scheduler] Resumen de mañana enviado (${appointments.length} turnos)`);
  } catch (error) {
    console.error("[Scheduler] Error en resumen de mañana:", error);
  }
}

export function startScheduler() {
  // Cada 30 minutos: verificar turnos en ~1 hora
  cron.schedule("*/30 * * * *", checkOneHourReminders);

  // Todos los días a las 23:00 UTC (20:00 Argentina): resumen del día siguiente
  cron.schedule("0 23 * * *", sendTomorrowSummary);

  console.log("[Scheduler] Recordatorios de turnos activos");
}

// Expuesto para el endpoint de test — dispara el chequeo de 1h ahora mismo
export { checkOneHourReminders, sendTomorrowSummary };
