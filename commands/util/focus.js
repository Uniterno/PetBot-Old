const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const Help = require('./OOP/help');
const fs = require('fs');

module.exports = class FocusCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'focus',
            aliases: ['foc'],
            group: 'util',
            guildOnly: true,
            memberName: 'focus',
            description: 'Focus for #guess-list.',
            examples: [''],
            throttling: {
        usages: 3,
        duration: 50
    },
        });
    }

   run(message, args) {
        args = args.split(' ');
  let Focus = args[0];

  if(isNaN(Focus)){
    message.channel.send("You need to input a number.");
    return;
  }

  if(!!Focus == false){ // Returns false for null,undefined,0,000,"",false.
    message.channel.send("You need to input a number.");
    console.log(Focus);
    return;
  }

  let Round = Focus;




    this.client.channels.cache.get("448962758675791894").bulkDelete(50);
    let ToSendAsList;
    let Iteration = 1;
    ToSendAsList = "Round: **"+Round+"**\n";
    ToSendAsList = ToSendAsList + "**---**\n";
    while(fs.existsSync("./PetBot/settings/guess/GuessList/Round"+Round+"/"+Iteration+".txt")){
      if(!ToSendAsList){
        ToSendAsList = fs.readFileSync("./PetBot/settings/guess/GuessList/Round"+Round+"/"+Iteration+".txt");
      } else{
        ToSendAsList = ToSendAsList + fs.readFileSync("./PetBot/settings/guess/GuessList/Round"+Round+"/"+Iteration+".txt");
      }
      Iteration++;
    }

    
    ToSendAsList = ToSendAsList + "**---**";

    ToSendAsList = ToSendAsList + "\n**This message will be sent every time someone uses !guess or !sw, so you probably want to mute this channel.**";

    if(ToSendAsList.length >= 1999){
     ToSendAsList =  ToSendAsList.substring((ToSendAsList.length - 1999))
    }

    this.client.channels.cache.get("448962758675791894").send(ToSendAsList);

    message.channel.send("#guess-list has been updated with the provided focus round.");
  }
    
    }