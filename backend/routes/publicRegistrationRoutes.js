import express from "express";
import { rateLimit } from "express-rate-limit";
import {
  getPublicRegistrationStatus,
  submitPublicRegistration,
} from "../controllers/registrationController.js";

const router = express.Router();
const statusLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 60,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Demasiadas solicitudes. Intentá nuevamente en unos minutos." },
});
const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Demasiados intentos. Intentá nuevamente en unos minutos." },
});

router.get("/public/registration/:token", statusLimiter, getPublicRegistrationStatus);
router.post("/public/registration/:token", submitLimiter, submitPublicRegistration);

export default router;
