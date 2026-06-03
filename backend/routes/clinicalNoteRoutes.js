import express from "express";
import {
  getNotesByPatient,
  createNote,
  deleteNote,
} from "../controllers/clinicalNoteController.js";

const router = express.Router();

router.get("/patients/:id/notes", getNotesByPatient);
router.post("/patients/:id/notes", createNote);
router.delete("/patients/:id/notes/:noteId", deleteNote);

export default router;
