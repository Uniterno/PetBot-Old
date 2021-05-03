const { CommandoClient } = require('discord.js-commando');
const path = require('path');
const fs = require('fs');
const daily = require('./OOP/daily');


const client = new CommandoClient({
    commandPrefix: '!',
    owner: '168389193603612673',
    disableEveryone: true,
    unknownCommandResponse: false
});

client.registry
    // Registers your custom command groups
    .registerGroups([
        ['admin', 'Admin commands / Test / Cutting-edge'],
        ['util', 'Most of the commands'],
    ])

    // Registers all built-in groups, commands, and argument types
    //.registerDefaults()

    // Registers all of your commands in the ./commands/ directory
    .registerCommandsIn(path.join(__dirname, 'commands'));

let Version = "3.0.6";
//Version = "3.0";

client.on('ready', () => {
    console.log('PetBot '+Version+' started!');
    client.user.setActivity('PetBot '+Version, {type: 'STREAMING'});
    let generalChannel = client.channels.cache.get("399993724827860993");
    let petbotChannel = client.channels.cache.get("399997878128345098");
    let lastCheckGeneral = fs.readFileSync("./PetBot/settings/autodaily/LastCheckGeneral.txt");
    let lastCheckPetBot = fs.readFileSync("./PetBot/settings/autodaily/LastCheckPetBot.txt");

    generalChannel.messages.fetch({after: lastCheckGeneral}).then(messages => checkDaily(messages, 'General')).catch(console.error);
    petbotChannel.messages.fetch({after: lastCheckPetBot}).then(messages => checkDaily(messages, 'PetBot')).catch(console.error);

});

client.on('error', () => {
  console.log("An error has occured. Auto-login started.");
  client.login(token).then(console.log("Login successful.")).catch(console.error);
});


function checkDaily(messages, channel){
	let first = true;
    let DateV = new Date();
	messages.forEach(function(message){
		if(first){
			fs.writeFileSync("./PetBot/settings/autodaily/LastCheck" + channel + ".txt", message.id);
			first = false;
		}
	 	if(message.content != ""){
		 	if(message.content.startsWith("!")){
	            console.log("Detected message by: " + message.author.username + " (" + message.content + ") at " + message.createdTimestamp);
	            Streak(message.author.id, DateV, message);
	        }
	 	}
    });
}

