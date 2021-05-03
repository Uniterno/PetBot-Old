const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const Help = require('./OOP/help');
const fs = require('fs');

module.exports = class Sleep extends Command {
    constructor(client) {
        super(client, {
            name: 'sleep',
            group: 'util',
            guildOnly: true,
            memberName: 'sleep',
            description: 'Go to sleep!',
            throttling: {
        usages: 1,
        duration: 3
    },
        });
    }

   run(message, args) {

    args = message.content.split(' / ').slice(1);
    if(args[0] == undefined){
      message.channel.send("Go to sleep "+message.author.username);
    } else{
      message.channel.send("Go to sleep "+args[0]);
    }
  }
}