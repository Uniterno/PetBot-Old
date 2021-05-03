const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
//const mysql = require('mysql');
const fs = require('fs');
const RpcClient = require('node-json-rpc2').Client;
// vars that I need for some reason


module.exports = class KuzuCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'kuzu',
            group: 'util',
            guildOnly: true,
            memberName: 'kuzu',
            description: 'Honoka Skill.',
            throttling: {
        usages: 1,
        duration: 10
    },
        });
    }

   run(message, args) {
    console.log("active");

    if(message.author.id != 103385273387208704 && message.author.id != 168389193603612673){
      message.channel.send("Unable to use this command.");
      return;
    }

    console.log("active2");



    if(fs.existsSync("./PetBot/settings/skills/HonkSkill.txt") == false){
      fs.writeFileSync("./PetBot/settings/skills/HonkSkill.txt","1");
      }   

   

      let HonkSkill = fs.readFileSync("./PetBot/settings/skills/HonkSkill.txt");

      if(HonkSkill != 1){
        return;
      }
    
    args = args.split(' ');

    let x = args[0];
    let y = args[1];

    if(!!x == false || !!y == false){
        message.channel.send("Invalid arguments.");
        return;
    }

    if(y > x){
        message.channel.send("X needs to be greater than Y");
        return;
    }

    if(x > 7000){
        message.channel.send("X can't be greater than 7000");
        return;
    }

    let z = parseInt(x)+parseInt(y);
    z = z/2;
    z = Math.round(z);

    message.channel.send("You paid "+z+" PetCoins for this bet.");

    let UserID = message.author.id;

     let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt");
     CurrentAmount = parseInt(CurrentAmount) - z;
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt", CurrentAmount);

    console.log("x: "+x);
    console.log("y: "+y);
    let a = RandomCall(x, y, UserID, message);

    }
  }


  function RandomCall(x, y, UserID, message){

    var client = new RpcClient({
    protocol:'https',//Optional. Will be http by default
    host: 'api.random.org',
    path: '/json-rpc/2/invoke',
    port:443,
    method:'POST'
});

    client.call({
    jsonrpc: "2.0",
    method:'generateIntegers',//Mandatory
    params: {
       "apiKey": "652817e1-3e84-4742-8d45-3f4134a041fe",
        "n": 1,
        "min": Math.round((y*0.5)),
        "max": Math.round((x*2)),
        "replacement": true,
    },
    "id": 27625
  },(err, res)=>{
    if(err){
        console.log(err);
        //Do something
    }
    console.log(res);
    console.log(res.result);
    console.log(res.result.random);
    console.log(res.result.random.data[0]);
    let num = res.result.random.data[0];
    
    num = parseInt(num);
    console.log(num);

    let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt");
     CurrentAmount = parseInt(CurrentAmount) + num;
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt", CurrentAmount);

    message.channel.send("Your bet result was: "+num);

    fs.writeFileSync("./PetBot/settings/skills/HonkSkill.txt","0");



      });

}

