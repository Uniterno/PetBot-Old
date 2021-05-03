const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const Help = require('./OOP/help');
const fs = require('fs');


module.exports = class Refund extends Command {
    constructor(client) {
        super(client, {
            name: 'refund',
            group: 'util',
            guildOnly: true,
            memberName: 'refund',
            description: 'Refunds specified object to an user.',
            examples: [''],
            throttling: {
        usages: 1,
        duration: 1
    },
        });
    }

   run(message, args) { // Utility to refund or give a specific item to a player. New items are not supported by this utility as
    // the format was changed to be stored in a JSON instead.

        if(message.author.id != '168389193603612673'){
      message.channel.send("You have no access to this command.");
      return;
    }

        args = message.content.split(' ').slice(1);
        
        if(!!args[0] == false || !!args[1] == false || !!args[2] == false || !!args[3] == false){
          message.channel.send("Not enough arguments.\nUse the following: ``<Obj> <Amount> <UserID> <Reason>``");
          return;
        }

        let Obj = args[0];

        if(fs.existsSync("./PetBot/settings/PetCoins/"+message.author.id+"/"+Obj+".txt") == false){
          message.channel.send("Can't find object");
          return;
        }

        let Amount = Math.floor(args[1]);
        if(isNaN(Amount)){
          message.channel.send("Amount must be a number.");
          return;
        }

        let UserID = args[2];

        let ChannelToSend = '419251469271826432';
        let WasWere = "were";

        if(Amount == 1){
          WasWere = "was";
        }

        let Reason = args[3];
        let i = 4;
        while(!!args[i] == true){ // Exists
            Reason = Reason + " " + args[i];
            i++;
        }

        if(UserID != "all"){
          let NewValue = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/"+Obj+".txt");
          NewValue = parseInt(NewValue) + parseInt(Amount);
          fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/"+Obj+".txt", NewValue.toString());

          let UserName = message.guild.members.cache.get(UserID).user.username;
        

          this.client.channels.cache.get(ChannelToSend).send(Amount+" "+Obj+" "+WasWere+" given to "+UserName+" for the following reason: "+Reason);
        } else{
          let Directory = "./PetBot/settings/PetCoins";
          fs.readdirSync(Directory).forEach(currentUserID => {
            console.log(currentUserID);
            if(fs.existsSync(Directory + "/"+currentUserID+"/"+Obj+".txt") == false){
              fs.writeFileSync(Directory + "/"+currentUserID+"/"+Obj+".txt", "0");
            }
            let NewValue = fs.readFileSync(Directory + "/"+currentUserID+"/"+Obj+".txt");
            console.log("They have " + NewValue + " " + Obj);
            NewValue = parseInt(NewValue) + parseInt(Amount);
            console.log(currentUserID + " got " + Amount + " " + Obj + " to now have " + NewValue);
            fs.writeFileSync(Directory + "/"+currentUserID+"/"+Obj+".txt", NewValue.toString);
          });
          this.client.channels.cache.get(ChannelToSend).send("All players obtained " + Amount + " " + Obj + " for the following reason: "+Reason);
        }
  }

}