const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const ScoutRR = require('./mod/srr.js');
const https = require('https');
const mergeImg = require('merge-img');
const fs = require('fs');
const rng = require('random-world');
const stringTable = require('string-table');


module.exports = class BandoriCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'bandori_aprilfools2020deprecated',
            group: 'util',
            guildOnly: true,
            memberName: 'bandori_aprilfools2020deprecated',
            description: 'Does something',
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


    console.log("---\nBandori scouting\n---");

  args = args.split(' ');
  let Amount = args[0];
  let Idolized = args[1];



   var ScoutRunning = fs.readFileSync("./PetBot/settings/scout/Running.txt");
    if(ScoutRunning == 'true' && Amount != "check"){
      message.channel.send("Another scout is going on right now. Can't run two at the same time.");
      return;
    }

   


   

     var UserID = message.author.id;
     let UserMaster = JSON.parse(fs.readFileSync("./PetBot/settings/user/master.json"));
     let SettingsMaster = JSON.parse(fs.readFileSync("./PetBot/settings/master.json"));
     //args = args.toLowerCase();
     
    
    let ButterflyAmount = 0;

    var AttributePull = false;
      if(args[0] == "10"){
        if(!!args[1] == true){
      args[1] = args[1].toLowerCase();
      console.log(args[1]);
      if(args[1] == "attribute" || args[1] == "a" || args[1] == "atr" || args[1] == "true"){
      AttributePull = true;
      }
    }
  } else{
      args[0] = args[0].toLowerCase();
      console.log(args[0]);
      if(args[0] == "attribute" || args[0] == "a" || args[0] == "atr" || args[0] == "true"){
        AttributePull = true;
    }
  }


     fs.writeFileSync("./PetBot/settings/scout/Running.txt", 'true');

     if(Amount == "s" || Amount == "S"){
      Idolized = "s";
     }

     if(Idolized == "S"){
      Idolized = "s";
     }

    if(Amount != "10" && Amount != "5"){
      Amount = "1";
    }


    console.log("Amount: "+Amount);

    let AmountToRemove = SettingsMaster.Bandori.Gacha.Cost;
    if(Amount == "10"){
      AmountToRemove *= 10;
    } else if(Amount == "5"){
      AmountToRemove *= 5;
    }

    if(Idolized == "s"){
      AmountToRemove *= SettingsMaster.Bandori.Gacha.TrainedCost;
    }


    if(Amount == "5" && !SettingsMaster.Bandori.Gacha.isAvailable.FivePull){
      message.channel.send("This gacha type is not available. Stay tuned to announcements to know when it's open due to an ongoing campaign.");
      fs.writeFileSync("./PetBot/settings/scout/Running.txt", 'false');
      return;
    }



    //AmountToRemove = 50;

    let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt"); // Take current amount
    //let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/MakiCookies.txt");

    if(CurrentAmount - AmountToRemove < 0){
      message.channel.send("You don't have enough PetCoins to perform this action.");
      //message.channel.send("You don't have enough MakiCookies to perform this action.");
      fs.writeFileSync("./PetBot/settings/scout/Running.txt", 'false');
      return;
    }

    CurrentAmount = CurrentAmount - AmountToRemove; // Remove the spent amount

    /*if(!AttributePull)
     if(fs.existsSync("./PetBot/settings/bandori/PulledSpecial/"+UserID+".txt") == false){
      fs.writeFileSync("./PetBot/settings/bandori/PulledSpecial/"+UserID+".txt", "Pulled");
  } else{
    message.channel.send("You have already pulled this gacha the maximum allowed times!");
    fs.writeFileSync("./PetBot/settings/scout/Running.txt", 'false');
    return;
  }*/
  

    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt", CurrentAmount);
    //fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/MakiCookies.txt", CurrentAmount);
    if(AttributePull){
      if(!SettingsMaster.Bandori.Gacha.isAvailable.AttributePull){
        message.channel.send("Attribute Box is not currently available. Stay tunned to announcements.");
        fs.writeFileSync("./PetBot/settings/scout/Running.txt", 'false'); 
        return;
      }
    message.channel.send(AmountToRemove+" PetCoins were used to perform this action (Attribute).");
    //message.channel.send(AmountToRemove+" MakiCookies were used to perform this action (Attribute).");
    } else{
    message.channel.send(AmountToRemove+" PetCoins were used to perform this action.");
    //message.channel.send(AmountToRemove+" MakiCookies were used to perform this action.");
    }
   
   


  
  let CardsArray = JSON.parse(fs.readFileSync("./PetBot/settings/bandori/cardsAprilFools.json"));
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
    if(Amount == "10" || Amount == "5"){
      if(i == 1){
        if(RandomScoutRarity > 115){
          RandomScoutRarity = 115; // 3* guaranteed
        }
      }
    }

    //console.log("RandomScoutRarity: "+RandomScoutRarity);
    let Rarity = getRarity(RandomScoutRarity, SettingsMaster.Bandori.Gacha.DreamFes);

    if(Rarity == 4){
      ButterflyAmount += 4;
    }
    //console.log("Rarity: "+Rarity);
    let a = 0;
    let b = 0;
    //console.log("Object: "+ JSON.stringify(CardsArray));
    while(a <= parseInt(Object.keys(CardsArray.results).length - 1)){
     /* console.log("a: "+a);
      console.log("b: "+b);
      console.log("CardsArray.results[a].i_rarity: "+CardsArray.results[a].i_rarity);
      console.log("Rarity: "+Rarity);
      console.log("Object.keys(CardsArray.results).length - 1: "+parseInt(Object.keys(CardsArray.results).length - 1));*/
    
      if(AttributePull == true){
          if(CardsArray.results[a].i_rarity == Rarity && CardsArray.results[a].i_attribute == SettingsMaster.Bandori.Gacha.FeaturedAttribute){
          CardsArrayTemp[b] = CardsArray.results[a];
          //console.log("CardsArrayTemp[b]: "+CardsArrayTemp[b]);
          b++;
        }

      } else{
        if((CardsArray.results[a].i_rarity == Rarity)){
        CardsArrayTemp[b] = CardsArray.results[a];
        //console.log("CardsArrayTemp[b]: "+CardsArrayTemp[b]);
        b++;
      }
      }

      
      a++;
    }

     //console.log("CardsArrayTemp.length - 1: "+CardsArrayTemp.length - 1);

  let SelectedCard = parseInt(getRandom(-1, CardsArrayTemp.length - 1));
  //console.log("SelectedCard: "+SelectedCard);
  //console.log("CardsArrayTemp: "+CardsArrayTemp);

 if(AttributePull == false){

 let RateUp4 = getRandom(0, 10000);
 if(Rarity == 4 && RateUp4 <= 3333){ // 1667 or 3333 (for 2 4* gachas) or 3333 (for 4 4* gachas DreamFes)
    let RateUp4For2 = getRandom(0,100);
    if(RateUp4For2 <= 50){
    SelectedCard = CardsArrayTemp.length - 1;
    } else{
      SelectedCard = CardsArrayTemp.length - 2;
    }
  }
 //SelectedCard = CardsArrayTemp.length - 1;

 let RateUp3 = getRandom(0, 10000);
  if(Rarity == 3 && RateUp3 <= 1412){ // 1412
    SelectedCard = CardsArrayTemp.length - 1;
  }

  let RateUp2 = getRandom(0, 10000);
  if(Rarity == 2 && RateUp2 <= 1085){ // 1085
    //SelectedCard = CardsArrayTemp.length - 1;
  } 
}


 /* let RateUp4 = getRandom(0, 10000);
 if(Rarity == 4 && RateUp4 <= 800){
    SelectedCard = CardsArrayTemp.length - 1;
    } 
  } */
    
  if(Idolized == "s"){
      if(Amount == "10" || Amount == "5"){
      ScoutingResult[i] = encodeURI(CardsArrayTemp[SelectedCard].image);
      if(ScoutingResult[i] == null || ScoutingResult[i] == "null"){
        ScoutingResult[i] = encodeURI(CardsArrayTemp[SelectedCard].image);
      }
    } else{
      //console.log("i: "+i);
      ScoutingResult[i] = encodeURI(CardsArrayTemp[SelectedCard].image);
      if(ScoutingResult[i] == null || ScoutingResult[i] == "null"){
        ScoutingResult[i] = encodeURI(CardsArrayTemp[SelectedCard].image);
      }
    }
  } else{
      if(Amount == "10" || Amount == "5"){
      ScoutingResult[i] = encodeURI(CardsArrayTemp[SelectedCard].image);
    } else{
      //console.log("i: "+i);
      ScoutingResult[i] = encodeURI(CardsArrayTemp[SelectedCard].image);
    }
  }

  

  //UpdateInventory(CardsArrayTemp[SelectedCard], UserID, Idolized);

  i++;

  }

  /* if(ButterflyAmount != 0){
    message.channel.send("You obtained " + ButterflyAmount + " Butterflies!");
    let CurrentButterflyAmount = parseInt(fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/Butterflies.txt"));
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/Butterflies.txt", CurrentButterflyAmount + ButterflyAmount);
  } */
  

  if(Amount == "10" || Amount == "5"){
    if(Amount == "5"){
      mergeImg([ScoutingResult[1],ScoutingResult[2],ScoutingResult[3],ScoutingResult[4],ScoutingResult[5]])
      .then((img) => {
        console.log(img); // => `[object Jimp]` 
        img.write('bandori_scout.png', () => message.channel.send(new Discord.Attachment('bandori_scout.png')));
        fs.writeFileSync("./PetBot/settings/scout/Running.txt", 'false');
      });
    } else if(Amount == "10"){
      mergeImg([ScoutingResult[1],ScoutingResult[2],ScoutingResult[3],ScoutingResult[4],ScoutingResult[5],ScoutingResult[6],ScoutingResult[7],ScoutingResult[8],ScoutingResult[9],ScoutingResult[10]])
        .then((img) => {
          console.log(img); // => `[object Jimp]` 
          img.write('bandori_scout.png', () => message.channel.send(new Discord.Attachment('bandori_scout.png')));
          fs.writeFileSync("./PetBot/settings/scout/Running.txt", 'false');
        });
    }
  } else{
      console.log("i: "+i);
      message.channel.send(new Discord.Attachment(ScoutingResult[i-1]));
      fs.writeFileSync("./PetBot/settings/scout/Running.txt", 'false');

    }
  }
}



