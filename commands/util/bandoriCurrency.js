const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const fs = require('fs');
const stringTable = require('string-table');


module.exports = class BandoriCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'bc',
            group: 'util',
            guildOnly: true,
            memberName: 'bc',
            description: 'Bandori Currency.',
            throttling: {
        usages: 1,
        duration: 1
    },
        });
    }

   run(message, args) {


    let UserID = message.author.id;


  if(fs.existsSync("./PetBot/settings/PetCoins/"+UserID+"/PickA3Stars.txt") == false){
     fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PickA3Stars.txt","0");
  }
  if(fs.existsSync("./PetBot/settings/PetCoins/"+UserID+"/PickA4Stars.txt") == false){
     fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PickA4Stars.txt","0");
  }

  var PickA3Stars = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PickA3Stars.txt");
  var PickA4Stars = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PickA4Stars.txt");


  PickA3Stars = PickA3Stars.toString('utf8');
  PickA4Stars = PickA4Stars.toString('utf8');

  var Table = [
  { PickA3Stars,
    PickA4Stars }
  ];

  console.log(Table);


  message.channel.send("```"+stringTable.create(Table)+"```");


    }


  }
