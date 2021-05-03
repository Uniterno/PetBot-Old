const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const Help = require('./OOP/help');
const fs = require('fs');

module.exports = class BuyUR extends Command {
    constructor(client) {
        super(client, {
            name: 'hlsy',
            group: 'util',
            guildOnly: true,
            memberName: 'hlsy',
            description: 'Used for purchase of Happy! Lucky! Smile! Yay!',
            aliases: ['hlsy'],
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

  if(fs.existsSync("./PetBot/settings/PetCoins/"+UserID+"/HLSY.txt") == false){
     fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/HLSY.txt","0");
  }


  let Amount = args[0];
  let Payment = args[1];

  if(!!args[0] == false){
    Amount = 1;
  }

  if(Amount % 1 != 0){
    message.channel.send("Amount needs to be a number.");
    return;
  }

  if(Amount < 0){
    message.channel.send("Can't sell HLSY.");
    return;
  }

  if(!!args[1] == false){
    Payment = "MakiCookies";
  }

  if(Payment != "MakiCookies" && Payment != "PetCoins" && Payment != "Aureus"){
    message.channel.send("Invalid.");
    return;
  }

  Amount = parseInt(Amount);

  console.log(Amount);

  if(Payment == "MakiCookies"){
    let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/MakiCookies.txt");
    CurrentAmount = parseInt(CurrentAmount);

    if(CurrentAmount < Amount*200){
      message.channel.send("You don't own enough MakiCookies!");
      return;
    }
    
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/MakiCookies.txt", CurrentAmount-(Amount*200));
    message.channel.send("Purchased "+Amount+" Happy! Lucky! Smile! Yay! for "+(Amount*200)+" MakiCookies.");
  } else if(Payment == "PetCoins"){
    let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt");
    CurrentAmount = parseInt(CurrentAmount);

    if(CurrentAmount < Amount*50000){
      message.channel.send("You don't own enough PetCoins!");
      return;
    }
    
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt", CurrentAmount-(Amount*50000));
    message.channel.send("Purchased "+Amount+" Happy! Lucky! Smile! Yay! for "+(Amount*50000)+" PetCoins.");
  } else if(Payment == "Aureus"){
    let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/Aureus.txt");
    CurrentAmount = parseInt(CurrentAmount);

    if(CurrentAmount < Amount*100){
      message.channel.send("You don't own enough Aureus!");
      return;
    }
    
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/Aureus.txt", CurrentAmount-(Amount*100));
    message.channel.send("Purchased "+Amount+" Happy! Lucky! Smile! Yay! for "+(Amount*100)+" Aureus.");
  } else{
    message.channel.send("Invalid payment method. Use MakiCookies (default), PetCoins or Aureus.");
    return;
  }


  
    let HLSYAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/HLSY.txt");
    HLSYAmount = parseInt(HLSYAmount);
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/HLSY.txt", HLSYAmount + (Amount));

    }
}