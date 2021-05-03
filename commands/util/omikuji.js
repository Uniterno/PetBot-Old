const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
//const mysql = require('mysql');
const fs = require('fs');
var querystring = require('querystring');
// vars that I need for some reason
var https = require('https');
var rng = require('random-world');
const RpcClient = require('node-json-rpc2').Client;


module.exports = class OmikujiCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'omikuji',
            group: 'util',
            guildOnly: true,
            memberName: 'omikuji',
            description: 'Omikuji New Year',
            examples: [''],
            throttling: {
        usages: 1,
        duration: 6
    },
        });
    }

   run(message, args) {

    message.channel.send("This command can only be used during New Years.");
    return;

    let UserID = message.author.id;

    if(fs.existsSync("./PetBot/settings/skills/hasSkill/"+UserID+"/Omikuji.txt") == false){
        fs.writeFileSync("./PetBot/settings/skills/hasskill/"+UserID+"/Omikuji.txt","False");
    }

    if(fs.readFileSync("./PetBot/settings/skills/hasSkill/"+UserID+"/Omikuji.txt") == "True"){
        message.channel.send("You have already received your Omikuji for the Year 2020. See you next year!");
        return;
    }
    PostCode(message);
    fs.writeFileSync("./PetBot/settings/skills/hasSkill/"+UserID+"/Omikuji.txt","True");
  }
}


  function PostCode(message){

    https.get('https://www.random.org/integers/?num=14&min=1&max=12&col=1&base=10&format=plain&rnd=new', (resp) => {
        let data = '';

  // A chunk of data has been recieved.
  resp.on('data', (chunk) => {
    data += chunk;
  });

  // The whole response has been received. Print out the result.
  resp.on('end', () => {
    data = data.split('\n');
    console.log(data);
    //let num = parseInt(data);
    //console.log(JSON.parse(data).explanation);


    let i = 0;
    let ToSend = "";

    let ResultLuck = [];

    while(i < 15){

        //console.log("data[" + (i-1) + "]: " + data[i-1]);
        console.log("data[" + i + "]: " + data[i]);


        if(data[i] == 1){
            ResultLuck[i] = "大吉 (Great Fortune)";
        } else if(data[i] == 2){
            ResultLuck[i] = "中吉 (Middle Fortune)";
        } else if(data[i] == 3){
            ResultLuck[i] = "小吉 (Small Fortune)";
        } else if(data[i] == 4){
            ResultLuck[i] = "吉 (Fortune)";
        } else if(data[i] == 5){
            ResultLuck[i] = "半吉 (Half Fortune)";
        } else if(data[i] == 6){
            ResultLuck[i] = "末吉 (Near Fortune)";
        } else if(data[i] == 7){
            ResultLuck[i] = "末小吉 (Near Small Fortune)";
        } else if(data[i] == 8){
            ResultLuck[i] = "凶 (Curse)";
        } else if(data[i] == 9){
            ResultLuck[i] = "小凶 (Small Curse)";
        } else if(data[i] == 10){
            ResultLuck[i] = "半凶 (Half Curse)";
        } else if(data[i] == 11){
            ResultLuck[i] = "末凶 (Near Curse)";
        } else if(data[i] == 12){
            ResultLuck[i] = "大凶 (Great Curse)";
        }

     i++;

    }

    ToSend = "**運勢 (Overall Luck): " + ResultLuck[0] + "**";
    ToSend = ToSend + "\n\n";
    ToSend = ToSend + "願望 (Desire): " + ResultLuck[1];
    ToSend = ToSend + "\n";
    ToSend = ToSend + "待人 (Person you're waiting for): " + ResultLuck[2];
    ToSend = ToSend + "\n";
    ToSend = ToSend + "失物  (Lost articles): " + ResultLuck[3];
    ToSend = ToSend + "\n";
    ToSend = ToSend + "旅行 (Travel): " + ResultLuck[4];
    ToSend = ToSend + "\n";
    ToSend = ToSend + "商売 (Business): " + ResultLuck[5];
    ToSend = ToSend + "\n";
    ToSend = ToSend + "学問 (Studies): " + ResultLuck[6];
    ToSend = ToSend + "\n";
    ToSend = ToSend + "相場 (Market Speculation): " + ResultLuck[7];
    ToSend = ToSend + "\n";
    ToSend = ToSend + "争事 (Disputes): " + ResultLuck[8];
    ToSend = ToSend + "\n";
    ToSend = ToSend + "恋愛 (Love): " + ResultLuck[9];
    ToSend = ToSend + "\n";
    ToSend = ToSend + "転屋 (Moving residences): " + ResultLuck[10];
    ToSend = ToSend + "\n";
    ToSend = ToSend + "出産 (Childbirth): " + ResultLuck[11];
    ToSend = ToSend + "\n";
    ToSend = ToSend + "病気 (Illness): " + ResultLuck[12];
    ToSend = ToSend + "\n";
    ToSend = ToSend + "縁談 (Marriage): " + ResultLuck[13];


    message.channel.send(ToSend);

    });

});
}
