import express from 'express';
import Album from '../models/Album.js';
import authenticateAdmin from '../middleware/authMiddleware.js';

const router = express.Router();
const MAX_PHOTOS = 40;

const cleanAlbum = (body) => {
  const title = typeof body?.title === 'string' ? body.title.trim() : '';
  if (!title || title.length > 80) {
    return { error: 'El álbum necesita un título de hasta 80 caracteres.' };
  }

  const caption = typeof body?.caption === 'string' ? body.caption.trim().slice(0, 300) : '';
  if (!Array.isArray(body?.photos)) {
    return { error: 'Enviá las fotos del álbum.' };
  }
  if (body.photos.length > MAX_PHOTOS) {
    return { error: `Cada álbum admite hasta ${MAX_PHOTOS} fotos.` };
  }

  const photos = [];
  for (const photo of body.photos) {
    const url = typeof photo?.url === 'string' ? photo.url.trim() : '';
    if (!url.startsWith('https://')) {
      return { error: 'Cada foto tiene que ser un enlace seguro.' };
    }
    photos.push({
      url,
      alt: typeof photo.alt === 'string' ? photo.alt.trim().slice(0, 80) : '',
    });
  }

  if (!photos.length) {
    return { error: 'Agregá al menos una foto.' };
  }

  return { album: { title, caption, photos } };
};

router.get('/', async (req, res) => {
  try {
    const albums = await Album.find().sort({ createdAt: -1 });
    res.json(albums);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);
    if (!album) return res.status(404).json({ message: 'Álbum no encontrado.' });
    res.json(album);
  } catch (err) {
    res.status(400).json({ message: 'Álbum no encontrado.' });
  }
});

router.post('/', authenticateAdmin, async (req, res) => {
  const { album, error } = cleanAlbum(req.body);
  if (error) return res.status(400).json({ message: error });

  try {
    const created = await Album.create(album);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', authenticateAdmin, async (req, res) => {
  const { album, error } = cleanAlbum(req.body);
  if (error) return res.status(400).json({ message: error });

  try {
    const updated = await Album.findByIdAndUpdate(req.params.id, album, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Álbum no encontrado.' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const deleted = await Album.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Álbum no encontrado.' });
    res.json({ message: 'Álbum eliminado.' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
