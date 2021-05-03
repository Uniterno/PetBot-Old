
const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const https = require('https');
const fs = require('fs');
const rng = require('random-world');
const updateJsonFile = require('update-json-file');

module.exports = class DungeonCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'dungeon',
            group: 'util',
            aliases: ['dg'],
            memberName: 'dungeon',
            description: 'Dungeon Event command.',
            throttling: {
        usages: 5,
        duration: 4
    },
        });
    }
    run(message, args) {



      console.log(message.content);


      args = message.content.split(' ').slice(1);
      let UserID = message.author.id;

      if(UserID != "168389193603612673" && UserID != "103385273387208704" && UserID != "113282276321697792" && UserID != "257191130855243777"){
        message.channel.send("You are not participating on this event!");
        return;
    }

      var User = JSON.parse(fs.readFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt", 'utf8'));
      var Enemy = JSON.parse(fs.readFileSync("./PetBot/settings/dungeon/Enemy_"+UserID+".txt", 'utf8'));

      if(!!Enemy.Skill_Slot3_Cooldown == false){
        Enemy.Skill_Slot3_Cooldown = "Not available for this enemy."
      }

      console.log(args[0]);
      if(args[0] != "info" && args[0] != "enemy" && args[0] != "attack" && args[0] != "skill" && args[0] != "special" && args[0] != "shop" && args[0] != "s" && args[0] != "debug"){
        return;
      }
      if(args[0] == "info"){
        message.channel.send("Info on your user:\n**Class**: "+User.Class+"\n**Attribute**: "+User.Attribute+" (Strong vs: "+User.StrongVs+") (Weak vs: "+User.WeakVs+")\n**HP**: "+User.CurrentHP+"/"+User.MaxHP+"\n**Atk**: "+User.Atk+" (Multiplier: "+Math.round(User.AttackMultiplier)+"%)\n**Mana Gauge**: "+User.ManaGauge.toFixed(2)+"%\n**Skill 1 Cooldown**: "+User.Skill_Slot1_Cooldown+"\n**Skill 2 Cooldown**: "+User.Skill_Slot2_Cooldown+"\n**Skill 3 Cooldown**: "+User.Skill_Slot3_Cooldown+"\n**Level**: "+User.Level+"\n**Experience**: "+User.CurrentEXP+"/"+User.NeededEXP);
        return;
      } else if(args[0] == "enemy"){
        message.channel.send("Info on your enemy:\n**Class**: "+Enemy.Class+"\n**Attribute**: "+Enemy.Attribute+" (Strong vs: "+Enemy.StrongVs+") (Weak vs: "+Enemy.WeakVs+")\n**HP**: "+Enemy.CurrentHP+"/"+Enemy.MaxHP+"\n**Atk**: "+Enemy.Atk+" (Multiplier: "+Enemy.AttackMultiplier+"%)\n**Skill #1 ID**: "+Enemy.Skill_Slot1_ID+"\n**Skill #2 ID**: "+Enemy.Skill_Slot2_ID+"\n**Skill #3 ID**: "+Enemy.Skill_Slot3_ID);
        return;
      }

      if(args[0] == "shop" || args[0] == "s"){
        Shopping(UserID, args[1], User, message);
        return;
      }

      if(args[0] == "debug"){
        if(args[1] != "enemy"){

          message.channel.send("```JSON\n"+JSON.stringify(User, null, "\t")+"```");
        } else{
           message.channel.send("```JSON\n"+JSON.stringify(Enemy, null, "\t")+"```");
        }
        return;
      }


    
    if(User.CurrentHP <= 0){
      message.channel.send("You don't have remaining HP. Heal before continuing.");
      return;
    }

    if(Enemy.CurrentHP <= 0){
      message.channel.send("Seems like your enemy was already dead but it wasn't updated.\nStarting manual deployment...");
      AutomaticEnemyDeploy(Enemy, UserID, message);
      return;
    }
        
    if(args[0] == "attack"){
      UserAttack(User, Enemy, message, UserID);
    }

    if(args[0] == "skill"){
      if(args[1] == 3){
        if(User.Class != "Shield-Maiden" && User.Class != "Arthur Pendragon (Nanatsu no Taizai Ver.)"){
          message.channel.send("Invalid skill.");
          return;
        }
      } else if(args[1] != 1 && args[1] != 2){
        message.channel.send("Invalid skill.");
        return;
      }


      console.log(args[1]);

      if(args[1] == 1){
        let Index = 1;
        let Res = Skill(User.Skill_Slot1_ID, User, Enemy, message, Index, UserID);
       
        if(Res == "Unable"){
          return;
        }
      }
      if(args[1] == 2){
        let Index = 2;
        let Res = Skill(User.Skill_Slot2_ID, User, Enemy, message, Index, UserID);
        if(Res == "Unable"){
          return;
        }
      }
      if(args[1] == 3){
        let Index = 3;
        let Res = Skill(User.Skill_Slot3_ID, User, Enemy, message, Index, UserID);
        if(Res == "Unable"){
          return;
        }
      }
      
    
    }


     if(args[0] == "special"){
        if(User.ManaGauge >= 100){
          Special(User, Enemy, message, UserID);
          return;
        } else{
          message.channel.send("Unable to use your special ability, you need at least 100% of mana charged.");
          return;
        }
}

/*if(args[0] != "attack"){
        AITurn(User, Enemy, message, UserID);
} */ 

// Disabled because I'm testing skills and special not taking turns.

  if(args[0] == "attack"){
    GenericTurn(User, Enemy, message, UserID);
  }
  

  }
}






function CalculateDamage(Atk){
  let Damage = Math.ceil((((Atk * 0.23) + 10)/5)+(Math.sqrt(Atk)*5));
  Damage = getRandom(Damage*0.90, Damage*1.1);
  return Damage;
  //return Math.ceil((((Atk * 0.23) + 10)/5)+(Math.sqrt(Atk)*5));
}

function CalculateEvasion(Evade, Immune, Attribute, ImmuneTo){
  if(Immune == true){
    return true;
  }

  if(ImmuneTo == "All"){
    return;
  }
  if(ImmuneTo == Attribute){
    return;
  }


  let Odds = getRandom(0, 100);

  if(Odds <= Evade){
    return true;
  }

  return false;
}

function CalculateCritical(CritRateMin, CritRateMax){
  let Crit = 0;
  if(CritRateMin == CritRateMax){
    Crit = CritRateMin;
  } else{
    Crit = getRandom(CritRateMin, CritRateMax);
  }
  
  let Odds = getRandom(0, 100);

  if(Odds <= Crit){
    return true;
  }

  return false;
}


function AttributeEffective(StrongVs, WeakVs, Attribute){
  if(StrongVs == WeakVs){
    console.log("ERROR FOUND. ATTRIBUTE BONUS.");
    return "Normal";
  }

  if(StrongVs == "AllButFairy"){
    if(Attribute == "Fairy"){
      return "Weak";
    } else{
      return "Strong";
    }
  }

  if(StrongVs == "Undead&Dragon"){
    if(Attribute == "Undead" || Attribute == "Dragon"){
      return "Strong";
    }
  }

  if(WeakVs == "Dark&Human"){
    if(Attribute == "Dark" || Attribute == "Human"){
      return "Weak";
    }
  }

  if(StrongVs == Attribute){
    return "Strong";
  }
  if(WeakVs == Attribute){
    return "Weak";
  }

  return "Normal";
}


