const { Sequelize } = require("sequelize");

const sequelize = new Sequelize('neww', 'root', 'database', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3300,
  logging: false, // Set to console.log to see SQL queries
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Test connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully");
  } catch (error) {
    console.error("❌ Unable to connect to database:", error.message);
  }
})();

module.exports = sequelize;