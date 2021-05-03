const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const fs = require('fs');
const { Client, MessageAttachment } = require('discord.js');

var Atch;

module.exports = class Hakanai extends Command {
    constructor(client) {
        super(client, {
            name: 'hakanai',
            group: 'util',
            guildOnly: true,
            memberName: 'hakanai',
            description: 'Tsumari... sou iu koto sa.',
            aliases: ['hak'],
            throttling: {
        usages: 1,
        duration: 3
    },
        });
    }

   run(message, args) {

  args = message.content.split(' ').slice(1);

   Atch = "https://vignette.wikia.nocookie.net/bandori/images/9/96/A_Fleeting_Life_transparent.png";

  if(args[0] == "1"){
  	Atch = "https://vignette.wikia.nocookie.net/bandori/images/0/0e/Rumored_Prince_transparent.png";
  }

  	//console.log(message);

  	const attachment = new MessageAttachment(Atch);
	message.channel.send(attachment);

	message.delete()
  .then(msg => console.log(`Fleeted succesfully`))
  .catch(console.error);

}
}
