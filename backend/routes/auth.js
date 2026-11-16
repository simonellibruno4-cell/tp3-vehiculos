const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'tu_clave_secreta_jwt';

// ruta de login
router.post('/login', async (req, res) => {
  try {
    const { email, contraseña, password } = req.body;
    const passUser = contraseña || password; 

    if (!email || !passUser) {
      return res.status(400).json({ error: 'email y contraseña requeridos' });
    }

    const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'credenciales inválidas' });
    }

    const user = rows[0];
    const passwordMatch = await bcrypt.compare(passUser, user.contraseña || user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'credenciales inválidas' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '4h' });
    res.json({ mensaje: 'login exitoso!', token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'error en el servidor' });
  }
});

module.exports = router;