const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const fs = require('fs');
const rng = require('random-world');
const RpcClient = require('node-json-rpc2').Client;
var Settings = JSON.parse(fs.readFileSync("./PetBot/settings/master.json"));


module.exports = class Merchant extends Command {
    constructor(client) {
        super(client, {
            name: 'merchant',
            group: 'util',
            guildOnly: true,
            memberName: 'merchant',
            description: 'Merchant (SIFAC).',
            throttling: {
        usages: 1,
        duration: 3
    },
        });
    }


  run(message, args) {

    var RandomClient = new RpcClient({
      protocol:'https',//Optional. Will be http by default
      host: 'api.random.org',
      path: '/json-rpc/2/invoke',
      port:443,
      method:'POST'
    });



    args = message.content.split(' ').slice(1);
    let UserID = message.author.id;
    var UserMaster = JSON.parse(fs.readFileSync("./PetBot/settings/user/master.json"));
    let DateV = new Date();
    let CurrentDate = DateV.getUTCDate() + "/" + (DateV.getUTCMonth()+1) + "/" + DateV.getUTCFullYear();
    Settings = JSON.parse(fs.readFileSync("./PetBot/settings/master.json"));

    let BonusIsAvailable = Settings.SIFAC.Merchant.Bonus.isAvailable;

    if(Settings.SIFAC.Merchant.LastDay != CurrentDate){
  
      let CardsArray = JSON.parse(fs.readFileSync("./PetBot/settings/SIFAC/cards.json"));
      let RandomNumber = getRandom(-1, CardsArray.results.length-1);
      let RandomNumberBonus = getRandom(-1, CardsArray.results.length-1);

      /*console.log(RandomNumber);
      console.log(CardsArray);
      console.log(CardsArray.results[RandomNumber]); */

      Settings.SIFAC.Merchant.Buy.Card = CardsArray.results[RandomNumber].member + " (" + CardsArray.results[RandomNumber].costume + ") [" + CardsArray.results[RandomNumber].rarity + "]";
      Settings.SIFAC.Merchant.Bonus.Buy.Card = CardsArray.results[RandomNumberBonus].member + " (" + CardsArray.results[RandomNumberBonus].costume + ") [" + CardsArray.results[RandomNumberBonus].rarity + "]";


      let Currencies = ["Delimiter", "Aureus", "BlueTicket", "PetCoins", "HLSY", "MakiCookies", "PetCookies", "PetStars", "PetTicket", "PickA3Stars", "PickA4Stars", "SRTicket", "SSRTicket", "URTicket"];

      let num = getRandom(0, Currencies.length-1);
      let numBonus = getRandom(0, Currencies.length-1);
      console.log(num);
      console.log("Number is: " + num);

      
      Settings.SIFAC.Merchant.Buy.Currency = Currencies[num];
      Settings.SIFAC.Merchant.Bonus.Buy.Currency = Currencies[numBonus];

      let UpdatedJSON2 = JSON.stringify(Settings, null, "\t");
      fs.writeFileSync("./PetBot/settings/master.json",UpdatedJSON2);

      if(Settings.SIFAC.Merchant.Buy.Currency == "Error" || Settings.SIFAC.Merchant.Bonus.Buy.Currency == "Error"){
        message.channel.send("An unknown issue has occured!");
        return;
      }

      if(Settings.SIFAC.Merchant.Buy.Currency == "Delimiter" || Settings.SIFAC.Merchant.Bonus.Buy.Currency == "Delimiter"){
        message.channel.send("Error: A buy option has received Currencies[0] == 'Delimiter' as result.");
        return;
      }

      let RandomNumberSell = getRandom(-1, CardsArray.results.length-1);
      while(RandomNumberSell == RandomNumber){
        RandomNumberSell = getRandom(-1, CardsArray.results.length-1);
      }

      let RandomNumberSellBonus = getRandom(-1, CardsArray.results.length-1);
      while(RandomNumberSellBonus == RandomNumberBonus){
        RandomNumberSellBonus = getRandom(-1, CardsArray.results.length-1);
      }

      Settings.SIFAC.Merchant.Sell.Card = CardsArray.results[RandomNumberSell].member + " (" + CardsArray.results[RandomNumberSell].costume + ") [" + CardsArray.results[RandomNumberSell].rarity + "]";
      Settings.SIFAC.Merchant.Bonus.Sell.Card = CardsArray.results[RandomNumberSellBonus].member + " (" + CardsArray.results[RandomNumberSellBonus].costume + ") [" + CardsArray.results[RandomNumberSellBonus].rarity + "]";

      num = getRandom(0, Currencies.length-1);
      numBonus = getRandom(0, Currencies.length-1);
      console.log(num);
      console.log("Number is: " + num);

      Settings.SIFAC.Merchant.Sell.Currency = Currencies[num];
      Settings.SIFAC.Merchant.Bonus.Sell.Currency = Currencies[numBonus];



      if(Settings.SIFAC.Merchant.Sell.Currency == "Error" || Settings.SIFAC.Merchant.Bonus.Sell.Currency == "Error"){
        message.channel.send("An unknown issue has occured!");
        return;
      }

      if(Settings.SIFAC.Merchant.Sell.Currency == "Delimiter" || Settings.SIFAC.Merchant.Bonus.Sell.Currency == "Delimiter"){
        message.channel.send("Error: A sell option has received Currencies[0] == 'Delimiter' as result.");
        return;
      }

      let Currency = Settings.SIFAC.Merchant.Buy.Currency;
      let Exchange = "Buy";

      let Value = 1;
      if(Currency == "Aureus"){
        if(Exchange == "Sell"){
          Value = getRandom(1, 30);
        } else if(Exchange == "Buy"){
          Value = getRandom(5, 40);
        }
      } else if(Currency == "BlueTicket"){
        if(Exchange == "Sell"){
          Value = getRandom(3, 50);
        } else if(Exchange == "Buy"){
          Value = getRandom(3, 100);
        }
      } else if(Currency == "PetCoins"){
        if(Exchange == "Sell"){
          Value = getRandom(1000, 7000);
        } else if(Exchange == "Buy"){
          Value = getRandom(1000, 18950);
        }
      } else if(Currency == "HLSY"){
        if(Exchange == "Sell"){
          Value = getRandom(0, 1);
        } else if(Exchange == "Buy"){
          Value = getRandom(0, 5);
        }
      } else if(Currency == "MakiCookies"){
        if(Exchange == "Sell"){
          Value = getRandom(20, 100);
        } else if(Exchange == "Buy"){
          Value = getRandom(20, 200);
        }
      } else if(Currency == "PetCookies"){
        if(Exchange == "Sell"){
          Value = getRandom(2, 5);
        } else if(Exchange == "Buy"){
          Value = getRandom(5, 15);
        }
      } else if(Currency == "PetStars"){
        if(Exchange == "Sell"){
          Value = getRandom(10, 50);
        } else if(Exchange == "Buy"){
          Value = getRandom(25, 50);
        }
      } else if(Currency == "PetTicket"){
        if(Exchange == "Sell"){
          Value = getRandom(5, 150);
        } else if(Exchange == "Buy"){
          Value = getRandom(150, 200);
        }
      } else if(Currency == "PickA3Stars"){
        if(Exchange == "Sell"){
          Value = getRandom(0, 2);
        } else if(Exchange == "Buy"){
          Value = getRandom(2, 4);
        }
      } else if(Currency == "PickA4Stars"){
        if(Exchange == "Sell"){
          Value = getRandom(0, 1);
        } else if(Exchange == "Buy"){
          Value = getRandom(0, 1);
        }
      } else if(Currency == "SRTicket"){
        if(Exchange == "Sell"){
          Value = getRandom(0, 5);
        } else if(Exchange == "Buy"){
          Value = getRandom(1, 6);
        }
      } else if(Currency == "SSRTicket"){
        if(Exchange == "Sell"){
          Value = getRandom(0, 3);
        } else if(Exchange == "Buy"){
          Value = getRandom(1, 5);
        }
      } else if(Currency == "URTicket"){
        if(Exchange == "Sell"){
          Value = getRandom(0, 2);
        } else if(Exchange == "Buy"){
          Value = getRandom(1, 4);
        }
      } else{
        Value = "Error"
      }

      Value = Math.round(Value*Settings.SIFAC.Merchant.Sales.Buy);
      console.log("Buy value has changed to: " + Value);

      if(Value == 0){
        Value = 1;
      }

      Settings.SIFAC.Merchant.Buy.Rate = Value;
      Currency = Settings.SIFAC.Merchant.Sell.Currency;

      Exchange = "Sell";

      Value = 1;
      if(Currency == "Aureus"){
        if(Exchange == "Sell"){
          Value = getRandom(1, 30);
        } else if(Exchange == "Buy"){
          Value = getRandom(5, 40);
        }
      } else if(Currency == "BlueTicket"){
        if(Exchange == "Sell"){
          Value = getRandom(3, 50);
        } else if(Exchange == "Buy"){
          Value = getRandom(3, 100);
        }
      } else if(Currency == "PetCoins"){
        if(Exchange == "Sell"){
          Value = getRandom(1000, 7000);
        } else if(Exchange == "Buy"){
          Value = getRandom(1000, 18950);
        }
      } else if(Currency == "HLSY"){
        if(Exchange == "Sell"){
          Value = getRandom(0, 1);
        } else if(Exchange == "Buy"){
          Value = getRandom(0, 5);
        }
      } else if(Currency == "MakiCookies"){
        if(Exchange == "Sell"){
          Value = getRandom(20, 100);
        } else if(Exchange == "Buy"){
          Value = getRandom(20, 200);
        }
      } else if(Currency == "PetCookies"){
        if(Exchange == "Sell"){
          Value = getRandom(2, 5);
        } else if(Exchange == "Buy"){
          Value = getRandom(5, 15);
        }
      } else if(Currency == "PetStars"){
        if(Exchange == "Sell"){
          Value = getRandom(10, 50);
        } else if(Exchange == "Buy"){
          Value = getRandom(25, 50);
        }
      } else if(Currency == "PetTicket"){
        if(Exchange == "Sell"){
          Value = getRandom(5, 150);
        } else if(Exchange == "Buy"){
          Value = getRandom(150, 200);
        }
      } else if(Currency == "PickA3Stars"){
        if(Exchange == "Sell"){
          Value = getRandom(0, 2);
        } else if(Exchange == "Buy"){
          Value = getRandom(2, 4);
        }
      } else if(Currency == "PickA4Stars"){
        if(Exchange == "Sell"){
          Value = getRandom(0, 1);
        } else if(Exchange == "Buy"){
          Value = getRandom(0, 1);
        }
      } else if(Currency == "SRTicket"){
        if(Exchange == "Sell"){
          Value = getRandom(0, 5);
        } else if(Exchange == "Buy"){
          Value = getRandom(1, 6);
        }
      } else if(Currency == "SSRTicket"){
        if(Exchange == "Sell"){
          Value = getRandom(0, 3);
        } else if(Exchange == "Buy"){
          Value = getRandom(1, 5);
        }
      } else if(Currency == "URTicket"){
        if(Exchange == "Sell"){
          Value = getRandom(0, 2);
        } else if(Exchange == "Buy"){
          Value = getRandom(1, 4);
        }
      } else{
        Value = "Error"
      }


      console.log("Sell value is: " + Value);
      Value = Math.round(Value*Settings.SIFAC.Merchant.Sales.Sell);
      console.log("Sell value changed to: " + Value);

      if(Value == 0){
        Value = 1;
      }
      
      Settings.SIFAC.Merchant.Sell.Rate = Value;
      Currency = Settings.SIFAC.Merchant.Bonus.Buy.Currency;

      Exchange = "Buy";

      Value = 1;
      if(Currency == "Aureus"){
        if(Exchange == "Sell"){
          Value = getRandom(1, 30);
        } else if(Exchange == "Buy"){
          Value = getRandom(5, 40);
        }
      } else if(Currency == "BlueTicket"){
        if(Exchange == "Sell"){
          Value = getRandom(3, 50);
        } else if(Exchange == "Buy"){
          Value = getRandom(3, 100);
        }
      } else if(Currency == "PetCoins"){
        if(Exchange == "Sell"){
          Value = getRandom(1000, 7000);
        } else if(Exchange == "Buy"){
          Value = getRandom(1000, 18950);
        }
      } else if(Currency == "HLSY"){
        if(Exchange == "Sell"){
          Value = getRandom(0, 1);
        } else if(Exchange == "Buy"){
          Value = getRandom(0, 5);
        }
      } else if(Currency == "MakiCookies"){
        if(Exchange == "Sell"){
          Value = getRandom(20, 100);
        } else if(Exchange == "Buy"){
          Value = getRandom(20, 200);
        }
      } else if(Currency == "PetCookies"){
        if(Exchange == "Sell"){
          Value = getRandom(2, 5);
        } else if(Exchange == "Buy"){
          Value = getRandom(5, 15);
        }
      } else if(Currency == "PetStars"){
        if(Exchange == "Sell"){
          Value = getRandom(10, 50);
        } else if(Exchange == "Buy"){
          Value = getRandom(25, 50);
        }
      } else if(Currency == "PetTicket"){
        if(Exchange == "Sell"){
          Value = getRandom(5, 150);
        } else if(Exchange == "Buy"){
          Value = getRandom(150, 200);
        }
      } else if(Currency == "PickA3Stars"){
        if(Exchange == "Sell"){
          Value = getRandom(0, 2);
        } else if(Exchange == "Buy"){
          Value = getRandom(2, 4);
        }
      } else if(Currency == "PickA4Stars"){
        if(Exchange == "Sell"){
          Value = getRandom(0, 1);
        } else if(Exchange == "Buy"){
          Value = getRandom(0, 1);
        }
      } else if(Currency == "SRTicket"){
        if(Exchange == "Sell"){
          Value = getRandom(0, 5);
        } else if(Exchange == "Buy"){
          Value = getRandom(1, 6);
        }
      } else if(Currency == "SSRTicket"){
        if(Exchange == "Sell"){
          Value = getRandom(0, 3);
        } else if(Exchange == "Buy"){
          Value = getRandom(1, 5);
        }
      } else if(Currency == "URTicket"){
        if(Exchange == "Sell"){
          Value = getRandom(0, 2);
        } else if(Exchange == "Buy"){
          Value = getRandom(1, 4);
        }
      } else{
        Value = "Error"
      }
      
      Settings.SIFAC.Merchant.Bonus.Buy.Rate = Value;

      Value = Math.round(Value*Settings.SIFAC.Merchant.Sales.BuyBonus);
      if(Value == 0){
        Value = 1;
      }

      Currency = Settings.SIFAC.Merchant.Bonus.Sell.Currency;

      Exchange = "Sell";

      Value = 1;

      if(Currency == "Aureus"){
        if(Exchange == "Sell"){
          Value = getRandom(1, 30);
        } else if(Exchange == "Buy"){
          Value = getRandom(5, 40);
        }
      } else if(Currency == "BlueTicket"){
        if(Exchange == "Sell"){
          Value = getRandom(3, 50);
        } else if(Exchange == "Buy"){
          Value = getRandom(3, 100);
        }
      } else if(Currency == "PetCoins"){
        if(Exchange == "Sell"){
          Value = getRandom(1000, 7000);
        } else if(Exchange == "Buy"){
          Value = getRandom(1000, 18950);
        }
      } else if(Currency == "HLSY"){
        if(Exchange == "Sell"){
          Value = getRandom(0, 1);
        } else if(Exchange == "Buy"){
          Value = getRandom(0, 5);
        }
      } else if(Currency == "MakiCookies"){
        if(Exchange == "Sell"){
          Value = getRandom(20, 100);
        } else if(Exchange == "Buy"){
          Value = getRandom(20, 200);
        }
      } else if(Currency == "PetCookies"){
        if(Exchange == "Sell"){
          Value = getRandom(2, 5);
        } else if(Exchange == "Buy"){
          Value = getRandom(5, 15);
        }
      } else if(Currency == "PetStars"){
        if(Exchange == "Sell"){
          Value = getRandom(10, 50);
        } else if(Exchange == "Buy"){
          Value = getRandom(25, 50);
        }
      } else if(Currency == "PetTicket"){
        if(Exchange == "Sell"){
          Value = getRandom(5, 150);
        } else if(Exchange == "Buy"){
          Value = getRandom(150, 200);
        }
      } else if(Currency == "PickA3Stars"){
        if(Exchange == "Sell"){
          Value = getRandom(0, 2);
        } else if(Exchange == "Buy"){
          Value = getRandom(2, 4);
        }
      } else if(Currency == "PickA4Stars"){
        if(Exchange == "Sell"){
          Value = getRandom(0, 1);
        } else if(Exchange == "Buy"){
          Value = getRandom(0, 1);
        }
      } else if(Currency == "SRTicket"){
        if(Exchange == "Sell"){
          Value = getRandom(0, 5);
        } else if(Exchange == "Buy"){
          Value = getRandom(1, 6);
        }
      } else if(Currency == "SSRTicket"){
        if(Exchange == "Sell"){
          Value = getRandom(0, 3);
        } else if(Exchange == "Buy"){
          Value = getRandom(1, 5);
        }
      } else if(Currency == "URTicket"){
        if(Exchange == "Sell"){
          Value = getRandom(0, 2);
        } else if(Exchange == "Buy"){
          Value = getRandom(1, 4);
        }
      } else{
        Value = "Error"
      }
      
      console.log("SellBonus value is: " + Value);
      Value = Math.round(Value*Settings.SIFAC.Merchant.Sales.SellBonus);
      console.log("SellBonus value changed to: " + Value);

      if(Value == 0){
        Value = 1;
      }

      Settings.SIFAC.Merchant.Bonus.Sell.Rate = Value;

    }

    Settings.SIFAC.Merchant.LastDay = CurrentDate;

    let UpdatedJSON2 = JSON.stringify(Settings, null, "\t");
    fs.writeFileSync("./PetBot/settings/master.json",UpdatedJSON2);

    let Pick = args[0];

    if(!!Pick == false){
      Pick = -1;
    }

    if(Pick != 'buy' && Pick != "sell" && Pick != 'buybonus' && Pick != 'sellbonus'){
        if(BonusIsAvailable){
          message.channel.send("The Merchant stock for today is:\n> You can buy " + Settings.SIFAC.Merchant.Buy.Card + " ("+Settings.SIFAC.Merchant.Buy.Rate + " " + Settings.SIFAC.Merchant.Buy.Currency + ")\n> You can sell " + Settings.SIFAC.Merchant.Sell.Card + " ("+Settings.SIFAC.Merchant.Sell.Rate + " " + Settings.SIFAC.Merchant.Sell.Currency + ")\n> [BONUS] You can buy " + Settings.SIFAC.Merchant.Bonus.Buy.Card + " ("+Settings.SIFAC.Merchant.Bonus.Buy.Rate + " " + Settings.SIFAC.Merchant.Bonus.Buy.Currency + ")\n> [BONUS] You can sell " + Settings.SIFAC.Merchant.Bonus.Sell.Card + " ("+Settings.SIFAC.Merchant.Bonus.Sell.Rate + " " + Settings.SIFAC.Merchant.Bonus.Sell.Currency + ")");
        } else{
          message.channel.send("The Merchant stock for today is:\n> You can buy " + Settings.SIFAC.Merchant.Buy.Card + " ("+Settings.SIFAC.Merchant.Buy.Rate + " " + Settings.SIFAC.Merchant.Buy.Currency + ")\n> You can sell " + Settings.SIFAC.Merchant.Sell.Card + " ("+Settings.SIFAC.Merchant.Sell.Rate + " " + Settings.SIFAC.Merchant.Sell.Currency + ")");
        }
        if(Settings.SIFAC.Merchant.Sales.Notice){
          message.channel.send("Sale going on right now! The values shown above are after applying sale amount.");
        }

        return;
    } else{
      if(Pick == "buy"){
         let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/"+Settings.SIFAC.Merchant.Buy.Currency+".txt");

        if(CurrentAmount - Settings.SIFAC.Merchant.Buy.Rate < 0){
          message.channel.send("You don't have enough " + Settings.SIFAC.Merchant.Buy.Currency + " to perform this action.");
          return;
        } else{
          fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/"+Settings.SIFAC.Merchant.Buy.Currency+".txt", CurrentAmount - Settings.SIFAC.Merchant.Buy.Rate); 
        }

        UserMaster[UserID].SIFAC.Inventory[UserMaster[UserID].SIFAC.Inventory.length] = Settings.SIFAC.Merchant.Buy.Card;

        message.channel.send("Succesfully bought this card!");

        /*let ObtainedCandies = getRandom(0, 10);
        message.channel.send("You got " + ObtainedCandies + " Candies!");
        let CandiesAmount = parseInt(fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/Candies.txt"));
        fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/Candies.txt", CandiesAmount + ObtainedCandies);*/

      } else if(Pick == "sell"){
        let InventoryIndex = UserMaster[UserID].SIFAC.Inventory.findIndex(card => card == Settings.SIFAC.Merchant.Sell.Card);
        if(InventoryIndex == -1){
          message.channel.send("You don't own this card.");
          return;
        }

        UserMaster[UserID].SIFAC.Inventory.splice(InventoryIndex, 1);

        let CurrentAmount = parseInt(fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/"+Settings.SIFAC.Merchant.Sell.Currency+".txt"));
        CurrentAmount += parseInt(Settings.SIFAC.Merchant.Sell.Rate);
        fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/"+Settings.SIFAC.Merchant.Sell.Currency+".txt", CurrentAmount)

        message.channel.send("Succesfully sold this card!");

        /*let ObtainedCandies = getRandom(0, 10);
        message.channel.send("You got " + ObtainedCandies + " Candies!");
        let CandiesAmount = parseInt(fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/Candies.txt"));
        fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/Candies.txt", CandiesAmount + ObtainedCandies);*/
      } else if(Pick == "buybonus"){
        if(!BonusIsAvailable){
          message.channel.send("Bonus is not available right now!");
          return;
        }
        
        let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/"+Settings.SIFAC.Merchant.Bonus.Buy.Currency+".txt");

        if(CurrentAmount - Settings.SIFAC.Merchant.Bonus.Buy.Rate < 0){
          message.channel.send("You don't have enough " + Settings.SIFAC.Merchant.Bonus.Buy.Currency + " to perform this action.");
          return;
        } else{
          fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/"+Settings.SIFAC.Merchant.Bonus.Buy.Currency+".txt", CurrentAmount - Settings.SIFAC.Merchant.Bonus.Buy.Rate); 
        }

        UserMaster[UserID].SIFAC.Inventory[UserMaster[UserID].SIFAC.Inventory.length] = Settings.SIFAC.Merchant.Bonus.Buy.Card;

        message.channel.send("Succesfully bought this card!");

        /*let ObtainedCandies = getRandom(0, 10);
        message.channel.send("You got " + ObtainedCandies + " Candies!");
        let CandiesAmount = parseInt(fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/Candies.txt"));
        fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/Candies.txt", CandiesAmount + ObtainedCandies);*/

      } else if(Pick == "sellbonus"){
        if(!BonusIsAvailable){
          message.channel.send("Bonus is not available right now!");
          return;
        }
        
        let InventoryIndex = UserMaster[UserID].SIFAC.Inventory.findIndex(card => card == Settings.SIFAC.Merchant.Bonus.Sell.Card);
        
        if(InventoryIndex == -1){
          message.channel.send("You don't own this card.");
          return;
        }

        UserMaster[UserID].SIFAC.Inventory.splice(InventoryIndex, 1);

        let CurrentAmount = parseInt(fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/"+Settings.SIFAC.Merchant.Bonus.Sell.Currency+".txt"));
        CurrentAmount += parseInt(Settings.SIFAC.Merchant.Bonus.Sell.Rate);
        fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/"+Settings.SIFAC.Merchant.Bonus.Sell.Currency+".txt", CurrentAmount)

        message.channel.send("Succesfully sold this card!");

        /*let ObtainedCandies = getRandom(0, 10);
        message.channel.send("You got " + ObtainedCandies + " Candies!");
        let CandiesAmount = parseInt(fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/Candies.txt"));
        fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/Candies.txt", CandiesAmount + ObtainedCandies);*/
      }

      let UpdatedJSON = JSON.stringify(UserMaster, null, "\t");
      fs.writeFileSync("./PetBot/settings/user/master.json",UpdatedJSON);
    }
  }
}



function getRandom(min, max) {
    return rng.integer({min, max});
  }


const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}