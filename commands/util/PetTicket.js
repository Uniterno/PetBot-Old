const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const fs = require('fs');
const rng = require('random-world');


module.exports = class ItemGacha extends Command {
    constructor(client) {
        super(client, {
            name: 'petticket',
            group: 'util',
            guildOnly: true,
            memberName: 'petticket',
            description: 'Pet Ticket gacha.',
            aliases: ['pt'],
            throttling: {
        usages: 2,
        duration: 1
    },
        });
    }

   run(message, args) {

    console.log(message.content);

  args = message.content.split(' ').slice(1);

  let UserID = message.author.id;
  let DateV = new Date();
  let CurrentDate = DateV.getUTCDate() + "/" + (DateV.getUTCMonth()+1) + "/" + DateV.getUTCFullYear();
  var MasterUser = JSON.parse(fs.readFileSync("./PetBot/settings/user/master.json"));
  let EquippedDivineItemID = MasterUser[UserID].Inventory.DivineItems.Active;
  let EquippedDivineItem = "None";
  if(EquippedDivineItemID != -1){
    EquippedDivineItem = MasterUser[UserID].Inventory.DivineItems.Items[EquippedDivineItemID].Name;
  }
  


  if(fs.existsSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt") == false){
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt","0");
  }
  if(fs.existsSync("./PetBot/settings/PetTicket/TimesPulled/Date_"+UserID+".txt") == false){
    fs.writeFileSync("./PetBot/settings/PetTicket/TimesPulled/Date_"+UserID+".txt","0");
  }
  if(fs.existsSync("./PetBot/settings/PetTicket/TimesPulled/Times_"+UserID+".txt") == false){
    fs.writeFileSync("./PetBot/settings/PetTicket/TimesPulled/Times_"+UserID+".txt","0");
  }

  if(CurrentDate != fs.readFileSync("./PetBot/settings/PetTicket/TimesPulled/Date_"+UserID+".txt")){
    fs.writeFileSync("./PetBot/settings/PetTicket/TimesPulled/Date_"+UserID+".txt",CurrentDate);
    fs.writeFileSync("./PetBot/settings/PetTicket/TimesPulled/Times_"+UserID+".txt", 0);
  }

  let TimesPulledToday = parseInt(fs.readFileSync("./PetBot/settings/PetTicket/TimesPulled/Times_"+UserID+".txt"));

    

  


  var Data = JSON.parse(fs.readFileSync("./PetBot/settings/PetTicket/AvailableItems.json", 'utf8'));

  let Total = Data.PetCoins100 + Data.PetCoins500 + Data.PetCoins1000 + Data.BT + Data.SRTicket + Data.SSRTicket + Data.URTicket + Data.MakiCookies5 + Data.MakiCookies25 + Data.DailyStreakFixer10 + Data.Badge + Data.Aureus10 + Data.PetCookies1 + Data.PetStars5 + Data.Bait10 + Data.SRTicketSSRPlus1 + Data.Butterfly50 + Data.Diamonds5;

  if(Total <= 0){
    message.channel.send("Current pool has no remaining items. Wait for a new box.");
    return;
  }

  let PetCoins100Rate = ((Data.PetCoins100 / Total)*100).toFixed(2);
  let PetCoins500Rate = ((Data.PetCoins500 / Total)*100).toFixed(2);
  let PetCoins1000Rate = ((Data.PetCoins1000 / Total)*100).toFixed(2);
  let BTRate = ((Data.BT / Total)*100).toFixed(2); 
  let SRTicketRate = ((Data.SRTicket / Total)*100).toFixed(2);
  let SSRTicketRate = ((Data.SSRTicket / Total)*100).toFixed(2);
  let URTicketRate = ((Data.URTicket / Total)*100).toFixed(2);
  let MakiCookies5Rate = ((Data.MakiCookies5 / Total)*100).toFixed(2);
  let MakiCookies25Rate = ((Data.MakiCookies25 / Total)*100).toFixed(2);
  let DailyStreakFixer10Rate = ((Data.DailyStreakFixer10 / Total)*100).toFixed(2);
  let BadgeRate = ((Data.Badge / Total)*100).toFixed(2);
  let AureusRate = ((Data.Aureus10 / Total)*100).toFixed(2);
  let PetCookiesRate = ((Data.PetCookies1 / Total)*100).toFixed(2);
  let PetStarsRate = ((Data.PetStars5 / Total)*100).toFixed(2);
  let BaitRate = ((Data.Bait10 / Total)*100).toFixed(2);
  let SRTicketSSRPlusRate = ((Data.SRTicketSSRPlus1 / Total)*100).toFixed(2);
  let Butterfly50Rate = ((Data.Butterfly50 / Total)*100).toFixed(2);
  let Diamonds5Rate = ((Data.Diamonds5 / Total)*100).toFixed(2);

  if(args[0] == "r" || args[0] == "rates"){
    message.channel.send("Box: **"+Data.BoxName+"**\nThere are still "+Total+" items available.\n\n*(Note: All values are rounded to 2 decimals. This may lead to approximation errors causing values to not sum up to 100%. This is only a display issue, and the actual values are precise.)*\n\n**Rates**\n100 PetCoins: "+PetCoins100Rate+"%\n500 PetCoins: "+PetCoins500Rate+"%\n1000 PetCoins: "+PetCoins1000Rate+"%\n1 Blue Ticket: "+BTRate+"%\n1 SR Ticket: "+SRTicketRate+"%\n1 SSR Ticket: "+SSRTicketRate+"%\n1 UR Ticket: "+URTicketRate+"%\n5 MakiCookies: "+MakiCookies5Rate+"%\n25 MakiCookies: "+MakiCookies25Rate+"%\nDaily Streak Fixer (10%): "+DailyStreakFixer10Rate+"%\nBadge ("+Data.BadgeName+"): "+BadgeRate+"%\n10 Aureus: "+AureusRate+"%\n1 PetCookie: "+PetCookiesRate+"%\n5 PetStars: "+PetStarsRate+"%\n10 Bait: "+BaitRate+"%\n1 SR Ticket (SSR+): "+SRTicketSSRPlusRate+"%\n50 Butterflies: " + Butterfly50Rate+"%\n5 Diamonds: " + Diamonds5Rate+"%");
    return;
  }


    let CurrentTime = Math.floor(Date.now() / 1000);
    //let CurrentTime = Date.now();
    let StartTime = parseFloat(fs.readFileSync("./PetBot/settings/PetTicket/StartTime.txt"));

    console.log("Current Time: " + CurrentTime);
    console.log("Start Time " + StartTime);
    console.log("----")

    if(CurrentTime < StartTime){
      message.channel.send("Next PetTicket box is scheduled for: DATE. Please wait until then.");
      return;
    }

  let Item = getRandom(0,Total);

  let Got = "Nothing";
  let Amount = 0;

    let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt");
    CurrentAmount = parseInt(CurrentAmount);

    if(CurrentAmount < Math.round(((20 + TimesPulledToday*3 + (TimesPulledToday/3)) * 1))){
      message.channel.send("Not enough PetTickets. You only have "+CurrentAmount);
      return;
    }

    let Cost = Math.round((20 + TimesPulledToday*3 + (TimesPulledToday/3))*1)
    let CostNext = Math.round((20 + (TimesPulledToday+1)*3 + ((TimesPulledToday+1)/3))*1);

    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt", CurrentAmount - Cost);

  if(Item <= Data.Badge){
    message.channel.send("["+message.author.username+"] (Cost: [Current] "+Cost+" [Next] "+CostNext+" PetTickets) You obtained **Badge ("+Data.BadgeName+")**");
    Data.Badge = Data.Badge - 1;
  } else if(Item <= Data.Badge + Data.DailyStreakFixer10){
    message.channel.send("["+message.author.username+"] (Cost: [Current] "+Cost+" [Next] "+CostNext+" PetTickets) You obtained **Daily Streak Fixer (10%)**");
    Data.DailyStreakFixer10 = Data.DailyStreakFixer10 - 1;
    Got = "StreakFixer";
    Amount = 10;
  } else if(Item <= Data.Badge + Data.DailyStreakFixer10 + Data.MakiCookies25){
    message.channel.send("["+message.author.username+"] (Cost: [Current] "+Cost+" [Next] "+CostNext+" PetTickets) You obtained **25 MakiCookies**");
    Data.MakiCookies25 = Data.MakiCookies25 - 1;
    Got = "MakiCookies";
    Amount = 25;
  } else if(Item <= Data.Badge + Data.DailyStreakFixer10 + Data.MakiCookies25 + Data.MakiCookies5){
    message.channel.send("["+message.author.username+"] (Cost: [Current] "+Cost+" [Next] "+CostNext+" PetTickets) You obtained **5 MakiCookies**");
    Data.MakiCookies5 = Data.MakiCookies5 - 1;
    Got = "MakiCookies";
    Amount = 5;
  } else if(Item <= Data.Badge + Data.DailyStreakFixer10 + Data.MakiCookies25 + Data.MakiCookies5 + Data.URTicket){
    message.channel.send("["+message.author.username+"] (Cost: [Current] "+Cost+" [Next] "+CostNext+" PetTickets) You obtained **1 UR Ticket**");
    Data.URTicket = Data.URTicket - 1;
    Got = "URTicket";
    Amount = 1;
  } else if(Item <= Data.Badge + Data.DailyStreakFixer10 + Data.MakiCookies25 + Data.MakiCookies5 + Data.URTicket + Data.SSRTicket){
    message.channel.send("["+message.author.username+"] (Cost: [Current] "+Cost+" [Next] "+CostNext+" PetTickets) You obtained **1 SSR Ticket**");
    Data.SSRTicket = Data.SSRTicket - 1;
    Got = "SSRTicket";
    Amount = 1;
  } else if(Item <= Data.Badge + Data.DailyStreakFixer10 + Data.MakiCookies25 + Data.MakiCookies5 + Data.URTicket + Data.SSRTicket + Data.SRTicket){
    message.channel.send("["+message.author.username+"] (Cost: [Current] "+Cost+" [Next] "+CostNext+" PetTickets) You obtained **1 SR Ticket**");
    Data.SRTicket = Data.SRTicket - 1;
    Got = "SRTicket";
    Amount = 1;
  } else if(Item <= Data.Badge + Data.DailyStreakFixer10 + Data.MakiCookies25 + Data.MakiCookies5 + Data.URTicket + Data.SSRTicket + Data.SRTicket + Data.BT){
    message.channel.send("["+message.author.username+"] (Cost: [Current] "+Cost+" [Next] "+CostNext+" PetTickets) You obtained **1 BT**");
    Data.BT = Data.BT - 1;
    Got = "BlueTicket";
    Amount = 1;
  } else if(Item <= Data.Badge + Data.DailyStreakFixer10 + Data.MakiCookies25 + Data.MakiCookies5 + Data.URTicket + Data.SSRTicket + Data.SRTicket + Data.BT + Data.PetCoins1000){
    message.channel.send("["+message.author.username+"] (Cost: [Current] "+Cost+" [Next] "+CostNext+" PetTickets) You obtained **1000 PetCoins**");
    Data.PetCoins1000 = Data.PetCoins1000 - 1;
    Got = "PetCoins";
    Amount = 1000;
  } else if(Item <= Data.Badge + Data.DailyStreakFixer10 + Data.MakiCookies25 + Data.MakiCookies5 + Data.URTicket + Data.SSRTicket + Data.SRTicket + Data.BT + Data.PetCoins1000 + Data.PetCoins500){
    message.channel.send("["+message.author.username+"] (Cost: [Current] "+Cost+" [Next] "+CostNext+" PetTickets) You obtained **500 PetCoins**");
    Data.PetCoins500 = Data.PetCoins500 - 1;
    Got = "PetCoins";
    Amount = 500;
  } else if(Item <= Data.Badge + Data.DailyStreakFixer10 + Data.MakiCookies25 + Data.MakiCookies5 + Data.URTicket + Data.SSRTicket + Data.SRTicket + Data.BT + Data.PetCoins1000 + Data.PetCoins500 + Data.PetCoins100){
    message.channel.send("["+message.author.username+"] (Cost: [Current] "+Cost+" [Next] "+CostNext+" PetTickets) You obtained **100 PetCoins**");
    Data.PetCoins100 = Data.PetCoins100 - 1;
    Got = "PetCoins";
    Amount = 100;
  } else if(Item <= Data.Badge + Data.DailyStreakFixer10 + Data.MakiCookies25 + Data.MakiCookies5 + Data.URTicket + Data.SSRTicket + Data.SRTicket + Data.BT + Data.PetCoins1000 + Data.PetCoins500 + Data.PetCoins100 + Data.Aureus10){
    message.channel.send("["+message.author.username+"] (Cost: [Current] "+Cost+" [Next] "+CostNext+" PetTickets) You obtained **10 Aureus**");
    Data.Aureus10 = Data.Aureus10 - 1;
    Got = "Aureus";
    Amount = 10;
  } else if(Item <= Data.Badge + Data.DailyStreakFixer10 + Data.MakiCookies25 + Data.MakiCookies5 + Data.URTicket + Data.SSRTicket + Data.SRTicket + Data.BT + Data.PetCoins1000 + Data.PetCoins500 + Data.PetCoins100 + Data.Aureus10 + Data.PetCookies1){
    message.channel.send("["+message.author.username+"] (Cost: [Current] "+Cost+" [Next] "+CostNext+" PetTickets) You obtained **1 PetCookie**");
    Data.PetCookies1 = Data.PetCookies1 - 1;
    Got = "PetCookies";
    Amount = 1;
  } else if(Item <= Data.Badge + Data.DailyStreakFixer10 + Data.MakiCookies25 + Data.MakiCookies5 + Data.URTicket + Data.SSRTicket + Data.SRTicket + Data.BT + Data.PetCoins1000 + Data.PetCoins500 + Data.PetCoins100 + Data.Aureus10 + Data.PetCookies1 + Data.PetStars5){
    message.channel.send("["+message.author.username+"] (Cost: [Current] "+Cost+" [Next] "+CostNext+" PetTickets) You obtained **5 PetStars**");
    Data.PetStars5 = Data.PetStars5 - 1;
    Got = "PetStars";
    Amount = 5;
  } else if(Item <= Data.Badge + Data.DailyStreakFixer10 + Data.MakiCookies25 + Data.MakiCookies5 + Data.URTicket + Data.SSRTicket + Data.SRTicket + Data.BT + Data.PetCoins1000 + Data.PetCoins500 + Data.PetCoins100 + Data.Aureus10 + Data.PetCookies1 + Data.PetStars5 + Data.Bait10){
    message.channel.send("["+message.author.username+"] (Cost: [Current] "+Cost+" [Next] "+CostNext+" PetTickets) You obtained **10 Bait**");
    Data.Bait10 = Data.Bait10 - 1;
    Got = "Bait";
    Amount = 10;
  } else if(Item <= Data.Badge + Data.DailyStreakFixer10 + Data.MakiCookies25 + Data.MakiCookies5 + Data.URTicket + Data.SSRTicket + Data.SRTicket + Data.BT + Data.PetCoins1000 + Data.PetCoins500 + Data.PetCoins100 + Data.Aureus10 + Data.PetCookies1 + Data.PetStars5 + Data.Bait10 + Data.SRTicketSSRPlus1) {
    message.channel.send("["+message.author.username+"] (Cost: [Current] "+Cost+" [Next] "+CostNext+" PetTickets) You obtained **1 SR Ticket (SSR+)**");
    Data.SRTicketSSRPlus1 = Data.SRTicketSSRPlus1 - 1;
    Got = "SRTicketSSRPlus";
    Amount = 1;
  } else if(Item <= Data.Badge + Data.DailyStreakFixer10 + Data.MakiCookies25 + Data.MakiCookies5 + Data.URTicket + Data.SSRTicket + Data.SRTicket + Data.BT + Data.PetCoins1000 + Data.PetCoins500 + Data.PetCoins100 + Data.Aureus10 + Data.PetCookies1 + Data.PetStars5 + Data.Bait10 + Data.SRTicketSSRPlus1 + Data.Butterfly50){
    message.channel.send("["+message.author.username+"] (Cost: [Current] "+Cost+" [Next] "+CostNext+" PetTickets) You obtained **50 Butterflies**");
    Data.Butterfly50 += -1;
    Got = "Butterflies";
    Amount = 50;
  } else{
    message.channel.send("["+message.author.username+"] (Cost: [Current] "+Cost+" [Next] "+CostNext+" PetTickets) You obtained **5 Diamonds**");
    Data.Diamonds5 += -1;
    Got = "Diamonds";
    Amount = 5;
  }

  if(Got == "PetCoins" && EquippedDivineItem == "Princess of Halloween's Pumpkin"){
    let ChanceToDoublePetCoins = getRandom(0, 100);
    if(ChanceToDoublePetCoins <= 15){
      message.channel.send("Due to your Princess of Halloween's Pumpkin, you have gained an extra " + Amount + " PetCoins!");
      Amount *= 2;
    }
  }

    if(Got != "Nothing" && Got != "Bait" && Got != "StreakFixer"){
      CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/"+Got+".txt");
      CurrentAmount = parseInt(CurrentAmount);
      fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/"+Got+".txt", CurrentAmount+Amount);
    }

    if(Got == "Bait"){
      let UserFish = JSON.parse(fs.readFileSync("./PetBot/settings/fishing/UserData/"+UserID+".json", 'utf8'));
      UserFish.Bait = UserFish.Bait + 10;

      let UserJSON = JSON.stringify(UserFish, null, "\t");
      fs.writeFileSync("./PetBot/settings/fishing/UserData/"+UserID+".json",UserJSON);
    }

    if(Got == "StreakFixer"){
       CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/StreakFixers.txt");
       fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/StreakFixers.txt", CurrentAmount + ", " + Amount + "%");
    }


    fs.writeFileSync("./PetBot/settings/PetTicket/TimesPulled/Times_"+UserID+".txt", parseInt(TimesPulledToday) + 1);
    
    /*message.channel.send("You got " + Cost + " butterflies!");
    CurrentAmount = parseInt(fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/Butterflies.txt"));
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/Butterflies.txt", CurrentAmount + parseInt(Cost)); */


    let FixedJSON = JSON.stringify(Data, null, "\t");
    fs.writeFileSync("./PetBot/settings/PetTicket/AvailableItems.json",FixedJSON);

    /*let ObtainedCandies = 10;
    message.channel.send("You got " + ObtainedCandies + " Candies!");
    let CandiesAmount = parseInt(fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/Candies.txt"));
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/Candies.txt", CandiesAmount + ObtainedCandies);*/




 }
}


function getRandom(min, max) {
    return rng.integer({min, max});
  }