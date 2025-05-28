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

// =========================================================
// DEPURACIÓN: AÑADIR CONSOLE.LOGS AQUÍ
console.log('Backend iniciando...');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('CORS_ORIGIN from .env:', process.env.CORS_ORIGIN);

// Configuración de CORS
const corsOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : [];



console.log('Final CORS Origins allowed:', corsOrigins);

const corsOptions = {
    origin: function (origin, callback) {
        console.log(`CORS: Origin de la solicitud: ${origin}`);
        if (!origin || corsOrigins.includes(origin)) {
            console.log(`CORS: Origen ${origin} PERMITIDO.`);
            callback(null, true);
        } else {
            console.error(`CORS: Solicitud de origen NO PERMITIDO: ${origin}. Orígenes permitidos: ${corsOrigins.join(', ')}`);
            callback(new Error(`No permitido por CORS : ${origin}`));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization',
};

app.use(cors(corsOptions));
console.log('Middleware CORS aplicado.');
// =========================================================

app.use(express.json());
console.log('Middleware bodyParser aplicado.');

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error de conexión a MongoDB:', err));

// Rutas
app.use('/api/jugadores', jugadorRoutes);
app.use('/api/entrenadores', entrenadorRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/personas', personasRoutes);


app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});