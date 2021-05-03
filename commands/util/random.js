const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const rng = require('random-world');



module.exports = class BadgesCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'random',
            group: 'util',
            guildOnly: true,
            memberName: 'random',
            description: 'Random number between 1 and 100',
            throttling: {
        usages: 1,
        duration: 1
    },
        });
    }

   run(message, args) {

     args = message.content.split(' ').slice(1);
     let Min = 0;
     let Max = 100;

     if(!!args[0] == false || !!args[1] == false){

     } else{
      Min = args[0] - 1;
      Max = args[1];
     }

      message.channel.send(getRandom(Min,Max));
    }
  }

  function getRandom(min, max) {
    return rng.integer({min, max});
  }