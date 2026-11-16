const express = require('express');
const router = express.Router();
const db = require('../db');

// obtener todos los conductores
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM conductores');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'error al obtener los conductores' });
  }
});

// crear un conductor
router.post('/', async (req, res) => {
  const {
    nombre,
    apellido,
    numero_de_documento,
    numero_de_licencia,
    fecha_de_alta_de_licencia,
    fecha_de_vencimiento_de_licencia
  } = req.body;

  if (!nombre || !apellido || !numero_de_documento || !numero_de_licencia || !fecha_de_alta_de_licencia || !fecha_de_vencimiento_de_licencia) {
    return res.status(400).json({ error: 'Todos los campos del conductor son obligatorios' });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO conductores (nombre, apellido, numero_de_documento, numero_de_licencia, fecha_de_alta_de_licencia, fecha_de_vencimiento_de_licencia) VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre, apellido, numero_de_documento, numero_de_licencia, fecha_de_alta_de_licencia, fecha_de_vencimiento_de_licencia]
    );
    res.status(201).json({ id: result.insertId, message: 'Conductor registrado con éxito' });
  } catch (err) {
    res.status(500).json({ error: err.message || 'error al registrar el conductor' });
  }
});

module.exports = router;