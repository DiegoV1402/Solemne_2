import User from '../models/User.js';

export const saveSession = async (req, res) => {
  try {
    const { score, level } = req.body;
    const userId = req.userId; // Obtenemos la ID que nos dejó el verifyToken

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    let hasNewRecord = false;

    // Solo actualizamos si superó su puntaje o nivel histórico
    if (score > user.highScore) {
      user.highScore = score;
      hasNewRecord = true;
    }
    
    if (level > user.maxLevelReached) {
      user.maxLevelReached = level;
      hasNewRecord = true;
    }

    if (hasNewRecord) {
      await user.save();
    }

    res.status(200).json({ 
      message: 'Métricas de la partida guardadas en MongoDB',
      newRecord: hasNewRecord
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno al procesar la partida' });
  }
};