function getRandom(min, max) {
    return rng.integer({min, max});
  }

  function DealDamage(Damage, CurrentHP, message, AttackUserMessage){
    CurrentHP = CurrentHP - Damage;

    if(Damage % 1 != 0){
      Damage = Damage.toFixed(2);
    }
    if(CurrentHP % 1 != 0){
      CurrentHP = CurrentHP.toFixed(2);
    }

    AttackUserMessage = AttackUserMessage+"You have dealt "+Damage+" damage to enemy, remaining HP is "+CurrentHP+"!";
        
    message.channel.send(AttackUserMessage);

    if(CurrentHP <= 0){
      return true;
    }

  return CurrentHP;

  }

  function DealDamageAsEnemy(Damage, CurrentHP, message, EnemyAttackMessage){
    console.log("A"+CurrentHP);
    CurrentHP = CurrentHP - Damage;

    console.log("EnemyAttack: "+EnemyAttackMessage);


    EnemyAttackMessage = EnemyAttackMessage+"Enemy dealt "+Damage+" damage to you! Your remaining HP is "+CurrentHP+"!";
    message.channel.send(EnemyAttackMessage);

    if(CurrentHP <= 0){
      return true;
    }

  return CurrentHP;

  }

  function UpdateMana(ManaGauge, ManaChargeMin, ManaChargeMax, ManaMax){
    ManaGauge = ManaGauge + getRandomArbitrary(ManaChargeMin, ManaChargeMax);

    if(ManaGauge > ManaMax){
      ManaGauge = ManaMax;
    }

    return ManaGauge;
  }


  function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function AITurn(User, Enemy, message, UserID){
  console.log("Upon AITurn: "+User.CurrentHP);
  console.log("EnemyHP: "+Enemy.CurrentHP);
  if(Enemy.CurrentHP <= 0){
    return;
  }

  //console.log("AITurn: "+UserID);
  let Decision = getRandom(0, 100);

  console.log("Decision: "+Decision);

  if(Decision <= 3){
    if(Enemy.CurrentHP == Enemy.MaxHP){
      Decision = "Skill";
    } else{
      Decision = "Heal";
    }
  } else if(Decision <= 20){
    Decision = "Skill";
  } else{
    Decision = "Attack";
  }

  if(Decision == "Heal"){
    let HealDecision = getRandom(0, 100);
    let AmountToHeal = 0;
    if(HealDecision <= 8){
      message.channel.send("Enemy has decided to heal this turn using a **legendary** healing potion");
      if(Enemy.MaxHP >= 7000){
        AmountToHeal = Enemy.MaxHP * 0.65;
      } else{
        AmountToHeal = Enemy.MaxHP * 0.75;
      }
    } else if(HealDecision <= 60){
      message.channel.send("Enemy has decided to heal this turn using a **normal** healing potion");
      if(Enemy.MaxHP >= 7000){
        AmountToHeal = Enemy.MaxHP * 0.2;
      } else{
        AmountToHeal = Enemy.MaxHP * 0.3;
      }
      
    } else{
    message.channel.send("Enemy has decided to heal this turn using a **small** healing potion");
    if(Enemy.MaxHP >= 7000){
        AmountToHeal = Enemy.MaxHP * 0.1;
      } else{
        AmountToHeal = Enemy.MaxHP * 0.15;
      }
  }

  Enemy.CurrentHP = parseFloat(Enemy.CurrentHP) + parseFloat(Math.ceil(AmountToHeal));
  if(Enemy.CurrentHP > Enemy.MaxHP){
    Enemy.CurrentHP = Enemy.MaxHP;
  }
  message.channel.send("Enemy has healed "+AmountToHeal+" HP. Their HP is now at "+Enemy.CurrentHP);

  let FixedJSON = JSON.stringify(Enemy, null, "\t");
        fs.writeFileSync("./PetBot/settings/dungeon/Enemy_"+UserID+".txt",FixedJSON);
      }


if(Decision == "Skill"){
  let SkillSelectedEnemy = getRandom(0, 100);
  console.log("Skill selected by enemy (chance): "+SkillSelectedEnemy);

  if(SkillSelectedEnemy <= 50){
    if(Enemy.Skill_Slot1_Cooldown != 0){
      Decision = "Attack";
    } else{
      let Index = 'Enemy'; // Use enemy to ignore Index
      Skill(Enemy.Skill_Slot1_ID, User, Enemy, message, Index, UserID);
    }
  } else{
    if(Enemy.Skill_Slot2_Cooldown != 0){
      Decision = "Attack";
    } else{
      let Index = 'Enemy'; // Use enemy to ignore Index
      Skill(Enemy.Skill_Slot2_ID, User, Enemy, message, Index, UserID);
    }
  }
  

 // message.channel.send("Enemy has decided to use its skill: null");
  // TODO
}

if(Decision == "Attack"){
  let EnemyAttackMessage = "";
  console.log("Upon dec: "+User.CurrentHP);

      let FoeEvaded = CalculateEvasion(User.Evade, User.Immune, Enemy.Attribute, User.ImmuneTo);

      if(FoeEvaded == true){
        message.channel.send("Enemy attacked you, but you evaded it or were immune!");
        return;
      }


      let Damage = CalculateDamage(Enemy.Atk);

      Damage = (Damage*(Enemy.AttackMultiplier/100));
      Damage = Damage+Enemy.AttackBoost;

      let AttributeBonus = AttributeEffective(Enemy.StrongVs, Enemy.WeakVs, User.Attribute);
      if(AttributeBonus == "Strong"){
        EnemyAttackMessage = EnemyAttackMessage+"Enemy attack was super effective! ";
        Damage = Math.ceil(Damage*1.3);
      }
      if(AttributeBonus == "Weak"){
        EnemyAttackMessage = EnemyAttackMessage+"You're resistant against enemy's attack. ";
        Damage = Math.ceil(Damage*0.7);
      }

      let Critical = CalculateCritical(Enemy.CritRateMin, Enemy.CritRateMax);

      if(Critical == true){
        Damage = Math.ceil(Damage*1.33);
        EnemyAttackMessage = EnemyAttackMessage+"Critical Hit! ";
      }

      console.log("EnemyAttack: "+EnemyAttackMessage);

      let ProgressDamageReceived = fs.readFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgReceived.txt");
      ProgressDamageReceived = parseFloat(ProgressDamageReceived) + parseFloat(Damage);
      fs.writeFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgReceived.txt",ProgressDamageReceived);

      Damage = Math.ceil(Damage);

      let IsEnemyDead = DealDamageAsEnemy(Damage, User.CurrentHP, message,EnemyAttackMessage);

      if(IsEnemyDead == true){
        message.channel.send("You have been beaten by this enemy!");
        User.CurrentHP = 0;
      } else{
        User.CurrentHP = IsEnemyDead;
      }


        console.log("396: "+UserID);


        console.log(User);

        let FixedJSON = JSON.stringify(User, null, "\t");
        fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);

}

}


