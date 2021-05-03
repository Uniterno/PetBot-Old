const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const fs = require('fs');

module.exports = class StreakCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'unicode',
            group: 'util',
            guildOnly: true,
            memberName: 'unicode',
            aliases: ['uni', 'uc'],
            description: 'Unicode values.',
            throttling: {
        usages: 1,
        duration: 5
    },
        });
    }

   run(message, args) { // Print Unicode value from Code Point.


  let Unicode = args;

  try{
    message.channel.send(String.fromCodePoint(Unicode));
  } catch(err){
    message.channel.send("An error has occured. Details: ``"+err.message+"``");
  }
    }
  }