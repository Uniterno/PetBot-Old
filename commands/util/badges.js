const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
//const mysql = require('mysql');
const fs = require('fs');
const stringTable = require('string-table');
// vars that I need for some reason


module.exports = class BadgesCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'badges',
            group: 'util',
            guildOnly: true,
            memberName: 'badges',
            description: 'Retrieves useful information related to badges.',
            throttling: {
        usages: 1,
        duration: 1
    },
        });
    }

   run(message, args) {


    let UserID = message.author.id;
    let UserMaster = JSON.parse(fs.readFileSync("./PetBot/settings/user/master.json"));

    if(!!UserMaster[UserID].Badges == false){
      message.channel.send("Your badge inventory or user file may be corrupted.");
      return;
    }


  let i = 0;
  let MessageToSend = [];
  let x = 0;


  while(i < UserMaster[UserID].Badges.length){
    if(!!MessageToSend[Math.floor(i/10)] == false){
      console.log("aaaa");
      MessageToSend[Math.floor(i/10)] = "**"+UserMaster[UserID].Badges[i].name + "**\n"+UserMaster[UserID].Badges[i].description+"\n";
    } else{
      MessageToSend[Math.floor(i/10)] = MessageToSend[Math.floor(i/10)] + "**"+UserMaster[UserID].Badges[i].name + "**\n"+UserMaster[UserID].Badges[i].description+"\n";
    }
    //message.channel.send("**"+Obj.badge[i-1].name + "**\n"+Obj.badge[i-1].description+"\n");
    i++; 
  }



  let m = message.channel.send("**Page " + parseInt(parseInt(x)+parseInt(1)) + "/" + Math.ceil(i/10) + "**\n\n" + MessageToSend[x]).then((m) => {
    m.react('\u2b06')
    m.react('\u2b07')
    return m
  }).then((m)=>{
    const filter = (reaction, user)   => 
            user.id === message.author.id &&
            reaction.emoji.name === "\u2b06" ||
            reaction.emoji.name === "\u2b07"
    const collector = m.createReactionCollector(filter, { time: 60000});
        collector.on("collect", reaction => {
             const chosen = reaction.emoji.name;
                 if(chosen === "\u2b06"){
                    x = x + 1;
                    if(!!MessageToSend[x] == false){
                      x = x - 1;
                    } else{
                       m.edit("**Page " + parseInt(parseInt(x)+parseInt(1)) + "/" + Math.ceil(i/10) + "**\n\n" + MessageToSend[x]);
                    }
                   
                } else if(chosen === "\u2b07"){
                  x = x - 1;
                    if(!!MessageToSend[x] == false){
                      x = x + 1;
                    } else{
                       m.edit("**Page " + parseInt(parseInt(x)+parseInt(1)) + "/" + Math.ceil(i/10) + "**\n\n" + MessageToSend[x]);
                    }
                } else{

                }});
      });
    }
  }

