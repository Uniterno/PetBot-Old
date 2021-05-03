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
            name: 'sifas',
            group: 'util',
            guildOnly: true,
            memberName: 'sifas',
            description: 'SIFAS Scout.',
            throttling: {
        usages: 5,
        duration: 10
    },
        });
    }

  run(message, args) {

    console.log("---\nSIFAS scouting\n---");

    args = args.split(' ');
    let Amount = args[0];

    let UserID = message.author.id;
    let UserMaster = JSON.parse(fs.readFileSync("./PetBot/settings/user/master.json"));
    let SettingsMaster = JSON.parse(fs.readFileSync("./PetBot/settings/master.json"));
    let ScoutRunning = JSON.parse(fs.readFileSync("./PetBot/settings/scout/Running.json"));


    if(ScoutRunning.SIFAS == 'true'){
      message.channel.send("Please wait a bit until the currently running SIFAS pull finishes.");
      return;
    }

// PULL

  let URGuaranteed = 0;
  let MuseURGuaranteed = 0;
  let AqoursURGuaranteed = 0;
  let DiscountedPull20 = false;
  let MuseOnly = false;
  let AqoursOnly = false;
  let FreePull = false;


    if(Amount != "10"){
        Amount = 1;
    } else{
        let str = "URGuaranteed"
        const f = (val) => val === str;
        
        if(args.some(f)){
          if(UserMaster[UserID].SIFAS.Premium["UR Guaranteed"] > 0){
            UserMaster[UserID].SIFAS.Premium["UR Guaranteed"]--;
          } else{
            message.channel.send("Not enough UR Guaranteed Tickets");
            return;
          }

          URGuaranteed++;
        }

        str = "DiscountedPull20%";

        if(args.some(f)){
          if(UserMaster[UserID].SIFAS.Premium["Discounted Pull 20%"] > 0){
            UserMaster[UserID].SIFAS.Premium["Discounted Pull 20%"]--;
          } else{
            message.channel.send("Not enough Discounted Pull 20% Tickets");
            return;
          }

          DiscountedPull20 = true;
        }

        str = "FreePull";

        if(args.some(f)){
          if(UserMaster[UserID].SIFAS.Premium["Free Pull"] > 0){
            UserMaster[UserID].SIFAS.Premium["Free Pull"]--;
          } else{
            message.channel.send("Not enough Free Pull Tickets");
            return;
          }

          if(DiscountedPull20){
            message.channel.send("Incompatible tickets: 20% Discounted Pull and Free Pull");
            return;
          } 

          FreePull = true;
        }

        str = "MuseURGuaranteed";
        
        if(args.some(f)){
          if(UserMaster[UserID].SIFAS.Premium["μ's UR Guaranteed"] > 0){
            UserMaster[UserID].SIFAS.Premium["μ's UR Guaranteed"]--;
          } else{
            message.channel.send("Not enough μ's UR Guaranteed Tickets");
            return;
          }
          MuseURGuaranteed++;
        }

        str = "AqoursURGuaranteed";
        
        if(args.some(f)){
          if(UserMaster[UserID].SIFAS.Premium["Aqours UR Guaranteed"] > 0){
            UserMaster[UserID].SIFAS.Premium["Aqours UR Guaranteed"]--;
          } else{
            message.channel.send("Not enough μ's UR Guaranteed Tickets");
            return;
          }
          AqoursURGuaranteed++;
        }

        str = "MuseOnly";
        
        if(args.some(f)){
           if(AqoursURGuaranteed > 0){
            message.channel.send("Incompatible tickets: μ's Only and Aqours UR Guaranteed");
            return;
          } else if(UserMaster[UserID].SIFAS.Premium["μ's Only"] > 0){
            UserMaster[UserID].SIFAS.Premium["μ's Only"]--;
          } else{
            message.channel.send("Not enough μ's Only Tickets");
            return;
          }
          MuseOnly = true;
        }

        str = "AqoursOnly";

        if(args.some(f)){
          if(MuseURGuaranteed > 0){
            message.channel.send("Incompatible items: Aqours Only and μ's UR Guaranteed");
            return;
          } else if(MuseOnly){
            message.channel.send("Incompatible items: Muse Only and Aqours Only");
            return;
          } else if(UserMaster[UserID].SIFAS.Premium["Aqours Only"] > 0){
            UserMaster[UserID].SIFAS.Premium["Aqours Only"]--;
          } else{
            message.channel.send("Not enough Aqours Only Tickets");
            return;
          } 
          AqoursOnly = true;
        }

        console.log(UserMaster[UserID].SIFAS.Premium);



    }

    console.log("Check 1");


    ScoutRunning.SIFAS = true;
    let UpdatedJSONx = JSON.stringify(ScoutRunning, null, "\t");
    fs.writeFileSync("./PetBot/settings/scout/Running.json", UpdatedJSONx.toString());
    let UpdatedJSONy = JSON.stringify(UserMaster, null, "\t");
    fs.writeFileSync("./PetBot/settings/user/master.json", UpdatedJSONy.toString());

     // TODO: Write into JSON

   console.log("Check 2");

    let AmountToRemove = SettingsMaster.SIFAS.Gacha.Cost;
    
    if(Amount == "10"){
      AmountToRemove *= 10;
    }
    if(DiscountedPull20){
      AmountToRemove = Math.round(AmountToRemove*0.8);
    }
    if(FreePull){
      AmountToRemove = 0;
    }

    let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt"); // Take current amount
    
    if(CurrentAmount - AmountToRemove < 0){
      message.channel.send("You don't have enough PetCoins to perform this action.");
      ScoutRunning.SIFAS = false;
      // TODO: Write into JSON
      return;
    }

    console.log("Check 3");

    CurrentAmount -= AmountToRemove; // Remove the spent amount

  
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt", CurrentAmount.toString());

    message.channel.send(AmountToRemove + " PetCoins were used to perform this action.");
    console.log("Check 4");
     
    let CardsArray = JSON.parse(fs.readFileSync("./PetBot/settings/sifas/cards.json"));
    let ImportantArray = [];
    let ScoutingResult = [];
    let ObtainedItemsGlobal = [0, 0, 0, 0, 0, 0];
    let RTemplate = ["https://tirofinale.kirara.ca/i/5930/iHFXSaSq3DYvaA.png", "https://tirofinale.kirara.ca/i/715b/b6feVek0ZCnZYw.png", "https://tirofinale.kirara.ca/i/7559/NHuEfckN3RfDHA.png", "https://tirofinale.kirara.ca/i/797b/9G4BHAfnl4lZYg.png", "https://tirofinale.kirara.ca/i/7235/VY8vVDtcTiV16g.png", "https://tirofinale.kirara.ca/i/3b73/c-0mQcK-KmsKNA.png", "https://tirofinale.kirara.ca/i/7e35/6XWnM116uVkQ4Q.png", "https://tirofinale.kirara.ca/i/6845/kIOr22quy62kRQ.png", "https://tirofinale.kirara.ca/i/643e/EbD3nY9f8_gP7Q.png", "https://tirofinale.kirara.ca/i/685c/-V_UXRwO89aCug.png", "https://tirofinale.kirara.ca/i/6136/a8emJlfaPfWseQ.png", "https://tirofinale.kirara.ca/i/5927/59QU8deCQhX_6g.png", "https://tirofinale.kirara.ca/i/6a7b/mTxsDCZkdJgm8A.png", "https://tirofinale.kirara.ca/i/3c5f/Bz7cXVrUfrKGog.png", "https://tirofinale.kirara.ca/i/6038/W-fkXmFJGnb6kw.png", "https://tirofinale.kirara.ca/i/6038/W-fkXmFJGnb6kw.png", "https://tirofinale.kirara.ca/i/282b/8zm_nRh82_4BLg.png", "https://tirofinale.kirara.ca/i/4f5f/Gt1Hk2Jrn7QUQA.png", "https://tirofinale.kirara.ca/i/6651/FL8vTOYjjX4_eQ.png", "https://tirofinale.kirara.ca/i/617d/pMGqXCiaHk3fOA.png", "https://tirofinale.kirara.ca/i/544f/h6KfA9bzSdwK-A.png", "https://tirofinale.kirara.ca/i/2c/OiHvuCARADRpcQ.png", "https://tirofinale.kirara.ca/i/5446/Qv4F3BNTZlvCog.png", "https://tirofinale.kirara.ca/i/345d/VzDprDOde2p4oQ.png", "https://tirofinale.kirara.ca/i/457c/ehSix3rIiWZhtQ.png", "https://tirofinale.kirara.ca/i/5229/OKQif8kdxbuilA.png", "https://tirofinale.kirara.ca/i/3760/3feVfe2hk29EjA.png", "https://tirofinale.kirara.ca/i/2d2f/yA21XTc4RhhAEw.png"];

    console.log("Check 6");

  let i = 1;
  while(i <= Amount){
    console.log("Check 7 + i at " + i);
    let RandomScoutRarity = getRandom(0, 100);
    if(Amount == "10"){
      if(i == 1){
        if(RandomScoutRarity > 15){
          RandomScoutRarity = 15; // SR guaranteed
        }
      }
    }

    let ThisCardIsMuse = false;
    let ThisCardIsAqours = false;

    if(MuseOnly){
      ThisCardIsMuse = true;
    } else if(AqoursOnly){
      ThisCardIsAqours = true;
    }

    let Rarity = getRarity(RandomScoutRarity, SettingsMaster.SIFAS.Gacha.Fes);
    if(URGuaranteed >= 1){
      Rarity = "UR";
      URGuaranteed--;
    } else if(MuseURGuaranteed >= 1){
      Rarity = "UR";
      MuseURGuaranteed--;
      ThisCardIsMuse = true;
    } else if(AqoursURGuaranteed >= 1){
      Rarity = "UR";
      AqoursURGuaranteed--;
      ThisCardIsAqours = true;
    }

    

    let a = 0;
    let b = 0;

  let SelectedCard = parseInt(getRandom(-1, CardsArray[Rarity].length - 1));

  let ValidGroup = false;
  do{
    if(ThisCardIsMuse){
       let ValidNamesMuse = ["Honoka", "Kotori", "Umi", "Rin", "Maki", "Hanayo", "Nico", "Nozomi", "Eli", "R Template"];
       let str = CardsArray[Rarity][SelectedCard].name;
       console.log(str);
       let f = (val) => val === str;

       if(!ValidNamesMuse.some(f)){
          SelectedCard = parseInt(getRandom(-1, CardsArray[Rarity].length - 1));
       } else{
        ValidGroup = true;
       }
    } else{
      ValidGroup = true;
    }
  } while(!ValidGroup);

  ValidGroup = false;

  do{
    if(ThisCardIsAqours){
       let ValidNamesAqours = ["Chika", "You", "Riko", "Yohane", "Ruby", "Hanamaru", "Dia", "Mari", "Kanan", "R Template"];
       let str = CardsArray[Rarity][SelectedCard].name;
       console.log(str);
       let f = (val) => val === str;

       if(!ValidNamesAqours.some(f)){
          SelectedCard = parseInt(getRandom(-1, CardsArray[Rarity].length - 1));
       } else{
        ValidGroup = true;
       }
    } else{
      ValidGroup = true;
    }
  } while(!ValidGroup);

 let RateUp4 = getRandom(0, 100);
 if(Rarity == 4 && RateUp4 <= 10){
    // Guarantee rate up card
  }

 let RateUp3 = getRandom(0, 100);
  if(Rarity == 3 && RateUp3 <= 10){
    // Guarantee rate up card
  }
    
  if(Amount == "10" || Amount == "5"){
    console.log("Rarity: " + Rarity);
    console.log("SelectedCard: " + SelectedCard);
    console.log("CardsArray[Rarity][SelectedCard].icon.unidolized: " + CardsArray[Rarity][SelectedCard].icon.unidolized);
    ScoutingResult[i] = encodeURI(CardsArray[Rarity][SelectedCard].icon.unidolized);
  } else{
    ScoutingResult[i] = encodeURI(CardsArray[Rarity][SelectedCard].costume.before);
  }

  if(ScoutingResult[i] == "ReplaceWithTemplate()"){
      ScoutingResult[i] = RTemplate[getRandom(-1, RTemplate.length - 1)];
  }

  console.log("i: " + i);
  console.log("ScoutingResult[i]: " + ScoutingResult[i]); 

  let obtainedItems = [0, 0, 0, 0, 0, 0];
  let returnedValues = [];

  returnedValues = UpdateInventory(CardsArray[Rarity][SelectedCard], UserID);
  obtainedItems = returnedValues[0];
  UserMaster = returnedValues[1];
  console.log("ObtainedItem length: " + obtainedItems.length);

  for(let x = 0; x < obtainedItems.length; x++){
    ObtainedItemsGlobal[x] += obtainedItems[x];
  }

  i++;

  //console.log("ScoutingResult: " + ScoutingResult);

  }

  console.log("ScoutingResult: " + ScoutingResult);

  let MessageObtainedItems = "";
  if(ObtainedItemsGlobal[0] != 0 || ObtainedItemsGlobal[1] != 0 || ObtainedItemsGlobal[2] != 0 || ObtainedItemsGlobal[3] != 0 || ObtainedItemsGlobal[4] != 0 || ObtainedItemsGlobal[5] != 0 ){
    MessageObtainedItems = "Due to dupes, you got the following:\n";

    if(ObtainedItemsGlobal[0] != 0){
      MessageObtainedItems += "1⋆ Macarons: " + ObtainedItemsGlobal[0] + "\n";
    }

    if(ObtainedItemsGlobal[1] != 0){
      MessageObtainedItems += "2⋆ Macarons: " + ObtainedItemsGlobal[1] + "\n";
    }

    if(ObtainedItemsGlobal[2] != 0){
      MessageObtainedItems += "3⋆ Macarons: " + ObtainedItemsGlobal[2] + "\n";
    }

    if(ObtainedItemsGlobal[3] != 0){
      MessageObtainedItems += "Seeds: " + ObtainedItemsGlobal[3] + "\n";
    }

    if(ObtainedItemsGlobal[4] != 0){
      MessageObtainedItems += "Books: " + ObtainedItemsGlobal[4] + "\n";
    }

    if(ObtainedItemsGlobal[5] != 0){
      MessageObtainedItems += "Rainbow Necklace: " + ObtainedItemsGlobal[5] + "\n"; 
    }   
  }

  UserMaster[UserID].SIFAS.Inventory["Macaron 1⋆"] += ObtainedItemsGlobal[0];
  UserMaster[UserID].SIFAS.Inventory["Macaron 2⋆"] += ObtainedItemsGlobal[1];
  UserMaster[UserID].SIFAS.Inventory["Macaron 3⋆"] += ObtainedItemsGlobal[2];
  UserMaster[UserID].SIFAS.Inventory["Seeds"] += ObtainedItemsGlobal[3];
  UserMaster[UserID].SIFAS.Inventory["Books"] += ObtainedItemsGlobal[4];
  UserMaster[UserID].SIFAS.Inventory["Rainbow Necklace"] += ObtainedItemsGlobal[5];


  //console.log("Check 391");
  let UpdatedJSON = JSON.stringify(UserMaster, null, "\t");
  fs.writeFileSync("./PetBot/settings/user/master.json", UpdatedJSON.toString());

  //console.log("Check 395");
  let hash = getRandom(4899879, 4899979);
  hash = hash.toString(36);


  if(Amount == "10"){
      mergeImg([ScoutingResult[1],ScoutingResult[2],ScoutingResult[3],ScoutingResult[4],ScoutingResult[5],ScoutingResult[6],ScoutingResult[7],ScoutingResult[8],ScoutingResult[9],ScoutingResult[10]])
        .then((img) => {
          console.log(img); // => `[object Jimp]` 
          img.write(hash + 'sifas_scout.png', () => message.channel.send(new Discord.MessageAttachment(hash + 'sifas_scout.png')));
        });
  } else{
      //console.log("i: "+i);
      message.channel.send(new Discord.MessageAttachment(ScoutingResult[i - 1]));
    }

  UpdatedJSONx = JSON.stringify(ScoutRunning, null, "\t");
  fs.writeFileSync("./PetBot/settings/scout/Running.json", UpdatedJSONx.toString());
  if(MessageObtainedItems != ""){
      message.channel.send(MessageObtainedItems);
    }
  }
}



