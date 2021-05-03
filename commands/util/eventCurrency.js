const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
//const mysql = require('mysql');
const fs = require('fs');
const stringTable = require('string-table');
// vars that I need for some reason
//var mkdirp = require('mkdirp');
//var getDirName = require('path').dirname;


module.exports = class EventCurrencyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'ec',
            group: 'util',
            guildOnly: true,
            memberName: 'ec',
            description: 'Event Currency.',
            throttling: {
        usages: 1,
        duration: 1
    },
        });
    }

   run(message, args) {


    let UserID = message.author.id;


  if(fs.existsSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt") == false){
     fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt","0");
  }
  if(fs.existsSync("./PetBot/settings/PetCoins/"+UserID+"/MakiCookies.txt") == false){
     fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/MakiCookies.txt","0");
  }
  if(fs.existsSync("./PetBot/settings/PetCoins/"+UserID+"/Yen.txt") == false){
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/Yen.txt","0");
  }
  if(fs.existsSync("./PetBot/settings/PetCoins/"+UserID+"/Christmas/Gifts.txt") == false){
     fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/Christmas/Gifts.txt","5");
  }
  if(fs.existsSync("./PetBot/settings/PetCoins/"+UserID+"/Christmas/Bells.txt") == false){
     fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/Christmas/Bells.txt","0");
  }


  var PetTickets = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt");
  var MakiCookies = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/MakiCookies.txt");
  var Yen = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/Yen.txt");
  var LotteryTickets = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/LotteryTickets.txt");
  var HLSY =  fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/HLSY.txt");
  var ChristmasGifts = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/Christmas/Gifts.txt");
  var ChristmasBells = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/Christmas/Bells.txt");


  PetTickets = PetTickets.toString('utf8');
  MakiCookies = MakiCookies.toString('utf8');
  let Crystals = Yen.toString('utf8');
  HLSY = HLSY.toString('utf8');
  ChristmasGifts = ChristmasGifts.toString('utf8');
  ChristmasBells = ChristmasBells.toString('utf8');
  LotteryTickets = LotteryTickets.toString('utf8')

  var PetCoinTable = [
  { PetTickets,
    MakiCookies,
    Crystals, 
    LotteryTickets,
    HLSY }
  ];

  var ChristmasTable = [
  { ChristmasGifts,
    ChristmasBells }
  ];

  console.log(PetCoinTable);


  message.channel.send("```"+stringTable.create(PetCoinTable)+"```\n```"+stringTable.create(ChristmasTable)+"```");


    }


  }



  function createPath(path, contents) {
  
}