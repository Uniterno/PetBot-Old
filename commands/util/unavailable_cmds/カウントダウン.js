const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const Help = require('./OOP/help');
const JPArg = require('./OOP/JPArg');


module.exports = class CountDownJP extends Command {
    constructor(client) {
        super(client, {
            name: 'カウントダウン',
            group: 'util',
            memberName: 'カウントダウン',
            description: 'Countdowns from 5 to 0, unless specified otherwise.',
            examples: [''],
            throttling: {
        usages: 1,
        duration: 10
    },
        });
    }

   run(message, args) {
        args = args.split(' ');

        args = JPArg.JPArg(args);

        if(args[0] == "情報"){
            message.channel.send(Help.help('CountdownJP'));
            return;
        }

        let CD = 5;
        if(!!args[0] == false){ // Returns false for null,undefined,0,000,"",false.
            CD = 5;
        } else {
            if(isNaN(args[0])){
                message.channel.send("無効な値");
                return;
            }
            if(args[0] > 60 || args[0] <= 0){
                message.channel.send("カウントダウンオフセット秒数の最大限数が60秒、最小限数が1秒。");
                return;
            }
            CD = args[0];
        }

        let ShowEvery = args[1];
        if(!!ShowEvery == false){
            ShowEvery = 5;
        }
        if(isNaN(ShowEvery)){  
            message.channel.send("2番目の値は無効。");
            return;
        }

        console.log("ShowEvery: "+ShowEvery);
        console.log("!!args[1]: "+!!args[1]);
        console.log("CD: "+CD);
        if((ShowEvery >= CD) && (!!args[1] == true)){
            message.channel.send("2番目の値がカウントダウンオフセットの方が小さい数が必要。");
            return;
        }
        if(ShowEvery <= 1){
            message.channel.send("API限定で2番目の値が2より小さくて禁止。");
            return;
        }
        if(CD/10 > ShowEvery){
            if(ShowEvery != 5){
                 message.channel.send("2番目の値はカウントダウンオフセットの10％より大きな数か既定の5が必要。");
                 return;
            }
        }

        CD = Math.floor(CD);
        ShowEvery = Math.floor(ShowEvery);

        message.channel.send(CD+"の初数にとして, "+ShowEvery+"秒ごとに始まった。");
        let Interval = setInterval(function(){
            if(CD <= 0){
            message.channel.send("**イケ！！**");
            clearInterval(Interval);
            } else{
                if(CD <= 3){
                    message.channel.send(CD); 
                } else if(CD % ShowEvery == 0){
                    message.channel.send(CD); 
                }  
            }
            CD = CD - 1;
        },
        1000);
  }
    
    }