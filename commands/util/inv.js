const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
//const mysql = require('mysql');
const fs = require('fs');
const stringTable = require('string-table');
// vars that I need for some reason


module.exports = class PetCoinsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'inv',
            group: 'util',
            guildOnly: true,
            memberName: 'inv',
            aliases: ['inventory'],
            description: 'Retrieves User inventory.',
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

  if(fs.existsSync("./PetBot/settings/PetCoins/"+UserID+"/3StarBandoriTicket.txt") == false){
     fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/3StarBandoriTicket.txt","0");
  }
  if(fs.existsSync("./PetBot/settings/PetCoins/"+UserID+"/5Servant.txt") == false){
     fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/5Servant.txt","0");
  }
  if(fs.existsSync("././PetBot/settings/PetCoins/"+UserID+"/SRTicketSSRPlus.txt") == false){
     fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/SRTicketSSRPlus.txt","0");
  }
  if(fs.existsSync("./PetBot/settings/PetCoins/"+UserID+"/PetCookies.txt") == false){
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


    var PetCoin2Table = [
  { 
    SRTicketSSRPlus,
    _3StarBandoriTicket,
    _5StarServant,
    PetCookies,
    Diamonds }
  ];



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
  var ChristmasGifts = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/Christmas/Gifts.txt");
  var ChristmasBells = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/Christmas/Bells.txt");
  var HLSY = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/HLSY.txt");
  var LotteryTickets = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/LotteryTickets.txt");

  PetTickets = PetTickets.toString('utf8');
  MakiCookies = MakiCookies.toString('utf8');
  let Crystals = Yen.toString('utf8');
  ChristmasGifts = ChristmasGifts.toString('utf8');
  ChristmasBells = ChristmasBells.toString('utf8');
  HLSY = HLSY.toString('utf8');
  LotteryTickets = LotteryTickets.toString('utf8');

  var EventCurrencyTable = [
  { PetTickets,
    MakiCookies,
    Crystals,
    HLSY,
    LotteryTickets }
  ];

  var ChristmasTable = [
  { ChristmasGifts,
    ChristmasBells }
  ];


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

  var BandoriTable = [
  { PickA3Stars,
    PickA4Stars }
  ];

  console.log(BandoriTable);


  let MessageToSend = "```"+stringTable.create(PetCoinTable)+"```\n```"+stringTable.create(PetCoin2Table)+"```\n```"+stringTable.create(EventCurrencyTable)+"```\n```"+stringTable.create(FishTable)+"```\n```"+stringTable.create(ChristmasTable)+"```\n```"+stringTable.create(BandoriTable)+"```";

  message.channel.send(MessageToSend);


    }
  }