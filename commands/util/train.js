const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const ScoutRR = require('./mod/srr.js');
const https = require('https');
const mergeImg = require('merge-img');
const fs = require('fs');
const rng = require('random-world');
const stringTable = require('string-table');


module.exports = class SIFASTrainingCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'train',
            group: 'util',
            guildOnly: true,
            memberName: 'train',
            description: 'SIFAS Training.',
            throttling: {
        usages: 8,
        duration: 7
    },
        });
    }

  run(message, args) { // Allows you to perform SIFAS training

    args = args.split(' ');
    let Card = args[0];
    let Action = args[1];

    let UserID = message.author.id;
    let UserMaster = JSON.parse(fs.readFileSync("./PetBot/settings/user/master.json"));
    let SettingsMaster = JSON.parse(fs.readFileSync("./PetBot/settings/master.json"));
    let ScoutRunning = JSON.parse(fs.readFileSync("./PetBot/settings/scout/Running.json"));
    let Inventory = JSON.parse(fs.readFileSync("./PetBot/settings/sifas/Inventory/"+UserID+"/Inventory.json", 'utf8'));

    if(!!Card == false){
      message.channel.send("Invalid card");
    } else{
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
          console.log("Success!");
          let Action = args[1];
          if(!!Inventory[TokenizedID] != false){ // exists
            let CardData = Inventory[TokenizedID];
            if(!!Action == false){ 
              let displayColorDic = {
                "Honoka": "#E2732D",
                "Kotori": "#8C9395",
                "Umi": "#1660A5",
                "Hanayo": "#54AB48",
                "Rin": "#F1C51F",
                "Maki": "#CC3554F",
                "Nico": "#D54E8D",
                "Eli": "#36B3DD",
                "Nozomi": "#744791",
                "Chika": "#F0A20B",
                "Riko": "#E9A9E8",
                "Kanan": "#13E8AE",
                "Dia": "#F23B4C",
                "You": "#49B9F9",
                "Yohane": "#898989",
                "Hanamaru": "#E6D617",
                "Mari": "#AE58EB",
                "Ruby": "#FB75E4",
                "Ayumu": "#E792A9",
                "Kasumi": "#F2EB90",
                "Shizuku": "#AEDCF4",
                "Karin": "#96B1E8",
                "Ai": "#FDA566",
                "Kanata": "#D299DE",
                "Setsuna": "#FD767A",
                "Emma": "#A6E37B",
                "Rina": "#AEABAE"
              }
              let displayColor = displayColorDic[CardData.name];
              if(displayColor == undefined){
                displayColor = "#000000";
              }
              let title = CardData.name + " - " + CardData.set + " (" + CardData.rarity + ")";
              let image = "";
              if(!CardData.idolized){
                image = CardData.icon.unidolized;
              } else{
                image = CardData.icon.idolized;
              }

              let LevelPerRarity = {
                "SR": "60",
                "UR": "80"
              }

              let levelVal = CardData.stats.Level + "/" + LevelPerRarity[CardData.rarity];

              let unlockedNodes = CardData.unlockedNodes;
              let op = 0;
              let unlockedNodesBin = unlockedNodes.toString(2);

              let SkillTree = JSON.parse(fs.readFileSync("./PetBot/settings/sifas/skilltrees.json"));
              let CurrentMap = SkillTree["tree"][CardData.rarity]["Map"];

              let availableNodes = CardData.availableNodes;
              for(let i = 0; i < availableNodes.length; i++){
                if(!!availableNodes[i] == false){
                  availableNodes[i] = "-";
                } else{
                  if(SkillTree["tree"][CardData.rarity]["Values"][CardData.stats.role][availableNodes[i]] == 1){
                    if(CardData.rarity == "UR"){
                       availableNodes[i] = "+" + Math.round(CardData.baseStats.Appeal * (1/6)) + " Appeal";
                     } else{
                       availableNodes[i] = "+" + Math.round(CardData.baseStats.Appeal * 0.15) + " Appeal";
                     }
                  } else if(SkillTree["tree"][CardData.rarity]["Values"][CardData.stats.role][availableNodes[i]] == 2){
                    if(CardData.rarity == "UR"){
                       availableNodes[i] = "+" + Math.round(CardData.baseStats.Stamina * (1/6)) + " Stamina";
                     } else{
                       availableNodes[i] = "+" + Math.round(CardData.baseStats.Stamina * 0.15) + " Stamina";
                     }
                  } else if(SkillTree["tree"][CardData.rarity]["Values"][CardData.stats.role][availableNodes[i]] == 3){
                    if(CardData.rarity == "UR"){
                       availableNodes[i] = "+" + Math.round(CardData.baseStats.Technique * (1/6)) + " Technique";
                     } else{
                       availableNodes[i] = "+" + Math.round(CardData.baseStats.Technique * 0.15) + " Technique";
                     }
                  } else if(SkillTree["tree"][CardData.rarity]["Values"][CardData.stats.role][availableNodes[i]] == 4){
                       availableNodes[i] = "Skill level up!";
                  } else if(SkillTree["tree"][CardData.rarity]["Values"][CardData.stats.role][availableNodes[i]] == 5){
                       availableNodes[i] = "Ability level up!";
                  } else if(SkillTree["tree"][CardData.rarity]["Values"][CardData.stats.role][availableNodes[i]] == 6){
                       availableNodes[i] = "Unlock new Insight slot";
                  } else if(SkillTree["tree"][CardData.rarity]["Values"][CardData.stats.role][availableNodes[i]] == 7){
                       availableNodes[i] = "Unlock new voice line";
                  } else if(SkillTree["tree"][CardData.rarity]["Values"][CardData.stats.role][availableNodes[i]] == 8){
                       availableNodes[i] = "Unlock story key + skill ticket";
                  } else if(SkillTree["tree"][CardData.rarity]["Values"][CardData.stats.role][availableNodes[i]] == 9){
                       availableNodes[i] = "Unlock costume";
                  } else if(SkillTree["tree"][CardData.rarity]["Values"][CardData.stats.role][availableNodes[i]] == 10){
                       availableNodes[i] = "Idolize";
                  } else if(SkillTree["tree"][CardData.rarity]["Values"][CardData.stats.role][availableNodes[i]] == 11){
                      if(CardData.rarity == "UR"){
                       availableNodes[i] = "+" + Math.round(CardData.baseStats.Appeal * 0.25) + " Appeal";
                     } else{
                       availableNodes[i] = "+" + Math.round(CardData.baseStats.Appeal * 0.2) + " Appeal";
                     }
                  } else if(SkillTree["tree"][CardData.rarity]["Values"][CardData.stats.role][availableNodes[i]] == 12){
                      if(CardData.rarity == "UR"){
                       availableNodes[i] = "+" + Math.round(CardData.baseStats.Stamina * 0.25) + " Stamina";
                     } else{
                       availableNodes[i] = "+" + Math.round(CardData.baseStats.Stamina * 0.2) + " Stamina";
                     }
                  } else if(SkillTree["tree"][CardData.rarity]["Values"][CardData.stats.role][availableNodes[i]] == 13){
                      if(CardData.rarity == "UR"){
                       availableNodes[i] = "+" + Math.round(CardData.baseStats.Technique * 0.25) + " Technique";
                     } else{
                       availableNodes[i] = "+" + Math.round(CardData.baseStats.Technique * 0.2) + " Technique";
                     }
                  }
                }
              }

              let CardFullImg = CardData.costume.before;
              if(CardData.idolized){
                CardFullImg = CardData.costume.after;
              }
                          
              const cardEmbed = new Discord.MessageEmbed()
              .setColor(displayColor)
              .setTitle(title)
              .addFields(
                { name: 'Level', value: levelVal, inline: true },
                { name: 'Limit Break', value: CardData.limitBreak, inline: true },
                { name: 'Insight Skills', value: CardData.skills.insights.insights.length + "/" + CardData.skills.insights.slots, inline: true },
                { name: 'Appeal', value: CardData.stats.Appeal, inline: true },
                { name: 'Stamina', value: CardData.stats.Stamina, inline: true },
                { name: 'Technique', value: CardData.stats.Technique, inline: true }
              )
              .setThumbnail(image)
              .setImage(CardFullImg);

              for(let i = 0; i < availableNodes.length; i++){
                cardEmbed.addFields({ name: 'Available route #' + (i + 1), value: availableNodes[i], inline: true });
              }
              
              message.channel.send(cardEmbed);
            } else{
              if(Action == "LevelUp"){
                let Levels = parseInt(args[2]);
                if(isNaN(Levels)){
                  message.channel.send("Please input a valid level up amount.");
                  return;
                } else{
                  if(CardData.rarity == "SR"){
                    if(CardData.stats.Level == 60){
                      message.channel.send("This card has aleady reached max level!");
                      return;
                    }
                    if(Levels > 60 - CardData.stats.Level){
                      Levels = 60 - CardData.stats.Level;
                    }
                  } else{
                    if(CardData.stats.Level == 80){
                      message.channel.send("This card has aleady reached max level!");
                      return;
                    }
                    if(Levels > 80 - CardData.stats.Level){
                      Levels = 80 - CardData.stats.Level;
                    }
                  }

                  if(Levels <= 0){
                    message.channel.send("Please input a valid level up amount.");
                    return;
                  }

                  
                  let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt"); // Take current amount
                  let AmountToRemove = 10*Levels;
                  if(CurrentAmount - AmountToRemove < 0){
                    message.channel.send("You don't have enough PetCoins to perform this action.");
                    return;
                  }
                  CardData.stats.Level += parseInt(Levels);
                  CurrentAmount -= AmountToRemove;

                  CardData.stats.Appeal += Math.round(CardData.baseStats.Appeal * 0.0085 * Levels);
                  CardData.stats.Stamina += Math.round(CardData.baseStats.Stamina * 0.0085 * Levels);
                  CardData.stats.Technique += Math.round(CardData.baseStats.Technique * 0.0085 * Levels);


                  fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt", CurrentAmount.toString());
                  Inventory[TokenizedID] = CardData;
                  let UpdatedJSON = JSON.stringify(Inventory, null, "\t");
                  fs.writeFileSync("./PetBot/settings/sifas/Inventory/"+UserID+"/Inventory.json", UpdatedJSON.toString());

                  message.channel.send("Leveled up " + Levels + " levels!");
                }
              } else if(Action == "Path"){
                let Selected = args[2];
                let blockedByLB = false;
                if(isNaN(Selected) && Selected != "MAX"){
                  message.channel.send("Please select a valid path.");
                  return;
                } else{
                  if((Selected <= 0 || Selected > CardData.availableNodes.length) && Selected != "MAX" && CardData.availableNodes.length != 0){
                    message.channel.send("Please select a valid path.");
                  } else{
                    let Repeat = true;
                    let Mc1 = 0;
                    let Mc2 = 0;
                    let Mc3 = 0;
                    let Books = 0;
                    let Seeds = 0;
                    let RN = 0;
                    let SkillTree = JSON.parse(fs.readFileSync("./PetBot/settings/sifas/skilltrees.json"));
                    let toMax = false;
                    if(Selected == "MAX"){
                      Selected = 1;
                      toMax = true;
                    }
                    while(Repeat){
                      let LBReq = 0;
                      console.log("LB Checking");
                      if(CardData.availableNodes[Selected - 1] > 46){
                        LBReq = 1;
                      } else if(CardData.availableNodes[Selected - 1] > 53){
                        LBReq = 2;
                      } else if(CardData.availableNodes[Selected - 1] > 60){
                        LBReq = 3;
                      } else if(CardData.availableNodes[Selected - 1] > 67){
                        LBReq = 4;
                      } else if(CardData.availableNodes[Selected - 1] > 74){
                        LBReq = 5;
                      }

                      if(CardData.limitBreak < LBReq){
                        if(!toMax){
                          message.channel.send("This node is locked! You need to Limit Break this card to unlock it.");
                          return;
                        }
                         else{
                          Repeat = false;
                          blockedByLB = true;
                          console.log("Forced break!");
                          break;
                          
                        }
                      }

                      let Costs = {
                      "UR": {
                        "1": [107, 62, 45, 0, 0, 0], // Appeal
                        "2": [107, 62, 45, 0, 0, 0], // Stamina
                        "3": [107, 62, 45, 0, 0, 0], // Technique
                        "4": [0, 0, 0, 58, 0, 0], // Skill
                        "5": [0, 0, 0, 0, 55, 0], // Ability
                        "6": [0, 0, 0, 0, 0, 25], // Insight
                        "7": [80, 65, 50, 0, 0, 25], // Voice
                        "8": [80, 60, 50, 0, 0, 25], // Story
                        "9": [30, 20, 10, 0, 0, 25], // Costume
                        "10": [0, 0, 0, 0, 0, 30], // Idolization
                        "11": [107, 62, 45, 0, 0, 0], // Star Appeal
                        "12": [107, 62, 45, 0, 0, 0], // Star Stamina
                        "13": [107, 62, 45, 0, 0, 0]  // Star Technique
                        // Macaron 1, Macaron 2, Macaron 3, Book, Seeds, Rainbow Necklace
                      },
                      "SR": {
                        "1": [99, 57, 40, 0, 0, 0], 
                        "2": [99, 57, 40, 0, 0, 0], 
                        "3": [99, 57, 40, 0, 0, 0], 
                        "4": [0, 0, 0, 37, 0, 0],
                        "5": [0, 0, 0, 0, 37, 0],
                        "6": [0, 0, 0, 0, 0, 20],
                        "7": [70, 55, 45, 0, 0, 25],
                        "8": [80, 60, 50, 0, 0, 25],
                        "9": [30, 20, 10, 0, 0, 25],
                        "10": [0, 0, 0, 0, 0, 30],
                        "11": [99, 57, 40, 0, 0, 0], 
                        "12": [99, 57, 40, 0, 0, 0], 
                        "13": [99, 57, 40, 0, 0, 0]
                      }
                    }

                      let CurrentMap = SkillTree["tree"][CardData.rarity]["Values"][CardData.stats.role];

                      console.log("Obtaining NodeType");
                      console.log(CurrentMap[CardData.availableNodes]);
                      console.log(CardData.availableNodes);
                      console.log(CurrentMap);

                      let NodeType = CurrentMap[CardData.availableNodes[Selected - 1]];
                      Mc1 += Costs[CardData.rarity][NodeType][0];
                      Mc2 += Costs[CardData.rarity][NodeType][1];
                      Mc3 += Costs[CardData.rarity][NodeType][2];
                      Books += Costs[CardData.rarity][NodeType][3];
                      Seeds += Costs[CardData.rarity][NodeType][4];
                      RN += Costs[CardData.rarity][NodeType][5];

                    
                      if(UserMaster[UserID].SIFAS.Inventory["Macaron 1⋆"] < Mc1 || UserMaster[UserID].SIFAS.Inventory["Macaron 2⋆"] < Mc2 || UserMaster[UserID].SIFAS.Inventory["Macaron 3⋆"]  < Mc3 || UserMaster[UserID].SIFAS.Inventory["Seeds"] < Seeds || UserMaster[UserID].SIFAS.Inventory["Books"] < Books || UserMaster[UserID].SIFAS.Inventory["Rainbow Necklace"] < RN){
                        Repeat = false;
                      } else{

                        UserMaster[UserID].SIFAS.Inventory["Macaron 1⋆"] -= Costs[CardData.rarity][NodeType][0];
                        UserMaster[UserID].SIFAS.Inventory["Macaron 2⋆"] -= Costs[CardData.rarity][NodeType][1];
                        UserMaster[UserID].SIFAS.Inventory["Macaron 3⋆"] -= Costs[CardData.rarity][NodeType][2];
                        UserMaster[UserID].SIFAS.Inventory["Seeds"] -= Costs[CardData.rarity][NodeType][3];
                        UserMaster[UserID].SIFAS.Inventory["Books"] -= Costs[CardData.rarity][NodeType][4];
                        UserMaster[UserID].SIFAS.Inventory["Rainbow Necklace"] -= Costs[CardData.rarity][NodeType][5];

                        if(NodeType == 1){
                          if(CardData.rarity == "UR"){
                             CardData.stats.Appeal += Math.round(CardData.baseStats.Appeal * (1/6));
                           } else{
                             CardData.stats.Appeal += Math.round(CardData.baseStats.Appeal * 0.15);
                           }
                        } else if(NodeType == 2){
                          if(CardData.rarity == "UR"){
                             CardData.stats.Stamina += Math.round(CardData.baseStats.Stamina * (1/6));
                           } else{
                             CardData.stats.Stamina += Math.round(CardData.baseStats.Stamina * 0.15);
                           }
                        } else if(NodeType == 3){
                          if(CardData.rarity == "UR"){
                             CardData.stats.Technique += Math.round(CardData.baseStats.Technique * (1/6));
                           } else{
                             CardData.stats.Technique += Math.round(CardData.baseStats.Technique * 0.15);
                           }
                        } else if(NodeType == 4){
                          CardData.skills.skill.level += 1;
                        } else if(NodeType == 5){
                          CardData.skills.ability.level += 1;
                        } else if(NodeType == 6){
                          CardData.skills.insights.slots += 1;
                        } else if(NodeType == 7){
                          CardData.voices.push("Unlocked");
                        } else if(NodeType == 8){
                          UserMaster[UserID].SIFAS.Inventory["Skill Ticket"] += 1;
                        } else if(NodeType == 9){
                          CardData.costume.obtained = true;
                        } else if(NodeType == 10){
                          CardData.idolized = true;
                        } else if(NodeType == 11){
                          if(CardData.rarity == "UR"){
                             CardData.stats.Appeal += Math.round(CardData.baseStats.Appeal * 0.25);
                           } else{
                             CardData.stats.Appeal += Math.round(CardData.baseStats.Appeal * 0.2);
                           }
                        } else if(NodeType == 12){
                          if(CardData.rarity == "UR"){
                             CardData.stats.Stamina += Math.round(CardData.baseStats.Stamina * 0.25);
                           } else{
                             CardData.stats.Stamina += Math.round(CardData.baseStats.Stamina * 0.2);
                           }
                        } else if(NodeType == 13){
                          if(CardData.rarity == "UR"){
                             CardData.stats.Technique += Math.round(CardData.baseStats.Technique * 0.25);
                           } else{
                             CardData.stats.Technique += Math.round(CardData.baseStats.Technique * 0.2);
                           }
                        }

                        console.log("unlockedNodeX");
                        let unlockedNodeX = SkillTree["tree"][CardData.rarity]["Map"][CardData.availableNodes[Selected - 1]];
                        CardData.availableNodes.splice((Selected - 1), 1);
                        if(unlockedNodeX.Upper != 0){
                          CardData.availableNodes.push(unlockedNodeX.Upper);
                        }
                        if(unlockedNodeX.Next != 0){
                          CardData.availableNodes.push(unlockedNodeX.Next);
                        }
                        if(unlockedNodeX.Lower != 0){
                          CardData.availableNodes.push(unlockedNodeX.Lower);
                        }

                        if(CardData.availableNodes.length == 0 || !toMax){ // End repeat if there are no more nodes
                          Repeat = false;
                          console.log("NO MORE NODES!!!!");
                        }
                      }
                        Inventory[TokenizedID] = CardData;
                    }

                      let UpdatedJSON = JSON.stringify(UserMaster, null, "\t");
                      fs.writeFileSync("./PetBot/settings/user/master.json", UpdatedJSON.toString());

                      Inventory[TokenizedID] = CardData;
                      let UpdatedJSON2 = JSON.stringify(Inventory, null, "\t");
                      fs.writeFileSync("./PetBot/settings/sifas/Inventory/"+UserID+"/Inventory.json", UpdatedJSON2.toString());

                      let SpentMessage = "You have spent the following: ";
                      if(Mc1 != 0){
                        SpentMessage += Mc1 + " 1⋆ Macarons, ";
                      } 
                      if(Mc2 != 0){
                        SpentMessage += Mc2 + " 2⋆ Macarons, ";
                      } 
                      if(Mc3 != 0){
                        if(RN != 0 || Books != 0 || Seeds != 0){
                          SpentMessage += Mc3 + " 3⋆ Macarons, "; 
                        } else{
                          SpentMessage += Mc3 + " 3⋆ Macarons."; 
                        }
                      }
                      if(Books != 0){
                        if(RN != 0 || Seeds != 0){
                          SpentMessage += Books + " Books, "; 
                        } else{
                          SpentMessage += Books + " Books."; 
                        }
                      }
                      if(Seeds != 0){
                        if(RN != 0){
                          SpentMessage += Seeds + " Seeds, "; 
                        } else{
                          SpentMessage += Seeds + " Seeds."; 
                        }
                      }
                      if(RN != 0){
                        SpentMessage += RN + " Rainbow Necklaces.";
                      }
                      if(SpentMessage != "You have spent the following: "){
                        message.channel.send(SpentMessage);  
                      } else{
                        if(blockedByLB){
                          message.channel.send("These nodes are locked! You need to Limit Break this card to unlock them.");
                        } else{
                          message.channel.send("You can't afford any node :(");
                        }
                        
                      }
                    }
                  }
              } else{
                message.channel.send("Invalid action");
                return;
              }
            }
          } else{
            message.channel.send("You don't own this card. Time to pull?");
            return;
          }
        } else{
          message.channel.send("This key couldn't be mapped to any existing card. Check the reference sheet and try again.");
          return;
        }
      }
    }
  }




function getRandom(min, max) {
    return rng.integer({min, max});
  }
