const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
//const mysql = require('mysql');
const fs = require('fs');
// vars that I need for some reason

var rng = require('random-world');


module.exports = class EstCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'est',
            guildOnly: true,
            group: 'util',
            memberName: 'est',
            description: 'Random numbers.',
            examples: [''],
            throttling: {
        usages: 1,
        duration: 20
    },
        });
    }

   run(message, args) {
    let FullList = "";
    let i = 0;

    while(i < 100){
    let N1 = getRandom(1,6);
    let N2 = getRandom(1,6);
    let N3 = getRandom(1,6);

    let N4 = N1*N2*N3;

    FullList = FullList + N4 + ", ";

    i++;

}

    message.channel.send(FullList);
  }
}

  function getRandom(min, max) {
    return rng.integer({min, max});
  }