function getRandom(min, max) {
    return rng.integer({min, max});
  }


function getRarity(RandomScoutRarity, Fes) {
    //return 4;

    if(Fes){
      // THIS REMAINS OUTDATED CUZ NO FEST
      if(RandomScoutRarity <= 60){
        return 4;
      } else if(RandomScoutRarity <= 145){
        return 3;
      } else{
        return 2;
      }
    } else{
      if(RandomScoutRarity <= 5){
        return "UR";
      } else if(RandomScoutRarity <= 15){
        return "SR";
      } else{
       return "R";
      }
    }   
  }

  function UpdateInventory(Card, UserID) {
    let Inventory = JSON.parse(fs.readFileSync("./PetBot/settings/sifas/Inventory/"+UserID+"/Inventory.json", 'utf8'));
    let UserMaster = JSON.parse(fs.readFileSync("./PetBot/settings/user/master.json"));
    let SettingsMaster = JSON.parse(fs.readFileSync("./PetBot/settings/master.json"));
    let Normal = [0, 0, 0, 0, 0, 0];

    if(!!Inventory[Card.id] != false){ // exists
        console.log(Inventory[Card.id]);
        console.log("Card exists: " + Card.id);
        
        
        let ObtainedItem = getRandom(-1, 5);
        console.log("ObtainedItem: " + ObtainedItem);
        let ListOfItems = ["1⋆ Macaron", "2⋆ Macaron", "3⋆ Macaron", "Seeds", "Book", "Rainbow Necklace"];
        let AmountObtained = 0;
        if(Card.rarity == "SR"){
          if(ObtainedItem == 3 || ObtainedItem == 4){
            AmountObtained = getRandom(9, 25);
          } else{
            AmountObtained = getRandom(19, 200);
          }
        } else if(Card.rarity == "UR"){
          if(ObtainedItem == 3 || ObtainedItem == 4){
            AmountObtained = getRandom(9, 50);
          } else{
            AmountObtained = getRandom(39, 450);
          }
        } else{
          if(ObtainedItem == 3 || ObtainedItem == 4){
            AmountObtained = getRandom(0, 5);
          } else{
            AmountObtained = getRandom(0, 30);
          }
        }
        console.log(Card.rarity);
        console.log(AmountObtained);
        Normal[ObtainedItem] += AmountObtained;
        if(Inventory[Card.id].limitBreak < 5){
          Inventory[Card.id].limitBreak++;
        }
       

    } else{
      console.log("Card doesn't exist. Creating: " + Card.id);
      Inventory[Card.id] = Card;
    }

    console.log(UserMaster[UserID].SIFAS.Bond);

    if(!!UserMaster[UserID].SIFAS.Bond == false){
          UserMaster[UserID].SIFAS.Bond = {};
    }

    console.log(UserMaster[UserID].SIFAS.Bond);
    console.log(Card.name);
    console.log(UserMaster[UserID].SIFAS.Bond[Card.name]);

    if(Card.name != "R Template"){
      if(!!UserMaster[UserID].SIFAS.Bond[Card.name] == false){
          UserMaster[UserID].SIFAS.Bond[Card.name] = 1;
      } else{
        if(Card.rarity == "SR"){
          UserMaster[UserID].SIFAS.Bond[Card.name]++;
        } else if(Card.rarity == "UR"){
          UserMaster[UserID].SIFAS.Bond[Card.name] += 3;
        }  
      }
    }
    

     let UpdatedJSON = JSON.stringify(Inventory, null, "\t");
     fs.writeFileSync("./PetBot/settings/sifas/Inventory/"+UserID+"/Inventory.json", UpdatedJSON.toString());

     let UpdatedJSON2 = JSON.stringify(UserMaster, null, "\t");
     fs.writeFileSync("./PetBot/settings/user/master.json", UpdatedJSON2.toString());


     let Values = [Normal, UserMaster];

    return Values;
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