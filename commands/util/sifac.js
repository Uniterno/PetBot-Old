const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const ScoutRR = require('./mod/srr.js');
const https = require('https');
const mergeImg = require('merge-img');
const fs = require('fs');
const rng = require('random-world');
const stringTable = require('string-table');


module.exports = class SIFACCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'sifac',
            group: 'util',
            guildOnly: true,
            memberName: 'sifac',
            description: 'SIFAC-style gacha.',
            aliases: ['sifac'],
            throttling: {
        usages: 5,
        duration: 10
    },
        });
    }

async run(message, args) {


  var Settings = JSON.parse(fs.readFileSync("./PetBot/settings/master.json"));
  var UserMaster = JSON.parse(fs.readFileSync("./PetBot/settings/user/master.json"));
  var UserID = message.author.id;


   /* if(message.author.id != 168389193603612673){
      message.channel.send("A new gacha is being prepared, please wait a bit. Sorry for the trouble.");
    return;
    }*/
    

  args = args.split(' ');

  if(args[0].toLowerCase() == "pull"){

    if(Settings.running == true){
      message.channel.send("Another SIFAC pull is going on right now. Can't run two at the same time.");
      return;
    }

    //args = args.toLowerCase();
       
    if(!!UserMaster[UserID].SIFAC.Inventory == false){
              //fs.writeFileSync("./PetBot/settings/PetGacha/Inventory/"+UserID+"_Inventory.json", "{}");
      message.channel.send("Debug warning: UserMaster[UserID].SIFAC.Inventory array didn't exist.");
    }
      

    Settings.running = true;
    let UpdatedJSON2 = JSON.stringify(Settings, null, "\t");
    fs.writeFileSync("./PetBot/settings/master.json",UpdatedJSON2);


    let AmountToRemove = Settings.SIFAC.cost;
    
    let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/MakiCookies.txt");

    if(CurrentAmount - AmountToRemove < 0){
      message.channel.send("You don't have enough MakiCookies to perform this action.");
      fs.writeFileSync("./PetBot/settings/scout/Running.txt", 'false');
      return;
    }

    CurrentAmount = CurrentAmount - AmountToRemove; // Remove the spent amount

      

    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/MakiCookies.txt", CurrentAmount);

    message.channel.send(AmountToRemove+" MakiCookies were used to perform this action.");
    /*message.channel.send("You have obtained 4 butterflies for this pull!");
    let ButterflyCurrentAmount = parseInt(fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/Butterflies.txt"));
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/Butterflies.txt", ButterflyCurrentAmount + 4); */
     
    let CardsArray = JSON.parse(fs.readFileSync("./PetBot/settings/SIFAC/cards.json"));
    let MessageToSend = "";

    
    let i = 0;

    while(i < 10){
      console.log("-------");

      MessageToSend += "\n" + parseInt(i+1) + " - ";

      let RandomNumber = getRandom(-1, CardsArray.results.length-1);
      console.log("RandomNumber: "+ RandomNumber);
      console.log(CardsArray.results[RandomNumber]);
      console.log("i: " + i);
      
      UserMaster[UserID].SIFAC.CurrentPull[i].secret_id = CardsArray.results[RandomNumber].id;

      if(getRandom(-1, 100) <= 30){ // 15%
        UserMaster[UserID].SIFAC.CurrentPull[i].public_year = true;
        MessageToSend += Settings.SIFAC.memberInfo[CardsArray.results[UserMaster[UserID].SIFAC.CurrentPull[i].secret_id-1].member].Year;
        if(Settings.SIFAC.memberInfo[CardsArray.results[UserMaster[UserID].SIFAC.CurrentPull[i].secret_id-1].member].Year == 1){
          MessageToSend += "st Year ";
        } else if(Settings.SIFAC.memberInfo[CardsArray.results[UserMaster[UserID].SIFAC.CurrentPull[i].secret_id-1].member].Year == 2){
          MessageToSend += "nd Year ";
        } else if(Settings.SIFAC.memberInfo[CardsArray.results[UserMaster[UserID].SIFAC.CurrentPull[i].secret_id-1].member].Year == 3){
          MessageToSend += "rd Year ";
        }
      } else{
        UserMaster[UserID].SIFAC.CurrentPull[i].public_year = false;
      }

      if(getRandom(-1, 100) <= 30){ // 15
        UserMaster[UserID].SIFAC.CurrentPull[i].public_subunit = true;
        console.log("Subunit");
        console.log(Settings.SIFAC.memberInfo);
        /* console.log(Settings.SIFAC.memberInfo[CardsArray]);
        console.log(Settings.SIFAC.memberInfo[CardsArray.results]);
        console.log(Settings.SIFAC.memberInfo[CardsArray.results[UserMaster[UserID]]]);
        console.log(Settings.SIFAC.memberInfo[CardsArray.results[UserMaster[UserID].SIFAC]]);
        console.log(Settings.SIFAC.memberInfo[CardsArray.results[UserMaster[UserID].SIFAC.CurrentPull[i]]]);
        console.log(Settings.SIFAC.memberInfo[CardsArray.results[UserMaster[UserID].SIFAC.CurrentPull[i].secret_id-1]]); */
        MessageToSend += Settings.SIFAC.memberInfo[CardsArray.results[UserMaster[UserID].SIFAC.CurrentPull[i].secret_id-1].member].Subunit + " ";
      } else{
        UserMaster[UserID].SIFAC.CurrentPull[i].public_subunit = false;
      }

      if(getRandom(-1, 100) <= 10){ // 5
        UserMaster[UserID].SIFAC.CurrentPull[i].public_name = true;
        console.log("Name");
        MessageToSend += CardsArray.results[UserMaster[UserID].SIFAC.CurrentPull[i].secret_id-1].member + " ";
      } else{
        UserMaster[UserID].SIFAC.CurrentPull[i].public_name = false;
      }

      if(getRandom(-1, 100) <= 20){ // 10
        UserMaster[UserID].SIFAC.CurrentPull[i].public_costume = true;
        MessageToSend += CardsArray.results[UserMaster[UserID].SIFAC.CurrentPull[i].secret_id-1].costume + " ";
      } else{
        UserMaster[UserID].SIFAC.CurrentPull[i].public_costume = false;
      }

      if(getRandom(-1, 100) <= 6){ // 3
        UserMaster[UserID].SIFAC.CurrentPull[i].public_rarity = true;
        MessageToSend += CardsArray.results[UserMaster[UserID].SIFAC.CurrentPull[i].secret_id-1].rarity + " ";
      } else{
        UserMaster[UserID].SIFAC.CurrentPull[i].public_rarity = false;
      }

      if(UserMaster[UserID].SIFAC.CurrentPull[i].public_year == false && UserMaster[UserID].SIFAC.CurrentPull[i].public_subunit == false && UserMaster[UserID].SIFAC.CurrentPull[i].public_name == false && UserMaster[UserID].SIFAC.CurrentPull[i].public_costume == false && UserMaster[UserID].SIFAC.CurrentPull[i].public_rarity == false){
        MessageToSend += "???";
      }


      i++;

    }


    Settings.running = false;
    message.channel.send(MessageToSend);
    UserMaster[UserID].SIFAC.ValidPull = true;

    let UpdatedJSON = JSON.stringify(UserMaster, null, "\t");
    fs.writeFileSync("./PetBot/settings/user/master.json",UpdatedJSON);

    UpdatedJSON2 = JSON.stringify(Settings, null, "\t");
    fs.writeFileSync("./PetBot/settings/master.json",UpdatedJSON2);

    
    } else if(args[0].toLowerCase() == "pick"){
      if(args[1] < 0 || args[1] > 10){
        message.channel.send("Not a valid ID.");
        return;
      }

      if(UserMaster[UserID].SIFAC.ValidPull == false){
        message.channel.send("You need to pull first.");
        return;
      }


      let SelectedCard = args[1] - 1;
      let CardsArray = JSON.parse(fs.readFileSync("./PetBot/settings/SIFAC/cards.json"));


      console.log("GotItemString");
      let GotItemString = CardsArray.results[UserMaster[UserID].SIFAC.CurrentPull[SelectedCard].secret_id-1].member + " (" + CardsArray.results[UserMaster[UserID].SIFAC.CurrentPull[SelectedCard].secret_id-1].costume + ") [" + CardsArray.results[UserMaster[UserID].SIFAC.CurrentPull[SelectedCard].secret_id-1].rarity + "]";

      UserMaster[UserID].SIFAC.Inventory[UserMaster[UserID].SIFAC.Inventory.length] = GotItemString;

      UserMaster[UserID].SIFAC.ValidPull = false;

      message.channel.send(new Discord.Attachment(CardsArray.results[UserMaster[UserID].SIFAC.CurrentPull[SelectedCard].secret_id-1].art[CardsArray.results[UserMaster[UserID].SIFAC.CurrentPull[SelectedCard].secret_id-1].rarity]));
      message.channel.send("Congratulations! You got **" + GotItemString + "**!");


      let UpdatedJSON = JSON.stringify(UserMaster, null, "\t");
      fs.writeFileSync("./PetBot/settings/user/master.json",UpdatedJSON);
    } else{
      message.channel.send("Use 'pull' or 'pick <ID>' as an argument.");
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
    fs.writeFileSync("./PetBot/settings/PetGacha/Inventory/"+UserID+"_Inventory.json",UpdatedJSON);
  
  }