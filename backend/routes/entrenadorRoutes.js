import express from 'express';
const router = express.Router();
import Entrenador from '../models/entrenador.js';
// import authenticateAdmin from '../middleware/authMiddleware.js'; // Comentado

// Obtener todos los entrenadores
router.get('/', async (req, res) => {
  try {
    const entrenadores = await Entrenador.find();
    res.json(entrenadores);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Agregar un nuevo entrenador (requiere autenticación)
router.post('/', /* authenticateAdmin, */ async (req, res) => { // Comentado
  const entrenador = new Entrenador(req.body);
  try {
    const nuevoEntrenador = await entrenador.save();
    res.status(201).json(nuevoEntrenador);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Obtener un entrenador por ID (no protegido)
router.get('/:id', async (req, res) => {
  try {
    const entrenador = await Entrenador.findById(req.params.id);
    if (!entrenador) {
      return res.status(404).json({ message: 'Entrenador no encontrado' });
    }
    res.json(entrenador);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Editar un entrenador por ID (requiere autenticación)
router.put('/:id', /* authenticateAdmin, */ async (req, res) => { // Comentado
  try {
    const entrenador = await Entrenador.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!entrenador) {
      return res.status(404).json({ message: 'Entrenador no encontrado' });
    }
    res.json(entrenador);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Eliminar un entrenador por ID (requiere autenticación)
router.delete('/:id', /* authenticateAdmin, */ async (req, res) => { // Comentado
  try {
    const entrenador = await Entrenador.findByIdAndDelete(req.params.id);
    if (!entrenador) {
      return res.status(404).json({ message: 'Entrenador no encontrado' });
    }
    res.json({ message: 'Entrenador eliminado' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;