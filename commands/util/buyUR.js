const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const Help = require('./OOP/help');
const fs = require('fs');

module.exports = class BuyUR extends Command {
    constructor(client) {
        super(client, {
            name: 'buyur',
            group: 'util',
            guildOnly: true,
            memberName: 'buyur',
            description: 'Used for purchase of UR Tickets.',
            examples: [''],
            throttling: {
        usages: 1,
        duration: 3
    },
        });
    }

   run(message, args) {

  args = message.content.split(' ').slice(1);

  message.channel.send("Promotion finished.");
  return;

  let UserID = message.author.id;
    

      if(fs.existsSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt") == false){
     fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt","3000");
  }
  if(fs.existsSync("./PetBot/settings/PetCoins/"+UserID+"/SRTicket.txt") == false){
     fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/SRTicket.txt","0");
  }
  if(fs.existsSync("./PetBot/settings/PetCoins/"+UserID+"/SSRTicket.txt") == false){
     fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/SSRTicket.txt","0");
  }
  if(fs.existsSync("./PetBot/settings/PetCoins/"+UserID+"/URTicket.txt") == false){
     fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/URTicket.txt","1");
  }


  let Amount = args[0];
  if(!!args[0] == false){
    Amount = 1;
  }

  Amount = parseInt(Amount);

  console.log(Amount);
     let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt");
     CurrentAmount = parseInt(CurrentAmount);

    if(CurrentAmount < Amount*3500){
      message.channel.send("You don't own enough PetCoins");
      return;
      }

     
    
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt", CurrentAmount-(Amount*3500));
    message.channel.send("Purchased "+Amount+" UR Tickets for "+(Amount*3500)+" PetCoins");

    let URCAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/URTicket.txt");
    URCAmount = parseInt(URCAmount);
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/URTicket.txt", URCAmount + (Amount));

    }
}