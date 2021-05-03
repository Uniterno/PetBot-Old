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
            name: 'fgo',
            group: 'util',
            guildOnly: true,
            memberName: 'fgo',
            description: 'Allows you to perform an FGO pull.',
            throttling: {
        usages: 5,
        duration: 10
    },
        });
    }

  async run(message, args) {

    var UserID = message.author.id;
    args = args.split(' ');
    let Amount = args[0];
  

    if(Amount == "check"){

      if(fs.existsSync("./PetBot/settings/fgo/inv/"+UserID+".json") == false){
      message.channel.send("You don't own any Servants or CEs.");
      return;
     }  


      let Target = args[1];
      //console.log("Target: "+Target);
      //console.log("!!Target == false: "+(!!Target == false));
      if(!!Target == false){
        let i = 1;

      

     //console.log(JSON.parse(fs.readFileSync("./PetBot/settings/fgo/inv/"+UserID+".json")));
     let Inventory = JSON.parse(fs.readFileSync("./PetBot/settings/fgo/inv/"+UserID+".json"));
     let StringExistsCards = "";
     let o = 1;
     let oCE = "";
     while(i <= Object.keys(Inventory).length){
      if(Inventory[o] == true){
        //console.log("o: "+o);
        StringExistsCards = StringExistsCards + o + ", ";

        oCE = "C" + o;
        //console.log("oCE: "+oCE);
        if(Inventory[oCE] == true){
          StringExistsCards = StringExistsCards + oCE + ", ";
          i++;
        }


        i++;
      } else{
        oCE = "C" + o;
        //console.log("oCE: "+oCE);
        if(Inventory[oCE] == true){
          StringExistsCards = StringExistsCards + oCE + ", ";
          i++;
        }
      }
        o++;
      } 

      message.channel.send(StringExistsCards);
      } else{

        let Inventory = JSON.parse(fs.readFileSync("./PetBot/settings/fgo/inv/"+UserID+".json"));
        let Cards = JSON.parse(fs.readFileSync("./PetBot/settings/fgo/cards.json"));

        if(!!Inventory[Target] == false){
          message.channel.send("You don't own this servant or CE.");
          return;
        } else{
          let i = 0;
          //console.log("Cards.results[i]: "+JSON.stringify(Cards.results[i]));
          //console.log("Cards.results[i].id: "+Cards.results[i].id);
          while(Target != Cards.results[i].id){
            i++
          }
          let Name = Cards.results[i].name;
          let Art = Cards.results[i].art;
          let ServantCE = Cards.results[i].ServantCE;

          message.channel.send("You own this "+ServantCE+"!\n\nName: **"+Name+"**\nArt: "+Art);
          return;
        }

      }

      return;
    }



      var ScoutRunning = fs.readFileSync("./PetBot/settings/scout/Running.txt");
    if(ScoutRunning == 'true'){
      message.channel.send("Another scout is going on right now. Can't run two at the same time.");
      return;
    }


     fs.writeFileSync("./PetBot/settings/scout/Running.txt", 'true');

    if(Amount != "10"){
      Amount = "1";
    }

    let AmountToRemove = 5;
    if(Amount == "10"){
      AmountToRemove = AmountToRemove * 10;
    }

    let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/MakiCookies.txt"); // Take current amount

    if(CurrentAmount - AmountToRemove < 0){
      message.channel.send("You don't have enough MakiCookies to perform this action.");
      fs.writeFileSync("./PetBot/settings/scout/Running.txt", 'false');
      return;
    }


/*
    Amount = "10";
     if(fs.existsSync("./PetBot/settings/fgo/PulledSpecial/"+UserID+".txt") == false){
      fs.writeFileSync("./PetBot/settings/fgo/PulledSpecial/"+UserID+".txt", "Pulled");
  } else{
    message.channel.send("You have already pulled this gacha the maximum allowed times!");
    fs.writeFileSync("./PetBot/settings/scout/Running.txt", 'false');
    return;
  } */

  
    CurrentAmount = CurrentAmount - AmountToRemove; // Remove the spent amount
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/MakiCookies.txt", CurrentAmount);
    message.channel.send(AmountToRemove+" MakiCookies were used to perform this action.");





  
  let CardsArray = JSON.parse(fs.readFileSync("./PetBot/settings/fgo/cards.json"));
  let CardsArrayTemp = [];
  var ImportantArray = [];
  var ScoutingResult = [];


  let RandomScoutRarity = getRandom(0, 100);
  var Rarity = getRarity(RandomScoutRarity);
  console.log("---");

  if(fs.existsSync("./PetBot/settings/fgo/inv/"+UserID+".json") == false){
      fs.writeFileSync("./PetBot/settings/fgo/inv/"+UserID+".json","{}");
    }


  var ObtainedMakiCookies = 0;
  var Inventory = JSON.parse(fs.readFileSync("./PetBot/settings/fgo/inv/"+UserID+".json"));

  let i = 1;
  while(i <= Amount){
    CardsArrayTemp.length = 0;
    //console.log("i: "+i);
    RandomScoutRarity = getRandom(0, 100);
  
    if(Amount == "10"){
      if(i == 1){
        if(RandomScoutRarity > 20){
          RandomScoutRarity = 20; // 4* guaranteed
          //console.log("i == 1");
        }
      }
      if(i == 2){
        if(RandomScoutRarity > 50){
          RandomScoutRarity = 50;
          //console.log("i == 2");
        }
      }
    }

    console.log("RandomScoutRarity: "+RandomScoutRarity);

   
    Rarity = getRarity(RandomScoutRarity);
    if(Rarity == "5c"){
      ServantCE = "CE";
      Rarity = 5;
    } else if(Rarity == "4c"){
      ServantCE = "CE";
      Rarity = 4;
    } else if(Rarity == "3c"){
      ServantCE = "CE";
      Rarity = 3;
    } else if(Rarity == "2c"){
      ServantCE = "CE";
      Rarity = 2;
    } else if(Rarity == "1c"){
      ServantCE = "CE";
      Rarity = 1;
    }

    let ServantCE = getServantCE(Rarity);
    if(Amount == "10"){
      if(i == 2){
      ServantCE = "Servant";
     }
    }

    if(Amount == "10"){
      if(i == 2){
        ServantCE = "Servant";
        }
      }


    let a = 0;
    let b = 0;
  
    //console.log(JSON.stringify(CardsArray[ServantCE]));



    while(a <= parseInt(Object.keys(CardsArray.results).length - 1)){
      /*console.log("a: "+a);
      console.log("b: "+b);
      console.log("CardsArray.results[a].rarity: "+CardsArray.results[a].rarity);
      console.log("CardsArray.results[a].ServantCE: "+CardsArray.results[a].ServantCE);
      console.log("Rarity: "+Rarity);
      console.log("ServantCE: "+ServantCE);
      console.log("Object.keys(CardsArray.results).length - 1: "+parseInt(Object.keys(CardsArray.results).length - 1));*/


      if(parseInt(CardsArray.results[a].rarity) == Rarity && CardsArray.results[a].ServantCE == ServantCE){
        CardsArrayTemp[b] = CardsArray.results[a];
        //console.log("CardsArrayTemp[b]: "+CardsArrayTemp[b]);
        b++;
      }



      a++;
      //console.log("a: "+a);
    }

    if(ServantCE == "Servant"){
      if(Rarity == 5){
        ObtainedMakiCookies = ObtainedMakiCookies + 35; // 35
      } else if(Rarity == 4){
        ObtainedMakiCookies = ObtainedMakiCookies + 20; // 20
      } else if(Rarity == 3){
        ObtainedMakiCookies = ObtainedMakiCookies + 1; // 1
      }
    } else if(ServantCE == "CE"){
      if(Rarity == 5){
        ObtainedMakiCookies = ObtainedMakiCookies + 15; // 15
      } else if(Rarity == 4){
        ObtainedMakiCookies = ObtainedMakiCookies + 5; // 5
      } else if(Rarity == 3){
        ObtainedMakiCookies = ObtainedMakiCookies + 0.5; // 0.5
      }
    }

    ObtainedMakiCookies = Math.round(ObtainedMakiCookies);


   // console.log("CardsArrayTemp.length: "+CardsArrayTemp.length);
    
   //console.log("CardsArrayTemp.length == "+CardsArrayTemp.length);

   if(CardsArrayTemp.length == 1){
    var SelectedCard = 0;
   } else{
    var SelectedCard = getRandom(-1, CardsArrayTemp.length - 1);
   }

  let RateUp = getRandom(0, 1000);
  //let RateUp = 2;
  if(Rarity == 5 && RateUp <= 800 && ServantCE == "Servant"){
    let RandomWhich = getRandom(0, 100);
    if(RandomWhich < 20){
      SelectedCard = 9;
    } else if(RandomWhich < 40){
      SelectedCard = 10;
    } else if(RandomWhich < 60){
      SelectedCard = 11;
    } else if(RandomWhich < 80){
      SelectedCard = 12;
    } else{
      SelectedCard = 13;
    }
   
  } else if(Rarity == 4 && RateUp <= 233 && ServantCE == "Servant"){
   //let RandomWhich = getRandom(0, 100);

   //SelectedCard = 18;

  } else if(Rarity == 3 && RateUp <= 100 && ServantCE == "Servant"){
     let RandomWhich = getRandom(0, 100);
    if(RandomWhich <= 33){ // 33
      //SelectedCard = 22;
    } else if(RandomWhich >= 34 && RandomWhich <= 64){ // 34, 66
      //SelectedCard = 23;
    } else if(RandomWhich >= 65){
      //SelectedCard = 24;
    }
  }


  //console.log("SelectedCard: "+SelectedCard);
  //console.log("CardsArrayTemp: "+CardsArrayTemp);

  if(Amount == "10"){
    ScoutingResult[i] = CardsArrayTemp[SelectedCard].icon;
    //console.log("CardsArrayTemp["+SelectedCard+"].icon: "+CardsArrayTemp[SelectedCard].icon);
    //console.log("i: "+i);
  } else{
    //console.log("CardsArrayTemp["+SelectedCard+"].art: "+CardsArrayTemp[SelectedCard].art);
    //console.log("i: "+i);
    ScoutingResult[i] = CardsArrayTemp[SelectedCard].art;
  }

  //UpdateInventory(CardsArrayTemp[SelectedCard], UserID);



       if(!!Inventory[CardsArrayTemp[SelectedCard].id] == false){
        Inventory[CardsArrayTemp[SelectedCard].id] = true;
       }


       i++;
  }

  let UpdatedJSON = JSON.stringify(Inventory, null, "\t");


  fs.writeFileSync("./PetBot/settings/fgo/inv/"+UserID+".json",UpdatedJSON);


  if(Amount == "10"){
    mergeImg([ScoutingResult[1],ScoutingResult[2],ScoutingResult[3],ScoutingResult[4],ScoutingResult[5],ScoutingResult[6],ScoutingResult[7],ScoutingResult[8],ScoutingResult[9],ScoutingResult[10]])
              .then((img) => {
                 //console.log(img); // => `[object Jimp]` 
                  img.write('fgo_scout.png', () => message.channel.send(new Discord.Attachment('fgo_scout.png')));
                   fs.writeFileSync("./PetBot/settings/scout/Running.txt", 'false');
                  setTimeout(ObtainedMakiCookiesMessage, 4000, ObtainedMakiCookies, message);
                  });
  } else{
    //console.log("i: "+i);
    //console.log("ScoutingResult["+(i-1)+"].art: "+ScoutingResult[i-1]);
    message.channel.send(new Discord.Attachment(ScoutingResult[i-1]));
     fs.writeFileSync("./PetBot/settings/scout/Running.txt", 'false');
     setTimeout(ObtainedMakiCookiesMessage, 4000, ObtainedMakiCookies, message);
  }

  }

}


