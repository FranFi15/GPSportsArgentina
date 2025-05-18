import express from 'express';
const router = express.Router();
import Jugador from '../models/Jugador.js';
// import authenticateAdmin from '../middleware/authMiddleware.js'; // Comentado

// Obtener todos los jugadores
router.get('/', async (req, res) => {
  try {
    const jugadores = await Jugador.find();
    res.json(jugadores);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Agregar un nuevo jugador (requiere autenticación)
router.post('/', /* authenticateAdmin, */ async (req, res) => { // Comentado
  const jugador = new Jugador(req.body);
  try {
    const nuevoJugador = await jugador.save();
    res.status(201).json(nuevoJugador);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Obtener un jugador por ID (no protegido)
router.get('/:id', async (req, res) => {
  try {
    const jugador = await Jugador.findById(req.params.id);
    if (!jugador) {
      return res.status(404).json({ message: 'Jugador no encontrado' });
    }
    res.json(jugador);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Editar un jugador por ID (requiere autenticación)
router.put('/:id', /* authenticateAdmin, */ async (req, res) => { // Comentado
  try {
    const jugador = await Jugador.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!jugador) {
      return res.status(404).json({ message: 'Jugador no encontrado' });
    }
    res.json(jugador);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Eliminar un jugador por ID (requiere autenticación)
router.delete('/:id', /* authenticateAdmin, */ async (req, res) => { // Comentado
  try {
    const jugador = await Jugador.findByIdAndDelete(req.params.id);
    if (!jugador) {
      return res.status(404).json({ message: 'Jugador no encontrado' });
    }
    res.json({ message: 'Jugador eliminado' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;