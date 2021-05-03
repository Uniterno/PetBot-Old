const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const ScoutRR = require('./mod/srr.js');
const https = require('https');
const mergeImg = require('merge-img');
const fs = require('fs');
const rng = require('random-world');
const stringTable = require('string-table');


module.exports = class PetGachaCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'petgacha',
            group: 'util',
            guildOnly: true,
            memberName: 'petgacha',
            description: 'PetBot Gacha Scouting.',
            aliases: ['pg'],
            throttling: {
        usages: 5,
        duration: 10
    },
        });
    }

   async run(message, args) {


   /* if(message.author.id != 168389193603612673){
      message.channel.send("A new gacha is being prepared, please wait a bit. Sorry for the trouble.");
    return;
    }*/
    

  args = args.split(' ');
  let Amount = args[0];
  let Idolized = args[1];



   var ScoutRunning = fs.readFileSync("./PetBot/settings/scout/Running.txt");
    if(ScoutRunning == 'true' && Amount != "check"){
      message.channel.send("Another scout is going on right now. Can't run two at the same time.");
      return;
    }

   


   

     var UserID = message.author.id;
     //args = args.toLowerCase();
     
     if(fs.existsSync("./PetBot/settings/PetGacha/Inventory/"+UserID+"_Inventory.json") == false){
            fs.writeFileSync("./PetBot/settings/PetGacha/Inventory/"+UserID+"_Inventory.json", "{}");
          }
    

    if(Amount == "check"){

      

    var Inventory = JSON.parse(fs.readFileSync("./PetBot/settings/PetGacha/Inventory/"+UserID+"_Inventory.json", 'utf8'));


    message.channel.send("```"+JSON.stringify(Inventory, null, "\t")+"```");

    return;
    }

     fs.writeFileSync("./PetBot/settings/scout/Running.txt", 'true');


    if(Amount != "10" && Amount != "5"){
      Amount = "1";
    }


    let AmountToRemove = 5;
    if(Amount == "10"){
      AmountToRemove = AmountToRemove * 10;
    }


    let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetStars.txt");

    if(CurrentAmount - AmountToRemove < 0){
      message.channel.send("You don't have enough PetStars to perform this action.");
      fs.writeFileSync("./PetBot/settings/scout/Running.txt", 'false');
      return;
    }

    CurrentAmount = CurrentAmount - AmountToRemove; // Remove the spent amount

    

    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetStars.txt", CurrentAmount.toString());

    message.channel.send(AmountToRemove+" PetStars were used to perform this action.");
   
   


  
  let CardsArray = JSON.parse(fs.readFileSync("./PetBot/settings/PetGacha/cards.json"));
  let CardsArrayTemp = [];
  var ImportantArray = [];
  var ScoutingResult = [];

  //console.log("---");

  //Amount = 1;

  let i = 1;
  while(i <= Amount){
    CardsArrayTemp.length = 0;
    //console.log("i: "+i);
    let RandomScoutRarity = getRandom(0, 1000);
    if(Amount == "10"){
      if(i == 1){
        if(RandomScoutRarity > 300){
          RandomScoutRarity = 300; // 3* guaranteed
        }
      }
    }


    let Rarity = getRarity(RandomScoutRarity);

    let a = 0;
    let b = 0;
    let AttribChance = getRandom(0,100);

    while(a <= parseInt(Object.keys(CardsArray.results).length - 1)){
  
      if((CardsArray.results[a].rarity == Rarity)){
      CardsArrayTemp[b] = CardsArray.results[a];
      b++;
    }

      a++;
    }

  let SelectedCard = parseInt(getRandom(-1, CardsArrayTemp.length - 1));

 let RateUp5 = getRandom(0, 100);

 if(Rarity == 5 && RateUp5 <= 80){ // 1667 or 3333 (for 2 4* gachas) or 3333 (for 4 4* gachas DreamFes)
    /* let RateUp5For2 = getRandom(0,100);
    if(RateUp5For2 <= 50){
    SelectedCard = CardsArrayTemp.length - 2;
    } else if(RateUp5For2 > 50){
    SelectedCard = CardsArrayTemp.length - 1;
  } */
  SelectedCard = CardsArrayTemp.length - 1;
}

 let RateUp4 = getRandom(0, 100);
 if(Rarity == 4 && RateUp4 <= 60){
  /*  let RateUp4For2 = getRandom(0, 100);
    if(RateUp4For2 <= 50){
      SelectedCard = CardsArrayTemp.length - 2;
    } else if(RateUp4For2 >= 51){
      SelectedCard = CardsArrayTemp.length - 1;
    }  */
    SelectedCard = CardsArrayTemp.length - 1;
}

    
      if(Amount == "10"){
      ScoutingResult[i] = CardsArrayTemp[SelectedCard].icon;
    } else{
      //console.log("CardsArrayTemp["+SelectedCard+"].art: "+CardsArrayTemp[SelectedCard].art);
      //console.log("i: "+i);
      ScoutingResult[i] = CardsArrayTemp[SelectedCard].art;
    }

  

  UpdateInventory(CardsArrayTemp[SelectedCard], UserID);

  i++;

  }

  console.log(ScoutingResult[1]);
  console.log(ScoutingResult[2]);

  if(Amount == "10"){
      mergeImg([ScoutingResult[1],ScoutingResult[2],ScoutingResult[3],ScoutingResult[4],ScoutingResult[5],ScoutingResult[6],ScoutingResult[7],ScoutingResult[8],ScoutingResult[9],ScoutingResult[10]])
        .then((img) => {
          console.log(img); // => `[object Jimp]` 
          img.write('petgacha_scout.png', () => message.channel.send(new Discord.MessageAttachment('petgacha_scout.png')));
          fs.writeFileSync("./PetBot/settings/scout/Running.txt", 'false');
        });
  } else{
      console.log("i: "+i);
      message.channel.send(new Discord.MessageAttachment(ScoutingResult[i-1]));
      fs.writeFileSync("./PetBot/settings/scout/Running.txt", 'false');
    }
  }
}



function getRandom(min, max) {
    return rng.integer({min, max});
  }


function getRarity(RandomScoutRarity) {
    //return 4;

    if(RandomScoutRarity <= 30){
      return 5;
    } else if(RandomScoutRarity <= 100){
      return 4;
    } else if(RandomScoutRarity <= 300){
      return 3;
    } else if(RandomScoutRarity <= 620){
      return 2;
    } else{
      return 1;
    }
  }

  function UpdateInventory(Card, UserID) {
    var Inventory = JSON.parse(fs.readFileSync("./PetBot/settings/PetGacha/Inventory/"+UserID+"_Inventory.json", 'utf8'));

    let Member = Card.identifier;

    console.log(Card);

    console.log(Card.identifier);
     
    Inventory[Member] = true;
    let UpdatedJSON = JSON.stringify(Inventory, null, "\t");
    fs.writeFileSync("./PetBot/settings/PetGacha/Inventory/"+UserID+"_Inventory.json", UpdatedJSON);
  
  }