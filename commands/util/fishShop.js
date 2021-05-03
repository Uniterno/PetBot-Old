const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const fs = require('fs');
const rng = require('random-world');


module.exports = class FishShop extends Command {
    constructor(client) {
        super(client, {
            name: 'fishshop',
            group: 'util',
            guildOnly: true,
            memberName: 'fishshop',
            description: 'Fishing shop..',
            aliases: ['fs'],
            throttling: {
        usages: 1,
        duration: 3
    },
        });
    }

   run(message, args) {

    args = message.content.split(' ').slice(1);

    let UserID = message.author.id;
      

    let User = JSON.parse(fs.readFileSync("./PetBot/settings/fishing/UserData/"+UserID+".json", 'utf8'));

    let Pick = args[0];


    if(!!Pick == false){
    	Pick = -1;
    }


    if(Pick == "Help" || Pick == -1){
      message.channel.send("The list of items you can buy is:\n\nID - Item [Price per unit]\n\n1 - Bait [1]\n2 - RareBait [20]\n3 - MysticBait [50]\n4 - StatusBait [5]\n5 - EscapeGas [10]\n6 - Harpoon [10]");
      return;
    }


    let Amount = parseInt(args[1]);

    if(!!Amount == false || Amount <= 0){
        message.channel.send("Invalid amount.");
        return;
      }


      let Cost = 99999999999;
      let ItemToBuy = "";


    if(Pick == "1" || Pick == "Bait"){

      Cost = 1;
      ItemToBuy = "Bait";

      if(User.CaughtValue < Amount){
        message.channel.send("Not enough CaughtValue.");
        return;
      }
       
      User.CaughtValue = User.CaughtValue - (Cost*Amount);
      User.Bait = parseInt(User.Bait) + parseInt(Amount);
    }

    else if(Pick == "2" || Pick == "RareBait"){

      Cost = 20;
      ItemToBuy = "Rare Bait";

      if(User.CaughtValue < Amount*Cost){
        message.channel.send("Not enough CaughtValue.");
        return;
      }
       
      User.CaughtValue = User.CaughtValue - (Cost*Amount);
      User.RareBait = parseInt(User.RareBait) + parseInt(Amount);
    }

    else if(Pick == "3" || Pick == "MysticBait"){

      Cost = 50;
      ItemToBuy = "Mystic Bait";


      if(User.CaughtValue < Amount*Cost){
        message.channel.send("Not enough CaughtValue.");
        return;
      }
       
      User.CaughtValue = User.CaughtValue - (Cost*Amount);
      User.MysticBait = parseInt(User.MysticBait) + parseInt(Amount);
    }

    else if(Pick == "4" || Pick == "StatusBait"){

      Cost = 5;
      ItemToBuy = "Status Bait";


      if(User.CaughtValue < Amount*Cost){
        message.channel.send("Not enough CaughtValue.");
        return;
      }
       
      User.CaughtValue = User.CaughtValue - (Cost*Amount);
      User.StatusBait = parseInt(User.StatusBait) + parseInt(Amount);
    }

    else if(Pick == "5" || Pick == "EscapeGas"){

      Cost = 10;
      ItemToBuy = "Escape Gas";


      if(User.CaughtValue < Amount*Cost){
        message.channel.send("Not enough CaughtValue.");
        return;
      }
       
      User.CaughtValue = User.CaughtValue - (Cost*Amount);
      User.EscapeGas = parseInt(User.EscapeGas) + parseInt(Amount);
    }

    else if(Pick == "6" || Pick == "Harpoon"){

      Cost = 10;
      ItemToBuy = "Harpoon";


      if(User.CaughtValue < Amount*Cost){
        message.channel.send("Not enough CaughtValue.");
        return;
      }
       
      User.CaughtValue = User.CaughtValue - (Cost*Amount);
      User.Harpoon = parseInt(User.Harpoon) + parseInt(Amount);
    } else{

      message.channel.send("Invalid argument.");
      //message.channel.send("Invalid string. Starting debugging.\nPick = " + Pick+"\nUser.Spent = " + User.Spent + "\nCost = " + Cost + "\nAmount = " + Amount + "\n");
      return;

    }


    if(!!User.Spent == false){
      User.Spent = 0;
    }

    User.Spent = User.Spent + Cost*Amount;

    let RNG = 0;

    //message.channel.send("User.Spent = " + User.Spent + "\nRNG = " + RNG);

    while(User.Spent >= 10000){
      User.Spent = User.Spent - 10000;

      RNG = getRandom(0, 100);

      if(RNG == 1){
        message.channel.send("You must be kidding, right!? Today is your lucky day, you won **100 PetStars**!");

        let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetStars.txt");
        CurrentAmount = parseInt(CurrentAmount) + 100;
        fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetStars.txt", CurrentAmount);

      } else if(RNG <= 10){
        message.channel.send("Winner! While buying useless fish stuff, you won **10 PetStars**!");

        let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetStars.txt");
        CurrentAmount = parseInt(CurrentAmount) + 10;
        fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetStars.txt", CurrentAmount);


      } else if(RNG <= 15){
        message.channel.send("Woah, winner! While buying, a stranger gifted you **5 PetCookies**!");

        let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCookies.txt");
        CurrentAmount = parseInt(CurrentAmount) + 5;
        fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCookies.txt", CurrentAmount);


      } else if(RNG <= 45){
        message.channel.send("While buying useless fish stuff, you found **1000 PetCoins**!");


        let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt");
        CurrentAmount = parseInt(CurrentAmount) + 1000;
        fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt", CurrentAmount);


      } else {
        message.channel.send("Thanks to your continued purchases, you were given **500 PetCoins**!");

        let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt");
        CurrentAmount = parseInt(CurrentAmount) + 500;
        fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt", CurrentAmount);


      }
    }



   let UserJSON = JSON.stringify(User, null, "\t");
   fs.writeFileSync("./PetBot/settings/fishing/UserData/"+UserID+".json",UserJSON);

   message.channel.send("You bought " + Amount + " " + ItemToBuy + " for " + Amount*Cost + " CaughtValue.");








  }
}



function getRandom(min, max) {
    return rng.integer({min, max});
  }
