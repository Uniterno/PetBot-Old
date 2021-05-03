const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const fs = require('fs');
const rng = require('random-world');



module.exports = class MyPetCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'mypet',
            group: 'util',
            guildOnly: true,
            memberName: 'mypet',
            aliases: ['mp'],
            description: 'Retrieves useful information about your Pet.',
            throttling: {
        usages: 1,
        duration: 4
    },
        });
    }

   run(message, args) {


    let UserID = message.author.id;
    args = args.split(' ');


    if(fs.existsSync("././PetBot/settings/PetCoins/"+UserID+"/PetCookie.txt") == false){
       fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCookie.txt","0");
    } if(fs.existsSync("././PetBot/settings/Pet/"+UserID+"/Pet.json") == false){

      let Pet = {};

      Pet.Name = "No name";
      Pet.Level = 1;
      Pet.Exp = 0;
      Pet.LevelUp = 14;
      Pet.Speed = 1;
      Pet.Attack = 1;
      Pet.Defense = 1;
      Pet.Intelligence = 1;
      Pet.Intrigue = 0;
      Pet.Divinity = 0;
      Pet.Darkness = 0;
      Pet.Cuteness = 0;
      Pet.AvailableSkills = 0;
      Pet.MaxHP = 300;
      Pet.HP = 300;
      Pet.MaxMP = 0;
      Pet.MP = Pet.MaxMP;


       let PetJSON = JSON.stringify(Pet, null, "\t");
       fs.writeFileSync("./PetBot/settings/Pet/"+UserID+"/Pet.json",PetJSON);

    } 


    let Pet = JSON.parse(fs.readFileSync("./PetBot/settings/Pet/"+UserID+"/Pet.json", 'utf8'));

    Pet.MaxMP = 5 + 3*Pet.Intelligence + Pet.Intrigue/10 + Pet.Divinity + Pet.Darkness;

    if(!!Pet.MP == false){
      Pet.MP = Pet.MaxMP;
    }

    if(!!Pet.AvailableSkills == false){
      Pet.AvailableSkills = 0;
    }


    if(args[0] == "rename"){
      if(args[1].length < 0 || args[1].length > 70){
        message.channel.send("Invalid Pet name");
        return;
      } else if((args[1].toLowerCase()).startsWith("uni") || (args[1].toLowerCase()).startsWith("uñi") || args[1].toLowerCase() == 'unit' || args[1].toLowerCase() == 'unite' || args[1].toLowerCase() == 'uniter' || args[1].toLowerCase() == 'unitern' || args[1].toLowerCase() == 'petbot'){
        message.channel.send("You can't claim this pet. It already has an owner.");
        return;
      } else if(message.mentions.members.first()){
        //console.log(message.mentions.members.first());
        message.channel.send("You can't mention anyone!");
        return;
      }

        Pet.Name = args[1];

       let PetJSON = JSON.stringify(Pet, null, "\t");
       fs.writeFileSync("./PetBot/settings/Pet/"+UserID+"/Pet.json",PetJSON);

       message.channel.send("Your pet has been correctly renamed.");

       return;
    }

    if(args[0] == "feed"){

      if(!!args[1] == false){
        message.channel.send("You need to select the amount of PetCookies to use.");
        return;
      }

      if(args[1] <= 0 || isNaN(args[1])){
        message.channel.send("Invalid amount.");
        return;
      }

      let FeedAmount = parseInt(args[1]);
      let PetCookiesAmount = fs.readFileSync("./PetBot/settings/petcoins/"+UserID+"/PetCookies.txt");

      if(FeedAmount > PetCookiesAmount){
        message.channel.send("You don't own that many PetCookies!");
        return;
      }

      let i = 0;


      let ObtainedExp = 0;
      let ObtainedExpTotal = 0;
      let StartedLevel = Pet.Level;



      while(i < FeedAmount){
        if(Pet.Exp >= Pet.LevelUp){
          let Remainder = Pet.Exp - Pet.LevelUp;
          Pet.Level = Pet.Level + 1;
          Pet.LevelUp = Math.floor(14 + (Pet.Level * Math.pow(Math.log10(Pet.Level), 0.5)*Pet.Level));
          Pet.Exp = 0 + Remainder;
        }

        ObtainedExp = getRandom(0, 4);
        ObtainedExpTotal = ObtainedExpTotal + ObtainedExp;
        Pet.Exp = Pet.Exp + ObtainedExp;
        i++;
      }

      if(Pet.Exp >= Pet.LevelUp){
          let Remainder = Pet.Exp - Pet.LevelUp;
          Pet.Level = Pet.Level + 1;
          Pet.LevelUp = Math.floor(14 + (Pet.Level * Math.pow(Math.log10(Pet.Level), 0.5)*Pet.Level));
          Pet.Exp = 0 + Remainder;
        }

      let NewAvailableSkills = (Pet.Level - StartedLevel)*3;

      Pet.AvailableSkills = Pet.AvailableSkills + NewAvailableSkills;


      if(Pet.Level - StartedLevel != 1){
        message.channel.send("After "+i+" PetCookies, your Pet has obtained "+ObtainedExpTotal+" experience points and leveled up "+(Pet.Level - StartedLevel)+" times.");
      } else{
        message.channel.send("After "+i+" PetCookies, your Pet has obtained "+ObtainedExpTotal+" experience points and leveled up "+(Pet.Level - StartedLevel)+" time.");
      }

      fs.writeFileSync("./PetBot/settings/petcoins/"+UserID+"/PetCookies.txt", PetCookiesAmount - FeedAmount);


      let PetJSON = JSON.stringify(Pet, null, "\t");
      fs.writeFileSync("./PetBot/settings/Pet/"+UserID+"/Pet.json",PetJSON);


      return;

      // Math.floor(14 + (level * log10(level)^3/2)*level);

    }

    if(args[0] == "assign"){

      if(!!args[1] == false){
        message.channel.send("You need to select a stat to assign points to.");
        return;
      }

      if(!!args[2] == false){
        message.channel.send("You need to select how many points to assign.");
        return;
      }

      if(args[1] <= 0 || isNaN(args[1]) || args[2] <= 0 || isNaN(args[2])){
        message.channel.send("Invalid amount.");
        return;
      }

      let SkillToAssign = parseInt(args[1]);
      let PtsToAssign = parseInt(args[2]);

      if(SkillToAssign < 0 || SkillToAssign > 8){
        message.channel.send("That skill doesn't exist.");
        return;
      }

      if(PtsToAssign > Pet.AvailableSkills){
        message.channel.send("Your Pet doesn't have enough Skill Pts for that!");
        return;
      }


      if(PtsToAssign > 0){
         if(SkillToAssign == 1){
          Pet.Speed = Pet.Speed + PtsToAssign;
        } else if(SkillToAssign == 2){
          Pet.Attack = Pet.Attack + PtsToAssign;
        } else if(SkillToAssign == 3){
          Pet.Defense = Pet.Defense + PtsToAssign;
        } else if(SkillToAssign == 4){
          Pet.Intelligence = Pet.Intelligence + PtsToAssign;
        } else if(SkillToAssign == 5){
          Pet.Intrigue = Pet.Intrigue + PtsToAssign;
        } else if(SkillToAssign == 6){
          Pet.Divinity = Pet.Divinity + PtsToAssign;
        } else if(SkillToAssign == 7){
          Pet.Darkness = Pet.Darkness + PtsToAssign;
        } else if(SkillToAssign == 8){
          Pet.Cuteness = Pet.Cuteness + PtsToAssign;
        }
      } else{
        message.channel.send("You can't assign 0 Pts!"); // Hopefully this shouldn't ever happen
        return;
      } 

      message.channel.send("Skill Pts assigned!");

      Pet.AvailableSkills = Pet.AvailableSkills - PtsToAssign;

      let PreviousMP = Pet.MaxMP;
      Pet.MaxMP = 5 + 3*Pet.Intelligence + Pet.Intrigue/10 + Pet.Divinity + Pet.Darkness;

      Pet.MP += (Pet.MaxMP - PreviousMP);
     

      let PetJSON = JSON.stringify(Pet, null, "\t");
      fs.writeFileSync("./PetBot/settings/Pet/"+UserID+"/Pet.json",PetJSON);


      return;

      // Math.floor(14 + (level * log10(level)^3/2)*level);

    }

    if(args[0] == "skills"){

      let MessageToSend = "Your Pet has the following skills:\n\n";


      let x;

      for(x in Pet.Skills){
        MessageToSend += ""+x + " (" + Pet.Skills[x] + ")\n";
      }
      

      message.channel.send(MessageToSend);

      return;
    }

    if(args[0] == "inventory" || args[0] == "inv"){
      
      let MessageToSend = "Your Pet inventory has the following items:\n\n";

      let Inv = JSON.parse(fs.readFileSync("./PetBot/settings/Pet/"+UserID+"/Inventory.json", 'utf8'));

      let x;

      for(x in Inv){
        MessageToSend += ""+x + " (" + Inv[x] + ")\n";
      }
      
      message.channel.send(MessageToSend);

      return;

    }
    
    message.channel.send("Your Pet '"+Pet.Name+"' has the following stats: \n\n-----\nLevel: "+Pet.Level+" (EXP: "+Pet.Exp+"/"+Pet.LevelUp+")\nHP: "+Pet.HP + "/" + Pet.MaxHP + "\nMP: "+Pet.MP + "/" + Pet.MaxMP + "\n----- \n\n1. Speed: "+Pet.Speed+"\n2. Attack: "+Pet.Attack+"\n3. Defense: "+Pet.Defense+"\n4. Intelligence: "+Pet.Intelligence+"\n5. Intrigue: "+Pet.Intrigue+"\n6. Divinity: "+Pet.Divinity+"\n7. Darkness: "+Pet.Darkness+"\n8. Cuteness: "+Pet.Cuteness+"\n\nAvailable Skill Points: "+Pet.AvailableSkills);
    let PetJSON = JSON.stringify(Pet, null, "\t");
    fs.writeFileSync("./PetBot/settings/Pet/"+UserID+"/Pet.json",PetJSON);
  }
}



function getRandom(min, max) {
    return rng.integer({min, max});
  }