function UserAttack(User, Enemy, message, UserID){
  if(Enemy.CurrentHP <= 0){
    message.channel.send("This enemy is dead, wait until it is replaced.");
    return;
  }
  console.log(Enemy.Evade);
      let FoeEvaded = CalculateEvasion(Enemy.Evade, Enemy.Immune, User.Attribute, Enemy.ImmuneTo);

      if(FoeEvaded == true){
        message.channel.send("Enemy evaded or was immune!");
        AITurn(User, Enemy, message, UserID);
        return;
      }

      let Damage = CalculateDamage(User.Atk);

      Damage = (Damage*(User.AttackMultiplier/100)); // AttackMultiplier, 100 is x1
      Damage = Damage+User.AttackBoost;

      let AttackUserMessage = "";

      let AttributeBonus = AttributeEffective(User.StrongVs, User.WeakVs, Enemy.Attribute);
      if(AttributeBonus == "Strong"){
        AttackUserMessage = AttackUserMessage+"Your attack is super effective! ";
        Damage = Math.ceil(Damage*1.3);
      }
      if(AttributeBonus == "Weak"){
        AttackUserMessage = AttackUserMessage+"Enemy is resistant against your attack. ";
        Damage = Math.ceil(Damage*0.7);
      }

      if(User.ExtremeDamageAgainst == Enemy.Attribute){
        Damage = Damage * User.ExtremeDamageValue;
      }

      let Critical = CalculateCritical(User.CritRateMin+User.CriticalIncrease, User.CritRateMax+User.CriticalIncrease);

      if(Critical == true){
        Damage = Math.ceil(Damage*1.33);
        AttackUserMessage = AttackUserMessage+"Critical Hit! ";
      }

      let ProgressDamageDealt = fs.readFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgDealt.txt");
      ProgressDamageDealt = parseFloat(ProgressDamageDealt) + parseFloat(Damage);
      fs.writeFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgDealt.txt",ProgressDamageDealt);

      let IsEnemyDead = DealDamage(Damage, Enemy.CurrentHP, message, AttackUserMessage);

      if(IsEnemyDead == true){
        message.channel.send("You have beaten this enemy!");
        Enemy.CurrentHP = 0;
        AutomaticEnemyDeploy(Enemy, UserID, message);
        return;
      } else{
        Enemy.CurrentHP = IsEnemyDead;
      }


      // UPDATE DATA
      updateJsonFile("./PetBot/settings/dungeon/Enemy_"+UserID+".txt", (data) => {
      data.CurrentHP = Enemy.CurrentHP;
      return data;
      });


      let ManaGauge = UpdateMana(User.ManaGauge, User.ManaChargeMin, User.ManaChargeMax, User.ManaMax);
      if(ManaGauge >= 100 && User.InformedAboutMana == false){
        message.channel.send("You have charged your mana, you can now use your special ability.");
        User.InformedAboutMana = true;
      }

      if(ManaGauge >= User.ManaMax){
        message.channel.send("Your mana is full. You are not getting mana per attack anymore.");
      }

      updateJsonFile("./PetBot/settings/dungeon/Player_"+UserID+".txt", (data) => {
      data.ManaGauge = ManaGauge;
      return data;
      });
      
      console.log(IsEnemyDead);
      if(IsEnemyDead != true){
        AITurn(User, Enemy, message, UserID);
      }
      
    }



  function Skill(ID, User, Enemy, message, Index, UserID){
    console.log("Index is: "+Index);
    if(Index == 1){
      if(User.Skill_Slot1_Cooldown != 0){
        message.channel.send("Unable to use this skill. Cooldown left: "+User.Skill_Slot1_Cooldown+" turns");
        return "Unable";
      }
    } else if(Index == 2){
      if(User.Skill_Slot2_Cooldown != 0){
        message.channel.send("Unable to use this skill. Cooldown left: "+User.Skill_Slot2_Cooldown+" turns");
        return "Unable";
      }
    } else if(Index == 3){
      if(User.Skill_Slot3_Cooldown != 0){
        message.channel.send("Unable to use this skill. Cooldown left: "+User.Skill_Slot3_Cooldown+" turns");
        return "Unable";
      }
    }
    if(ID == "01"){
      updateJsonFile("./PetBot/settings/dungeon/Player_"+UserID+".txt", (data) => {
      data.AttackMultiplier = data.AttackMultiplier * 1.15;
      data.AttackMultiplierTurns = 5;
      data.Skill_Slot1_Cooldown = 10;
      return data;
      });

      message.channel.send("Skill activated: 15% bonus damage for 5 turns.");
      
    } 

    if(ID == "02"){
      let Chance = getRandom(0, 100);

      if(Chance <= 20){
        message.channel.send("Skill activated: Maximum HP permanently raised by 30 [Bonus: Gained Fatigue A for one turn: ATK decreased by 10%]");
        updateJsonFile("./PetBot/settings/dungeon/Player_"+UserID+".txt", (data) => {
      data.MaxHP = data.MaxHP + 30;
      data.Skill_Slot2_Cooldown = 14;
      data.AttackMultiplier = data.AttackMultiplier * 0.9;
      data.AttackMultiplierTurns = 1;
      return data;
      });
      } else if(Chance <= 50){
        message.channel.send("Skill activated: Maximum ATK permanently raised by 70. [Bonus: Gained Fatigue A for one turn: ATK decreased by 10%]");
        updateJsonFile("./PetBot/settings/dungeon/Player_"+UserID+".txt", (data) => {
      data.Atk = data.Atk + 70;
      data.Skill_Slot2_Cooldown = 14;
     data.AttackMultiplier = data.AttackMultiplier * 0.9;
      data.AttackMultiplierTurns = 1;
      return data;
      });
      } else{
        message.channel.send("Skill activated: 100 ATK boost for 4 turns.");
        updateJsonFile("./PetBot/settings/dungeon/Player_"+UserID+".txt", (data) => {
      data.AttackBoost = 100;
      data.AttackIncreaseTurns = 4;
      data.Skill_Slot2_Cooldown = 14;
      return data;
      });
      }

      
    }

    if(ID == "03"){
      let Chance = getRandom(0, 100);

      message.channel.send("Skill activated: Deals extremely heavy damage, HP reduced by 5% of Max HP (10% KO chance except for Holy classes and bosses)");

      let FoeEvaded = CalculateEvasion(Enemy.Evade, Enemy.Immune, User.Attribute, Enemy.ImmuneTo);
    
      // Doing this first because, if it evades, this won't update properly.
        User.CurrentHP = User.CurrentHP - (User.MaxHP * 0.05);
        User.Skill_Slot1_Cooldown = 7; //should be 6 but there's some bug so as a workaround I put this
        let FixedJSON = JSON.stringify(User, null, "\t");
        fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);

      if(FoeEvaded == true){
        message.channel.send("Enemy evaded or was immune!");
        AITurn(User, Enemy, message, UserID);
        return;
      }

      let Damage = CalculateDamage(User.Atk);

      Damage = (Damage*(User.AttackMultiplier/100)); // AttackMultiplier, 100 is x1
      Damage = Damage+User.AttackBoost;
      Damage = Damage*5 // boosted damage bonus

      let KO = false;
      if(Enemy.Attribute != "Holy"){
        if(Chance <= 10){
          Damage = Damage*2930239;
          KO = true;
        }
      }

      let AttributeBonus = AttributeEffective(User.StrongVs, User.WeakVs, Enemy.Attribute);
      if(AttributeBonus == "Strong"){
        message.channel.send("Your attack is super effective!");
        Damage = Math.ceil(Damage*1.3);
      }
      if(AttributeBonus == "Weak"){
        message.channel.send("Enemy is resistant against your attack attribute!");
        Damage = Math.ceil(Damage*0.7);
      }

      let Critical = CalculateCritical(70, 70); // 70 because of special power data

      if(Critical == true){
        Damage = Math.ceil(Damage*1.33);
        message.channel.send("Critical Hit!");
      }

      if(KO != true){ // KO shouldn't count towards progress
        let ProgressDamageDealt = fs.readFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgDealt.txt");
      ProgressDamageDealt = parseFloat(ProgressDamageDealt) + parseFloat(Damage);
      fs.writeFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgDealt.txt",ProgressDamageDealt);
      }
      

      let IsEnemyDead = DealDamage(Damage, Enemy.CurrentHP, message, AttackUserMessage);

      if(IsEnemyDead == true){
        message.channel.send("You have beaten this enemy!");
        Enemy.CurrentHP = 0;
      } else{
        Enemy.CurrentHP = IsEnemyDead;
      }

      


      // UPDATE DATA

      FixedJSON = JSON.stringify(User, null, "\t");
      fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);


      let FixedJSON2 = JSON.stringify(Enemy, null, "\t");
         fs.writeFileSync("./PetBot/settings/dungeon/Enemy_"+UserID+".txt",FixedJSON2);
    
  }

     if(ID == "04"){
      

      message.channel.send("Skill activated: Mana charged by 21%, lose 2% of current HP");

       updateJsonFile("./PetBot/settings/dungeon/Player_"+UserID+".txt", (data) => {
      data.CurrentHP =  data.CurrentHP - (data.CurrentHP * 0.02);
      data.ManaGauge = data.ManaGauge + 21;
      data.Skill_Slot2_Cooldown = 3;
      return data;
      });

      
    }

    if(ID == "05"){
      

      message.channel.send("Skill activated: Increases ATK by 40% for 2 turns, increases Crit chance by 3% for 2 turns. Deals 300% damage against Human enemies for one turn.");


      User.AttackMultiplier = User.AttackMultiplier * 1.4;
      User.AttackMultiplierTurns = 2;
      User.CriticalIncrease = 3;
      User.CriticalIncreaseTurns = 2;
      User.ExtremeDamageValue = 3;
      User.ExtremeDamageAgainst = "Human";
      User.ExtremeDamageTurns = 1;

      User.Skill_Slot1_Cooldown = 17;

      let FixedJSON = JSON.stringify(User, null, "\t");
        fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);

      
    }

 if(ID == "06"){
      let Chance = getRandom(0,100);

      if(Chance <= 50){
        message.channel.send("Skill activated: Gains 'Immune to All' for one turn.");
        User.ImmuneTurns = 1;
        User.ImmuneTo = "All";
      } else{
        message.channel.send("Skill activated: Gains 'Immune to Fairy' for one turn.");
        User.ImmuneTurns = 1;
        User.ImmuneTo = "Fairy";
      }

      User.Skill_Slot2_Cooldown = 21;

      let FixedJSON = JSON.stringify(User, null, "\t");
        fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);

      
    }

     if(ID == "07"){
      message.channel.send("Skill activated: Increases ATK by 9% for 5 turns.");
      User.AttackMultiplier = User.AttackMultiplier * 1.09;
      User.AttackMultiplierTurns = 5;
      User.Skill_Slot1_Cooldown = 11;

      let FixedJSON = JSON.stringify(User, null, "\t");
        fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);

      
    }


    if(ID == "08"){
      message.channel.send("Skill activated: Increases ATK by 30% for 1 turn.");
      User.AttackMultiplier = User.AttackMultiplier * 1.3;
      User.AttackMultiplierTurns = 1;
      User.Skill_Slot2_Cooldown = 13;

      let FixedJSON = JSON.stringify(User, null, "\t");
        fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);
      
    }

    if(ID == "09"){
      message.channel.send("Skill activated: Increases critical rate by 50% for 1 turn.");
      User.CriticalIncrease = 50;
      User.CriticalIncreaseTurns = 1;
      User.Skill_Slot3_Cooldown = 15;

      let FixedJSON = JSON.stringify(User, null, "\t");
        fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);

      
    }

    if(ID == "E01"){
      

      message.channel.send("Enemy skill activated: [Fury] ATK increased by 10% for 2 turns.");

      Enemy.AttackMultiplier = Enemy.AttackMultiplier * 1.1;
      Enemy.AttackMultiplierTurns = 2;
      Enemy.Skill_Slot2_Cooldown = 6;

      let FixedJSON = JSON.stringify(Enemy, null, "\t");
        fs.writeFileSync("./PetBot/settings/dungeon/Enemy_"+UserID+".txt",FixedJSON);
      
    }

    if(ID == "E02"){
      
      message.channel.send("Enemy skill activated: [Great Fury] ATK increased by 20% for 4 turns.");

      Enemy.AttackMultiplier = Enemy.AttackMultiplier * 1.2;
      Enemy.AttackMultiplierTurns = 4;
      Enemy.Skill_Slot2_Cooldown = 8;

      let FixedJSON = JSON.stringify(Enemy, null, "\t");
        fs.writeFileSync("./PetBot/settings/dungeon/Enemy_"+UserID+".txt",FixedJSON);

      
    }

    if(ID == "E03"){
      
      message.channel.send("Enemy skill activated: [Sound of the Death] ATK increased by 25% for 6 turns.");


      Enemy.AttackMultiplier = Enemy.AttackMultiplier * 1.25;
      Enemy.AttackMultiplierTurns = 6;
      Enemy.Skill_Slot1_Cooldown = 12;

      let FixedJSON = JSON.stringify(Enemy, null, "\t");
        fs.writeFileSync("./PetBot/settings/dungeon/Enemy_"+UserID+".txt",FixedJSON);

      
    }

    if(ID == "E04"){
      
      message.channel.send("Enemy skill activated: [Warrior Spirit] ATK increased by 30% for 8 turns.");

      Enemy.AttackMultiplier = Enemy.AttackMultiplier * 1.3;
      Enemy.AttackMultiplierTurns = 8;
      Enemy.Skill_Slot2_Cooldown = 15;


      let FixedJSON = JSON.stringify(User, null, "\t");
        fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);
      
    }

    if(ID == "E05"){
      let ExperimentingChance = getRandom(0, 100);

      if(ExperimentingChance <= 20){
        message.channel.send("Enemy skill activated: [Experimenting! (Worked - 20% chance)] ATK increased by 60% for 3 turns");

        Enemy.AttackMultiplier = Enemy.AttackMultiplier * 1.60;
        Enemy.AttackMultiplierTurns = 3;
        Enemy.Skill_Slot2_Cooldown = 12;
        let FixedJSON = JSON.stringify(Enemy, null, "\t");
        fs.writeFileSync("./PetBot/settings/dungeon/Enemy_"+UserID+".txt",FixedJSON);
      } else{

      message.channel.send("Enemy skill activated: [Experimenting!] (Failed - 80% chance)] ATK decreased by 15% for 4 turns.");
      Enemy.AttackMultiplier = Enemy.AttackMultiplier * 0.75;
      Enemy.AttackMultiplierTurns = 4;
      let FixedJSON = JSON.stringify(Enemy, null, "\t");
        fs.writeFileSync("./PetBot/settings/dungeon/Enemy_"+UserID+".txt",FixedJSON);
        }
     }


    if(ID == "E06"){
      let ExperimentingChance = getRandom(0, 100);
      let AttributeRandomChance = getRandom(0, 90);
      let Attribute = "Dragon";
      if(AttributeRandomChance <= 10){
        Attribute = "Dragon";
      } else if(AttributeRandomChance <= 20){
        Attribute = "Fairy";
      } else if(AttributeRandomChance <= 30){
        Attribute = "Human";
      } else if(AttributeRandomChance <= 40){
        Attribute = "Dark";
      } else if(AttributeRandomChance <= 50){
        Attribute = "Holy";
      } else if(AttributeRandomChance <= 60){
        Attribute = "Unknown";
      } else if(AttributeRandomChance <= 70){
        Attribute = "Undead";
      } else if(AttributeRandomChance <= 80){
        Attribute = "N/A";
      }

      if(ExperimentingChance <= 20){
        message.channel.send("Enemy skill activated: [A new me] Enemy attribute changes randomly. Attrib: "+Attribute);

       updateJsonFile("./PetBot/settings/dungeon/Enemy_"+UserID+".txt", (data) => {
      data.Attribute = Attribute;
      return data;
      });

      
    }
  // message.channel.send("Skill is now active"); 
  }

  if(ID == "E07"){
        message.channel.send("Enemy skill activated: [Vampiric Bless] ATK increased by 400% for the next turn.)");

       Enemy.AttackMultiplier = Enemy.AttackMultiplier * 4;
        Enemy.AttackMultiplierTurns = 2;
        Enemy.Skill_Slot1_Cooldown = 4;
        let FixedJSON = JSON.stringify(Enemy, null, "\t");
        fs.writeFileSync("./PetBot/settings/dungeon/Enemy_"+UserID+".txt",FixedJSON);

  // message.channel.send("Skill is now active"); 
  }

   if(ID == "E08"){
      
      message.channel.send("Enemy skill activated: [Sound of Pain] ATK decreased by 90% for the next turn. Decreases player's special gauge in 20%");


      Enemy.AttackMultiplier = Enemy.AttackMultiplier * 0.1;
      Enemy.AttackMultiplierTurns = 2;
      Enemy.Skill_Slot2_Cooldown = 8;
      User.ManaGauge = User.ManaGauge - 20;
      let FixedJSON = JSON.stringify(Enemy, null, "\t");
        fs.writeFileSync("./PetBot/settings/dungeon/Enemy_"+UserID+".txt",FixedJSON);
      let FixedJSON2 = JSON.stringify(User, null, "\t");
        fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);
      
    }

    if(ID == "E09"){
      
      message.channel.send("Enemy skill activated: [Regeneration E] Restores 10% of HP. Then increases Max HP by 10%.");

      Enemy.CurrentHP = Enemy.CurrentHP + (Enemy.MaxHP * 0.1);
      Enemy.MaxHP = Enemy.MaxHP + (Enemy.MaxHP * 0.1);
      Enemy.Skill_Slot1_Cooldown = 7;

      let FixedJSON = JSON.stringify(Enemy, null, "\t");
        fs.writeFileSync("./PetBot/settings/dungeon/Enemy_"+UserID+".txt",FixedJSON);
      
    }

    if(ID == "E10"){
      
      message.channel.send("Enemy skill activated: [Regeneration D] Increases Max HP by 10%. Then restores 10% of HP.");

      Enemy.MaxHP = Enemy.MaxHP + (Enemy.MaxHP * 0.1);
      Enemy.CurrentHP = Enemy.CurrentHP + (Enemy.MaxHP * 0.1);
      Enemy.Skill_Slot2_Cooldown = 8;

      let FixedJSON = JSON.stringify(Enemy, null, "\t");
        fs.writeFileSync("./PetBot/settings/dungeon/Enemy_"+UserID+".txt",FixedJSON);
      
    }

     if(ID == "E11"){
      
      message.channel.send("Enemy skill activated: [Resize] Increases its own ATK by 5%. Decreases its own evasion by 1%.");

      Enemy.Atk = Enemy.Atk + (Enemy.Atk * 0.05);
      Enemy.Evade = Enemy.Evade - 1;
      //Enemy.Skill_Slot1_Cooldown = 3;
      // This skill has no cooldown

      let FixedJSON = JSON.stringify(Enemy, null, "\t");
        fs.writeFileSync("./PetBot/settings/dungeon/Enemy_"+UserID+".txt",FixedJSON);
      
    }

    if(ID == "E12"){
      
      message.channel.send("Enemy skill activated: [Bloody Intention] Increases its own ATK by 1000%. Decreases its own evasion all the way down to 0.");

      Enemy.Atk = Enemy.Atk * 10;
      Enemy.Evade = 0;
      Enemy.Skill_Slot2_Cooldown = 500;

      let FixedJSON = JSON.stringify(Enemy, null, "\t");
        fs.writeFileSync("./PetBot/settings/dungeon/Enemy_"+UserID+".txt",FixedJSON);
      
    }

    if(ID == "E13"){
      
      message.channel.send("Enemy skill activated: [Protection of Dark A] Decreases player's ATK by 80% for 3 turns.");

      User.AttackMultiplier = User.AttackMultiplier * 0.2;
      User.AttackMultiplierTurns = 3;
      Enemy.Skill_Slot1_Cooldown = 9;

      let FixedJSON = JSON.stringify(Enemy, null, "\t");
        fs.writeFileSync("./PetBot/settings/dungeon/Enemy_"+UserID+".txt",FixedJSON);

      let FixedJSON2 = JSON.stringify(User, null, "\t");
        fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);
      
    }

    if(ID == "E14"){
      
      message.channel.send("Enemy skill activated: [Cut of Sword] Increases own ATK by 15% for 5 turns.");

      Enemy.AttackMultiplier = Enemy.AttackMultiplier * 1.15;
      Enemy.AttackMultiplierTurns = 5;
      Enemy.Skill_Slot1_Cooldown = 11;

      let FixedJSON = JSON.stringify(Enemy, null, "\t");
        fs.writeFileSync("./PetBot/settings/dungeon/Enemy_"+UserID+".txt",FixedJSON);
      
    }

      if(ID == "E15"){
      
      message.channel.send("Enemy skill activated: [Levitation] Increases own evasion rate by 20% for 2 turns.");

      Enemy.EvadeExtra = Enemy.EvadeExtra + 20;
      Enemy.EvadeExtraTurns = 2;

      let FixedJSON = JSON.stringify(Enemy, null, "\t");
        fs.writeFileSync("./PetBot/settings/dungeon/Enemy_"+UserID+".txt",FixedJSON);
      
    }

}

