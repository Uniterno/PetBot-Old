const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
//const mysql = require('mysql');
const fs = require('fs');
const RpcClient = require('node-json-rpc2').Client;
const rng = require('random-world');

// vars that I need for some reason


module.exports = class HonkSkillCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'brother',
            group: 'util',
            guildOnly: true,
            memberName: 'brother',
            description: 'Honk Skill.',
            examples: [''],
            throttling: {
        usages: 1,
        duration: 10
    },
        });
    }

   run(message, args) {
    if(message.author.id != 284443364210769921 && message.author.id != 168389193603612673){
      console.log("Unable to use this command.");
      return;
    }

   // return; // have to fix it

    if(fs.existsSync("./PetBot/settings/skills/HonkSkill.txt") == false){
      fs.writeFileSync("./PetBot/settings/skills/HonkSkill.txt","1");
      }      
      let HonkSkill = fs.readFileSync("./PetBot/settings/skills/HonkSkill.txt");

      if(HonkSkill != 1){
        return;
      }
    
    args = args.split(' ');

    let x = parseInt(args[0]);
    let y = parseInt(args[1]);

   /* if(!!x == false || !!y == false){
        message.channel.send("Invalid arguments.");
        return;
    }*/

    if(y < x){
        message.channel.send("Y needs to be greater than X");
        return;
    }

    if(x > 7000){
        message.channel.send("X can't be greater than 7000");
        return;
    }

    let UserID = message.author.id;
    let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt");

    if(CurrentAmount < x+y){
        message.channel.send("You don't have enough PetCoins");
        return;
    }

    let z = parseInt((parseInt(x)+parseInt(y))/2);

    message.channel.send("You paid "+z+" PetCoins for this bet.");

    

     
     CurrentAmount = parseInt(CurrentAmount) - z;
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt", CurrentAmount);

    let Fx = x*0.5;
    let Fy = y*2;
    let a = getRandom(Fy, Fx);
    console.log(a);
    a = Math.round(a);

    CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt");
     CurrentAmount = parseInt(CurrentAmount) + a;
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt", CurrentAmount);

    message.channel.send("Your bet result was: "+a);
    fs.writeFileSync("./PetBot/settings/skills/HonkSkill.txt","0");
    }
  }


function getRandom(min, max) {
    return rng.integer({min, max});
  }
