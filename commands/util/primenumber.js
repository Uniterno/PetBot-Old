const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const rng = require('random-world');



module.exports = class CPUStuffCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'dostuff',
            group: 'util',
            guildOnly: true,
            memberName: 'dostuff',
            description: 'Do CPU intensive stuff',
            throttling: {
        usages: 1,
        duration: 1
    },
        });
    }

   run(message, args) {
      return;
     let i = 30000;
     let a = 30000;
     let pn = false;

     while(true){
      //console.log(a);
      pn = false;
      while(i > 1){
        if(a % i == 0){
          pn = true;
        }
        i--;
        //console.log(i);
      }
      if(pn == true){
          //console.log(true);
          message.channel.send(a);
        }
      a++;
      i = a;
     }
    }
  }

  function getRandom(min, max) {
    return rng.integer({min, max});
  }