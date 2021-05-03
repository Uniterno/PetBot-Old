
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
			guildOnly: true,
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


	  if(fs.existsSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgReceivedByBoss.txt") == false){
		fs.writeFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgReceivedByBoss.txt","0");
 	  }

 	  if(fs.existsSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgDealtToBoss.txt") == false){
		fs.writeFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgDealtToBoss.txt","0");
 	  }

 	  if(fs.existsSync("./PetBot/settings/dungeon/Progress/"+UserID+"_KilledEnemies.txt") == false){
		fs.writeFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_KilledEnemies.txt","0");
 	  }

 	  if(fs.existsSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgDealtToBoss.txt") == false){
		fs.writeFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgDealtToBoss.txt","0");
 	  }

 	  if(fs.existsSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgReceivedByBoss.txt") == false){
		fs.writeFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgReceivedByBoss.txt","0");
 	  }

	 /* if(UserID != "168389193603612673" && UserID != "103385273387208704" && UserID != "113282276321697792" && UserID != "257191130855243777"){
		message.channel.send("You are not participating on this event!");
		return;
	} */

	  var User = JSON.parse(fs.readFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt", 'utf8'));
	  var Enemy = JSON.parse(fs.readFileSync("./PetBot/settings/dungeon/Boss.txt", 'utf8'));

	   if(!!Enemy.Skill_Slot3_ID == false){
		Enemy.Skill_Slot3_ID = "Not available for this enemy."
	  }

	  console.log(args[0]);
	  if(args[0] != "info" && args[0] != "enemy" && args[0] != "attack" && args[0] != "skill" && args[0] != "special" && args[0] != "shop" && args[0] != "s" && args[0] != "debug"){
		return;
	  }
	  if(args[0] == "info"){
		message.channel.send("Info on your user:\n**Class**: "+User.Class+"\n**Attribute**: "+User.Attribute+" (Strong vs: "+User.StrongVs+") (Weak vs: "+User.WeakVs+")\n**HP**: "+User.CurrentHP+"/"+User.MaxHP+"\n**Atk**: "+User.Atk+" (Multiplier: "+Math.round(User.AttackMultiplier)+"%)\n**Mana Gauge**: "+User.ManaGauge.toFixed(2)+"%\n**Morale**: " + User.Morale.toFixed(2) + "%\n**Skill 1 Cooldown**: "+User.Skill_Slot1_Cooldown+"\n**Skill 2 Cooldown**: "+User.Skill_Slot2_Cooldown+"\n**Skill 3 Cooldown**: "+User.Skill_Slot3_Cooldown+"\n**Level**: "+User.Level+"\n**Experience**: "+User.CurrentEXP+"/"+User.NeededEXP);
		return;
	  } else if(args[0] == "enemy"){
		message.channel.send("Info on your enemy:\n**Class**: "+Enemy.Class+"\n**Attribute**: "+Enemy.Attribute+" (Strong vs: "+Enemy.StrongVs+") (Weak vs: "+Enemy.WeakVs+")\n**HP**: "+Enemy.CurrentHP+"/"+Enemy.MaxHP+"\n**Atk**: "+Enemy.Atk+" (Multiplier: "+Enemy.AttackMultiplier+"%)\n**Skill #1 ID**: "+Enemy.Skill_Slot1_ID+"\n**Skill #2 ID**: "+Enemy.Skill_Slot2_ID+"\n**Skill #3 ID**: "+Enemy.Skill_Slot3_ID);
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
	  
	  message.channel.send("This event is now over.");
	  return;
	  
	  if(args[0] == "shop" || args[0] == "s"){
		Shopping(UserID, args[1], User, message);
		return;
	  }

	  


	
	if(User.CurrentHP <= 0){
	  message.channel.send("You don't have remaining HP. Heal before continuing.");
	  return;
	}

	if(Enemy.CurrentHP <= 0){
	  /* message.channel.send("Boss is already dead.");
	  return; */
	  User.Morale += getRandom(25,100) / 100;
	  if(!!User.ExtraMorale == true){
	  	User.Morale += User.ExtraMorale;
	  }
	  let FixedJSON = JSON.stringify(User, null, "\t");
	  fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);
	  message.channel.send("Seems like your enemy was already dead but it wasn't updated.\nStarting manual deployment...");
	  AutomaticEnemyDeploy(Enemy, UserID, message);
	  return;
	}
		
	if(args[0] == "attack"){
	  UserAttack(User, Enemy, message, UserID);
	}

	if(args[0] == "skill"){
	  if(args[1] == 3){
		if(User.Skill_Slot3_ID == "999" || isNaN(User.Skill_Slot3_ID)){
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






function CalculateDamage(Atk, Morale){
  let Damage = Math.ceil((((Atk * 0.23) + 10)/5)+(Math.sqrt(Atk)*5));

  if(Morale != undefined){
  	if(Morale == 0){
  		Damage *= 0.25;
  	} else if(Morale < 25){
  		Damage *= 0.6;
  	} else if(Morale < 50){
  		Damage *= 0.8;
  	} else if(Morale > 125){
  		Damage *= 1.1;
  	} else if(Morale > 150){
  		Damage *= 1.15;
  	} else if(Morale == 200){
  		Damage *= 1.2;
  	}
  }

  Damage = getRandom(Damage*0.90, Damage*1.1);
  return Damage;
  //return Math.ceil((((Atk * 0.23) + 10)/5)+(Math.sqrt(Atk)*5));
}

function CalculateEvasion(Evade, Immune, Attribute, ImmuneTo, EvadeExtra){
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

  if(!!EvadeExtra == false){
	EvadeExtra = 0;
  }

  if(Odds <= (Evade+EvadeExtra)){
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

  if(StrongVs == "Dragon&Human"){
	if(Attribute == "Dragon" || Attribute == "Human"){
	  return "Weak";
	}
  }

  if(StrongVs == "Dragon&Dark"){
	if(Attribute == "Dragon" || Attribute == "Dark"){
	  return "Weak";
	}
  }

  if(StrongVs == "Undead&Dragon"){
	if(Attribute == "Undead" || Attribute == "Dragon"){
	  return "Strong";
	}
  }

  if(StrongVs == "Royalty&Divine"){
	if(Attribute == "Royalty" || Attribute == "Divine"){
	  return "Strong";
	}
  }

  if(WeakVs == "Dark&Human"){
	if(Attribute == "Dark" || Attribute == "Human"){
	  return "Weak";
	}
  }

  if(WeakVs == "Divine&Human&Dark&Dragon"){
	if(Attribute == "Divine" || Attribute == "Dragon" || Attribute == "Dark" || Attribute == "Human"){
	  return "Weak";
	}
  }

  if(StrongVs == "Divine&Human&Dark&Dragon"){
	if(Attribute == "Divine" || Attribute == "Dragon" || Attribute == "Dark" || Attribute == "Human"){
	  return "Strong";
	}
  }

  if(WeakVs == "All"){
	  return "Weak";
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
  } else if(Decision <= 70){
	Decision = "Skill";
  } else{
	Decision = "Attack";
  }

  if(Decision == "Heal"){
	let HealDecision = getRandom(0, 100);
	let AmountToHeal = 0;
	if(HealDecision <= 7){
	  message.channel.send("Enemy has decided to heal this turn using a **legendary** healing potion");
	  if(Enemy.MaxHP >= 7000){
		AmountToHeal = Enemy.MaxHP * 0.08;
	  } else{
		AmountToHeal = Enemy.MaxHP * 0.75;
	  }
	} else if(HealDecision <= 60){
	  message.channel.send("Enemy has decided to heal this turn using a **normal** healing potion");
	  if(Enemy.MaxHP >= 7000){
		AmountToHeal = Enemy.MaxHP * 0.04;
	  } else{
		AmountToHeal = Enemy.MaxHP * 0.3;
	  }
	  
	} else{
	message.channel.send("Enemy has decided to heal this turn using a **small** healing potion");
	if(Enemy.MaxHP >= 7000){
		AmountToHeal = Enemy.MaxHP * 0.01;
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

  if(SkillSelectedEnemy <= 33){
	if(Enemy.Skill_Slot1_Cooldown != 0){
	  Decision = "Attack";
	} else{
	  let Index = 'Enemy'; // Use enemy to ignore Index
	  Skill(Enemy.Skill_Slot1_ID, User, Enemy, message, Index, UserID);
	}
  } else if(SkillSelectedEnemy <= 66){
	if(Enemy.Skill_Slot2_Cooldown != 0){
	  Decision = "Attack";
	} else{
	  let Index = 'Enemy'; // Use enemy to ignore Index
	  Skill(Enemy.Skill_Slot2_ID, User, Enemy, message, Index, UserID);
	}
  } else{
  	if(Enemy.Skill_Slot == "Not available for this enemy."){
  		Enemy.Skill_Slot3_Cooldown = -1;
  	}
  	if(Enemy.Skill_Slot3_Cooldown != 0){
		Decision = "Attack";
  } else{
	  let Index = 'Enemy'; // Use enemy to ignore Index
	  Skill(Enemy.Skill_Slot3_ID, User, Enemy, message, Index, UserID);
	}
  }
  

 // message.channel.send("Enemy has decided to use its skill: null");
  // TODO
}

if(Decision == "Attack"){
	let EnemyAttackMessage = "";
  	console.log("Upon dec: "+User.CurrentHP);

	let FoeEvaded = CalculateEvasion(User.Evade, User.Immune, Enemy.Attribute, User.ImmuneTo, User.EvadeExtra);

	if(FoeEvaded == true){
		message.channel.send("Enemy attacked you, but you evaded it or were immune!");
		return;
	}


	let Damage = CalculateDamage(Enemy.Atk);
	if(User.Morale == 200){
		Damage *= 0.7;
	}

	Damage *= Enemy.AttackMultiplier/100;
	Damage += Enemy.AttackBoost;
	if(Damage < 0){
		Damage = 1;
	}

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

	  let ProgressDamageReceived = fs.readFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgReceivedByBoss.txt");
	  ProgressDamageReceived = parseFloat(ProgressDamageReceived) + parseFloat(Damage);
	  fs.writeFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgReceivedByBoss.txt",ProgressDamageReceived);

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
	  let FoeEvaded = CalculateEvasion(Enemy.Evade, Enemy.Immune, User.Attribute, Enemy.ImmuneTo, Enemy.EvadeExtra);

	  if(FoeEvaded == true){
		message.channel.send("Enemy evaded or was immune!");
		AITurn(User, Enemy, message, UserID);
		return;
	  }

	  let Damage = CalculateDamage(User.Atk, User.Morale);

	  Damage = (Damage*(User.AttackMultiplier/100)); // AttackMultiplier, 100 is x1
	  Damage = Damage+User.AttackBoost;
	  if(Damage < 0){
	  	Damage = 1;
	  }

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

	  if(!!User.ExtraDamageToHuman == true){
	  	if(Enemy.Attribute == "Human"){
	  		Damage += Damage*User.ExtraDamageToHuman;
	  	}
	 }

	 if(!!User.ExtraDamageToDragon == true){
	  	if(Enemy.Attribute == "Dragon"){
	  		Damage += Damage*User.ExtraDamageToDragon;
	  	}
	 }

	 if(!!User.ExtraDamageToOthers == true){
	  	if(Enemy.Attribute != "Dragon" && Enemy.Attribute != "Human"){
	  		Damage += Damage*User.ExtraDamageToDragon;
	  	}
	 }

	  let Critical = CalculateCritical(User.CritRateMin+User.CriticalIncrease, User.CritRateMax+User.CriticalIncrease);

	  if(Critical == true){
		if(User.Morale == 200){
			Damage = Math.ceil(Damage*1.41);
		} else if(User.Morale > 150){
			Damage = Math.ceil(Damage*1.39);
		} else if(User.Morale > 125){
			Damage = Math.ceil(Damage*1.37);
		} else{
			Damage = Math.ceil(Damage*1.33);
		}
		AttackUserMessage = AttackUserMessage+"Critical Hit! ";
	  }

	  if(!!User.DamageToSelf == true){
	  	let DamageDoneToSelf = Damage * User.DamageToSelf;
	  	message.channel.send("You dealt "+DamageDoneToSelf+" to yourself!");
	  	User.CurrentHP -= DamageDoneToSelf;
	  }

	  let ProgressDamageDealt = fs.readFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgDealtToBoss.txt");
	  ProgressDamageDealt = parseFloat(ProgressDamageDealt) + parseFloat(Damage);
	  fs.writeFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgDealtToBoss.txt",ProgressDamageDealt);

	  let IsEnemyDead = DealDamage(Damage, Enemy.CurrentHP, message, AttackUserMessage);

	  if(IsEnemyDead == true){
		message.channel.send("You have beaten this enemy!");
		Enemy.CurrentHP = 0;
		//AutomaticEnemyDeploy(Enemy, UserID, message);
		return;
	  } else{
		Enemy.CurrentHP = IsEnemyDead;
	  }



	  // UPDATE DATA
	  updateJsonFile("./PetBot/settings/dungeon/Boss.txt", (data) => {
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
  	if(User.Morale == 0){
  		message.channel.send("You can't use skills while morale is at 0%");
  		return;
  	}
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
	  if(User.Morale < 25){
	  	data.Skill_Slot1_Cooldown += 1;
	  }
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
	  if(User.Morale < 25){
	  	data.Skill_Slot2_Cooldown += 1;
	  }
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

	  let FoeEvaded = CalculateEvasion(Enemy.Evade, Enemy.Immune, User.Attribute, Enemy.ImmuneTo, Enemy.EvadeExtra);
	
	  // Doing this first because, if it evades, this won't update properly.
		User.CurrentHP = User.CurrentHP - (User.MaxHP * 0.05);
		User.Skill_Slot1_Cooldown = 7; //should be 6 but there's some bug so as a workaround I put this
		if(User.Morale < 25){
	  		User.Skill_Slot1_Cooldown += 1;
	 	 }
		let FixedJSON = JSON.stringify(User, null, "\t");
		fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);

	  if(FoeEvaded == true){
		message.channel.send("Enemy evaded or was immune!");
		AITurn(User, Enemy, message, UserID);
		return;
	  }

	  let Damage = CalculateDamage(User.Atk, User.Morale);

	  Damage = (Damage*(User.AttackMultiplier/100)); // AttackMultiplier, 100 is x1
	  Damage = Damage+User.AttackBoost;
	  if(Damage < 0){
	  	Damage = 1;
	  }
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
		if(User.Morale == 200){
			Damage = Math.ceil(Damage*1.41);
		} else if(User.Morale > 150){
			Damage = Math.ceil(Damage*1.39);
		} else if(User.Morale > 125){
			Damage = Math.ceil(Damage*1.37);
		} else{
			Damage = Math.ceil(Damage*1.33);
		}
		message.channel.send("Critical Hit!");
	  }

	  if(KO != true){ // KO shouldn't count towards progress
		let ProgressDamageDealt = fs.readFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgDealtToBoss.txt");
	  ProgressDamageDealt = parseFloat(ProgressDamageDealt) + parseFloat(Damage);
	  fs.writeFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgDealtToBoss.txt",ProgressDamageDealt);
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
		 fs.writeFileSync("./PetBot/settings/dungeon/Boss.txt",FixedJSON2);
	
  }

	 if(ID == "04"){
	  

	  message.channel.send("Skill activated: Mana charged by 21%, lose 2% of current HP");

	   updateJsonFile("./PetBot/settings/dungeon/Player_"+UserID+".txt", (data) => {
	  data.CurrentHP =  data.CurrentHP - (data.CurrentHP * 0.02);
	  data.ManaGauge = data.ManaGauge + 21;
	  data.Skill_Slot2_Cooldown = 3;
	  if(User.Morale < 25){
	  	User.Skill_Slot2_Cooldown += 1;
	  }
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
	  if(User.Morale < 25){
	  		User.Skill_Slot1_Cooldown += 1;
	  }

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
	  if(User.Morale < 25){
	  		User.Skill_Slot2_Cooldown += 1;
	  }

	  let FixedJSON = JSON.stringify(User, null, "\t");
		fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);

	  
	}

	 if(ID == "07"){
	  message.channel.send("Skill activated: Increases ATK by 9% for 5 turns.");
	  User.AttackMultiplier = User.AttackMultiplier * 1.09;
	  User.AttackMultiplierTurns = 5;
	  User.Skill_Slot1_Cooldown = 11;
	  if(User.Morale < 25){
	  		User.Skill_Slot1_Cooldown += 1;
	  }

	  let FixedJSON = JSON.stringify(User, null, "\t");
		fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);

	  
	}

	if(ID == "08"){
	  message.channel.send("Skill activated: Increases ATK by 30% for 1 turn.");
	  User.AttackMultiplier = User.AttackMultiplier * 1.3;
	  User.AttackMultiplierTurns = 1;
	  User.Skill_Slot2_Cooldown = 13;
	  if(User.Morale < 25){
	  		User.Skill_Slot2_Cooldown += 1;
	  }

	  let FixedJSON = JSON.stringify(User, null, "\t");
		fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);
	  
	}

	if(ID == "09"){
	  message.channel.send("Skill activated: Increases critical rate by 50% for 1 turn.");
	  User.CriticalIncrease = 50;
	  User.CriticalIncreaseTurns = 1;
	  User.Skill_Slot3_Cooldown = 15;
	  if(User.Morale < 25){
	  		User.Skill_Slot3_Cooldown += 1;
	  }

	  let FixedJSON = JSON.stringify(User, null, "\t");
		fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);

	  
	}

	if(ID == "10"){
	  message.channel.send("Skill activated: [Party Time EX] Increases ATK by 60% for 4 turns. After 4 turns, reduces ATK by 80% for 2 turns. Increases current mana by 2%.");
	  User.AttackMultiplier *= 1.6;
	  User.AttackMultiplierTurns = 4;
	  User.AttackPenalty = true;
	  User.ManaGauge += 2;
	  User.Skill_Slot1_Cooldown = 10;
	  if(User.Morale < 25){
	  		User.Skill_Slot1_Cooldown += 1;
	  }
	  let FixedJSON = JSON.stringify(User, null, "\t");
		fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);
	}

	if(ID == "11"){
	  message.channel.send("Skill activated: [Burning passion] Increases evade chance by 10% for 5 turns. Increases current mana by 20%. Decreases ATK by 15% for 3 turns.");
	  User.AttackMultiplier *= 0.85;
	  User.AttackMultiplierTurns = 3;
	  User.ManaGauge += 20;
	  User.EvadeExtra += 10;
	  User.EvadeExtraTurns = 5;
	  User.Skill_Slot2_Cooldown = 9;
	  if(User.Morale < 25){
	  		User.Skill_Slot2_Cooldown += 1;
	  }
	  let FixedJSON = JSON.stringify(User, null, "\t");
		fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);
	}

	// Won't add Barista yet cuz noone got her anyway :obenzeneL_L:

	if(ID == "12"){
	  message.channel.send("Skill activated: [Same as always EX] Guarantees a critical hit next turn. Decreases current mana by 2%.");
	  User.CriticalIncrease = 100;
	  User.CriticalIncreaseTurns = 1;
	  User.Skill_Slot1_Cooldown = 4;
	  if(User.Morale < 25){
	  		User.Skill_Slot1_Cooldown += 1;
	  }
	  let FixedJSON = JSON.stringify(User, null, "\t");
		fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);
	}

	if(ID == "13"){
		let ScarletPrideChance = getRandom(0, 100);

		if(ScarletPrideChance <= 85){
			message.channel.send("Skill activated: [Scarlet Pride EX] Deals severe damage to the enemy (700%). Decreases current mana by 5%.");
			let AttackUserMessage = "";

			let FoeEvaded = CalculateEvasion(Enemy.Evade, Enemy.Immune, User.Attribute, Enemy.ImmuneTo, Enemy.EvadeExtra);
	
		  // Doing this first because, if it evades, this won't update properly.
			User.ManaGauge += -5;
			User.Skill_Slot2_Cooldown = 5; //should be 4 but there's some bug so as a workaround I put this
			if(User.Morale < 25){
	  			User.Skill_Slot2_Cooldown += 1;
	 		}
			let FixedJSON = JSON.stringify(User, null, "\t");
			fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);

	  if(FoeEvaded == true){
		message.channel.send("Enemy evaded or was immune!");
		AITurn(User, Enemy, message, UserID);
		return;
	  }

	  let Damage = CalculateDamage(User.Atk, User.Morale);

	  Damage = (Damage*(User.AttackMultiplier/100)); // AttackMultiplier, 100 is x1
	  Damage = Damage+User.AttackBoost;
	  if(Damage < 0){
	  	Damage = 1;
	  }
	  Damage = Damage*5 // boosted damage bonus

	  let Chance = getRandom(0, 100);

	  let KO = false;
	  

	  let AttributeBonus = AttributeEffective(User.StrongVs, User.WeakVs, Enemy.Attribute);
	  if(AttributeBonus == "Strong"){
		AttackUserMessage += "Your attack is super effective! ";
		Damage = Math.ceil(Damage*1.3);
	  }
	  if(AttributeBonus == "Weak"){
		AttackUserMessage += "Enemy is resistant against your attack attribute! ";
		Damage = Math.ceil(Damage*0.7);
	  }

	  let Critical = CalculateCritical(User.CritRateMin+User.CriticalIncrease, User.CritRateMax+User.CriticalIncrease);

	  if(Critical == true){
		if(User.Morale == 200){
			Damage = Math.ceil(Damage*1.41);
		} else if(User.Morale > 150){
			Damage = Math.ceil(Damage*1.39);
		} else if(User.Morale > 125){
			Damage = Math.ceil(Damage*1.37);
		} else{
			Damage = Math.ceil(Damage*1.33);
		}
		AttackUserMessage += "Critical Hit! ";
	  }

	  if(KO != true){ // KO shouldn't count towards progress
		  let ProgressDamageDealt = fs.readFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgDealtToBoss.txt");
		  ProgressDamageDealt = parseFloat(ProgressDamageDealt) + parseFloat(Damage);
		  fs.writeFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgDealtToBoss.txt",ProgressDamageDealt);
	  }
	  

	  let IsEnemyDead = DealDamage(Damage, Enemy.CurrentHP, message, AttackUserMessage);

	  if(IsEnemyDead == true){
		message.channel.send("You have beaten this enemy!");
		Enemy.CurrentHP = 0;
	  } else{
		Enemy.CurrentHP = IsEnemyDead;
		AITurn(User, Enemy, message, UserID);
	  }

	  


	  // UPDATE DATA

	  FixedJSON = JSON.stringify(User, null, "\t");
	  fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);


	  let FixedJSON2 = JSON.stringify(Enemy, null, "\t");
		 fs.writeFileSync("./PetBot/settings/dungeon/Boss.txt",FixedJSON2);
	


		} else{
			message.channel.send("Skill activated: [Scarlet Pride EX] Heal enemy by 30% of its max HP.");
			Enemy.CurrentHP += Enemy.MaxHP*0.3;
			User.Skill_Slot2_Cooldown = 5;
			if(User.Morale < 25){
	  			User.Skill_Slot2_Cooldown += 1;
	 		}
			let FixedJSON = JSON.stringify(User, null, "\t");
			fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);
			let FixedJSON2 = JSON.stringify(Enemy, null, "\t");
		 	fs.writeFileSync("./PetBot/settings/dungeon/Boss.txt",FixedJSON2);
		}


	  
	  User.CriticalIncrease = 100;
	  User.CriticalIncreaseTurns = 1;
	  User.Skill_Slot1_Cooldown = 4;

	}
	  	

	if(ID == "14"){
		if(User.CurrentMode == "Defense"){
		  User.MaxHP = 5370 + (537*User.Level);
		  User.Atk = 12000 + (1200*User.Level);
		  User.DefenseModeHP = User.CurrentHP;
		  User.CurrentHP = User.AttackModeHP;
		  User.CurrentMode = "Attack";
		  
		  message.channel.send("Skill activated: [Don't insult my friends! EX] Changes to Attack Mode.");
	} else{
		  User.MaxHP = 7000 + (700*User.Level);
		  User.AttackModeHP = User.CurrentHP;
		  User.CurrentHP = User.DefenseModeHP;
		  User.Atk = 100 + (10*User.Level);
		  User.CurrentMode = "Defense";
		  message.channel.send("Skill activated: [Aren't I a cutie? EX] Changes to Defense Mode.");
		}

		User.Skill_Slot1_Cooldown = 7;
		if(User.Morale < 25){
	  		User.Skill_Slot1_Cooldown += 1;
	  	}

	  	  let FixedJSON = JSON.stringify(User, null, "\t");
		  fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);
	}

	if(ID == "15"){
		if(User.CurrentMode == "Defense"){
			message.channel.send("Skill activated: [Ei! Ei! O! EX] Decreases enemy's attack by 30% for 8 turns.");
			Enemy.AttackMultiplier *= 0.7;
			Enemy.AttackMultiplierTurns = 8;
			User.Skill_Slot2_Cooldown = 10;
			if(User.Morale < 25){
	  			User.Skill_Slot2_Cooldown += 1;
	  		}
			let FixedJSON = JSON.stringify(User, null, "\t");
	  		fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);
	  		let FixedJSON2 = JSON.stringify(Enemy, null, "\t");
	  		fs.writeFileSync("./PetBot/settings/dungeon/Boss.txt",FixedJSON2);
		} else{
			message.channel.send("This skill can only be used while in Defense Mode");
			return;
		}
	}

	if(ID == "999"){
		return;
	}
	  

	if(ID == "16" || ID == "17" || ID == "18"){
		if(ID == 16){
			message.channel.send("Skill activated: [Tsugutteru~] Deals variable damage to enemy (50% - 400%).");
			User.Skill_Slot1_Cooldown = 7;
			if(User.Morale < 25){
	  			User.Skill_Slot1_Cooldown += 1;
	  		}
		} else if(ID == 17){
			message.channel.send("Skill activated: [Himatteru~] Deals variable damage to enemy (50% - 400%).");
			User.Skill_Slot2_Cooldown = 7;
			if(User.Morale < 25){
	  			User.Skill_Slot2_Cooldown += 1;
	  		}
		} else{
			message.channel.send("Skill activated: [Mocatteru~] Deals variable damage to enemy (50% - 400%).");
			User.Skill_Slot3_Cooldown = 7;
			if(User.Morale < 25){
	  			User.Skill_Slot3_Cooldown += 1;
	  		}
		}
	  let FoeEvaded = CalculateEvasion(Enemy.Evade, Enemy.Immune, User.Attribute, Enemy.ImmuneTo, Enemy.EvadeExtra);
	
		  // Doing this first because, if it evades, this won't update properly.
			let FixedJSON = JSON.stringify(User, null, "\t");
			fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);

	  if(FoeEvaded == true){
		message.channel.send("Enemy evaded or was immune!");
		AITurn(User, Enemy, message, UserID);
		return;
	  }

	  let Damage = CalculateDamage(User.Atk, User.Morale);

	  Damage = (Damage*(User.AttackMultiplier/100)); // AttackMultiplier, 100 is x1
	  Damage = Damage+User.AttackBoost;
	  if(Damage < 0){
	  	Damage = 1;
	  }
	  Damage *= getRandom(50, 400)/100;

	  let KO = false;

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
		if(User.Morale == 200){
			Damage = Math.ceil(Damage*1.41);
		} else if(User.Morale > 150){
			Damage = Math.ceil(Damage*1.39);
		} else if(User.Morale > 125){
			Damage = Math.ceil(Damage*1.37);
		} else{
			Damage = Math.ceil(Damage*1.33);
		}
		AttackUserMessage = AttackUserMessage+"Critical Hit! ";
	  }

	  if(KO != true){ // KO shouldn't count towards progress
		let ProgressDamageDealt = fs.readFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgDealtToBoss.txt");
	  ProgressDamageDealt = parseFloat(ProgressDamageDealt) + parseFloat(Damage);
	  fs.writeFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgDealtToBoss.txt",ProgressDamageDealt);
	  }
	  

	  let IsEnemyDead = DealDamage(Damage, Enemy.CurrentHP, message, AttackUserMessage);

	  if(IsEnemyDead == true){
		message.channel.send("You have beaten this enemy!");
		Enemy.CurrentHP = 0;
	  } else{
		Enemy.CurrentHP = IsEnemyDead;
		AITurn(User, Enemy, message, UserID);
	  }

	  GenericTurn(User, Enemy, message, UserID);
	 
	  // UPDATE DATA


	  FixedJSON = JSON.stringify(User, null, "\t");
	  fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);

	  let FixedJSON2 = JSON.stringify(Enemy, null, "\t");
		 fs.writeFileSync("./PetBot/settings/dungeon/Boss.txt",FixedJSON2);
	}

	if(ID == "19"){
		if(User.Skill1RemainingUses <= 0){
			message.channel.send("You can't use this skill anymore for this event.");
		} else{
			message.channel.send("Skill activated: [Toward Greater Heights] Increases ATK and HP permanently by 50.");
			User.Skill_Slot1_Cooldown = 3;
			if(User.Morale < 25){
	  			User.Skill_Slot1_Cooldown += 1;
	  		}
			User.Atk += 50;
			User.CurrentHP += 50;
			User.MaxHP += 50;
			User.Skill1RemainingUses += -1;
		 
		  	// UPDATE DATA

		  	FixedJSON = JSON.stringify(User, null, "\t");
		  	fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);

		  	let FixedJSON2 = JSON.stringify(Enemy, null, "\t");
			fs.writeFileSync("./PetBot/settings/dungeon/Boss.txt",FixedJSON2);
		}
	}

	if(ID == "20"){
		if(User.Skill2RemainingUses <= 0){
			message.channel.send("You can't use this skill anymore for this event.");
		} else{
			message.channel.send("Skill activated: [I'm Roselia's Minato Yukina] Increases ATK permanently by 100 but reduces HP permanently by 50.");
			User.Skill_Slot2_Cooldown = 10;
			if(User.Morale < 25){
	  			User.Skill_Slot2_Cooldown += 1;
	  		}
			User.Atk += 100;
			User.CurrentHP += -50;
			User.MaxHP += -50;
			User.Skill2RemainingUses += -1;
		 
		  	// UPDATE DATA

		  	FixedJSON = JSON.stringify(User, null, "\t");
		  	fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);

		  	let FixedJSON2 = JSON.stringify(Enemy, null, "\t");
			fs.writeFileSync("./PetBot/settings/dungeon/Boss.txt",FixedJSON2);
		}
	}

	if(ID == "21"){
		message.channel.send("Skill activated: [May I take your order?] All 'Strong vs' and 'Weak vs' classes are inverted for 4 turns + Gain 10 permanent HP");
		User.Skill_Slot1_Cooldown = 6;
		if(User.Morale < 25){
	  			User.Skill_Slot1_Cooldown += 1;
	  	}
		User.CurrentHP += 10;
		User.MaxHP += 10;
		let TemporarySave = User.StrongVs;
		User.StrongVs = User.WeakVs;
		User.WeakVs = TemporarySave;
		User.StrongWeakSwitchedTurns = 5;
		 
		  // UPDATE DATA

		 FixedJSON = JSON.stringify(User, null, "\t");
		 fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);

		 let FixedJSON2 = JSON.stringify(Enemy, null, "\t");
		 fs.writeFileSync("./PetBot/settings/dungeon/Boss.txt",FixedJSON2);
	}

	if(ID == "22"){
		message.channel.send("Skill activated: [Hot Coffee] Increases damage against Human enemies by 10% for 5 turns + Increases damage against Dragon enemies by 20% for 5 turns + Increases damage against non-Human and non-Dragon enemies by 50% for 5 turns + Deals 1% of damage dealt to enemies to self while this skill is active.");
		User.Skill_Slot2_Cooldown = 12;
		if(User.Morale < 25){
	  			User.Skill_Slot2_Cooldown += 1;
	  	}
		User.ExtraDamageToHuman = 0.1;
		User.ExtraDamageToDragon = 0.2;
		User.ExtraDamageToOthers = 0.5;
		User.ExtraDamageTurns = 6;
		User.DamageToSelf = 0.01;
		User.DamageToSelfTurns = 6;
		 
		  // UPDATE DATA

		 FixedJSON = JSON.stringify(User, null, "\t");
		 fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);

		 let FixedJSON2 = JSON.stringify(Enemy, null, "\t");
		 fs.writeFileSync("./PetBot/settings/dungeon/Boss.txt",FixedJSON2);
	}

	if(ID == "23"){
		message.channel.send("Skill activated: [Mezase! World Future Fes!] Increases EXP gained by 20% for 8 turns + Increases critical rate by 7% for 8 turns + Deals 250 extra damage for 8 turns + Increases morale gained after killing an enemy by 0.5% for 10 turns.");
		User.Skill_Slot3_Cooldown = 24;
		if(User.Morale < 25){
	  			User.Skill_Slot3_Cooldown += 1;
	  	}
		
		User.ExtraEXP = 1.2;
		User.ExtraEXPTurns = 8;
		User.CriticalIncrease += 7;
		User.CriticalIncreaseTurns = 8;
		User.AttackBoost = 250;
		User.ExtraDamageTurns = 8;
		User.ExtraMorale = 0.5;
		User.ExtraMoraleTurns = 10;

		 
		  // UPDATE DATA

		 FixedJSON = JSON.stringify(User, null, "\t");
		 fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);

		 let FixedJSON2 = JSON.stringify(Enemy, null, "\t");
		 fs.writeFileSync("./PetBot/settings/dungeon/Boss.txt",FixedJSON2);
	}

	if(ID == "24"){
	  
	  message.channel.send("Enemy skill activated: [Sacred Heal EX] Recover 3000 HP but decrease Max HP by 50.");

	  User.CurrentHP += 3000;
	  User.MaxHP -= 50;
	  User.Skill_Slot1_ID = 11;

	  let FixedJSON = JSON.stringify(Player, null, "\t");
		fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);
	  
	} 

	if(ID == "25"){
	  
	  message.channel.send("Enemy skill activated: [Holy Trinity D] Deals 7000 more damage to a dark enemy next turn.");

	  User.ExtraDamageToDark += 7000;
	  User.ExtremeDamageTurns = 1;

	  User.Skill_Slot2_Cooldown = 10;

	  let FixedJSON = JSON.stringify(Player, null, "\t");
		fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);
	  
	}

	if(ID == "26"){
	  
	  message.channel.send("Enemy skill activated: [In God We Trust] Recovers morale up to 125%");

	  if(User.Morale > 125){
	  	message.channel.send("Your morale is above 125%");
	  	return;
	  }

	  User.Morale = 125;
	  User.Skill_Slot3_Cooldown = 999;

	  let FixedJSON = JSON.stringify(Player, null, "\t");
		fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);
	  
	}

	if(ID == "E01"){
	  

	  message.channel.send("Enemy skill activated: [Fury] ATK increased by 10% for 2 turns.");

	  Enemy.AttackMultiplier = Enemy.AttackMultiplier * 1.1;
	  Enemy.AttackMultiplierTurns = 2;
	  Enemy.Skill_Slot2_Cooldown = 6;

	  let FixedJSON = JSON.stringify(Enemy, null, "\t");
		fs.writeFileSync("./PetBot/settings/dungeon/Boss.txt",FixedJSON);
	  
	}

	if(ID == "E02"){
	  
	  message.channel.send("Enemy skill activated: [Great Fury] ATK increased by 20% for 4 turns.");

	  Enemy.AttackMultiplier = Enemy.AttackMultiplier * 1.2;
	  Enemy.AttackMultiplierTurns = 4;
	  Enemy.Skill_Slot2_Cooldown = 8;

	  let FixedJSON = JSON.stringify(Enemy, null, "\t");
		fs.writeFileSync("./PetBot/settings/dungeon/Boss.txt",FixedJSON);

	}

	if(ID == "E03"){
	  
	  message.channel.send("Enemy skill activated: [Sound of the Death] ATK increased by 25% for 6 turns.");


	  Enemy.AttackMultiplier = Enemy.AttackMultiplier * 1.25;
	  Enemy.AttackMultiplierTurns = 7;
	  Enemy.Skill_Slot1_Cooldown = 12;

	  let FixedJSON = JSON.stringify(Enemy, null, "\t");
		fs.writeFileSync("./PetBot/settings/dungeon/Boss.txt",FixedJSON);

	  
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
		fs.writeFileSync("./PetBot/settings/dungeon/Boss.txt",FixedJSON);
	  } else{

	  message.channel.send("Enemy skill activated: [Experimenting!] (Failed - 80% chance)] ATK decreased by 15% for 4 turns.");
	  Enemy.AttackMultiplier = Enemy.AttackMultiplier * 0.85;
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
		message.channel.send("Enemy skill activated: [Vampiric Bless] ATK increased by 400% for the next turn.)");

	   Enemy.AttackMultiplier = Enemy.AttackMultiplier * 4;
		Enemy.AttackMultiplierTurns = 2;
		Enemy.Skill_Slot1_Cooldown = 4;
		let FixedJSON = JSON.stringify(Enemy, null, "\t");
		fs.writeFileSync("./PetBot/settings/dungeon/Boss.txt",FixedJSON);

  // message.channel.send("Skill is now active"); 
  }

   if(ID == "E08"){
	  
	  message.channel.send("Enemy skill activated: [Sound of Pain] ATK decreased by 90% for the next turn. Decreases player's special gauge in 20%");


	  Enemy.AttackMultiplier = Enemy.AttackMultiplier * 0.1;
	  Enemy.AttackMultiplierTurns = 2;
	  Enemy.Skill_Slot2_Cooldown = 8;
	  User.ManaGauge = User.ManaGauge - 20;
	  let FixedJSON = JSON.stringify(Enemy, null, "\t");
		fs.writeFileSync("./PetBot/settings/dungeon/Boss.txt",FixedJSON);
	  let FixedJSON2 = JSON.stringify(User, null, "\t");
		fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);
	  
	}

	if(ID == "E09"){
	  
	  message.channel.send("Enemy skill activated: [Regeneration E] Restores 10% of HP. Then increases Max HP by 10%.");

	  Enemy.CurrentHP = Enemy.CurrentHP + (Enemy.MaxHP * 0.1);
	  Enemy.MaxHP = Enemy.MaxHP + (Enemy.MaxHP * 0.1);
	  Enemy.Skill_Slot1_Cooldown = 7;

	  let FixedJSON = JSON.stringify(Enemy, null, "\t");
		fs.writeFileSync("./PetBot/settings/dungeon/Boss.txt",FixedJSON);
	  
	}

	if(ID == "E10"){
	  
	  message.channel.send("Enemy skill activated: [Regeneration D] Increases Max HP by 10%. Then restores 10% of HP.");

	  Enemy.MaxHP = Enemy.MaxHP + (Enemy.MaxHP * 0.1);
	  Enemy.CurrentHP = Enemy.CurrentHP + (Enemy.MaxHP * 0.1);
	  Enemy.Skill_Slot2_Cooldown = 8;

	  let FixedJSON = JSON.stringify(Enemy, null, "\t");
		fs.writeFileSync("./PetBot/settings/dungeon/Boss.txt",FixedJSON);
	  
	}

	 if(ID == "E11"){
	  
	  message.channel.send("Enemy skill activated: [Resize] Increases its own ATK by 5%. Decreases its own evasion by 1%.");

	  Enemy.Atk = Enemy.Atk + (Enemy.Atk * 0.05);
	  Enemy.Evade = Enemy.Evade - 1;
	  //Enemy.Skill_Slot1_Cooldown = 3;
	  // This skill has no cooldown

	  let FixedJSON = JSON.stringify(Enemy, null, "\t");
		fs.writeFileSync("./PetBot/settings/dungeon/Boss.txt",FixedJSON);
	  
	}

	if(ID == "E12"){
	  
	  message.channel.send("Enemy skill activated: [Bloody Intention] Increases its own ATK by 1000%. Decreases its own evasion all the way down to 0.");

	  Enemy.Atk = Enemy.Atk * 10;
	  Enemy.Evade = 0;
	  Enemy.Skill_Slot2_Cooldown = 500;

	  let FixedJSON = JSON.stringify(Enemy, null, "\t");
		fs.writeFileSync("./PetBot/settings/dungeon/Boss.txt",FixedJSON);
	  
	}

	if(ID == "E13"){
	  
	  message.channel.send("Enemy skill activated: [Protection of Dark A] Decreases player's ATK by 80% for 3 turns.");

	  User.AttackMultiplier = User.AttackMultiplier * 0.2;
	  User.AttackMultiplierTurns = 3;
	  Enemy.Skill_Slot1_Cooldown = 9;

	  let FixedJSON = JSON.stringify(Enemy, null, "\t");
		fs.writeFileSync("./PetBot/settings/dungeon/Boss.txt",FixedJSON);

	  let FixedJSON2 = JSON.stringify(User, null, "\t");
		fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);
	  
	}

	if(ID == "E14"){
	  
	  message.channel.send("Enemy skill activated: [Cut of Sword] Increases own ATK by 15% for 5 turns.");

	  Enemy.AttackMultiplier = Enemy.AttackMultiplier * 1.15;
	  Enemy.AttackMultiplierTurns = 5;
	  Enemy.Skill_Slot2_Cooldown = 11;

	  let FixedJSON = JSON.stringify(Enemy, null, "\t");
		fs.writeFileSync("./PetBot/settings/dungeon/Boss.txt",FixedJSON);
	  
	}

	  if(ID == "E15"){
	  
	  message.channel.send("Enemy skill activated: [Levitation] Increases own evasion rate by 20% for 2 turns.");

	  Enemy.EvadeExtra += 20;
	  Enemy.EvadeExtraTurns = 2;
	  Enemy.Skill_Slot3_Cooldown = 6;

	  let FixedJSON = JSON.stringify(Enemy, null, "\t");
		fs.writeFileSync("./PetBot/settings/dungeon/Boss.txt",FixedJSON);
	  
	} 


	if(ID == "E16"){
	  
	  message.channel.send("Enemy skill activated: [Memory Manipulation] Increases cooldown for all enemy skills by 5 turns.");

	  User.Skill_Slot1_Cooldown += 6;
	  User.Skill_Slot2_Cooldown += 6;
	  User.Skill_Slot3_Cooldown += 6;
	  Enemy.Skill_Slot1_Cooldown = 6;

	  let FixedJSON = JSON.stringify(Enemy, null, "\t");
	  fs.writeFileSync("./PetBot/settings/dungeon/Boss.txt",FixedJSON);

	  let FixedJSON2 = JSON.stringify(User, null, "\t");
		fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);
	  
	}

	if(ID == "E17"){
	  
	  message.channel.send("Enemy skill activated: [Returns] Heals 2000 HP to self, 500 to enemy, increases cooldown for own and enemy's skills by 3 turns. Reduces enemy's special gauge by 10% of current gauge [except if <0%]. Reduces enemy's ATK by 50% for one turn.");

	  Enemy.CurrentHP += 2000;
	  User.CurrentHP += 500;
	  User.Skill_Slot1_Cooldown += 4;
	  User.Skill_Slot2_Cooldown += 4;
	  User.Skill_Slot3_Cooldown += 4;
	  Enemy.Skill_Slot1_Cooldown += 4;
	  Enemy.Skill_Slot2_Cooldown += 5;
	  if(User.ManaGauge > 0){
	  	 User.ManaGauge += -(User.ManaGauge*0.1);
	  }
	  User.AttackMultiplier *= 0.5;
	  User.AttackMultiplierTurns = 2;

	  let FixedJSON = JSON.stringify(Enemy, null, "\t");
	  fs.writeFileSync("./PetBot/settings/dungeon/Boss.txt",FixedJSON);

	  let FixedJSON2 = JSON.stringify(User, null, "\t");
		fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);
	  
	}

	if(ID == "E18"){
	  let ExperimentingChance = getRandom(0, 100);

	  if(ExperimentingChance <= 40){
		message.channel.send("Enemy skill activated: [Advanced Experimenting! (Worked - 40% chance)] ATK increased by 300% for 7 turns");

		Enemy.AttackMultiplier *= 4;
		Enemy.AttackMultiplierTurns = 8;
		Enemy.Skill_Slot1_Cooldown = 10;
		let FixedJSON = JSON.stringify(Enemy, null, "\t");
		fs.writeFileSync("./PetBot/settings/dungeon/Boss.txt",FixedJSON);
	  } else{

	  message.channel.send("Enemy skill activated: [Advanced Experimenting!] (Failed - 60% chance)] ATK decreased by 15% for 4 turns.");
	  Enemy.AttackMultiplier = Enemy.AttackMultiplier * 0.85;
	  Enemy.AttackMultiplierTurns = 4;
	  Enemy.Skill_Slot1_Cooldown = 10;
	  let FixedJSON = JSON.stringify(Enemy, null, "\t");
		fs.writeFileSync("./PetBot/settings/dungeon/Boss.txt",FixedJSON);
		}
	 }

	 if(ID == "E19"){
	
		message.channel.send("Enemy skill activated: [Curse] Reduces enemy's ATK by 50% for 3 turns, all enemy attacks deal 200 less damage for 5 turns, increases cooldown for all enemy skills by 2 turns, reduces evade chance in half for 8 turns, reduces crit chance by 7% for 3 turns, reduces mana gauge by 10%, if gauge is <10%, instead of reducing it, heals self for 3000 HP. ");

		User.AttackMultiplier *= 0.5;
		User.AttackMultiplierTurns += 4;
		User.AttackBoost += -200;
		User.AttackIncreaseTurns = 6;
		User.Skill_Slot1_Cooldown += 3;
		User.Skill_Slot2_Cooldown += 3;
		User.Skill_Slot3_Cooldown += 3;
		User.EvadeExtra += -5;
		User.EvadeExtraTurns = 8;
		User.CriticalIncrease += -7
		User.CriticalIncreaseTurns = 3
		if(User.ManaGauge >= 10){
			User.ManaGauge += -10;
		} else{
			Enemy.CurrentHP += 3000;
		}
		Enemy.Skill_Slot2_Cooldown = 7;

		let FixedJSON = JSON.stringify(Enemy, null, "\t");
		fs.writeFileSync("./PetBot/settings/dungeon/Boss.txt",FixedJSON);

		let FixedJSON2 = JSON.stringify(User, null, "\t");
		fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON2);
	 }

	 if(ID == "E20"){
	
		message.channel.send("Enemy skill activated: [Vampirism] Deals 7.5% of user's max HP as damage and heals half of that.");

		User.CurrentHP -= User.MaxHP*0.075;
		Enemy.CurrentHP += (User.MaxHP*0.075)/2;

		message.channel.send("You have received "+User.MaxHP*0.075 + " damage. Your enemy healed " + (User.MaxHP*0.075)/2 + " HP" )

		Enemy.Skill_Slot2_Cooldown = 7;

		let FixedJSON = JSON.stringify(Enemy, null, "\t");
		fs.writeFileSync("./PetBot/settings/dungeon/Boss.txt",FixedJSON);

		let FixedJSON2 = JSON.stringify(User, null, "\t");
		fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON2);
	 }

	 if(ID == "E21"){
	
		message.channel.send("Enemy skill activated: [Thou Shalt Not Run] Increases cooldown for all enemy skills by 2 turns and decreases own skills cooldown by 3.");

		User.Skill_Slot1_Cooldown += 3;
		User.Skill_Slot2_Cooldown += 3;
		User.Skill_Slot3_Cooldown += 3;
		// Enemy.Skill_Slot1_Cooldown += -3;
		Enemy.Skill_Slot2_Cooldown += -3;
		Enemy.Skill_Slot3_Cooldown += -3;

		Enemy.Skill_Slot1_Cooldown = 7;

		let FixedJSON = JSON.stringify(Enemy, null, "\t");
		fs.writeFileSync("./PetBot/settings/dungeon/Boss.txt",FixedJSON);

		let FixedJSON2 = JSON.stringify(User, null, "\t");
		fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON2);
	 }

	 if(ID == "E22"){
	
		message.channel.send("Enemy skill activated: [Keep moving forward... to hell] Increases ATK by player's ATK only for this attack. Attacks normally.");

		let EnemyAttackMessage = "";
  		console.log("Upon dec: "+User.CurrentHP);

		Enemy.Skill_Slot2_Cooldown = 15;

		FixedJSON = JSON.stringify(Enemy, null, "\t");
		fs.writeFileSync("./PetBot/settings/dungeon/Boss.txt",FixedJSON);


		let FoeEvaded = CalculateEvasion(User.Evade, User.Immune, Enemy.Attribute, User.ImmuneTo, User.EvadeExtra);

		if(FoeEvaded == true){
			message.channel.send("Enemy attacked you, but you evaded it or were immune!");
			return;
		}


		let Damage = CalculateDamage(User.Atk + Enemy.Atk);

		Damage = (Damage*(Enemy.AttackMultiplier/100));
		Damage += Enemy.AttackBoost;
		if(Damage < 0){
			Damage = 1;
		}

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

	  let ProgressDamageReceived = fs.readFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgReceivedByBoss.txt");
	  ProgressDamageReceived = parseFloat(ProgressDamageReceived) + parseFloat(Damage);
	  fs.writeFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgReceivedByBoss.txt",ProgressDamageReceived);

	  Damage = Math.ceil(Damage);

	  let IsEnemyDead = DealDamageAsEnemy(Damage, User.CurrentHP, message, EnemyAttackMessage);

	  if(IsEnemyDead == true){
		message.channel.send("You have been beaten by this enemy!");
		User.CurrentHP = 0;
	  } else{
		User.CurrentHP = IsEnemyDead;
	  }


		console.log("1666: "+UserID);
		console.log(User);


		FixedJSON = JSON.stringify(Enemy, null, "\t");
		fs.writeFileSync("./PetBot/settings/dungeon/Boss.txt",FixedJSON);

		let FixedJSON2 = JSON.stringify(User, null, "\t");
		fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON2);
	 }

	 if(ID == "E23"){
	
		message.channel.send("Enemy skill activated: [Time is over!] All enemy attacks deal 800 + (User.MaxHP / 60) more damage for (User.Atk/2000) turns [both rounded up].");

		Enemy.AttackBoost += 800 + Math.ceil(User.MaxHP/60);
		Enemy.AttackIncreaseTurns = Math.ceil(User.Atk/2000);

		message.channel.send("Damage increased by " + parseInt(parseInt(800) + parseInt(Math.ceil(User.MaxHP/60))) + " for " + Math.ceil(User.Atk/2000) + " turns.");
	
		Enemy.Skill_Slot2_Cooldown = 18;

		let FixedJSON = JSON.stringify(Enemy, null, "\t");
		fs.writeFileSync("./PetBot/settings/dungeon/Boss.txt",FixedJSON);

		let FixedJSON2 = JSON.stringify(User, null, "\t");
		fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON2);
	 }

	 if(ID == "E24"){
		message.channel.send("Enemy skill activated: [Form Change - Friend] Decreases player's morale by 2%.");
		User.Morale += -2;
		Enemy.Skill_Slot1_Cooldown = 3;
		let FixedJSON = JSON.stringify(Enemy, null, "\t");
		fs.writeFileSync("./PetBot/settings/dungeon/Boss.txt",FixedJSON);

		let FixedJSON2 = JSON.stringify(User, null, "\t");
		fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON2);
	 }

	 if(ID == "E25"){
		message.channel.send("Enemy skill activated: [Form Change - Family] Decreases player's morale by 6%.");
		User.Morale += -6;
		Enemy.Skill_Slot2_Cooldown = 5;
		let FixedJSON = JSON.stringify(Enemy, null, "\t");
		fs.writeFileSync("./PetBot/settings/dungeon/Boss.txt",FixedJSON);

		let FixedJSON2 = JSON.stringify(User, null, "\t");
		fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON2);
	 }

	 if(ID == "E26"){
	  
	  message.channel.send("Enemy skill activated: [Anti-Monarchy Spirit] ATK increased by 70% for 4 turns.");

	  Enemy.AttackMultiplier = Enemy.AttackMultiplier * 1.7;
	  Enemy.AttackMultiplierTurns = 4;
	  Enemy.Skill_Slot1_Cooldown = 12;

	  let FixedJSON = JSON.stringify(Enemy, null, "\t");
		fs.writeFileSync("./PetBot/settings/dungeon/Boss.txt",FixedJSON);

	}

	if(ID == "E27"){
		message.channel.send("Enemy skill activated: [Guerrilla Tactics] Decreases player's morale by 2.7%.");
		User.Morale += -2.7;
		Enemy.Skill_Slot2_Cooldown = 10;
		let FixedJSON = JSON.stringify(Enemy, null, "\t");
		fs.writeFileSync("./PetBot/settings/dungeon/Boss.txt",FixedJSON);
		let FixedJSON2 = JSON.stringify(User, null, "\t");
		fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON2);
	 }

	 if(ID == "E28"){
	  
	  message.channel.send("Enemy skill activated: [Spiritual Levitation] Increases own evasion rate by 25% for 4 turns. Spirit attribute ignores evasion completely for 4 turns.");

	  Enemy.EvadeExtra += 25;
	  Enemy.EvadeExtraTurns = 4;
	  Enemy.ClassIgnoresEvade = "Spirit";
	  Enemy.ClassIgnoresEvadeTurns = 4;
	  Enemy.Skill_Slot3_Cooldown = 6;

	  let FixedJSON = JSON.stringify(Enemy, null, "\t");
		fs.writeFileSync("./PetBot/settings/dungeon/Boss.txt",FixedJSON);
	  
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
	if(User.AttackPenalty == true){
		User.AttackPenalty = false;
		User.AttackMultiplier = 0.2;
		User.AttackMultiplierTurns = 2;
	}


	let FixedJSON = JSON.stringify(User, null, "\t");
		fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);
  }

  if(Enemy.AttackMultiplierTurns != 0){
	Enemy.AttackMultiplierTurns = Enemy.AttackMultiplierTurns-1;

	let FixedJSON = JSON.stringify(Enemy, null, "\t");
	fs.writeFileSync("./PetBot/settings/dungeon/Boss.txt",FixedJSON);
  }
  if(Enemy.AttackMultiplierTurns == 0){
	Enemy.AttackMultiplier = 100;
	let FixedJSON = JSON.stringify(Enemy, null, "\t");
		fs.writeFileSync("./PetBot/settings/dungeon/Boss.txt",FixedJSON);
  }

  if(Enemy.EvadeExtraTurns != 0){
	Enemy.EvadeExtraTurns = Enemy.EvadeExtraTurns-1;

	let FixedJSON = JSON.stringify(Enemy, null, "\t");
	fs.writeFileSync("./PetBot/settings/dungeon/Boss.txt",FixedJSON);
  }
  if(Enemy.EvadeExtraTurns == 0){
	Enemy.EvadeExtra = 0;
	let FixedJSON = JSON.stringify(Enemy, null, "\t");
		fs.writeFileSync("./PetBot/settings/dungeon/Boss.txt",FixedJSON);
  }

	if(Enemy.Skill_Slot1_Cooldown != 0){
	console.log("Skill_Slot1_Cooldown reduced to: "+User.Skill_Slot1_Cooldown);
	Enemy.Skill_Slot1_Cooldown = Enemy.Skill_Slot1_Cooldown - 1;
	let FixedJSON = JSON.stringify(Enemy, null, "\t");
		fs.writeFileSync("./PetBot/settings/dungeon/Boss.txt",FixedJSON);
  }

  if(Enemy.Skill_Slot2_Cooldown != 0){
	Enemy.Skill_Slot2_Cooldown = Enemy.Skill_Slot2_Cooldown - 1;
	let FixedJSON = JSON.stringify(Enemy, null, "\t");
		fs.writeFileSync("./PetBot/settings/dungeon/Boss.txt",FixedJSON);
}

  if(Enemy.Skill_Slot3_Cooldown != 0){
	Enemy.Skill_Slot3_Cooldown = Enemy.Skill_Slot3_Cooldown - 1;
	let FixedJSON = JSON.stringify(Enemy, null, "\t");
		fs.writeFileSync("./PetBot/settings/dungeon/Boss.txt",FixedJSON);
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

if(Enemy.AttackIncreaseTurns == 1){
  message.channel.send("ATK boost is now over.");
	Enemy.AttackBoost = 0;
	let FixedJSON = JSON.stringify(User, null, "\t");
		fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);
}