function getRandom(min, max) {
    return rng.integer({min, max});
  }


function getRarity(RandomScoutRarity, DreamFes) {
    return "AprilFools";

    if(DreamFes){
      if(RandomScoutRarity <= 60){
        return 4;
      } else if(RandomScoutRarity <= 145){
        return 3;
      } else{
        return 2;
      }
    } else{
      if(RandomScoutRarity <= 30){
        return 4;
      } else if(RandomScoutRarity <= 115){
        return 3;
      } else{
       return 2;
      }
    }

    
  }

  function UpdateInventory(Card, UserID, Idolized) {
    var Inventory = JSON.parse(fs.readFileSync("./PetBot/settings/bandori/Inventory/"+UserID+"/Inventory.json", 'utf8'));
    let UserMaster = JSON.parse(fs.readFileSync("./PetBot/settings/user/master.json"));
    let SettingsMaster = JSON.parse(fs.readFileSync("./PetBot/settings/master.json"));
    let Member = getMember(Card);

    if(SettingsMaster.Bandori.Gacha.RewardsParameter){
      let RandomParameter = getRandom(0, 4);
        // message.channel.send("[DEBUG] RandomParameter (1): " + RandomParameter);
      let V = 0;
      if(RandomParameter == 4){
        RandomParameter = SettingsMaster.Bandori.Gacha.FeaturedParameters;
      }

      if(RandomParameter == "Performance"){
        RandomParameter = 1;
      } else if(RandomParameter == "Visual"){
        RandomParameter = 2;
      } else if(RandomParameter == "Technique"){
        RandomParameter = 3;
      }

     // message.channel.send("[DEBUG] RandomParameter (2): " + RandomParameter);

      if(RandomParameter == 1){
        RandomParameter = "Performance";

        if(Idolized && Card.performance_trained_max != 0){
          V = getRandom(Card.performance_min, Card.performance_trained_max);
        } else{
          V = getRandom(Card.performance_min, Card.performance_max);
        }
        
      } else if(RandomParameter == 2){
        RandomParameter = "Visual";

        if(Idolized && Card.visual_trained_max != 0){
          V = getRandom(Card.visual_min, Card.visual_trained_max);
        } else{
          V = getRandom(Card.visual_min, Card.visual_max);
        }

      } else if(RandomParameter == 3){
        RandomParameter = "Technique";

        if(Idolized && Card.technique_trained_max != 0){
          V = getRandom(Card.technique_min, Card.technique_trained_max);
        } else{
          V = getRandom(Card.technique_min, Card.technique_max);
        }
      }

      //message.channel.send("[DEBUG] RandomParameter (3): " + RandomParameter);

      V *= SettingsMaster.Bandori.Gacha.ParameterMultiplier;

      UserMaster[UserID].Bandori.Parameters[RandomParameter] += V;

       let ParametersJSON = JSON.stringify(UserMaster, null, "\t");
       fs.writeFileSync("./PetBot/settings/user/master.json",ParametersJSON);
    }
   

    if(Member != "SantaAlter"){
      let Band = getBand(Member);
      let Attribute = Card.i_attribute;
      console.log("Idolized: " + Idolized);

      if(Inventory[Band][Attribute][Member] == Card.i_rarity && Idolized == "s" && Card.i_rarity == 4){
        Inventory[Band][Attribute][Member] = Card.i_rarity + 1;
        Inventory[Band][Attribute][Member][Idolized] = true;
        let UpdatedJSON = JSON.stringify(Inventory, null, "\t");
        fs.writeFileSync("./PetBot/settings/bandori/Inventory/"+UserID+"/Inventory.json",UpdatedJSON);
      } else if(Inventory[Band][Attribute][Member] < Card.i_rarity){
        Inventory[Band][Attribute][Member] = Card.i_rarity;
        let UpdatedJSON = JSON.stringify(Inventory, null, "\t");
        fs.writeFileSync("./PetBot/settings/bandori/Inventory/"+UserID+"/Inventory.json",UpdatedJSON);
      }

      
    }
  }


