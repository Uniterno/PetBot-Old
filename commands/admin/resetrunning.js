const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const fs = require('fs');



module.exports = class ResetRunning extends Command {
    constructor(client) {
        super(client, {
            name: 'rr',
            group: 'admin',
            memberName: 'rr',
            description: 'Resets Running Status.',
            examples: [''],
            throttling: {
        usages: 1,
        duration: 10
    },
        });
    }

   run(message, args) {

    fs.writeFileSync("./PetBot/settings/scout/Running.txt", 'false');

    var Settings = JSON.parse(fs.readFileSync("./PetBot/settings/master.json"));
    Settings.running = false;

    let SettingsJSON = JSON.stringify(Settings, null, "\t");
    fs.writeFileSync("./PetBot/settings/master.json",SettingsJSON);

    let msgSend = "";

    if(message.author.id != 168389193603612673){
       msgSend = "Please don't abuse this command. Use it only when it's been bugged, using it when a scout is in progress may result in a punishment.";
    }
    
    msgSend = msgSend + "Running Status set to false";

    message.channel.send(msgSend);
    
    }
  }