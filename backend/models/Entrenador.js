import mongoose from 'mongoose';
import { nationalityPath, coerceStoredNationality } from './nationality.js';

const EntrenadorSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  fechaNacimiento: { type: Date, required: false },
  nacionalidad: nationalityPath,
  categoria: { type: String, required: false },
  equipo: { type: String },
  inst: {type:String},
  eurobasket: { type: String, required: false },
  fechaAlta: { type: Date, default: Date.now },
  tipo: { type: String, default: 'entrenador' },
  googleDriveLink: { type: String, required: false },
  order: { type: Number, default: 0 } 
});

EntrenadorSchema.pre('init', function (raw) {
  coerceStoredNationality(raw);
});

const Entrenador = mongoose.model('Entrenador', EntrenadorSchema);
export default Entrenador;