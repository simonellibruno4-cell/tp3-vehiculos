const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 4000;

// middlewares
app.use(cors());
app.use(express.json());

// rutas de autenticación
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// rutas de conductores
const conductoresRoutes = require('./routes/conductores');
app.use('/api/conductores', conductoresRoutes);

// rutas vehiculos
const vehiculosRoutes = require('./routes/vehiculos');
app.use('/api/vehiculos', require('./routes/vehiculos'));

// ruta viajes
const viajesRoutes = require('./routes/viajes');
app.use('/api/viajes', viajesRoutes);

// ruta de prueba
app.get('/', (req, res) => {
    res.json({ mensaje: '¡el backend del TP3 está funcionando correctamente!' });
});

// iniciar servidor
app.listen(PORT, () => {
    console.log(`servidor corriendo en el puerto ${PORT}`);
});