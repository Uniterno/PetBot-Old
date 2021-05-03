const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const fs = require('fs');
const rng = require('random-world');
const mergeImg = require('merge-img');


module.exports = class SkillTicketCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'skillticket',
            group: 'util',
            guildOnly: true,
            memberName: 'skillticket',
            aliases: ['skillt'],
            description: 'SIFAS Skill Tickets.',
            throttling: {
        usages: 1,
        duration: 5
    },
        });
    }

   run(message, args) {
    args = args.split(' ');
  
    let UserID = message.author.id;
    let UserMaster = JSON.parse(fs.readFileSync("./PetBot/settings/user/master.json"));
    let Inventory = JSON.parse(fs.readFileSync("./PetBot/settings/sifas/Inventory/"+UserID+"/Inventory.json", 'utf8'));
    if(!!UserMaster[UserID].SIFAS.Insights == false){
          UserMaster[UserID].SIFAS.Insights = [];
    }
    let Act = args[0];

    if(Act == "assign"){
      let Value = args[1];

      if(isNaN(Value) || Value < 0 || Value > UserMaster[UserID].SIFAS.Insights.length){
        message.channel.send("Not a valid value.");
        return;
      }

      let Card = args[2];

      if(!!Card == false){
        message.channel.send("Invalid card.");
        return;
      }

      let TokenizedID = "";
      let success = false;
      if(isNaN(Card)){
        let buffer = fs.readFileSync("./PetBot/settings/sifas/tagmap.csv", 'utf8');
        let pos = 0;
        let token = "";
        let FINISHED = -1;
        let INITIAL = 0;
        let VALID_CHARACTER = 1;
        let ENCAPSULATION = 2;
        let state = INITIAL;

        // -1 - Finished
        // 0 - Initial
        // 1 - Valid Character
        // 2 - Encapsulation
        while(typeof buffer[pos] != "undefined"){
          state = INITIAL;
          while(state >= INITIAL){
             //console.log(buffer);
             console.log("New state detected: " + state);
             if(state == INITIAL || state == VALID_CHARACTER){
              if(buffer[pos] == '"'){
                  token += buffer[pos];
                  state = ENCAPSULATION;
              } else if(buffer[pos] == ',' || buffer[pos] == '\n'){
                  state = FINISHED; // Finished
              } else{
                  token += buffer[pos];
                  state = VALID_CHARACTER;
              }
             } else if(state == ENCAPSULATION){
                 if(buffer[pos] == '"'){
                     state = VALID_CHARACTER; // Exit Encapsulation
                 }
                 if(!(buffer[pos - 1] == '"' && buffer[pos] == '"')){
                  token += buffer[pos]; // Don't push double comillas, as one is likely the escape one
                 }
             }
             pos++;
             console.log("Character: " + buffer[pos]);
          }
          if(token == Card){
            pos = buffer.length + 1;
            success = true;
          } else{
            TokenizedID = token;
          }

          token = "";
        }
        
        if(token[0] == '"' && token[token.length() - 1] == '"'){
            token = token.substr(1, token.length() - 2); // Removes initial and ending " (to comply with CSV standard)
        }
      } else{
        TokenizedID = Card;
        success = true;
      }

      if(success){
        if(!!Inventory[TokenizedID] != false){ // exists
          if(Inventory[TokenizedID].skills.insights.slots <= Inventory[TokenizedID].skills.insights.insights.length){
            message.channel.send("This card already has the maximum amount of Insight skills, please remove some before continuing.");
            return;
          } else{
            let ToAdd = [];
            ToAdd[0] = UserMaster[UserID].SIFAS.Insights[Value - 1][0];
            ToAdd[1] = UserMaster[UserID].SIFAS.Insights[Value - 1][1];
            ToAdd[2] = UserMaster[UserID].SIFAS.Insights[Value - 1][2];
            Inventory[TokenizedID].skills.insights.insights.push(ToAdd);
            UserMaster[UserID].SIFAS.Insights.splice((Value - 1), 1);
            message.channel.send("Insight correctly applied to this card!");
            let UpdatedJSON = JSON.stringify(UserMaster, null, "\t");
            fs.writeFileSync("./PetBot/settings/user/master.json", UpdatedJSON.toString());
            let UpdatedJSON2 = JSON.stringify(Inventory, null, "\t");
            fs.writeFileSync("./PetBot/settings/sifas/Inventory/"+UserID+"/Inventory.json", UpdatedJSON2.toString());
          }
        } else{
          message.channel.send("You don't own this card.");
          return;
        }
      }
    } else if(Act == "show"){
      let MessageToSend = "";
      let AllSkills = JSON.parse(fs.readFileSync("./PetBot/settings/sifas/skills.json", 'utf8'));
      for(let i = 0; i < UserMaster[UserID].SIFAS.Insights.length; i++){

        let SelectedSkill = UserMaster[UserID].SIFAS.Insights[i][1];
        let CategoryInternal = UserMaster[UserID].SIFAS.Insights[i][0];
        let Level = UserMaster[UserID].SIFAS.Insights[i][2];
        let SkillDetails = "**" + AllSkills[CategoryInternal][SelectedSkill].type + "**";

        if(AllSkills[CategoryInternal][SelectedSkill].target != undefined){
          SkillDetails += " (" + AllSkills[CategoryInternal][SelectedSkill].target + ")";
        }

        if(AllSkills[CategoryInternal][SelectedSkill].chance != undefined){
          SkillDetails += " [Chance: " + AllSkills[CategoryInternal][SelectedSkill].chance + "%]";
        }

        if(AllSkills[CategoryInternal][SelectedSkill].perLevel != undefined){
          SkillDetails += " [Value: " + (AllSkills[CategoryInternal][SelectedSkill].value + (AllSkills[CategoryInternal][SelectedSkill].perLevel * (Level-1))).toFixed(3) + "]";
        } else{
           SkillDetails += " [Value: " + AllSkills[CategoryInternal][SelectedSkill].value + "]";
        }

        if(AllSkills[CategoryInternal][SelectedSkill].notes != undefined){
          SkillDetails += " [Notes: " + AllSkills[CategoryInternal][SelectedSkill].notes + "]";
        }

        if(CategoryInternal != "ability2"){
          SkillDetails += " (Level: " + Level + ")";
        }

        MessageToSend += (i + 1) + ") [ID: "  + SelectedSkill + "] (" + CategoryInternal + ") | " + SkillDetails + "\n";
      }
      if(MessageToSend == ""){
        MessageToSend = "You have no insight skills.";
      }
      
      message.channel.send(MessageToSend);
     
    } else{
      if(UserMaster[UserID].SIFAS.Inventory["Skill Ticket"] <= 0){
        message.channel.send("You don't have enough Skill Tickets to perform this action.");
        return;
      } else{
        UserMaster[UserID].SIFAS.Inventory["Skill Ticket"] -= 1;
        let AllSkills = JSON.parse(fs.readFileSync("./PetBot/settings/sifas/skills.json", 'utf8'));
        let Category = getRandom(0, 3);
        console.log(Category);
        let CategoryInternal = "";
        if(Category == 1){ // Skill
          CategoryInternal = "skill";
        } else if(Category == 2){ // Ability
          CategoryInternal = "ability";
        } else if(Category == 3){ // Ability2
          CategoryInternal = "ability2";
        }

        let SkillRNG = Object.keys(AllSkills[CategoryInternal]);
        let SelectedSkillNumber = getRandom(-1, SkillRNG.length);
        let SelectedSkill = SkillRNG[SelectedSkillNumber];
        let Level = getRandom(0, 5);

        let ToAdd = [CategoryInternal, parseInt(SelectedSkill), Level];
        let SkillDetails = "**" + AllSkills[CategoryInternal][SelectedSkill].type + "**";

        if(AllSkills[CategoryInternal][SelectedSkill].target != undefined){
          SkillDetails += " (" + AllSkills[CategoryInternal][SelectedSkill].target + ")";
        }

        if(AllSkills[CategoryInternal][SelectedSkill].chance != undefined){
          SkillDetails += " [Chance: " + AllSkills[CategoryInternal][SelectedSkill].chance + "%]";
        }

        if(AllSkills[CategoryInternal][SelectedSkill].perLevel != undefined){
          SkillDetails += " [Value: " + (AllSkills[CategoryInternal][SelectedSkill].value + (AllSkills[CategoryInternal][SelectedSkill].perLevel * (Level-1))).toFixed(3) + "]";
        } else{
           SkillDetails += " [Value: " + AllSkills[CategoryInternal][SelectedSkill].value + "]";
        }

        if(AllSkills[CategoryInternal][SelectedSkill].notes != undefined){
          SkillDetails += " [Notes: " + AllSkills[CategoryInternal][SelectedSkill].notes + "]";
        }

        if(Category != 3){
          SkillDetails += " (Level: " + Level + ")";
        }



        message.channel.send("You obtained " + CategoryInternal + " " + SelectedSkill + "! " + SkillDetails);

        UserMaster[UserID].SIFAS.Insights.push(ToAdd);

        let UpdatedJSON = JSON.stringify(UserMaster, null, "\t");
        fs.writeFileSync("./PetBot/settings/user/master.json", UpdatedJSON.toString());


      }
    }
  }
}



function getRandom(min, max) {
    return rng.integer({min, max});
  }