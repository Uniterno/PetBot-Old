module.exports = {
	DailySupport: function(fs, UserID){
		args = args.split(' ');

		let LastDaily = 0;

		return FullArg;

	},
}

function Streak(UserID, DateV, message, UserMaster){
  
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


  if(StreakValid == true){
    UserMaster[UserID].Login.Streak++;
    if(UserMaster[UserID].Login.Streak != 1){
    if(UserMaster[UserID].Login.Streak <= 10){
      if(UserMaster[UserID].Login.Streak % 3 == 0){
        message.channel.send("**【Streak: Consecutive Login "+UserMaster[UserID].Login.Streak+"】**\nDue to your streak, you got 1 Blue Ticket.");
            let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/BlueTicket.txt");
            CurrentAmount = parseInt(CurrentAmount) + 1;
            fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/BlueTicket.txt", CurrentAmount);
      }
      else{
        message.channel.send("**【Streak: Consecutive Login "+UserMaster[UserID].Login.Streak+"】**\nDue to your streak, you got "+(3*UserMaster[UserID].Login.Streak)+" PetCoins");
            let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt");
            CurrentAmount = parseInt(CurrentAmount) + (3*UserMaster[UserID].Login.Streak);
            fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt", CurrentAmount);
      }
    } else if(UserMaster[UserID].Login.Streak <= 30){
      if(UserMaster[UserID].Login.Streak % 3 == 0){
        message.channel.send("**【Streak: Consecutive Login "+UserMaster[UserID].Login.Streak+"】**\nDue to your streak, you got 1 SR Ticket.");
            let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/SRTicket.txt");
            CurrentAmount = parseInt(CurrentAmount) + 1;
            fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/SRTicket.txt", CurrentAmount);
      } else{
        message.channel.send("**【Streak: Consecutive Login "+UserMaster[UserID].Login.Streak+"】**\nDue to your streak, you got "+(4*UserMaster[UserID].Login.Streak)+" PetCoins.");
            let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt");
            CurrentAmount = parseInt(CurrentAmount) + (4*UserMaster[UserID].Login.Streak);
            fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt", CurrentAmount);
      }
    } else if(UserMaster[UserID].Login.Streak <= 40){
      if(UserMaster[UserID].Login.Streak % 4 == 0){
        message.channel.send("**【Streak: Consecutive Login "+UserMaster[UserID].Login.Streak+"】**\nDue to your streak, you got 1 SSR Ticket.");
            let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/SSRTicket.txt");
            CurrentAmount = parseInt(CurrentAmount) + 1;
            fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/SSRTicket.txt", CurrentAmount);
      } else{
        message.channel.send("**【Streak: Consecutive Login "+UserMaster[UserID].Login.Streak+"】**\nDue to your streak, you got "+(5*UserMaster[UserID].Login.Streak)+" PetCoins.");
            let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt");
            CurrentAmount = parseInt(CurrentAmount) + (5*UserMaster[UserID].Login.Streak);
            fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt", CurrentAmount);
      } 
    } else if(UserMaster[UserID].Login.Streak <= 50){
      if(UserMaster[UserID].Login.Streak % 4 == 0){
        message.channel.send("**【Streak: Consecutive Login "+UserMaster[UserID].Login.Streak+"】**\nDue to your streak, you got 20 Maki Cookies.");
            let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/MakiCookies.txt");
            CurrentAmount = parseInt(CurrentAmount) + 20;
            fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/MakiCookies.txt", CurrentAmount);
      } else{
        message.channel.send("**【Streak: Consecutive Login "+UserMaster[UserID].Login.Streak+"】**\nDue to your streak, you got "+(6*UserMaster[UserID].Login.Streak)+" PetCoins.");
            let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt");
            CurrentAmount = parseInt(CurrentAmount) + (6*UserMaster[UserID].Login.Streak);
            fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt", CurrentAmount);
    } 
  } else if(UserMaster[UserID].Login.Streak <= 55){
      if(UserMaster[UserID].Login.Streak % 3 == 0){
        message.channel.send("**【Streak: Consecutive Login "+UserMaster[UserID].Login.Streak+"】**\nDue to your streak, you got 100 PetTickets.");
            let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt");
            CurrentAmount = parseInt(CurrentAmount) + 100;
            fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt", CurrentAmount);
      } else if(UserMaster[UserID].Login.Streak % 5 == 0){
        message.channel.send("**【Streak: Consecutive Login "+UserMaster[UserID].Login.Streak+"】**\nDue to your streak, you got 1 UR Ticket.");
            let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/URTicket.txt");
            CurrentAmount = parseInt(CurrentAmount) + 1;
            fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/URTicket.txt", CurrentAmount);
        } else{
        message.channel.send("**【Streak: Consecutive Login "+UserMaster[UserID].Login.Streak+"】**\nDue to your streak, you got "+(7*UserMaster[UserID].Login.Streak)+" PetCoins.");
            let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt");
            CurrentAmount = parseInt(CurrentAmount) + (7*UserMaster[UserID].Login.Streak);
            fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt", CurrentAmount);
    }
   } else if(UserMaster[UserID].Login.Streak <= 69){
        message.channel.send("**【Streak: Consecutive Login "+UserMaster[UserID].Login.Streak+"】**\nDue to your streak, you got "+(8*UserMaster[UserID].Login.Streak)+" PetCoins.");
            let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt");
            CurrentAmount = parseInt(CurrentAmount) + (8*UserMaster[UserID].Login.Streak);
            fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt", CurrentAmount);
   } else if(UserMaster[UserID].Login.Streak <= 79){
        message.channel.send("**【Streak: Consecutive Login "+UserMaster[UserID].Login.Streak+"】**\nDue to your streak, you got "+Math.floor(UserMaster[UserID].Login.Streak/3)+" PetTickets.");
            let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt");
            CurrentAmount = parseInt(CurrentAmount) + Math.floor(UserMaster[UserID].Login.Streak/3);
            fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt", CurrentAmount);
   }
     else if(UserMaster[UserID].Login.Streak <= 89){
        message.channel.send("**【Streak: Consecutive Login "+UserMaster[UserID].Login.Streak+"】**\nDue to your streak, you got "+Math.floor(UserMaster[UserID].Login.Streak/3 + 1)+" PetTickets.");
            let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt");
            CurrentAmount = parseInt(CurrentAmount) + Math.floor(UserMaster[UserID].Login.Streak/3 + 1);
            fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt", CurrentAmount);
   }
    else if(UserMaster[UserID].Login.Streak <= 99){
      if(UserMaster[UserID].Login.Streak % 2 == 1){
        message.channel.send("**【Streak: Consecutive Login "+UserMaster[UserID].Login.Streak+"】**\nDue to your streak, you got "+Math.floor(UserMaster[UserID].Login.Streak/3 + 2)+" PetTickets.");
        let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt");
        CurrentAmount = parseInt(CurrentAmount) + Math.floor(UserMaster[UserID].Login.Streak/3 + 2);
        fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt", CurrentAmount); 
      } else{
        if(Math.floor(UserMaster[UserID].Login.Streak/40 - 2) == 0){
           message.channel.send("**【Streak: Consecutive Login "+UserMaster[UserID].Login.Streak+"】**\nDue to your streak, you got 1 Aureus.");
         let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/Aureus.txt");
         CurrentAmount = parseInt(CurrentAmount) + 1;
         fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/Aureus.txt", CurrentAmount);
        } else{
           message.channel.send("**【Streak: Consecutive Login "+UserMaster[UserID].Login.Streak+"】**\nDue to your streak, you got "+Math.floor(UserMaster[UserID].Login.Streak/40 - 2)+" Aureus.");
         let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/Aureus.txt");
         CurrentAmount = parseInt(CurrentAmount) + Math.floor(UserMaster[UserID].Login.Streak/40 - 2);
         fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/Aureus.txt", CurrentAmount);
          }        
        }
    } else if(UserMaster[UserID].Login.Streak >= 100){
      if(UserMaster[UserID].Login.Streak % 100 == 0){
        message.channel.send("**【Streak: Consecutive Login "+UserMaster[UserID].Login.Streak+"】**\nDue to your streak, you got 1 Lottery Ticket.");
        let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/LotteryTickets.txt");
        CurrentAmount = parseInt(CurrentAmount) + 1;
        fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/LotteryTickets.txt", CurrentAmount); 
      } else{
        if(UserMaster[UserID].Login.Streak % 5 == 0){
           message.channel.send("**【Streak: Consecutive Login "+UserMaster[UserID].Login.Streak+"】**\nDue to your streak, you got 10 PetStars.");
         let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetStars.txt");
         CurrentAmount = parseInt(CurrentAmount) + 10;
         fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetStars.txt", CurrentAmount);
        } else{
          message.channel.send("**【Streak: Consecutive Login "+UserMaster[UserID].Login.Streak+"】**\nDue to your streak, you got 3 Diamonds and 30 PetTickets.");
          let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/Diamonds.txt");
          CurrentAmount = parseInt(CurrentAmount) + 3;
          fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/Diamonds.txt", CurrentAmount);
          CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt");
          CurrentAmount = parseInt(CurrentAmount) + 30;
          fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt", CurrentAmount);
          }        
        }
        
    }
  }
} else{
    UserMaster[UserID].Login.Streak = 1;
    message.channel.send("**【Streak Broken】**\nSadly, you have broken your streak.");
  }

  UserMaster[UserID].Login.LastLogin = DateV.getUTCDate() + "/" + (DateV.getUTCMonth()+1) + "/" + DateV.getUTCFullYear();

 let UpdatedJSON = JSON.stringify(UserMaster, null, "\t");
 fs.writeFileSync("./PetBot/settings/user/master.json",UpdatedJSON);

 //message.channel.send(new Discord.Attachment('merryxmas.jpg'));
 //message.channel.send(new Discord.Attachment('merryxmas2.jpg'));

}