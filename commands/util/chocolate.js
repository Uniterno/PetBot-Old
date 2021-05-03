const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const fs = require('fs');
const rng = require('random-world');


module.exports = class ChocolateValentines extends Command {
    constructor(client) {
        super(client, {
            name: 'chocolate',
            group: 'util',
            guildOnly: true,
            memberName: 'chocolate',
            description: 'Chocolate Give/Exchange from Valentines 2020 Event.',
            aliases: ['choco', 'valentines'],
          });
    }

run(message, args) {

    args = message.content.split(' ').slice(1);

	let UserID = message.author.id;
  	let DateV = new Date();

  	var MasterUser = JSON.parse(fs.readFileSync("./PetBot/settings/user/master.json"));
  	let EquippedDivineItemID = MasterUser[UserID].Inventory.DivineItems.Active;
  	let EquippedDivineItem = "None";
  	if(EquippedDivineItemID != -1){
    	EquippedDivineItem = MasterUser[UserID].Inventory.DivineItems.Items[EquippedDivineItemID].Name;
  	}

  	if(!!args[0] == false){
  		console.log("Error Code: 0x00");
		message.channel.send("Invalid arguments");
  		return;
  	} else{
  		if(args[0].toLowerCase() != "check" && args[0].toLowerCase() != "inv"){
  			console.log("Warning Code: 0x01 | Provided debug details: " + args[0].toLowerCase())
			if(!!args[1] == false){
				console.log("Error Code: 0x02");
		  		message.channel.send("Invalid arguments");
		  		return;
  			}
  		} else{
  			console.log("Warning Code: 0x03")
  			if(!!args[1] == false){
  				console.log("Warning Code: 0x05")
  				args[1] = "null";
  			}
  		}
  	}

  	if(args[0].toLowerCase() == "exchange" && !!args[2] == false){
  		console.log("Error Code: 0x06");
  		message.channel.send("Invalid arguments");
  		return;
  	}

  	let Option = args[0].toLowerCase();
  	let Chocolate = args[1].toLowerCase();
  	console.log(Option);
  	if(Option == "give"){
  		let Received = "Nothing";
  		if(Chocolate == "dark"){
  			if(MasterUser[UserID].SpecialEvent.Valentines.Chocolates.Dark <= 0){
  				message.channel.send("Not enough Dark chocolates!");
  				return;
  			}
  			MasterUser[UserID].SpecialEvent.Valentines.Chocolates.Dark += -1;
  			Received = chocoType(40, 40, 10, 9, 1);
  		} else if(Chocolate == "white"){
  			if(MasterUser[UserID].SpecialEvent.Valentines.Chocolates.White <= 0){
  				message.channel.send("Not enough White chocolates!");
  				return;
  			}
  			MasterUser[UserID].SpecialEvent.Valentines.Chocolates.White += -1;
  			Received = chocoType(15, 70, 7, 7, 1);
  		} else if(Chocolate == "dietetic"){
  			if(MasterUser[UserID].SpecialEvent.Valentines.Chocolates.Dietetic <= 0){
  				message.channel.send("Not enough Dietetic chocolates!");
  				return;
  			}
  			MasterUser[UserID].SpecialEvent.Valentines.Chocolates.Dietetic += -1;
  			Received = chocoType(20, 20, 50, 9, 1);
  		} else if(Chocolate == "macha"){
  			if(MasterUser[UserID].SpecialEvent.Valentines.Chocolates.Macha <= 0){
  				message.channel.send("Not enough Macha chocolates!");
  				return;
  			}
  			MasterUser[UserID].SpecialEvent.Valentines.Chocolates.Macha += -1;
  			Received = chocoType(25, 0, 50, 23, 2);
  		} else if(Chocolate == "homemade"){
  			if(MasterUser[UserID].SpecialEvent.Valentines.Chocolates.Homemade <= 0){
  				message.channel.send("Not enough Homemade chocolates!");
  				return;
  			}
  			MasterUser[UserID].SpecialEvent.Valentines.Chocolates.Homemade += -1;
  			Received = chocoType(90, 0, 10, 0, 0);
  		} else if(Chocolate == "secret"){
  			if(MasterUser[UserID].SpecialEvent.Valentines.Chocolates.Secret <= 0){
  				message.channel.send("Not enough Secret chocolates!");
  				return;
  			}
  			MasterUser[UserID].SpecialEvent.Valentines.Chocolates.Secret += -1;
  			Received = chocoType(24, 24, 24, 24, 4);
  		} else{
  			message.channel.send("Not valid chocolate");
  			return;
  		}

  		message.channel.send("You received " + Received + "!");
  		MasterUser[UserID].SpecialEvent.Valentines.Stats[Received] += 1;
  	} else if(Option == "exchange"){
  		if(Chocolate == "dark"){
  			if(MasterUser[UserID].SpecialEvent.Valentines.Chocolates.Dark <= 3){
  				message.channel.send("Not enough Dark chocolates!");
  				return;
  			}
  			MasterUser[UserID].SpecialEvent.Valentines.Chocolates.Dark += -3;
  		} else if(Chocolate == "white"){
  			if(MasterUser[UserID].SpecialEvent.Valentines.Chocolates.White <= 3){
  				message.channel.send("Not enough White chocolates!");
  				return;
  			}
  			MasterUser[UserID].SpecialEvent.Valentines.Chocolates.White += -3;
  		} else if(Chocolate == "dietetic"){
  			if(MasterUser[UserID].SpecialEvent.Valentines.Chocolates.Dietetic <= 3){
  				message.channel.send("Not enough Dietetic chocolates!");
  				return;
  			}
  			MasterUser[UserID].SpecialEvent.Valentines.Chocolates.Dietetic += -3;
  		} else if(Chocolate == "macha"){
  			if(MasterUser[UserID].SpecialEvent.Valentines.Chocolates.Macha <= 3){
  				message.channel.send("Not enough Macha chocolates!");
  				return;
  			}
  			MasterUser[UserID].SpecialEvent.Valentines.Chocolates.Macha += -3;
  		} else if(Chocolate == "homemade"){
  			if(MasterUser[UserID].SpecialEvent.Valentines.Chocolates.Homemade <= 3){
  				message.channel.send("Not enough Homemade chocolates!");
  				return;
  			}
  			MasterUser[UserID].SpecialEvent.Valentines.Chocolates.Homemade += -3;
  		} else if(Chocolate == "secret"){
  			if(MasterUser[UserID].SpecialEvent.Valentines.Chocolates.Secret <= 3){
  				message.channel.send("Not enough Secret chocolates!");
  				return;
  			}
  			MasterUser[UserID].SpecialEvent.Valentines.Chocolates.Secret += -3;
  		}

  		let ToExchangeFor = args[3].toLowerCase();
  		if(ToExchangeFor == "dark"){
  			MasterUser[UserID].SpecialEvent.Valentines.Chocolates.Dark += 1;
  		} else if(ToExchangeFor == "white"){
  			MasterUser[UserID].SpecialEvent.Valentines.Chocolates.White += 1;
  		} else if(ToExchangeFor == "dietetic"){
  			MasterUser[UserID].SpecialEvent.Valentines.Chocolates.Dietetic += 1;
  		} else if(ToExchangeFor == "macha"){
  			MasterUser[UserID].SpecialEvent.Valentines.Chocolates.Macha += 1;
  		} else if(ToExchangeFor == "homemade"){
  			MasterUser[UserID].SpecialEvent.Valentines.Chocolates.Homemade += 1;
  		} else if(ToExchangeFor == "secret"){
  			MasterUser[UserID].SpecialEvent.Valentines.Chocolates.Secret += 1;
  		}
  	} else if(Option == "check" || Option == "inv"){
  		let msg = "Dark Chocolates: " + MasterUser[UserID].SpecialEvent.Valentines.Chocolates.Dark + "\n";
  			msg += "White Chocolates: " + MasterUser[UserID].SpecialEvent.Valentines.Chocolates.White + "\n";
  			msg += "Dietetic Chocolates: " + MasterUser[UserID].SpecialEvent.Valentines.Chocolates.Dietetic + "\n";
  			msg += "Macha Chocolates: " + MasterUser[UserID].SpecialEvent.Valentines.Chocolates.Macha + "\n";
  			msg += "Homemade Chocolates: " + MasterUser[UserID].SpecialEvent.Valentines.Chocolates.Homemade + "\n";
  			msg += "Secret Chocolates: " + MasterUser[UserID].SpecialEvent.Valentines.Chocolates.White + "\n";
  			msg += "\n";
  			msg += "Love Letter: " + MasterUser[UserID].SpecialEvent.Valentines.Stats.LoveLetter + "\n";
  			msg += "Return Chocolate: " + MasterUser[UserID].SpecialEvent.Valentines.Stats.ReturnChocolate + "\n";
  			msg += "Scarf: " + MasterUser[UserID].SpecialEvent.Valentines.Stats.Scarf + "\n";
  			msg += "Money: " + MasterUser[UserID].SpecialEvent.Valentines.Stats.Money + "\n";
  			msg += "Jewel: " + MasterUser[UserID].SpecialEvent.Valentines.Stats.Jewel;

  			message.channel.send(msg);
  	} else{
  		message.channel.send("Not valid arguments");
  		return;
  	}


    let FixedJSON = JSON.stringify(MasterUser, null, "\t");
    fs.writeFileSync("./PetBot/settings/user/master.json",FixedJSON);
 }
}


function getRandom(min, max) {
    return rng.integer({min, max});
  }

function chocoType(loveLetter, returnChocolate, scarf, money, jewel){
	returnChocolate += loveLetter;
	scarf += returnChocolate;
	money += scarf;
	jewel += money;

	let selectedChance = getRandom(0, 100);

	if(selectedChance <= loveLetter){
		return "LoveLetter";
	} else if(selectedChance <= returnChocolate){
		return "ReturnChocolate";
	} else if(selectedChance <= scarf){
		return "Scarf";
	} else if(selectedChance <= money){
		return "Money";
	} else{
		return "Jewel";
	}
}