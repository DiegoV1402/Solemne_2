import User from '../models/User.js';

export const saveSession = async (req, res) => {
  try {
    const { score, level } = req.body;
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    let hasNewRecord = false;

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

export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.find()
      .sort({ highScore: -1 })
      .limit(10)
      .lean();

    const formattedLeaderboard = leaderboard.map((player, index) => ({
      id: player._id,
      username: player.username,
      score: player.highScore ?? 0,
      rank: index + 1
    }));

    res.status(200).json(formattedLeaderboard);
  } catch (error) {
    console.error('Error al obtener el leaderboard:', error);
    res.status(200).json([]);
  }
};