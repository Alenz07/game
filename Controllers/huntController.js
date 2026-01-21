const { Creature, UserCreature, User } = require('../models');

const RARITY_CHANCES = {
  common: 50,
  uncommon: 30,
  rare: 15,
  epic: 4,
  legendary: 1
};

const getRandomRarity = (playerLevel) => {
  let rand = Math.random() * 100;
  const levelBonus = playerLevel * 2;
  
  if (rand < RARITY_CHANCES.legendary + levelBonus * 0.1) return 'legendary';
  rand -= RARITY_CHANCES.legendary;
  
  if (rand < RARITY_CHANCES.epic + levelBonus * 0.3) return 'epic';
  rand -= RARITY_CHANCES.epic;
  
  if (rand < RARITY_CHANCES.rare + levelBonus * 0.5) return 'rare';
  rand -= RARITY_CHANCES.rare;
  
  if (rand < RARITY_CHANCES.uncommon) return 'uncommon';
  
  return 'common';
};

exports.hunt = async (req, res) => {
  try {
    const { userId, selectedCreatureId } = req.body;
    
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const selectedCreature = await UserCreature.findByPk(selectedCreatureId, {
      include: [Creature]
    });

    if (!selectedCreature) {
      return res.status(404).json({ error: 'Selected creature not found' });
    }

    const rarity = getRandomRarity(user.level);
    const creatures = await Creature.findAll({ where: { rarity } });
    const wildCreature = creatures[Math.floor(Math.random() * creatures.length)];

    // Scale wild creature based on player's creature level (±20%)
    const variance = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
    const scaledHp = Math.floor(wildCreature.baseHp * variance * (selectedCreature.level / 2 + 0.5));
    const scaledAttack = Math.floor(wildCreature.baseAttack * variance * (selectedCreature.level / 2 + 0.5));
    const scaledDefense = Math.floor(wildCreature.baseDefense * variance * (selectedCreature.level / 2 + 0.5));

    res.json({
      message: `A wild ${wildCreature.name} appeared!`,
      creature: {
        ...wildCreature.toJSON(),
        baseHp: scaledHp,
        baseAttack: scaledAttack,
        baseDefense: scaledDefense
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.catch = async (req, res) => {
  try {
    const { userId, creatureId, currentHp, maxHp } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.pokeballs <= 0) {
      return res.status(400).json({ 
        error: 'No Pokéballs left! Buy more from the shop.',
        noBalls: true
      });
    }

    const creature = await Creature.findByPk(creatureId);
    if (!creature) {
      return res.status(404).json({ error: 'Creature not found' });
    }

    const hpPercent = (currentHp / maxHp) * 100;
    
    const rarityModifier = {
      common: 0.8,
      uncommon: 0.6,
      rare: 0.4,
      epic: 0.2,
      legendary: 0.1
    };

    let catchChance = (100 - hpPercent) * rarityModifier[creature.rarity];
    catchChance = Math.min(catchChance, 95);

    const roll = Math.random() * 100;

    // Use one pokéball
    user.pokeballs -= 1;
    await user.save();

    if (roll < catchChance) {
      const userCreature = await UserCreature.create({
        userId,
        creatureId,
        currentHp: creature.baseHp,
        maxHp: creature.baseHp,
        attack: creature.baseAttack,
        defense: creature.baseDefense,
        level: 1,
        exp: 0
      });

      return res.json({
        success: true,
        message: `Successfully caught ${creature.name}!`,
        creature: userCreature,
        pokeballsLeft: user.pokeballs
      });
    } else {
      return res.json({
        success: false,
        message: `${creature.name} broke free!`,
        catchChance: Math.round(catchChance),
        pokeballsLeft: user.pokeballs
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};