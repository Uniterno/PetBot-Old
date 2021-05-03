const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const fs = require('fs');


module.exports = class BadgesCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'commands',
            group: 'util',
            guildOnly: true,
            memberName: 'commands',
            description: 'Shows all commands',
            throttling: {
        usages: 1,
        duration: 1
    },
        });
    }

   run(message, args) {

     fs.readdir("C:/Users/Uniterno/PetBot/commands/util", (err, files) => {
        if(err) console.error(err);

        let jsfiles = files.filter(f => f.split(".").pop() === "js");
        if(jsfiles.length <= 0) {
            console.log("No commands to load!");
            return;
        }

        var namelist = "";
        var desclist = "";
        var usage = "";

        let result = jsfiles.forEach((f, i) => {
            let props = require(`./${f}`);
            console.log(Object.getOwnPropertyNames(props));
            namelist = props.help.name;
            desclist = props.help.description;
            usage = props.length;
        });

        message.author.send(`**${namelist}** \n${desclist} \n${usage}`);
    });
  }
}