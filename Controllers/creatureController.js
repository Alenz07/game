const { UserCreature, Creature } = require('../models');

exports.getMyCreatures = async (req, res) => {
  try {
    const { userId } = req.params;

    const creatures = await UserCreature.findAll({
      where: { userId },
      include: [Creature]
    });

    res.json({ creatures });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.healCreature = async (req, res) => {
  try {
    const { creatureId } = req.params;

    const creature = await UserCreature.findByPk(creatureId);
    if (!creature) {
      return res.status(404).json({ error: 'Creature not found' });
    }

    creature.currentHp = creature.maxHp;
    await creature.save();

    res.json({ message: 'Creature healed!', creature });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};