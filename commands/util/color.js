const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const Help = require('./OOP/help');
const fs = require('fs');

module.exports = class RoleColor extends Command {
    constructor(client) {
        super(client, {
            name: 'color',
            group: 'util',
            guildOnly: true,
            memberName: 'color',
            description: 'Set an own role/color!',
            aliases: ['role'],
            throttling: {
        usages: 1,
        duration: 3
    },
        });
    }

   run(message, args) {

        args = message.content.split(' ').slice(1);
        if(args[0] == "help"){
            message.channel.send(Help.help('Color'));
            return;
        }

        if(args[0] == "PetBot" || args[1] == "PetBot"){
            message.channel.send("You know I can't allow that.");
            return;
        } else if(args[0] == "new"){
            if(typeof args[1] == 'undefined' || typeof args[2] == 'undefined'){
                message.channel.send("You need to choose a name for the role and a hexadecimal value for the color");
                return;
            } else{
                if(message.guild.available){
                    /*if(args[2].length > 8){
                       message.channel.send("Invalid hexadecimal value.");
                       console.log("More than 8 or charat0 is not #");
                       console.log(args[2].length);
                       console.log(args[2].charAt(0));
                      return;
                    }*/
                    let AttemptToCreate = message.guild.roles.cache.find(role => role.name === args[1]);
                    //console.log(AttemptToCreate);
                    if(AttemptToCreate != null){
                        message.channel.send("This role appears to already exist, to avoid a lot of weird stuff, I can't proceed, pick a different name or use ``!color "+args[1]+"``.");
                        return;
                    }
                    let isHexadecimal = /^#[0-9A-F]{6}$/i
                    isHexadecimal.lastIndex = 0;
                    if(isHexadecimal.test(args[2]) == false){
                        message.channel.send("Invalid hexadecimal value.");
                        //console.log(isHexadecimal.test(args[2]));
                        return;
                    }
                    // console.log(isHexadecimal.test(args[2]))
                    message.guild.roles.create({
                    name: args[1],
                    //hexColor: args[2]
                    })
                    .then(
                    role => {
                    role.setColor(args[2]).then(() =>  message.member.roles.add(role))}).catch(console.error);
                    //.catch(console.error);
                    message.channel.send("Role has been created and assigned to you");
                    /*if(role == null){
                    message.channel.send("An error has occured trying to save the role. Check the syntax of the name, it may be unvalid for Discord.");
                    return;
                    }*/
                    //role.setColor(args[2]);
                    return;
                } else{
                    message.channel.send("Error doing that.");
                }
            }
        }

        if(typeof args[0] == 'undefined'){
            return;
        }

        let role = message.guild.roles.cache.find(role => role.name === args[0]);

        if(role == undefined){ 
            message.channel.send("Color not found.");
            return;
        }
        if(message.member.roles.has(role.id)) {
            message.member.roles.remove(role).catch(console.error);
            message.channel.send("Your color has been deleted.");
        }  
        else {  
            message.member.roles.add(role).catch(console.error); // lo mismo
            message.channel.send("You're now: "+args[0]);
        }
    }
}