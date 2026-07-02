import express from "express";
import { checkOneHourReminders, sendTomorrowSummary } from "../services/reminderScheduler.js";
import { notifyDoctor } from "../services/whatsappService.js";

const router = express.Router();

function requireSecret(req, res, next) {
  if (req.headers["x-admin-secret"] !== process.env.ADMIN_SECRET) {
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
}

router.post("/test/whatsapp", requireSecret, async (_req, res) => {
  await notifyDoctor("✅ Test de WhatsApp funcionando correctamente");
  res.json({ ok: true, message: "Mensaje enviado a Adri" });
});

router.post("/test/reminder/1h", requireSecret, async (_req, res) => {
  await checkOneHourReminders();
  res.json({ ok: true, message: "Chequeo de recordatorio 1h ejecutado" });
});

router.post("/test/reminder/tomorrow", requireSecret, async (_req, res) => {
  await sendTomorrowSummary();
  res.json({ ok: true, message: "Resumen de mañana ejecutado" });
});

export default router;
