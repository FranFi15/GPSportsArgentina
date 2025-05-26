// server.js
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

import jugadorRoutes from './routes/jugadorRoutes.js';
import entrenadorRoutes from './routes/entrenadorRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Configuración de CORS (modificado)
const corsOrigin = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : [];// Cambia esto a tu origen permitido

if(process.env.NODE_ENV === 'production'){
  corsOrigin.push('http://localhost:5173')};

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || corsOrigin.includes(origin)) {
      callback(null, true);
    }
    else {
      console.error(`CORS: Solicitud de origen no permitido: ${origin}. Orígenes permitidos: ${corsOrigins.join(', ')}`);
      callback(new Error(`No permitido por CORS : ${origin}`));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Si necesitas manejar cookies o autenticación con credenciales
  allowedHeaders: 'Content-Type, Authorization', // Los headers que permites
};
app.use(cors(corsOptions));

app.use(bodyParser.json());

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error de conexión a MongoDB:', err));

  console.log('Middleware global CORS y bodyParser aplicados.');
// Rutas
app.use('/api/jugadores', jugadorRoutes);
app.use('/api/entrenadores', entrenadorRoutes);
app.use('/api/auth', authRoutes); // Las rutas de autenticación bajo /api/auth

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});