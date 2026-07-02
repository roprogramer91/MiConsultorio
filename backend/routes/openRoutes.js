import express from "express";

const router = express.Router();

router.get("/open/appointments/:id", (req, res) => {
  const { id } = req.params;
  res.send(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="refresh" content="0;url=miconsultorio://appointments/${id}">
  <title>Abriendo turno...</title>
  <style>
    body { font-family: sans-serif; text-align: center; padding: 40px; color: #333; }
    a { color: #c8102e; font-size: 18px; }
  </style>
</head>
<body>
  <p>Abriendo la app...</p>
  <p><a href="miconsultorio://appointments/${id}">Tocá aquí si no abre automáticamente</a></p>
  <script>window.location.href = "miconsultorio://appointments/${id}";</script>
</body>
</html>`);
});

export default router;
