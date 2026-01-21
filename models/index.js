const sequelize = require('../config/database');

// Import model definitions
const UserModel = require("./user");
const CreatureModel = require('./creature');
const UserCreatureModel = require('./userCreature');
const BattleModel = require('./battle');

// Initialize models
const User = UserModel(sequelize);
const Creature = CreatureModel(sequelize);
const UserCreature = UserCreatureModel(sequelize);
const Battle = BattleModel(sequelize);

// Define Relations
User.hasMany(UserCreature, { foreignKey: 'userId' });
UserCreature.belongsTo(User, { foreignKey: 'userId' });

Creature.hasMany(UserCreature, { foreignKey: 'creatureId' });
UserCreature.belongsTo(Creature, { foreignKey: 'creatureId' });

User.hasMany(Battle, { foreignKey: 'userId' });
Battle.belongsTo(User, { foreignKey: 'userId' });

module.exports = { sequelize, User, Creature, UserCreature, Battle };