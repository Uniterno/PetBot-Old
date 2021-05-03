const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const fs = require('fs');

module.exports = class StreakCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'loginv',
            group: 'util',
            guildOnly: true,
            memberName: 'loginv',
            description: 'Retrieves useful information related to login.',
            throttling: {
        usages: 1,
        duration: 5
    },
        });
    }

   run(message, args) {


    let UserID = message.author.id;
    let UserMaster = JSON.parse(fs.readFileSync("./PetBot/settings/user/master.json"));


    message.channel.send("Total login bonus: " + UserMaster[UserID].Login.TotalLogin+"\nCurrent streak: " + UserMaster[UserID].Login.Streak+"\nStreak/Total ratio: " + (UserMaster[UserID].Login.Streak/UserMaster[UserID].Login.TotalLogin).toFixed(2) + "\nLast login day: " + UserMaster[UserID].Login.LastLogin);

    }
  }