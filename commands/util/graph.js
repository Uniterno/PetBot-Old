const { Command } = require('discord.js-commando');
const Discord = require('discord.js');


module.exports = class GraphCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'graph',
            group: 'util',
            guildOnly: true,
            memberName: 'graph',
            description: '???',
            examples: [''],
            throttling: {
        usages: 3,
        duration: 50
    },
        });
    }

   run(message, args) {
    message.channel.send("https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/LINE_logo.svg/1200px-LINE_logo.svg.png");

  }
}
