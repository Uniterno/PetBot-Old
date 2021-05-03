const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const fs = require('fs');
const rng = require('random-world');


module.exports = class Hunt extends Command {
    constructor(client) {
        super(client, {
            name: 'fish',
            group: 'util',
            guildOnly: true,
            memberName: 'fish',
            description: 'Fish.',
            aliases: ['f'],
            throttling: {
        usages: 2,
        duration: 1
    },
        });
    }

  run(message, args) {

  console.log(message.content);

  args = message.content.split(' ').slice(1);


  let UserID = message.author.id;


  if(fs.existsSync("./PetBot/settings/fishing/Target/"+UserID+".json") == false){

      let Rarities = [3, 5, 25, 30, 35, 45, 50, 60, 65, 70, 75, 90, 100, 125, 127, 130, 140, 145, 150, 155, 170, 180, 190, 200, 205, 225, 235, 255];
      let RarityTier = getRandom(0, Rarities.length-1);


      let Fish = {};
      Fish.Rarity = Rarities[RarityTier];
      Fish.Tier = RarityTier;
      Fish.MaxHP = getRandom(275-Fish.Rarity,800-Fish.Rarity);
      Fish.HP = Fish.MaxHP;
      Fish.Status = 0;
      Fish.Caught = false;
    

       let TargetJSON = JSON.stringify(Fish, null, "\t");
       fs.writeFileSync("./PetBot/settings/fishing/Target/"+UserID+".json",TargetJSON);
  }

  let Fish = JSON.parse(fs.readFileSync("./PetBot/settings/fishing/Target/"+UserID+".json", 'utf8'));
  let User = JSON.parse(fs.readFileSync("./PetBot/settings/fishing/UserData/"+UserID+".json", 'utf8'));

  if(Fish.Caught == true){
      let Rarities = [3, 5, 25, 30, 35, 45, 50, 60, 65, 70, 75, 90, 100, 125, 127, 130, 140, 145, 150, 155, 170, 180, 190, 200, 205, 225, 235, 255];
      let RarityTier = getRandom(0, Rarities.length-1);


      let Fish = {};
      Fish.Rarity = Rarities[RarityTier];
      Fish.Tier = RarityTier;
      Fish.MaxHP = getRandom(275-Fish.Rarity,800-Fish.Rarity);
      Fish.HP = Fish.MaxHP;
      Fish.Status = 0;
      Fish.Caught = false;
    

       let TargetJSON = JSON.stringify(Fish, null, "\t");
       fs.writeFileSync("./PetBot/settings/fishing/Target/"+UserID+".json",TargetJSON);
  }

 

  let Action = args[0];

  console.log(Action);

  if(!!Action == false){
    message.channel.send("Invalid action! Valid actions: Fish/Info, Status, Escape, Harpoon or a number of bait (1 = Normal, 2 = Rare, 3 = Mystic) to use.");
    console.log("Invalid");
    return;
  }

  Action = Action.toLowerCase();

  let StatusInfo = "Unknown";

  if(Fish.Status == 0){
    StatusInfo = "No status";
  } else if(Fish.Status == 1){
    StatusInfo = "Sleeping";
  } else if(Fish.Status == 2){
    StatusInfo = "Frozen";
  } else if(Fish.Status == 3){
    StatusInfo = "Sick";
  } else if(Fish.Status == 4){
    StatusInfo = "Weak";
  } else if(Fish.Status == 5){
    StatusInfo = "Slowed down";
  }

  console.log(Fish.Status);

  Fish = JSON.parse(fs.readFileSync("./PetBot/settings/fishing/Target/"+UserID+".json", 'utf8'));

  if(Action == "fish" || Action == "info"){
    message.channel.send("**Fish**\n\nRarity Tier: " + Fish.Tier + "\nHP: " + Fish.HP + "\nStatus: " + StatusInfo);
    return;
  } else if(Action == "status"){

    if(User.StatusBait <= 0){
      message.channel.send("Not enough Status Bait!");
      return;
    } else{
      User.StatusBait = User.StatusBait - 1;
      Fish.Status = getRandom(0, 5);

      if(Fish.Status == 0){
        StatusInfo = "No status";
      } else if(Fish.Status == 1){
        StatusInfo = "Sleeping";
      } else if(Fish.Status == 2){
        StatusInfo = "Frozen";
      } else if(Fish.Status == 3){
        StatusInfo = "Sick";
      } else if(Fish.Status == 4){
        StatusInfo = "Weak";
      } else if(Fish.Status == 5){
        StatusInfo = "Slowed down";
      }

      message.channel.send("Fish new status is: " + StatusInfo);

      let TargetJSON = JSON.stringify(Fish, null, "\t");
      fs.writeFileSync("./PetBot/settings/fishing/Target/"+UserID+".json",TargetJSON);

      let UserJSON = JSON.stringify(User, null, "\t");
      fs.writeFileSync("./PetBot/settings/fishing/UserData/"+UserID+".json",UserJSON);


      return;
    }

    
  } else if(Action == "escape"){

    if(User.EscapeGas <= 0){
      message.channel.send("Not enough Escape Gas!");
      return;
    } else{
      User.EscapeGas = User.EscapeGas - 1;
      Fish.Caught = true;
      message.channel.send("You have successfully escaped!");

      let TargetJSON = JSON.stringify(Fish, null, "\t");
      fs.writeFileSync("./PetBot/settings/fishing/Target/"+UserID+".json",TargetJSON);

      let UserJSON = JSON.stringify(User, null, "\t");
      fs.writeFileSync("./PetBot/settings/fishing/UserData/"+UserID+".json",UserJSON);

      return;
    }

    
  } else if(Action == "harpoon"){

    if(User.Harpoon <= 0){
      message.channel.send("Not enough Harpoons!");
      return;
    } else{
      User.Harpoon = User.Harpoon - 1;
      let Damage = getRandom(1, Fish.MaxHP);
      Fish.HP = Fish.HP - Damage;
      if(Fish.HP < 1){
        Fish.HP = 1;
      }
      message.channel.send("You have dealt " + Damage + " damage. Fish's remaining HP: " + Fish.HP);

      let TargetJSON = JSON.stringify(Fish, null, "\t");
      fs.writeFileSync("./PetBot/settings/fishing/Target/"+UserID+".json",TargetJSON);

      let UserJSON = JSON.stringify(User, null, "\t");
      fs.writeFileSync("./PetBot/settings/fishing/UserData/"+UserID+".json",UserJSON);

      return;
    }

    
  } else{
    if(isNaN(Action)){
      message.channel.send("Invalid action! Valid actions: Fish/Info, Status, Escape, Harpoon or a number of bait (1 = Normal, 2 = Rare, 3 = Mystic) to use.");
      return;
    }

  }



  let Ball = parseInt(Action);

  let R1 = 0;

  if(Ball == 1){
    R1 = getRandom(0, 255);

    if(User.Bait <= 0){
      message.channel.send("Not enough Bait!");
      return;
    }

    User.Bait = User.Bait - 1;

  } else if(Ball == 2){
    R1 = getRandom(0, 200);

    if(User.RareBait <= 0){
      message.channel.send("Not enough Rare Bait!");
      return;
    }

    User.RareBait = User.RareBait - 1;

  } else if(Ball == 3){
    R1 = getRandom(0, 150);

    if(User.MysticBait <= 0){
      message.channel.send("Not enough Mystic Bait!");
      return;
    }

    User.MysticBait = User.MysticBait - 1;

  } else{
    message.channel.send("Invalid type of fishing bait.");
    return;
  }

  let UserJSON = JSON.stringify(User, null, "\t");
  fs.writeFileSync("./PetBot/settings/fishing/UserData/"+UserID+".json",UserJSON);

  let S = 0; // 12 if poisoned, burned or paralyzed. 25 if asleep or frozen.
   // [State] 1 = Asleep, 2 = Frozen, 3 = Poisoned, 4 = Burned, 5 = Paralized; 0 = None

  if(Fish.Status == 1 || Fish.Status == 2){
    S = 25;
  } else if(Fish.Status == 3 || Fish.Status == 4 || Fish.Status == 5){
    S = 12;
  }

  let RX = R1 - S;

  if(RX < 0){
    caught(Fish, User, message, UserID);
    return;
  }

  let F = 0;

  F = Fish.MaxHP * 255;

  if(Ball == 2){
    F = parseInt(F/8);
  } else{
    F = parseInt(F/12);
  }

  console.log("F before -> " + F);

  if((Fish.HP / 4) > 0){
    if(parseInt(Fish.HP/4) > 0){
      F = parseInt(F / parseInt((Fish.HP/4)));
    }
  }

  console.log("F after -> " + F);

  if (F > 255){
    F = 255;
  }


  console.log("---");
  console.log("Ball: "+Ball);
  console.log("RX: "+RX);
  console.log("R1: "+R1);
  console.log("S: "+S);
  console.log("F: "+F);
  console.log("Fish.Rarity: "+Fish.Rarity);

  if(Fish.Rarity < RX){
    free(Fish, Ball, F, message);
    return;
  }

  let R2 = getRandom(0, 255);

  console.log("R2 -> " + R2);

  if(R2 <= F){
    caught(Fish, User, message, UserID);
    return;
  } else{
    free(Fish, Ball, F, message);
    return;
  }

 }
}


