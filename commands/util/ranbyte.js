const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
//const mysql = require('mysql');
const fs = require('fs');
const crypto = require('crypto');
// vars that I need for some reason


module.exports = class RandomByteCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'ranbyte',
            group: 'util',
            guildOnly: true,
            memberName: 'ranbyte',
            description: 'Generates a random byte.',
            examples: [''],
            throttling: {
        usages: 1,
        duration: 10
    },
        });
    }

   run(message, args) { // Random byte
    let a = crypto.randomBytes(1, (err, buf) => {
         if (err) throw err;
        var hex = buf.toString('hex');
        var myInt32 = parseInt(hex, 16);
        message.channel.send(myInt32);
    });
  }
}