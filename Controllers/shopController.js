const { User } = require('../models');

const SHOP_ITEMS = {
  pokeball: { name: 'Pokéball', price: 50, quantity: 1 },
  pokeball_5: { name: '5 Pokéballs', price: 200, quantity: 5 },
  pokeball_10: { name: '10 Pokéballs', price: 350, quantity: 10 }
};

exports.getShop = async (req, res) => {
  try {
    res.json({ 
      items: SHOP_ITEMS,
      message: 'Shop items loaded'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.buyItem = async (req, res) => {
  try {
    const { userId, itemId } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const item = SHOP_ITEMS[itemId];
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (user.money < item.price) {
      return res.status(400).json({ error: 'Not enough money!' });
    }

    user.money -= item.price;
    user.pokeballs += item.quantity;
    await user.save();

    res.json({
      message: `Purchased ${item.name}!`,
      user: {
        money: user.money,
        pokeballs: user.pokeballs
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};