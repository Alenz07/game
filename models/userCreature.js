const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UserCreature = sequelize.define('UserCreature', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    creatureId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    level: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    exp: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    currentHp: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    maxHp: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    attack: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    defense: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nickname: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });

  return UserCreature;
};
