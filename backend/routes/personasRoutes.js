// routes/personasRoutes.js
import express from 'express'; // <-- Cambio aquí
import Jugador from '../models/Jugador.js'; // <-- ¡Importante! Usar .js si no configuras un alias
import Entrenador from '../models/Entrenador.js'; // <-- ¡Importante! Usar .js si no configuras un alias
import auth from '../middleware/authMiddleware.js'; // <-- Cambio aquí (asumiendo que tu middleware es auth.js)

const router = express.Router();

// Ruta para actualizar el orden de las personas
router.put('/personas/reorder', auth, async (req, res) => {
  try {
    const { order } = req.body;

    const updates = order.map(async (item) => {
      if (item.tipo === 'jugador') {
        await Jugador.findByIdAndUpdate(item.id, { order: item.order });
      } else if (item.tipo === 'entrenador') {
        await Entrenador.findByIdAndUpdate(item.id, { order: item.order });
      }
    });

    await Promise.all(updates);

    res.status(200).json({ message: 'Orden actualizado exitosamente.' });
  } catch (error) {
    console.error('Error al reordenar personas:', error);
    res.status(500).json({ message: 'Error del servidor al actualizar el orden.', error: error.message });
  }
});

export default router; 