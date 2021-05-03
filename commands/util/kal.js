const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const fs = require('fs');
const sortNumbers = require('sort-numbers');



module.exports = class Kal extends Command {
    constructor(client) {
        super(client, {
            name: 'kal',
            group: 'util',
            guildOnly: true,
            memberName: 'kal',
            description: 'Kal.',
            throttling: {
        usages: 1,
        duration: 1
    },
        });
    }

   run(message, args) {

	// Allows to loop find the factors of a Target number using only Possible numbers.
	/* For example:

	!kal 27593 17/29/143/573/1066

	Means you're looking for "27593" using only 17, 29, 143, 573 and 1066
	The result is:

	(25 times) 1066
	(1 time) 573
	(2 times) 143
	(2 times) 29
	(1 time) 17

	Remainder: 9
	---
	(48 times) 573
	(3 times) 29

	Remainder: 2
	---
	(192 times) 143
	(4 times) 29
	(1 time) 17

	Remainder: 4
	---
	(951 times) 29

	Remainder: 14
	---
	(1623 times) 17

	Remainder: 2

	Meaning you need to sum 1066 25 times, then 573 once, then 143 twice, then 29 twice and then 17 once to get the closest number to Target.
	Starting with 1066. However, by omitting 1066, you get to a closer result (remainder 2): 573*48 + 29*3 + 2
	Starting with 143: 192*143 + 29*4 + 17*1 + 4
	Starting with 29: 29*951 + 14
	Starting with 17: 17*1623 + 2

	*/

	args = message.content.split(' ').slice(1);

   	var Target = args[0];

   	var Possible = args[1];
   
   	if(isNaN(Target)){
   		message.channel.send("Error: Target is not a number.");
   		return;
   	}

   	var Pos = Possible.split('/');
   	var a = Pos.length-1;
   	while(a >= 0){
   		Pos[a] = parseInt(Pos[a]);
   		if(isNaN(Pos[a])){
   			Pos[a] = 0;
   		}
   		a--;
   	}
   	console.log(Pos);
   	Pos = sortNumbers.desc(Pos);

   	var Result = "";
   	let Loops = 0;

   	while(Target != 0 && Loops < Pos.length){

		var i = 0+Loops;
		while(i < Pos.length){
			console.log("---");
			console.log("Target: "+Target);
			console.log("Pos["+i+"]: "+Pos[i]);
			console.log("Possible.length:" +Possible.length);
			var Attempt = parseInt(Target / Pos[i]);
			if(Attempt > 0){
				if(Attempt != 1){
					Result = "\n"+ Result + "("+Attempt+" times) "+Pos[i]+"\n";
				} else{
					Result = "\n"+ Result + "("+Attempt+" time) "+Pos[i]+"\n";
				}
			}
			if(Target != 0){
			Target = Target - (Pos[i] * Attempt);
			}

			i++;
		}

		console.log("Target: "+Target);
		console.log(Pos.length - Loops);
		if((Pos.length - Loops) == 1){
				if(Target != 0){
				Result = Result + "\nRemainder: "+Target+"\n";
			} else{
				Result = Result + "\n";
			}
		} else{
			if(Target != 0){
				Result = Result + "\nRemainder: "+Target+"\n---\n";
			} else{
				Result = Result + "---\n";
			}
		}

			

		Target = args[0];
		Possible = args[1];

		Loops++; 
		if(Loops == 50){
			console.log("Final Target: "+Target);
			message.channel.send("Warning: Maximum loop, operation aborted!\n"+Result);
			return;
		}	
	}

		message.channel.send(Result);

	}
}
