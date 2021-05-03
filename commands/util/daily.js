const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const fs = require('fs');
const rng = require('random-world');
const daily = require('C:/Users/Uniterno/PetBotTry/PetBot/OOP/daily');


module.exports = class DailyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'daily',
            group: 'util',
            guildOnly: true,
            memberName: 'daily',
            description: 'Gives daily PetCoins.',
            throttling: {
        usages: 1,
        duration: 1
    },
        });
    }

   run(message, args) {

   	let UserID = message.author.id;

   	let StampsArray = ["https://i.bandori.party/u/asset/e/NfwoclStamps-Huh-bXgpaA.png", "https://i.bandori.party/u/asset/e/1071A-Fleeting-Night-s-Dream-Night-mClz7c.png", "https://i.bandori.party/u/asset/e/1075Who-s-the-Chocolate-For-Gulp-ObPBrv.png", "https://i.bandori.party/u/asset/e/948Arisa-s-Not-Terrible-Day-Off-Just-a-sec-5V1hw7.png", "https://i.bandori.party/u/asset/e/953Backstage-Method-Sorry-for-the-wait-9I5Fxq.png", "https://i.bandori.party/u/asset/e/195Hello-Happy-Adventure-Smiling-Sleeping-Treasure-Island-Sorry-UVjY2o.png", "https://i.bandori.party/u/asset/e/190Neo-Aspect-Next-time-9Dyoj6.png", "https://i.bandori.party/u/asset/e/8xBwKNStamps-I-m-sorry-SuUFSz.png", "https://i.bandori.party/u/asset/e/TMSweWStamps-What-a-great-idea-v6terp.png", "https://i.bandori.party/u/asset/e/RN0Y0PStamps-This-is-getting-interesting-qic8Ru.png", "https://i.bandori.party/u/asset/e/r4ojjqStamps-Oh-well-vQbg85.png", "https://i.bandori.party/u/asset/e/yB3nFuStamps-Are-you-okay-kBLUtL.png", "https://i.bandori.party/u/asset/e/bca347Stamps-There-s-no-way-8veckQ.png", "https://i.bandori.party/u/asset/e/jJ6MDjStamps-Something-big-is-coming-NFP9lh.png", "https://i.bandori.party/u/asset/e/DZrLEuStamps-Fuee-m6Xr42.png", "https://i.bandori.party/u/asset/e/eMQPBBStamps-Same-as-always-hmzdDp.png"];

   	let Val = getRandom(-1, StampsArray.length - 1);

   	//message.channel.send("This command is unavailable for the current time due to an update in process.");
   	//message.channel.send(new Discord.Attachment(StampsArray[Val]));
   	//return;
     

     let UserMaster = JSON.parse(fs.readFileSync("./PetBot/settings/user/master.json"));
     let DateV = new Date();
     let LastLogin = fs.readFileSync("./PetBot/settings/Aureus/LastDay.txt");
     let CurrentDate = DateV.getUTCDate() + "/" + (DateV.getUTCMonth()+1) + "/" + DateV.getUTCFullYear();
     let PetCoinValue = fs.readFileSync("./PetBot/settings/Aureus/PetCoinValue.txt");
     let PetTicketValue = fs.readFileSync("./PetBot/settings/Aureus/PetTicketValue.txt");
     let Partner = UserMaster[UserID].Partner.Character;
     let Costume = UserMaster[UserID].Partner.Costume;

     let AutomaticallyFixedStreak = UserMaster[UserID].Login.Auto;

    if(LastLogin != CurrentDate || (LastLogin == CurrentDate && AutomaticallyFixedStreak)){
      UserMaster[UserID].Login.Auto = false;
      if(PetCoinValue*0.1 > 1){
        PetCoinValue = parseInt(PetCoinValue) + (parseInt(getRandom(1, PetCoinValue*0.1)));
      } else{
        PetCoinValue = parseInt(PetCoinValue) + 1;
      }

      if(PetTicketValue*0.1 > 1){
        PetTicketValue = parseInt(PetTicketValue) + (parseInt(getRandom(1, PetTicketValue*0.1)));
      } else{
        PetTicketValue = parseInt(PetTicketValue) + 1;
      }

    fs.writeFileSync("./PetBot/settings/Aureus/PetCoinValue.txt", PetCoinValue.toString());
    fs.writeFileSync("./PetBot/settings/Aureus/PetTicketValue.txt", PetTicketValue.toString());
    fs.writeFileSync("./PetBot/settings/Aureus/LastDay.txt", CurrentDate.toString());

  }


  if(fs.existsSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt") == false){
     fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt", "3000");
  }
  if(fs.existsSync("./PetBot/settings/PetCoins/"+UserID+"/SRTicket.txt") == false){
     fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/SRTicket.txt", "0");
  }
  if(fs.existsSync("./PetBot/settings/PetCoins/"+UserID+"/SSRTicket.txt") == false){
     fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/SSRTicket.txt", "0");
  }
  if(fs.existsSync("./PetBot/settings/PetCoins/"+UserID+"/URTicket.txt") == false){
     fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/URTicket.txt", "1");
  }
  
  if(fs.existsSync("./PetBot/settings/PetCoins/"+UserID+"/PickA3Stars.txt") == false){
     fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PickA3Stars.txt", "0");
  }

  if(fs.existsSync("./PetBot/settings/PetCoins/"+UserID+"/PickA4Stars.txt") == false){
     fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PickA4Stars.txt", "0");
  }

  if(!!UserMaster[UserID].Login.TotalLogin == false){
    UserMaster[UserID].Login.TotalLogin = 1;
  }

  if(!!UserMaster[UserID].Login.LastLogin == false){
    UserMaster[UserID].Login.LastLogin = "First time";
  }

  if(!!UserMaster[UserID].Login.Streak == false){
    UserMaster[UserID].Login.Streak = "0";
  }

   if(fs.existsSync("./PetBot/settings/PetCoins/"+UserID+"/PetCookies.txt") == false){
     fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCookies.txt","0");
   } 

   if(CurrentDate == UserMaster[UserID].Login.LastLogin && !AutomaticallyFixedStreak){
    let HoursLeftNextDay = (DateV.getUTCHours() - 23) * -1;
    let MinutesLeftNextDay = (DateV.getUTCMinutes() - 59) * -1;
    let SecondsLeftNextDay = (DateV.getUTCSeconds() - 59) * -1;

    if(HoursLeftNextDay <= 9){
      HoursLeftNextDay = "0"+HoursLeftNextDay;
    }
    if(MinutesLeftNextDay <= 9){
      MinutesLeftNextDay = "0"+MinutesLeftNextDay;
    }
    if(SecondsLeftNextDay <= 9){
      SecondsLeftNextDay = "0"+SecondsLeftNextDay;
    }

    let FormattedTimeLeftNextDay = HoursLeftNextDay + ":" + MinutesLeftNextDay + ":" + SecondsLeftNextDay;

    message.channel.send("You can't receive daily login bonus rewards twice per day. Time before next day (UTC): "+FormattedTimeLeftNextDay);
    return;
  } else if(Partner == null){
  	message.channel.send("You need to set a partner first!");
  	return;
  } else {
     UserMaster[UserID].Login.Auto = false;
     let WeekDay = DateV.getUTCDay();
     let ReceivedAmount = 0;
     let ReceivedItem = null;
     let DayString = null;
     let SIFASChance = {};
     switch(WeekDay){
     	case 0: // Sunday
     		ReceivedAmount = 1000;
     		ReceivedItem = "PetCoins";
     		DayString = "Sunday";
     		SIFASChance = {
     			"Macaron 1⋆": 50,
     			"Macaron 2⋆": 40,
     			"Macaron 3⋆": 30,
     			"Seeds": 10,
     			"Books": 10,
     			"Rainbow Necklace": 25,
     			"Skill Ticket": 5
     		}
     		break;
     	case 1:
     		ReceivedAmount = 500;
     		ReceivedItem = "PetCoins";
     		DayString = "Monday";
     		SIFASChance = {
     			"Macaron 1⋆": 30,
     			"Macaron 2⋆": 30,
     			"Macaron 3⋆": 30,
     			"Seeds": 20,
     			"Books": 20,
     			"Rainbow Necklace": 10,
     			"Skill Ticket": 1
     		}
     		break;
     	case 2:
     		ReceivedAmount = 20;
     		ReceivedItem = "PetTicket";
     		DayString = "Tuesday";
     		SIFASChance = {
     			"Macaron 1⋆": 15,
     			"Macaron 2⋆": 100,
     			"Macaron 3⋆": 15,
     			"Seeds": 15,
     			"Books": 15,
     			"Rainbow Necklace": 5,
     			"Skill Ticket": 1
     		}
     		break;
     	case 3:
     		ReceivedAmount = 5;
     		ReceivedItem = "PetStars";
     		DayString = "Thursday";
     		SIFASChance = {
     			"Macaron 1⋆": 5,
     			"Macaron 2⋆": 25,
     			"Macaron 3⋆": 100,
     			"Seeds": 5,
     			"Books": 20,
     			"Rainbow Necklace": 0,
     			"Skill Ticket": 1
     		}
     		break;
     	case 4:
     		ReceivedAmount = 10;
     		ReceivedItem = "Diamonds";
     		DayString = "Wednesday";
     		SIFASChance = {
     			"Macaron 1⋆": 100,
     			"Macaron 2⋆": 5,
     			"Macaron 3⋆": 5,
     			"Seeds": 5,
     			"Books": 5,
     			"Rainbow Necklace": 15,
     			"Skill Ticket": 2
     		}
     		break;
     	case 5:
     		ReceivedAmount = 0;
     		ReceivedItem = null;
     		DayString = "Friday";
     		SIFASChance = {
     			"Macaron 1⋆": 10,
     			"Macaron 2⋆": 10,
     			"Macaron 3⋆": 10,
     			"Seeds": 80,
     			"Books": 80,
     			"Rainbow Necklace": 20,
     			"Skill Ticket": 1
     		}
     		break;
     	case 6:
     		ReceivedAmount = 1000;
     		ReceivedItem = "PetCoins";
     		DayString = "Saturday";
     		SIFASChance = {
     			"Macaron 1⋆": 0,
     			"Macaron 2⋆": 0,
     			"Macaron 3⋆": 0,
     			"Seeds": 50,
     			"Books": 50,
     			"Rainbow Necklace": 100,
     			"Skill Ticket": 1
     		}
     		break;
     }

     //let DailyReceived = 0;


     
     let DailyReceived = Math.floor((((1+(UserMaster[UserID].Login.TotalLogin*4.25)) + (UserMaster[UserID].Login.Streak*1.5) + Math.sqrt(UserMaster[UserID].Login.TotalLogin*10)*5.15) + 23)*0.73);
     DailyReceived = DailyReceived * 0.7;
     DailyReceived -= getRandom(0, 100);
     DailyReceived = Math.floor(DailyReceived * 0.5);
     if(DailyReceived < 0){
      DailyReceived = 1;
     } /*

     if(CurrentDate == "8/1/2019"){
      DailyReceived = DailyReceived*5;
     }

     if(CurrentDate == "6/12/2019" || CurrentDate == "7/12/2019" || CurrentDate == "8/12/2019" || CurrentDate == "9/12/2019" || CurrentDate == "10/12/2019"){
      DailyReceived = DailyReceived*10;
     }

     if(CurrentDate == "23/11/2019" || CurrentDate == "24/11/2019"){
      DailyReceived = DailyReceived*2;
     }

     // DailyReceived = DailyReceived*3; // Butterfly Reward */
     
    if(ReceivedItem != null){
         let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/" + ReceivedItem + ".txt");
        CurrentAmount = parseInt(CurrentAmount) + ReceivedAmount;
        fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/" + ReceivedItem + ".txt", CurrentAmount.toString());
    }
   
   	message.channel.send("**【Total Login Bonus: Day "+UserMaster[UserID].Login.TotalLogin+"】**\nYou've received "+DailyReceived+" PetCoins as a daily login bonus.");


    UserMaster[UserID].Login.TotalLogin++;


    if(ReceivedItem != null){
         message.channel.send("**【" + DayString + " Login Bonus】** You have received: " + ReceivedAmount + " " + ReceivedItem);
     } else{
        message.channel.send("**【" + DayString + " Login Bonus】** You have received: Nothing. Fridays are SIFAS items days.");
     }
   
    let PartnerQuote = Partner + ": ";
    let SpecialDay = -1;
    console.log("WeekDay: " + WeekDay);
    if(SpecialDay == -1){
	    switch(Partner){
            case "Kotori":
                switch(WeekDay){
                    case 3:
                        PartnerQuote += "Fufu~ You look tired, I have prepared berries and a lot of water so you can eat, or would you prefer to have a bath first?";
                        break;
                    case 4:
                        PartnerQuote += "Come here, come here! The new season just started... hehe, want to watch it with me?";
                        break;
                    case 5:
                        PartnerQuote += "It's finally Friday! I'll make some costumes, what color should I try today?";
                        break;
                    case 6:
                        PartnerQuote += "It's so hot! I'm so sweaty... aah, I'm going to take a bath...";
                        break;
                }
                break;     
	    	case "Rin":
	    		switch(WeekDay){
	    			case 3:
	    				PartnerQuote += "Nya Nya Nya! Welcome back! I got matching cat costumes! Wannya wear them?";
	    				break;
                    case 4:
                        PartnerQuote += "Nyaaaaaa! I'm so sleepy... hey, can I sleep with you tonight?";
                        break;
                    case 5:
                        PartnerQuote += "Friday nya~! I got some cupcakes for us, shoul we eat them while we watch your favorite series?";
                        break;
                    case 6:
                        PartnerQuote += "The best for this weather is ice cream, nya!";
                        break;
	    		}
	    		break;
            case "Nozomi":
                switch(WeekDay){
                    case 5:
                        PartnerQuote += "Eli is holding a study session today. And of course we're forcing Honoka and Nico, ah, you too want to come, right? RIGHT?";
                        break;
                    case 6:
                        PartnerQuote += "Fufufu~ come here, it's time for your reward...";
                        break;
                }
                break;
	    	case "Chika":
	    		switch(WeekDay){
	    			case 3:
	    				PartnerQuote += "Welcome back! Having you with me makes waiting for Friday not a burden! Want to go get some Mikan?";
	    				break;
                    case 4:
                        PartnerQuote += "I went to the beach with Riko today... fua~ that was nice... homework? HOMEWORK!";
                        break;
                    case 5:
                        PartnerQuote += "*yawn* Finally Friday... I want to sleep...";
                        break;
                    case 6:
                        PartnerQuote += "In days like these is when I'm glad I got to meet you...";
                        break;
	    		}
	    		break;
            case "Riko":
                switch(WeekDay){
                    case 3:
                        PartnerQuote += "Hello. I have been waiting for you, there's still homework to do, remember? Let's do it before anything else.";
                        break;
                    case 4:
                        PartnerQuote += "Chika and I went to the beach today, I got this for you, I hope you like it...";
                        break;
                    case 5:
                        PartnerQuote += "Hehe, that Chika taking Friday to sleep... well, I admit I don't want to start with my homework either";
                        break;
                    case 6:
                        PartnerQuote += "I'm handing these sandwiches to everyone today. You can wait for me in my room, I'll be back soon.";
                        break;
                }
                break;
	    	case "Dia":
	    		switch(WeekDay){
	    			case 3:
	    				PartnerQuote += "Hello. Good work, coming again today. I made matcha tea, I'll go serve you a cup.";
	    				break;
                    case 4:
                        PartnerQuote += "Oh, hello. I was just about to start my homework, would you mind tagging along with me?";
                        break;
                    case 5:
                        PartnerQuote += "Ruby and I will go to the onsen today, will you tag along?";
                        break;
                    case 6:
                        PartnerQuote += "Uwa~ today's so hot and Ruby is not here... what should I do? Do you have any idea?";
                        break;
	    		}
	    		break;
	    	case "Ruby":
	    		switch(WeekDay){
	    			case 3:
	    				PartnerQuote += "Hi, welcome back! Want to go to the beach?";
                        break;
                    case 4:
                        PartnerQuote += "Onee-chan helped me with my homework today. Ah, having her is awesome. I love Onee-chan.";
                        break;
                    case 5:
                        PartnerQuote += "Onsen with Onee-chan! Do you want to come too?";
                        break;
                    case 6:
                        PartnerQuote += "I've always thought Hanamaru's place was awesome... don't you think so too?";
                        break;
	    		}
                break;
          case "Yohane":
                switch(WeekDay){
                    case 3:
                        PartnerQuote += "Little Demon! What were you doing? There's still job to do!";
                        break;
                    case 4:
                        PartnerQuote += "What's with everyone today!? Nobody is answering the phone... oh, Little Demon! I'm glad you came!";
                        break;
                    case 5:
                        PartnerQuote += "Kukuku... THE FINAL DAY HAS COME UPON US!";
                        break;
                    case 6:
                        PartnerQuote += "This place is full of spiritness... thank you, Zuramaru.";
                        break;
                }
                break;
	    }
    }

    console.log(Costume);
    if(Costume == -1){
    	PartnerQuote += "\n(Remember that you can select a costume to be displayed here! Unlock new SIFAS costumes by training your cards.)";
    	message.channel.send(PartnerQuote);
    } else{
    	message.channel.send(PartnerQuote);
    	message.channel.send(new Discord.Attachment(Costume)); // to adjust Costume;
    }

  
    let SIFASItems = ["Macaron 1⋆", "Macaron 2⋆", "Macaron 3⋆", "Seeds", "Books", "Rainbow Necklace", "Skill Ticket"];
    let SIFASItemsRNG = 0;
    let ObtainedQuote = "You have received the following SIFAS items: \n";
    let CurrentAmountSIFASItem = 0;
    for(let i = 0; i < 7; i++){
    	SIFASItemsRNG = getRandom(0, 100);
    	if(SIFASItemsRNG <= SIFASChance[SIFASItems[i]]){
    		ObtainedQuote += "- " + SIFASItems[i] + "\n";
    		if(i == 6){ // Skill Ticket
    			UserMaster[UserID].SIFAS.Inventory[SIFASItems[i]] += 1;
    		} else {
    			UserMaster[UserID].SIFAS.Inventory[SIFASItems[i]] += getRandom(9, 50);
    		}
    	}
    }
    message.channel.send(ObtainedQuote);

    
    if(!AutomaticallyFixedStreak){
        Streak(UserID, DateV, message, UserMaster);
    } else{
        let UpdatedJSON = JSON.stringify(UserMaster, null, "\t");
        fs.writeFileSync("./PetBot/settings/user/master.json", UpdatedJSON.toString());
    }



    //* LOGIN BONUS CAMPAIGN *//
    /*

    if(CurrentDate == "5/2/2019"){
    message.channel.send("**【Emma's Birthday】**\nYou received the following bonus items for logging in during Emma's birthday: 50 PetStars.");
    CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetStars.txt");
    CurrentAmount = parseInt(CurrentAmount) + 50;
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetStars.txt", CurrentAmount);
    } 

    if(CurrentDate == "10/2/2019"){
    message.channel.send("**【Kanan's Birthday】**\nYou received the following bonus items for logging in during Kanan's birthday: 50 PetStars.");
    CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetStars.txt");
    CurrentAmount = parseInt(CurrentAmount) + 50;
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetStars.txt", CurrentAmount);
    } 

    if(CurrentDate == "27/2/2019"){
    message.channel.send("**【Chapter 1 - Ring of Dracula】**\nYou received the following bonus items as a special campaign bonus: 10 PetCookies.");
    CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCookies.txt");
    CurrentAmount = parseInt(CurrentAmount) + 10;
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCookies.txt", CurrentAmount);
    } 

    if(CurrentDate == "1/3/2019"){
    message.channel.send("**【Ayumu's Birthday】**\nYou received the following bonus items for logging in during Ayumu's birthday: 50 PetStars.");
    CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetStars.txt");
    CurrentAmount = parseInt(CurrentAmount) + 50;
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetStars.txt", CurrentAmount);
    } 

    if(CurrentDate == "4/3/2019"){
    message.channel.send("**【Hanamaru's Birthday】**\nYou received the following bonus items for logging in during Hanamaru's birthday: 50 PetStars + 50 PetTickets.");
    CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetStars.txt");
    CurrentAmount = parseInt(CurrentAmount) + 50;
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetStars.txt", CurrentAmount);
    CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt");
    CurrentAmount = parseInt(CurrentAmount) + 50;
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt", CurrentAmount);
    } 

    if(CurrentDate == "20/3/2019"){
    message.channel.send("**【Sayo's Birthday】**\nYou received the following bonus items for logging in during Sayo's birthday: 50 PetStars + 100 PetTickets.");
    message.channel.send("**【Hina's Birthday】**\nYou received the following bonus items for logging in during Hina's birthday: 50 PetStars + 100 PetTickets.");
    CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetStars.txt");
    CurrentAmount = parseInt(CurrentAmount) + 100;
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetStars.txt", CurrentAmount);
    CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt");
    CurrentAmount = parseInt(CurrentAmount) + 200;
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt", CurrentAmount);
    } 


    if(CurrentDate == "20/3/2019"){
    message.channel.send("**【Petsona Collab (Part 2) | Day #1】**\nYou received the following bonus items: 150 PetTickets.");
    CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt");
    CurrentAmount = parseInt(CurrentAmount) + 150;
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt", CurrentAmount);
    } 

    if(CurrentDate == "21/3/2019"){
    message.channel.send("**【Petsona Collab (Part 2) | Day #2】**\nYou received the following bonus items: 200 PetTickets.");
    CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt");
    CurrentAmount = parseInt(CurrentAmount) + 200;
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt", CurrentAmount);
    }

    if(CurrentDate == "22/3/2019"){
    message.channel.send("**【Petsona Collab (Part 2) | Day #3】**\nYou received the following bonus items: 250 PetTickets.");
    CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt");
    CurrentAmount = parseInt(CurrentAmount) + 250;
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt", CurrentAmount);
    }

    if(CurrentDate == "23/3/2019"){
    message.channel.send("**【Petsona Collab (Part 2) | Day #4】**\nYou received the following bonus items: 300 PetTickets.");
    CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt");
    CurrentAmount = parseInt(CurrentAmount) + 300;
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt", CurrentAmount);
    }

    if(CurrentDate == "23/3/2019"){
    message.channel.send("**【Rimi's Birthday】**\nYou received the following bonus items for logging in during Rimi's birthday: 50 PetStars + 100 PetTickets.");
    CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetStars.txt");
    CurrentAmount = parseInt(CurrentAmount) + 50;
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetStars.txt", CurrentAmount);
    CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt");
    CurrentAmount = parseInt(CurrentAmount) + 100;
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt", CurrentAmount);
    } 

    if(CurrentDate == "24/3/2019"){
    message.channel.send("**【Petsona Collab (Part 2) | Day #5】**\nYou received the following bonus items: 350 PetTickets.");
    CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt");
    CurrentAmount = parseInt(CurrentAmount) + 350;
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt", CurrentAmount);
    }

    if(CurrentDate == "25/3/2019"){
    message.channel.send("**【Petsona Collab (Part 2) | Day #6】**\nYou received the following bonus items: 400 PetTickets.");
    CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt");
    CurrentAmount = parseInt(CurrentAmount) + 400;
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt", CurrentAmount);
    }

    if(CurrentDate == "26/3/2019"){
    message.channel.send("**【Petsona Collab (Part 2) | Day #7】**\nYou received the following bonus items: 500 PetTickets.");
    CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt");
    CurrentAmount = parseInt(CurrentAmount) + 500;
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt", CurrentAmount);
    }

     if(CurrentDate == "2/4/2019"){
    message.channel.send("**【Apology for Issue】**\nWe're sorry about the inconvenience an issue has caused you. As a token of our apology, we're gifting you: 500 PetTickets.");
    CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt");
    CurrentAmount = parseInt(CurrentAmount) + 500;
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt", CurrentAmount);
    } 

    if(CurrentDate == "6/4/2019"){
    message.channel.send("**【Chisato's Birthday】**\nYou received the following bonus items for logging in during Chisato's birthday: 50 PetStars");
    CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetStars.txt");
    CurrentAmount = parseInt(CurrentAmount) + 50;
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetStars.txt", CurrentAmount);
    } 

    if(CurrentDate == "10/4/2019"){
    message.channel.send("**【Ran's Birthday】**\nYou received the following bonus items for logging in during Ran's birthday: 50 PetStars");
    CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetStars.txt");
    CurrentAmount = parseInt(CurrentAmount) + 50;
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetStars.txt", CurrentAmount);
    } 

    if(CurrentDate == "15/4/2019"){
    message.channel.send("**【Tomoe's Birthday】**\nYou received the following bonus items for logging in during Tomoe's birthday: 50 PetStars");
    CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetStars.txt");
    CurrentAmount = parseInt(CurrentAmount) + 50;
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetStars.txt", CurrentAmount);
    } 

    if(CurrentDate == "17/4/2019"){
    message.channel.send("**【You's Birthday】**\nYou received the following bonus items for logging in during You's birthday: 50 PetStars + 500 PetCoins");
    CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetStars.txt");
    CurrentAmount = parseInt(CurrentAmount) + 50;
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetStars.txt", CurrentAmount);
    CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt");
    CurrentAmount = parseInt(CurrentAmount) + 500;
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt", CurrentAmount);
    } 

    if(CurrentDate == "11/5/2019"){
    message.channel.send("**【Kanon's Birthday】**\nYou received the following bonus items for logging in during Kanon's birthday: 50 PetStars");
    CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetStars.txt");
    CurrentAmount = parseInt(CurrentAmount) + 50;
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetStars.txt", CurrentAmount);
    } 

    if(CurrentDate == "19/5/2019"){
    message.channel.send("**【Saaya's Birthday】**\nYou received the following bonus items for logging in during Saaya's birthday: 50 PetStars");
    CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetStars.txt");
    CurrentAmount = parseInt(CurrentAmount) + 50;
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetStars.txt", CurrentAmount);
    } 

    if(CurrentDate == "9/6/2019"){
    message.channel.send("**【Nozomi's Birthday】**\nYou received the following bonus items for logging in during Nozomi's birthday: 50 PetStars");
    CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetStars.txt");
    CurrentAmount = parseInt(CurrentAmount) + 50;
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetStars.txt", CurrentAmount);
    CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt");
    CurrentAmount = parseInt(CurrentAmount) + 500;
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt", CurrentAmount);
    } 

    if(CurrentDate == "13/6/2019"){
    message.channel.send("**【Mari's Birthday】**\nYou received the following bonus items for logging in during Mari's birthday: 50 PetStars + 1000 PetCoins");
    CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetStars.txt");
    CurrentAmount = parseInt(CurrentAmount) + 50;
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetStars.txt", CurrentAmount);
    CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt");
    CurrentAmount = parseInt(CurrentAmount) + 1000;
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt", CurrentAmount);
    } 

    if(CurrentDate == "13/7/2019"){
    message.channel.send("**【Yohane's Birthday】**\nYou received the following bonus items for logging in during Yohane's birthday: 100 PetStars + 2000 PetCoins");
    CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetStars.txt");
    CurrentAmount = parseInt(CurrentAmount) + 100;
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetStars.txt", CurrentAmount);
    CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt");
    CurrentAmount = parseInt(CurrentAmount) + 2000;
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt", CurrentAmount);
    }  

    if(CurrentDate == "23/7/2019"){
    message.channel.send("**【Ucchi's Birthday】**\nYou received the following bonus items for logging in during Ucchi's birthday: 500 PetCoins.");
    CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt");
    CurrentAmount = parseInt(CurrentAmount) + 500;
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt", CurrentAmount);
    } 

    if(CurrentDate == "23/7/2019"){
    message.channel.send("**【Ainya's Birthday】**\nYou received the following bonus items for logging in during Ainya's birthday: 5 MakiCookies.");
    CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/MakiCookies.txt");
    CurrentAmount = parseInt(CurrentAmount) + 5;
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/MakiCookies.txt", CurrentAmount);
    } 

    if(CurrentDate == "1/8/2019"){
    message.channel.send("**【Chika's Birthday】**\nYou received the following bonus items for logging in during Chika's birthday: 10 PetTickets.");
    CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt");
    CurrentAmount = parseInt(CurrentAmount) + 10;
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt", CurrentAmount);
    } 

    if(CurrentDate == "3/8/2019"){
    message.channel.send("**【Honoka's Birthday】**\nYou received the following bonus items for logging in during Honoka's birthday: 10 PetTickets.");
    CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt");
    CurrentAmount = parseInt(CurrentAmount) + 10;
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt", CurrentAmount);
    } 

    if(CurrentDate == "8/8/2019"){
    message.channel.send("**【Setsuna's Birthday】**\nYou received the following bonus items for logging in during Setsuna's birthday: 10 PetTickets.");
    CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt");
    CurrentAmount = parseInt(CurrentAmount) + 30;
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt", CurrentAmount);
    } 

    if(CurrentDate == "8/8/2019"){
    message.channel.send("**【Rikako's Birthday】**\nYou received the following bonus items for logging in during Rikako's birthday: 10 PetTickets.");
    CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt");
    CurrentAmount = parseInt(CurrentAmount) + 30;
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt", CurrentAmount);
    } 

    if(CurrentDate == "16/8/2019"){
    message.channel.send("**【Shuka's Birthday】**\nYou received the following bonus items for logging in during Shuka's birthday: 10 PetTickets.");
    CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt");
    CurrentAmount = parseInt(CurrentAmount) + 10;
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt", CurrentAmount);
    }

    if(CurrentDate == "25/8/2019"){
    message.channel.send("**【Lisa's Birthday】**\nYou received the following bonus items for logging in during Lisa's birthday: 20 PetTickets.");
    CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt");
    CurrentAmount = parseInt(CurrentAmount) + 20;
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt", CurrentAmount);
     CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/Butterflies.txt");
    CurrentAmount = parseInt(CurrentAmount) + 50;
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/Butterflies.txt", CurrentAmount); 
    } 

    if(CurrentDate == "1/9/2019"){
    message.channel.send("**【September Without You】**\nExtra daily login bonus (September 1st): 1000 PetCoins.");
    CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt");
    CurrentAmount = parseInt(CurrentAmount) + 1000;
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt", CurrentAmount);
    } 

    if(CurrentDate == "2/9/2019"){
    message.channel.send("**【September Without You】**\nExtra daily login bonus (September 2nd): 5 Aureus.");
    CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/Aureus.txt");
    CurrentAmount = parseInt(CurrentAmount) + 5;
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/Aureus.txt", CurrentAmount);
    } 

    if(CurrentDate == "3/9/2019"){
    message.channel.send("**【September Without You】**\nExtra daily login bonus (September 3rd): 30 PetTickets.");
    CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt");
    CurrentAmount = parseInt(CurrentAmount) + 30;
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt", CurrentAmount);
    }

    if(CurrentDate == "4/9/2019"){
    message.channel.send("**【September Without You】**\nExtra daily login bonus (September 4th): 40 MakiCookies.");
    CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/MakiCookies.txt");
    CurrentAmount = parseInt(CurrentAmount) + 40;
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/MakiCookies.txt", CurrentAmount);
    }

    if(CurrentDate == "7/9/2019"){
    message.channel.send("**【September Without You】**\nExtra daily login bonus (September 7th): 1 UR Ticket.");
    CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/URTicket.txt");
    CurrentAmount = parseInt(CurrentAmount) + 1;
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/URTicket.txt", CurrentAmount);
    }

     if(CurrentDate == "7/9/2019"){
    message.channel.send("**【Mitsuru's Birthday】**\nExtra daily login bonus: 5 Diamonds + 1k PetCoins + 50 PetTickets + 1 Lottery Ticket.");
    CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/Diamonds.txt");
    CurrentAmount = parseInt(CurrentAmount) + 5;
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/Diamonds.txt", CurrentAmount);
    CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt");
    CurrentAmount = parseInt(CurrentAmount) + 1000;
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt", CurrentAmount);
    CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt");
    CurrentAmount = parseInt(CurrentAmount) + 50;
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt", CurrentAmount);
    CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/LotteryTickets.txt");
    CurrentAmount = parseInt(CurrentAmount) + 1;
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/LotteryTickets.txt", CurrentAmount);
    }

    if(CurrentDate == "13/9/2019"){
      message.channel.send("**【Kotori's Birthday】**\nYou received the following bonus items for logging in during Merlin's illusion of Kotori's Birthday: 50 PetStars.");
      CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetStars.txt");
      CurrentAmount = parseInt(CurrentAmount) + 100;
      fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetStars.txt", CurrentAmount);
      message.channel.send("**【Merlin】**\nExtra daily login bonus: 50 PetStars + 2000 PetCoins + 100 PetTickets.");
      CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt");
      CurrentAmount = parseInt(CurrentAmount) + 2000;
      fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt", CurrentAmount);
      CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt");
      CurrentAmount = parseInt(CurrentAmount) + 100;
      fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt", CurrentAmount);

    }

    if(CurrentDate == "19/9/2019"){
    message.channel.send("**【Sakurauchi Riko's Birthday】**\nExtra daily login bonus: 3 SR+ Tickets.");
    CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/SRTicket.txt");
    CurrentAmount = parseInt(CurrentAmount) + 3;
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/SRTicket.txt", CurrentAmount);
    }

    if(CurrentDate == "21/9/2019"){
    message.channel.send("**【Kurosawa Ruby's Birthday】**\nExtra daily login bonus: 1 SSR+ Ticket.");
    CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/SSRTicket.txt");
    CurrentAmount = parseInt(CurrentAmount) + 1;
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/SSRTicket.txt", CurrentAmount);
    }

    if(CurrentDate == "31/10/2019"){
      message.channel.send("**【Day of the Pet 2019】**\nExtra daily login bonus: 100 PetTickets + 5000 PetCoins + Badge 'Day of the Pet 2019'.");
      CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt");
      CurrentAmount = parseInt(CurrentAmount) + 100;
      fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt", CurrentAmount);
      CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt");
      CurrentAmount = parseInt(CurrentAmount) + 5000;
      fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt", CurrentAmount);
    }

    if(CurrentDate == "1/11/2019"){
      message.channel.send("**【Day of the Pet 2019 | Part 2】**\nExtra daily login bonus: 100 MakiCookies + 10 Aureus + 4000 PetCoins.");
      CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/MakiCookies.txt");
      CurrentAmount = parseInt(CurrentAmount) + 100;
      fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/MakiCookies.txt", CurrentAmount);
      CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt");
      CurrentAmount = parseInt(CurrentAmount) + 4000;
      fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt", CurrentAmount);
      CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/Aureus.txt");
      CurrentAmount = parseInt(CurrentAmount) + 10;
      fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/Aureus.txt", CurrentAmount);
    }

    if(CurrentDate == "1/11/2019"){
      message.channel.send("**【Happy Halloween!】**\nThe Princess of Halloween gives you: 2000 PetCoins + Badge 'Halloween 2019'.");
      CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt");
      CurrentAmount = parseInt(CurrentAmount) + 2000;
      fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt", CurrentAmount);
    }

    if(CurrentDate == "1/11/2019"){
      message.channel.send("**【Hoshizora Rin's Birthday】**\nToday is Rin's Birthday! You have received 5 PetCookies.");
      CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCookies.txt");
      CurrentAmount = parseInt(CurrentAmount) + 5;
      fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCookies.txt", CurrentAmount);
    }

     if(CurrentDate == "25/12/2019"){
      message.channel.send("**【Merry Christmas】**\nToday is Christmas! You have received 10 UR Tickets and 50k PetCoins!");
      CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/URTicket.txt");
      CurrentAmount = parseInt(CurrentAmount) + 10;
      fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/URTicket.txt", CurrentAmount);
      CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt");
      CurrentAmount = parseInt(CurrentAmount) + 50000;
      fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt", CurrentAmount);

    }

     message.channel.send("**【Mitaiken na Pet, Warera no HORIZON wo Koeru!】**\nYou got 10 butterflies!");
    CurrentAmount = parseInt(fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/Butterflies.txt"));
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/Butterflies.txt", CurrentAmount + 10); 


    if(CurrentDate == "8/1/2019"){
      message.channel.send("**【PetBot First Anniversary】**\n You have received: \n⋆ 10% Daily Streak Fixer\n⋆ 50% Daily Streak Fixer (Can't be fused) [Expires after: February 8th 23:59 UTC]\n⋆ 3 SR Tickets\n⋆ 3 SSR Tickets\n⋆ 1 UR Ticket\n⋆ 100 MakiCookies\n⋆ 50 PetCookies\n⋆ 20 Aureus\n⋆ 1 Pick a 3\n⋆ Bandori Ticket\n⋆ 1 Pick a 4\n⋆ Bandori Ticket\n⋆ 1 Happy! Lucky! Smile! Yay!");
      
      CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/StreakFixers.txt");
      CurrentAmount = CurrentAmount + ", 10%, 50% (Can't be fused) [Valid before: February 8th 23:59 UTC]";
      fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/StreakFixers.txt", CurrentAmount);

      CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/SRTicket.txt");
      CurrentAmount = parseInt(CurrentAmount) + 3;
      fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/SRTicket.txt", CurrentAmount);

      CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/SSRTicket.txt");
      CurrentAmount = parseInt(CurrentAmount) + 3;
      fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/SSRTicket.txt", CurrentAmount);

      CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/URTicket.txt");
      CurrentAmount = parseInt(CurrentAmount) + 1;
      fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/URTicket.txt", CurrentAmount);

      CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/MakiCookies.txt");
      CurrentAmount = parseInt(CurrentAmount) + 100;
      fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/MakiCookies.txt", CurrentAmount);

      CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCookies.txt");
      CurrentAmount = parseInt(CurrentAmount) + 50;
      fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCookies.txt", CurrentAmount);

      CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/Aureus.txt");
      CurrentAmount = parseInt(CurrentAmount) + 20;
      fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/Aureus.txt", CurrentAmount);

      CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PickA3Stars.txt");
      CurrentAmount = parseInt(CurrentAmount) + 1;
      fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PickA3Stars.txt", CurrentAmount);

      CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PickA4Stars.txt");
      CurrentAmount = parseInt(CurrentAmount) + 1;
      fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PickA4Stars.txt", CurrentAmount);
    
    }

    if(message.author.id == 294251199874596866 || message.author.id == 168389193603612673){
      if(fs.existsSync("./PetBot/settings/skills/NozomiSkill.txt") == false){
      fs.writeFileSync("./PetBot/settings/skills/NozomiSkill.txt","1");
      }      
      let NozomiSkill = fs.readFileSync("./PetBot/settings/skills/NozomiSkill.txt");
      if(NozomiSkill <= 7){
        CurrentAmount = parseInt(CurrentAmount) + DailyReceived;
        fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt", CurrentAmount);
        message.channel.send("You've received extra "+DailyReceived+" PetCoins due to your user skill (Nozomi).\nYou will receive bonus PetCoins for the next "+(7-NozomiSkill)+" days.");

      }
      else if(NozomiSkill == 8){
        CurrentAmount = parseInt(CurrentAmount) - Math.round(DailyReceived*0.9);
        fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt", CurrentAmount);
        message.channel.send("Out of the amount mentioned above, you **only** got: "+Math.round(DailyReceived*0.1)+" PetCoins due to your user skill (Nozomi).");
      }

      NozomiSkill++;
      fs.writeFileSync("./PetBot/settings/skills/NozomiSkill.txt",NozomiSkill);

    }

    if(message.author.id == 113282276321697792 || message.author.id == 168389193603612673){
      if(fs.existsSync("./PetBot/settings/skills/MariSkill2.txt") == false){
              fs.writeFileSync("./PetBot/settings/skills/MariSkill2.txt","1");
      }
      let MariSkill = fs.readFileSync("./PetBot/settings/skills/MariSkill2.txt");
      if(MariSkill <= 20){
        CurrentAmount = parseInt(CurrentAmount) + parseInt((DailyReceived*0.1));
        fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt", CurrentAmount);
        message.channel.send("You've received extra "+parseInt((DailyReceived*0.1))+" PetCoins due to your user skill (Mari).\nYou will receive bonus PetCoins for the next "+(20-MariSkill)+" days.");
      }

      MariSkill++;
      fs.writeFileSync("./PetBot/settings/skills/MariSkill2.txt",MariSkill);

    }

    if(message.author.id == 257191130855243777 || message.author.id == 168389193603612673){
      if(fs.existsSync("./PetBot/settings/skills/KasumiSkill.txt") == false){
              fs.writeFileSync("./PetBot/settings/skills/KasumiSkill.txt","1");
      }
      let KasumiSkill = fs.readFileSync("./PetBot/settings/skills/KasumiSkill.txt");
      if(KasumiSkill <= 10){
        CurrentAmount = parseInt(CurrentAmount) + parseInt((DailyReceived*0.1));
        fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt", CurrentAmount);
        message.channel.send("You've received extra "+parseInt((DailyReceived*0.1))+" PetCoins due to your user skill (Kasumi).\nYou will receive bonus PetCoins for the next "+(10-KasumiSkill)+" days.");
      }

      KasumiSkill++;
      fs.writeFileSync("./PetBot/settings/skills/KasumiSkill.txt",KasumiSkill);

    } */

    }
  }
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
            fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/BlueTicket.txt", CurrentAmount.toString());
      }
      else{
        message.channel.send("**【Streak: Consecutive Login "+UserMaster[UserID].Login.Streak+"】**\nDue to your streak, you got "+(3*UserMaster[UserID].Login.Streak)+" PetCoins");
            let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt");
            CurrentAmount = parseInt(CurrentAmount) + (3*UserMaster[UserID].Login.Streak);
            fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt", CurrentAmount.toString());
      }
    } else if(UserMaster[UserID].Login.Streak <= 30){
      if(UserMaster[UserID].Login.Streak % 3 == 0){
        message.channel.send("**【Streak: Consecutive Login "+UserMaster[UserID].Login.Streak+"】**\nDue to your streak, you got 1 SR Ticket.");
            let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/SRTicket.txt");
            CurrentAmount = parseInt(CurrentAmount) + 1;
            fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/SRTicket.txt", CurrentAmount.toString());
      } else{
        message.channel.send("**【Streak: Consecutive Login "+UserMaster[UserID].Login.Streak+"】**\nDue to your streak, you got "+(4*UserMaster[UserID].Login.Streak)+" PetCoins.");
            let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt");
            CurrentAmount = parseInt(CurrentAmount) + (4*UserMaster[UserID].Login.Streak);
            fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt", CurrentAmount.toString());
      }
    } else if(UserMaster[UserID].Login.Streak <= 40){
      if(UserMaster[UserID].Login.Streak % 4 == 0){
        message.channel.send("**【Streak: Consecutive Login "+UserMaster[UserID].Login.Streak+"】**\nDue to your streak, you got 1 SSR Ticket.");
            let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/SSRTicket.txt");
            CurrentAmount = parseInt(CurrentAmount) + 1;
            fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/SSRTicket.txt", CurrentAmount.toString());
      } else{
        message.channel.send("**【Streak: Consecutive Login "+UserMaster[UserID].Login.Streak+"】**\nDue to your streak, you got "+(5*UserMaster[UserID].Login.Streak)+" PetCoins.");
            let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt");
            CurrentAmount = parseInt(CurrentAmount) + (5*UserMaster[UserID].Login.Streak);
            fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt", CurrentAmount.toString());
      } 
    } else if(UserMaster[UserID].Login.Streak <= 50){
      if(UserMaster[UserID].Login.Streak % 4 == 0){
        message.channel.send("**【Streak: Consecutive Login "+UserMaster[UserID].Login.Streak+"】**\nDue to your streak, you got 20 Maki Cookies.");
            let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/MakiCookies.txt");
            CurrentAmount = parseInt(CurrentAmount) + 20;
            fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/MakiCookies.txt", CurrentAmount.toString());
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
            fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt", CurrentAmount.toString());
      } else if(UserMaster[UserID].Login.Streak % 5 == 0){
        message.channel.send("**【Streak: Consecutive Login "+UserMaster[UserID].Login.Streak+"】**\nDue to your streak, you got 1 UR Ticket.");
            let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/URTicket.txt");
            CurrentAmount = parseInt(CurrentAmount) + 1;
            fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/URTicket.txt", CurrentAmount.toString());
        } else{
        message.channel.send("**【Streak: Consecutive Login "+UserMaster[UserID].Login.Streak+"】**\nDue to your streak, you got "+(7*UserMaster[UserID].Login.Streak)+" PetCoins.");
            let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt");
            CurrentAmount = parseInt(CurrentAmount) + (7*UserMaster[UserID].Login.Streak);
            fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt", CurrentAmount.toString());
    }
   } else if(UserMaster[UserID].Login.Streak <= 69){
        message.channel.send("**【Streak: Consecutive Login "+UserMaster[UserID].Login.Streak+"】**\nDue to your streak, you got "+(8*UserMaster[UserID].Login.Streak)+" PetCoins.");
            let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt");
            CurrentAmount = parseInt(CurrentAmount) + (8*UserMaster[UserID].Login.Streak);
            fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt", CurrentAmount.toString());
   } else if(UserMaster[UserID].Login.Streak <= 79){
        message.channel.send("**【Streak: Consecutive Login "+UserMaster[UserID].Login.Streak+"】**\nDue to your streak, you got "+Math.floor(UserMaster[UserID].Login.Streak/3)+" PetTickets.");
            let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt");
            CurrentAmount = parseInt(CurrentAmount) + Math.floor(UserMaster[UserID].Login.Streak/3);
            fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt", CurrentAmount.toString());
   }
     else if(UserMaster[UserID].Login.Streak <= 89){
        message.channel.send("**【Streak: Consecutive Login "+UserMaster[UserID].Login.Streak+"】**\nDue to your streak, you got "+Math.floor(UserMaster[UserID].Login.Streak/3 + 1)+" PetTickets.");
            let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt");
            CurrentAmount = parseInt(CurrentAmount) + Math.floor(UserMaster[UserID].Login.Streak/3 + 1);
            fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt", CurrentAmount.toString());
   }
    else if(UserMaster[UserID].Login.Streak <= 99){
      if(UserMaster[UserID].Login.Streak % 2 == 1){
        message.channel.send("**【Streak: Consecutive Login "+UserMaster[UserID].Login.Streak+"】**\nDue to your streak, you got "+Math.floor(UserMaster[UserID].Login.Streak/3 + 2)+" PetTickets.");
        let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt");
        CurrentAmount = parseInt(CurrentAmount) + Math.floor(UserMaster[UserID].Login.Streak/3 + 2);
        fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt", CurrentAmount.toString()); 
      } else{
        if(Math.floor(UserMaster[UserID].Login.Streak/40 - 2) == 0){
           message.channel.send("**【Streak: Consecutive Login "+UserMaster[UserID].Login.Streak+"】**\nDue to your streak, you got 1 Aureus.");
         let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/Aureus.txt");
         CurrentAmount = parseInt(CurrentAmount) + 1;
         fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/Aureus.txt", CurrentAmount.toString());
        } else{
           message.channel.send("**【Streak: Consecutive Login "+UserMaster[UserID].Login.Streak+"】**\nDue to your streak, you got "+Math.floor(UserMaster[UserID].Login.Streak/40 - 2)+" Aureus.");
         let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/Aureus.txt");
         CurrentAmount = parseInt(CurrentAmount) + Math.floor(UserMaster[UserID].Login.Streak/40 - 2);
         fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/Aureus.txt", CurrentAmount.toString());
          }        
        }
    } else if(UserMaster[UserID].Login.Streak >= 100){
      if(UserMaster[UserID].Login.Streak % 100 == 0){
        message.channel.send("**【Streak: Consecutive Login "+UserMaster[UserID].Login.Streak+"】**\nDue to your streak, you got 1 Lottery Ticket.");
        let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/LotteryTickets.txt");
        CurrentAmount = parseInt(CurrentAmount) + 1;
        fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/LotteryTickets.txt", CurrentAmount.toString()); 
      } else{
        if(UserMaster[UserID].Login.Streak % 5 == 0){
           message.channel.send("**【Streak: Consecutive Login "+UserMaster[UserID].Login.Streak+"】**\nDue to your streak, you got 10 PetStars.");
         let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetStars.txt");
         CurrentAmount = parseInt(CurrentAmount) + 10;
         fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetStars.txt", CurrentAmount.toString());
        } else{
          message.channel.send("**【Streak: Consecutive Login "+UserMaster[UserID].Login.Streak+"】**\nDue to your streak, you got 3 Diamonds and 30 PetTickets.");
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
} else{
    UserMaster[UserID].Login.Streak = 1;
    message.channel.send("**【Streak Broken】**\nSadly, you have broken your streak.");
  } 

 /* message.channel.send("**【Valentine's 2020: The Bountiful Chocolate Gardens of Valentine】**\nYou have received **three** chocolates of each kind!");
  UserMaster[UserID].SpecialEvent.Valentines.Chocolates.Dark += 3;
  UserMaster[UserID].SpecialEvent.Valentines.Chocolates.White += 3;
  UserMaster[UserID].SpecialEvent.Valentines.Chocolates.Dietetic += 3;
  UserMaster[UserID].SpecialEvent.Valentines.Chocolates.Macha += 3;
  UserMaster[UserID].SpecialEvent.Valentines.Chocolates.Homemade += 3;
  UserMaster[UserID].SpecialEvent.Valentines.Chocolates.Secret += 3; */

  UserMaster[UserID].Login.LastLogin = DateV.getUTCDate() + "/" + (DateV.getUTCMonth()+1) + "/" + DateV.getUTCFullYear();

  UserMaster[UserID].DailyAttack.RemainingStamina = 100;

 let UpdatedJSON = JSON.stringify(UserMaster, null, "\t");
 fs.writeFileSync("./PetBot/settings/user/master.json", UpdatedJSON.toString());


}

function getRandom(min, max) {
    return rng.integer({min, max});
  }