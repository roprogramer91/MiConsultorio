import express from "express";
import { 
            createPatient, 
            getPatients,
            getPatientById
        } from "../controllers/patientController.js";

const router = express.Router();

router.post("/patients" , createPatient);
router.get("/patients" , getPatients);
router.get("/patients/:id", getPatientById);


export default router;