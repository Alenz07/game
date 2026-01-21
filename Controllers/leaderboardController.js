const { User, UserCreature } = require('../models');

exports.getLeaderboard = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [UserCreature],
      order: [['wins', 'DESC'], ['level', 'DESC']]
    });

    const leaderboard = users.map(user => {
      const totalPower = user.UserCreatures.reduce((sum, c) => {
        return sum + c.attack + c.defense + c.maxHp;
      }, 0);

      const winRate = user.wins + user.losses > 0 
        ? ((user.wins / (user.wins + user.losses)) * 100).toFixed(1)
        : 0;

      return {
        username: user.username,
        level: user.level,
        wins: user.wins,
        losses: user.losses,
        winRate: `${winRate}%`,
        totalPower,
        creatureCount: user.UserCreatures.length
      };
    });

    res.json({ leaderboard });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};