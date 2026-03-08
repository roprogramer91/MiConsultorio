import express from "express";
import {
  createAppointment,
  getAppointmentsByDate,
  updateAppointmentStatus,
  getUpcomingAppointments,
  getAppointmentsByPatient,
  getAppointmentById,
  updateAppointment,
} from "../controllers/appointmentController.js";

const router = express.Router();

router.post("/appointments", createAppointment);

router.get("/appointments/patient/:patientId", getAppointmentsByPatient);

router.get("/appointments/upcoming", getUpcomingAppointments);

router.get("/appointments/:id", getAppointmentById);

router.get("/appointments", getAppointmentsByDate);

router.put("/appointments/:id", updateAppointment);

router.patch("/appointments/:id/status", updateAppointmentStatus);

export default router;