if(Enemy.AttackIncreaseTurns != 0){
	Enemy.AttackIncreaseTurns += -1;
	let FixedJSON = JSON.stringify(User, null, "\t");
		fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);
}

if(User.ExtremeDamageTurns == 0){
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
	User.CriticalIncreaseTurns += -1;
	let FixedJSON = JSON.stringify(User, null, "\t");
		fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);
}

if(User.ExtraEXPTurns == 1){
	User.ExtraEXP = 1;
	let FixedJSON = JSON.stringify(User, null, "\t");
	fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);
}

if(User.ExtraEXPTurns != 0){
	User.ExtraEXPTurns += -1;
	let FixedJSON = JSON.stringify(User, null, "\t");
	fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);
}

if(User.ExtraMoraleTurns == 1){
	User.ExtraMorale = 0;
	let FixedJSON = JSON.stringify(User, null, "\t");
	fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);
}

if(User.ExtraMoraleTurns != 0){
	User.ExtraMoraleTurns += -1;
	let FixedJSON = JSON.stringify(User, null, "\t");
	fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);
}

if(User.CriticalIncreaseTurns != 0){
	User.CriticalIncreaseTurns += -1;
	let FixedJSON = JSON.stringify(User, null, "\t");
		fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);
}

if(User.StrongWeakSwitchedTurns == 1){
	let TemporarySave = User.StrongVs;
	User.StrongVs = User.WeakVs;
	User.WeakVs = TemporarySave;
	let FixedJSON = JSON.stringify(User, null, "\t");
	fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);
}

