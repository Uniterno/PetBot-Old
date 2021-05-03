const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const Help = require('./OOP/help.js');
const LuckOOP = require('./OOP/luck.js');

//const Luck = require('C:/Users/Uniterno/PetBot/commands/util/OOP/luck.js');


module.exports = class Luck extends Command {
    constructor(client) {
        super(client, {
            name: 'luck',
            group: 'util',
            guildOnly: true,
            memberName: 'luck',
            description: 'luck',
            throttling: {
        usages: 1,
        duration: 1
    },
        });
    }

   run(message, args) {
    args = message.content.split(' ').slice(1);

    if(args[0] == 'help'){

      if(args[1] == "limited"){
        const embed = new Discord.RichEmbed()
          .setColor([0, 150, 136])
          .addField("Help", Help.help('LuckLimited'))
        message.channel.send({embed});
        return;
      }


      const embed = new Discord.RichEmbed()
          .setColor([0, 150, 136])
          .addField("Help", Help.help('Luck'))
        message.channel.send({embed});
        return;
    }

    if(args[0] != 'lim' && args[0] != 'limited' && args[0] != "l"){
      if(isNaN(args[0]) || isNaN([args[1]]) || args[0] == undefined || args[1] == undefined || args[0] < 0 || args[1] < 0){
      const embed = new Discord.RichEmbed()
          .setTitle("Invalid arguments.")
          .setColor([255, 0, 0])
        message.channel.send({embed});
        return;
     } 
    } else{
       if(isNaN([args[1]]) || isNaN(args[2]) || isNaN(args[3]) || args[1] < 0 || !!args[1] == false || !!args[2] == false || !!args[3] == false){
      const embed = new Discord.RichEmbed()
          .setTitle("Invalid arguments.")
          .setColor([255, 0, 0])
        message.channel.send({embed});
        return;
     } 
    }
    

    if(args[1] % 1 != 0 && args[2] != "-allow_decimals"){
      const embed = new Discord.RichEmbed()
          .setTitle("Can't use decimal values for 'Amount' value. Use flag ``-allow_decimals`` to ignore this.")
          .setColor([255, 0, 0])
        message.channel.send({embed});
        return;
    }

    if(args[0] == 'lim' || args[0] == "limited" || args[0] == "l"){

      let CardsInPool = parseFloat(args[1]);
      let DesiredCards = parseFloat(args[2]);
      let AmountOfPulls = parseFloat(args[3]);


      var Chances = LuckOOP.LuckLimited(CardsInPool, DesiredCards, AmountOfPulls);

      var ColorArray = LuckOOP.ColorArray(Chances); 

      if(DesiredCards > CardsInPool){
        let AreYouOkay = message.client.emojis.cache.get("468411322531577907");
        const embed = new Discord.RichEmbed()
          .setTitle("You want more cards that those in the pool.")
          .setColor([255, 0, 0])
        message.channel.send({embed});
        message.channel.send(AreYouOkay.toString());
        return;
      }
      
      
    } else{
      console.log("Standard");
      let Probablity = args[0];
      let Amount = args[1];

      var Chances = LuckOOP.Luck(Probablity, Amount);
      console.log(Chances);
      var ColorArray = LuckOOP.ColorArray(Chances);
    }

    

     const embed = new Discord.RichEmbed()
          .setTitle(Chances+"%")
          .setColor(ColorArray)
        message.channel.send({embed});
    
    }
  }
