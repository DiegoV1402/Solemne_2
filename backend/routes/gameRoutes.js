import express from 'express';
import { saveSession, getLeaderboard } from '../controllers/gameController.js';
import { verifyToken } from '../controllers/authController.js';

const router = express.Router();

router.post('/session', verifyToken, saveSession);
router.get('/leaderboard', getLeaderboard);

export default router;