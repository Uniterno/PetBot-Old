const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const Help = require('./OOP/help');
const fs = require('fs');

module.exports = class Prediction extends Command {
    constructor(client) {
        super(client, {
            name: 'prediction',
            group: 'util',
            guildOnly: true,
            memberName: 'prediction',
            description: 'Does predictions',
            aliases: ['pred'],
            throttling: {
        usages: 1,
        duration: 3
    },
        });
    }

   run(message, args) {

        args = message.content.split(' ').slice(1);

        let n = args[1];

        let Top1 = [10101045, 9999999, 10000000]; // 3
        let Top2 = [9696969, 7547878, 8550845]; // 3
        let Top3 = [9500000, 7501056, 8201900]; // 2
        let Top10 = [4720662, 4476610, 4403730]; // 2
        let Top100 = [3679795, 3087908, 2945168]; // 2
        let Top1000 = [0, 0, 626892, 687647]; // 4 [actually 2]


        let a = 0;

        let V = args[0];

        if (!!V == false || !!n == false) {
            message.channel.send("Not enough arguments.");
            return;
        }

        V = V.toLowerCase();

        //let f1 = (Top[1]-Top1[0])

        if(V == "top1"){
            a = 0.5*(n-1)*(n-2)+(n-1)*(Top1[1]-Top1[0])+Top1[0];
        } else if(V == "top2"){
            a = 2650574.5*(n-1)*(n-2)+(n-1)*(Top2[1]-Top2[0])+Top2[0];
        } else if(V == "top3"){
            a =  (n-1)*(Top3[1]-Top3[0])+Top3[0];
        } else if(V == "top10"){
            a =  (n-1)*(Top10[1]-Top10[0])+Top10[0];
        } else if(V == "top100"){
            a =  (n-1)*(Top100[1]-Top100[0])+Top100[0];
        } else if(V == "top1000"){
            if(n <= 2){
                message.channel.send("Top 1000 is only supported for Events 3+.");
                return;
            }
            a =  (n-3)*(Top1000[3]-Top1000[2])+Top1000[2] + Top1000[1] + Top1000[0];
        } else{
            message.channel.send("The ranking you chose is not valid.");
            return;
        }

        if(n <= 0){
            message.channel.send("The event you chose is not valid.");
            return;
        }

        message.channel.send("Warning: This feature is under development and the value displayed here is not accurate ~~yet~~.\n\n**"+a+"**");

        
    }
}