function getMember(Card){
  let Member = "Unknown";
  if(Card.member == 6){
    Member = "Kasumi";
  } else if(Card.member == 7){
    Member = "Tae";
  } else if(Card.member == 8){
    Member = "Rimi";
  } else if(Card.member == 9){
    Member = "Saaya";
  } else if(Card.member == 10){
    Member = "Arisa";
  } else if(Card.member == 11){
    Member = "Ran";
  } else if(Card.member == 12){
    Member = "Moca";
  } else if(Card.member == 13){
    Member = "Himari";
  } else if(Card.member == 14){
    Member = "Tomoe";
  } else if(Card.member == 15){
    Member = "Tsugumi";
  } else if(Card.member == 16){
    Member = "Kokoro";
  } else if(Card.member == 17){
    Member = "Kaoru";
  } else if(Card.member == 18){
    Member = "Hagumi";
  } else if(Card.member == 19){
    Member = "Kanon";
  } else if(Card.member == 20){
    Member = "Michelle";
  } else if(Card.member == 21){
    Member = "Aya";
  } else if(Card.member == 22){
    Member = "Hina";
  } else if(Card.member == 23){
    Member = "Chisato";
  } else if(Card.member == 24){
    Member = "Maya";
  } else if(Card.member == 25){
    Member = "Eve";
  } else if(Card.member == 26){
    Member = "Yukina";
  } else if(Card.member == 27){
    Member = "Sayo";
  } else if(Card.member == 28){
    Member = "Lisa";
  } else if(Card.member == 29){
    Member = "Ako";
  } else if(Card.member == 30){
    Member = "Rinko";
  } else if(Card.member == 101){
    Member = "SantaAlter";
  }

  return Member;
}

function getBand(Member){
  let Band = "Unknown";

  console.log("Member: "+Member);

  if(Member == "Kasumi" || Member == "Saaya" || Member == "Tae" || Member == "Rimi" || Member == "Arisa"){
    Band = "PoPiPa";
  } else if(Member == "Rinko" || Member == "Ako" || Member == "Lisa" || Member == "Sayo" || Member == "Yukina"){
    Band = "Roselia";
  } else if(Member == "Hagumi" || Member == "Kokoro" || Member == "Kanon" || Member == "Michelle" || Member == "Kaoru"){
    Band = "HaroHapi";
  } else if(Member == "Aya" || Member == "Maya" || Member == "Chisato" || Member == "Eve" || Member == "Hina"){
    Band = "PasuPare";
  } else if(Member == "Tomoe" || Member == "Ran" || Member == "Moca" || Member == "Himari" || Member == "Tsugumi"){
    Band = "Afterglow";
  }

  return Band;
}