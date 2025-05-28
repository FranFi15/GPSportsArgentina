import mongoose from 'mongoose';

const JugadorSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  dni: { type: Number },
  fechaNacimiento: { type: Date, required: false },
  nacionalidad: { type: String, required: true },
  categoria: { type: String, required: false },
  equipo: { type: String },
  posicion: { type: String, enum: ['base', 'escolta', 'alero', 'ala-pivot', 'pivot'], required: true },
  inst: {type:String},
  fechaAlta: { type: Date, default: Date.now },
  tipo: { type: String, default: 'jugador' },
  googleDriveLink: { type: String, required: false },
   order: { type: Number, default: 0 }
});

const Jugador = mongoose.model('Jugador', JugadorSchema);
export default Jugador;