if(User.StrongWeakSwitchedTurns != 0){
	User.StrongWeakSwitchedTurns--;
	let FixedJSON = JSON.stringify(User, null, "\t");
	fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);
}

if(User.DamageToSelfTurns == 1){
	User.DamageToSelf = 0;
	let FixedJSON = JSON.stringify(User, null, "\t");
	fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);
}

if(User.DamageToSelfTurns != 0){
	User.DamageToSelfTurns--;
	let FixedJSON = JSON.stringify(User, null, "\t");
	fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);
}




if(User.ExtraDamageTurns != 0){
	User.ExtraDamageTurns--;
	let FixedJSON = JSON.stringify(User, null, "\t");
	fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);
}

	if(User.ExtraDamageTurns == 1){
		User.ExtraDamageToDragon = 0;
		User.ExtraDamageToHuman = 0;
		User.ExtraDamageToOthers = 0;
		let FixedJSON = JSON.stringify(User, null, "\t");
		fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);
	}



	let ObtainedEXP = getRandom(10,70);
	if(!!User.ExtraEXP == true){
		ObtainedEXP *= User.ExtraEXP;
	}
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
	let FoeEvaded = CalculateEvasion(Enemy.Evade, Enemy.Immune, User.Attribute, Enemy.ImmuneTo, Enemy.EvadeExtra);

	  if(FoeEvaded == true){
		message.channel.send("Enemy evaded or was immune!");
		AITurn(User, Enemy, message, UserID);
		return;
	  }

	  let Damage = CalculateDamage(User.Atk, User.Morale);

	  Damage = (Damage*(User.AttackMultiplier/100)); // AttackMultiplier, 100 is x1
	  Damage = Damage+User.AttackBoost;
	  if(Damage < 0){
	  	Damage = 1;
	  }
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
		if(User.Morale == 200){
			Damage = Math.ceil(Damage*1.41);
		} else if(User.Morale > 150){
			Damage = Math.ceil(Damage*1.39);
		} else if(User.Morale > 125){
			Damage = Math.ceil(Damage*1.37);
		} else{
			Damage = Math.ceil(Damage*1.33);
		}
		message.channel.send("Critical Hit!");
	  }

	  let ProgressDamageDealt = fs.readFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgDealtToBoss.txt");
	  ProgressDamageDealt = parseFloat(ProgressDamageDealt) + parseFloat(Damage);
	  fs.writeFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgDealtToBoss.txt",ProgressDamageDealt);

	  let IsEnemyDead = DealDamage(Damage, Enemy.CurrentHP, message, AttackUserMessage);

	  if(IsEnemyDead == true){
		message.channel.send("You have beaten this enemy!");
		Enemy.CurrentHP = 0;
	  } else{
		Enemy.CurrentHP = IsEnemyDead;
	  }


	  // UPDATE DATA
	  let FixedJSON = JSON.stringify(User, null, "\t");
	  fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);

	  let FixedJSON2 = JSON.stringify(Enemy, null, "\t");
		 fs.writeFileSync("./PetBot/settings/dungeon/Boss.txt",FixedJSON2);

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
	  message.channel.send("Warning: An issue has ocurred. Error code 1694. Aborted command.");
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

	if(Chance <= -1 || Enemy.Attribute == "Human"){
	  message.channel.send("**Kruziikqostiid Se Fin Revakdinok Nau Muz!**\n\nSpecial power: KO an enemy. (Succesful).");

	

	  let Damage = 999999999;



	  let IsEnemyDead = DealDamage(Damage, Enemy.CurrentHP, message, AttackUserMessage);

		message.channel.send("You have beaten this enemy!");
		Enemy.CurrentHP = 0;


	  // UPDATE DATA
	  let FixedJSON = JSON.stringify(User, null, "\t");
	  fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);

	  let FixedJSON2 = JSON.stringify(Enemy, null, "\t");
		 fs.writeFileSync("./PetBot/settings/dungeon/Boss.txt",FixedJSON2);

	  updateJsonFile("./PetBot/settings/dungeon/Player_"+UserID+".txt", (data) => {
	  data.ManaGauge = User.ManaGauge;
	  data.InformedAboutMana = User.InformedAboutMana;
	  return data;
	  });

	  console.log(IsEnemyDead);
  } else{
	message.channel.send("**Kruziikqostiid Se Fin Revakdinok Nau Muz!**\n\nSpecial power: Deals 10% of normal damage. (Failed).");
	let FoeEvaded = CalculateEvasion(Enemy.Evade, Enemy.Immune, User.Attribute, Enemy.ImmuneTo, Enemy.EvadeExtra);

	  if(FoeEvaded == true){
		message.channel.send("Enemy evaded or was immune!");
		AITurn(User, Enemy, message, UserID);
		return;
	  }

	  let Damage = CalculateDamage(User.Atk, User.Morale);

	  Damage = (Damage*(User.AttackMultiplier/100)); // AttackMultiplier, 100 is x1
	  Damage = Damage+User.AttackBoost;
	  if(Damage < 0){
	  	Damage = 1;
	  }
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
		if(User.Morale == 200){
			Damage = Math.ceil(Damage*1.41);
		} else if(User.Morale > 150){
			Damage = Math.ceil(Damage*1.39);
		} else if(User.Morale > 125){
			Damage = Math.ceil(Damage*1.37);
		} else{
			Damage = Math.ceil(Damage*1.33);
		}
		message.channel.send("Critical Hit!");
	  }

	  let ProgressDamageDealt = fs.readFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgDealtToBoss.txt");
	  ProgressDamageDealt = parseFloat(ProgressDamageDealt) + parseFloat(Damage);
	  fs.writeFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgDealtToBoss.txt",ProgressDamageDealt);

	  let IsEnemyDead = DealDamage(Damage, Enemy.CurrentHP, message, AttackUserMessage);

	  if(IsEnemyDead == true){
		message.channel.send("You have beaten this enemy!");
		Enemy.CurrentHP = 0;
	  } else{
		Enemy.CurrentHP = IsEnemyDead;
	  }

	  // UPDATE DATA
	  let FixedJSON = JSON.stringify(User, null, "\t");
	  fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);

	  let FixedJSON2 = JSON.stringify(Enemy, null, "\t");
		 fs.writeFileSync("./PetBot/settings/dungeon/Boss.txt",FixedJSON2);

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
	let FoeEvaded = CalculateEvasion(Enemy.Evade, Enemy.Immune, User.Attribute, Enemy.ImmuneTo, Enemy.EvadeExtra);

	  if(FoeEvaded == true){
		message.channel.send("Enemy evaded or was immune!");
		AITurn(User, Enemy, message, UserID);
		return;
	  }

	  let Damage = CalculateDamage(User.Atk, User.Morale);

	  Damage = (Damage*(User.AttackMultiplier/100)); // AttackMultiplier, 100 is x1
	  Damage = Damage+User.AttackBoost;
	  if(Damage < 0){
	  	Damage = 1;
	  }
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
		if(User.Morale == 200){
			Damage = Math.ceil(Damage*1.41);
		} else if(User.Morale > 150){
			Damage = Math.ceil(Damage*1.39);
		} else if(User.Morale > 125){
			Damage = Math.ceil(Damage*1.37);
		} else{
			Damage = Math.ceil(Damage*1.33);
		}
		message.channel.send("Critical Hit!");
	  }

	  let ProgressDamageDealt = fs.readFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgDealtToBoss.txt");
	  ProgressDamageDealt = parseFloat(ProgressDamageDealt) + parseFloat(Damage);
	  fs.writeFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgDealtToBoss.txt",ProgressDamageDealt);

	  let IsEnemyDead = DealDamage(Damage, Enemy.CurrentHP, message, AttackUserMessage);

	  if(IsEnemyDead == true){
		message.channel.send("You have beaten this enemy!");
		Enemy.CurrentHP = 0;
	  } else{
		Enemy.CurrentHP = IsEnemyDead;
	  }


	  // UPDATE DATA
	 let FixedJSON = JSON.stringify(User, null, "\t");
	  fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);

	  let FixedJSON2 = JSON.stringify(Enemy, null, "\t");
		 fs.writeFileSync("./PetBot/settings/dungeon/Boss.txt",FixedJSON2);

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

	 if(User.SpecialID == "05"){ // Feisty Val
	message.channel.send("**Leave the rest to me!**\n\nSpecial power: - All attacks (included enemies') deal 50% extra damage for 10 turns. Using healing potions during this time will also grant 20% extra healing.\n- Deals massive damage (400%-600%) to an enemy.\n- Deals minor variable damage (10% - 200%) to self.");
		
	User.AttackMultiplier *= 1.5;
	Enemy.AttackMultiplier *= 1.5;
	User.AttackMultiplierTurns = 11;
	Enemy.AttackMultiplierTurns = 11;

	let DamageChance = getRandom(400,600);
	let DamageChance2 = getRandom(10,200);
	let FoeEvaded = CalculateEvasion(Enemy.Evade, Enemy.Immune, User.Attribute, Enemy.ImmuneTo, Enemy.EvadeExtra);

	 if(FoeEvaded == true){
		message.channel.send("Enemy evaded or was immune!");
		AITurn(User, Enemy, message, UserID);
		return;
	  }

	  let Damage = CalculateDamage(User.Atk, User.Morale);

	  Damage = (Damage*(User.AttackMultiplier/100)); // AttackMultiplier, 100 is x1
	  Damage = Damage+User.AttackBoost;
	  if(Damage < 0){
	  	Damage = 1;
	  }
	  Damage = Damage*(DamageChance/100) // boosted damage bonus
	  User.CurrentHP += -(Damage*(DamageChance2/100));
	  message.channel.send("Self damaged for " + (Damage*(DamageChance2/100)) + "!");

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
		if(User.Morale == 200){
			Damage = Math.ceil(Damage*1.41);
		} else if(User.Morale > 150){
			Damage = Math.ceil(Damage*1.39);
		} else if(User.Morale > 125){
			Damage = Math.ceil(Damage*1.37);
		} else{
			Damage = Math.ceil(Damage*1.33);
		}
		message.channel.send("Critical Hit!");
	  }

	  let ProgressDamageDealt = fs.readFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgDealtToBoss.txt");
	  ProgressDamageDealt = parseFloat(ProgressDamageDealt) + parseFloat(Damage);
	  fs.writeFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgDealtToBoss.txt",ProgressDamageDealt);

	  let IsEnemyDead = DealDamage(Damage, Enemy.CurrentHP, message, AttackUserMessage);

	  if(IsEnemyDead == true){
		message.channel.send("You have beaten this enemy!");
		Enemy.CurrentHP = 0;
	  } else{
		Enemy.CurrentHP = IsEnemyDead;
	  }


	  // UPDATE DATA
	  let FixedJSON = JSON.stringify(User, null, "\t");
	  fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);

	  let FixedJSON2 = JSON.stringify(Enemy, null, "\t");
		 fs.writeFileSync("./PetBot/settings/dungeon/Boss.txt",FixedJSON2);

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

	 if(User.SpecialID == "06"){ // QT


	 if(User.CurrentMode == "Attack"){ // Attack Mode
	
		message.channel.send("**I want to change the world!**\n\nSpecial power: \n- Deal massive variable damage (300% - 1500%) to an enemy.\n- After usage, decreases current mana by 50%.")	
		User.ManaGauge += -50;
		let DamageChance = getRandom(300,1500);
		let FoeEvaded = CalculateEvasion(Enemy.Evade, Enemy.Immune, User.Attribute, Enemy.ImmuneTo, Enemy.EvadeExtra);

		  if(FoeEvaded == true){
			message.channel.send("Enemy evaded or was immune!");
			AITurn(User, Enemy, message, UserID);
			return;
		  }

		  let Damage = CalculateDamage(User.Atk, User.Morale);

		  Damage = (Damage*(User.AttackMultiplier/100)); // AttackMultiplier, 100 is x1
		  Damage = Damage+User.AttackBoost;
		  if(Damage < 0){
	  		Damage = 1;
	  	  }
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
			if(User.Morale == 200){
				Damage = Math.ceil(Damage*1.41);
			} else if(User.Morale > 150){
				Damage = Math.ceil(Damage*1.39);
			} else if(User.Morale > 125){
				Damage = Math.ceil(Damage*1.37);
			} else{
				Damage = Math.ceil(Damage*1.33);
			}
			message.channel.send("Critical Hit!");
		  }

		  let ProgressDamageDealt = fs.readFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgDealtToBoss.txt");
		  ProgressDamageDealt = parseFloat(ProgressDamageDealt) + parseFloat(Damage);
		  fs.writeFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgDealtToBoss.txt",ProgressDamageDealt);

		  let IsEnemyDead = DealDamage(Damage, Enemy.CurrentHP, message, AttackUserMessage);

		  if(IsEnemyDead == true){
			message.channel.send("You have beaten this enemy!");
			Enemy.CurrentHP = 0;
		  } else{
			Enemy.CurrentHP = IsEnemyDead;
		  }


		  // UPDATE DATA

		  updateJsonFile("./PetBot/settings/dungeon/Player_"+UserID+".txt", (data) => {
		  data.ManaGauge = User.ManaGauge;
		  data.InformedAboutMana = User.InformedAboutMana;
		  return data;
		  });

		  	console.log(IsEnemyDead);
		  	if(IsEnemyDead != true){
				AITurn(User, Enemy, message, UserID);
		   	}

		   	let FixedJSON = JSON.stringify(User, null, "\t");
	  		fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);

	 		let FixedJSON2 = JSON.stringify(Enemy, null, "\t");
			fs.writeFileSync("./PetBot/settings/dungeon/Boss.txt",FixedJSON2);

			return;


		} else{ // Defense mode
			message.channel.send("**I want to change the world!**\n\nSpecial power: \n- Heals 4000 HP.\n- Increases evade chance by 30% for 2 turns.\n- After usage, restores 20% mana.");


			User.CurrentHP += 4000;
			User.EvadeExtra += 30;
			User.EvadeExtraTurns = 3;
			User.ManaGauge += 20;

		 }

			let FixedJSON = JSON.stringify(User, null, "\t");
	  		fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);

	 		let FixedJSON2 = JSON.stringify(Enemy, null, "\t");
			fs.writeFileSync("./PetBot/settings/dungeon/Boss.txt",FixedJSON2); 

			return;

	}

	if(User.SpecialID == "07"){ // Hun Gree
	message.channel.send("**Be rational and we lose...**\n\nSpecial power:  Deals variable damage to enemy (50% - 400%) 5 times.\n- 90% chance to deal variable damage to enemy (90% - 350%).\n- 70% chance to deal variable damage to enemy (80% - 300%).\n- 50% chance to deal variable damage to enemy (70% - 250%).\n- 30% chance to deal variable damage to enemy (60% - 200%).\n- 10% chance to deal variable damage to enemy (50% - 150%).");
	let FoeEvaded = CalculateEvasion(Enemy.Evade, Enemy.Immune, User.Attribute, Enemy.ImmuneTo, Enemy.EvadeExtra);

	  if(FoeEvaded == true){
		message.channel.send("Enemy evaded or was immune!");
		AITurn(User, Enemy, message, UserID);
		return;
	  }

	  let Damage = CalculateDamage(User.Atk, User.Morale);
	  //let DamageChance = getRandom(0,400);

	  Damage *= User.AttackMultiplier/100; // AttackMultiplier, 100 is x1
	  Damage += User.AttackBoost;
	  //Damage *= DamageChance/100;

	  let MocaChanceOriginal = getRandom(0, 400) + getRandom(0, 400) + getRandom(0, 400) + getRandom(0, 400) + getRandom(0, 400);

	  let MocaChance1 = getRandom(0, 100);
	  let MocaChance2 = getRandom(0, 100);
	  let MocaChance3 = getRandom(0, 100);
	  let MocaChance4 = getRandom(0, 100);
	  let MocaChance5 = getRandom(0, 100);
	  let Increase = 0;

	  if(MocaChance1 <= 90){
	  	Increase += getRandom(80, 350);
	  }

	  if(MocaChance2 <= 70){
	  	Increase += getRandom(60, 300);
	  }

	  if(MocaChance3 <= 50){
	  	Increase += getRandom(40, 250);
	  }

	  if(MocaChance4 <= 30){
	  	Increase += getRandom(20, 200);
	  }

	  if(MocaChance4 <= 10){
	  	Increase += getRandom(0, 150);
	  }

	  message.channel.send("You have dealt " + (MocaChanceOriginal + Increase) + "% damage in total.");

	  Damage *= (MocaChanceOriginal + Increase)/100;


	  let AttributeBonus = AttributeEffective(User.StrongVs, User.WeakVs, Enemy.Attribute);
	  if(AttributeBonus == "Strong"){
		AttackUserMessage = AttackUserMessage + "Your attack is super effective! ";
		Damage = Math.ceil(Damage*1.3);
	  }
	  if(AttributeBonus == "Weak"){
		 AttackUserMessage = AttackUserMessage + "Enemy is resistant against your attack attribute! ";
		Damage = Math.ceil(Damage*0.7);
	  }

		Critical = CalculateCritical((User.CritRateMin+User.CriticalIncrease), (User.CritRateMax+User.CriticalIncrease));

	  if(Critical == true){
		if(User.Morale == 200){
			Damage = Math.ceil(Damage*1.41);
		} else if(User.Morale > 150){
			Damage = Math.ceil(Damage*1.39);
		} else if(User.Morale > 125){
			Damage = Math.ceil(Damage*1.37);
		} else{
			Damage = Math.ceil(Damage*1.33);
		}
		message.channel.send("Critical Hit!");
	  }

	  let ProgressDamageDealt = fs.readFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgDealtToBoss.txt");
	  ProgressDamageDealt = parseFloat(ProgressDamageDealt) + parseFloat(Damage);
	  fs.writeFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgDealtToBoss.txt",ProgressDamageDealt);

	  let IsEnemyDead = DealDamage(Damage, Enemy.CurrentHP, message, AttackUserMessage);

	  if(IsEnemyDead == true){
		message.channel.send("You have beaten this enemy!");
		Enemy.CurrentHP = 0;
	  } else{
		Enemy.CurrentHP = IsEnemyDead;
	  }


	  // UPDATE DATA
	  let FixedJSON = JSON.stringify(User, null, "\t");
	  fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);

	  let FixedJSON2 = JSON.stringify(Enemy, null, "\t");
		 fs.writeFileSync("./PetBot/settings/dungeon/Boss.txt",FixedJSON2);

	  updateJsonFile("./PetBot/settings/dungeon/Player_"+UserID+".txt", (data) => {
	  data.InformedAboutMana = User.InformedAboutMana;
	  return data;
	  });

	  console.log(IsEnemyDead);
	  if(IsEnemyDead != true){
		AITurn(User, Enemy, message, UserID);
	  }
	}


	if(User.SpecialID == "08"){ // Barista
		message.channel.send("**Tsugurific Company**\n\nSpecial power:  - Deals moderate damage (300%) to an enemy.\n- 50% chance of dealing an extra 300% damage.\n- 25% chance of dealing an extra 300% damage.\n- 10% chance of dealing an extra 300% damage.\n- 5% chance of dealing an extra 300% damage.\n- 1% chance of dealing an extra 300% damage.");
		let FoeEvaded = CalculateEvasion(Enemy.Evade, Enemy.Immune, User.Attribute, Enemy.ImmuneTo, Enemy.EvadeExtra);

	  if(FoeEvaded == true){
		message.channel.send("Enemy evaded or was immune!");
		AITurn(User, Enemy, message, UserID);
		return;
	  }

	  let Damage = CalculateDamage(User.Atk, User.Morale);

	  Damage *= User.AttackMultiplier/100; // AttackMultiplier, 100 is x1
	  Damage += User.AttackBoost;
	  

	  let TsuguChance1 = getRandom(0, 100);
	  let TsuguChance2 = getRandom(0, 100);
	  let TsuguChance3 = getRandom(0, 100);
	  let TsuguChance4 = getRandom(0, 100);
	  let TsuguChance5 = getRandom(0, 100);
	  let Increase = 0;

	  if(TsuguChance1 <= 50){
	  	Increase += 3;
	  }

	  if(TsuguChance2 <= 25){
	  	Increase += 3;
	  }

	  if(TsuguChance3 <= 10){
	  	Increase += 3;
	  }

	  if(TsuguChance4 <= 5){
	  	Increase += 3;
	  }

	  if(TsuguChance5 <= 1){
	  	Increase += 3;
	  }

	  Damage *= (3 + Increase);


	  message.channel.send("You have dealt " + (3 + Increase)*100 + "% damage in total.");


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
		if(User.Morale == 200){
			Damage = Math.ceil(Damage*1.41);
		} else if(User.Morale > 150){
			Damage = Math.ceil(Damage*1.39);
		} else if(User.Morale > 125){
			Damage = Math.ceil(Damage*1.37);
		} else{
			Damage = Math.ceil(Damage*1.33);
		}
		message.channel.send("Critical Hit!");
	  }

	  let ProgressDamageDealt = fs.readFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgDealtToBoss.txt");
	  ProgressDamageDealt = parseFloat(ProgressDamageDealt) + parseFloat(Damage);
	  fs.writeFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgDealtToBoss.txt",ProgressDamageDealt);

	  let IsEnemyDead = DealDamage(Damage, Enemy.CurrentHP, message, AttackUserMessage);

	  if(IsEnemyDead == true){
		message.channel.send("You have beaten this enemy!");
		Enemy.CurrentHP = 0;
	  } else{
		Enemy.CurrentHP = IsEnemyDead;
	  }


	  // UPDATE DATA
	  let FixedJSON2 = JSON.stringify(User, null, "\t");
		fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON2);
	  let FixedJSON = JSON.stringify(Enemy, null, "\t");
		fs.writeFileSync("./PetBot/settings/dungeon/Boss.txt",FixedJSON);

	  updateJsonFile("./PetBot/settings/dungeon/Player_"+UserID+".txt", (data) => {
	  data.InformedAboutMana = User.InformedAboutMana;
	  return data;
	  });

	  console.log(IsEnemyDead);
	  if(IsEnemyDead != true){
		AITurn(User, Enemy, message, UserID);
	  }
	}




















