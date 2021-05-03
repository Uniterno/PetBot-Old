const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
//const mysql = require('mysql');
const fs = require('fs');
var querystring = require('querystring');
// vars that I need for some reason
var https = require('https');
var rng = require('random-world');
const RpcClient = require('node-json-rpc2').Client;


module.exports = class SkillCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'skill',
            group: 'util',
            guildOnly: true,
            memberName: 'skill',
            description: 'EVENT SPECIFIC',
            examples: [''],
            throttling: {
        usages: 1,
        duration: 6
    },
        });
    }

   run(message, args) {
    let UserID = message.author.id;

    if(fs.existsSync("./PetBot/settings/skills/hasSkill/"+UserID+"/GivenSkill.txt") == false){
        fs.writeFileSync("./PetBot/settings/skills/hasskill/"+UserID+"/GivenSkill.txt","False");
    }

    if(fs.readFileSync("./PetBot/settings/skills/hasSkill/"+UserID+"/GivenSkill.txt") == "True"){
        message.channel.send("You can't pick more than one skill.");
        return;
    }
    PostCode(message);
    fs.writeFileSync("./PetBot/settings/skills/hasSkill/"+UserID+"/GivenSkill.txt","True");
  }
}


  function PostCode(message){

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
        "min": 1,
        "max": 8,
        "replacement": true,
        "base": 10
    },
    "id": 18818
  },(err, res)=>{
    if(err){
        console.log(err);
        //Do something
    }
    console.log('Data:',res);//Json parsed.

    let num = res.result.random.data[0];
    console.log(num);

    /*

    if(num == 1){
        message.channel.send('You got: **You - "Come at me!"** https://aozoraemotion.kirara.ca/card/card_1445.png');
    } else if(num == 2){
        message.channel.send('You got: **You - "Come at me!"** https://aozoraemotion.kirara.ca/card/card_1445.png');
    } else if(num == 3){
         message.channel.send('You got: **Chikas Mom - "Mother Society"** https://aozoraemotion.kirara.ca/card/card_1083.png');
    } else if(num == 4){
         message.channel.send('You got: **Riko - "Hidden Little Demon"** https://aozoraemotion.kirara.ca/card/card_1188.png');
    } else if(num == 5){
         message.channel.send('You got: **Riko - "Hidden Little Demon"** https://aozoraemotion.kirara.ca/card/card_1188.png');
    } else if(num == 6){
         message.channel.send('You got: **Umi - "Got money to spare"** https://aozoraemotion.kirara.ca/card/card_1445.png');
    } else if(num == 7){
         message.channel.send('You got: **Umi - "Got money to spare"** https://aozoraemotion.kirara.ca/card/card_1445.png');
    } else if(num == 8){
         message.channel.send('You got: **Kotori - "Magic for us"** https://aozoraemotion.kirara.ca/card/card_634.png');
    } else if(num == 9){
         message.channel.send('You got: **Kotori - "Magic for us"** https://aozoraemotion.kirara.ca/card/card_634.png');
    } else if(num == 10){
         message.channel.send('You got: **Dia - "Im not accepting this!"** https://aozoraemotion.kirara.ca/card/card_1459.png');
    } else if(num == 11){
         message.channel.send('You got: **Dia - "Im not accepting this!"** https://aozoraemotion.kirara.ca/card/card_1459.png');
    } else if(num == 12){
         message.channel.send('You got: **Hagumi - "Happy New Friend!"** https://i.bandori.party/u/c/art/551Hagumi-Kitazawa-Happy-Everyone-ready-lets-go-crgZgC.png');
    } else if(num == 13){
         message.channel.send('You got: **Hagumi - "Happy New Friend!"** https://i.bandori.party/u/c/art/551Hagumi-Kitazawa-Happy-Everyone-ready-lets-go-crgZgC.png');
    } else if(num == 14){
         message.channel.send('You got: **Hanayo - "Please try my cooking"** https://aozoraemotion.kirara.ca/card/card_180.png');
    } else if(num == 15){
         message.channel.send('You got: **Hanayo - "Please try my cooking"** https://aozoraemotion.kirara.ca/card/card_180.png');
    } else if(num == 16){
         message.channel.send('You got: **Nico - "For that special someone"** https://aozoraemotion.kirara.ca/card/card_250.png');
    } else if(num == 17){
         message.channel.send('You got: **Nico - "For that special someone"** https://aozoraemotion.kirara.ca/card/card_250.png');
    } else if(num == 18){
         message.channel.send('You got: **Eli - "Hacking to the gate"** https://aozoraemotion.kirara.ca/card/card_581.png');
    } else if(num == 19){
         message.channel.send('You got: **Eli - "Hacking to the gate"** https://aozoraemotion.kirara.ca/card/card_581.png');
    } else if(num == 20){
         message.channel.send('You got: **Chika - "Painting it all"** https://aozoraemotion.kirara.ca/card/card_1424.png');
    } else if(num == 21){
         message.channel.send('You got: **Chika - "Painting it all"** https://aozoraemotion.kirara.ca/card/card_1424.png');
    } else if(num == 22){
         message.channel.send('You got: **Event Item - "Pudding"** https://t00.deviantart.net/S0Nb_NjOchM2QbN6ONQuQVH3cUA=/300x200/filters:fixed_height(100,100):origin()/pre00/607a/th/pre/f/2018/020/9/e/___kisekae_food___flan_prop____by_sakuraroselily-dc0nq06.png');
    } else if(num == 23){
         message.channel.send('You got: **Mari - "An wild anjel! Oh! Mistake!"** https://aozoraemotion.kirara.ca/card/card_1198.png');
    } else if(num == 24){
         message.channel.send('You got: **Mari - "An wild anjel! Oh! Mistake!"** https://aozoraemotion.kirara.ca/card/card_1198.png');
    } else if(num == 25){
         message.channel.send('You got: **Kasumi - "Want some? Here..."** https://i.bandori.party/u/c/art/504Kasumi-Toyama-Power-Everyone-s-at-the-Amusement-Park-PlWqf0.png');
    } else if(num == 26){
         message.channel.send('You got: **Kasumi - "Want some? Here..."** https://i.bandori.party/u/c/art/504Kasumi-Toyama-Power-Everyone-s-at-the-Amusement-Park-PlWqf0.png');
    } else if(num == 27){
         message.channel.send('You got: **Yohane - "The call for those whose souls were taken away"** https://aozoraemotion.kirara.ca/card/card_1465_t.png');
    } else if(num == 28){
         message.channel.send('You got: **Yohane - "The call for those whose souls were taken away"** https://aozoraemotion.kirara.ca/card/card_1465_t.png');
    } else if(num == 29){
         message.channel.send('You got: **Ruby - "With big sis help"** https://aozoraemotion.kirara.ca/card/card_1110.png');
    } else if(num == 30){
         message.channel.send('You got: **Ruby - "With big sis help"** https://aozoraemotion.kirara.ca/card/card_1110.png');
    } else if(num == 31){
         message.channel.send('You got: **Nozomi - "Teaching you da wey"** https://aozoraemotion.kirara.ca/card/card_890.png');
    } else if(num == 32){
         message.channel.send('You got: **Nozomi - "Teaching you da wey"** https://aozoraemotion.kirara.ca/card/card_890.png');
    } else if(num == 33){
         message.channel.send('You got: **Honoka - "Gacha"** https://aozoraemotion.kirara.ca/card/card_600.png');
    } else if(num == 34){
         message.channel.send('You got: **Honoka - "Gacha"** https://aozoraemotion.kirara.ca/card/card_600.png');
    } else if(num == 35){
         message.channel.send('You got: **Sayo - "Can you leave? I am busy"** https://i.bandori.party/u/c/art/587Sayo-Hikawa-Cool-Double-Trouble-2EqCb9.png');
    } else if(num == 36){
         message.channel.send('You got: **Sayo - "Can you leave? I am busy"** https://i.bandori.party/u/c/art/587Sayo-Hikawa-Cool-Double-Trouble-2EqCb9.png');
    } else if(num == 37){
         message.channel.send('You got: **Event Item - "Choco Cornet"** https://orig00.deviantart.net/8134/f/2018/020/6/b/___kisekae_food___chocolate_cornet_prop____by_sakuraroselily-dc0njbi.png');
    } else if(num == 38){
         message.channel.send('You got: **Kanan - "Shining Smile"** https://aozoraemotion.kirara.ca/card/card_1232.png');
    } else if(num == 39){
         message.channel.send('You got: **Kanan - "Shining Smile"** https://aozoraemotion.kirara.ca/card/card_1232.png');
     }
     */

    if(num == 1){
        message.channel.send('You got: **Eli - "Harasho Christmas!"** https://i.schoolido.lu/c/196idolizedEli.png');
    } else if(num == 2){
        message.channel.send('You got: **Nozomi - "Is Santa a spirit?"** https://i.schoolido.lu/c/203idolizedNozomi.png');
    } else if(num == 3){
         message.channel.send('You got: **Maki - "Time with the person I love"** https://i.schoolido.lu/c/484idolizedMaki.png');
    } else if(num == 4){
         message.channel.send('You got: **Hanayo - "What does it feel being a reindeer?"** https://i.schoolido.lu/c/761idolizedHanayo.png');
    } else if(num == 5){
         message.channel.send('You got: **You - "Santa You has arrived!"** https://i.schoolido.lu/c/1066idolizedYou.png');
    } else if(num == 6){
         message.channel.send('You got: **Hanamaru - "Merry Chrizura!"** https://i.schoolido.lu/c/1078idolizedHanamaru.png');
    } else if(num == 7){
         message.channel.send('You got: **Ruby - "Lets dance Jingle Bells"** https://i.schoolido.lu/c/1369idolizedRuby.png');
    } else if(num == 8){
         message.channel.send('You got: **Riko - "Being a bad girl on Christmas... Am I the Grinch"** https://i.schoolido.lu/c/1385idolizedRiko.png');
    }

});
}