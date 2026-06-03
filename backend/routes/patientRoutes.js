import express from "express";
import {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  archivePatient,
  deletePatient,
} from "../controllers/patientController.js";

const router = express.Router();

router.post("/patients", createPatient);
router.get("/patients", getPatients);
router.get("/patients/:id", getPatientById);
router.put("/patients/:id", updatePatient);
router.patch("/patients/:id/archive", archivePatient);
router.delete("/patients/:id", deletePatient);

export default router;
