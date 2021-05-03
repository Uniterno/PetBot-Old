const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const fs = require('fs');
const rng = require('random-world');


module.exports = class BidState extends Command {
    constructor(client) {
        super(client, {
            name: 'bidstate',
            group: 'util',
            guildOnly: true,
            memberName: 'bidstate',
            description: 'Challenge Live Event',
            aliases: ['bs'],
            throttling: {
        usages: 1,
        duration: 1
    },
        });
    }

   run(message, args) {

   

    var BidData = JSON.parse(fs.readFileSync("./PetBot/settings/bid/bid.json", 'utf8'));

    message.channel.send("```json\n"+JSON.stringify(BidData, null, "\t")+"```");

  }
}