if(User.SpecialID == "09"){ // Scarlet
		message.channel.send("**I'll go get it!**\n\nSpecial power:  - Activates all other 4 specials.");

	User.AttackMultiplier *= 1.5;
	Enemy.AttackMultiplier *= 1.5;
	User.AttackMultiplierTurns = 11;
	Enemy.AttackMultiplierTurns = 11;

	let DamageChance = getRandom(400,600);
	let DamageChance2 = getRandom(10,200);
	let FoeEvaded = CalculateEvasion(Enemy.Evade, Enemy.Immune, User.Attribute, Enemy.ImmuneTo, Enemy.EvadeExtra);

	 if(FoeEvaded == true){
		message.channel.send("Enemy evaded or was immune!");
		AITurn(User, Enemy, message, UserID);
		return;
	  }

	  let Damage = CalculateDamage(User.Atk, User.Morale);

	  Damage = (Damage*(User.AttackMultiplier/100)); // AttackMultiplier, 100 is x1
	  Damage = Damage+User.AttackBoost;
	  if(Damage < 0){
	  	Damage = 1;
	  }
	  Damage = Damage*(DamageChance/100) // boosted damage bonus
	  User.CurrentHP += -(Damage*(DamageChance2/100));
	  message.channel.send("Self damaged for " + (Damage*(DamageChance2/100)) + "!");

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
		if(User.Morale == 200){
			Damage = Math.ceil(Damage*1.41);
		} else if(User.Morale > 150){
			Damage = Math.ceil(Damage*1.39);
		} else if(User.Morale > 125){
			Damage = Math.ceil(Damage*1.37);
		} else{
			Damage = Math.ceil(Damage*1.33);
		}
		message.channel.send("Critical Hit!");
	  }

	  let ProgressDamageDealt = fs.readFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgDealtToBoss.txt");
	  ProgressDamageDealt = parseFloat(ProgressDamageDealt) + parseFloat(Damage);
	  fs.writeFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgDealtToBoss.txt",ProgressDamageDealt);

	  let IsEnemyDead = DealDamage(Damage, Enemy.CurrentHP, message, AttackUserMessage);

	  if(IsEnemyDead == true){
		message.channel.send("You have beaten this enemy!");
		Enemy.CurrentHP = 0;
	  } else{
		Enemy.CurrentHP = IsEnemyDead;
	  }


	  // UPDATE DATA
	  let FixedJSON = JSON.stringify(User, null, "\t");
	  fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);

	  let FixedJSON2 = JSON.stringify(Enemy, null, "\t");
		 fs.writeFileSync("./PetBot/settings/dungeon/Boss.txt",FixedJSON2);

	  updateJsonFile("./PetBot/settings/dungeon/Player_"+UserID+".txt", (data) => {
	  data.ManaGauge = User.ManaGauge;
	  data.InformedAboutMana = User.InformedAboutMana;
	  return data;
	  });

	  console.log(IsEnemyDead);
	  if(IsEnemyDead != true){
		AITurn(User, Enemy, message, UserID);
	   }

	 let QTDecisionByScarlet = getRandom(0, 100);

	 if(QTDecisionByScarlet >= 50){ // Attack Mode
	
		User.ManaGauge += -50;
		DamageChance = getRandom(300,1500);
		FoeEvaded = CalculateEvasion(Enemy.Evade, Enemy.Immune, User.Attribute, Enemy.ImmuneTo, Enemy.EvadeExtra);

		  if(FoeEvaded == true){
			message.channel.send("Enemy evaded or was immune!");
			AITurn(User, Enemy, message, UserID);
			return;
		  }

		  Damage = CalculateDamage(User.Atk, User.Morale);

		  Damage = (Damage*(User.AttackMultiplier/100)); // AttackMultiplier, 100 is x1
		  Damage = Damage+User.AttackBoost;
		  if(Damage < 0){
	  		Damage = 1;
	  	  }
		  Damage = Damage*(DamageChance/100) // boosted damage bonus
		  User.CurrentHP += -(Damage*(DamageChance2/100));
		  message.channel.send("Self damaged for " + (Damage*(DamageChance2/100)) + "!");

		  AttributeBonus = AttributeEffective(User.StrongVs, User.WeakVs, Enemy.Attribute);
		  if(AttributeBonus == "Strong"){
			AttackUserMessage = AttackUserMessage + "Your attack is super effective! ";
			Damage = Math.ceil(Damage*1.3);
		  }
		  if(AttributeBonus == "Weak"){
			 AttackUserMessage = AttackUserMessage + "Enemy is resistant against your attack attribute! ";
			Damage = Math.ceil(Damage*0.7);
		  }

		  Critical = CalculateCritical((User.CritRateMin+User.CriticalIncrease), (User.CritRateMax+User.CriticalIncrease));

		  if(Critical == true){
			if(User.Morale == 200){
				Damage = Math.ceil(Damage*1.41);
			} else if(User.Morale > 150){
				Damage = Math.ceil(Damage*1.39);
			} else if(User.Morale > 125){
				Damage = Math.ceil(Damage*1.37);
			} else{
				Damage = Math.ceil(Damage*1.33);
			}
			message.channel.send("Critical Hit!");
		  }

		  ProgressDamageDealt = fs.readFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgDealtToBoss.txt");
		  ProgressDamageDealt = parseFloat(ProgressDamageDealt) + parseFloat(Damage);
		  fs.writeFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgDealtToBoss.txt",ProgressDamageDealt);

		  IsEnemyDead = DealDamage(Damage, Enemy.CurrentHP, message, AttackUserMessage);

		  if(IsEnemyDead == true){
			message.channel.send("You have beaten this enemy!");
			Enemy.CurrentHP = 0;
		  } else{
			Enemy.CurrentHP = IsEnemyDead;
		  }


		  // UPDATE DATA
			FixedJSON = JSON.stringify(User, null, "\t");
			fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);

			FixedJSON2 = JSON.stringify(Enemy, null, "\t");
			fs.writeFileSync("./PetBot/settings/dungeon/Boss.txt",FixedJSON2);

		  updateJsonFile("./PetBot/settings/dungeon/Player_"+UserID+".txt", (data) => {
		  data.ManaGauge = User.ManaGauge;
		  data.InformedAboutMana = User.InformedAboutMana;
		  return data;
		  });

		  	console.log(IsEnemyDead);
		  	if(IsEnemyDead != true){
				AITurn(User, Enemy, message, UserID);
		   	}
		} else{ // Defense mode

			User.CurrentHP += 4000;
			User.EvadeExtra += 30;
			User.EvadeExtraTurns = 3;
			User.ManaGauge += 20;

			FixedJSON = JSON.stringify(User, null, "\t");
			fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);

			FixedJSON2 = JSON.stringify(Enemy, null, "\t");
			fs.writeFileSync("./PetBot/settings/dungeon/Boss.txt",FixedJSON2);

		 }

	FoeEvaded = CalculateEvasion(Enemy.Evade, Enemy.Immune, User.Attribute, Enemy.ImmuneTo, Enemy.EvadeExtra);

	  if(FoeEvaded == true){
		message.channel.send("Enemy evaded or was immune!");
		AITurn(User, Enemy, message, UserID);
		return;
	  }

	  Damage = CalculateDamage(User.Atk, User.Morale);
	  DamageChance = getRandom(50,400);

	  Damage *= User.AttackMultiplier/100; // AttackMultiplier, 100 is x1
	  Damage += User.AttackBoost;
	  Damage *= DamageChance/100;

	  let MocaChanceOriginal = getRandom(50, 400) + getRandom(50, 400) + getRandom(50, 400) + getRandom(50, 400) + getRandom(50, 400);

	  let MocaChance1 = getRandom(0, 100);
	  let MocaChance2 = getRandom(0, 100);
	  let MocaChance3 = getRandom(0, 100);
	  let MocaChance4 = getRandom(0, 100);
	  let MocaChance5 = getRandom(0, 100);
	  let Increase = 0;

	  if(MocaChance1 <= 90){
	  	Increase += getRandom(90, 350);
	  }

	  if(MocaChance2 <= 70){
	  	Increase += getRandom(80, 300);
	  }

	  if(MocaChance3 <= 50){
	  	Increase += getRandom(70, 250);
	  }

	  if(MocaChance4 <= 30){
	  	Increase += getRandom(60, 200);
	  }

	  if(MocaChance4 <= 10){
	  	Increase += getRandom(50, 150);
	  }

	  message.channel.send("[Moca] You have dealt " + (MocaChanceOriginal + Increase) + "% damage in total.");

	  Damage *= (MocaChanceOriginal + Increase)/100;


	  AttributeBonus = AttributeEffective(User.StrongVs, User.WeakVs, Enemy.Attribute);
	  if(AttributeBonus == "Strong"){
		AttackUserMessage = AttackUserMessage + "Your attack is super effective! ";
		Damage = Math.ceil(Damage*1.3);
	  }
	  if(AttributeBonus == "Weak"){
		 AttackUserMessage = AttackUserMessage + "Enemy is resistant against your attack attribute! ";
		Damage = Math.ceil(Damage*0.7);
	  }

	 Critical = CalculateCritical((User.CritRateMin+User.CriticalIncrease), (User.CritRateMax+User.CriticalIncrease));

	  if(Critical == true){
		if(User.Morale == 200){
			Damage = Math.ceil(Damage*1.41);
		} else if(User.Morale > 150){
			Damage = Math.ceil(Damage*1.39);
		} else if(User.Morale > 125){
			Damage = Math.ceil(Damage*1.37);
		} else{
			Damage = Math.ceil(Damage*1.33);
		}
		message.channel.send("Critical Hit!");
	  }

	  ProgressDamageDealt = fs.readFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgDealtToBoss.txt");
	  ProgressDamageDealt = parseFloat(ProgressDamageDealt) + parseFloat(Damage);
	  fs.writeFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgDealtToBoss.txt",ProgressDamageDealt);

	  IsEnemyDead = DealDamage(Damage, Enemy.CurrentHP, message, AttackUserMessage);

	  if(IsEnemyDead == true){
		message.channel.send("You have beaten this enemy!");
		Enemy.CurrentHP = 0;
	  } else{
		Enemy.CurrentHP = IsEnemyDead;
	  }


	  // UPDATE DATA
	  
	  FixedJSON = JSON.stringify(User, null, "\t");
	  fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);

	  FixedJSON2 = JSON.stringify(Enemy, null, "\t");
	  fs.writeFileSync("./PetBot/settings/dungeon/Boss.txt",FixedJSON2);

	  updateJsonFile("./PetBot/settings/dungeon/Player_"+UserID+".txt", (data) => {
	  data.ManaGauge = data.ManaGauge - 100;
	  data.InformedAboutMana = User.InformedAboutMana;
	  return data;
	  });

	  console.log(IsEnemyDead);
	  if(IsEnemyDead != true){
		AITurn(User, Enemy, message, UserID);
	  }


		FixedJSON = JSON.stringify(User, null, "\t");
		fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON);
		FixedJSON2 = JSON.stringify(Enemy, null, "\t");
		fs.writeFileSync("./PetBot/settings/dungeon/Boss.txt",FixedJSON2);

		FoeEvaded = CalculateEvasion(Enemy.Evade, Enemy.Immune, User.Attribute, Enemy.ImmuneTo, Enemy.EvadeExtra);

	  if(FoeEvaded == true){
		message.channel.send("Enemy evaded or was immune!");
		AITurn(User, Enemy, message, UserID);
		return;
	  }

	  Damage = CalculateDamage(User.Atk, User.Morale);

	  Damage *= User.AttackMultiplier/100; // AttackMultiplier, 100 is x1
	  Damage += User.AttackBoost;
	  

	  let TsuguChance1 = getRandom(0, 100);
	  let TsuguChance2 = getRandom(0, 100);
	  let TsuguChance3 = getRandom(0, 100);
	  let TsuguChance4 = getRandom(0, 100);
	  let TsuguChance5 = getRandom(0, 100);
	  Increase = 0;

	  if(TsuguChance1 <= 50){
	  	Increase += 3;
	  }

	  if(TsuguChance2 <= 25){
	  	Increase += 3;
	  }

	  if(TsuguChance3 <= 10){
	  	Increase += 3;
	  }

	  if(TsuguChance4 <= 5){
	  	Increase += 3;
	  }

	  if(TsuguChance5 <= 1){
	  	Increase += 3;
	  }

	  Damage *= (3 + Increase);


	  message.channel.send("[Tsugu] You have dealt " + (3 + Increase)*100 + "% damage in total.");


	  AttributeBonus = AttributeEffective(User.StrongVs, User.WeakVs, Enemy.Attribute);
	  if(AttributeBonus == "Strong"){
		AttackUserMessage = AttackUserMessage + "Your attack is super effective! ";
		Damage = Math.ceil(Damage*1.3);
	  }
	  if(AttributeBonus == "Weak"){
		 AttackUserMessage = AttackUserMessage + "Enemy is resistant against your attack attribute! ";
		Damage = Math.ceil(Damage*0.7);
	  }

	  Critical = CalculateCritical((User.CritRateMin+User.CriticalIncrease), (User.CritRateMax+User.CriticalIncrease));

	  if(Critical == true){
		if(User.Morale == 200){
			Damage = Math.ceil(Damage*1.41);
		} else if(User.Morale > 150){
			Damage = Math.ceil(Damage*1.39);
		} else if(User.Morale > 125){
			Damage = Math.ceil(Damage*1.37);
		} else{
			Damage = Math.ceil(Damage*1.33);
		}
		message.channel.send("Critical Hit!");
	  }

	  ProgressDamageDealt = fs.readFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgDealtToBoss.txt");
	  ProgressDamageDealt = parseFloat(ProgressDamageDealt) + parseFloat(Damage);
	  fs.writeFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgDealtToBoss.txt",ProgressDamageDealt);

	  IsEnemyDead = DealDamage(Damage, Enemy.CurrentHP, message, AttackUserMessage);

	  if(IsEnemyDead == true){
		message.channel.send("You have beaten this enemy!");
		Enemy.CurrentHP = 0;
	  } else{
		Enemy.CurrentHP = IsEnemyDead;
	  }


	  // UPDATE DATA
	  FixedJSON2 = JSON.stringify(User, null, "\t");
		fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON2);
	  FixedJSON = JSON.stringify(Enemy, null, "\t");
		fs.writeFileSync("./PetBot/settings/dungeon/Boss.txt",FixedJSON);

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

