const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const fs = require('fs');
const stringTable = require('string-table');
// vars that I need for some reason


module.exports = class DivineCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'divine',
            group: 'util',
            guildOnly: true,
            memberName: 'divine',
            aliases: ['div'],
            description: 'Retrieves User Divine Items information.',
            throttling: {
        usages: 1,
        duration: 1
    },
        });
    }

   run(message, args) {


    let UserID = message.author.id;
    var UserMaster = JSON.parse(fs.readFileSync("./PetBot/settings/user/master.json"));
    args = args.split(' ');

    if(args[0] == "assign" || args[0] == "equip"){
      if(UserMaster[UserID].Inventory.DivineItems.Items.length == 0){
        message.channel.send("You don't own any Divine Item yet.");
      } else{
        let SelectedItem = args[1];
        if(isNaN(SelectedItem) || SelectedItem >= UserMaster[UserID].Inventory.DivineItems.Items.length){
          message.channel.send("Please use a valid Divine Item ID. Use ``!div list <filters>`` to check your Divine Items.");
          return;
        }
        UserMaster[UserID].Inventory.DivineItems.Active = SelectedItem;
        message.channel.send(UserMaster[UserID].Inventory.DivineItems.Items[SelectedItem].name + " has been equiped!");

        let UpdatedJSON = JSON.stringify(UserMaster, null, "\t");
        fs.writeFileSync("./PetBot/settings/user/master.json",UpdatedJSON);
      }
    } else if(args[0] == "list"){
        let Filters = parseInt(args[1]);
        if(!!args[1]){
          console.log("filters exist");
          if(isNaN(Filters)){
            message.channel.send("Not a valid <filters> input");
            return;
          }
        } else{
          Filters = 255;
        }
        if(Filters > 255){
          Filters = 255;
        }

        console.log(Filters);

        let EnabledLimited = false;
        let EnabledUltimate = false;
        let EnabledLegendary = false;
        let EnabledEpic = false;
        let EnabledRare = false;
        let EnabledCommon = false;
        let EnabledDescription = false;
        let EnabledUnactivable = false;

        if(Filters/2 != Math.floor(Filters/2) && Filters != 0){
          EnabledUnactivable = true;
          console.log("Enabled Unactivable");
          console.log(Filters);
        }
         Filters = Math.floor(Filters/2); // 127
        if(Filters/2 != Math.floor(Filters/2) && Filters != 0){
          EnabledDescription = true;
          console.log("Enabled description");
          console.log(Filters);
        }
        Filters = Math.floor(Filters/2); // 63
        if(Filters/2 != Math.floor(Filters/2) && Filters != 0){
          EnabledCommon = true;
          console.log("Enabled Common");
          console.log(Filters);
        }
        Filters = Math.floor(Filters/2); // 31
        if(Filters/2 != Math.floor(Filters/2) && Filters != 0){
          EnabledRare = true;
          console.log("Enabled Rare");
          console.log(Filters);
        }
        Filters = Math.floor(Filters/2); // 15
        if(Filters/2 != Math.floor(Filters/2) && Filters != 0){
          EnabledEpic = true;
          console.log("Enabled Epic");
          console.log(Filters);
        }
        Filters = Math.floor(Filters/2); // 7
        if(Filters/2 != Math.floor(Filters/2) && Filters != 0){
          EnabledLegendary = true;
          console.log("Enabled Legendary");
          console.log(Filters);
        }
        Filters = Math.floor(Filters/2); // 3
        if(Filters/2 != Math.floor(Filters/2) && Filters != 0){
          EnabledUltimate = true;
          console.log("Enabled Ultimate");
          console.log(Filters);
        }
        Filters = Math.floor(Filters/2); // 1
        if(Filters/2 != Math.floor(Filters/2) && Filters != 0){
          EnabledLimited = true;
          console.log("Enabled Limited");
          console.log(Filters);
        }

        let MessageToSend = "";
        let appendN = false;

        for(let i = 0; i < UserMaster[UserID].Inventory.DivineItems.Items.length; i++){
          appendN = false;
          if(UserMaster[UserID].Inventory.DivineItems.Items[i].rarity == "Limited" && EnabledLimited){
            if(!UserMaster[UserID].Inventory.DivineItems.Items[i].activable){
              if(EnabledUnactivable){
                MessageToSend += i + ") " + UserMaster[UserID].Inventory.DivineItems.Items[i].name;
                appendN = true;
              }
            } else{
                MessageToSend += i + ") " + UserMaster[UserID].Inventory.DivineItems.Items[i].name;
                appendN = true;
            }
          } else if(UserMaster[UserID].Inventory.DivineItems.Items[i].rarity == "Ultimate" && EnabledUltimate){
            MessageToSend += i + ") " + UserMaster[UserID].Inventory.DivineItems.Items[i].name;
            appendN = true;
          } else if(UserMaster[UserID].Inventory.DivineItems.Items[i].rarity == "Legendary" && EnabledLegendary){
            MessageToSend += i + ") " + UserMaster[UserID].Inventory.DivineItems.Items[i].name;
            appendN = true;
          } else if(UserMaster[UserID].Inventory.DivineItems.Items[i].rarity == "Epic" && EnabledEpic){
            MessageToSend += i + ") " + UserMaster[UserID].Inventory.DivineItems.Items[i].name;
            appendN = true;
          } else if(UserMaster[UserID].Inventory.DivineItems.Items[i].rarity == "Rare" && EnabledRare){
            MessageToSend += i + ") " + UserMaster[UserID].Inventory.DivineItems.Items[i].name;
            appendN = true;
          } else if(UserMaster[UserID].Inventory.DivineItems.Items[i].rarity == "Common" && EnabledCommon){
            MessageToSend += i + ") " + UserMaster[UserID].Inventory.DivineItems.Items[i].name;
            appendN = true;
          } 

            if(EnabledDescription && appendN){
            MessageToSend += " (" + UserMaster[UserID].Inventory.DivineItems.Items[i].effect + ")";
          }

          if(appendN){
            MessageToSend += "\n";
          }
        }

        console.log(MessageToSend);

        if(!!MessageToSend == false){
          message.channel.send("No Divine Items found, your filters input may be wrong or your inventory empty.");
          return;
        }

        console.log(MessageToSend);
        message.channel.send(MessageToSend);
        return;
      } else{
        let BoxesCommon = UserMaster[UserID].Inventory.DivineItems.Boxes.Common;
        let BoxesRare = UserMaster[UserID].Inventory.DivineItems.Boxes.Rare;
        let BoxesEpic = UserMaster[UserID].Inventory.DivineItems.Boxes.Epic;
        let BoxesLegendary = UserMaster[UserID].Inventory.DivineItems.Boxes.Legendary;
        let BoxesUltimate = UserMaster[UserID].Inventory.DivineItems.Boxes.Ultimate;
        let BoxesLimited = UserMaster[UserID].Inventory.DivineItems.Boxes.Limited;
        let CurrentlyActive = UserMaster[UserID].Inventory.DivineItems.Active;
        
        if(CurrentlyActive == -1){
          CurrentlyActive = "None";
        } else{
          CurrentlyActive = UserMaster[UserID].Inventory.DivineItems.Items[CurrentlyActive].name;
        }

        message.channel.send("> Common boxes: " + BoxesCommon + "\n> Rare boxes: " + BoxesRare + "\n> Epic boxes: " + BoxesEpic + "\n> Legendary boxes: " + BoxesLegendary + "\n> Ultimate boxes: " + BoxesUltimate + "\n> Limited boxes: " + BoxesLimited + "\n\n> Currently active item: " + CurrentlyActive);

      }

    




    }
  }