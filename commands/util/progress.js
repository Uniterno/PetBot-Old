const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
//const mysql = require('mysql');
const fs = require('fs');
// vars that I need for some reason


module.exports = class ProgressCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'progress',
            group: 'util',
            guildOnly: true,
            memberName: 'progress',
            description: 'Progress towards a badge.',
            examples: [''],
            throttling: {
        usages: 1,
        duration: 5
    },
        });
    }

   run(message, args) {

    let UserID = message.author.id;


      if(fs.existsSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgReceivedByEnemy.txt") == false){
        fs.writeFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgReceivedByEnemy.txt","0");
      }

      if(fs.existsSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgDealtToEnemy.txt") == false){
        fs.writeFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgDealtToEnemy.txt","0");
      }

      if(fs.existsSync("./PetBot/settings/dungeon/Progress/"+UserID+"_KilledEnemies.txt") == false){
        fs.writeFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_KilledEnemies.txt","0");
      }

      if(fs.existsSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgDealtToBoss.txt") == false){
        fs.writeFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgDealtToBoss.txt","0");
      }

      if(fs.existsSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgReceivedByBoss.txt") == false){
        fs.writeFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgReceivedByBoss.txt","0");
      }

    // The commented portion of code has been edited out in order to publish to GitHub as it may contain sensitive information:
    // USER_NOT_AVAILABLE doesn't actually work here, as it's a function that has been left out of this source code.

    /* if(USER_NOT_AVAILABLE){
        message.channel.send("You are not participating on this event!");
        return;
    } */
    
    let DamageReceived = fs.readFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgReceivedByEnemy.txt");
    let DamageDealt = fs.readFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgDealtToEnemy.txt"); 
    let AmountOfKilledEnemies = fs.readFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_KilledEnemies.txt");
    let DamageDealtToBoss = fs.readFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgDealtToBoss.txt");
    let DamageReceivedByBoss = fs.readFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_DmgReceivedByBoss.txt");
    let ClassMultiplier = fs.readFileSync("./PetBot/settings/dungeon/Progress/"+UserID+"_ClassMultiplier.txt");

    DamageReceived = parseFloat(DamageReceived);
    DamageDealt = parseFloat(DamageDealt);
    AmountOfKilledEnemies = parseFloat(AmountOfKilledEnemies);
    DamageDealtToBoss = parseFloat(DamageDealtToBoss);
    DamageReceivedByBoss = parseFloat(DamageReceivedByBoss);
    ClassMultiplier = parseFloat(ClassMultiplier);


    let Progress = ((((DamageDealt - DamageReceived) + (AmountOfKilledEnemies*23.5)) / 5) + ((DamageDealtToBoss*0.4) - (DamageReceivedByBoss*0.2))) * ClassMultiplier

    message.channel.send("Your amount of points for the badge is: "+Progress.toFixed(2));
    
    }
  }