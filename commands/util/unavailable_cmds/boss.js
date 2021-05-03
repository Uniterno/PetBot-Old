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
        usages: 4,
        duration: 5
    },
        });
    }
    run(message, args) {
      return; // disabled event

      let UserID = message.author.id;


      console.log(message.content);


      args = message.content.split(' ').slice(1);
      

      if(UserID != "103385273387208704" && UserID != "257191130855243777" && UserID != "168389193603612673"){
        message.channel.send("You are not participating on this event!");
        return;
    }

      var User = JSON.parse(fs.readFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt", 'utf8'));
      var Enemy = JSON.parse(fs.readFileSync("./PetBot/settings/dungeon/Boss.txt", 'utf8'));

      console.log(args[0]);
      if(args[0] != "info" && args[0] != "enemy" && args[0] != "attack" && args[0] != "skill" && args[0] != "special"){
        return;
      }
      if(args[0] == "info"){
        message.channel.send("Info on your user:\n**Class**: "+User.Class+"\n**Attribute**: "+User.Attribute+" (Strong vs: "+User.StrongVs+") (Weak vs: "+User.WeakVs+")\n**HP**: "+User.CurrentHP+"/"+User.MaxHP+"\n**Atk**: "+User.Atk+" (Multiplier: "+User.AttackMultiplier+"%)\n**Mana Gauge**: "+User.ManaGauge.toFixed(2)+"%\n**Skill 1 Cooldown**: "+User.Skill_Slot1_Cooldown+"\n**Skill 2 Cooldown**: "+User.Skill_Slot2_Cooldown);
        return;
      } else if(args[0] == "enemy"){
        message.channel.send("Info on your enemy:\n**Class**: "+Enemy.Class+"\n**Attribute**: "+Enemy.Attribute+" (Strong vs: "+Enemy.StrongVs+") (Weak vs: "+Enemy.WeakVs+")\n**HP**: "+Enemy.CurrentHP+"/"+Enemy.MaxHP+"\n**Atk**: "+Enemy.Atk+" (Multiplier: "+Enemy.AttackMultiplier+"%)");
        return;
      }
    
    if(User.CurrentHP <= 0){
      message.channel.send("You don't have remaining HP. Heal before continuing.");
      return;
    }

    if(Enemy.CurrentHP <= 0){
      message.channel.send("Your enemy is already dead, wait until a new enemy appears before trying to fight again.");
      return;
    }
        
    if(args[0] == "attack"){
      UserAttack(User, Enemy, message, UserID);
    }

    if(args[0] == "skill"){
      if(args[1] != 1 && args[1] != 2){
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

if(args[0] != "attack"){
        AITurn(User, Enemy, message, UserID);
}

  GenericTurn(User, Enemy, message, UserID);

  }
}






function CalculateDamage(Atk){
  let Damage = Math.ceil((((Atk * 0.23) + 10)/5)+(Math.sqrt(Atk)*5));
  Damage = getRandom(Damage*0.90, Damage*1.1);
  return Damage;
  //return Math.ceil((((Atk * 0.23) + 10)/5)+(Math.sqrt(Atk)*5));
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

  if(StrongVs == "AllButDark"){
    if(Attribute == "Dark"){
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

  if(WeakVs == "Memes"){
    if(Attribute == "Meme"){
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

  function DealDamage(Damage, CurrentHP, message){
    CurrentHP = CurrentHP - Damage;

    if(Damage % 1 != 0){
      Damage = Damage.toFixed(2);
    }
    if(CurrentHP % 1 != 0){
      CurrentHP = CurrentHP.toFixed(2);
    }
    

    message.channel.send("You have dealt "+Damage+" damage to enemy, remaining HP is "+CurrentHP+"!");

    if(CurrentHP <= 0){
      return true;
    }

  return CurrentHP;

  }

  function DealDamageAsEnemy(Damage, CurrentHP, message, User, UserID){
    console.log("A"+CurrentHP);
    CurrentHP = CurrentHP - Damage;

    message.channel.send("Enemy dealt "+Damage+" damage to you! Your remaining HP is "+CurrentHP+"!");

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
        AmountToHeal = Enemy.MaxHP * 0.2;
      } else{
        AmountToHeal = Enemy.MaxHP * 0.75;
      }
    } else if(HealDecision <= 60){
      message.channel.send("Enemy has decided to heal this turn using a **normal** healing potion");
      if(Enemy.MaxHP >= 7000){
        AmountToHeal = Enemy.MaxHP * 0.08;
      } else{
        AmountToHeal = Enemy.MaxHP * 0.3;
      }
      
    } else{
    message.channel.send("Enemy has decided to heal this turn using a **small** healing potion");
    if(Enemy.MaxHP >= 7000){
        AmountToHeal = Enemy.MaxHP * 0.03;
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
        fs.writeFileSync("./PetBot/settings/dungeon/Boss.txt",FixedJSON);
      }


if(Decision == "Skill"){
  let SkillSelectedEnemy = getRandom(0, 100);
  console.log("Skill selected by enemy (chance): "+SkillSelectedEnemy);

  if(SkillSelectedEnemy <= 50){
    if(Enemy.Skill_Slot1_Cooldown != 0){
      Decision == "Attack";
    } else{
      let Index = 'Enemy'; // Use enemy to ignore Index
      Skill(Enemy.Skill_Slot1_ID, User, Enemy, message, Index, UserID);
    }
  } else{
    if(Enemy.Skill_Slot2_Cooldown != 0){
      Decision == "Attack";
    } else{
      let Index = 'Enemy'; // Use enemy to ignore Index
      Skill(Enemy.Skill_Slot2_ID, User, Enemy, message, Index, UserID);
    }
  }
  

 // message.channel.send("Enemy has decided to use its skill: null");
  // TODO
}

if(Decision == "Attack"){
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
        message.channel.send("Enemy attack was super effective!");
        Damage = Math.ceil(Damage*1.3);
      }
      if(AttributeBonus == "Weak"){
        message.channel.send("You're resistant against enemy's attack (attribute)");
        Damage = Math.ceil(Damage*0.7);
      }

      let Critical = CalculateCritical(Enemy.CritRateMin, Enemy.CritRateMax);

      if(Critical == true){
        Damage = Math.ceil(Damage*1.33);
        message.channel.send("Critical Hit!");
      }

      let ProgressDamageReceived = fs.readFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgReceivedByBoss.txt");
      ProgressDamageReceived = parseFloat(ProgressDamageReceived) + parseFloat(Damage);
      fs.writeFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgReceivedByBoss.txt",ProgressDamageReceived);

      Damage = Math.ceil(Damage);

      let IsEnemyDead = DealDamageAsEnemy(Damage, User.CurrentHP, message);

      if(IsEnemyDead == true){
        message.channel.send("You have been beaten by this enemy!");
      } else{
        User.CurrentHP = IsEnemyDead;
      }

        console.log("264: "+UserID);


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
      let FoeEvaded = CalculateEvasion(Enemy.Evade, Enemy.Immune);

      if(FoeEvaded == true){
        message.channel.send("Enemy evaded or was immune!");
        AITurn(User, Enemy, message, UserID);
        return;
      }

      let Damage = CalculateDamage(User.Atk);

      Damage = (Damage*(User.AttackMultiplier/100)); // AttackMultiplier, 100 is x1
      Damage = Damage+User.AttackBoost;

      let AttributeBonus = AttributeEffective(User.StrongVs, User.WeakVs, Enemy.Attribute);
      if(AttributeBonus == "Strong"){
        message.channel.send("Your attack is super effective!");
        Damage = Math.ceil(Damage*1.3);
      }
      if(AttributeBonus == "Weak"){
        message.channel.send("Enemy is resistant against your attack (attribute)");
        Damage = Math.ceil(Damage*0.7);
      }

      let Critical = CalculateCritical(User.CritRateMin, User.CritRateMax);

      if(Critical == true){
        Damage = Math.ceil(Damage*1.33);
        message.channel.send("Critical Hit!");
      }

      let ProgressDamageDealt = fs.readFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgDealtToBoss.txt");
      ProgressDamageDealt = parseFloat(ProgressDamageDealt) + parseFloat(Damage);
      fs.writeFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgDealtToBoss.txt",ProgressDamageDealt);

      let IsEnemyDead = DealDamage(Damage, Enemy.CurrentHP, message);

      if(IsEnemyDead == true){
        message.channel.send("You have beaten this enemy!");
        Enemy.CurrentHP = 0;
      } else{
        Enemy.CurrentHP = IsEnemyDead;
      }


      // UPDATE DATA
      updateJsonFile("./PetBot/settings/dungeon/Boss.txt", (data) => {
      data.CurrentHP = Enemy.CurrentHP;
      return data;
      });


      let ManaGauge = UpdateMana(User.ManaGauge, User.ManaChargeMin, User.ManaChargeMax, User.ManaMax);
      if(ManaGauge >= 100){
        message.channel.send("You have charged your mana, you can now use your special ability.");
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
        message.channel.send("Skill activated: Maximum HP permanently raised by 30");
        updateJsonFile("./PetBot/settings/dungeon/Player_"+UserID+".txt", (data) => {
      data.MaxHP = data.MaxHP + 30;
      data.Skill_Slot2_Cooldown = 14;
      return data;
      });
      } else if(Chance <= 50){
        message.channel.send("Skill activated: Maximum ATK permanently raised by 70");
        updateJsonFile("./PetBot/settings/dungeon/Player_"+UserID+".txt", (data) => {
      data.Atk = data.Atk + 70;
      data.Skill_Slot2_Cooldown = 14;
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

      let FoeEvaded = CalculateEvasion(Enemy.Evade, Enemy.Immune);


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
      /*if(Enemy.Attribute != "Holy"){
        if(Chance <= 10){
          Damage = Damage*2930238;
          KO = true;
        }
      }*/

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
        let ProgressDamageDealt = fs.readFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgDealtToBoss.txt");
      ProgressDamageDealt = parseFloat(ProgressDamageDealt) + parseFloat(Damage);
      fs.writeFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgDealtToBoss.txt",ProgressDamageDealt);
      }


      
      

      let IsEnemyDead = DealDamage(Damage, Enemy.CurrentHP, message);

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
         fs.writeFileSync("./PetBot/settings/dungeon/Boss.txt",FixedJSON2);
    
  }

     if(ID == "04"){
      

      message.channel.send("Skill activated: Mana charged by 21%, lose 2% of current HP");

      User.CurrentHP = User.CurrentHP - (User.CurrentHP * 0.02);
      User.ManaGauge = User.ManaGauge + 21;
      User.Skill_Slot2_Cooldown = 4; // should be 3 but there's some bug so as a workaround I put this
      let FixedJSON = JSON.stringify(User, null, "\t");
        fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);
      
    }

    if(ID == "E01"){
      

      message.channel.send("Enemy skill activated: [Fury] ATK increased by 5% for 2 turns.");

      Enemy.AttackMultiplier = Enemy.AttackMultiplier * 1.05;
      Enemy.AttackMultiplierTurns = 2;
      Enemy.Skill_Slot2_Cooldown = 6;

      let FixedJSON = JSON.stringify(Enemy, null, "\t");
        fs.writeFileSync("./PetBot/settings/dungeon/Boss.txt",FixedJSON);
      
    }

    if(ID == "E02"){
      
      message.channel.send("Enemy skill activated: [Great Fury] ATK increased by 10% for 4 turns.");

      Enemy.AttackMultiplier = Enemy.AttackMultiplier * 1.1;
      Enemy.AttackMultiplierTurns = 4;
      Enemy.Skill_Slot2_Cooldown = 8;

      let FixedJSON = JSON.stringify(Enemy, null, "\t");
        fs.writeFileSync("./PetBot/settings/dungeon/Boss.txt",FixedJSON);

      
    }

    if(ID == "E03"){
      
      message.channel.send("Enemy skill activated: [Sound of the Death] ATK increased by 15% for 6 turns.");


      Enemy.AttackMultiplier = Enemy.AttackMultiplier * 1.15;
      Enemy.AttackMultiplierTurns = 6;
      Enemy.Skill_Slot1_Cooldown = 12;

      let FixedJSON = JSON.stringify(Enemy, null, "\t");
        fs.writeFileSync("./PetBot/settings/dungeon/Boss.txt",FixedJSON);

      
    }

    if(ID == "E04"){
      
      message.channel.send("Enemy skill activated: [Warrior Spirit] ATK increased by 20% for 8 turns.");

      Enemy.AttackMultiplier = Enemy.AttackMultiplier * 1.2;
      Enemy.AttackMultiplierTurns = 8;
      Enemy.Skill_Slot2_Cooldown = 15;


      let FixedJSON = JSON.stringify(User, null, "\t");
        fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);
      
    }

    if(ID == "E05"){
      let ExperimentingChance = getRandom(0, 100);

      if(ExperimentingChance <= 20){
        message.channel.send("Enemy skill activated: [Experimenting! (Worked - 20% chance)] ATK increased by 50% for 3 turns");

        Enemy.AttackMultiplier = Enemy.AttackMultiplier * 1.50;
        Enemy.AttackMultiplierTurns = 3;
        Enemy.Skill_Slot2_Cooldown = 12;
        let FixedJSON = JSON.stringify(Enemy, null, "\t");
        fs.writeFileSync("./PetBot/settings/dungeon/Boss.txt",FixedJSON);
      } else{

      message.channel.send("Enemy skill activated: [Experimenting!] (Failed - 80% chance)] ATK decreased by 15% for 4 turns.");
      Enemy.AttackMultiplier = Enemy.AttackMultiplier * 0.75;
      Enemy.AttackMultiplierTurns = 4;
      let FixedJSON = JSON.stringify(Enemy, null, "\t");
        fs.writeFileSync("./PetBot/settings/dungeon/Boss.txt",FixedJSON);
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

       updateJsonFile("./PetBot/settings/dungeon/Boss.txt", (data) => {
      data.Attribute = Attribute;
      return data;
      });

      
    }
  // message.channel.send("Skill is now active"); 
  }

  if(ID == "E07"){
        message.channel.send("Enemy skill activated: [Vampiric Bless] Triple ATK for the next turn.");

       Enemy.AttackMultiplier = Enemy.AttackMultiplier * 3;
        Enemy.AttackMultiplierTurns = 2;
        Enemy.Skill_Slot1_Cooldown = 4;
        let FixedJSON = JSON.stringify(Enemy, null, "\t");
        fs.writeFileSync("./PetBot/settings/dungeon/Boss.txt",FixedJSON);

  // message.channel.send("Skill is now active"); 
  }

   if(ID == "E08"){
      
      message.channel.send("Enemy skill activated: [Sound of Pain] ATK decreased by 90% for the next turn. Decreases player's special gauge in 15%");


      Enemy.AttackMultiplier = Enemy.AttackMultiplier * 0.1;
      Enemy.AttackMultiplierTurns = 2;
      Enemy.Skill_Slot2_Cooldown = 8;
      console.log("ManaGauge before: "+User.ManaGauge);
      User.ManaGauge = User.ManaGauge - 15;
      console.log("ManaGauge after: "+User.ManaGauge);
      let FixedJSON = JSON.stringify(Enemy, null, "\t");
        fs.writeFileSync("./PetBot/settings/dungeon/Boss.txt",FixedJSON);
      let FixedJSON2 = JSON.stringify(User, null, "\t");
        fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);
      
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
    let FixedJSON = JSON.stringify(Enemy, null, "\t");
        fs.writeFileSync("./PetBot/settings/dungeon/Boss.txt",FixedJSON);
  }

  if(Enemy.AttackMultiplierTurns != 0){
    Enemy.AttackMultiplierTurns = Enemy.AttackMultiplierTurns-1;

    let FixedJSON = JSON.stringify(Enemy, null, "\t");
    fs.writeFileSync("./PetBot/settings/dungeon/Boss.txt",FixedJSON);
  }
  if(User.AttackMultiplierTurns == 0){
    User.AttackMultiplier = 100;
    let FixedJSON = JSON.stringify(User, null, "\t");
        fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);
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




}


function Special(User, Enemy, message, UserID){
  User.ManaGauge = User.ManaGauge - 100;

  if(User.SpecialID == "01"){ // Legionary
    message.channel.send("**Haec omnia iter nostrum pro me ad Deum, ut ostenderet tibi quod vere est misericordiae, nam Ego ille qui est salvificem gloria... Sanctus Terra Bellator!**\n\nSpecial power: Deals boosted damage (70% crit chance), increases ATK for 2 turns.");
    let FoeEvaded = CalculateEvasion(Enemy.Evade, Enemy.Immune);

      if(FoeEvaded == true){
        message.channel.send("Enemy evaded or was immune!");
        AITurn(User, Enemy, message, UserID);
        return;
      }

      let Damage = CalculateDamage(User.Atk);

      Damage = (Damage*(User.AttackMultiplier/100)); // AttackMultiplier, 100 is x1
      Damage = Damage+User.AttackBoost;
      Damage = Damage*3.25 // boosted damage bonus

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

      let ProgressDamageDealt = fs.readFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgDealtToBoss.txt");
      ProgressDamageDealt = parseFloat(ProgressDamageDealt) + parseFloat(Damage);
      fs.writeFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgDealtToBoss.txt",ProgressDamageDealt);

      let IsEnemyDead = DealDamage(Damage, Enemy.CurrentHP, message);

      if(IsEnemyDead == true){
        message.channel.send("You have beaten this enemy!");
        Enemy.CurrentHP = 0;
      } else{
        Enemy.CurrentHP = IsEnemyDead;
      }


      // UPDATE DATA
      let FixedJSON = JSON.stringify(Enemy, null, "\t");
        fs.writeFileSync("./PetBot/settings/dungeon/Boss.txt",FixedJSON);

      updateJsonFile("./PetBot/settings/dungeon/Player_"+UserID+".txt", (data) => {
      data.ManaGauge = data.ManaGauge - 100;
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
      message.channel.send("Warning: An issue has ocurred. Error code 865. Aborted command.");
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
      data.ManaGauge = data.ManaGauge - 100;
      return data;
      });

}
}