import mongoose from 'mongoose';

const EntrenadorSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  dni: { type: Number },
  fechaNacimiento: { type: Date, required: false },
  nacionalidad: { type: String, required: true },
  categoria: { type: String, required: false },
  equipo: { type: String },
  inst: {type:String},
  fechaAlta: { type: Date, default: Date.now },
  tipo: { type: String, default: 'entrenador' },
  googleDriveLink: { type: String, required: false },
});

const Entrenador = mongoose.model('Entrenador', EntrenadorSchema);
export default Entrenador;