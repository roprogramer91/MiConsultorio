import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { verifyToken } from "./middleware/auth.js";
import patientRoutes from "./routes/patientRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import clinicalNoteRoutes from "./routes/clinicalNoteRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import { startScheduler } from "./services/reminderScheduler.js";
import testRoutes from "./routes/testRoutes.js";
import openRoutes from "./routes/openRoutes.js";
import registrationRoutes from "./routes/registrationRoutes.js";
import publicRegistrationRoutes from "./routes/publicRegistrationRoutes.js";

dotenv.config();

const app = express();

app.set("trust proxy", 1);
app.use(cors());
app.use(express.json({ limit: "50kb" }));

app.use("/", patientRoutes);
app.use("/", appointmentRoutes);
app.use("/", testRoutes);
app.use("/", openRoutes);
app.use("/", publicRegistrationRoutes);

// Rutas exclusivas del dashboard — requieren token Firebase
app.use("/", verifyToken, registrationRoutes);
app.use("/", verifyToken, clinicalNoteRoutes);
app.use("/", verifyToken, statsRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  startScheduler();
});
