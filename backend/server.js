import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { verifyToken } from "./middleware/auth.js";
import patientRoutes from "./routes/patientRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import clinicalNoteRoutes from "./routes/clinicalNoteRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Todas las rutas requieren token válido de Firebase
app.use(verifyToken);

app.use("/", patientRoutes);
app.use("/", appointmentRoutes);
app.use("/", clinicalNoteRoutes);
app.use("/", statsRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
