const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const fs = require('fs');

module.exports = class StreakCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'streak',
            group: 'util',
            guildOnly: true,
            memberName: 'streak',
            aliases: ['str'],
            description: 'Retrieves useful information related to Streaks and inventory.',
            throttling: {
        usages: 1,
        duration: 5
    },
        });
    }

   run(message, args) {


    let UserID = message.author.id;


if(fs.existsSync("./PetBot/settings/PetCoins/"+UserID+"/StreakFixers.txt") == false){
     fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/StreakFixers.txt","");
  }



  var StreakFixers = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/StreakFixers.txt");

  message.channel.send("You own the following Streak Fixers: "+StreakFixers);


    }
  }