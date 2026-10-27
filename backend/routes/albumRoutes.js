import express from 'express';
import mongoose from 'mongoose';
import Album from '../models/Album.js';
import authenticateAdmin from '../middleware/authMiddleware.js';

const router = express.Router();
const MAX_PHOTOS = 40;

const cleanAlbum = (body) => {
  const title = typeof body?.title === 'string' ? body.title.trim() : '';
  if (!title || title.length > 80) {
    return { error: 'El álbum necesita un título de hasta 80 caracteres.' };
  }

  const titleEn = typeof body?.titleEn === 'string' ? body.titleEn.trim().slice(0, 80) : '';
  const caption = typeof body?.caption === 'string' ? body.caption.trim().slice(0, 300) : '';
  const captionEn = typeof body?.captionEn === 'string' ? body.captionEn.trim().slice(0, 300) : '';
  if (!Array.isArray(body?.photos)) {
    return { error: 'Enviá las fotos del álbum.' };
  }
  if (body.photos.length > MAX_PHOTOS) {
    return { error: `Cada álbum admite hasta ${MAX_PHOTOS} fotos o videos.` };
  }

  const photos = [];
  for (const photo of body.photos) {
    const url = typeof photo?.url === 'string' ? photo.url.trim() : '';
    if (!url.startsWith('https://')) {
      return { error: 'Cada foto o video tiene que ser un enlace seguro.' };
    }
    const zoom = Number(photo.zoom);
    const x = Number(photo.x);
    const y = Number(photo.y);
    photos.push({
      url,
      alt: typeof photo.alt === 'string' ? photo.alt.trim().slice(0, 80) : '',
      kind: photo.kind === 'video' ? 'video' : 'image',
      zoom: Math.min(2.5, Math.max(1, Number.isFinite(zoom) ? zoom : 1)),
      x: Math.min(100, Math.max(0, Number.isFinite(x) ? x : 50)),
      y: Math.min(100, Math.max(0, Number.isFinite(y) ? y : 0)),
    });
  }

  if (!photos.length) {
    return { error: 'Agregá al menos una foto o un video.' };
  }

  return { album: { title, titleEn, caption, captionEn, photos } };
};

router.get('/', async (req, res) => {
  try {
    const albums = await Album.find().sort({ order: 1, createdAt: -1 });
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
    const count = await Album.countDocuments();
    const created = await Album.create({ ...album, order: count });
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/reorder', authenticateAdmin, async (req, res) => {
  const ids = Array.isArray(req.body?.ids) ? req.body.ids : null;
  if (!ids?.length || ids.some((id) => !mongoose.Types.ObjectId.isValid(id))) {
    return res.status(400).json({ message: 'Enviá el orden de los álbumes.' });
  }

  try {
    const existing = await Album.find().select('_id');
    const known = new Set(existing.map((album) => String(album._id)));
    const unique = new Set(ids.map(String));
    if (unique.size !== ids.length || known.size !== ids.length || ids.some((id) => !known.has(String(id)))) {
      return res.status(400).json({ message: 'El orden no coincide con los álbumes.' });
    }

    await Promise.all(ids.map((id, index) => Album.updateOne({ _id: id }, { order: index })));
    const albums = await Album.find().sort({ order: 1, createdAt: -1 });
    res.json(albums);
  } catch (err) {
    res.status(400).json({ message: err.message });
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