if(User.SpecialID == "10"){ // Yukina
		message.channel.send("**If this keeps up, I might lose everything**\n\nSpecial power:  - Decreases ATK and HP permanently by 100. Decreases Toward Greater Heights skills used times counter by 1.");

		User.Atk += -100;
		User.MaxHP += 100;
		User.CurrentHP += 100;
		if(User.CurrentHP <= 0){
			User.CurrentHP = 1;
		}
		User.Skill1RemainingUses++;
		let GuaranteedCrit = false;


		let randomnum = getRandom(0, 100);
		let randomvalue = 0;
		if(randomnum <= 10){
			message.channel.send("Deals variable extremely high damage to an enemy (700% - 1110%)");
			randomvalue = getRandom(700, 1110);
		} else if(randomnum > 10 && randomnum <= 40){
			message.channel.send("Deals variable extremely high damage to an enemy (500% - 700%)");
			randomvalue = getRandom(500, 700);
		} else{
			message.channel.send("Deals variable extremely high damage to an enemy (5% - 200%)");
			randomvalue = getRandom(5, 200);
			GuaranteedCrit = true;
		}

		if(GuaranteedCrit == true){
			message.channel.send("Damage: " + randomvalue + "% + Critical hit!");
		} else{
			message.channel.send("Damage: " + randomvalue + "%");
		}
		
		randomvalue = randomvalue / 100;

		let FoeEvaded = CalculateEvasion(Enemy.Evade, Enemy.Immune, User.Attribute, Enemy.ImmuneTo, Enemy.EvadeExtra);

	  if(FoeEvaded == true){

	  	let FixedJSON3 = JSON.stringify(User, null, "\t");
		fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON3);

		message.channel.send("Enemy evaded or was immune!");
		AITurn(User, Enemy, message, UserID);
		return;
	  }

	  let Damage = CalculateDamage(User.Atk, User.Morale);

	  Damage *= User.AttackMultiplier/100; // AttackMultiplier, 100 is x1
	  Damage *= randomvalue;
	  Damage += User.AttackBoost;
	  


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

	  if(GuaranteedCrit == true){
	  	Critical = true;
	  }

	  if(Critical == true){
		if(User.Morale == 200){
			Damage = Math.ceil(Damage*1.41);
		} else if(User.Morale > 150){
			Damage = Math.ceil(Damage*1.39);
		} else if(User.Morale > 125){
			Damage = Math.ceil(Damage*1.37);
		} else{
			Damage = Math.ceil(Damage*1.33);
		}
		if(GuaranteedCrit == false){
			message.channel.send("Critical Hit!");
		}
	  }

	  let ProgressDamageDealt = fs.readFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgDealtToBoss.txt");
	  ProgressDamageDealt = parseFloat(ProgressDamageDealt) + parseFloat(Damage);
	  fs.writeFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgDealtToBoss.txt",ProgressDamageDealt);

	  let IsEnemyDead = DealDamage(Damage, Enemy.CurrentHP, message, AttackUserMessage);

	  if(IsEnemyDead == true){
		message.channel.send("You have beaten this enemy!");
		Enemy.CurrentHP = 0;
	  } else{
		Enemy.CurrentHP = IsEnemyDead;
	  }


	  // UPDATE DATA
	  let FixedJSON2 = JSON.stringify(User, null, "\t");
		fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON2);
	  let FixedJSON = JSON.stringify(Enemy, null, "\t");
		fs.writeFileSync("./PetBot/settings/dungeon/Boss.txt",FixedJSON);

	  updateJsonFile("./PetBot/settings/dungeon/Player_"+UserID+".txt", (data) => {
	  data.InformedAboutMana = User.InformedAboutMana;
	  return data;
	  });

	  console.log(IsEnemyDead);
	  if(IsEnemyDead != true){
		AITurn(User, Enemy, message, UserID);
	  }
	}

