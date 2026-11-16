const express = require('express');
const router = express.Router();
const db = require('../db');

// obtener todos los vehículos
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM vehiculos');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'error al obtener los vehículos' });
  }
});

// registrar un nuevo vehículo
router.post('/', async (req, res) => {
  const { marca, modelo, patente, año, capacidad_de_carga } = req.body;

  try {
    const [result] = await db.query(
      'INSERT INTO vehiculos (marca, modelo, patente, año, capacidad_de_carga) VALUES (?, ?, ?, ?, ?)',
      [marca, modelo, patente, año, capacidad_de_carga]
    );
    res.status(201).json({ id: result.insertId, message: 'vehículo registrado con éxito' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// actualizar vehículo
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { marca, modelo, patente, año, capacidad_de_carga } = req.body;

  try {
    await db.query(
      'UPDATE vehiculos SET marca = ?, modelo = ?, patente = ?, año = ?, capacidad_de_carga = ? WHERE id = ?',
      [marca, modelo, patente, año, capacidad_de_carga, id]
    );
    res.json({ message: 'vehículo actualizado con éxito' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// eliminar vehículo
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM vehiculos WHERE id = ?', [id]);
    res.json({ message: 'vehículo eliminado con éxito' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;