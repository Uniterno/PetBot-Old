const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
//const mysql = require('mysql');
const fs = require('fs');
const stringTable = require('string-table');
// vars that I need for some reason


module.exports = class BondCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'bond',
            group: 'util',
            guildOnly: true,
            memberName: 'bond',
            description: 'Bond stats for SIFAS and Challenge Live events.',
            throttling: {
        usages: 1,
        duration: 1
    },
        });
    }

   run(message, args) {


    let UserID = message.author.id;
    let UserMaster = JSON.parse(fs.readFileSync("./PetBot/settings/user/master.json"));

    if(!!UserMaster[UserID].SIFAS == false){
      message.channel.send("Your user file may be corrupted and bond data couldn't be loaded.");
      return;
    }

  let Bond = UserMaster[UserID].SIFAS.Bond; 


  message.channel.send("Your bond level is the following: \n\n**SIFAS**\n\nHonoka: " + Bond["Honoka"] + "\nKotori: " + Bond["Kotori"] + "\nAyumu: " + Bond["Ayumu"] + "\nYou: " + Bond["You"] + "\nChika: " + Bond["Chika"] + "\n\n**Bandori**\n\n" + "Ran: " + Bond["Ran"] + "\nHimari: " + Bond["Himari"] + "\nTomoe: " + Bond["Tomoe"] + "\nSayo: " + Bond["Sayo"] + "\nAko: " + Bond["Ako"]);

  }
}

