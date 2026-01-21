const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Creature = sequelize.define('Creature', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('fire', 'water', 'grass', 'electric', 'earth'),
      allowNull: false
    },
    rarity: {
      type: DataTypes.ENUM('common', 'uncommon', 'rare', 'epic', 'legendary'),
      allowNull: false
    },
    baseHp: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    baseAttack: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    baseDefense: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  return Creature;
};