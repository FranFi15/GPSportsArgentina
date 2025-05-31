// routes/warmupRoutes.js
import express from 'express';
const router = express.Router();

// Define a simple GET endpoint for warming up the backend
router.get('/warmup', (req, res) => {
    console.log('Warm-up request received at /api/warmup!');
    res.status(200).json({ message: 'Backend is awake and ready!' });
});

export default router;