function GenericTurn(User, Enemy, message, UserID){

  console.log("GenericTurn");
  console.log(User.Skill_Slot1_Cooldown);

  if(User.AttackMultiplierTurns != 0){
    User.AttackMultiplierTurns = User.AttackMultiplierTurns-1;

    let FixedJSON = JSON.stringify(User, null, "\t");
    fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);
  }
  if(User.AttackMultiplierTurns == 0){
    User.AttackMultiplier = 100;
    let FixedJSON = JSON.stringify(User, null, "\t");
        fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);
  }

  if(Enemy.AttackMultiplierTurns != 0){
    Enemy.AttackMultiplierTurns = Enemy.AttackMultiplierTurns-1;

    let FixedJSON = JSON.stringify(Enemy, null, "\t");
    fs.writeFileSync("./PetBot/settings/dungeon/Enemy_"+UserID+".txt",FixedJSON);
  }
  if(Enemy.AttackMultiplierTurns == 0){
    Enemy.AttackMultiplier = 100;
    let FixedJSON = JSON.stringify(Enemy, null, "\t");
        fs.writeFileSync("./PetBot/settings/dungeon/Enemy_"+UserID+".txt",FixedJSON);
  }

   if(Enemy.EvadeExtraTurns != 0){
    Enemy.EvadeExtraTurns = Enemy.EvadeExtraTurns-1;

    let FixedJSON = JSON.stringify(Enemy, null, "\t");
    fs.writeFileSync("./PetBot/settings/dungeon/Enemy_"+UserID+".txt",FixedJSON);
  }

  if(Enemy.EvadeExtraTurns == 0){
    Enemy.EvadeExtra = 0;
    let FixedJSON = JSON.stringify(Enemy, null, "\t");
        fs.writeFileSync("./PetBot/settings/dungeon/Enemy_"+UserID+".txt",FixedJSON);
  }

  if(Enemy.Skill_Slot1_Cooldown != 0){
    console.log("Skill_Slot1_Cooldown reduced to: "+User.Skill_Slot1_Cooldown);
    Enemy.Skill_Slot1_Cooldown = Enemy.Skill_Slot1_Cooldown - 1;
    let FixedJSON = JSON.stringify(Enemy, null, "\t");
        fs.writeFileSync("./PetBot/settings/dungeon/Enemy_"+UserID+".txt",FixedJSON);
  }

  if(Enemy.Skill_Slot2_Cooldown != 0){
    Enemy.Skill_Slot2_Cooldown = Enemy.Skill_Slot2_Cooldown - 1;
    let FixedJSON = JSON.stringify(Enemy, null, "\t");
        fs.writeFileSync("./PetBot/settings/dungeon/Enemy_"+UserID+".txt",FixedJSON);
}

  if(Enemy.Skill_Slot3_Cooldown != 0){
    Enemy.Skill_Slot3_Cooldown = Enemy.Skill_Slot3_Cooldown - 1;
    let FixedJSON = JSON.stringify(Enemy, null, "\t");
        fs.writeFileSync("./PetBot/settings/dungeon/Enemy_"+UserID+".txt",FixedJSON);
}

  if(User.Skill_Slot1_Cooldown == 1){
    message.channel.send("Cooldown for your first skill is over.");
  }
  if(User.Skill_Slot1_Cooldown != 0){
    console.log("Skill_Slot1_Cooldown reduced to: "+User.Skill_Slot1_Cooldown);
    User.Skill_Slot1_Cooldown = User.Skill_Slot1_Cooldown - 1;
    let FixedJSON = JSON.stringify(User, null, "\t");
        fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);
  }
  if(User.Skill_Slot2_Cooldown == 1){
    message.channel.send("Cooldown for your second skill is over.");
  }
  if(User.Skill_Slot2_Cooldown != 0){
    User.Skill_Slot2_Cooldown = User.Skill_Slot2_Cooldown - 1;
    let FixedJSON = JSON.stringify(User, null, "\t");
        fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);
}

