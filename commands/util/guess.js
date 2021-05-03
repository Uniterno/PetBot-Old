const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
//const mysql = require('mysql');
const fs = require('fs');
const stringTable = require('string-table');
// vars that I need for some reason


module.exports = class GuessCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'guess',
            group: 'util',
            guildOnly: true,
            memberName: 'guess',
            aliases: ['ge'],
            description: 'Guessing event.',
            throttling: {
        usages: 2,
        duration: 1
    },
        });
    }

   run(message, args) {

    message.channel.send("This command can only be used during a guessing event.");
    return;

    args = args.split(' ');
  let GuessedNumber = args[0];
  GuessedNumber = parseFloat(GuessedNumber);

    if(isNaN(GuessedNumber)){
    message.channel.send("You need to input a number.");
    console.log(GuessedNumber);
    return;
  }

  if(!!GuessedNumber == false){ // Returns false for null,undefined,0,000,"",false.
    message.channel.send("You need to input a number.");
    console.log(GuessedNumber);
    return;
  }

    let UserID = message.author.id;

    let Round = fs.readFileSync("./PetBot/settings/guess/CurrentRound.txt");
    let LastPlayer = fs.readFileSync("./PetBot/settings/guess/LastPlayer.txt");

      Round = Round.toString('utf8');
      LastPlayer = LastPlayer.toString('utf8');


    if(LastPlayer == UserID){
      message.channel.send("You can't try to guess a number twice without waiting for another player's input. If you want, you can skip the wait by using !sw (pay 1 MakiCookie).");
      return;
    }


    let MinForRound = fs.readFileSync("./PetBot/settings/guess/Round"+Round+"/Min.txt");
    let MaxForRound = fs.readFileSync("./PetBot/settings/guess/Round"+Round+"/Max.txt");
    let DecimalsForRound = fs.readFileSync("./PetBot/settings/guess/Round"+Round+"/Decimals.txt");
    let ShowRelativeToGuess = fs.readFileSync("./PetBot/settings/guess/Round"+Round+"/ShowRelativeToGuess.txt");

    MinForRound = MinForRound.toString('utf8');
    MaxForRound = MaxForRound.toString('utf8');
    DecimalsForRound = DecimalsForRound.toString('utf8');
    ShowRelativeToGuess = ShowRelativeToGuess.toString('utf8');


  


    if(fs.existsSync("./PetBot/settings/guess/Round"+Round+"/x.txt") == false){
      console.log("Created number");
      console.log(DecimalsForRound)
        if(DecimalsForRound != 0){
          console.log("1");
          var x = parseFloat((Math.random() * (MaxForRound - MinForRound) + MaxForRound)).toFixed(DecimalsForRound);
        }
        else{
          console.log("Help?");
           var x = parseInt(Math.random() * (MaxForRound - MinForRound) + MaxForRound);
        }
        fs.writeFileSync("./PetBot/settings/guess/Round"+Round+"/x.txt", x);
  }

  let CorrectAnswer = fs.readFileSync("./PetBot/settings/guess/Round"+Round+"/x.txt");
  CorrectAnswer = CorrectAnswer.toString('utf8');


  

  fs.writeFileSync("./PetBot/settings/guess/LastPlayer.txt", UserID);

  
  CorrectAnswer = parseFloat(CorrectAnswer);

  if(CorrectAnswer != GuessedNumber){
    console.log("Guessed: "+GuessedNumber);
    console.log(typeof GuessedNumber);
    console.log("CorrectAnswer: "+CorrectAnswer);
    console.log(typeof CorrectAnswer);

    let PetTickets = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt");
    PetTickets++;
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetTicket.txt",PetTickets);

    let Iteration = 1;
    while(fs.existsSync("./PetBot/settings/guess/GuessList/Round"+Round+"/"+Iteration+".txt")){
      Iteration++; 
      console.log(Iteration);
    }

    fs.writeFileSync("./PetBot/settings/guess/GuessList/Round"+Round+"/"+Iteration+".txt","["+Iteration+"] "+GuessedNumber+"\n");
    console.log("Written");


    this.client.channels.cache.get("448962758675791894").bulkDelete(50);
    let ToSendAsList;
    Iteration = 1;
    ToSendAsList = "Round: **"+Round+"**\n";
    ToSendAsList = ToSendAsList + "**---**\n";
    while(fs.existsSync("./PetBot/settings/guess/GuessList/Round"+Round+"/"+Iteration+".txt")){
      if(!ToSendAsList){
        ToSendAsList = fs.readFileSync("./PetBot/settings/guess/GuessList/Round"+Round+"/"+Iteration+".txt");
      } else{
        ToSendAsList = ToSendAsList + fs.readFileSync("./PetBot/settings/guess/GuessList/Round"+Round+"/"+Iteration+".txt");
      }
      Iteration++;
    }

    
    ToSendAsList = ToSendAsList + "**---**";

    ToSendAsList = ToSendAsList + "\n**This message will be sent every time someone uses !guess or !sw, so you probably want to mute this channel.**";

    if(ToSendAsList.length >= 1999){
     ToSendAsList =  ToSendAsList.substring((ToSendAsList.length - 1999))
    }

    this.client.channels.cache.get("448962758675791894").send(ToSendAsList);








   if(GuessedNumber < CorrectAnswer){
    if(ShowRelativeToGuess == 'true'){
      message.channel.send("Incorrect. The number you are looking for is **greater** than the one you inputted.");
      return;
    }
      message.channel.send("Incorrect input. This round doesn't display whether the number you are looking for is greater or less.");
      return;
   }
   else if(GuessedNumber > CorrectAnswer){
    if(ShowRelativeToGuess == 'true'){
      message.channel.send("Incorrect. The number you are looking for is **less** than the one you inputted.");
      return;
    }
   message.channel.send("Incorrect input. This round doesn't display whether the number you are looking for is greater or less.");
      return;
  }
} else{
    message.channel.send("Correct answer! You have correctly guessed the number of the Round "+Round);
  }

  Round++;
  fs.writeFileSync("./PetBot/settings/guess/CurrentRound.txt", Round);


    MinForRound = fs.readFileSync("./PetBot/settings/guess/Round"+Round+"/Min.txt");
    MaxForRound = fs.readFileSync("./PetBot/settings/guess/Round"+Round+"/Max.txt");
    DecimalsForRound = fs.readFileSync("./PetBot/settings/guess/Round"+Round+"/Decimals.txt");

    MinForRound = MinForRound.toString('utf8');
    MaxForRound = MaxForRound.toString('utf8');
    DecimalsForRound = DecimalsForRound.toString('utf8');


    let ShowRoundData = fs.readFileSync("./PetBot/settings/guess/Round"+Round+"/ShowRoundData.txt");

    ShowRoundData = ShowRoundData.toString('utf8');


    if(ShowRoundData == 'true'){
       message.channel.send("Next round ("+Round+") is a number between "+MinForRound+" and "+MaxForRound+".");
    } else{
             message.channel.send("Next round ("+Round+") has hidden starting numbers!");
    }


    // Repeated to ensure correct answer is marked
    Round--; // Just for this purpose, don't save it other way.

    let Iteration = 1;
    while(fs.existsSync("./PetBot/settings/guess/GuessList/Round"+Round+"/"+Iteration+".txt")){
      Iteration++; 
      console.log(Iteration);
    }

    fs.writeFileSync("./PetBot/settings/guess/GuessList/Round"+Round+"/"+Iteration+".txt","["+Iteration+"] "+GuessedNumber+"\n");
    console.log("Written");


    this.client.channels.cache.get("448962758675791894").bulkDelete(50);
    let ToSendAsList;
    Iteration = 1;
    ToSendAsList = "Round: **"+Round+"**\n";
    ToSendAsList = ToSendAsList + "**---**\n";
    while(fs.existsSync("./PetBot/settings/guess/GuessList/Round"+Round+"/"+Iteration+".txt")){
      if(!ToSendAsList){
        ToSendAsList = fs.readFileSync("./PetBot/settings/guess/GuessList/Round"+Round+"/"+Iteration+".txt");
      } else{
        ToSendAsList = ToSendAsList + fs.readFileSync("./PetBot/settings/guess/GuessList/Round"+Round+"/"+Iteration+".txt");
      }
      Iteration++;
    }


    
    ToSendAsList = ToSendAsList + "**---**";

    ToSendAsList = ToSendAsList + "\n**This message will be sent every time someone uses !guess or !sw, so you probably want to mute this channel.**";

    if(ToSendAsList.length >= 1999){
     ToSendAsList =  ToSendAsList.substring((ToSendAsList.length - 1999))
    }

    this.client.channels.cache.get("448962758675791894").send(ToSendAsList);
   
  }
}