if(User.SpecialID == "11"){ // Priest
	message.channel.send("**Epiphany**\n\nSpecial power:  Heals 20% of max HP. Increases Atk by 20 permanently. 7% chance of increasing ATK by 30% for 7 turns. 7% chance of decreasing one skill cooldown by 1 turn (except In God We Trust).")
	User.CurrentHP += User.MaxHP * 0.2;
	User.Atk += 20;

	let rng0 = getRandom(0, 100);
	let rng1 = getRandom(0, 100);

	if(rng0 < 7){
		User.AttackMultiplier += 30;
		User.AttackMultiplierTurns = 7;
	}

	  // UPDATE DATA
	  let FixedJSON2 = JSON.stringify(User, null, "\t");
		fs.writeFileSync("./PetBot/settings/dungeon/Player_"+UserID+".txt",FixedJSON2);
	  let FixedJSON = JSON.stringify(Enemy, null, "\t");
		fs.writeFileSync("./PetBot/settings/dungeon/Boss.txt",FixedJSON);

	  updateJsonFile("./PetBot/settings/dungeon/Player_"+UserID+".txt", (data) => {
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
	if(ItemID != 9 && ItemID != 10){
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


	if(EnemyChance <= 8){
	  EnemyName = "UnknownBeing";
	} else if(EnemyChance <= 16){
	  EnemyName = "DarkFairy";
	} else if(EnemyChance <= 24){
	  EnemyName = "Dragon";
	} else if(EnemyChance <= 32){
	  EnemyName = "DragonBaby";
	} else if(EnemyChance <= 40){
	  EnemyName = "EvilBeing";
	} else if(EnemyChance <= 48){
	  EnemyName = "Human";
	} else if(EnemyChance <= 56){
	  EnemyName = "Monk";
	} else if(EnemyChance <= 64){
	  EnemyName = "Mutant";
	} else if(EnemyChance <= 72){
	  EnemyName = "Zombie";
	} else if(EnemyChance <= 80){
	  EnemyName = "Bat";
	} else if(EnemyChance <= 88){
		EnemyName = "Vampire";
	} else if(EnemyChance <= 100){
		EnemyName = "FormChanger";
	}


	var Enemy = JSON.parse(fs.readFileSync("./PetBot/settings/dungeon/EnemyTemplate_"+EnemyName+".txt", 'utf8'));
	let NewEnemy = JSON.stringify(Enemy, null, "\t");
	fs.writeFileSync("./PetBot/settings/dungeon/Boss.txt",NewEnemy);

	message.channel.send("A new enemy has appeared! Class: "+EnemyName);

	let ProgressKilledEnemies = fs.readFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_KilledEnemies.txt");
	  ProgressKilledEnemies = parseFloat(ProgressKilledEnemies) + 1;
	  fs.writeFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_KilledEnemies.txt",ProgressKilledEnemies);

  }
 