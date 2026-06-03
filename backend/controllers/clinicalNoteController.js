import prisma from "../prismaClient.js";

export const getNotesByPatient = async (req, res) => {
  try {
    const { id } = req.params;
    const patientId = Number(id);

    if (Number.isNaN(patientId)) {
      return res.status(400).json({ error: "ID de paciente inválido" });
    }

    const notes = await prisma.clinicalNote.findMany({
      where: { patientId },
      orderBy: { createdAt: "desc" },
    });

    res.json(notes);
  } catch (error) {
    console.error("Error obteniendo notas:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const createNote = async (req, res) => {
  try {
    const { id } = req.params;
    const patientId = Number(id);
    const { content } = req.body;

    if (Number.isNaN(patientId)) {
      return res.status(400).json({ error: "ID de paciente inválido" });
    }

    if (!content?.trim()) {
      return res.status(400).json({ error: "El contenido de la nota es obligatorio" });
    }

    const patient = await prisma.patient.findUnique({ where: { id: patientId } });
    if (!patient) {
      return res.status(404).json({ error: "Paciente no encontrado" });
    }

    const note = await prisma.clinicalNote.create({
      data: { patientId, content: content.trim() },
    });

    res.status(201).json(note);
  } catch (error) {
    console.error("Error creando nota:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const id = Number(noteId);

    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "ID de nota inválido" });
    }

    const existing = await prisma.clinicalNote.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "Nota no encontrada" });
    }

    await prisma.clinicalNote.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    console.error("Error eliminando nota:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
