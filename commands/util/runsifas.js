const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const fs = require('fs');
const rng = require('random-world');
const mergeImg = require('merge-img');


module.exports = class RunSIFASCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'runsifas',
            group: 'util',
            guildOnly: true,
            memberName: 'runsifas',
            aliases: ['rsifas'],
            description: 'Command to run SIFAS events.',
            throttling: {
        usages: 1,
        duration: 5
    },
        });
    }

   run(message, args) {

    // This command was on development and was never finished. May not work entirely.

    args = args.split(' ');
  
    let UserID = message.author.id;

    if(UserID != 168389193603612673){
      message.channel.send("Not enough privileges to run this command.");
      return;
    }


    let CurrentPlayer = EventData.current_player;

    let UserMaster = JSON.parse(fs.readFileSync("./PetBot/settings/user/master.json"));
    let Inventory = JSON.parse(fs.readFileSync("./PetBot/settings/sifas/Inventory/"+CurrentPlayer+"/Inventory.json", 'utf8'));
    let EventData = JSON.parse(fs.readFileSync("./PetBot/settings/sifas/eventdata.json", 'utf8'));


    // Calculate strategy stats

    let Team = JSON.parse(fs.readFileSync("./PetBot/settings/sifas/Inventory/"+CurrentPlayer+"/Team.json", 'utf8'));
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
            if(Inventory[Team[x]].stats.role == Check && Team[x] != 0){
              Extra[Math.ceil(x/3)][StatCheck] += Inventory[Team[x]].stats[StatCheck] * (Skills.ability[Inventory[Team[x]].skills.ability.id].value + (Inventory[Team[x]].skills.ability.level * Skills.ability[Inventory[Team[x]].skills.ability.id].perLevel));
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
            if(Inventory[Team[x]].stats.attribute == Check && Team[x] != 0){
              Extra[Math.ceil(x/3)][StatCheck] += Inventory[Team[x]].stats[StatCheck] * (Skills.ability[Inventory[Team[x]].skills.ability.id].value + (Inventory[Team[x]].skills.ability.level * Skills.ability[Inventory[Team[x]].skills.ability.id].perLevel));
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

    let Appeal = 0;
    let Stamina = 0;
    let Technique = 0;
    if(EventData.players_info[CurrentPlayer].active_strategy == 1){
      Appeal = Math.round((F1Appeal + Extra["1"]["Appeal"]));
      Stamina = Math.round((F1Stamina + Extra["1"]["Stamina"]));
      Technique = Math.round((F1Technique + Extra["1"]["Technique"]));
    } else if(EventData.players_info[CurrentPlayer].active_strategy == 2){
      Appeal = Math.round((F2Appeal + Extra["2"]["Appeal"]));
      Stamina = Math.round((F2Stamina + Extra["2"]["Stamina"]));
      Technique = Math.round((F2Technique + Extra["2"]["Technique"]));
    } else if(EventData.players_info[CurrentPlayer].active_strategy == 3){
      Appeal = Math.round((F3Appeal + Extra["3"]["Appeal"]));
      Stamina = Math.round((F3Stamina + Extra["3"]["Stamina"]));
      Technique = Math.round((F3Technique + Extra["3"]["Technique"]));
    }

    if(EventData.players.length <= 1){
      message.channel.send("There are no more players available.");
      return;
    }

    let TargetPlayer = EventData.players[getRandom(-1, EventData.players.length)];
    while(TargetPlayer == CurrentPlayer){
      TargetPlayer = EventData.players[getRandom(-1, EventData.players.length)];
    }

    // Time to activate skills!!!!
    EventData.turn++;
    if(Math.ceil(EventData.turn / 3) == 1){
      // Activate on-start ability2
      for(let i = 1; i <= 9; i++){
        if(Skills.ability2[Inventory[Team[i]].skills.ability2.id].activation == "Start"){
          let randomChance = getRandom(-1, 100);
          if(randomChance <= Skills.ability2[Inventory[Team[i]].skills.ability2.id].chance){
            let NewEffect = {};
            NewEffect.type = Skills.ability2[Inventory[Team[i]].skills.ability2.id].type;
            NewEffect.TurnsLeft = "EOL";
            NewEffect.value = Skills.ability2[Inventory[Team[i]].skills.ability2.id].value;
            NewEffect.category = "Buff";
            NewEffect.removable = true;
            EventData.players_info[CurrentPlayer].effects.push(NewEffect);
          }
        }
      }
    }
    // Every turn skills

    
  }
}


function getRandom(min, max) {
    return rng.integer({min, max});
  }