const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const fs = require('fs');
const rng = require('random-world');


module.exports = class Aureus extends Command {
    constructor(client) {
        super(client, {
            name: 'aureus',
            group: 'util',
            guildOnly: true,
            memberName: 'aureus',
            description: 'Aureus Gacha.',
            throttling: {
        usages: 1,
        duration: 3
    },
        });
    }

   run(message, args) {

  args = message.content.split(' ').slice(1);

  let UserID = message.author.id;
    

      if(fs.existsSync("./PetBot/settings/PetCoins/"+UserID+"/Aureus.txt") == false){
     fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/Aureus.txt","30");
  }

  var MasterUser = JSON.parse(fs.readFileSync("./PetBot/settings/user/master.json"));
  let EquippedDivineItemID = MasterUser[UserID].Inventory.DivineItems.Active;
  let EquippedDivineItem = "None";
  if(EquippedDivineItemID != -1){
    let EquippedDivineItem = MasterUser[UserID].Inventory.DivineItems.Items[EquippedDivineItemID].Name;
  }

  let LastDay = fs.readFileSync("./PetBot/settings/Aureus/LastDay.txt");
  let DateV = new Date();
  let CurrentDate = DateV.getUTCDate() + "/" + (DateV.getUTCMonth()+1) + "/" + DateV.getUTCFullYear();
  let PetCoinValue = fs.readFileSync("./PetBot/settings/Aureus/PetCoinValue.txt");
  let PetTicketValue = fs.readFileSync("./PetBot/settings/Aureus/PetTicketValue.txt");

if(LastDay != CurrentDate){
	if(PetCoinValue*0.1 > 1){
		PetCoinValue = parseInt(PetCoinValue) + (parseInt(getRandom(1, PetCoinValue*0.1)));
	} else{
		PetCoinValue = parseInt(PetCoinValue) + 1;
	}

 fs.writeFileSync("./PetBot/settings/Aureus/PetCoinValue.txt",PetCoinValue);

 if(PetTicketValue*0.1 > 1){
    PetTicketValue = parseInt(PetTicketValue) + (parseInt(getRandom(1, PetTicketValue*0.1)));
  } else{
    PetTicketValue = parseInt(PetTicketValue) + 1;
  }

 fs.writeFileSync("./PetBot/settings/Aureus/PetTicketValue.txt",PetTicketValue);

}

fs.writeFileSync("./PetBot/settings/Aureus/LastDay.txt", CurrentDate);



	PetCoinValue = parseInt(PetCoinValue);
  PetTicketValue = parseInt(PetTicketValue);

  let Pick = args[0];

  if(!!Pick == false){
  	Pick = -1;
  }

  if(Pick != 'buy'){
 	message.channel.send("You can get **"+PetCoinValue+" PetCoins** for 20 Aureus.\nYou can get **"+PetTicketValue+" PetTickets** for 20 Aureus.");
  	return;
  } else{

    let Pick2 = args[1];

    if(!!Pick2 == false){
      message.channel.send("Invalid arguments. Please specify what you want to buy. 1 for PetCoins and 2 for PetTickets.");
      return;
    }

    if(Pick2 == "1"){
      let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/Aureus.txt");
      CurrentAmount = parseInt(CurrentAmount);

      if(CurrentAmount < 20){
        message.channel.send("You don't own enough Aureus.");
        return;
        }

      if(EquippedDivineItem == "Princess of Halloween's Pumpkin"){
        let HalloweenPumpkinChance = getRandom(0, 100);
        if(HalloweenPumpkinChance <= 31){
          message.channel.send("Got a 10% extra PetCoins from The Princess of Halloween's Pumpkin!");
          PetCoinValue = Math.floor(PetCoinValue*1.1);
        }
      }

      fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/Aureus.txt", CurrentAmount-20);

      let PetCoinsAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt");
      PetCoinsAmount = parseInt(PetCoinsAmount);
      fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt", PetCoinsAmount + PetCoinValue);

      message.channel.send("Bought **"+PetCoinValue+" PetCoins** for 20 Aureus.");

      PetCoinValue = parseInt(PetCoinValue) - parseInt(getRandom(1, PetCoinValue*0.5));
      fs.writeFileSync("./PetBot/settings/Aureus/PetCoinValue.txt",PetCoinValue);
      message.channel.send("Prices have been updated. You can now buy **"+PetCoinValue+" PetCoins** for 20 Aureus.");

      /*let ObtainedCandies = 100;
      message.channel.send("You got " + ObtainedCandies + " Candies!");
      let CandiesAmount = parseInt(fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/Candies.txt"));
      fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/Candies.txt", CandiesAmount + ObtainedCandies);*/
    

    }
    else if(Pick2 == "2"){
        let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/Aureus.txt");
        CurrentAmount = parseInt(CurrentAmount);

      if(CurrentAmount < 20){
          message.channel.send("You don't own enough Aureus.");
          return;
        }

        fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/Aureus.txt", CurrentAmount-20);

        if(EquippedDivineItem == "Princess of Halloween's Pumpkin"){
        let HalloweenPumpkinChance = getRandom(0, 100);
        if(HalloweenPumpkinChance <= 31){
          message.channel.send("Got a 10% extra PetTickets from The Princess of Halloween's Pumpkin!");
          PetTicketValue = Math.floor(PetTicketValue*1.1);
        }
      }

        let PetTicketAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt");
        PetTicketAmount = parseInt(PetTicketAmount);
        fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt", PetTicketAmount + PetTicketValue);

        message.channel.send("Bought **"+PetTicketValue+" PetTickets** for 20 Aureus.");

        PetTicketValue = parseInt(PetTicketValue) - parseInt(getRandom(1, PetTicketValue*0.5));
        fs.writeFileSync("./PetBot/settings/Aureus/PetTicketValue.txt",PetTicketValue);
        message.channel.send("Prices have been updated. You can now buy **"+PetTicketValue+" PetTickets** for 20 Aureus.");

        /*let ObtainedCandies = 100;
        message.channel.send("You got " + ObtainedCandies + " Candies!");
        let CandiesAmount = parseInt(fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/Candies.txt"));
        fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/Candies.txt", CandiesAmount + ObtainedCandies);*/
      }
    }
  }
}



function getRandom(min, max) {
    return rng.integer({min, max});
  }
