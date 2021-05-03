const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
//const mysql = require('mysql');
const fs = require('fs');
const stringTable = require('string-table');
// vars that I need for some reason


module.exports = class PetCoinsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'huge',
            group: 'util',
            guildOnly: true,
            memberName: 'huge',
            aliases: ['h'],
            description: 'Makes an emoji huge.',
            throttling: {
        usages: 5,
        duration: 1
    },
        });
    }

   run(message, args) {

        let UserID = message.author.id;


        let patt = new RegExp("[0-9]{17,18}");
        let emoji = patt.exec(message.content);


        console.log(message.content);
        console.log(patt);
        console.log("Emoji: " + emoji);

        if(!!emoji == true){
          try{
           message.channel.send(new Discord.Attachment("https://cdn.discordapp.com/emojis/"+emoji+".gif"))
           .catch(error => message.channel.send(new Discord.Attachment("https://cdn.discordapp.com/emojis/"+emoji+".png")));
         } catch(err){
          message.channel.send(new Discord.Attachment("https://cdn.discordapp.com/emojis/"+emoji+".png")); 
         }
        } else{
          message.channel.send("An emote couldn't be found.");
        }

       

    }
  }