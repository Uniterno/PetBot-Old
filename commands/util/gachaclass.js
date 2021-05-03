const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
//const mysql = require('mysql');
const fs = require('fs');
var querystring = require('querystring');
// vars that I need for some reason
var https = require('https');
var rng = require('random-world');
const RpcClient = require('node-json-rpc2').Client;


module.exports = class GachaClassCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'gc',
            group: 'util',
            guildOnly: true,
            memberName: 'gc',
            description: 'EVENT SPECIFIC',
            examples: [''],
            throttling: {
        usages: 1,
        duration: 10
    },
        });
    }

   run(message, args) {
    let UserID = message.author.id;

    if(fs.existsSync("./PetBot/settings/PetCoins/"+UserID+"/GivenGachaClass.txt") == false){
        fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/GivenGachaClass.txt","False");
    }

    if(fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/GivenGachaClass.txt") == "True"){
        message.channel.send("You can't pull more than once for a character. If you want to pay 100 MakiCookies to roll in the gacha pool again, tell Uniterno.");
        return;
    }
    PostCode(message);
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/GivenGachaClass.txt","True");
  }
}


  function PostCode(message){


    https.get('https://www.random.org/integers/?num=1&min=1&max=14&col=1&base=10&format=plain&rnd=new', (resp) => {
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



 switch(num){
        case 1:
        message.channel.send('You got: **Fairy**! https://lh6.ggpht.com/32scvdKsmkKsXqESdRaDfheOJ_RNLkBt-5hJ2iH_2PZEkGWDSkkvk8W99S19JxOfJQ');
            break;
        case 2:
        message.channel.send('You got: **Priest**! https://vignette.wikia.nocookie.net/elysiumrp/images/b/b6/Priest.jpg/revision/latest?cb=20161207031244');
            break;  
        case 3:
        message.channel.send('You got: **Legonary**! http://medias.photodeck.com/7801b710-3d63-11e0-a9c8-3934797ac33f/000934_xgaplus.jpg');
            break;
        case 4:
        message.channel.send('You got: **Dragon Demon**! https://i.pinimg.com/736x/b8/77/ca/b877ca3cbfb503b457fa58fd398e986c--character-reference-character-ideas.jpg');
            break;
        case 5:
        message.channel.send('You got: **Shadow**! https://i.kinja-img.com/gawker-media/image/upload/s--RCNY3P1y--/c_scale,fl_progressive,q_80,w_800/m8nrdujsdepymtqbujb7.jpg');
            break;
        case 6:
        message.channel.send('You got: **Shield-Maiden!** https://i.pinimg.com/originals/89/fd/23/89fd234588938c9a75d161f2ffc226da.jpg');
            break;
        case 7:
        message.channel.send('You got: **Arthur Pendragon (Nanatsu no Taizai Ver.)!** https://static.zerochan.net/Arthur.Pendragon.%28Nanatsu.no.Taizai%29.full.1811546.jpg');
            break;
        case 8:
        message.channel.send('You got: **Festa**! https://i.bandori.party/u/c/art/a/970Tomoe-Udagawa-Power-wgyIkT.png');
            break;
        case 9:
        message.channel.send('You got: **Barista**! https://i.bandori.party/u/c/art/a/969Tsugumi-Hazawa-Happy-hjN7U1.png');
            break;
        case 10:
        message.channel.send('You got: **Scarlet**! https://i.bandori.party/u/c/art/a/967Ran-Mitake-Cool-25EljH.png');
            break;
        case 11:
        message.channel.send('You got: **QT**! https://i.bandori.party/u/c/art/a/968Himari-Uehara-Cool-guXEHI.png');
            break;
        case 12:
        message.channel.send('You got: **Hun Gree**! https://i.bandori.party/u/c/art/a/971Moca-Aoba-Cool-Vz6Hyk.png');
            break;
        case 13:
        message.channel.send('You got: **Imposing Presence Yukina**! https://bestdori.com/assets/en/characters/resourceset/res021018_rip/card_after_training.png');
            break;
        case 14:
         message.channel.send('You got: **Samurai Eve**! https://bestdori.com/assets/jp/characters/resourceset/res020023_rip/card_after_training.png');
    }

  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});

return;

    /*

    var client = new RpcClient({
    protocol:'https',//Optional. Will be http by default
    host: 'api.random.org',
    path: '/json-rpc/2/invoke',
    port:443,
    method:'POST',
    headers: {
        'Content-Type': 'application/json'
    }
});

    client.call({
    jsonrpc: "2.0",
    method:'generateIntegers',//Mandatory
    params: {
       "apiKey": "652817e1-3e84-4742-8d45-3f4134a041fe",
        "n": 1,
        "min": 1,
        "max": 14,
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
    console.log(num); */

   



   /* if(num <= 25){
        //message.channel.send('You got: **Dragon Demon** https://i.pinimg.com/736x/b8/77/ca/b877ca3cbfb503b457fa58fd398e986c--character-reference-character-ideas.jpg');
    } else if(num <= 50){
        message.channel.send('You got: **Shadow!** https://i.kinja-img.com/gawker-media/image/upload/s--RCNY3P1y--/c_scale,fl_progressive,q_80,w_800/m8nrdujsdepymtqbujb7.jpg');
    } else if(num <= 75){
        message.channel.send('You got: **Shield-Maiden!** https://i.pinimg.com/originals/89/fd/23/89fd234588938c9a75d161f2ffc226da.jpg');
       // message.channel.send('You got: **Army Commando!** http://livedoor.blogimg.jp/nana_news/imgs/d/f/df0dcc64-s.jpg');
    } else{
        message.channel.send('You got: **Arthur Pendragon (Nanatsu no Taizai Ver.)!** https://static.zerochan.net/Arthur.Pendragon.%28Nanatsu.no.Taizai%29.full.1811546.jpg');
       // message.channel.send('You got: **Predator Beast!** https://i.pinimg.com/originals/c0/84/67/c08467f64afa7599f5a67003f00984e8.jpg');
    }

     if(num <= 14){
        message.channel.send('You got: **Festa**! https://i.bandori.party/u/c/art/a/970Tomoe-Udagawa-Power-wgyIkT.png');
    } else if(num <= 28){
        message.channel.send('You got: **Barista**! https://i.bandori.party/u/c/art/a/969Tsugumi-Hazawa-Happy-hjN7U1.png');
    } else if(num <= 42){
        message.channel.send('You got: **Scarlet**! https://i.bandori.party/u/c/art/a/967Ran-Mitake-Cool-25EljH.png');
       // message.channel.send('You got: **Army Commando!** http://livedoor.blogimg.jp/nana_news/imgs/d/f/df0dcc64-s.jpg');
    } else if(num <= 56){
        message.channel.send('You got: **QT**! https://i.bandori.party/u/c/art/a/968Himari-Uehara-Cool-guXEHI.png');
       // message.channel.send('You got: **Predator Beast!** https://i.pinimg.com/originals/c0/84/67/c08467f64afa7599f5a67003f00984e8.jpg');
    } else if(num <= 70){
        message.channel.send('You got: **Hun Gree**! https://i.bandori.party/u/c/art/a/971Moca-Aoba-Cool-Vz6Hyk.png');
    } else if(num <= 84){
        message.channel.send('You got: **Imposing Presence Yukina**! https://bestdori.com/assets/en/characters/resourceset/res021018_rip/card_after_training.png');
    } else{
         message.channel.send('You got: **Samurai Eve**! https://bestdori.com/assets/jp/characters/resourceset/res020023_rip/card_after_training.png');
    }
 */

}