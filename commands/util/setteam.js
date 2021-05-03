const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const fs = require('fs');
var https = require('https');
var rng = require('random-world');


module.exports = class SetTeamCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'setteam',
            group: 'util',
            guildOnly: true,
            memberName: 'setteam',
            description: '',
            aliases: ['st'],
            examples: [''],
            throttling: {
        usages: 1,
        duration: 3
    },
        });
    }

   run(message, args) {
    let UserID = message.author.id;
    let UserMaster = JSON.parse(fs.readFileSync("./PetBot/settings/user/master.json"));
    let PlayerVSStats = JSON.parse(fs.readFileSync("./PetBot/settings/bandori/vs/players/"+UserID+".json"));

    if(fs.existsSync("./PetBot/settings/PetCoins/"+UserID+"/HLSY.txt") == false){
        fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/HLSY.txt","0");
    }

    args = args.split(' ');

    let Slot = upperCaseFirstLetter(lowerCaseAllWordsExceptFirstLetters(args[0]));
    let Member = upperCaseFirstLetter(lowerCaseAllWordsExceptFirstLetters(args[1]));

    if(Slot == "Check" || Slot == "C"){
      message.channel.send("Slot 1: " + UserMaster[UserID].Bandori.VSLive.Team[1] + "\nSlot 2: " + UserMaster[UserID].Bandori.VSLive.Team[2] + "\nSlot 3: " + UserMaster[UserID].Bandori.VSLive.Team[3] + "\nSlot 4: " + UserMaster[UserID].Bandori.VSLive.Team[4] + "\nSlot 5: " + UserMaster[UserID].Bandori.VSLive.Team[5] + "\nSlot 6: " + UserMaster[UserID].Bandori.VSLive.Team[6] + "\nSlot 7: " + UserMaster[UserID].Bandori.VSLive.Team[7]);  
      return;
    }

    if(Slot == "Owned" || Slot == "O"){
        message.channel.send("```JSON\n"+JSON.stringify(UserMaster[UserID].Bandori.VSLive.Owns, null, "\t")+"```");
        return;
    }

    if(Slot == "Stats"){
        message.channel.send("```JSON\n"+JSON.stringify(PlayerVSStats, null, "\t")+"```");
        return;
    }

    if(Slot == "Buy"){
        if(Member == "Marina" || Member == "Yuri" || Member == "Pareo" || Member == "CHU^2" || Member == "Rokka" || Member == "Masking" || Member == "LAYER" || Member == "Natsuki"){
            
            UserMaster[UserID].Bandori.VSLive.Owns[Member] = true;

            let HLSYAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/HLSY.txt");
            HLSYAmount = parseInt(HLSYAmount);

            if(HLSYAmount <= 0){
                message.chanenl.send("You don't have enough HLSY to perform this action.");
                return;
            }

            fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/HLSY.txt", HLSYAmount - 1);

            message.channel.send("You have used 1 HLSY to buy this member.");
            UserMaster[UserID].Bandori.VSLive.Owns[Member] = true;

            let UpdatedJSON = JSON.stringify(UserMaster, null, "\t");
            fs.writeFileSync("./PetBot/settings/user/master.json",UpdatedJSON);

            return;

        }
    }

    if(Slot == "HLSY" || Slot == "Hlsy"){
        if(UserMaster[UserID].Bandori.VSLive.ExtraSlots == true){
            message.channel.send("You already have slots 6 and 7 unlocked.");
            return;
        }

        let HLSYAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/HLSY.txt");
        HLSYAmount = parseInt(HLSYAmount);

        if(HLSYAmount <= 0){
            message.chanenl.send("You don't have enough HLSY to perform this action.");
            return;
        }

        fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/HLSY.txt", HLSYAmount - 1);

        message.channel.send("You have used 1 HLSY to unlock slots 6 and 7.");
        UserMaster[UserID].Bandori.VSLive.ExtraSlots = true;

        let UpdatedJSON = JSON.stringify(UserMaster, null, "\t");
        fs.writeFileSync("./PetBot/settings/user/master.json",UpdatedJSON);

        return;
    }

    if(Slot == "Sif"){
        let Group = Member;
        let Attribute = upperCaseFirstLetter(lowerCaseAllWordsExceptFirstLetters(args[2]));
        let SIFSlot = upperCaseFirstLetter(lowerCaseAllWordsExceptFirstLetters(args[3]));
        let Team = upperCaseFirstLetter(lowerCaseAllWordsExceptFirstLetters(args[4]));

         let Tag = "";

        for (var i = 5; i <= 15; i++) {
                if(!!args[i]){ // if not undefined
                    Tag += args[i] + " ";
                }
        }

        Tag = Tag.substring(0, Tag.length - 1);

       

        if(Group == "Check" || Group == "C"){
            message.channel.send("```JSON\n"+JSON.stringify(UserMaster[UserID].SIF.NoteDistribution.Teams, null, "\t")+"```");
            return;
        }

        if(Attribute != "Pure" && Attribute != "Cool" && Attribute != "Smile" && Attribute != "All"){
            message.channel.send("Invalid attribute");
            return;
        }

        if(Group != "μ's" && Group != "Muse" && Group != "Aqours" && Group != "All"){
            message.channel.send("Invalid group");
            return;
        }

        if(Group == "Muse"){
            Group = "μ's";
        }

        if(SIFSlot < 1 || SIFSlot > 9){
            message.channel.send("Invalid slot");
            return;
        }

        if(!!UserMaster[UserID].SIF.NoteDistribution.Teams[Team] == false){
            message.channel.send("Team not found.");
            return;
        }

        UserMaster[UserID].SIF.NoteDistribution.Teams[Team][SIFSlot].Group = Group;
        UserMaster[UserID].SIF.NoteDistribution.Teams[Team][SIFSlot].Attribute = Attribute;
        UserMaster[UserID].SIF.NoteDistribution.Teams[Team][SIFSlot].Tag = Tag;

        let UpdatedJSON = JSON.stringify(UserMaster, null, "\t");
        fs.writeFileSync("./PetBot/settings/user/master.json",UpdatedJSON);

        message.channel.send("Successfully added.");

        return;

    }

    if(isNaN(Slot)){
        message.channel.send("Slot is not valid");
        return;
    }

    Slot = parseInt(Slot);


    if((Slot < 1 || Slot > 5) || isNaN(Slot)){
        if((Slot == 6 || Slot == 7) && UserMaster[UserID].Bandori.VSLive.ExtraSlots == false){
            message.channel.send("You need to buy the extra slots using HLSY first.");
            return;
        } else if((Slot == 6 || Slot == 7) && UserMaster[UserID].Bandori.VSLive.ExtraSlots == true){
            // Allow to pass
        } else{
            message.channel.send("Slot is not valid.");
            return;
        }
    }

    if(Member == "1" || Member == "Kasumi"){
        Member = "Kasumi";
    } else if(Member == "2" || Member == "Saaya"){
        Member = "Saaya";
    } else if(Member == "3" || Member == "Tae"){
        Member = "Tae";
    } else if(Member == "4" || Member == "Arisa"){
        Member = "Arisa";
    }  else if(Member == "5" || Member == "Rimi"){
        Member = "Rimi";
    }  else if(Member == "6" || Member == "Ran"){
        Member = "Ran";
    }  else if(Member == "7" || Member == "Tomoe"){
        Member = "Tomoe";
    }  else if(Member == "8" || Member == "Tsugumi"){
        Member = "Tsugumi";
    }  else if(Member == "9" || Member == "Moca"){
        Member = "Moca";
    }  else if(Member == "10" || Member == "Himari"){
        Member = "Himari";
    }  else if(Member == "11" || Member == "Kokoro"){
        Member = "Kokoro";
    }  else if(Member == "12" || Member == "Kaoru"){
        Member = "Kaoru";
    }  else if(Member == "13" || Member == "Misaki" || Member == "Michelle"){
        Member = "Michelle";
    }  else if(Member == "14" || Member == "Hagumi"){
        Member = "Hagumi";
    }  else if(Member == "15" || Member == "Kanon"){
        Member = "Kanon";
    }  else if(Member == "16" || Member == "Aya"){
        Member = "Aya";
    }  else if(Member == "17" || Member == "Chisato"){
        Member = "Chisato";
    }  else if(Member == "18" || Member == "Maya"){
        Member = "Maya";
    }  else if(Member == "19" || Member == "Eve"){
        Member = "Eve";
    }  else if(Member == "20" || Member == "Hina"){
        Member = "Hina";
    }  else if(Member == "21" || Member == "Yukina"){
        Member = "Yukina";
    }  else if(Member == "22" || Member == "Lisa"){
        Member = "Lisa";
    }  else if(Member == "23" || Member == "Sayo"){
        Member = "Sayo";
    }  else if(Member == "24" || Member == "Rinko"){
        Member = "Rinko";
    }  else if(Member == "25" || Member == "Ako"){
        Member = "Ako";
    }  else if(Member == "26" || Member == "Marina"){
        Member = "Marina";
        if(UserMaster[UserID].Bandori.VSLive.Owns[Member] == false){
            message.channel.send("You don't own this member, you must purchase it first with HLSY.");
            return;
        }
    }  else if(Member == "27" || Member == "Yuri"){
        Member = "Yuri";
        if(UserMaster[UserID].Bandori.VSLive.Owns[Member] == false){
            message.channel.send("You don't own this member, you must purchase it first with HLSY.");
            return;
        }
    }  else if(Member == "28" || Member == "Pareo"){
        Member = "Pareo";
        if(UserMaster[UserID].Bandori.VSLive.Owns[Member] == false){
            message.channel.send("You don't own this member, you must purchase it first with HLSY.");
            return;
        }
    }  else if(Member == "29" || Member == "CHU^2"){
        Member = "CHU^2";
        if(UserMaster[UserID].Bandori.VSLive.Owns[Member] == false){
            message.channel.send("You don't own this member, you must purchase it first with HLSY.");
            return;
        }
    }  else if(Member == "30" || Member == "Rokka"){
        Member = "Rokka";
        if(UserMaster[UserID].Bandori.VSLive.Owns[Member] == false){
            message.channel.send("You don't own this member, you must purchase it first with HLSY.");
            return;
        }
    }  else if(Member == "31" || Member == "Masking"){
        Member = "Masking";
        if(UserMaster[UserID].Bandori.VSLive.Owns[Member] == false){
            message.channel.send("You don't own this member, you must purchase it first with HLSY.");
            return;
        }
    }  else if(Member == "32" || Member == "LAYER"){
        Member = "LAYER";
        if(UserMaster[UserID].Bandori.VSLive.Owns[Member] == false){
            message.channel.send("You don't own this member, you must purchase it first with HLSY.");
            return;
        }
    }  else if(Member == "33" || Member == "Natsuki"){
        Member = "Natsuki";
        if(UserMaster[UserID].Bandori.VSLive.Owns[Member] == false){
            message.channel.send("You don't own this member, you must purchase it first with HLSY.");
            return;
        }
    }  else if(Member == "34" || Member == "Marie" || Member == "Andromeda" || Member == "MarieAndromeda"){
        Member = "MarieAndromeda";
        if(UserMaster[UserID].Bandori.VSLive.Owns[Member] == false){
            message.channel.send("You don't own this member, you must purchase it first with HLSY.");
            return;
        }
    }  else if(Member == "35" || Member == "Hanne"){
        Member = "Hanne";
        if(UserMaster[UserID].Bandori.VSLive.Owns[Member] == false){
            message.channel.send("You don't own this member, you must purchase it first with HLSY.");
            return;
        }
    } else{
        message.channel.send("Member cannot be found or invalid arguments.");
        return;
    }





    UserMaster[UserID].Bandori.VSLive.Team[Slot] = Member;

    message.channel.send("Registered " + Member + " in slot " + Slot);

    let UpdatedJSON = JSON.stringify(UserMaster, null, "\t");
    fs.writeFileSync("./PetBot/settings/user/master.json",UpdatedJSON);



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


