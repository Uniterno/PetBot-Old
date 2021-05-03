const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const fs = require('fs');
const rng = require('random-world');


module.exports = class Bid extends Command {
    constructor(client) {
        super(client, {
            name: 'bid',
            group: 'util',
            guildOnly: true,
            memberName: 'bid',
            description: 'Challenge Live Event',
            examples: [''],
            throttling: {
        usages: 1,
        duration: 1
    },
        });
    }

   run(message, args) {


    //message.channel.send("The period for this event has finished.");
    //return;

    let CurrentTime = Math.floor(Date.now() / 1000);
    //let CurrentTime = Date.now();
    let FinishTime = parseFloat(fs.readFileSync("./PetBot/settings/Bid/FinishTime.txt"));

    console.log("Current Time: " + CurrentTime);
    console.log("Finish Time " + FinishTime);
    console.log("----")

    if(CurrentTime > FinishTime){
      message.channel.send("The period for this event has finished.");
      return;
    }

    if(CurrentTime + 120 >= FinishTime){
      message.channel.send("Due to sniping rules, bidding time has been extended by 2 minutes!");
      FinishTime = FinishTime + 120;
      fs.writeFileSync("./PetBot/settings/Bid/FinishTime.txt", FinishTime);
    }

    //return;
    
  

    console.log(message.content);

  args = message.content.split(' ').slice(1);


  let UserID = message.author.id;
    

      if(fs.existsSync("./PetBot/settings/PetCoins/"+UserID+"/Yen.txt") == false){
     fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/Yen.txt","0");
  }

  let BidItem = args[0];
  let BidAmount = parseInt(args[1]);

  if(!!BidItem == false || !!BidAmount == false){
    message.channel.send("You need to specifiy an item to bid for and the amount to bid.");
    return;
  }


  if(BidAmount <= 0){
    message.channel.send("You can't bid for less than 1.");
    return;
  }

  let ItemScope = "None";

  if(BidItem == 1 ){
        ItemScope = "5000PetCoins";    
      } else if(BidItem == 2){
        ItemScope = "5000PetCoins2";
      } else if(BidItem == 3){
        ItemScope = "5000PetCoins3";
      } else if(BidItem == 4){
        ItemScope = "5000PetCoins4";
      } else if(BidItem == 5){
        ItemScope = "20Aureus";
      } else if(BidItem == 6){
        ItemScope = "4SRTickets";
      } else if(BidItem == 7){
        ItemScope = "4SRTickets2"
      } else if(BidItem == 8){
        ItemScope = "4SRTickets3"
      } else if(BidItem == 9){
        ItemScope = "2SSRTickets";
      } else if(BidItem == 10){
        ItemScope = "2SSRTickets2";
      } else if(BidItem == 11){
        ItemScope = "20StreakFixer";
      } else if(BidItem == 12){
        ItemScope = "1URTicket";
      } else if(BidItem == 13){
        ItemScope = "1URTicket2";
      } else if(BidItem == 14){
        ItemScope = "100PetTickets";
      } else if(BidItem == 15){
        ItemScope = "100PetTickets2";
      } else if(BidItem == 16){
        ItemScope = "100PetTickets3";
      } else if(BidItem == 17){
        ItemScope = "1PickA3StarsBandoriTicket";
      } else if(BidItem == 18){
        ItemScope = "Badge";
      } else if(BidItem == 19){
        ItemScope = "Badge2";
      } else if(BidItem == 20){
        ItemScope = "PetCookies5";
      } else if(BidItem == 21){
        ItemScope = "PetStars25";
      } else{
        message.channel.send("That item doesn't exist!");
        return;
      }

      if(ItemScope == "None"){
        message.channel.send("Error: Can't find Item Scope. This is most likely a coding error, please let Uni know.");
        return;
      }

   let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/Yen.txt");
   CurrentAmount = parseInt(CurrentAmount);

    var BidData = JSON.parse(fs.readFileSync("./PetBot/settings/bid/bid.json", 'utf8'));

    if(BidData[ItemScope] == UserID){
      CurrentAmount = CurrentAmount + parseInt(BidData[ItemScope+"Bid"]);
    }

    if(CurrentAmount < BidAmount){
      message.channel.send("Not enough Snowboard Tokens.");
      return;
      }

    if(BidAmount <= BidData[ItemScope+"Bid"]){
          message.channel.send("You need to bid at least "+(parseInt(BidData[ItemScope+"Bid"])+1)+" Snowboard Tokens for this item.");
          return;
        }

    if(BidData[ItemScope] == UserID){
      CurrentAmount = CurrentAmount - parseInt(BidData[ItemScope+"Bid"]);
    }

    
    console.log("BidAmount: "+BidAmount);
    console.log("CurrentAmount: "+CurrentAmount);
    CurrentAmount = CurrentAmount - BidAmount;

    console.log("CurrentAmount (after - BidAmount): "+CurrentAmount);
    
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/Yen.txt",CurrentAmount);

     
  if(BidData[ItemScope] != 0){
        let PreviousUserCurrentTokens = parseInt(fs.readFileSync("./PetBot/settings/PetCoins/"+BidData[ItemScope]+"/Yen.txt"));
        if(PreviousUserCurrentTokens != 0){
              fs.writeFileSync("./PetBot/settings/PetCoins/"+BidData[ItemScope]+"/Yen.txt",PreviousUserCurrentTokens+parseInt(BidData[ItemScope+"Bid"]));
        }
        else{
              fs.writeFileSync("./PetBot/settings/PetCoins/"+BidData[ItemScope]+"/Yen.txt",parseInt(BidData[ItemScope+"Bid"]));

        }
     }
      

       BidData[ItemScope] = UserID;
       BidData[ItemScope+"Bid"] = BidAmount;

       let UpdatedJSON = JSON.stringify(BidData, null, "\t");
      fs.writeFileSync("./PetBot/settings/bid/bid.json",UpdatedJSON);

      message.channel.send("You have bid "+BidAmount+" Snowboard Tokens for the following item: "+ItemScope);


  }
}