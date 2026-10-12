import mongoose from 'mongoose';
import { nationalityPath, coerceStoredNationality } from './nationality.js';

const JugadorSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  fechaNacimiento: { type: Date, required: false },
  nacionalidad: nationalityPath,
  categoria: { type: String, required: false },
  equipo: { type: String },
  posicion: { type: String, enum: ['base', 'escolta', 'alero', 'ala-pivot', 'pivot'], required: true },
  inst: {type:String},
  eurobasket: { type: String, required: false },
  fechaAlta: { type: Date, default: Date.now },
  tipo: { type: String, default: 'jugador' },
  googleDriveLink: { type: String, required: false },
   order: { type: Number, default: 0 }
});

JugadorSchema.pre('init', function (raw) {
  coerceStoredNationality(raw);
});

const Jugador = mongoose.model('Jugador', JugadorSchema);
export default Jugador;