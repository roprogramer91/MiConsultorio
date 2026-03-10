import express from "express";
import {
  createAppointment,
  getAppointmentsByDate,
  updateAppointmentStatus,
  getUpcomingAppointments,
  getAppointmentsByPatient,
  getAppointmentHistory,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
} from "../controllers/appointmentController.js";

const router = express.Router();

router.post("/appointments", createAppointment);

router.get("/appointments/patient/:patientId", getAppointmentsByPatient);

router.get("/appointments/history", getAppointmentHistory);

router.get("/appointments/upcoming", getUpcomingAppointments);

router.get("/appointments/:id", getAppointmentById);

router.get("/appointments", getAppointmentsByDate);

router.put("/appointments/:id", updateAppointment);

router.delete("/appointments/:id", deleteAppointment);

router.patch("/appointments/:id/status", updateAppointmentStatus);

export default router;
