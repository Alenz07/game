const { Creature } = require('./models');

const seedCreatures = async () => {
  const creatures = [
    // COMMON
    { name: 'Flame Pup', type: 'fire', rarity: 'common', baseHp: 50, baseAttack: 15, baseDefense: 10 },
    { name: 'Water Blob', type: 'water', rarity: 'common', baseHp: 55, baseAttack: 12, baseDefense: 12 },
    { name: 'Leaf Bug', type: 'grass', rarity: 'common', baseHp: 45, baseAttack: 13, baseDefense: 11 },
    { name: 'Spark Mouse', type: 'electric', rarity: 'common', baseHp: 40, baseAttack: 16, baseDefense: 8 },
    { name: 'Rock Snail', type: 'earth', rarity: 'common', baseHp: 60, baseAttack: 10, baseDefense: 15 },
    
    // UNCOMMON
    { name: 'Blaze Hound', type: 'fire', rarity: 'uncommon', baseHp: 70, baseAttack: 22, baseDefense: 15 },
    { name: 'Aqua Serpent', type: 'water', rarity: 'uncommon', baseHp: 75, baseAttack: 19, baseDefense: 18 },
    { name: 'Vine Crawler', type: 'grass', rarity: 'uncommon', baseHp: 65, baseAttack: 20, baseDefense: 16 },
    { name: 'Thunder Rabbit', type: 'electric', rarity: 'uncommon', baseHp: 60, baseAttack: 24, baseDefense: 12 },
    { name: 'Boulder Beast', type: 'earth', rarity: 'uncommon', baseHp: 85, baseAttack: 18, baseDefense: 22 },
    
    // RARE
    { name: 'Inferno Wolf', type: 'fire', rarity: 'rare', baseHp: 100, baseAttack: 35, baseDefense: 25 },
    { name: 'Tidal Dragon', type: 'water', rarity: 'rare', baseHp: 110, baseAttack: 30, baseDefense: 28 },
    { name: 'Forest Guardian', type: 'grass', rarity: 'rare', baseHp: 95, baseAttack: 32, baseDefense: 26 },
    { name: 'Storm Tiger', type: 'electric', rarity: 'rare', baseHp: 90, baseAttack: 38, baseDefense: 20 },
    { name: 'Mountain Golem', type: 'earth', rarity: 'rare', baseHp: 130, baseAttack: 28, baseDefense: 35 },
    
    // EPIC
    { name: 'Pyro Phoenix', type: 'fire', rarity: 'epic', baseHp: 150, baseAttack: 50, baseDefense: 35 },
    { name: 'Hydro Leviathan', type: 'water', rarity: 'epic', baseHp: 160, baseAttack: 45, baseDefense: 40 },
    { name: 'Terra Titan', type: 'earth', rarity: 'epic', baseHp: 180, baseAttack: 42, baseDefense: 50 },
    
    // LEGENDARY
    { name: 'Eternal Flame', type: 'fire', rarity: 'legendary', baseHp: 250, baseAttack: 80, baseDefense: 60 },
    { name: 'Ocean King', type: 'water', rarity: 'legendary', baseHp: 270, baseAttack: 75, baseDefense: 65 },
    { name: 'Thunder God', type: 'electric', rarity: 'legendary', baseHp: 230, baseAttack: 90, baseDefense: 50 }
  ];

  await Creature.bulkCreate(creatures);
  console.log('✅ Creatures seeded!');
};

module.exports = seedCreatures;