function getRandom(min, max) {
    return rng.integer({min, max});
  }


function getRarity(RandomScoutRarity) {
  console.log("RSR: "+RandomScoutRarity);
  let Rarity;
    if(RandomScoutRarity <= 1){
      Rarity = 5;
    } else if(RandomScoutRarity <= 5){
      Rarity = "5c";
    } else if(RandomScoutRarity <= 8){
      Rarity = 4;
    } else if(RandomScoutRarity <= 20){
      Rarity = "4c";
    } else if(RandomScoutRarity <= 40){
      Rarity = 3;
    } else if(RandomScoutRarity <= 60){
      Rarity = "3c";
    } else if(RandomScoutRarity <= 75){
      Rarity = 2;
    } else if(RandomScoutRarity <= 90){
      Rarity = "2c";
    } else if(RandomScoutRarity <= 95){
      Rarity = 1;
    } else{
      Rarity = "1c";
    }

    if(Rarity == "5c"){
      Rarity = 5;
    } else if(Rarity == "4c"){
      Rarity = 4;
    } else if(Rarity == "3c"){
      Rarity = 3;
    } else if(Rarity == "2c"){
      Rarity = 2;
    } else if(Rarity == "1c"){
      Rarity = 1;
    }

    console.log("Rarity: "+Rarity);

    return Rarity;
  }





