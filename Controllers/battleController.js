const { Battle, User, UserCreature, Creature } = require('../models');

const TYPE_ADVANTAGE = {
  fire: 'grass',
  water: 'fire',
  grass: 'electric',
  electric: 'water',
  earth: 'electric'
};

const calculateDamage = (attacker, defender, attackerType, defenderType) => {
  let damage = attacker.attack - defender.defense / 2;
  
  if (TYPE_ADVANTAGE[attackerType] === defenderType) {
    damage = damage * 1.5;
  }
  
  damage = Math.max(damage, 5);
  
  const variance = 0.85 + Math.random() * 0.3;
  damage = Math.floor(damage * variance);
  
  return damage;
};

// Single turn attack (for turn-based battles)
exports.attackTurn = async (req, res) => {
  try {
    const { userCreatureId, enemyCreatureId, enemyCurrentHp, enemyMaxHp, isWildBattle } = req.body;

    const userCreature = await UserCreature.findByPk(userCreatureId, {
      include: [Creature]
    });
    
    const enemyCreature = isWildBattle 
      ? await Creature.findByPk(enemyCreatureId)
      : await UserCreature.findByPk(enemyCreatureId, { include: [Creature] });

    if (!userCreature || !enemyCreature) {
      return res.status(404).json({ error: 'Creatures not found' });
    }

    let playerHp = userCreature.currentHp;
    let enemyHp = isWildBattle ? enemyCurrentHp : enemyCreature.currentHp;
    
    const battleLog = [];

    // Player attacks
    const playerDamage = calculateDamage(
      userCreature,
      isWildBattle ? { defense: enemyCreature.baseDefense } : enemyCreature,
      userCreature.Creature.type,
      isWildBattle ? enemyCreature.type : enemyCreature.Creature.type
    );
    
    enemyHp -= playerDamage;
    battleLog.push(`${userCreature.Creature.name} deals ${playerDamage} damage!`);

    let won = false;
    let lost = false;

    if (enemyHp <= 0) {
      won = true;
    } else {
      // Enemy attacks back
      const enemyDamage = calculateDamage(
        isWildBattle ? { attack: enemyCreature.baseAttack } : enemyCreature,
        userCreature,
        isWildBattle ? enemyCreature.type : enemyCreature.Creature.type,
        userCreature.Creature.type
      );
      
      playerHp -= enemyDamage;
      battleLog.push(`${isWildBattle ? enemyCreature.name : enemyCreature.Creature.name} deals ${enemyDamage} damage!`);

      if (playerHp <= 0) {
        lost = true;
      }
    }

    // Update player creature HP
    userCreature.currentHp = Math.max(playerHp, 0);
    await userCreature.save();

    // If PvP battle, update enemy creature HP
    if (!isWildBattle) {
      enemyCreature.currentHp = Math.max(enemyHp, 0);
      await enemyCreature.save();
    }

    res.json({
      battleLog,
      playerHp: Math.max(playerHp, 0),
      enemyHp: Math.max(enemyHp, 0),
      won,
      lost,
      userCreature: {
        hp: userCreature.currentHp,
        level: userCreature.level,
        exp: userCreature.exp
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Complete battle (when won/lost)
exports.completeBattle = async (req, res) => {
  try {
    const { userId, userCreatureId, won, enemyName, isPvP, enemyUserId } = req.body;

    const userCreature = await UserCreature.findByPk(userCreatureId, {
      include: [Creature]
    });

    if (!userCreature) {
      return res.status(404).json({ error: 'Creature not found' });
    }

    const user = await User.findByPk(userId);
    const battleLog = [];
    let expGained = 0;

    if (won) {
      expGained = isPvP ? 150 : 50;
      
      // Level up creature
      userCreature.exp += expGained;
      
      while (userCreature.exp >= userCreature.level * 100) {
        userCreature.exp -= userCreature.level * 100;
        userCreature.level += 1;
        
        // Increase stats with level
        const hpIncrease = 10 + Math.floor(Math.random() * 5);
        const atkIncrease = 5 + Math.floor(Math.random() * 3);
        const defIncrease = 3 + Math.floor(Math.random() * 3);
        
        userCreature.maxHp += hpIncrease;
        userCreature.attack += atkIncrease;
        userCreature.defense += defIncrease;
        userCreature.currentHp = userCreature.maxHp;
        
        battleLog.push(`${userCreature.Creature.name} leveled up to ${userCreature.level}! (+${hpIncrease} HP, +${atkIncrease} ATK, +${defIncrease} DEF)`);
      }
      
      await userCreature.save();

      // Level up user
      user.wins += 1;
      user.exp += expGained;
      user.money += isPvP ? 200 : 50;
      
      while (user.exp >= user.level * 200) {
        user.exp -= user.level * 200;
        user.level += 1;
        battleLog.push(`You leveled up to ${user.level}!`);
      }

      // If PvP, update opponent
      if (isPvP && enemyUserId) {
        const enemyUser = await User.findByPk(enemyUserId);
        if (enemyUser) {
          enemyUser.losses += 1;
          await enemyUser.save();
        }
      }
    } else {
      user.losses += 1;
    }
    
    await user.save();

    await Battle.create({
      userId,
      result: won ? 'win' : 'lose',
      expGained,
      enemyName: enemyName || 'Unknown'
    });

    res.json({
      message: won ? 'Victory!' : 'Defeat!',
      battleLog,
      expGained,
      moneyGained: won ? (isPvP ? 200 : 50) : 0,
      userCreature: {
        hp: userCreature.currentHp,
        maxHp: userCreature.maxHp,
        level: userCreature.level,
        exp: userCreature.exp,
        attack: userCreature.attack,
        defense: userCreature.defense
      },
      user: {
        level: user.level,
        exp: user.exp,
        money: user.money,
        wins: user.wins,
        losses: user.losses
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};