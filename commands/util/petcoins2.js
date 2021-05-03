const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
//const mysql = require('mysql');
const fs = require('fs');
const stringTable = require('string-table');
// vars that I need for some reason


module.exports = class PetCoinsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'petcoins2',
            group: 'util',
            guildOnly: true,
            memberName: 'petcoins2',
            aliases: ['pc2'],
            description: 'Retrieves useful information related to PetCoins (Part 2).',
            throttling: {
        usages: 1,
        duration: 5
    },
        });
    }

   run(message, args) {


    let UserID = message.author.id;


if(fs.existsSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt") == false){
     fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt","3000");
  }
  if(fs.existsSync("././PetBot/settings/PetCoins/"+UserID+"/SRTicket.txt") == false){
     fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/SRTicket.txt","0");
  }
  if(fs.existsSync("././PetBot/settings/PetCoins/"+UserID+"/SSRTicket.txt") == false){
      console.log("SSRTicket ERROR");
     fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/SSRTicket.txt","0");
  }
  if(fs.existsSync("././PetBot/settings/PetCoins/"+UserID+"/URTicket.txt") == false){
     fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/URTicket.txt","0");
  }
  if(fs.existsSync("././PetBot/settings/PetCoins/"+UserID+"/BlueTicket.txt") == false){
     fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/BlueTicket.txt","0");
  }
  if(fs.existsSync("././PetBot/settings/PetCoins/"+UserID+"/Aureus.txt") == false){
     fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/Aureus.txt","30");
  }
  if(fs.existsSync("././PetBot/settings/PetCoins/"+UserID+"/SRTicketSSRPlus.txt") == false){
     fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/SRTicketSSRPlus.txt","0");
  }
  if(fs.existsSync("././PetBot/settings/PetCoins/"+UserID+"/3StarBandoriTicket.txt") == false){
     fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/3StarBandoriTicket.txt","0");
  }
  if(fs.existsSync("././PetBot/settings/PetCoins/"+UserID+"/5Servant.txt") == false){
     fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/5Servant.txt","0");
  }
  if(fs.existsSync("././PetBot/settings/PetCoins/"+UserID+"/PetCookies.txt") == false){
     fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCookies.txt","0");
  }


  var SRTicketSSRPlus = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/SRTicketSSRPlus.txt");
  var _3StarBandoriTicket = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/3StarBandoriTicket.txt");
  var _5StarServant = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/5Servant.txt");
  var PetCookies = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCookies.txt");
  var Diamonds = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/Diamonds.txt");

  
  SRTicketSSRPlus = SRTicketSSRPlus.toString('utf8');
  _3StarBandoriTicket = _3StarBandoriTicket.toString('utf8');
  _5StarServant = _5StarServant.toString('utf8');
  PetCookies = PetCookies.toString('utf8');
  Diamonds = Diamonds.toString('utf8');


  var PetCoinTable = [
  { 
    SRTicketSSRPlus,
    _3StarBandoriTicket,
    _5StarServant,
    PetCookies,
    Diamonds }
  ];

message.channel.send("```"+stringTable.create(PetCoinTable)+"```");
    }
  }