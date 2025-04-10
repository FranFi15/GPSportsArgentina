import mongoose from 'mongoose';

const JugadorSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  dni: { type: Number },
  edad: { type: Number, required: true },
  nacionalidad: { type: String, required: true },
  categoria: { type: String, required: true },
  equipo: { type: String },
  posicion: { type: String, enum: ['base', 'escolta', 'alero', 'ala-pivot', 'pivot'], required: true },
  fechaAlta: { type: Date, default: Date.now },
  tipo: { type: String, default: 'jugador' },
});

const Jugador = mongoose.model('Jugador', JugadorSchema);
export default Jugador;