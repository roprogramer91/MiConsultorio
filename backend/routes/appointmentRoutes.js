import express from "express";
import {
  createAppointment,
  getAppointmentsByDate,
  updateAppointmentStatus,
  getUpcomingAppointments,
} from "../controllers/appointmentController.js";


const router = express.Router();

router.post("/appointments", createAppointment);
router.get("/appointments", getAppointmentsByDate);
router.patch("/appointments/:id/status", updateAppointmentStatus);
router.get("/appointments/upcoming", getUpcomingAppointments);

export default router;