const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const fs = require('fs');
var https = require('https');
var rng = require('random-world');


module.exports = class SetTeamCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'trainbandori',
            group: 'util',
            guildOnly: true,
            memberName: 'trainbandori',
            description: '',
            aliases: ['tb'],
            throttling: {
        usages: 1,
        duration: 3
    },
        });
    }

   run(message, args) { // Allows you to perform Bandori training
    let UserID = message.author.id;
    let UserMaster = JSON.parse(fs.readFileSync("./PetBot/settings/user/master.json"));
    let UserInventory = JSON.parse(fs.readFileSync("./PetBot/settings/bandori/Inventory/"+UserID+"/Inventory.json"));
    let Requirements = JSON.parse(fs.readFileSync("./PetBot/settings/bandori/Train/Requirements.json"));

    args = args.split(' ');

    let Member = upperCaseFirstLetter(lowerCaseAllWordsExceptFirstLetters(args[0]));
    let Attribute = upperCaseFirstLetter(lowerCaseAllWordsExceptFirstLetters(args[1]));
    let MemberC = upperCaseFirstLetter(lowerCaseAllWordsExceptFirstLetters(args[2]));


    let Band = "Unknown";
    if(Member != "Check" && Member != "C"){
        Band = getBand(Member);
        if(Band == "Unknown"){
            message.channel.send("Member not found.");
            return;
        }
    } else{
        Band = getBand(MemberC);
            if(Band == "Unknown"){
                message.channel.send("Member not found.");
                return;
            }
    }


    if(Member == "Check" || Member == "C"){
      message.channel.send("```json\n"+JSON.stringify(Requirements[Band][Attribute][MemberC], null, "\t") + "```");
      return;
    }


    

    let CurrentRarity = UserInventory[Band][Attribute][Member];
    let UpgradeRarity = CurrentRarity + 1;

    console.log(Band);
    console.log(Attribute);
    console.log(Member);
    console.log(UpgradeRarity);

    if(!!Requirements[Band][Attribute][Member][UpgradeRarity] == false){
        message.channel.send("An upgrade for this member is not available.");
        return;
    }

    if(UserMaster[UserID].Bandori.Parameters.Performance < Requirements[Band][Attribute][Member][UpgradeRarity].Performance){
        message.channel.send("Not enough Performance to perform this action.");
        return;
    }

    if(UserMaster[UserID].Bandori.Parameters.Technique < Requirements[Band][Attribute][Member][UpgradeRarity].Technique){
        message.channel.send("Not enough Technique to perform this action.");
        return;
    }

    if(UserMaster[UserID].Bandori.Parameters.Visual < Requirements[Band][Attribute][Member][UpgradeRarity].Visual){
        message.channel.send("Not enough Visual to perform this action.");
        return;
    }

    UserMaster[UserID].Bandori.Parameters.Performance -= Requirements[Band][Attribute][Member][UpgradeRarity].Performance;
    UserMaster[UserID].Bandori.Parameters.Technique -= Requirements[Band][Attribute][Member][UpgradeRarity].Technique;
    UserMaster[UserID].Bandori.Parameters.Visual -= Requirements[Band][Attribute][Member][UpgradeRarity].Visual;
    UserInventory[Band][Attribute][Member]++;


    let UpdatedJSON = JSON.stringify(UserMaster, null, "\t");
    fs.writeFileSync("./PetBot/settings/user/master.json",UpdatedJSON);

    let UpdatedJSON2 = JSON.stringify(UserInventory, null, "\t");
    fs.writeFileSync("./PetBot/settings/bandori/Inventory/"+UserID+"/Inventory.json",UpdatedJSON2);

    message.channel.send("Upgraded member! Rarity is now " + UserInventory[Band][Attribute][Member]);



}
}


function lowerCaseAllWordsExceptFirstLetters(string) {

    if(!!string == false){
        return "";
    }

    return string.replace(/\w\S*/g, function (word) {
        return word.charAt(0) + word.slice(1).toLowerCase();
    });
}

function upperCaseFirstLetter(string) {

    if(!!string == false){
        return "";
    }

    return string.charAt(0).toUpperCase() + string.slice(1);

}


function getBand(Member){
  let Band = "Unknown";

  console.log("Member: "+Member);

  if(Member == "Kasumi" || Member == "Saaya" || Member == "Tae" || Member == "Rimi" || Member == "Arisa"){
    Band = "PoPiPa";
  } else if(Member == "Rinko" || Member == "Ako" || Member == "Lisa" || Member == "Sayo" || Member == "Yukina"){
    Band = "Roselia";
  } else if(Member == "Hagumi" || Member == "Kokoro" || Member == "Kanon" || Member == "Michelle" || Member == "Kaoru"){
    Band = "HaroHapi";
  } else if(Member == "Aya" || Member == "Maya" || Member == "Chisato" || Member == "Eve" || Member == "Hina"){
    Band = "PasuPare";
  } else if(Member == "Tomoe" || Member == "Ran" || Member == "Moca" || Member == "Himari" || Member == "Tsugumi"){
    Band = "Afterglow";
  }

  return Band;
}

