const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const Help = require('./OOP/help');

module.exports = class Notice extends Command {
    constructor(client) {
        super(client, {
            name: 'notice',
            group: 'util',
            memberName: 'notice',
            guildOnly: true,
            description: 'Sends a notice to the specified channel.',
            examples: [''],
            throttling: {
        usages: 1,
        duration: 10
    },
        });
    }

   run(message, args) {

    if(message.author.id != '168389193603612673'){
      message.channel.send("You have no access to this command.");
      return;
    }

    args = message.content.split(' | ').slice(1);
    let Content = args[0];
    var ChannelsToSend = new Array();
    try{
      for (var i = 0; i < args.length; i++) {
          ChannelsToSend[i] = args[i+1];
        }
      for (var i = 0; i < ChannelsToSend.length-1; i++) {
        this.client.channels.cache.get(ChannelsToSend[i]).send(Content);
      }
    } catch (e) {
        console.error(e.message);
      }
    }
}