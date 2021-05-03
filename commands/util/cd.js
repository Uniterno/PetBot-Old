const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const Help = require('./OOP/help');
const fs = require('fs');

module.exports = class CountDown extends Command {
    constructor(client) {
        super(client, {
            name: 'cd',
            aliases: ['countdown'],
            group: 'util',
            guildOnly: true,
            memberName: 'cd',
            description: 'Countdowns from 5 to 0, unless specified otherwise.',
            examples: [''],
            throttling: {
        usages: 3,
        duration: 60
    },
        });
    }

   run(message, args) {
        args = args.split(' ');

        if(args[0] == "help"){
            message.channel.send(Help.help('Countdown'));
            return;
        }

        let CD = 5;
        if(!!args[0] == false){ // Returns false for null,undefined,0,000,"",false.
            CD = 5;
        } else {
            if(isNaN(args[0])){
                message.channel.send("Specified value is not valid.");
                return;
            }
            if(args[0] > 60 || args[0] <= 0){
                message.channel.send("Countdown offset must be in a range of 1 to 60 seconds.");
                return;
            }
            CD = args[0];
        }

        let ShowEvery = args[1];
        if(!!ShowEvery == false){
            ShowEvery = 5;
        }
        if(isNaN(ShowEvery)){  
            message.channel.send("Specified value for 2nd Argument is not valid.");
            return;
        }

        console.log("ShowEvery: "+ShowEvery);
        console.log("!!args[1]: "+!!args[1]);
        console.log("CD: "+CD);
        if((ShowEvery >= CD) && (!!args[1] == true)){
            message.channel.send("Can't specify a value for 2nd argument larger than countdown offset.");
            return;
        }
        if(ShowEvery <= 1){
            message.channel.send("2nd argument cannot be lower than 2 due to API limitations.");
            return;
        }
        if(CD/10 > ShowEvery){
            if(ShowEvery != 5){
                 message.channel.send("2nd argument has to be higher or equal to 10% of the value of the countdown offset or be 5 (default)");
                 return;
            }
        }

        CD = Math.floor(CD);
        ShowEvery = Math.floor(ShowEvery);

        let SimultaneousCD = fs.readFileSync("./PetBot/settings/cd/Running.txt");
        SimultaneousCD = parseInt(SimultaneousCD);
        if(SimultaneousCD >= 3){
            message.channel.send("You have reached the max limit of simultaneous countdown instances, wait for them to finish.");
            return;
        }
        fs.writeFileSync("./PetBot/settings/cd/Running.txt", SimultaneousCD+1);

        message.channel.send("Countdown starting at "+CD+", showing values every "+ShowEvery+"s has started.");
        let Interval = setInterval(function(){
            if(CD <= 0){
            message.channel.send("**Go!**");
            SimultaneousCD = fs.readFileSync("./PetBot/settings/cd/Running.txt");
            SimultaneousCD = parseInt(SimultaneousCD);
            fs.writeFileSync("./PetBot/settings/cd/Running.txt", SimultaneousCD-1);
            clearInterval(Interval);
            } else{
                if(CD <= 3){
                    message.channel.send(CD); 
                } else if(CD % ShowEvery == 0){
                    message.channel.send(CD); 
                }  
            }
            CD = CD - 1;
        },
        1000);
  }
    
    }