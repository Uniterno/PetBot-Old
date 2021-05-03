const { Command } = require('discord.js-commando');
const Discord = require('discord.js');




module.exports = class Math extends Command {
    constructor(client) {
        super(client, {
            name: 'log',
            group: 'util',
            guildOnly: true,
            memberName: 'log',
            description: 'Logarithms',
            throttling: {
        usages: 1,
        duration: 1
    },
        });
    }

   run(message, args) { // Calculate logarithms by requesting base and num

    args = message.content.split(' ').slice(1);
 
    let base = args[0];
    let num = args[1];

    console.log(base);
    console.log(num);

    if(base == "e"){
      base = 2.71828;
    }

    if(num == "e"){
      num = 2.71828;
    }

    if(base == "pi" || base == "π"){
      base = 3.141592653589793;
    }

    if(num == "pi" || num == "π"){
      num = 3.141592653589793;
    }

    if(isNaN(base) || isNaN(num)){
      message.channel.send("Invalid arguments. Only numbers or e.");
      return;
    }


   

    let res = getBaseLog(base, num);


    if(base == 10 && num != 2.71828){
      message.channel.send("Common logarithm of "+num+" is: "+res); 
    } else if(base == 10 && num == 2.71828){
      message.channel.send("Common logarithm of e is: "+res);
    } else if(base == 2.71828 && num != 2.71828){
      message.channel.send("Natural logarithm of "+num+" is: "+res);
    } else if(num == 2.71828 && base != 2.71828){
      message.channel.send("Logarithm base "+base+" of e is: "+res);
    } else if(num == 2.71828 && base == 2.71828){
      message.channel.send("Natural logarithm of e is: "+res);
    } else{
      message.channel.send("Logarithm base "+base+" of "+num+" is: "+res);
    }


    }
  }



  function getBaseLog(x, y) {
    return Math.log(y) / Math.log(x);
  }