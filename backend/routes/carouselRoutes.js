import express from 'express';
import CarouselSlide from '../models/CarouselSlide.js';
import authenticateAdmin from '../middleware/authMiddleware.js';

const router = express.Router();
const MAX_SLIDES = 20;

router.get('/', async (req, res) => {
  try {
    const slides = await CarouselSlide.find().sort({ order: 1 });
    res.json(slides);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/', authenticateAdmin, async (req, res) => {
  const slides = req.body?.slides;
  if (!Array.isArray(slides)) {
    return res.status(400).json({ message: 'Enviá la lista de fotos del carrusel.' });
  }
  if (slides.length > MAX_SLIDES) {
    return res.status(400).json({ message: `El carrusel admite hasta ${MAX_SLIDES} fotos.` });
  }

  const cleaned = [];
  for (const slide of slides) {
    const url = typeof slide?.url === 'string' ? slide.url.trim() : '';
    if (!url.startsWith('https://')) {
      return res.status(400).json({ message: 'Cada foto tiene que ser un enlace seguro.' });
    }
    cleaned.push({
      url,
      alt: typeof slide.alt === 'string' ? slide.alt.trim().slice(0, 80) : '',
    });
  }

  try {
    await CarouselSlide.deleteMany({});
    const created = cleaned.length
      ? await CarouselSlide.insertMany(cleaned.map((slide, index) => ({ ...slide, order: index })))
      : [];
    res.json(created);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
