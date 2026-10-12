import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import authenticateAdmin from '../middleware/authMiddleware.js';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      cb(new Error('Solo se permiten imágenes.'));
      return;
    }
    cb(null, true);
  },
});

const uploadImage = (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (!err) {
      next();
      return;
    }
    const message = err.code === 'LIMIT_FILE_SIZE'
      ? 'La imagen supera el límite de 5 MB.'
      : err.message;
    res.status(400).json({ message });
  });
};

router.post('/', authenticateAdmin, uploadImage, async (req, res) => {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    return res.status(500).json({ message: 'Cloudinary no está configurado en el servidor.' });
  }

  if (!req.file) {
    return res.status(400).json({ message: 'No se envió una imagen.' });
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  try {
    const uploaded = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: req.query.preset === 'hero' ? 'gpsports/carousel' : 'gpsports',
          resource_type: 'image',
          transformation: [{ width: req.query.preset === 'hero' ? 1920 : 1200, crop: 'limit', quality: 'auto' }],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    res.status(201).json({ url: uploaded.secure_url });
  } catch (error) {
    console.error('Error al subir imagen a Cloudinary:', error);
    res.status(500).json({ message: 'No se pudo subir la imagen.' });
  }
});

export default router;
