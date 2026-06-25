import express from 'express';
import { saveSession } from '../controllers/gameController.js';
import { verifyToken } from '../controllers/authController.js';

const router = express.Router();

// La petición pasa por verifyToken primero, si es válido, ejecuta saveSession
router.post('/session', verifyToken, saveSession);

export default router;