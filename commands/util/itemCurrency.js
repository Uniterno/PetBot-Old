const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
//const mysql = require('mysql');
const fs = require('fs');
const stringTable = require('string-table');
// vars that I need for some reason
//var mkdirp = require('mkdirp');
//var getDirName = require('path').dirname;


module.exports = class ItemEventCurrencyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'ic',
            group: 'util',
            guildOnly: true,
            memberName: 'ic',
            description: '(Item) Event Currency.',
            throttling: {
        usages: 1,
        duration: 1
    },
        });
    }

   run(message, args) {

   	return;


    let UserID = message.author.id;


 if(fs.existsSync("./PetBot/settings/PetCoins/"+UserID+"/Croquette.txt") == false){
     fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/Croquette.txt","0");
  }

  if(fs.existsSync("./PetBot/settings/PetCoins/"+UserID+"/ChocoCornet.txt") == false){
     fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/ChocoCornet.txt","0");
  }

  if(fs.existsSync("./PetBot/settings/PetCoins/"+UserID+"/Mirror.txt") == false){
     fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/Mirror.txt","0");
  }

  if(fs.existsSync("./PetBot/settings/PetCoins/"+UserID+"/StarPan.txt") == false){
     fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/StarPan.txt","0");
  }

  if(fs.existsSync("./PetBot/settings/PetCoins/"+UserID+"/SayoPin.txt") == false){
     fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/SayoPin.txt","0");
  }


  var Croquette = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/Croquette.txt");
  var ChocoCornet = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/ChocoCornet.txt");
  var Mirror = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/Mirror.txt");
  var StarPan = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/StarPan.txt");
  var SayoPin = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/SayoPin.txt");

  //fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/Inventory.txt");


  Croquette = Croquette.toString('utf8');
  ChocoCornet = ChocoCornet.toString('utf8');
  Mirror = Mirror.toString('utf8');
  StarPan = StarPan.toString('utf8');
  SayoPin = SayoPin.toString('utf8');


  var ItemTable = [
  { Croquette,
    ChocoCornet,
    Mirror,
    StarPan,
    SayoPin }
  ];

  console.log(ItemTable);


  message.channel.send("```"+stringTable.create(ItemTable)+"```");


    }


  }