function Streak(UserID, DateV, message){
  let UserMaster = JSON.parse(fs.readFileSync("./PetBot/settings/user/master.json"));
  let StreakValid = false;

  let LastSplit = UserMaster[UserID].Login.LastLogin.toString().split('/');

  let LastLogin = parseInt(LastSplit[0]);
  let LastMonth = parseInt(LastSplit[1]);
  let LastYear = parseInt(LastSplit[2]);

  let CurrentDay = parseInt(DateV.getUTCDate());
  let CurrentMonth = parseInt(DateV.getUTCMonth() + 1);

  if(CurrentDay == LastLogin + 1){
    if(CurrentMonth == LastMonth){
        StreakValid = true;
    }
  } else if(CurrentDay == 1){
    if(CurrentMonth == LastMonth + 1){
      StreakValid = true;
    }
  }

  console.log(StreakValid);
  console.log(LastSplit);

  if(StreakValid){
    UserMaster[UserID].Login.Streak++;
    if(UserMaster[UserID].Login.Streak != 1){
    if(UserMaster[UserID].Login.Streak <= 10){
      if(UserMaster[UserID].Login.Streak % 3 == 0){
        //message.channel.send("**【Streak: Consecutive Login "+UserMaster[UserID].Login.Streak+"】**\nDue to your streak, you got 1 Blue Ticket.");
            let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/BlueTicket.txt");
            CurrentAmount = parseInt(CurrentAmount) + 1;
            fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/BlueTicket.txt", CurrentAmount.toString());
      }
      else{
        //message.channel.send("**【Streak: Consecutive Login "+UserMaster[UserID].Login.Streak+"】**\nDue to your streak, you got "+(3*UserMaster[UserID].Login.Streak)+" PetCoins");
            let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt");
            CurrentAmount = parseInt(CurrentAmount) + (3*UserMaster[UserID].Login.Streak);
            fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt", CurrentAmount.toString());
      }
    } else if(UserMaster[UserID].Login.Streak <= 30){
      if(UserMaster[UserID].Login.Streak % 3 == 0){
        //message.channel.send("**【Streak: Consecutive Login "+UserMaster[UserID].Login.Streak+"】**\nDue to your streak, you got 1 SR Ticket.");
            let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/SRTicket.txt");
            CurrentAmount = parseInt(CurrentAmount) + 1;
            fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/SRTicket.txt", CurrentAmount.toString());
      } else{
        //message.channel.send("**【Streak: Consecutive Login "+UserMaster[UserID].Login.Streak+"】**\nDue to your streak, you got "+(4*UserMaster[UserID].Login.Streak)+" PetCoins.");
            let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt");
            CurrentAmount = parseInt(CurrentAmount) + (4*UserMaster[UserID].Login.Streak);
            fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt", CurrentAmount.toString());
      }
    } else if(UserMaster[UserID].Login.Streak <= 40){
      if(UserMaster[UserID].Login.Streak % 4 == 0){
        //message.channel.send("**【Streak: Consecutive Login "+UserMaster[UserID].Login.Streak+"】**\nDue to your streak, you got 1 SSR Ticket.");
            let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/SSRTicket.txt");
            CurrentAmount = parseInt(CurrentAmount) + 1;
            fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/SSRTicket.txt", CurrentAmount.toString());
      } else{
        //message.channel.send("**【Streak: Consecutive Login "+UserMaster[UserID].Login.Streak+"】**\nDue to your streak, you got "+(5*UserMaster[UserID].Login.Streak)+" PetCoins.");
            let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt");
            CurrentAmount = parseInt(CurrentAmount) + (5*UserMaster[UserID].Login.Streak);
            fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt", CurrentAmount.toString());
      } 
    } else if(UserMaster[UserID].Login.Streak <= 50){
      if(UserMaster[UserID].Login.Streak % 4 == 0){
        //message.channel.send("**【Streak: Consecutive Login "+UserMaster[UserID].Login.Streak+"】**\nDue to your streak, you got 20 Maki Cookies.");
            let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/MakiCookies.txt");
            CurrentAmount = parseInt(CurrentAmount) + 20;
            fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/MakiCookies.txt", CurrentAmount.toString());
      } else{
        //message.channel.send("**【Streak: Consecutive Login "+UserMaster[UserID].Login.Streak+"】**\nDue to your streak, you got "+(6*UserMaster[UserID].Login.Streak)+" PetCoins.");
            let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt");
            CurrentAmount = parseInt(CurrentAmount) + (6*UserMaster[UserID].Login.Streak);
            fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt", CurrentAmount);
    } 
  } else if(UserMaster[UserID].Login.Streak <= 55){
      if(UserMaster[UserID].Login.Streak % 3 == 0){
        //message.channel.send("**【Streak: Consecutive Login "+UserMaster[UserID].Login.Streak+"】**\nDue to your streak, you got 100 PetTickets.");
            let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt");
            CurrentAmount = parseInt(CurrentAmount) + 100;
            fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt", CurrentAmount.toString());
      } else if(UserMaster[UserID].Login.Streak % 5 == 0){
        //message.channel.send("**【Streak: Consecutive Login "+UserMaster[UserID].Login.Streak+"】**\nDue to your streak, you got 1 UR Ticket.");
            let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/URTicket.txt");
            CurrentAmount = parseInt(CurrentAmount) + 1;
            fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/URTicket.txt", CurrentAmount.toString());
        } else{
        //message.channel.send("**【Streak: Consecutive Login "+UserMaster[UserID].Login.Streak+"】**\nDue to your streak, you got "+(7*UserMaster[UserID].Login.Streak)+" PetCoins.");
            let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt");
            CurrentAmount = parseInt(CurrentAmount) + (7*UserMaster[UserID].Login.Streak);
            fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt", CurrentAmount.toString());
    }
   } else if(UserMaster[UserID].Login.Streak <= 69){
        //message.channel.send("**【Streak: Consecutive Login "+UserMaster[UserID].Login.Streak+"】**\nDue to your streak, you got "+(8*UserMaster[UserID].Login.Streak)+" PetCoins.");
            let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt");
            CurrentAmount = parseInt(CurrentAmount) + (8*UserMaster[UserID].Login.Streak);
            fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt", CurrentAmount.toString());
   } else if(UserMaster[UserID].Login.Streak <= 79){
        //message.channel.send("**【Streak: Consecutive Login "+UserMaster[UserID].Login.Streak+"】**\nDue to your streak, you got "+Math.floor(UserMaster[UserID].Login.Streak/3)+" PetTickets.");
            let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt");
            CurrentAmount = parseInt(CurrentAmount) + Math.floor(UserMaster[UserID].Login.Streak/3);
            fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt", CurrentAmount.toString());
   }
     else if(UserMaster[UserID].Login.Streak <= 89){
        //message.channel.send("**【Streak: Consecutive Login "+UserMaster[UserID].Login.Streak+"】**\nDue to your streak, you got "+Math.floor(UserMaster[UserID].Login.Streak/3 + 1)+" PetTickets.");
            let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt");
            CurrentAmount = parseInt(CurrentAmount) + Math.floor(UserMaster[UserID].Login.Streak/3 + 1);
            fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt", CurrentAmount.toString());
   }
    else if(UserMaster[UserID].Login.Streak <= 99){
      if(UserMaster[UserID].Login.Streak % 2 == 1){
        //message.channel.send("**【Streak: Consecutive Login "+UserMaster[UserID].Login.Streak+"】**\nDue to your streak, you got "+Math.floor(UserMaster[UserID].Login.Streak/3 + 2)+" PetTickets.");
        let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt");
        CurrentAmount = parseInt(CurrentAmount) + Math.floor(UserMaster[UserID].Login.Streak/3 + 2);
        fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt", CurrentAmount.toString()); 
      } else{
        if(Math.floor(UserMaster[UserID].Login.Streak/40 - 2) == 0){
           //message.channel.send("**【Streak: Consecutive Login "+UserMaster[UserID].Login.Streak+"】**\nDue to your streak, you got 1 Aureus.");
         let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/Aureus.txt");
         CurrentAmount = parseInt(CurrentAmount) + 1;
         fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/Aureus.txt", CurrentAmount.toString());
        } else{
          // message.channel.send("**【Streak: Consecutive Login "+UserMaster[UserID].Login.Streak+"】**\nDue to your streak, you got "+Math.floor(UserMaster[UserID].Login.Streak/40 - 2)+" Aureus.");
         let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/Aureus.txt");
         CurrentAmount = parseInt(CurrentAmount) + Math.floor(UserMaster[UserID].Login.Streak/40 - 2);
         fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/Aureus.txt", CurrentAmount.toString());
          }        
        }
    } else if(UserMaster[UserID].Login.Streak >= 100){
      if(UserMaster[UserID].Login.Streak % 100 == 0){
        //message.channel.send("**【Streak: Consecutive Login "+UserMaster[UserID].Login.Streak+"】**\nDue to your streak, you got 1 Lottery Ticket.");
        let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/LotteryTickets.txt");
        CurrentAmount = parseInt(CurrentAmount) + 1;
        fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/LotteryTickets.txt", CurrentAmount.toString()); 
      } else{
        if(UserMaster[UserID].Login.Streak % 5 == 0){
          // message.channel.send("**【Streak: Consecutive Login "+UserMaster[UserID].Login.Streak+"】**\nDue to your streak, you got 10 PetStars.");
         let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetStars.txt");
         CurrentAmount = parseInt(CurrentAmount) + 10;
         fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetStars.txt", CurrentAmount.toString());
        } else{
          //message.channel.send("**【Streak: Consecutive Login "+UserMaster[UserID].Login.Streak+"】**\nDue to your streak, you got 3 Diamonds and 30 PetTickets.");
          let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/Diamonds.txt");
          CurrentAmount = parseInt(CurrentAmount) + 3;
          fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/Diamonds.txt", CurrentAmount.toString());
          CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt");
          CurrentAmount = parseInt(CurrentAmount) + 30;
          fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt", CurrentAmount.toString());
          }        
        }
    }
  }
    UserMaster[UserID].Login.LastLogin = DateV.getUTCDate() + "/" + (DateV.getUTCMonth()+1) + "/" + DateV.getUTCFullYear();
	UserMaster[UserID].DailyAttack.RemainingStamina = 100;
	UserMaster[UserID].Login.Auto = true;
	let UpdatedJSON = JSON.stringify(UserMaster, null, "\t");
	fs.writeFileSync("./PetBot/settings/user/master.json", UpdatedJSON.toString());
	let petbotChannel = client.channels.cache.get("399997878128345098");
	petbotChannel.send("[Streak] Restored streak for " + message.author.username + " automatically!");
}
}


const token = fs.readFileSync("./PetBot/settings/auth/token.txt", 'utf8');
client.login(token);




