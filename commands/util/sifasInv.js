const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
//const mysql = require('mysql');
const fs = require('fs');
const stringTable = require('string-table');
// vars that I need for some reason


module.exports = class SIFASInventoryCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'sifasinv',
            group: 'util',
            guildOnly: true,
            memberName: 'sifasinv',
            aliases: ['sifasi'],
            description: 'SIFAS Inventory.',
            throttling: {
        usages: 1,
        duration: 5
    },
        });
    }

   run(message, args) { // Generates an HTML file to SIFAS inventory

    let UserID = message.author.id;
    let UserMaster = JSON.parse(fs.readFileSync("./PetBot/settings/user/master.json"));

    let Macaron1 = UserMaster[UserID].SIFAS.Inventory["Macaron 1⋆"];
    let Macaron2 = UserMaster[UserID].SIFAS.Inventory["Macaron 2⋆"];
    let Macaron3 = UserMaster[UserID].SIFAS.Inventory["Macaron 3⋆"];
    let Seeds = UserMaster[UserID].SIFAS.Inventory["Seeds"];
    let Books = UserMaster[UserID].SIFAS.Inventory["Books"];
    let RainbowNecklace = UserMaster[UserID].SIFAS.Inventory["Rainbow Necklace"];
    let SkillTicket = UserMaster[UserID].SIFAS.Inventory["Skill Ticket"];


  /*Macaron1 = Macaron1.toString('utf8');
  Macaron2 = Macaron2.toString('utf8');
  Macaron3 = Macaron3.toString('utf8');
  Seeds = Seeds.toString('utf8');
  Notebook = Notebook.toString('utf8');
  RainbowNecklace = RainbowNecklace.toString('utf8');
  SkillTicket = SkillTicket.toString('utf8'); */


  let SIFASTable = [
  { Macaron1,
    Macaron2, 
    Macaron3, 
    Seeds, 
    Books,
    RainbowNecklace,
    SkillTicket }
  ];


  let MessageToSend = "```"+stringTable.create(SIFASTable)+"```";
  let Inventory = JSON.parse(fs.readFileSync("./PetBot/settings/sifas/Inventory/"+UserID+"/Inventory.json", 'utf8'));
  let HTMLFile = '<style>body{font-family: sans-serif;background-color: aliceblue}.parent{width: 80%; margin: 0 auto;display: flex;flex-direction: row;flex-wrap: wrap }.item {display: flex;flex-direction: row;padding: 2%;}.list {padding: 0;margin: 0;display: flex;flex-direction: column;list-style: none;justify-content: center}.list li:nth-child(1){font-size: 1.2rem}.list li {margin: 10px 0px;}.image{margin-right: 20px}</style>';

  message.channel.send(MessageToSend);

  Object.values(Inventory).forEach((card) => {
    let cardIcon = card.icon.unidolized;
    if(card.idolized){
      cardIcon = card.icon.idolized;
    }
    let maxLvl = 80;
    if(card.rarity == "SR"){
      maxLvl = 60;
    }

    if(card.rarity != "R"){
      HTMLFile += '<div class="parent">';
      HTMLFile += '<div class="item">';
      HTMLFile += '<div class="image">';
      HTMLFile += '<img style="float: left;" src="' + cardIcon + '"/>';
      HTMLFile += '</div>';
      HTMLFile += '<div class="content">';
      HTMLFile += '<ul class="list">';
      HTMLFile += '<li>' + card.name +' - ' + card.set + ' (' + card.rarity + ')' + ' [ID: ' + card.id + ']</li>'
      HTMLFile += '<li>Appeal: ' + card.stats.Appeal + '</li>';
      HTMLFile += '<li>Stamina: ' + card.stats.Stamina + '</li>';
      HTMLFile += '<li>Technique: ' + card.stats.Technique + '</li>';
      HTMLFile += '<li>Level: ' + card.stats.Level + '/' + maxLvl + '</li>';
      HTMLFile += '<li>Limit Break: ' + card.limitBreak + '/5</li>';
      HTMLFile += '<li>Skill Lv: ' + card.skills.skill.level + '</li>';
      HTMLFile += '<li>Ability Lv: ' + card.skills.ability.level + '</li>'; 
      HTMLFile += '</ul>';
      HTMLFile += '</div></div></div>';
    }
  });

  fs.writeFileSync("./PetBot/settings/sifas/Inventory/"+UserID+"/"+UserID+"_Inventory.html", HTMLFile.toString());
  message.channel.send(new Discord.MessageAttachment("./PetBot/settings/sifas/Inventory/"+UserID+"/"+UserID+"_Inventory.html"));

    }
  }