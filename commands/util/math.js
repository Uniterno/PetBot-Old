const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const vm = require('vm');
const AES256 = require('aes256');



module.exports = class Math extends Command {
    constructor(client) {
        super(client, {
            name: 'math',
            group: 'util',
            guildOnly: true,
            memberName: 'math',
            description: 'Math',
            throttling: {
        usages: 1,
        duration: 1
    },
        });
    }

    // Tool to facilitate math operation to users.

   run(message, args) {
    if(args.includes("everyone") || args.includes("here") || args.includes("fs") || args.includes("while") || args.includes("for")){
      if(message.author.id != 168389193603612673){
        message.channel.send("Illegal statement.");
        return;
      }
    }

    const Math = require('mathjs'); let e = 2.718281828459045; let pi = 3.141592653589793; let tau = pi*2; let π = pi;

    try {
        /*if(args.includes("while") || args.includes("for")){
          message.channel.send("Error: Illegal statement. Details: ```Avoided potential Memory Leak.```");
          return;
        }*/



    

     //var evaluate = "const Math = require('mathjs'); const math = Math; const m = Math; const M = Math; let e = 2.718281828459045; let pi = 3.141592653589793; let tau = pi*2; let π = pi;";
    let evaluate = args;
    evaluate = evaluate.replace(/\^/g, "**"); // Replaces all ^ for **. This allows user to use ^ for powers.

    const ContextForSafeMath = {
      Math: Math,
      math: Math,
      m: Math,
      M: Math,
      e: 2.718281828459045,
      pi: 3.141592653589793,
      tau: pi*2,
      π: pi,
      aes256: AES256
    };

    let r = null;
    console.log(evaluate);
    r = vm.runInNewContext(evaluate, ContextForSafeMath)
    console.log(evaluate);
    message.channel.send(r);
     
    }
    catch(err) {
      message.channel.send("Error: Invalid or illegal statement. Details: ```"+err+"```");
      return;
    }
     

      /*if(isNaN(r)){
        message.channel.send("**Warning**: Function does not return a number.");
        //return;
      }*/
      
      //message.channel.send(r);
    }
  }

