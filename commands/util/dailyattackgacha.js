const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
//const mysql = require('mysql');
const fs = require('fs');
var querystring = require('querystring');
// vars that I need for some reason
var https = require('https');
var rng = require('random-world');
const RpcClient = require('node-json-rpc2').Client;


module.exports = class DailyAttackGachaCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'dailyattackgacha',
            group: 'util',
            guildOnly: true,
            memberName: 'dailyattackgacha',
            description: 'Daily Attack Gacha Command',
            aliases: ['dag', 'dailyattackg', 'dattackg', 'dagacha'],
            throttling: {
        usages: 1,
        duration: 2
    },
        });
    }

   run(message, args) {
    let UserID = message.author.id;
    var MasterUser = JSON.parse(fs.readFileSync("./PetBot/settings/user/master.json"));
    var Settings = JSON.parse(fs.readFileSync("./PetBot/settings/master.json"));
    var CharList = JSON.parse(fs.readFileSync("./PetBot/settings/dailyattack/characters.json"));
   
    if(fs.existsSync("./PetBot/settings/PetCoins/"+UserID+"/Diamonds.txt") == false){
        fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/Diamonds.txt", 0);
    }

    let Diamonds = parseInt(fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/Diamonds.txt"));

    if(Diamonds < 50){
        message.channel.send("Not enough Diamonds to pull!");
        return;
    }

    DoAddInventory(message, CharList, MasterUser, Settings, Diamonds, UserID);
  }
}


  function DoAddInventory(message, CharList, MasterUser, Settings, Diamonds, UserID){
    console.log("CharList: " + CharList);
    let max = (Object.keys(CharList.results)).length - 1;

    https.get('https://www.random.org/integers/?num=1&min=0&max=' + max + '&col=1&base=10&format=plain&rnd=new', (resp) => {
        let data = '';

  // A chunk of data has been recieved.
  resp.on('data', (chunk) => {
    data += chunk;
  });

  // The whole response has been received. Print out the result.
  resp.on('end', () => {
    console.log(data);
    let num = parseInt(data);
    //console.log(JSON.parse(data).explanation);
    console.log(CharList.results);
    console.log((CharList.results)[num]);
    console.log(Object.keys(CharList.results));
    console.log(Object.keys(CharList.results)[num]);
    console.log(CharList.results[Object.keys(CharList.results)[num]]);

    message.channel.send("*" + CharList.results[Object.keys(CharList.results)[num]].SummonMessage + "*\n\nYou got: " + Object.keys(CharList.results)[num]);

    console.log(Object.keys(CharList.results)[num]);
    let ObtainedName = Object.keys(CharList.results)[num];

    console.log("ObtainedName: " + ObtainedName);

    if(!!MasterUser[UserID].DailyAttack.Inventory[ObtainedName] == true){ // exists
        MasterUser[UserID].DailyAttack.Inventory[ObtainedName].Level++;
        message.channel.send("You already had this character so it has leveled up!");
    } else {
        console.log("Added to inventory!");
        MasterUser[UserID].DailyAttack.Inventory[ObtainedName] = CharList.results[ObtainedName];
    }

    Diamonds += -50;
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/Diamonds.txt", Diamonds);



    let FixedJSON = JSON.stringify(MasterUser, null, "\t");
    fs.writeFileSync("./PetBot/settings/user/master.json",FixedJSON);
    let FixedJSON2 = JSON.stringify(Settings, null, "\t");
    fs.writeFileSync("./PetBot/settings/master.json",FixedJSON2);

  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});

return;
}