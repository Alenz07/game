const express = require('express');
const router = express.Router();

const authController = require('../Controllers/authController');
const huntController = require('../Controllers/huntController');
const battleController = require('../Controllers/battleController');
const creatureController = require('../Controllers/creatureController');
const leaderboardController = require('../Controllers/leaderboardController');
const shopController = require('../Controllers/shopController');

// Auth
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// Hunt & Catch
router.post('/hunt', huntController.hunt);
router.post('/catch', huntController.catch);

// Battle (Turn-based)
router.post('/battle/attack', battleController.attackTurn);
router.post('/battle/complete', battleController.completeBattle);

// Creatures
router.get('/creatures/:userId', creatureController.getMyCreatures);
router.post('/heal/:creatureId', creatureController.healCreature);

// Shop
router.get('/shop', shopController.getShop);
router.post('/shop/buy', shopController.buyItem);

// Leaderboard
router.get('/leaderboard', leaderboardController.getLeaderboard);

module.exports = router;