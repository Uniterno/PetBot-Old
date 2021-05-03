const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const fs = require('fs');
const rng = require('random-world');


module.exports = class ItemGacha extends Command {
    constructor(client) {
        super(client, {
            name: 'lotteryticket',
            group: 'util',
            guildOnly: true,
            memberName: 'lotteryticket',
            description: 'Lottery Ticket gacha.',
            aliases: ['lt'],
            throttling: {
        usages: 2,
        duration: 1
    },
        });
    }

   run(message, args) {

    let UserID = message.author.id;

  args = message.content.split(' ').slice(1);

  if(fs.existsSync("./PetBot/settings/PetCoins/"+UserID+"/LotteryTicket.txt") == false){
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/LotteryTicket.txt","0");
  }
  if(fs.existsSync("./PetBot/settings/PetTicket/TimesPulled/Date_"+UserID+".txt") == false){
    fs.writeFileSync("./PetBot/settings/PetTicket/TimesPulled/Date_"+UserID+".txt","0");
  }
  if(fs.existsSync("./PetBot/settings/PetTicket/TimesPulled/Times_"+UserID+".txt") == false){
    fs.writeFileSync("./PetBot/settings/PetTicket/TimesPulled/Times_"+UserID+".txt","0");
  }

  
  var Data = JSON.parse(fs.readFileSync("./PetBot/settings/LotteryTicket/AvailableItems.json", 'utf8'));

  if(Data.Available != true){
    message.channel.send("There are no available items as of right now, please wait.");
    return;
  }

  // All of the code from below hasn't been touched. Need to readjust.

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
    message.channel.send("Box: **"+Data.BoxName+"**\nThere are still "+Total+" items available.\n\n*(Note: All values are rounded to 2 decimals. This may lead to approximation errors causing values to not sum up to 100%. This is only a display issue, and the actual values are precise.)*\n\n**Rates**\n100 PetCoins: "+PetCoins100Rate+"%\n500 PetCoins: "+PetCoins500Rate+"%\n1000 PetCoins: "+PetCoins1000Rate+"%\n1 Blue Ticket: "+BTRate+"%\n1 SR Ticket: "+SRTicketRate+"%\n1 SSR Ticket: "+SSRTicketRate+"%\n1 UR Ticket: "+URTicketRate+"%\n5 Maki Cookies: "+MakiCookies5Rate+"%\n25 Maki Cookies: "+MakiCookies25Rate+"%\nDaily Streak Fixer (10%): "+DailyStreakFixer10Rate+"%\nBadge ("+Data.BadgeName+"): "+BadgeRate+"%\n10 Aureus: "+AureusRate+"%\n1 PetCookie: "+PetCookiesRate+"%\n5 PetStars: "+PetStarsRate+"%\n10 Bait: "+BaitRate+"%\n1 SR Ticket (SSR+): "+SRTicketSSRPlusRate+"%\n50 Butterflies: " + Butterfly50Rate+"%\n5 Diamonds: " + Diamonds5Rate+"%");
    return;
  }


    let CurrentTime = Math.floor(Date.now() / 1000);
    //let CurrentTime = Date.now();
    let StartTime = parseFloat(fs.readFileSync("./PetBot/settings/PetTicket/StartTime.txt"));

    console.log("Current Time: " + CurrentTime);
    console.log("Start Time " + StartTime);
    console.log("----")

    if(CurrentTime < StartTime){
      message.channel.send("Next Lottery Ticket box is scheduled for: September 1st, 2019 @ 00:00 UTC (UNIX: 1567296000). Please wait until then.");
      return;
    }

  let Item = getRandom(0,Total);

  let Got = "Nothing";
  let Amount = 0;

    let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/LotteryTicket.txt");
    CurrentAmount = parseInt(CurrentAmount);

    if(CurrentAmount == 0){
      message.channel.send("Not enough Lottery Tickets. You only have "+CurrentAmount);
      return;
    }

   let Cost = 1;

    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/LotteryTicket.txt", CurrentAmount - Cost);

  if(Item <= Data.Badge){
    message.channel.send("["+message.author.username+"] You obtained **Badge ("+Data.BadgeName+")**");
    Data.Badge = Data.Badge - 1;
  } else if(Item <= Data.Badge + Data.DailyStreakFixer10){
    message.channel.send("["+message.author.username+"] You obtained **Daily Streak Fixer (10%)**");
    Data.DailyStreakFixer10 = Data.DailyStreakFixer10 - 1;
    Got = "StreakFixer";
    Amount = 10;
  } else{
    message.channel.send("["+message.author.username+"] You obtained **5 Diamonds**");
    Data.Diamonds += -1;
    Got = "Diamonds";
    Amount = 5;
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
    
    message.channel.send("You got " + Cost + " butterflies!");
    CurrentAmount = parseInt(fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/Butterflies.txt"));
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/Butterflies.txt", CurrentAmount + parseInt(Cost));


    let FixedJSON = JSON.stringify(Data, null, "\t");
    fs.writeFileSync("./PetBot/settings/PetTicket/AvailableItems.json",FixedJSON);




 }
}


function getRandom(min, max) {
    return rng.integer({min, max});
  }