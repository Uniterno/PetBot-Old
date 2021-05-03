const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
//const mysql = require('mysql');
const fs = require('fs');
const stringTable = require('string-table');
// vars that I need for some reason


module.exports = class PetCoinsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'butterfly',
            group: 'util',
            guildOnly: true,
            memberName: 'butterfly',
            aliases: ['bf'],
            description: 'Butterfly Campaign.',
            throttling: {
        usages: 1,
        duration: 5
    },
        });
    }

   run(message, args) {


    let UserID = message.author.id;

    let Butterflies = parseInt(fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/Butterflies.txt"));
    let Total = parseInt(fs.readFileSync("./PetBot/settings/PetCoins/103385273387208704/Butterflies.txt")) + parseInt(fs.readFileSync("./PetBot/settings/PetCoins/284443364210769921/Butterflies.txt")) + parseInt(fs.readFileSync("./PetBot/settings/PetCoins/113282276321697792/Butterflies.txt")) + parseInt(fs.readFileSync("./PetBot/settings/PetCoins/350144876077383684/Butterflies.txt")) + parseInt(fs.readFileSync("./PetBot/settings/PetCoins/257191130855243777/Butterflies.txt"));

    message.channel.send("You own " + Butterflies +" Butterflies!\nThe total amount of Butterflies collected by the server is: " + Total);



    }
  }