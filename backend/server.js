import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db.js";
import prisma from "./prismaClient.js";
import patientRoutes from "./routes/patientRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";

dotenv.config();

const app = express();

//Middleware
app.use(cors());
app.use(express.json());

app.use("/", patientRoutes);
app.use("/", appointmentRoutes);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});