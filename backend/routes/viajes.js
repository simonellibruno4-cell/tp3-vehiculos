const express = require('express');
const router = express.Router();
const db = require('../db');

// obtener todos los viajes
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM viajes');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'error al obtener los viajes' });
  }
});

// registrar un nuevo viaje
router.post('/', async (req, res) => {
  const { origen, destino, fecha_salida, fecha_llegada, vehiculo_id, conductor_id, kilometros, observaciones } = req.body;

  if (!origen || !destino || !fecha_salida || !vehiculo_id || !conductor_id) {
    return res.status(400).json({ error: 'todos los campos obligatorios del viaje son requeridos' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO viajes (origen, destino, fecha_salida, fecha_llegada, vehiculo_id, conductor_id, kilometros, observaciones) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [origen, destino, fecha_salida, fecha_llegada, vehiculo_id, conductor_id, kilometros, observaciones]
    );
    res.status(201).json({ id: result.insertId, message: 'viaje registrado con éxito' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM viajes WHERE id = ?', [id]);
    res.json({ message: 'viaje eliminado con éxito' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;