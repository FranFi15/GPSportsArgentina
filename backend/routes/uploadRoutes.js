import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import authenticateAdmin from '../middleware/authMiddleware.js';

const router = express.Router();

const IMAGE_LIMIT = 5 * 1024 * 1024;
const VIDEO_LIMIT = 50 * 1024 * 1024;

const isVideoFile = (file) => {
  if (file.mimetype.startsWith('video/')) return true;
  const unnamed = !file.mimetype || file.mimetype === 'application/octet-stream';
  return unnamed && /\.(mp4|mov|m4v|webm)$/i.test(file.originalname);
};

const isImageFile = (file) => {
  if (file.mimetype.startsWith('image/')) return true;
  const unnamed = !file.mimetype || file.mimetype === 'application/octet-stream';
  return unnamed && /\.(jpe?g|png|gif|webp|avif)$/i.test(file.originalname);
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: VIDEO_LIMIT },
  fileFilter: (req, file, cb) => {
    if (!isImageFile(file) && !isVideoFile(file)) {
      cb(new Error('Solo se permiten imágenes o videos.'));
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
      ? 'El archivo supera el límite de 50 MB.'
      : err.message;
    res.status(400).json({ message });
  });
};

router.post('/', authenticateAdmin, uploadImage, async (req, res) => {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    return res.status(500).json({ message: 'Cloudinary no está configurado en el servidor.' });
  }

  if (!req.file) {
    return res.status(400).json({ message: 'No se envió un archivo.' });
  }

  const video = isVideoFile(req.file);
  if (video && req.query.preset !== 'familia') {
    return res.status(400).json({ message: 'Los videos solo se pueden subir en La Familia.' });
  }
  if (!video && req.file.size > IMAGE_LIMIT) {
    return res.status(400).json({ message: 'La imagen supera el límite de 5 MB.' });
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  try {
    const presets = {
      hero: { folder: 'gpsports/carousel', width: 1920 },
      familia: { folder: 'gpsports/familia', width: 1600 },
    };
    const preset = presets[req.query.preset] || { folder: 'gpsports', width: 1200 };
    const uploaded = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        video
          ? { folder: preset.folder, resource_type: 'video' }
          : {
            folder: preset.folder,
            resource_type: 'image',
            transformation: [{ width: preset.width, crop: 'limit', quality: 'auto' }],
          },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    const url = video
      ? cloudinary.url(uploaded.public_id, {
        resource_type: 'video',
        format: 'mp4',
        secure: true,
        transformation: [{ width: 1280, crop: 'limit', quality: 'auto' }],
      })
      : uploaded.secure_url;

    res.status(201).json({ url, kind: video ? 'video' : 'image' });
  } catch (error) {
    console.error('Error al subir archivo a Cloudinary:', error);
    res.status(500).json({ message: video ? 'No se pudo subir el video.' : 'No se pudo subir la imagen.' });
  }
});

export default router;
