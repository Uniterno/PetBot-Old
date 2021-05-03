const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const Help = require('./OOP/help');
const fs = require('fs');

module.exports = class BuyUR extends Command {
    constructor(client) {
        super(client, {
            name: 'buypt',
            group: 'util',
            guildOnly: true,
            memberName: 'buypt',
            description: 'Used for purchase of PetTickets.',
            aliases: ['bpt'],
            throttling: {
        usages: 1,
        duration: 3
    },
        });
    }

   run(message, args) {

  args = message.content.split(' ').slice(1);


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
  if(fs.existsSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt") == false){
     fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt","0");
  }


  let Amount = args[0];
  if(!!args[0] == false){
    Amount = 1;
  }

  if(isNaN(Amount)){
    message.channel.send("Invalid amount to buy.");
    return;
  }



  Amount = parseInt(Amount);

  console.log(Amount);
     let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt");
     CurrentAmount = parseInt(CurrentAmount);

    if(CurrentAmount < Amount*20*1){
      message.channel.send("You don't own enough PetCoins");
      return;
      }

    if(Amount < 0){
    Amount = Amount*-1;
    CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt");
    CurrentAmount = parseInt(CurrentAmount);

    if(CurrentAmount < Amount){
      message.channel.send("You don't own enough PetTickets.");
      return;
    }

      fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt", CurrentAmount-(Amount));
    message.channel.send("Purchased "+(Amount*10)+" PetCoins for "+Amount+" PetTickets.");

    let PTAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt");
    PTAmount = parseInt(PTAmount);
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt", PTAmount + (Amount*10));


    /*let ObtainedCandies = Math.abs(Amount);
    message.channel.send("You got " + ObtainedCandies + " Candies!");
    let CandiesAmount = parseInt(fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/Candies.txt"));
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/Candies.txt", CandiesAmount + ObtainedCandies);*/

    return;
  }

    
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt", CurrentAmount-(Amount*20*1));
    message.channel.send("Purchased "+Amount+" PetTickets for "+(Amount*20*1)+" PetCoins.");

    let PTAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt");
    PTAmount = parseInt(PTAmount);
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt", PTAmount + (Amount));

    /*let ObtainedCandies = Math.abs(Amount);
    message.channel.send("You got " + ObtainedCandies + " Candies!");
    let CandiesAmount = parseInt(fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/Candies.txt"));
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/Candies.txt", CandiesAmount + ObtainedCandies);*/

    }
}