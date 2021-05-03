const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const Help = require('./OOP/help');
const fs = require('fs');


module.exports = class Refund extends Command {
    constructor(client) {
        super(client, {
            name: 'mbadge',
            group: 'util',
            guildOnly: true,
            memberName: 'mbadge',
            description: 'Manage badges.',
            examples: [''],
            throttling: {
        usages: 1,
        duration: 1
    },
        });
    }

  run(message, args) {

    if(message.author.id != '168389193603612673'){
      message.channel.send("You have no access to this command.");
      return;
    }

    args = message.content.split(' | ').slice(1);
        
    if(!!args[0] == false || !!args[1] == false){
      message.channel.send("Not enough arguments.\nUse the following: ``<UserID> | <Badge Name> | <Description>``");
      return;
    }

    let UserMaster = JSON.parse(fs.readFileSync("./PetBot/settings/user/master.json"));
    let UserID = args[0];
    let Name = args[1];
    let Description = args[2];

    console.log(UserMaster[UserID].Badges);
    console.log(UserMaster[UserID].Badges.length);


    let ObjectToPush = {};
    ObjectToPush.name = Name;
    ObjectToPush.description = Description;
    UserMaster[UserID].Badges.push(ObjectToPush);

    
    let ChannelToSend = 'ID'; // Replace 'ID' by the desired channel where you want to post the message.
    // Edited out in order to upload to GitHub.
  
  
    let UpdatedJSON = JSON.stringify(UserMaster, null, "\t");
    fs.writeFileSync("./PetBot/settings/user/master.json",UpdatedJSON);


    this.client.channels.cache.get(ChannelToSend).send(message.guild.members.cache.get(UserID).user.username + " received the following badge: **"+Name+"** ("+Description+")");    

  }

}