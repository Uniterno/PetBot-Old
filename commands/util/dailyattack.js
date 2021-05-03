const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const fs = require('fs');
const rng = require('random-world');


module.exports = class DailyAttackCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'dailyattack',
            group: 'util',
            guildOnly: true,
            memberName: 'dailyattack',
            description: 'Daily Attack Gacha Command (Not pull, play).',
            aliases: ['da', 'dattack', 'dailya'],
          });
    }

run(message, args) {

    args = message.content.split(' ').slice(1);

	  let UserID = message.author.id;
  	let DateV = new Date();

  	var MasterUser = JSON.parse(fs.readFileSync("./PetBot/settings/user/master.json"));
    var Settings = JSON.parse(fs.readFileSync("./PetBot/settings/master.json"));
    var CurrentBoss = Settings.DailyAttack.CurrentBoss;
  	let EquippedDivineItemID = MasterUser[UserID].Inventory.DivineItems.Active;
  	let EquippedDivineItem = "None";
  	if(EquippedDivineItemID != -1){
    	EquippedDivineItem = MasterUser[UserID].Inventory.DivineItems.Items[EquippedDivineItemID].Name;
  	}

    if(args[0] == "set"){
      if(!!args[1] == false){
        message.channel.send("Chosen character is not valid.");
        return;
      }
      let Chosen = args[1];
      if(!!MasterUser[UserID].DailyAttack.Inventory[Chosen] == false){
        message.channel.send("You don't own this character or it doesn't exist.");
        return;
      } else{
        if(MasterUser[UserID].DailyAttack.Inventory[Chosen].Level <= 0){
          message.channel.send("You don't own this character!");
          return;
        } else{
          MasterUser[UserID].DailyAttack.SetCharacter = args[1];
          message.channel.send("Your set character has been updated!");
        }
      }
    } else if(args[0] == "check"){
      if(args[1] == "boss"){
        let ToSendMessage = "";
        if(args[2] == "debuffs"){
          ToSendMessage += JSON.stringify(Settings.DailyAttack.Boss[CurrentBoss].Debuffs, null, "\t");
          message.channel.send(ToSendMessage);
        } else{
          ToSendMessage += "Remaining HP: " + Settings.DailyAttack.Boss[CurrentBoss].HP + "\n";
          ToSendMessage += "Attribute: " + Settings.DailyAttack.Boss[CurrentBoss].Attribute + "\n";
          ToSendMessage += "Weak to: " + Settings.DailyAttack.Boss[CurrentBoss].WeakTo + "\n";
          ToSendMessage += "Resistant to: " + Settings.DailyAttack.Boss[CurrentBoss].ResistantTo + "\n";
          ToSendMessage += "Use 'debuffs' as 3rd argument to check the JSON for debuffs.";
          message.channel.send(ToSendMessage);
        }
      } else{
        let ToSendMessage = "";
        ToSendMessage += "Remaining stamina: " + MasterUser[UserID].DailyAttack.RemainingStamina + "\n\n";
        ToSendMessage += "*Characters*" + "\n";
        for(let i = 0; i < Object.keys(MasterUser[UserID].DailyAttack.Inventory).length; i++){
          if(Object.keys(MasterUser[UserID].DailyAttack.Inventory)[i] == MasterUser[UserID].DailyAttack.SetCharacter){
            ToSendMessage += "**"; // Bold currently set up character
          }
          ToSendMessage += Object.keys(MasterUser[UserID].DailyAttack.Inventory)[i] + ": ";
          ToSendMessage += MasterUser[UserID].DailyAttack.Inventory[Object.keys(MasterUser[UserID].DailyAttack.Inventory)[i]].Level;
          if(Object.keys(MasterUser[UserID].DailyAttack.Inventory)[i] == MasterUser[UserID].DailyAttack.SetCharacter){
            ToSendMessage += "**"; // End bold
          }
          ToSendMessage += "\n";
        }
        ToSendMessage += "\n"
        let TotalDamage = 0;
        for(let i = 0; i < Object.values(Settings.DailyAttack.Boss[CurrentBoss].DamageDealtBy).length; i++){
          TotalDamage += Object.values(Settings.DailyAttack.Boss[CurrentBoss].DamageDealtBy)[i];
        }
        let Contribution = ((Settings.DailyAttack.Boss[CurrentBoss].DamageDealtBy[UserID] / TotalDamage) * 100).toFixed(2) + "%";
        ToSendMessage += "Damage contribution: " + Contribution + " (" + Settings.DailyAttack.Boss[CurrentBoss].DamageDealtBy[UserID] + "/" + TotalDamage + ")";
        message.channel.send(ToSendMessage);
       }

      return; //return after sending message if check

    } else{

      if(Settings.DailyAttack.Boss[CurrentBoss].HP <= 0){
        message.channel.send("The boss is already dead.");
        return;
      }

      if(!!MasterUser[UserID].DailyAttack == false){
        message.channel.send("An error has ocurred. Maybe set up a character first?");
        return;
      }

      let CurrentlyUsingCharacter = MasterUser[UserID].DailyAttack.SetCharacter;

      if(!!CurrentlyUsingCharacter == false || !!MasterUser[UserID].DailyAttack.SetCharacter == false){
        message.channel.send("Set a character first!");
        return;
      }

      if(MasterUser[UserID].DailyAttack.RemainingStamina >= MasterUser[UserID].DailyAttack.Inventory[CurrentlyUsingCharacter].StaminaUsage){
        // attack

        let MessageInfo = "";
        let Damage = MasterUser[UserID].DailyAttack.Inventory[CurrentlyUsingCharacter].Damage;
        Damage += (MasterUser[UserID].DailyAttack.Inventory[CurrentlyUsingCharacter].Level - 1) * Damage*0.1
        if(Settings.DailyAttack.Boss[CurrentBoss].Attribute == Settings.DailyAttack.Attributes[MasterUser[UserID].DailyAttack.Inventory[CurrentlyUsingCharacter].Attribute].Effective){
          // Effective against boss attribute
          Damage *= 1 +  0.01 * getRandom(1, 75);
          MessageInfo += "Effective attribute!\n";
        }

        if(Settings.DailyAttack.Boss[CurrentBoss].WeakTo == MasterUser[UserID].DailyAttack.Inventory[CurrentlyUsingCharacter].AttackType || MasterUser[UserID].DailyAttack.Inventory[CurrentlyUsingCharacter].AttackType == "Death"){
          // Effective type attack
          Damage *= 1 +  0.01 * getRandom(1, 50);
          MessageInfo += "Effective attack type!\n";
        }

        let CritChance = getRandom(1, 100);
        if(CritChance <= MasterUser[UserID].DailyAttack.Inventory[CurrentlyUsingCharacter].CritChance){
          // Critical hit
          Damage *= 1 + 0.01 * getRandom(1,25);
          MessageInfo += "Critical hit!\n";
        }

        if(Settings.DailyAttack.Boss[CurrentBoss].Attribute == Settings.DailyAttack.Attributes[MasterUser[UserID].DailyAttack.Inventory[CurrentlyUsingCharacter].Attribute].Weak){
          // Weak against boss attribute
          Damage *= 1 -  0.01 * getRandom(1, 75);
          MessageInfo += "Not effective attribute!\n";
        }

        if(Settings.DailyAttack.Boss[CurrentBoss].ResistantTo == MasterUser[UserID].DailyAttack.Inventory[CurrentlyUsingCharacter].AttackType){
          // Weak type attack
          Damage *= 1 -  0.01 * getRandom(1, 50);
          MessageInfo += "Weak attack type!\n";
        }
        
        // DEBUFFS

        if(Settings.DailyAttack.Boss[CurrentBoss].DefenseDown > 0){
          // Extra damage, oof.
          Damage *= 1 + Settings.DailyAttack.Boss[CurrentBoss].DefenseDown;
          MessageInfo += "Extra damage thanks to Unicorn's Support!\n";
        }

        if(Settings.DailyAttack.Boss[CurrentBoss].Debuffs.AttackTypeDefenseDown == MasterUser[UserID].DailyAttack.Inventory[CurrentlyUsingCharacter].AttackType && Settings.DailyAttack.Boss[CurrentBoss].AttackTypeDefenseDownValue > 0){
          // Extra damage, oof.
          Damage *= 1 + Settings.DailyAttack.Boss[CurrentBoss].AttackTypeDefenseDownValue;
          MessageInfo += "Extra damage on Attack Type thanks to Unicorn's Support!\n";
        }

        if(Settings.DailyAttack.Boss[CurrentBoss].Debuffs.DebuffedAttribute == MasterUser[UserID].DailyAttack.Inventory[CurrentlyUsingCharacter].Attribute && Settings.DailyAttack.Boss[CurrentBoss].DebuffedAttributeValue > 0){
          // Extra damage, oof.
          Damage *= 1 + Settings.DailyAttack.Boss[CurrentBoss].DebuffedAttributeValue;
          MessageInfo += "Extra damage thanks to debuff on attribute!\n";
        }

         if(Settings.DailyAttack.Boss[CurrentBoss].Debuffs.DebuffedAttackType == MasterUser[UserID].DailyAttack.Inventory[CurrentlyUsingCharacter].AttackType && Settings.DailyAttack.Boss[CurrentBoss].DebuffedAttackTypeValue > 0){
          // Extra damage, oof.
          Damage *= 1 + Settings.DailyAttack.Boss[CurrentBoss].DebuffedAttackTypeValue;
          MessageInfo += "Extra damage thanks to debuff on attack type!\n";
        }

        if(MasterUser[UserID].DailyAttack.Inventory[CurrentlyUsingCharacter].Skill.Name == "Death"){
          let Chance = MasterUser[UserID].DailyAttack.Inventory[CurrentlyUsingCharacter].Skill.Properties[0];
          // OH GOD OH GOD
          let RandomChance = getRandom(0, 100);
          if(RandomChance <= Chance){
            message.channel.send("Listen. The evening bell has tolled thy name. The feathers foreshadow your death, and behead, **Azrael!**");
            Damage *= 1 + 0.01 * getRandom(0, 500);
          }
        }

        if(MasterUser[UserID].DailyAttack.Inventory[CurrentlyUsingCharacter].Skill.Name == "Ballistics"){
          let Value = [];
          let Chance = [];
          let RandomChance = [];
          Value[0] = MasterUser[UserID].DailyAttack.Inventory[CurrentlyUsingCharacter].Skill.Properties[0];
          Chance[0] = MasterUser[UserID].DailyAttack.Inventory[CurrentlyUsingCharacter].Skill.Properties[1];
          Value[1] = MasterUser[UserID].DailyAttack.Inventory[CurrentlyUsingCharacter].Skill.Properties[2];
          Chance[1] = MasterUser[UserID].DailyAttack.Inventory[CurrentlyUsingCharacter].Skill.Properties[3];
          Value[2] = MasterUser[UserID].DailyAttack.Inventory[CurrentlyUsingCharacter].Skill.Properties[4];
          Chance[2] = MasterUser[UserID].DailyAttack.Inventory[CurrentlyUsingCharacter].Skill.Properties[5];
          Value[3] = MasterUser[UserID].DailyAttack.Inventory[CurrentlyUsingCharacter].Skill.Properties[6];
          Chance[3] = MasterUser[UserID].DailyAttack.Inventory[CurrentlyUsingCharacter].Skill.Properties[7];
          Value[4] = MasterUser[UserID].DailyAttack.Inventory[CurrentlyUsingCharacter].Skill.Properties[8];
          Chance[4] = MasterUser[UserID].DailyAttack.Inventory[CurrentlyUsingCharacter].Skill.Properties[9];
          RandomChance[0] = getRandom(0, 100);
          RandomChance[1] = getRandom(0, 100);
          RandomChance[2] = getRandom(0, 100);
          RandomChance[3] = getRandom(0, 100);
          RandomChance[4] = getRandom(0, 100);
          let i = 0;
          let MessageToAppend = "";
          while(i < 5){
            if(RandomChance[i] < Chance[i]){
              MessageToAppend += "Ballistic hit! Increased damage by " + Value[i] + "x\n";
              Damage *= Value[i];
            }
          }
          if(MessageToAppend != ""){
            message.channel.send(MessageToAppend);
          }
        }



        Damage = Math.round(Damage);

        MessageInfo += "You managed to deal " + Damage + " damage to this boss!";
        message.channel.send(MessageInfo);
        if(!!Settings.DailyAttack.Boss[CurrentBoss].DamageDealtBy[UserID] == false){
          Settings.DailyAttack.Boss[CurrentBoss].DamageDealtBy[UserID] = 0;
        }
        Settings.DailyAttack.Boss[CurrentBoss].DamageDealtBy[UserID] += Damage;
        if(Settings.DailyAttack.Boss[CurrentBoss].Debuffs.ContributionTo != "N/A"){
          Settings.DailyAttack.Boss[CurrentBoss].DamageDealtBy[Settings.DailyAttack.Boss[CurrentBoss].Debuffs.ContributionTo] += Damage * Settings.DailyAttack.Boss[CurrentBoss].Debuffs.ContributionAmount;
        }
        Settings.DailyAttack.Boss[CurrentBoss].HP -= Damage;
        if(Settings.DailyAttack.Boss[CurrentBoss].HP <= 0){
          message.channel.send("This boss has been defeated!");
        }

        if(MasterUser[UserID].DailyAttack.Inventory[CurrentlyUsingCharacter].Skill.Name == "ChargeStamina"){
          let RestoredStamina = MasterUser[UserID].DailyAttack.Inventory[CurrentlyUsingCharacter].Skill.Properties[0];
          let Chance = MasterUser[UserID].DailyAttack.Inventory[CurrentlyUsingCharacter].Skill.Properties[1];
          let RandomChance = getRandom(0, 100);
          if(RandomChance <= Chance){
            message.channel.send("Recovered stamina by " + RestoredStamina + "%!");
            MasterUser[UserID].DailyAttack.RemainingStamina += RestoredStamina;
          }
         
        } else if(MasterUser[UserID].DailyAttack.Inventory[CurrentlyUsingCharacter].Skill.Name == "Unicorn's Support"){
           let ReducedDefenseAmount = MasterUser[UserID].DailyAttack.Inventory[CurrentlyUsingCharacter].Skill.Properties[0];
           let Chance = MasterUser[UserID].DailyAttack.Inventory[CurrentlyUsingCharacter].Skill.Properties[1];
           let AcquiredDamageContribution = MasterUser[UserID].DailyAttack.Inventory[CurrentlyUsingCharacter].Skill.Properties[2];
           let AttackTypeSupport = MasterUser[UserID].DailyAttack.Inventory[CurrentlyUsingCharacter].Skill.Properties[3];
           let AttackTypeSupportDamage = MasterUser[UserID].DailyAttack.Inventory[CurrentlyUsingCharacter].Skill.Properties[4];
           let TurnsAmount = MasterUser[UserID].DailyAttack.Inventory[CurrentlyUsingCharacter].Skill.Properties[5];

           let RandomChance = getRandom(0, 100);
          if(RandomChance <= Chance){
            message.channel.send("Reduced boss defense by " + ReducedDefenseAmount*100 + "% for 3 turns! Applied " + AttackTypeSupportDamage*100 + "% extra damage for " + AttackTypeSupport + ", you'll also get " + AcquiredDamageContribution*100 + "% of damage contribution while it lasts.");
            Settings.DailyAttack.Boss[CurrentBoss].Debuffs.DefenseDown = ReducedDefenseAmount;
            Settings.DailyAttack.Boss[CurrentBoss].Debuffs.AttackTypeDefenseDown = AttackTypeSupport;
            Settings.DailyAttack.Boss[CurrentBoss].Debuffs.AttackTypeDefenseDownValue = AttackTypeSupportDamage;
            Settings.DailyAttack.Boss[CurrentBoss].Debuffs.DebuffsTurnsLeft = TurnsAmount;
          }
        }

        else if(MasterUser[UserID].DailyAttack.Inventory[CurrentlyUsingCharacter].Skill.Name == "ApplyDebuff"){
           let DebuffedAttribute = MasterUser[UserID].DailyAttack.Inventory[CurrentlyUsingCharacter].Skill.Properties[0];
           let DebuffedAttributeValue = MasterUser[UserID].DailyAttack.Inventory[CurrentlyUsingCharacter].Skill.Properties[1];
           let DebuffedAttackType = MasterUser[UserID].DailyAttack.Inventory[CurrentlyUsingCharacter].Skill.Properties[2];
           let DebuffedAttackTypeValue = MasterUser[UserID].DailyAttack.Inventory[CurrentlyUsingCharacter].Skill.Properties[3];
           let Turns = MasterUser[UserID].DailyAttack.Inventory[CurrentlyUsingCharacter].Skill.Properties[4];
           let Chance = MasterUser[UserID].DailyAttack.Inventory[CurrentlyUsingCharacter].Skill.Properties[5];

           let RandomChance = getRandom(0, 100);
          if(RandomChance <= Chance){
            message.channel.send(DebuffedAttributeValue*100 + "% extra damage for " + DebuffedAttribute + " attribute! " + DebuffedAttackTypeValue*100 + "% extra damage for " + DebuffedAttackType + " attacks! (" + Turns + " turns)");
            Settings.DailyAttack.Boss[CurrentBoss].Debuffs.DebuffedAttribute = DebuffedAttribute;
            Settings.DailyAttack.Boss[CurrentBoss].Debuffs.DebuffedAttributeValue = DebuffedAttributeValue;
            Settings.DailyAttack.Boss[CurrentBoss].Debuffs.DebuffedAttackType = DebuffedAttackType;
            Settings.DailyAttack.Boss[CurrentBoss].Debuffs.DebuffedAttackTypeValue = DebuffedAttackTypeValue;
            Settings.DailyAttack.Boss[CurrentBoss].Debuffs.DebuffsTurnsLeft = TurnsAmount;
          }
        }

        MasterUser[UserID].DailyAttack.RemainingStamina -= MasterUser[UserID].DailyAttack.Inventory[CurrentlyUsingCharacter].StaminaUsage;

        if(MasterUser[UserID].DailyAttack.Inventory[CurrentlyUsingCharacter].Skill.Name == "Ghosting"){
          let Value = MasterUser[UserID].DailyAttack.Inventory[CurrentlyUsingCharacter].Skill.Properties[0];
          let Chance = MasterUser[UserID].DailyAttack.Inventory[CurrentlyUsingCharacter].Skill.Properties[1];
          let RandomChance = getRandom(0, 100);
          if(RandomChance <= Chance){
            message.channel.send("Oh no! Hanako-kun looks tired! He probably used double of stamina this time!");
            MasterUser[UserID].DailyAttack.RemainingStamina -= MasterUser[UserID].DailyAttack.Inventory[CurrentlyUsingCharacter].StaminaUsage * (Value - 1);
          }
        }



        // Debuffs Cooldown

        Settings.DailyAttack.Boss[CurrentBoss].Debuffs.DebuffsTurnsLeft -= 1;
        if(Settings.DailyAttack.Boss[CurrentBoss].Debuffs.DebuffsTurnsLeft == -1){
           Settings.DailyAttack.Boss[CurrentBoss].Debuffs.DefenseDown = 0;
           Settings.DailyAttack.Boss[CurrentBoss].Debuffs.AttackTypeDefenseDownValue = 0;
           Settings.DailyAttack.Boss[CurrentBoss].Debuffs.ContributionTo = "N/A";
           Settings.DailyAttack.Boss[CurrentBoss].Debuffs.ContributionAmount = 0;
           Settings.DailyAttack.Boss[CurrentBoss].Debuffs.DebuffedAttributeValue = 0;
           Settings.DailyAttack.Boss[CurrentBoss].Debuffs.DebuffedAttackTypeValue = 0;
        }

      } else{
        message.channel.send("Not enough stamina to attack!");
        return;
      }


    }

  	


    let FixedJSON = JSON.stringify(MasterUser, null, "\t");
    fs.writeFileSync("./PetBot/settings/user/master.json",FixedJSON);
    let FixedJSON2 = JSON.stringify(Settings, null, "\t");
    fs.writeFileSync("./PetBot/settings/master.json",FixedJSON2);
 }
}


function getRandom(min, max) {
    return rng.integer({min, max});
  }