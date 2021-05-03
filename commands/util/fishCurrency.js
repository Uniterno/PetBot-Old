const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const fs = require('fs');
const stringTable = require('string-table');


module.exports = class FishCurrencyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'fc',
            group: 'util',
            guildOnly: true,
            memberName: 'fc',
            description: 'Fishing Currency.',
            throttling: {
        usages: 1,
        duration: 1
    },
        });
    }

   run(message, args) {


  let UserID = message.author.id;

  let User = JSON.parse(fs.readFileSync("./PetBot/settings/fishing/UserData/"+UserID+".json", 'utf8'));


  let Bait = User.Bait;
  let RareBait = User.RareBait;
  let MysticBait = User.MysticBait;
  let StatusBait = User.StatusBait;
  let EscapeGas = User.EscapeGas;
  let Harpoon = User.Harpoon;

  let CaughtValue = User.CaughtValue;



  var FishTable = [
  { Bait,
    RareBait,
    MysticBait,
    StatusBait,
    EscapeGas,
    Harpoon,
    CaughtValue }
  ];

  console.log(FishTable);


  message.channel.send("```"+stringTable.create(FishTable)+"```");


    }


  }
