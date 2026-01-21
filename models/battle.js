const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Battle = sequelize.define('Battle', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    result: {
      type: DataTypes.ENUM('win', 'lose'),
      allowNull: false
    },
    expGained: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    enemyName: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });

  return Battle;
};