function getServantCE(Rarity){
  let ServantCERarity = getRandom(0, 100);
  //console.log("ServantCERarity: "+ServantCERarity);
  //console.log("PassedRarity: "+Rarity);
        if(Rarity == 2){
          if(ServantCERarity <= 50){
            ServantCE = "Servant";
          } else{
            ServantCE = "CE";
          }
        } else if(Rarity == 1){
          if(ServantCERarity <= 50){
            ServantCE = "Servant";
          } else{
            ServantCE = "CE";
          }
        } else if(Rarity == 3){
          if(ServantCERarity <= 66){
            ServantCE = "Servant";
          } else{
            ServantCE = "CE";
          }
        } else if(Rarity == 4){
          if(ServantCERarity <= 66){
            ServantCE = "Servant";
          } else{
            ServantCE = "CE";
          }
        } else if(Rarity == 5){
          if(ServantCERarity <= 25){
            ServantCE = "Servant";
          } else{
            ServantCE = "CE";
          }
        } else{
          ServantCE = "Servant";
        }
        return ServantCE;
      }

function ObtainedMakiCookiesMessage(Amount, message, LargeScout){
  let UserID = message.author.id;
  message.channel.send("You received "+Amount+" MakiCookies due to the results of this pull.");
  let NewValue = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/MakiCookies.txt");
  NewValue = parseInt(NewValue) + parseInt(Amount);
  fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/MakiCookies.txt",NewValue);

 /* let PetCookiesAnniversarySpecialVar = getRandom(0, 100);
  let PetCookiesObtained = 0;

  if(PetCookiesAnniversarySpecialVar <= 5){
    PetCookiesObtained = 3;
  } else if(PetCookiesAnniversarySpecialVar <= 25){
    PetCookiesObtained = 1;
  }

  message.channel.send("**Anniversary Bonus!** You got "+PetCookiesObtained+" PetCookies!");
  let oNewValue = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCookie.txt");
  oNewValue = parseInt(oNewValue) + parseInt(PetCookiesObtained);
  fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCookie.txt",oNewValue); */

}