import express from "express";
import {
  createAppointment,
  getAppointmentsByDate,
  updateAppointmentStatus,
  getUpcomingAppointments,
  getAppointmentsByPatient,
} from "../controllers/appointmentController.js";

const router = express.Router();

router.post("/appointments", createAppointment);

router.get("/appointments/patient/:patientId", getAppointmentsByPatient);

router.get("/appointments/upcoming", getUpcomingAppointments);

router.get("/appointments", getAppointmentsByDate);

router.patch("/appointments/:id/status", updateAppointmentStatus);

export default router;