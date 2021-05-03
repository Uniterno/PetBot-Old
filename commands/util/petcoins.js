const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
//const mysql = require('mysql');
const fs = require('fs');
const stringTable = require('string-table');
// vars that I need for some reason


module.exports = class PetCoinsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'petcoins',
            group: 'util',
            guildOnly: true,
            memberName: 'petcoins',
            aliases: ['pc'],
            description: 'Retrieves useful information related to PetCoins and inventory.',
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
  if(fs.existsSync("././PetBot/settings/PetCoins/"+UserID+"/PetStars.txt") == false){
     fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetStars.txt","0");
  }


  var PetCoins = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt");
  var SR = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/SRTicket.txt");
  var SSR = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/SSRTicket.txt");
  var UR = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/URTicket.txt");
  var BlueTickets = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/BlueTicket.txt");
  var Aureus = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/Aureus.txt");
  var PetStars = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetStars.txt");


  //fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/Inventory.txt");


  //console.log(PetCoins.toString('utf8'));

  PetCoins = PetCoins.toString('utf8');
  SR = SR.toString('utf8');
  SSR = SSR.toString('utf8');
  UR = UR.toString('utf8');
  BlueTickets = BlueTickets.toString('utf8');
  Aureus = Aureus.toString('utf8');
  PetStars = PetStars.toString('utf8');


  var PetCoinTable = [
  { PetCoins,
    SR, 
    SSR, 
    UR, 
    BlueTickets,
    Aureus,
    PetStars }
  ];

  console.log(PetCoinTable);
  console.log(PetCoins);
  //console.log(PetCoinTable[PetCoins]);

  //PetCoinTable[PetCoins] = PetCoins;

 /* PetCoinTable.PetCoins = ;
  PetCoinTable.SRTickets =
  PetCoinTable.SSRTickets = 
  PetCoinTable.URTickets = 
  PetCoinTable.BlueTickets = 
  PetCoinTable.PetTickets = */

 // PetCoinTable[PetCoins] = PetCoins;

  //console.log(PetCoins.toString('utf8'));
  //console.log(PetCoinTable.PetCoins.toString('utf8'));



  message.channel.send("```"+stringTable.create(PetCoinTable)+"```");
  
    }
  }