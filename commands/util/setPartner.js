const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const Help = require('./OOP/help');
const fs = require('fs');


module.exports = class SetPartner extends Command {
    constructor(client) {
        super(client, {
            name: 'setpartner',
            group: 'util',
            guildOnly: true,
            memberName: 'setpartner',
            description: 'Set PetBot partner.',
            examples: [''],
            throttling: {
        usages: 1,
        duration: 1
    },
        });
    }

   run(message, args) {

        args = message.content.split(' ').slice(1);
        let UserMaster = JSON.parse(fs.readFileSync("./PetBot/settings/user/master.json"));
        let UserID = message.author.id;
        
        if(!!args[0] == false){
          message.channel.send("Select a partner!");
          return;
        }

        let ValidPartners = ["Honoka", "Umi", "Kotori", "Rin", "Maki", "Hanayo", "Nozomi", "Eli", "Nico", "Chika", "You", "Riko", "Yoshiko", "Yohane", "Ruby", "Hanamaru", "Dia", "Kanan", "Mari"];

        let Valid = false;
        for(let i = 0; i < ValidPartners.length; i++) {
          console.log(ValidPartners[i]);
          if(args[0] == ValidPartners[i]){
            Valid = true;
            console.log("Valid partner");
            break;
          }
        }

        console.log(args[0]);
        console.log(Valid);

        if(Valid){
          message.channel.send("Partner has been updated!");
          UserMaster[UserID].Partner.Character = args[0];
          let UpdatedJSON = JSON.stringify(UserMaster, null, "\t");
          fs.writeFileSync("./PetBot/settings/user/master.json", UpdatedJSON);
        } else{
          message.channel.send("This partner is not valid. Make sure it's a valid partner (new available partners may be added later) and you typed the name correctly. The first letter has to be uppercase.");
        }




  }

}