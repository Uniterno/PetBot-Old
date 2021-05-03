const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const Help = require('./OOP/help');
const fs = require('fs');

module.exports = class messageObject extends Command {
    constructor(client) {
        super(client, {
            name: 'messageobject',
            group: 'util',
            guildOnly: true,
            memberName: 'messageobject',
            description: 'Logs Message Object to console for development purposes.', // Basically this
            aliases: ['modev'],
            throttling: {
        usages: 1,
        duration: 3
    },
        });
    }

   run(message, args) {
    console.log(message);
  }
}