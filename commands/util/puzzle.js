const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
//const mysql = require('mysql');
const fs = require('fs');
// vars that I need for some reason
const rng = require('random-world');


const BadResult = [1, 5, 9, 13, 17, 21, 25, 29];


module.exports = class GDPRCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'puzzle',
            group: 'util',
            guildOnly: true,
            memberName: 'puzzle',
            description: 'Puzzle Event Command.',
            aliases: ['p'],
            throttling: {
        usages: 4,
        duration: 10
    },
        });
    }

   run(message, args) { // Very simple puzzle, the first player that gets to 1 loses.


    if(message.channel.type != "text"){
        message.channel.send("This command is not available on DMs.");
        return;
    }

     let UserID = message.author.id;
     args = message.content.split(' ').slice(1);

     if(fs.existsSync("./PetBot/settings/Puzzle/"+UserID+".json") == false){
        let Template = fs.readFileSync("./PetBot/settings/Puzzle/Template.json", 'utf8');
     fs.writeFileSync("./PetBot/settings/Puzzle/"+UserID+".json",Template);
  } 

  let PlayerData = JSON.parse(fs.readFileSync("./PetBot/settings/Puzzle/"+UserID+".json"));

  if(PlayerData.Playing == false){
    let DaNumber = getRandom(16,29);
    if(PlayerData.CurrentNumber <= 1){
    PlayerData.CurrentNumber = DaNumber;
    }  

    message.channel.send("Initial Number will be: "+PlayerData.CurrentNumber+".");

    if(args[0] != "first" && args[0] != "second"){
        message.channel.send("You need to pick whether to start first or second before playing.");
        let UpdatedJSON = JSON.stringify(PlayerData, null, "\t");
        fs.writeFileSync("./PetBot/settings/Puzzle/"+UserID+".json", UpdatedJSON);
        return;
    } else{
        if(args[0] == "first"){
            PlayerData.Playing = true;
            let UpdatedJSON = JSON.stringify(PlayerData, null, "\t");
            fs.writeFileSync("./PetBot/settings/Puzzle/"+UserID+".json", UpdatedJSON);
            message.channel.send("You go first then!");
            return;
        } else if(args[0] == "second"){
             PlayerData.Playing = true;
             let UpdatedJSON = JSON.stringify(PlayerData, null, "\t");
             fs.writeFileSync("./PetBot/settings/Puzzle/"+UserID+".json", UpdatedJSON);
             MahStuff(args[0], PlayerData.CurrentNumber, message, PlayerData, UserID);
             return;
        }
    }

    let UpdatedJSON = JSON.stringify(PlayerData, null, "\t");
            fs.writeFileSync("./PetBot/settings/Puzzle/"+UserID+".json", UpdatedJSON);

  }

  if(PlayerData.Playing == true){
    if(isNaN(args[0])){
        message.channel.send("Only type numbers, please.");
        return;
    }
    if(parseInt(args[0]) > 3 || args[0] < 1){
          message.channel.send("You can only pick numbers between 1 and 3.");
          return;
        }

        args[0] = Math.floor(args[0]);
        if(args[0] == 4){
            args[0] = 3;
        }

        MahStuff(args[0], PlayerData.CurrentNumber, message, PlayerData, UserID)

  }

    }
  }



  function getRandom(min, max) {
    return rng.integer({min, max});
  }

  function MahStuff(Selection, Current, message, PlayerData, UserID){
        if(Selection != "second"){
              PlayerData.CurrentNumber = MahPlay(Selection,Current);
            if(PlayerData.CurrentNumber < 2){
              message.channel.send("Uh... the number is "+PlayerData.CurrentNumber+"... ok, you win this time, Little Demon!");
              Reset(PlayerData, UserID);
              return;
            }
        }

        
        BotPlay = MahBotPlay(PlayerData.CurrentNumber);
        message.channel.send("Current number is "+PlayerData.CurrentNumber+" then!");
        PlayerData.CurrentNumber = PlayerData.CurrentNumber - BotPlay;
        message.channel.send("I pick "+BotPlay+" so the number is now "+PlayerData.CurrentNumber+".");


         let UpdatedJSON = JSON.stringify(PlayerData, null, "\t");
            fs.writeFileSync("./PetBot/settings/Puzzle/"+UserID+".json", UpdatedJSON);

        if(PlayerData.CurrentNumber < 2){
          message.channel.send("Seems like this is a win for me! Hahahaha! Is that all you can do, little pet?!");
          Reset(PlayerData, UserID);
          return;
        }
}

function MahPlay(Play,Mah){
  Mah = Mah - Play;
  return Mah;
}

function MahBotPlay(Current){
    console.log(Current);
  let BotPlay = parseInt(getRandom(1,3));
        let i = 0;
        while(i < 8){
          if(Current - 1 == BadResult[i]){
            BotPlay = 1;
            return BotPlay;
          }
          if(Current - 2 == BadResult[i]){
            BotPlay = 2
            return BotPlay;
          }
          if(Current - 3 == BadResult[i]){
            BotPlay = 3;
            return BotPlay;
          }
          i++;
        }
       while(i > 8){
        if(Current - BotPlay == BadResult[i]){
          if(Current == 3){
            BotPlay--;
          }
          else{
            BotPlay++;
          }
          break;
        }
        i++;
       }
       return BotPlay;
}


function Reset(PlayerData, UserID){
  PlayerData.Playing = false;
  PlayerData.CurrentNumber = 0;

  let UpdatedJSON = JSON.stringify(PlayerData, null, "\t");
            fs.writeFileSync("./PetBot/settings/Puzzle/"+UserID+".json", UpdatedJSON);
}