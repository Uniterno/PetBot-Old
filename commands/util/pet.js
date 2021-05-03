const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
//const mysql = require('mysql');
const fs = require('fs');
// vars that I need for some reason


module.exports = class PetCoinsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'pet',
            group: 'util',
            memberName: 'pet',
            guildOnly: true,
            description: 'Turns you into a pet.',
            examples: [''],
            throttling: {
        usages: 1,
        duration: 1
    },
        });
    }

   run(message, args) {
    if(!!args == false){ 
    message.channel.send("Y-you’re already a Pet...");
  } else{
    message.channel.send("I-I'd pet "+args+", but y-you're already a Pet...");
  }
    
    }
  }