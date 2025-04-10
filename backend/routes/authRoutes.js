// routes/authRoutes.js
import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.post('/admin/login', (req, res) => {
  const { usuario, contraseña } = req.body;

  if (usuario === process.env.ADMIN_USER && contraseña === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign({ user: { id: 'admin' } }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Credenciales inválidas.' });
  }
});

export default router;