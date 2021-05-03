const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const fs = require('fs');
const rng = require('random-world');
const mergeImg = require('merge-img');


module.exports = class SIFASTeamCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'sifasteam',
            group: 'util',
            guildOnly: true,
            memberName: 'sifasteam',
            aliases: ['sifast'],
            description: 'SIFAS Team Interface.',
            throttling: {
        usages: 1,
        duration: 5
    },
        });
    }

   run(message, args) { // Allows you to build a SIFAS team
    args = args.split(' ');
    console.log("SIFAS Team");

    let UserID = message.author.id;
    let UserMaster = JSON.parse(fs.readFileSync("./PetBot/settings/user/master.json"));
    let Inventory = JSON.parse(fs.readFileSync("./PetBot/settings/sifas/Inventory/"+UserID+"/Inventory.json", 'utf8'));
    let Act = args[0];
    console.log(Act);

    if(Act == "set"){
      let Card = args[1];
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

      let Position = args[2];
      if(!!Inventory[TokenizedID] != false){ // exists

        if(isNaN(Position)){
          message.channel.send("Please select a valid position (1-9).");
          return;
        }
        if(Position < 0 || Position > 9){
          message.channel.send("Please select a valid position (1-9).");
          return;
        }
      } else{
        message.channel.send("You don't own this card.");
        return;
      }

      let Team = JSON.parse(fs.readFileSync("./PetBot/settings/sifas/Inventory/"+UserID+"/Team.json", 'utf8'));
      Team[Position] = parseInt(TokenizedID);
      let UpdatedJSON = JSON.stringify(Team, null, "\t");
      fs.writeFileSync("./PetBot/settings/sifas/Inventory/"+UserID+"/Team.json", UpdatedJSON.toString());
    }

    if(Act == "set" || Act == "show"){
      let Team = JSON.parse(fs.readFileSync("./PetBot/settings/sifas/Inventory/"+UserID+"/Team.json", 'utf8'));
      let TeamAppeal = 0;
      let TeamStamina = 0;
      let TeamTechnique = 0;
      let F1Appeal = 0;
      let F1Stamina = 0;
      let F1Technique = 0;
      let F2Appeal = 0;
      let F2Stamina = 0;
      let F2Technique = 0;
      let F3Appeal = 0;
      let F3Stamina = 0;
      let F3Technique = 0;

      for(let i = 1; i <= 3; i++){ // Formation 1
        if(Team[i] != 0){
          F1Appeal += Inventory[Team[i]].stats.Appeal;
          F1Stamina += Inventory[Team[i]].stats.Stamina;
          F1Technique += Inventory[Team[i]].stats.Technique;
        }
      }
      for(let i = 4; i <= 6; i++){ // Formation 2
        if(Team[i] != 0){  
          F2Appeal += Inventory[Team[i]].stats.Appeal;
          F2Stamina += Inventory[Team[i]].stats.Stamina;
          F2Technique += Inventory[Team[i]].stats.Technique;
        }
      }
      for(let i = 7; i <= 9; i++){ // Formation 3
        if(Team[i] != 0){
          F3Appeal += Inventory[Team[i]].stats.Appeal;
          F3Stamina += Inventory[Team[i]].stats.Stamina;
          F3Technique += Inventory[Team[i]].stats.Technique; 
        }
      }

      let Extra = {
        "1": {
          "Appeal": 0,
          "Stamina": 0,
          "Technique": 0
        },
        "2" : {
          "Appeal": 0,
          "Stamina": 0,
          "Technique": 0
        },
        "3": {
          "Appeal": 0,
          "Stamina": 0,
          "Technique": 0
        }
      }

      let Skills = JSON.parse(fs.readFileSync("./PetBot/settings/sifas/skills.json", 'utf8'));

      for(let i = 1; i <= 9; i++){
        if(Team[i] != 0){
          let StatCheck = "";

          console.log(Skills.ability[Inventory[Team[i]].skills.ability.id]);
          console.log(Inventory[Team[i]].skills.ability);
          console.log(Skills.ability);


          if(Skills.ability[Inventory[Team[i]].skills.ability.id].type == "Appeal+"){
            StatCheck = "Appeal";
          } else if(Skills.ability[Inventory[Team[i]].skills.ability.id].type == "Stamina+"){
            StatCheck = "Stamina";
          } else if(Skills.ability[Inventory[Team[i]].skills.ability.id].type == "Technique+"){
            StatCheck = "Technique";
          } 

          if(Skills.ability[Inventory[Team[i]].skills.ability.id].target == "Self"){
              Extra[Math.ceil(i/3)][StatCheck] += Inventory[Team[i]].stats[StatCheck] * (Skills.ability[Inventory[Team[i]].skills.ability.id].value + (Inventory[Team[i]].skills.ability.level * Skills.ability[Inventory[Team[i]].skills.ability.id].perLevel));
          } else if(Skills.ability[Inventory[Team[i]].skills.ability.id].target == "Same Type"){
            let Check = Inventory[Team[i]].stats.role;
            for(let x = 1; x <= 9; x++){
              if(Team[x] != 0){
                if(Inventory[Team[x]].stats.role == Check){
                  Extra[Math.ceil(x/3)][StatCheck] += Inventory[Team[x]].stats[StatCheck] * (Skills.ability[Inventory[Team[x]].skills.ability.id].value + (Inventory[Team[x]].skills.ability.level * Skills.ability[Inventory[Team[x]].skills.ability.id].perLevel));
                }
              }
            }
          } else if(Skills.ability[Inventory[Team[i]].skills.ability.id].target == "Group"){
            for(let x = 1; x <= 9; x++){
              if(x != i && Team[x] != 0){
                Extra[Math.ceil(x/3)][StatCheck] += Inventory[Team[x]].stats[StatCheck] * (Skills.ability[Inventory[Team[x]].skills.ability.id].value + (Inventory[Team[x]].skills.ability.level * Skills.ability[Inventory[Team[x]].skills.ability.id].perLevel));
              }
            }
          } else if(Skills.ability[Inventory[Team[i]].skills.ability.id].target == "All"){
            for(let x = 1; x <= 9; x++){
              if(Team[x] != 0){
                Extra[Math.ceil(x/3)][StatCheck] += Inventory[Team[x]].stats[StatCheck] * (Skills.ability[Inventory[Team[x]].skills.ability.id].value + (Inventory[Team[x]].skills.ability.level * Skills.ability[Inventory[Team[x]].skills.ability.id].perLevel)); 
              }
            }
          } else if(Skills.ability[Inventory[Team[i]].skills.ability.id].target == "Same Attribute"){
            let Check = Inventory[Team[i]].stats.attribute;
            for(let x = 1; x <= 9; x++){
              if(Team[x] != 0){
                  if(Inventory[Team[x]].stats.attribute == Check){
                    Extra[Math.ceil(x/3)][StatCheck] += Inventory[Team[x]].stats[StatCheck] * (Skills.ability[Inventory[Team[x]].skills.ability.id].value + (Inventory[Team[x]].skills.ability.level * Skills.ability[Inventory[Team[x]].skills.ability.id].perLevel));
                  }
                }
            }
          } else if(Skills.ability[Inventory[Team[i]].skills.ability.id].target == "Same Strategy"){
            for(let x = 1; x <= 9; x++){
              if(Math.ceil(x/3) == Math.ceil(i/3) && Team[x] != 0){
                Extra[Math.ceil(x/3)][StatCheck] += Inventory[Team[x]].stats[StatCheck] * (Skills.ability[Inventory[Team[x]].skills.ability.id].value + (Inventory[Team[x]].skills.ability.level * Skills.ability[Inventory[Team[x]].skills.ability.id].perLevel));
              }
            }
          }  
        }

      }

      console.log(Extra);

      let MessageToSend = "**1st Strategy:**\nAppeal: " + F1Appeal + " (Total: " + Math.round((F1Appeal + Extra["1"]["Appeal"])) + ")";
      MessageToSend += "\nStamina: " + F1Stamina + " (Total: " + Math.round((F1Stamina + Extra["1"]["Stamina"])) + ")";
      MessageToSend += "\nTechnique: " + F1Technique + " (Total: " + Math.round((F1Technique + Extra["1"]["Technique"])) + ")";
      MessageToSend += "\n\n**2nd Strategy:**\nAppeal: " + F2Appeal + " (Total: " + Math.round((F2Appeal + Extra["2"]["Appeal"])) + ")";
      MessageToSend += "\nStamina: " + F2Stamina + " (Total: " + Math.round((F2Stamina + Extra["2"]["Stamina"])) + ")";
      MessageToSend += "\nTechnique: " + F2Technique + " (Total: " + Math.round((F2Technique + Extra["2"]["Technique"])) + ")";
      MessageToSend += "\n\n**3rd Strategy:**\nAppeal: " + F3Appeal + " (Total: " + Math.round((F3Appeal + Extra["3"]["Appeal"])) + ")";
      MessageToSend += "\nStamina: " + F3Stamina + " (Total: " + Math.round((F3Stamina + Extra["3"]["Stamina"])) + ")";
      MessageToSend += "\nTechnique: " + F3Technique + " (Total: " + Math.round((F3Technique + Extra["3"]["Technique"])) + ")";

      let TeamSlot = [];
      let RTemplate = ["https://tirofinale.kirara.ca/i/5930/iHFXSaSq3DYvaA.png", "https://tirofinale.kirara.ca/i/715b/b6feVek0ZCnZYw.png", "https://tirofinale.kirara.ca/i/7559/NHuEfckN3RfDHA.png", "https://tirofinale.kirara.ca/i/797b/9G4BHAfnl4lZYg.png", "https://tirofinale.kirara.ca/i/7235/VY8vVDtcTiV16g.png", "https://tirofinale.kirara.ca/i/3b73/c-0mQcK-KmsKNA.png", "https://tirofinale.kirara.ca/i/7e35/6XWnM116uVkQ4Q.png", "https://tirofinale.kirara.ca/i/6845/kIOr22quy62kRQ.png", "https://tirofinale.kirara.ca/i/643e/EbD3nY9f8_gP7Q.png", "https://tirofinale.kirara.ca/i/685c/-V_UXRwO89aCug.png", "https://tirofinale.kirara.ca/i/6136/a8emJlfaPfWseQ.png", "https://tirofinale.kirara.ca/i/5927/59QU8deCQhX_6g.png", "https://tirofinale.kirara.ca/i/6a7b/mTxsDCZkdJgm8A.png", "https://tirofinale.kirara.ca/i/3c5f/Bz7cXVrUfrKGog.png", "https://tirofinale.kirara.ca/i/6038/W-fkXmFJGnb6kw.png", "https://tirofinale.kirara.ca/i/6038/W-fkXmFJGnb6kw.png", "https://tirofinale.kirara.ca/i/282b/8zm_nRh82_4BLg.png", "https://tirofinale.kirara.ca/i/4f5f/Gt1Hk2Jrn7QUQA.png", "https://tirofinale.kirara.ca/i/6651/FL8vTOYjjX4_eQ.png", "https://tirofinale.kirara.ca/i/617d/pMGqXCiaHk3fOA.png", "https://tirofinale.kirara.ca/i/544f/h6KfA9bzSdwK-A.png", "https://tirofinale.kirara.ca/i/2c/OiHvuCARADRpcQ.png", "https://tirofinale.kirara.ca/i/5446/Qv4F3BNTZlvCog.png", "https://tirofinale.kirara.ca/i/345d/VzDprDOde2p4oQ.png", "https://tirofinale.kirara.ca/i/457c/ehSix3rIiWZhtQ.png", "https://tirofinale.kirara.ca/i/5229/OKQif8kdxbuilA.png", "https://tirofinale.kirara.ca/i/3760/3feVfe2hk29EjA.png", "https://tirofinale.kirara.ca/i/2d2f/yA21XTc4RhhAEw.png"];

      for(let i = 1; i <= 9; i++){
        if(Team[i] == 0){
            TeamSlot[i] = RTemplate[getRandom(-1, RTemplate.length - 1)];
        } else{
          if(Inventory[Team[i]].idolized){
            TeamSlot[i] = Inventory[Team[i]].icon.idolized;
        } else{
            TeamSlot[i] = Inventory[Team[i]].icon.unidolized;
          }
        }
      }

      mergeImg([TeamSlot[1],TeamSlot[2],TeamSlot[3],TeamSlot[4],TeamSlot[5],TeamSlot[6],TeamSlot[7],TeamSlot[8],TeamSlot[9]])
        .then((img) => {
          console.log(img); // => `[object Jimp]` 
          img.write('sifas_team.png', () => message.channel.send(new Discord.MessageAttachment('sifas_team.png')));
        });

        message.channel.send(MessageToSend);
    }
  }
}


function getRandom(min, max) {
    return rng.integer({min, max});
  }