function getRandom(min, max) {
    return rng.integer({min, max});
  }


function free(Fish, Ball, F, message){
    let W = Fish.Rarity * 100;

  if(Ball == 1){
    W = parseInt(W/255);
  } else if(Ball == 2){
    W = parseInt(W/200);
  } else if(Ball == 3){
    W = parseInt(W/150);
  }

  let WX = 0;

  if(W > 255){ 
    WX = 3;
  }

  W = W*F;
  W = parseInt(W/255);

  if(Fish.Status == 1 || Fish.Status == 2){
    W = W + 10;
  } else if(Fish.Status == 3 || Fish.Status == 4 || Fish.Status == 5){
    W = W + 5;
  }

  if(W < 10){
    message.channel.send("Oh, no! Fish has escaped!");
  } else if(W >= 10 && W <= 29){
    message.channel.send("At first, it looked like you caught it!");
  } else if(W >= 30 && W <= 69){
    message.channel.send("That was close!");
  } else if(W >= 70){
    message.channel.send("Darn it! You almost got it!");
  }

  console.log("W -> " + W);
}

function caught(Fish, User, message, UserID){
   message.channel.send("You have succesfully caught this fish!");

   User.CaughtValue = User.CaughtValue + Math.round((256-Fish.Rarity)**1.1);


   let UserJSON = JSON.stringify(User, null, "\t");
   fs.writeFileSync("./PetBot/settings/fishing/UserData/"+UserID+".json",UserJSON);


   Fish.Caught = true;

   let TargetJSON = JSON.stringify(Fish, null, "\t");
   fs.writeFileSync("./PetBot/settings/fishing/Target/"+UserID+".json",TargetJSON);
}