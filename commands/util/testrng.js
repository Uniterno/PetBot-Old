const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const fs = require('fs');
const rng = require('random-world');



module.exports = class MyPetCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'testrng',
            group: 'util',
            guildOnly: true,
            memberName: 'testrng',
            aliases: ['trng'],
            description: 'Test RNG by getting one number.',
            throttling: {
        usages: 1,
        duration: 5
    },
        });
    }

   run(message, args) {

     args = message.content.split(' ').slice(1);

     let Goal = args[0];
     let AmountOfTimes = args[1];
     let MinValue = args[2];
     let MaxValue = args[3];

     let FirstEncounter = 0;

     if(!!Goal == false){
      message.channel.send("You have to pick a number to find.");
      return;
     }
     if(!!AmountOfTimes == false){
      AmountOfTimes = 100;
     }
     if(AmountOfTimes < 0){
      AmountOfTimes = 0;
     }
     if(!!MinValue == false){
      MinValue = 0;
     }
     if(!!MaxValue == false){
      MaxValue = MinValue+100;
     }

     if(Goal == "NaN" || AmountOfTimes == "NaN" || MinValue == "NaN" || MaxValue == "NaN"){
      message.channel.send("Invalid arguments. Use only numbers.");
      return;
     }

     if(AmountOfTimes > 10000000){
      message.channel.send("The maximum amount of iterations is 10 million!");
      return;
     }

     let i = 0;
     let omg = 0;

     MinValue = MinValue - 1; // this ensures getRandom(min,max) works as inteded, as min is EXCLUSIVE and max is INCLUSIVE.
     while(i < AmountOfTimes){ 

      let RNG = getRandom(MinValue,MaxValue);
      if(Goal == RNG){
        if(FirstEncounter == 0){
          FirstEncounter = i + 1;
        }
        omg = omg + 1;
      }

      i = i + 1;

     }

     if(FirstEncounter == 0){
      message.channel.send("After "+AmountOfTimes+" iterations, the number "+Goal+" has been picked "+omg+" times.");
    } else{
      message.channel.send("After "+AmountOfTimes+" iterations, the number "+Goal+" has been picked "+omg+" times.\nIt took " + FirstEncounter + " iterations to find this number for the first time.");
    }
  }
}



function getRandom(min, max) {
    return rng.integer({min, max});
  }