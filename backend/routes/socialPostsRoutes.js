// routes/socialPostsRoutes.js

import express from 'express';
import SocialPost from '../models/SocialPost.js'; // Importa el modelo directamente

const router = express.Router();

// Ruta para obtener todas las publicaciones de redes sociales
router.get('/', async (req, res) => {
  try {
    const posts = await SocialPost.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las publicaciones de redes sociales', error: error.message });
  }
});

// Ruta para crear una nueva publicación de redes sociales
router.post('/', async (req, res) => {
  const { platform, url, title, description } = req.body;

  if (!platform || !url) {
    return res.status(400).json({ message: 'La plataforma y la URL son obligatorias.' });
  }

  try {
    const newPost = new SocialPost({ platform, url, title, description });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Esta URL ya ha sido agregada.', error: error.message });
    }
    res.status(500).json({ message: 'Error al agregar la publicación', error: error.message });
  }
});

// Ruta para actualizar una publicación de redes sociales por ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { platform, url, title, description } = req.body;

  try {
    const updatedPost = await SocialPost.findByIdAndUpdate(
      id,
      { platform, url, title, description },
      { new: true, runValidators: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: 'Publicación no encontrada.' });
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    if (error.code === 11000) {
        return res.status(409).json({ message: 'Esta URL ya ha sido agregada por otra publicación.', error: error.message });
    }
    res.status(500).json({ message: 'Error al actualizar la publicación', error: error.message });
  }
});

// Ruta para eliminar una publicación de redes sociales por ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedPost = await SocialPost.findByIdAndDelete(id);

    if (!deletedPost) {
      return res.status(404).json({ message: 'Publicación no encontrada.' });
    }

    res.status(200).json({ message: 'Publicación eliminada exitosamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la publicación', error: error.message });
  }
});

export default router;