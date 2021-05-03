const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
//const mysql = require('mysql');
const fs = require('fs');
// vars that I need for some reason


module.exports = class GDPRCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'gdpr',
            group: 'util',
            guildOnly: true,
            memberName: 'gdpr',
            description: 'GDPR Privacy Information.',
            examples: [''],
            throttling: {
        usages: 4,
        duration: 50
    },
        });
    }

   run(message, args) {
        message.channel.send("Hi "+message.author.username+", thanks for using PetBot.\nPetBot stores several data in our servers for different purposes, but none of them are personal data; most of the collected data is PetBot inventory (PetCoins, Tickets, etc.) and event related variables. This information can't be used to track you or be sold to any 3rd party. Your information is safe.\nPetBot does, however, store your Discord User ID for different purposes, but don't worry, as this information can't be used to track you, PetBot does not store usernames or anything else besides ID, so without Discord, that information becomes useless. By using a PetBot command, you agree that we store your Discord ID as a way to index the information we store to your account.\n\nIn an effort to let you know all the personal information we store about you, we have made (unsensitive) information public. Sensitive data is not stored at all within our servers and we have no way to access it anyway (thanks Discord).\n\nDiscord User ID: **"+message.author.id+"**");
    }
  }