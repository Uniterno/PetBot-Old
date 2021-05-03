const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const Help = require('./OOP/help');

var rng = require('random-world');

module.exports = class Fate extends Command {
    constructor(client) {
        super(client, {
            name: 'fate',
            guildOnly: true,
            group: 'util',
            memberName: 'fate',
            description: 'Tells you about your fate.',
            examples: [''],
            throttling: {
        usages: 1,
        duration: 8
    },
        });
    }

   run(message, args) {
        args = args.split(' ');

        if(!!args[0] == false){
            message.channel.send("You need to ask a topic you want to be told about.");
            return;
        }

        let min = 1;
        let max = 5;
        let i = rng.integer({min,max}); // Min 1, max 5
        console.log(i);
        let phrase = "Oh, always remember this: ";

        if(i == 1){
            phrase = "Oh, so you want to know about that? Well... I can tell you one word that describes it perfectly... ";
        }
        else if(i == 2){
            phrase = "Fumufumu, naruhodo ne... *that*... listen carefully... ";
        }
        else if(i == 3){
            phrase = "I'm in a hurry but all you need to know is: ";
        }
        else if(i == 4){
            phrase = "Kukuku... the word that fate has chosen for you is: ";
        }
        else if(i == 5){
            phrase = "About that... you really need to avoid the following in order to survive: ";
        }

        let word = rng.word();

        message.channel.send(phrase+"**"+word+"**");

    
    }
}