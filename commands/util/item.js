const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const fs = require('fs');
const rng = require('random-world');


module.exports = class ItemGacha extends Command {
    constructor(client) {
        super(client, {
            name: 'item',
            group: 'util',
            guildOnly: true,
            memberName: 'item',
            description: 'Item Events gacha.',
            examples: [''],
            throttling: {
        usages: 1,
        duration: 1
    },
        });
    }

   run(message, args) {

    /*message.channel.send("Only available during Normal Bandori events.");
    return;*/

    console.log(message.content);

  args = message.content.split(' ').slice(1);

  let ItemDescription = "Crystal";


  let UserID = message.author.id;
    

      if(fs.existsSync("./PetBot/settings/PetCoins/"+UserID+"/Yen.txt") == false){
     fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/Yen.txt","5000");
  }
  

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


  let BoxType = args[0];
  if(!!args[0] == false){
    message.channel.send("You need to pick a box cost. Use **5**, **10**, **20** or **30**.");
    return;
  }

  if(BoxType != '5' && BoxType != '10' && BoxType != '20' && BoxType != '30'){
    message.channel.send("Invalid cost. Use **5**, **10**, **20** or **30**.");
    return;
  }

  let PetCoinRate = -1;
  let MakiCookieRate = -1;
  let BTRate = -1;
  let CroquetteRate = -1;
  let ChocoCornetRate = -1;
  let PetTicketRate = -1;
  let SRTicketRate = -1;
  let SSRTicketRate = -1;
  let MirrorRate = -1;
  let StarPanRate = -1;
  let URTicketRate = -1;
  let SayoRate = -1;
  let OrbsOfDesireRate = -1;
  let AureusRate = -1;
  let PetCookiesRate = -1;
  let PetStarsRate = -1;
  let ButterfliesRate = -1;


  /* if(BoxType == "500"){
    PetCoinRate = 50;
    MakiCookieRate = 50;
    BTRate = 25;
    CroquetteRate = 15;
    ChocoCornetRate = 7;
  } else if(BoxType == "1000"){
    PetCoinRate = 30;
    MakiCookieRate = 48;
    PetTicketRate = 45;
    BTRate = 38;
    SRTicketRate = 24;
    CroquetteRate = 19;
    MirrorRate = 16;
    ChocoCornetRate = 14;
    StarPanRate = 6;
  } else if(BoxType == "5000"){
    MakiCookieRate = 58;
    PetTicketRate = 58;
    BTRate = 43;
    SRTicketRate = 33;
    SSRTicketRate = 21;
    CroquetteRate = 33;
    MirrorRate = 19;
    ChocoCornetRate = 29;
    StarPanRate = 9;
    URTicketRate = 7;
    SayoRate = 5;
  } */


  if(BoxType == "5"){
    PetCoinRate = 45;
    BTRate = 5;
    SRTicketRate = 4;
    SSRTicketRate = 1;
    PetTicketRate = 25;
    ButterfliesRate = 40;

    //OrbsOfDesireRate = 2;
  } else if(BoxType == "10"){
    PetCoinRate = 50;
    MakiCookieRate = 35;
    BTRate = 18;
    SRTicketRate = 5;
    SSRTicketRate = 2;
    PetTicketRate = 40;
    PetStarsRate = 10;
    ButterfliesRate = 50;

    //OrbsOfDesireRate = 5;
  } else if(BoxType == "20"){
    SRTicketRate = 20;
    SSRTicketRate = 20;
    URTicketRate = 3;
    PetTicketRate = 20;
    PetCookiesRate = 1;
    PetStarsRate = 10;
    MakiCookieRate = 60;
    ButterfliesRate = 60;
    //OrbsOfDesireRate = 5;
  } else if(BoxType == "30"){
    BTRate = 50;
    SRTicketRate = 30;
    SSRTicketRate = 20;
    URTicketRate = 4;
    PetTicketRate = 100;
    AureusRate = 1;
    PetCookiesRate = 2;
    PetStarsRate = 10;
    MakiCookieRate = 80;
    ButterfliesRate = 70;
  }




   let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/Yen.txt");
     CurrentAmount = parseInt(CurrentAmount);
     let UsedYen = parseInt(BoxType);

    if(CurrentAmount < UsedYen){
      message.channel.send("Not enough " + ItemDescription);
      return;
      }
     
    
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/Yen.txt", CurrentAmount-UsedYen);
    

  let PetCoinChance = getRandom(0,100);
  let MakiCookieChance = getRandom(0,100);
  let BTChance = getRandom(0,100);
  let CroquetteChance = getRandom(0,100);
  let ChocoCornetChance = getRandom(0,100);
  let PetTicketChance = getRandom(0,100);
  let SRTicketChance = getRandom(0,100);
  let SSRTicketChance = getRandom(0,100);
  let MirrorChance = getRandom(0,100);
  let StarPanChance = getRandom(0,100);
  let URTicketChance = getRandom(0,100);
  let SayoChance = getRandom(0,100);
  let OrbsOfDesireChance = getRandom(0,100);
  let AureusChance = getRandom(0, 100);
  let PetStarsChance = getRandom(0, 100);
  let ButterfliesChance = getRandom(0, 100);

  console.log("Sayo's Chance: "+SayoChance);
  console.log("Sayo's Rate: "+SayoRate);

  let PetCoinAmount = 0;
  let MakiCookieAmount = 0;
  let BTAmount = 0;
  let CroquetteAmount = 0;
  let ChocoCornetAmount = 0;
  let PetTicketAmount = 0;
  let SRTicketAmount = 0;
  let SSRTicketAmount = 0;
  let MirrorAmount = 0;
  let StarPanAmount = 0;
  let URTicketAmount = 0;
  let SayoAmount = 0;
  let OrbsOfDesireAmount = 0;
  let AureusAmount = 0;
  let PetStarsAmount = 0;
  let ButterfliesAmount = 0;

  let ReceivedMessage = "In a "+ BoxType + " " + ItemDescription + " Box, you received the following: \n-----\n";
  let ModifiedString = false;

  if(PetCoinChance <= PetCoinRate){
    PetCoinAmount = 200;
    /*if(BoxType == ""){
      PetCoinAmount = 10;
    }*/
    ReceivedMessage = ReceivedMessage+"PetCoins: "+PetCoinAmount+"\n"
    ModifiedString = true;
  }
  if(MakiCookieChance <= MakiCookieRate){
    MakiCookieAmount = 10;
    /*if(BoxType == "10" || BoxType == "30"){
      MakiCookieAmount = 10;
    }¨*/
    ReceivedMessage = ReceivedMessage+"Maki Cookies: "+MakiCookieAmount+"\n"
    ModifiedString = true;
  }
  if(BTChance <= BTRate){
    BTAmount = 3;
    if(BoxType == "10" || BoxType == "20"){
      BTAmount = 6;
    } else if(BoxType == "30"){
      BTAmount = 8;
    }
    ReceivedMessage = ReceivedMessage+"Blue Tickets: "+BTAmount+"\n"
    ModifiedString = true;
  }
  if(CroquetteChance <= CroquetteRate){
    CroquetteAmount = 1;
    ReceivedMessage = ReceivedMessage+"Croquette: "+CroquetteAmount+"\n"
    ModifiedString = true;
  }
  if(ChocoCornetChance <= ChocoCornetRate){
    ChocoCornetAmount = 1;
    ReceivedMessage = ReceivedMessage+"ChocoCornet: "+ChocoCornetAmount+"\n"
    ModifiedString = true;
  }
  if(PetTicketChance <= PetTicketRate){
    PetTicketAmount = 50;
    ReceivedMessage = ReceivedMessage+"PetTickets: "+PetTicketAmount+"\n"
    ModifiedString = true;
  }
  if(SRTicketChance <= SRTicketRate){
    SRTicketAmount = 1;
    ReceivedMessage = ReceivedMessage+"SR Ticket: "+SRTicketAmount+"\n"
    ModifiedString = true;
  }
  if(SSRTicketChance <= SSRTicketRate){
    SSRTicketAmount = 1;
    ReceivedMessage = ReceivedMessage+"SSR Ticket: "+SSRTicketAmount+"\n"
    ModifiedString = true;
  }
  if(MirrorChance <= MirrorRate){
    MirrorAmount = 1;
    ReceivedMessage = ReceivedMessage+"Mirror: "+MirrorAmount+"\n"
    ModifiedString = true;
  }
  if(StarPanChance <= StarPanRate){
    StarPanAmount = 1;
    ReceivedMessage = ReceivedMessage+"Star Pan: "+StarPanAmount+"\n"
    ModifiedString = true;
  }
  if(URTicketChance <= URTicketRate){
    URTicketAmount = 1;
    ReceivedMessage = ReceivedMessage+"UR Ticket: "+URTicketAmount+"\n"
    ModifiedString = true;
  }
  if(SayoChance <= SayoRate){
    SayoAmount = 1;
    ReceivedMessage = ReceivedMessage+"**Sayo's Pin: "+SayoAmount+"**\n"
    ModifiedString = true;
  }
  if(OrbsOfDesireChance <= OrbsOfDesireRate){
    OrbsOfDesireAmount = 5000;
    ReceivedMessage = ReceivedMessage+"**Orbs of Desire: "+OrbsOfDesireAmount+"**\n"
    ModifiedString = true;
  }
  if(AureusChance <= AureusRate){
    AureusAmount = 5;
    ReceivedMessage = ReceivedMessage+"**Aureus: "+AureusAmount+"**\n"
    ModifiedString = true;
  }
  if(PetStarsChance <= PetStarsRate){
    PetStarsAmount = 20;
    ReceivedMessage = ReceivedMessage+"**PetStars: "+PetStarsAmount+"**\n"
    ModifiedString = true;
  }
  if(ButterfliesChance <= ButterfliesRate){
    ButterfliesAmount = 50;
    ReceivedMessage = ReceivedMessage+"**Butterflies: "+ButterfliesAmount+"**\n"
    ModifiedString = true;
  }

  if(ModifiedString == false){
    ReceivedMessage = "You got nothing in this box.";
  } 



  message.channel.send(ReceivedMessage);


  CurrentAmount = "0";
  let Gained = "0";

  CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt");
  CurrentAmount = parseInt(CurrentAmount);
  Gained = PetCoinAmount;
  fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt", CurrentAmount+Gained);

  CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/MakiCookies.txt");
  CurrentAmount = parseInt(CurrentAmount);
  Gained = MakiCookieAmount;
  fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/MakiCookies.txt", CurrentAmount+Gained);

  CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/BlueTicket.txt");
  CurrentAmount = parseInt(CurrentAmount);
  Gained = BTAmount;
  fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/BlueTicket.txt", CurrentAmount+Gained);

  CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/Croquette.txt");
  CurrentAmount = parseInt(CurrentAmount);
  Gained = CroquetteAmount;
  fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/Croquette.txt", CurrentAmount+Gained);

  CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt");
  CurrentAmount = parseInt(CurrentAmount);
  Gained = PetTicketAmount;
  fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt", CurrentAmount+Gained);

  CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/SRTicket.txt");
  CurrentAmount = parseInt(CurrentAmount);
  Gained = SRTicketAmount;
  fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/SRTicket.txt", CurrentAmount+Gained);

  CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/SSRTicket.txt");
  CurrentAmount = parseInt(CurrentAmount);
  Gained = SSRTicketAmount;
  fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/SSRTicket.txt", CurrentAmount+Gained);

  CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetStars.txt");
  CurrentAmount = parseInt(CurrentAmount);
  Gained = PetStarsAmount;
  fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetStars.txt", CurrentAmount+Gained);

  CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/Mirror.txt");
  CurrentAmount = parseInt(CurrentAmount);
  Gained = MirrorAmount;
  fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/Mirror.txt", CurrentAmount+Gained);

  CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/StarPan.txt");
  CurrentAmount = parseInt(CurrentAmount);
  Gained = StarPanAmount;
  fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/StarPan.txt", CurrentAmount+Gained);

  CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/URTicket.txt");
  CurrentAmount = parseInt(CurrentAmount);
  Gained = URTicketAmount;
  fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/URTicket.txt", CurrentAmount+Gained);

  CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/SayoPin.txt");
  CurrentAmount = parseInt(CurrentAmount);
  Gained = SayoAmount;
  fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/SayoPin.txt", CurrentAmount+Gained);

  CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/ChocoCornet.txt");
  CurrentAmount = parseInt(CurrentAmount);
  Gained = ChocoCornetAmount;
  fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/ChocoCornet.txt", CurrentAmount+Gained);

  CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/Yen.txt");
  CurrentAmount = parseInt(CurrentAmount);
  Gained = OrbsOfDesireAmount;
  fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/Yen.txt", CurrentAmount+Gained);

  CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/Butterflies.txt");
  CurrentAmount = parseInt(CurrentAmount);
  Gained = ButterfliesAmount;
  fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/Butterflies.txt", CurrentAmount+Gained);

  }




}
    


function getRandom(min, max) {
    return rng.integer({min, max});
  }