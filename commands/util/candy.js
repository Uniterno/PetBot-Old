const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
//const mysql = require('mysql');
const fs = require('fs');
const stringTable = require('string-table');
// vars that I need for some reason


module.exports = class CandiesCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'candy',
            group: 'util',
            guildOnly: true,
            memberName: 'candy',
            aliases: ['candies'],
            description: 'Halloween 2019 Campaign.',
            throttling: {
        usages: 1,
        duration: 5
    },
        });
    }

   run(message, args) {


    let UserID = message.author.id;

    let Candies = parseInt(fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/Candies.txt"));
    let Total = parseInt(fs.readFileSync("./PetBot/settings/PetCoins/103385273387208704/Candies.txt")) + parseInt(fs.readFileSync("./PetBot/settings/PetCoins/284443364210769921/Candies.txt")) + parseInt(fs.readFileSync("./PetBot/settings/PetCoins/113282276321697792/Candies.txt")) + parseInt(fs.readFileSync("./PetBot/settings/PetCoins/350144876077383684/Candies.txt")) + parseInt(fs.readFileSync("./PetBot/settings/PetCoins/257191130855243777/Candies.txt"));

    message.channel.send("You own " + Candies +" Candies!\nThe total amount of Candies collected by the server is: " + Total);



    }
  }