if(User.Skill_Slot3_Cooldown == 1){
    message.channel.send("Cooldown for your third skill is over.");
  }
  if(User.Skill_Slot3_Cooldown != 0){
    User.Skill_Slot3_Cooldown = User.Skill_Slot3_Cooldown - 1;
    let FixedJSON = JSON.stringify(User, null, "\t");
        fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);
}

if(User.AttackIncreaseTurns == 1){
  message.channel.send("ATK boost is now over.");
    User.AttackBoost = 0;
    let FixedJSON = JSON.stringify(User, null, "\t");
        fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);
}

if(User.AttackIncreaseTurns != 0){
    User.AttackIncreaseTurns = User.AttackIncreaseTurns - 1;
    let FixedJSON = JSON.stringify(User, null, "\t");
        fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);
}

if(User.ExtremeDamageTurns == 1){
    User.ExtremeDamageValue = 1;
    User.ExtremeDamageAgainst = "None";
    let FixedJSON = JSON.stringify(User, null, "\t");
        fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);
}

if(User.ExtremeDamageTurns != 0){
    User.ExtremeDamageTurns = User.ExtremeDamageTurns - 1;
    let FixedJSON = JSON.stringify(User, null, "\t");
        fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);
}

if(User.CriticalIncreaseTurns == 1){
    User.CriticalIncrease = 0;
    let FixedJSON = JSON.stringify(User, null, "\t");
        fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);
}

