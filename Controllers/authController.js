const bcrypt = require('bcryptjs');
const { User, Creature, UserCreature } = require('../models');

async function giveStarterCreature(userId) {
  try {
    const existingCreatures = await UserCreature.count({ where: { userId } });
    if (existingCreatures > 0) return null;

    const commonCreatures = await Creature.findAll({ where: { rarity: 'common' } });
    if (commonCreatures.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * commonCreatures.length);
    const starterCreature = commonCreatures[randomIndex];

    const newUserCreature = await UserCreature.create({
      userId: userId,
      creatureId: starterCreature.id,
      currentHp: starterCreature.baseHp,
      maxHp: starterCreature.baseHp,
      attack: starterCreature.baseAttack,
      defense: starterCreature.baseDefense,
      level: 1,
      exp: 0
    });

    return newUserCreature;
  } catch (error) {
    console.error('Error giving starter creature:', error);
    return null;
  }
}

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || username.trim().length === 0) {
      return res.status(400).json({ error: 'Username is required' });
    }

    if (!password || password.length < 4) {
      return res.status(400).json({ error: 'Password must be at least 4 characters' });
    }

    const existing = await User.findOne({ where: { username } });
    if (existing) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashedPassword });

    const starterCreature = await giveStarterCreature(user.id);

    res.json({ 
      message: starterCreature 
        ? `Welcome ${username}! You received a starter creature!` 
        : `Welcome ${username}!`,
      user: {
        id: user.id,
        username: user.username,
        level: user.level,
        money: user.money,
        pokeballs: user.pokeballs,
        exp: user.exp,
        wins: user.wins,
        losses: user.losses
      },
      starterGiven: !!starterCreature
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || username.trim().length === 0) {
      return res.status(400).json({ error: 'Username is required' });
    }

    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ error: 'Invalid username or password' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const creatureCount = await UserCreature.count({ where: { userId: user.id } });
    
    let starterGiven = false;
    if (creatureCount === 0) {
      const starter = await giveStarterCreature(user.id);
      starterGiven = !!starter;
    }

    await user.update({ isOnline: true });

    res.json({ 
      message: starterGiven 
        ? 'Login successful! You received a starter creature!' 
        : 'Login successful!',
      user: {
        id: user.id,
        username: user.username,
        level: user.level,
        money: user.money,
        pokeballs: user.pokeballs,
        exp: user.exp,
        wins: user.wins,
        losses: user.losses
      },
      starterGiven
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    const { userId } = req.body;
    
    const user = await User.findByPk(userId);
    if (user) {
      await user.update({ isOnline: false });
    }

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};