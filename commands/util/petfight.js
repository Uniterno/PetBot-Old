
const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const https = require('https');
const fs = require('fs');
const rng = require('random-world');
const updateJsonFile = require('update-json-file');

module.exports = class DungeonCommand extends Command {
		constructor(client) {
				super(client, {
						name: 'petfight',
						group: 'util',
						guildOnly: true,
						aliases: ['pf'],
						memberName: 'petfight',
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

			var User = JSON.parse(fs.readFileSync("./PetBot/settings/pet/"+UserID+"/Pet.json", 'utf8'));
			var Enemy = JSON.parse(fs.readFileSync("./PetBot/settings/pet/"+UserID+"/Enemy.json", 'utf8'));

			console.log(args[0]);
			if(args[0] != "info" && args[0] != "enemy" && args[0] != "attack" && args[0] != "skill" && args[0] != "special" && args[0] != "shop" && args[0] != "s" && args[0] != "debug"){
				return;
			}
			if(args[0] == "enemy"){
				//message.channel.send(Enemy);
				message.channel.send("Info on your enemy:\n**Class**: "+Enemy.Class+"\n**HP**: "+Enemy.HP+"/"+Enemy.MaxHP);
				return;
			}

			if(args[0] == "info"){
				//message.channel.send(Enemy);
				message.channel.send("Info on your pet:\n**HP**: "+User.HP+"/"+User.MaxHP+"\n**MP**: "+User.MP+"/"+User.MaxMP);
				return;
			}

		if(args[0] == "debug"){
				if(args[1] != "enemy"){
					console.log("Forbidden access 403 - Line 62");
					return;
					//message.channel.send("```JSON\n"+JSON.stringify(User, null, "\t")+"```");
				} else{
					 message.channel.send("```JSON\n"+JSON.stringify(Enemy, null, "\t")+"```");
				}
				return;
			}
			
		
		if(User.HP <= 0){
			message.channel.send("You don't have remaining HP. Heal before continuing.");
			return;
		}

		if(Enemy.HP <= 0){
			message.channel.send("Seems like your enemy was already dead but it wasn't updated.\nLet Uni know.");
			//AutomaticEnemyDeploy(Enemy, UserID, message);
			return;
		}
				
		if(args[0] == "attack"){
		 //UserAttack(User, Enemy, message, UserID);
			return;
		}

		if(args[0] == "skill"){
	
			console.log(args[1]);

			let Res = Skill(args[1], User, Enemy, message, UserID, false); // isEnemy is false

			console.log("Res: " + Res);
			 
			if(Res == "Unable"){
				//message.channel.send("Invalid skill");
				return;
			}

			console.log("User: " + User);
			console.log("Enemy: " + Enemy);
			console.log("UserID: " + UserID);

			AITurn(User, Enemy, message, UserID); 

			TurnTick(User, Enemy, message, UserID);

	}
			

/*if(args[0] != "attack"){
				AITurn(User, Enemy, message, UserID);
} */ 

// Disabled because I'm testing skills and special not taking turns.

	if(args[0] == "attack"){
		//GenericTurn(User, Enemy, message, UserID);
	}
	

	}
}

/*

function CalculateDamage(Atk){
	let Damage = Math.ceil((((Atk * 0.23) + 10)/5)+(Math.sqrt(Atk)*5));
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
*/


function getRandom(min, max) {
		return rng.integer({min, max});
	}


function AITurn(User, Enemy, message, UserID){

   let x = Object.keys(Enemy.Skills);

   console.log("x: " + x);

   let x0 = getRandom(-1, x.length-1);

   console.log("x0: " + x0);

   let SkillToUse = Object.keys(Enemy.Skills)[x0];

   console.log("SkillToUse: " + SkillToUse);

   console.log("Enemy: SkillToUse ["+SkillToUse+"]");

   let isEnemy = true;

	 Skill(SkillToUse, Enemy, User, message, UserID, isEnemy); // Enemy and User are switch so that the Enemy is the User and the User is the Enemy on Enemy's turn.
}


	function Skill(ID, User, Enemy, message, UserID, isEnemy){

		console.log("ID: " + ID);

		ID = ID.toLowerCase();
		console.log("\n---\n");

		let EvadeChance = getRandom(0, 100);

		if(ID != 2 && ID != "aquaring" && ID != "targetlock" && ID != 4 && ID != "rest" && ID != "fly" && ID != 6 && ID != 8 && ID != 9 && ID != 13){
			if((EvadeChance < Enemy.Speed*0.5 + Enemy.ExtraEvade*100)){
				if(isEnemy){
					message.channel.send("You evaded enemy's attack!");
					return "Sucess";
				} else{
					message.channel.send("Enemy evaded your attack!");
					return "Sucess";
				}
			}
		} 
			//var Enemy = JSON.parse(fs.readFileSync("./PetBot/settings/pet/"+UserID+"/Enemy.json", 'utf8'));

		if(ID == "1" || ID == "lightning"){

			console.log("---");
			console.log("ID: " + ID);

			let BaseAtkMin = 3;
			let BaseAtkMax = 6;

			console.log("User.SkillsLightning: " + User.Skills.Lightning);

			if(User.Skills.Lightning == 2){
				BaseAtkMin = 5;
				BaseAtkMax = 9;
			}

			let DealtDmg = getRandom(BaseAtkMin, BaseAtkMax);


			if(getRandom(1, 100-(User.Attack*3)) <= 50){
				DealtDmg = getRandom(BaseAtkMin+1, BaseAtkMax);
			}


			if(getRandom(1, 100-(User.Attack*3)) <= 25){
				DealtDmg = getRandom(BaseAtkMin+2, BaseAtkMax);
			}


			if(getRandom(1, 100-(User.Attack*3)) <= 10){
				DealtDmg = BaseAtkMax;
			}


			DealtDmg = DealtDmg * (1 - Enemy.Defense*0.009);

			Enemy.HP -= DealtDmg;

			console.log("Enemy.HP: " + Enemy.HP);
			console.log("DealtDmg * (1 - Enemy.Defense*0.009): " + DealtDmg * (1 - Enemy.Defense*0.009));
 
			message.channel.send("You used Lightning! Your enemy lost " + DealtDmg + " HP!");
						
		} else if(ID == "2" || ID == "defendandroll"){
			User.ExtraDefense = 0.07 + (User.Skills.DefendAndRoll-1)*0.03;
			User.ExtraEvadeTurns = 3;
			if(User.Skills.DefendAndRoll <= 2){
				User.ExtraDefenseTurns = 2;
				User.ExtraEvade = 0.05;
			} else if(User.Skills.DefenseAndRoll <= 4){
				User.ExtraEvade = 0.06;
			} else{
				User.ExtraDefenseTurns = 4;
				User.ExtraEvade = 0.07;
				User.ExtraEvadeTurns = 4;
			}

			message.channel.send("You used Defend and Roll, increasing your DEF by "+User.ExtraDefense*100+"% for "+User.ExtraDefenseTurns+" turns, and your Evade chance by "+User.ExtraEvade*100+"% for "+User.ExtraEvadeTurns + " turns.");

		} else if(ID == "3" || ID == "venomtouch"){
				if(User.Skills.VenomTouch <= 0){
					message.channel.send("Your Pet can't use this skill.");
					return "Unable";
				}

				if(User.MP < 6){
					if(isEnemy){
					message.channel.send("Enemy decided to do nothing this turn.");
				} else{
					message.channel.send("Not enough MP to use this skill.");
				}
					return "Unable";
				} 

				User.MP -= 6;

				Enemy.PoisonedDamage = 1;
				Enemy.PoisonedTurns = 4 + (User.Skills.VenomTouch-1);

				message.channel.send("You have poisoned your target for " + Enemy.PoisonedTurns + " turns.");

		} else if(ID == "4" || ID == "aquaring"){
			if(User.Skills.AquaRing <= 0){
				message.channel.send("Your Pet can't use this skill.");
				return "Unable";
			}

			if(User.MP < 8){
				if(isEnemy){
					message.channel.send("Enemy decided to do nothing this turn.");
				} else{
					message.channel.send("Not enough MP to use this skill.");
				}
				return "Unable";
			}

			User.MP -= 8;

			let HealAmount = User.MaxHP * 0.05;

			User.HP += HealAmount;

			if(User.HP > User.MaxHP){
				User.HP = User.MaxHP;
			}


			message.channel.send("You have healed for " + HealAmount + " HP.");

		} else if(ID == "5" || ID == "icetornado"){
			if(User.Skills.IceTornado <= 0){
				message.channel.send("Your Pet can't use this skill.");
				return "Unable";
			}

			if(User.MP < 20){
				if(isEnemy){
					message.channel.send("Enemy decided to do nothing this turn.");
				} else{
					message.channel.send("Not enough MP to use this skill.");
				}
				return "Unable";
			}

			User.MP -= 20;

			let DealtDmg = getRandom(10, 25-(User.Skills.IceTornado-1));

			if(getRandom(1, 100-(User.Attack*3)) <= 70){
				DealtDmg = getRandom(13, 25-(User.Skills.IceTornado-1));
			}

			if(getRandom(1, 100-(User.Attack*3)) <= 60){
				DealtDmg = getRandom(14, 25-(User.Skills.IceTornado-1));
			}

			if(getRandom(1, 100-(User.Attack*3)) <= 50){
				DealtDmg = getRandom(15, 25-(User.Skills.IceTornado-1));
			}

			if(getRandom(1, 100-(User.Attack*3)) <= 40){
				DealtDmg = getRandom(16, 25-(User.Skills.IceTornado-1));
			}

			if(getRandom(1, 100-(User.Attack*3)) <= 25){
				DealtDmg = getRandom(18, 25-(User.Skills.IceTornado-1));
			}

			if(getRandom(1, 100-(User.Attack*3)) <= 10){
				DealtDmg = getRandom(23, 25-(User.Skills.IceTornado-1));
			}

			DealtDmg = DealtDmg * (1 - Enemy.Defense*0.009);
			Enemy.HP -= DealtDmg;

			let ReceivedDmg = 0;

			if(User.Skills.IceTornado < 2){
				ReceivedDmg = DealtDmg/2;
				User.HP -= ReceivedDmg;
			} else{
				ReceivedDmg = DealtDmg/3;
				User.HP -= ReceivedDmg;
			}
			

			message.channel.send("You dealt " + DealtDmg + " damage to your target, but also selfharmed for " + ReceivedDmg + " HP.");

		} else if(ID == "6" || ID == "targetlock"){
			if(User.Skills.TargetLock <= 0){
				message.channel.send("Your Pet can't use this skill.");
				return "Unable";
			}

			Enemy.EvadePenalty = 0.6 + User.Skills.TargetLock*0.06;

			Enemy.EvadePenaltyTurns = 1;

			message.channel.send("You have targeted your enemy! Your enemy now has an evade penalty of " + Enemy.EvadePenalty +"%.");

		} else if(ID == "7" || ID == "bite"){
			if(User.Skills.Bite <= 0 || !!User.Skills.Bite == false){
				message.channel.send("Your Pet can't use this skill.");
				return "Unable";
			}

			if(User.MP < 4){
				if(isEnemy){
					message.channel.send("Enemy decided to do nothing this turn.");
				} else{
					message.channel.send("Not enough MP to use this skill.");
				}
				return "Unable";
			}

			User.MP -= 4;

			let DealtDmg = getRandom(1, 3);

			DealtDmg = DealtDmg * (1 - Enemy.Defense*0.009);
			Enemy.HP -= DealtDmg;

			if(isEnemy){
				message.channel.send("Enemy has bitten you! It dealt " + DealtDmg + " damage to you!");
			} else{
				message.channel.send("You have bitten your enemy! Your enemy has received " + DealtDmg +" damage.");
			}


		} else if(ID == "8" || ID == "rest"){
			if(User.Skills.Rest <= 0 || !!User.Skills.Rest == false){
				message.channel.send("Your Pet can't use this skill.");
				return "Unable";
			}

			if(User.MP < 12){
				if(isEnemy){
					message.channel.send("Enemy decided to do nothing this turn.");
				} else{
					message.channel.send("Not enough MP to use this skill.");
				}
				return "Unable";
			}

			if(User.HealingCooldown > 0){
				message.channel.send("Enemy decided to do nothing this turn.");
				return "Unable";
			}

			if(isEnemy){
				User.HealingCooldown = User.CanHealTurns;
			}

			User.MP -= 12;

			User.HP += User.MaxHP * 0.15;
			if(User.HP > User.MaxHP){
				User.HP = User.MaxHP;
			}

			if(isEnemy){
				message.channel.send("Enemy has rested, healing 15% of its HP.");
			} else{
				message.channel.send("You have rested, healing 15% of your HP.");
			}
			

		} else if(ID == "9" || ID == "fly"){
			if(User.Skills.Fly <= 0 || !!User.Skills.Fly == false){
				message.channel.send("Your Pet can't use this skill.");
				return "Unable";
			}

			if(User.MP < 2){
				if(isEnemy){
					message.channel.send("Enemy decided to do nothing this turn.");
				} else{
					message.channel.send("Not enough MP to use this skill.");
				}
				return "Unable";
			}

			User.MP -= 2;

			User.Speed += 1;

			if(isEnemy){
				message.channel.send("Enemy has flown, increasing its speed by 1 permanently. [Boss exclusive]");
			} else{
				message.channel.send("You have flown, increasing your speed by 1 permanently. [Boss exclusive]");
			}

			

		} else if(ID == "11" || ID == "strike"){
			if(User.Skills.Strike <= 0 || !!User.Skills.Strike == false){
				message.channel.send("Your Pet can't use this skill.");
				return "Unable";
			}

			if(User.MP < 6){
				if(isEnemy){
					message.channel.send("Enemy decided to do nothing this turn.");
				} else{
					message.channel.send("Not enough MP to use this skill.");
				}
				return "Unable";
			}

			User.MP -= 6;

			let DealtDmg = getRandom(0, 10+User.Attack);

			DealtDmg = DealtDmg * (1 - Enemy.Defense*0.009);
			Enemy.HP -= DealtDmg;


			if(isEnemy){
				message.channel.send("Enemy has struck you with its sword, dealing " + DealtDmg + " damage.");
			} else{
				message.channel.send("You have struck your enemy with your sword, dealing "+DealtDmg+ " damage.");
			}

			

		} else if(ID == "12" || ID == "perfectcut"){
			if(User.Skills.PerfectCut <= 0 || !!User.Skills.PerfectCut == false){
				message.channel.send("Your Pet can't use this skill.");
				return "Unable";
			}

			if(User.MP < 10){
				if(isEnemy){
					message.channel.send("Enemy decided to do nothing this turn.");
				} else{
					message.channel.send("Not enough MP to use this skill.");
				}
				return "Unable";
			}

			User.MP -= 10;

			let DealtDmg = getRandom(User.Attack, User.Attack*3);

			DealtDmg = DealtDmg * (1 - Enemy.Defense*0.009);
			Enemy.HP -= DealtDmg;

			message.channel.send("You have dealt a perfect cut on your enemy, dealing "+DealtDmg+ " damage.");

		} else if(ID == "13" || ID == "disappear"){
			if(User.Skills.Disappear <= 0 || !!User.Skills.Disappear == false){
				message.channel.send("Your Pet can't use this skill.");
				return "Unable";
			}

			if(User.MP < 4){
				if(isEnemy){
					message.channel.send("Enemy decided to do nothing this turn.");
				} else{
					message.channel.send("Not enough MP to use this skill.");
				}
				return "Unable";
			}

			User.MP -= 4;

			User.ExtraEvade = 0.5;
			User.ExtraEvadeTurns = 2;
			if(User.PoisonedTurns > 0){
				User.PoisonedTurns -= 1;
				User.PoisonedDamage -= 1;
			}

			message.channel.send("You have disappeared, getting 50% evade chance for 1 turn and, if you were poisoned, weakened the poison.");

		} else if(ID == "14" || ID == "possession"){
			if(User.Skills.Possession <= 0 || !!User.Skills.Possession == false){
				message.channel.send("Your Pet can't use this skill.");
				return "Unable";
			}

			if(User.MP < 2){
				if(isEnemy){
					message.channel.send("Enemy decided to do nothing this turn.");
				} else{
					message.channel.send("Not enough MP to use this skill.");
				}
				return "Unable";
			}

			User.MP -= 2;

			Enemy.MP = User.MP;

			User.MP += 5;

			if(isEnemy){
				message.channel.send("Enemy has possesed you and stolen MP from you.");
			} else{
				message.channel.send("You have possesed your enemy and stolen MP from them.");
			}
			

		} else if(ID == "15" || ID == "softattack"){
			if(User.Skills.SoftAttack <= 0 || !!User.Skills.SoftAttack == false){
				message.channel.send("Your Pet can't use this skill.");
				return "Unable";
			}

			if(User.MP < 1){
				if(isEnemy){
					message.channel.send("Enemy decided to do nothing this turn.");
				} else{
					message.channel.send("Not enough MP to use this skill.");
				}
				return "Unable";
			}

			User.MP -= 1;

			let DealtDmg = getRandom(1, 2);

			DealtDmg = DealtDmg * (1 - Enemy.Defense*0.009);
			Enemy.HP -= DealtDmg;

			if(isEnemy){
				message.channel.send("Enemy attempted to strike you, dealing "+DealtDmg+" damage.");
			} else{
				message.channel.send("You have attempted to strike your enemy, dealing "+DealtDmg+" damage.");
			}
			

		} else if(ID == "16" || ID == "strongattack"){
			if(User.Skills.StrongAttack <= 0 || !!User.Skills.StrongAttack == false){
				message.channel.send("Your Pet can't use this skill.");
				return "Unable";
			}

			if(User.MP < 6){
				if(isEnemy){
					message.channel.send("Enemy decided to do nothing this turn.");
				} else{
					message.channel.send("Not enough MP to use this skill.");
				}
				return "Unable";
			}

			User.MP -= 6;

			let DealtDmg = getRandom(2, 8);

			DealtDmg = DealtDmg * (1 - Enemy.Defense*0.009);
			Enemy.HP -= DealtDmg;

			if(isEnemy){
				message.channel.send("Enemy has harshly striken you, dealing "+DealtDmg+" damage.");
			} else{
				message.channel.send("You have harshly striken your enemy, dealing "+DealtDmg+" damage.");
			}
			

		} else{
			message.channel.send("Unknown skill.");
			return "Unable";
		}


		if(isEnemy){
			let FixedJSON = JSON.stringify(User, null, "\t");
			fs.writeFileSync("./PetBot/settings/pet/"+UserID+"/Enemy.json",FixedJSON);

			let FixedJSON2 = JSON.stringify(Enemy, null, "\t");
			fs.writeFileSync("./PetBot/settings/pet/"+UserID+"/Pet.json",FixedJSON2);

			return "Success";
		} else{
			let FixedJSON = JSON.stringify(Enemy, null, "\t");
			fs.writeFileSync("./PetBot/settings/pet/"+UserID+"/Enemy.json",FixedJSON);

			let FixedJSON2 = JSON.stringify(User, null, "\t");
			fs.writeFileSync("./PetBot/settings/pet/"+UserID+"/Pet.json",FixedJSON2);

			return "Success";
		}
	}

function TurnTick(User, Enemy, message, UserID){

	console.log("TurnTick activated!");


	if(User.ExtraDefenseTurns > 0){
		User.ExtraDefenseTurns -= 1;
	}
	if(User.ExtraDefenseTurns == 0){
		User.ExtraDefense = 0;
	}

	if(Enemy.ExtraDefenseTurns > 0){
		Enemy.ExtraDefenseTurns -= 1;
	}
	if(Enemy.ExtraDefenseTurns == 0){
		Enemy.ExtraDefense = 0;
	}

	if(User.ExtraEvadeTurns > 0){
		User.ExtraEvadeTurns -= 1;
	}
	if(User.ExtraEvadeTurns == 0){
		User.ExtraEvade = 0;
	}

	if(Enemy.ExtraEvadeTurns > 0){
		Enemy.ExtraEvadeTurns -= 1;
	}
	if(Enemy.ExtraEvadeTurns == 0){
		Enemy.ExtraEvade = 0;
	}

	if(User.PoisonedTurns > 0){
		User.PoisonedTurns -= 1;
		User.HP -= User.MaxHP * (User.PoisonedDamage/100);
		User.PoisonedDamage += 1;
	}
	if(User.PoisonedTurns == 0){
		User.PoisonedDamage = 0;
	}

	if(Enemy.PoisonedTurns > 0){
		Enemy.PoisonedTurns -= 1;
		Enemy.HP -= Enemy.MaxHP * (Enemy.PoisonedDamage/100);
		Enemy.PoisonedDamage += 1;

	}
	if(Enemy.PoisonedTurns == 0){
		Enemy.PoisonedDamage = 0;
	}

	if(User.EvadePenaltyTurns > 0){
		User.EvadePenaltyTurns -= 1;
	}
	if(User.EvadePenaltyTurns == 0){
		User.EvadePenalty = 0;
	}

	if(Enemy.EvadePenaltyTurns > 0){
		Enemy.EvadePenaltyTurns -= 1;
	}
	if(Enemy.EvadePenaltyTurns == 0){
		Enemy.EvadePenalty = 0;
	}

	if(Enemy.HealingCooldown > 0){
		Enemy.HealingCooldown -= 1;
	}

	let UserMPRecovery = (User.MaxMP * (User.Intelligence*0.05 + User.Darkness*0.03))**0.9;
	let EnemyMPRecovery = (User.MaxHP * (Enemy.Intelligence*0.05 + Enemy.Darkness*0.03))**0.9;

	console.log("UserMPRecovery: " + UserMPRecovery);
	console.log("EnemyMPRecovery: " + EnemyMPRecovery);

	if(UserMPRecovery <= 0){
		UserMPRecovery = User.MaxMP * 0.02;
	}

	if(EnemyMPRecovery <= 0){
		EnemyMPRecovery = Enemy.MaxMP * 0.02;
	}



	User.MP += UserMPRecovery;
	Enemy.MP += EnemyMPRecovery;

	if(User.MP > User.MaxMP){
		User.MP = User.MaxMP;
	}

	if(Enemy.MP > Enemy.MaxMP){
		Enemy.MP = Enemy.MaxMP;
	}

	
	console.log("Turn tick finished!");


	let FixedJSON = JSON.stringify(Enemy, null, "\t");
	fs.writeFileSync("./PetBot/settings/pet/"+UserID+"/Enemy.json",FixedJSON);

	let FixedJSON2 = JSON.stringify(User, null, "\t");
	fs.writeFileSync("./PetBot/settings/pet/"+UserID+"/Pet.json",FixedJSON2);


}