if(User.CriticalIncreaseTurns != 0){
    User.CriticalIncreaseTurns = User.CriticalIncreaseTurns - 1;
    let FixedJSON = JSON.stringify(User, null, "\t");
        fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);
}

let ObtainedEXP = getRandom(10,70);
      User.CurrentEXP = User.CurrentEXP + ObtainedEXP;

      if(User.CurrentEXP >= User.NeededEXP){
        message.channel.send("**Level up!** ATK and MaxHP have increased by 10%.");
        User.Atk = User.Atk + (User.Atk*0.1)
        User.CurrentHP = User.CurrentHP + (User.MaxHP*0.1);
        User.MaxHP = User.MaxHP + (User.MaxHP * 0.1);
        User.Level = User.Level + 1;
        User.NeededEXP = Math.round(User.NeededEXP * 2 + ((User.NeededEXP * 0.005) * (User.NeededEXP * 0.005) * 3) + (500*User.Level));
        message.channel.send("Updated level stuff");
      }
      let FixedJSON = JSON.stringify(User, null, "\t");
      fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);



}


function Special(User, Enemy, message, UserID){
  User.ManaGauge = User.ManaGauge - 100;
  User.InformedAboutMana = false;
  let AttackUserMessage = "";

  if(User.SpecialID == "01"){ // Legionary
    message.channel.send("**Haec omnia iter nostrum pro me ad deum, ut ostenderet tibi quod vere est misericordiae, nam ego ille qui est salvificem gloria... Sanctus Terra Bellator!**\n\nSpecial power: Deals boosted damage (70% crit chance), increases ATK for 2 turns.");
    let FoeEvaded = CalculateEvasion(Enemy.Evade, Enemy.Immune, User.Attribute, Enemy.ImmuneTo);

      if(FoeEvaded == true){
        message.channel.send("Enemy evaded or was immune!");
        AITurn(User, Enemy, message, UserID);
        return;
      }

      let Damage = CalculateDamage(User.Atk);

      Damage = (Damage*(User.AttackMultiplier/100)); // AttackMultiplier, 100 is x1
      Damage = Damage+User.AttackBoost;
      Damage = Damage*1.75 // boosted damage bonus

      let AttributeBonus = AttributeEffective(User.StrongVs, User.WeakVs, Enemy.Attribute);
      if(AttributeBonus == "Strong"){
        AttackUserMessage = AttackUserMessage + "Your attack is super effective! ";
        Damage = Math.ceil(Damage*1.3);
      }
      if(AttributeBonus == "Weak"){
         AttackUserMessage = AttackUserMessage + "Enemy is resistant against your attack attribute! ";
        Damage = Math.ceil(Damage*0.7);
      }

      let Critical = CalculateCritical(70, 70); // 70 because of special power data

      if(Critical == true){
        Damage = Math.ceil(Damage*1.33);
        message.channel.send("Critical Hit!");
      }

      let ProgressDamageDealt = fs.readFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgDealt.txt");
      ProgressDamageDealt = parseFloat(ProgressDamageDealt) + parseFloat(Damage);
      fs.writeFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgDealt.txt",ProgressDamageDealt);

      let IsEnemyDead = DealDamage(Damage, Enemy.CurrentHP, message, AttackUserMessage);

      if(IsEnemyDead == true){
        message.channel.send("You have beaten this enemy!");
        Enemy.CurrentHP = 0;
      } else{
        Enemy.CurrentHP = IsEnemyDead;
      }


      // UPDATE DATA
      let FixedJSON = JSON.stringify(Enemy, null, "\t");
        fs.writeFileSync("./PetBot/settings/dungeon/Enemy_"+UserID+".txt",FixedJSON);

      updateJsonFile("./PetBot/settings/dungeon/Player_"+UserID+".txt", (data) => {
      data.ManaGauge = data.ManaGauge - 100;
      data.InformedAboutMana = User.InformedAboutMana;
      return data;
      });

      console.log(IsEnemyDead);
      if(IsEnemyDead != true){
        AITurn(User, Enemy, message, UserID);
      }
    }

  if(User.SpecialID == "02"){ // Shadow
    let SpecialChance = getRandom(0, 100);
    console.log(SpecialChance);
    
    let HealingAmount = 0;
    if(SpecialChance <= 60){
      message.channel.send("**Shall god hate me! Shall myself become god, for this is Satan's Doing, this is my rebellion! Ultimate Dark Revival!**\n\nSpecial power: Full heal.");
      HealingAmount = 1; // Full Heal
    } else if(SpecialChance <= 70){
      message.channel.send("**Shall god hate me! Shall myself become god, for this is Satan's Doing, this is my rebellion! Ultimate Dark Revival!**\n\nSpecial power: Half heal.");
      HealingAmount = 0.5; // Half Heal
    } else{
      message.channel.send("**Shall god hate me! Shall myself become god, for this is Satan's Doing, this is my rebellion! Ultimate Dark Revival!**\n\nSpecial power: 30% of HP heal + ATK decreased by 10% for 2 turns.");
      HealingAmount = 0.3; // 30% Heal + slight damage decrease for 2 turns
      User.AttackMultiplier = User.AttackMultiplier * 0.9;
      User.AttackMultiplierTurns = User.AttackMultiplierTurns + 2;
    }

    console.log(HealingAmount);
    if(HealingAmount == 0){
      message.channel.send("Warning: An issue has ocurred. Error code 1051. Aborted command.");
      return;
    }
    User.CurrentHP = User.CurrentHP + (User.MaxHP * HealingAmount);
    if(User.CurrentHP > User.MaxHP){
      User.CurrentHP = User.MaxHP;
    }

    updateJsonFile("./PetBot/settings/dungeon/Player_"+UserID+".txt", (data) => {
      data.CurrentHP = User.CurrentHP;
      data.AttackMultiplier = User.AttackMultiplier;
      data.AttackIncreaseTurns = User.AttackMultiplierTurns;
      data.ManaGauge = User.ManaGauge;
      data.InformedAboutMana = User.InformedAboutMana;
      return data;
      });

}

   if(User.SpecialID == "03"){ // Dragon Demon

    let Chance = getRandom(0,100);

    if(Chance <= 0 || Enemy.Attribute == "Human"){
      message.channel.send("**Kruziikqostiid Se Fin Revakdinok Nau Muz!**\n\nSpecial power: KO an enemy. (Succesful).");

    

      let Damage = 999999999;



      let IsEnemyDead = DealDamage(Damage, Enemy.CurrentHP, message, AttackUserMessage);

        message.channel.send("You have beaten this enemy!");
        Enemy.CurrentHP = 0;


      // UPDATE DATA
      let FixedJSON = JSON.stringify(Enemy, null, "\t");
        fs.writeFileSync("./PetBot/settings/dungeon/Enemy_"+UserID+".txt",FixedJSON);

      updateJsonFile("./PetBot/settings/dungeon/Player_"+UserID+".txt", (data) => {
      data.ManaGauge = User.ManaGauge;
      data.InformedAboutMana = User.InformedAboutMana;
      return data;
      });

      console.log(IsEnemyDead);
  } else{
    message.channel.send("**Kruziikqostiid Se Fin Revakdinok Nau Muz!**\n\nSpecial power: Deals 10% of normal damage. (Failed).");
    let FoeEvaded = CalculateEvasion(Enemy.Evade, Enemy.Immune, User.Attribute, Enemy.ImmuneTo);

      if(FoeEvaded == true){
        message.channel.send("Enemy evaded or was immune!");
        AITurn(User, Enemy, message, UserID);
        return;
      }

      let Damage = CalculateDamage(User.Atk);

      Damage = (Damage*(User.AttackMultiplier/100)); // AttackMultiplier, 100 is x1
      Damage = Damage+User.AttackBoost;
      Damage = Damage*0.1 // weak damage

      let AttributeBonus = AttributeEffective(User.StrongVs, User.WeakVs, Enemy.Attribute);
      if(AttributeBonus == "Strong"){
        AttackUserMessage = AttackUserMessage + "Your attack is super effective! ";
        Damage = Math.ceil(Damage*1.3);
      }
      if(AttributeBonus == "Weak"){
        AttackUserMessage = AttackUserMessage + "Enemy is resistant against your attack attribute! ";
        Damage = Math.ceil(Damage*0.7);
      }

      let Critical = CalculateCritical((User.CritRateMin+User.CriticalIncrease), (User.CritRateMax+User.CriticalIncrease));

      if(Critical == true){
        Damage = Math.ceil(Damage*1.33);
        message.channel.send("Critical Hit!");
      }

      let ProgressDamageDealt = fs.readFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgDealt.txt");
      ProgressDamageDealt = parseFloat(ProgressDamageDealt) + parseFloat(Damage);
      fs.writeFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgDealt.txt",ProgressDamageDealt);

      let IsEnemyDead = DealDamage(Damage, Enemy.CurrentHP, message, AttackUserMessage);

      if(IsEnemyDead == true){
        message.channel.send("You have beaten this enemy!");
        Enemy.CurrentHP = 0;
      } else{
        Enemy.CurrentHP = IsEnemyDead;
      }

      // UPDATE DATA
      let FixedJSON = JSON.stringify(Enemy, null, "\t");
        fs.writeFileSync("./PetBot/settings/dungeon/Enemy_"+UserID+".txt",FixedJSON);

      updateJsonFile("./PetBot/settings/dungeon/Player_"+UserID+".txt", (data) => {
      data.ManaGauge = User.ManaGauge;
      data.InformedAboutMana = User.InformedAboutMana;
      return data;
      });

      console.log(IsEnemyDead);
      if(IsEnemyDead != true){
        AITurn(User, Enemy, message, UserID);
      }
    }
  }

     if(User.SpecialID == "04"){ // Arthur

      let DamageChance = getRandom(300,600);

    message.channel.send("**Oh sword that controls the breathing of the stars. Sword that lights on the torrent of life. Lend me your power! Excalibur!**\n\nSpecial power: Deals heavy variable damage (300-600%) [This time: "+DamageChance+"%]. Recovers 20% mana after used.");
    let FoeEvaded = CalculateEvasion(Enemy.Evade, Enemy.Immune, User.Attribute, Enemy.ImmuneTo);

      if(FoeEvaded == true){
        message.channel.send("Enemy evaded or was immune!");
        AITurn(User, Enemy, message, UserID);
        return;
      }

      let Damage = CalculateDamage(User.Atk);

      Damage = (Damage*(User.AttackMultiplier/100)); // AttackMultiplier, 100 is x1
      Damage = Damage+User.AttackBoost;
      Damage = Damage*(DamageChance/100) // boosted damage bonus

      let AttributeBonus = AttributeEffective(User.StrongVs, User.WeakVs, Enemy.Attribute);
      if(AttributeBonus == "Strong"){
        AttackUserMessage = AttackUserMessage + "Your attack is super effective! ";
        Damage = Math.ceil(Damage*1.3);
      }
      if(AttributeBonus == "Weak"){
         AttackUserMessage = AttackUserMessage + "Enemy is resistant against your attack attribute! ";
        Damage = Math.ceil(Damage*0.7);
      }

      let Critical = CalculateCritical((User.CritRateMin+User.CriticalIncrease), (User.CritRateMax+User.CriticalIncrease));

      if(Critical == true){
        Damage = Math.ceil(Damage*1.33);
        message.channel.send("Critical Hit!");
      }

      let ProgressDamageDealt = fs.readFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgDealt.txt");
      ProgressDamageDealt = parseFloat(ProgressDamageDealt) + parseFloat(Damage);
      fs.writeFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgDealt.txt",ProgressDamageDealt);

      let IsEnemyDead = DealDamage(Damage, Enemy.CurrentHP, message, AttackUserMessage);

      if(IsEnemyDead == true){
        message.channel.send("You have beaten this enemy!");
        Enemy.CurrentHP = 0;
      } else{
        Enemy.CurrentHP = IsEnemyDead;
      }


      // UPDATE DATA
      let FixedJSON = JSON.stringify(Enemy, null, "\t");
        fs.writeFileSync("./PetBot/settings/dungeon/Enemy_"+UserID+".txt",FixedJSON);

      updateJsonFile("./PetBot/settings/dungeon/Player_"+UserID+".txt", (data) => {
      data.ManaGauge = User.ManaGauge; // 20% recovered
      data.ManaGauge = data.ManaGauge + 20;
      data.InformedAboutMana = User.InformedAboutMana;
      return data;
      });

      console.log(IsEnemyDead);
      if(IsEnemyDead != true){
        AITurn(User, Enemy, message, UserID);
       }
     }
   }

  function Shopping(UserID, ItemID, User, message){

    if(fs.existsSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt") == false){
     fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt","3000");
  }
  if(fs.existsSync("././PetBot/settings/PetCoins/"+UserID+"/SRTicket.txt") == false){
     fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/SRTicket.txt","0");
  }
  if(fs.existsSync("././settings/PetCoins/"+UserID+"/SSRTicket.txt") == false){
     fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/SSRTicket.txt","0");
  }
  if(fs.existsSync("././PetBot/settings/PetCoins/"+UserID+"/URTicket.txt") == false){
     fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/URTicket.txt","1");
  }


  if(User.CurrentHP <= 0){
    if(ItemID != 9){
      message.channel.send("You can't buy anything except the revival potion once you are dead.");
      return;
    }
  }
  



    if(ItemID == 0){

      let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt");
      CurrentAmount = parseInt(CurrentAmount);
      if(CurrentAmount < 300){
      message.channel.send("You don't own enough PetCoins");
      return;
      }

      User.CurrentHP = Math.round(User.CurrentHP + User.MaxHP * 0.1);
      message.channel.send("You just bought: 10% Heal Restore");
      fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt", CurrentAmount-300);

    } else if(ItemID == 1){

      let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt");
      CurrentAmount = parseInt(CurrentAmount);
      if(CurrentAmount < 1000){
      message.channel.send("You don't own enough PetCoins");
      return;
      }

      User.CurrentHP = Math.round(User.CurrentHP + User.MaxHP * 0.4);
      message.channel.send("You just bought: 40% Heal Restore");
      fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt", CurrentAmount-1000);

    } else if(ItemID == 2){

      let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt");
      CurrentAmount = parseInt(CurrentAmount);
      if(CurrentAmount < 2300){
      message.channel.send("You don't own enough PetCoins");
      return;
      }

      User.CurrentHP = Math.round(User.MaxHP);
      message.channel.send("You just bought: Full Heal Restore");
      fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt", CurrentAmount-2300);

    } else if(ItemID == 3){

      let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt");
      CurrentAmount = parseInt(CurrentAmount);
      if(CurrentAmount < 5000){
      message.channel.send("You don't own enough PetCoins");
      return;
      }

      User.Skill_Slot1_Cooldown = parseInt(User.Skill_Slot1_Cooldown) - 2;
      message.channel.send("You just bought: Cooldown Decreasing Potion (SKILL 1) [PetCoins]");
      fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt", CurrentAmount-5000);

    } else if(ItemID == 4){

      let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/MakiCookies.txt");
      CurrentAmount = parseInt(CurrentAmount);
      if(CurrentAmount < 10){
      message.channel.send("You don't own enough MakiCookies");
      return;
      }

      User.Skill_Slot1_Cooldown = parseInt(User.Skill_Slot1_Cooldown) - 2;
      message.channel.send("You just bought: Cooldown Decreasing Potion (SKILL 1) [MakiCookies]");
      fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/MakiCookies.txt", CurrentAmount-10);

    } else if(ItemID == 5){

      let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt");
      CurrentAmount = parseInt(CurrentAmount);
      if(CurrentAmount < 5000){
      message.channel.send("You don't own enough PetCoins");
      return;
      }

      User.Skill_Slot2_Cooldown = parseInt(User.Skill_Slot2_Cooldown) - 2;
      message.channel.send("You just bought: Cooldown Decreasing Potion (SKILL 2) [PetCoins]");
      fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt", CurrentAmount-5000);

    } else if(ItemID == 6){

      let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/MakiCookies.txt");
      CurrentAmount = parseInt(CurrentAmount);
      if(CurrentAmount < 10){
      message.channel.send("You don't own enough MakiCookies");
      return;
      }

      User.Skill_Slot2_Cooldown = parseInt(User.Skill_Slot2_Cooldown) - 2;
      message.channel.send("You just bought: Cooldown Decreasing Potion (SKILL 2) [MakiCookies]");
      fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/MakiCookies.txt", CurrentAmount-10);

    } else if(ItemID == 7){

      let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt");
      CurrentAmount = parseInt(CurrentAmount);
      if(CurrentAmount < 5000){
      message.channel.send("You don't own enough PetCoins");
      return;
      }

      User.Skill_Slot3_Cooldown = parseInt(User.Skill_Slot3_Cooldown) - 2;
      message.channel.send("You just bought: Cooldown Decreasing Potion (SKILL 3) [PetCoins]");
      fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt", CurrentAmount-5000);

    } else if(ItemID == 8){

      let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/MakiCookies.txt");
      CurrentAmount = parseInt(CurrentAmount);
      if(CurrentAmount < 10){
      message.channel.send("You don't own enough MakiCookies");
      return;
      }

      User.Skill_Slot3_Cooldown = parseInt(User.Skill_Slot2_Cooldown) - 3;
      message.channel.send("You just bought: Cooldown Decreasing Potion (SKILL 3) [MakiCookies]");
      fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/MakiCookies.txt", CurrentAmount-10);

    } else if(ItemID == 9){

      if(User.CurrentHP > 0){
        message.channel.send("You can only buy this item if you have died.");
        return;
      }

      let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt");
      CurrentAmount = parseInt(CurrentAmount);
      if(CurrentAmount < 3000){
      message.channel.send("You don't own enough PetCoins");
      return;
      }

      User.CurrentHP = User.MaxHP;
      message.channel.send("You just bought: Revival Potion [PetCoins]");
      fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt", CurrentAmount-3000);

    } else if(ItemID == 10){

      if(User.CurrentHP > 0){
        message.channel.send("You can only buy this item if you have died.");
        return;
      }

      let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/MakiCookies.txt");
      CurrentAmount = parseInt(CurrentAmount);
      if(CurrentAmount < 50){
      message.channel.send("You don't own enough Maki Cookies");
      return;
      }

      User.CurrentHP = User.MaxHP;
      message.channel.send("You just bought: Revival Potion [MakiCookies]");
      fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/MakiCookies.txt", CurrentAmount-50);

    } else if(ItemID == 11){

      let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt");
      CurrentAmount = parseInt(CurrentAmount);
      if(CurrentAmount < 4000){
      message.channel.send("You don't own enough PetCoins");
      return;
      }

      User.AttackMultiplier = User.AttackMultiplier * 1.25;
      User.AttackMultiplierTurns = 3;
      message.channel.send("You just bought: Strength Potion [PetCoins]");
      fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt", CurrentAmount-4000);

    } else if(ItemID == 12){

      let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/MakiCookies.txt");
      CurrentAmount = parseInt(CurrentAmount);
      if(CurrentAmount < 10){
      message.channel.send("You don't own enough MakiCookies");
      return;
      }

      User.AttackMultiplier = User.AttackMultiplier * 1.25;
      User.AttackMultiplierTurns = 3;
      message.channel.send("You just bought: Strength Potion [MakiCookies]");
      fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/MakiCookies.txt", CurrentAmount-10);

    } else if(ItemID == 13){

      let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt");
      CurrentAmount = parseInt(CurrentAmount);
      if(CurrentAmount < 4500){
      message.channel.send("You don't own enough PetCoins");
      return;
      }

      User.ManaGauge = User.ManaGauge + 25;
      message.channel.send("You just bought: Mana Gauge Drink [PetCoins]");
      fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt", CurrentAmount-4500);

    } else if(ItemID == 14){

      let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/MakiCookies.txt");
      CurrentAmount = parseInt(CurrentAmount);
      if(CurrentAmount < 20){
      message.channel.send("You don't own enough MakiCookies");
      return;
      }

      User.ManaGauge = User.ManaGauge + 25;
      message.channel.send("You just bought: Mana Gauge Drink [MakiCookies]");
      fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/MakiCookies.txt", CurrentAmount-20);

    } else{
      message.channel.send("That ID doesn't exist.");
    }

    let FixedJSON = JSON.stringify(User, null, "\t");
    fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);

  }

  function AutomaticEnemyDeploy(Enemy, UserID, message){
    let EnemyChance = getRandom(0,100);
    let EnemyName = "";


    if(EnemyChance < 10){
      EnemyName = "UnknownBeing";
    } else if(EnemyChance < 20){
      EnemyName = "DarkFairy";
    } else if(EnemyChance < 30){
      EnemyName = "Dragon";
    } else if(EnemyChance < 40){
      EnemyName = "DragonBaby";
    } else if(EnemyChance < 50){
      EnemyName = "EvilBeing";
    } else if(EnemyChance < 60){
      EnemyName = "Human";
    } else if(EnemyChance < 70){
      EnemyName = "Monk";
    } else if(EnemyChance < 80){
      EnemyName = "Mutant";
    } else if(EnemyChance < 90){
      EnemyName = "Zombie";
    } else if(EnemyChance <= 100){
      EnemyName = "Bat";
    } 


    var Enemy = JSON.parse(fs.readFileSync("./PetBot/settings/dungeon/EnemyTemplate_"+EnemyName+".txt", 'utf8'));
    let NewEnemy = JSON.stringify(Enemy, null, "\t");
    fs.writeFileSync("./PetBot/settings/dungeon/Enemy_"+UserID+".txt",NewEnemy);

    message.channel.send("A new enemy has appeared! Class: "+EnemyName);

    let ProgressKilledEnemies = fs.readFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_KilledEnemies.txt");
      ProgressKilledEnemies = parseFloat(ProgressKilledEnemies) + 1;
      fs.writeFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_KilledEnemies.txt",ProgressKilledEnemies);

  }