const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    level: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    money: {
      type: DataTypes.INTEGER,
      defaultValue: 1000
    },
    pokeballs: {
      type: DataTypes.INTEGER,
      defaultValue: 5
    },
    exp: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    wins: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    losses: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    isOnline: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });

  return User;
};