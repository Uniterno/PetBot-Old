/*const { Command } = require('discord.js-commando');
const ScoutRR = require('./mod/srr.js');
const https = require('https');
const mergeImg = require('merge-img');

var ScoutingResult = new Array();

const API_URL = "https://schoolido.lu/api/";

module.exports = class ScoutCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'scout',
            group: 'util',
            memberName: 'scout',
            description: 'Allows you to perform a 10+1 scout using 100 PetCoins.',
            examples: ['!scout'],
            throttling: {
        usages: 1,
        duration: 10
    },
        });
    }

   run(msg, args) {
	


































































































































































































































      /* args = args.split(' ');
      let Type = args[0];
      let Range = args[1];

      console.log("Type: "+Type);
      console.log("Range: "+Range);

      if(Type != "10+1" && Type != "BT" && Type != "SSR+" && Type != "UR" && Type != "R"){
        msg.channel.send("Invalid arguments for Type. Please only use: R, 10+1, BT, SSR+ or UR");
        return;
      }
      
      if (typeof Range == undefined && Type != "10+1"){
        msg.channel.send("Invalid arguments: An argument was undefined. Make sure to use both arguments.");
        return;
      }

      let RandomScoutRarity = Math.floor(getRandom(0, 101));
      console.log(RandomScoutRarity);
      let ScoutRarity = ScoutRR.ScoutRarityResults(Type, RandomScoutRarity);
      console.log("ScoutRarity: "+ScoutRarity);


    let request_url = API_URL + "cards/?rarity="+ScoutRarity+"&ordering=random"

    if(Type != "10+1" && Range != "10+1"){
      https.get(request_url, (res) => {
      const { statusCode } = res;
      const contentType = res.headers['content-type'];

      res.setEncoding('utf8');
      let rawData = '';
      res.on('data', (chunk) => { rawData += chunk; });
      res.on('end', () => {
        try{
      const parsedData = JSON.parse(rawData);
      //console.log(parsedData);
      console.log(parsedData.count);
    let num = Math.floor(getRandom(0, parsedData.count));
      //msg.channel.send(new Discord.Attachment("https:"+parsedData.results[Math.floor(num%10)].card_image));
      return msg.channel.sendFile("https:"+parsedData.results[Math.floor(num%10)].card_image);


 //       return msg.channel.send("Currently on maintenance. Don't worry, we aren't KLab, there's no ETA.");
        } catch (e) {
      console.error(e.message);
    }
  });
}).on('error', (e) => {
  message.channel.send("An error has occurred! But don't worry, it has already been reported to Uniterno.");
  console.error(`Got error: ${e.message}`);
});

  }else if(Type == "10+1" || Range == "10+1"){

    let NumberOfScouting = 0;
    let ScoutingResult = new Array();

    while(NumberOfScouting < 11){


    https.get(request_url, (res) => {
      const { statusCode } = res;
      const contentType = res.headers['content-type'];

      res.setEncoding('utf8');
      let rawData = '';
      res.on('data', (chunk) => { rawData += chunk; });
      res.on('end', () => {
      const parsedData = JSON.parse(rawData);
      //console.log(parsedData);
      //console.log(parsedData.count);
    let num = Math.floor(getRandom(0, parsedData.count));
       
      ScoutingResult[NumberOfScouting] = "https:"+parsedData.results[Math.floor(num%10)].round_card_image;
      let Result = ScoutingResult[NumberOfScouting];
      console.log(ScoutingResult[NumberOfScouting]);
      sendResult(ScoutingResult, NumberOfScouting, Result, msg);
        
            });
      });
      //console.log(request_url);
      //console.log(ScoutingResult[NumberOfScouting]);
      NumberOfScouting++;
  
      }

      
}
}
}


function getRandom(min, max) {
    return Math.random() * (max - min) + min;
  }

  function sendResult(ScoutingResult, NumberOfScouting, Result, msg){

      Result;
      //console.log(ScoutingResult[NumberOfScouting]);
      if(NumberOfScouting >= 11){
         mergeImg([Result])
              .then((img) => {
                 console.log(img); // => `[object Jimp]` 
                  return msg.channel.sendFile(img);
                });
      }
    } */
































































































































































































































    	/* args = args.split(' ');
    	let Type = args[0];
    	let Range = args[1];

    	console.log("Type: "+Type);
    	console.log("Range: "+Range);

    	if(Type != "10+1" && Type != "BT" && Type != "SSR+" && Type != "UR" && Type != "R"){
    		msg.channel.send("Invalid arguments for Type. Please only use: R, 10+1, BT, SSR+ or UR");
    		return;
    	}
    	
    	if (typeof Range == undefined && Type != "10+1"){
    		msg.channel.send("Invalid arguments: An argument was undefined. Make sure to use both arguments.");
    		return;
    	}

    	let RandomScoutRarity = Math.floor(getRandom(0, 101));
    	console.log(RandomScoutRarity);
    	let ScoutRarity = ScoutRR.ScoutRarityResults(Type, RandomScoutRarity);
    	console.log("ScoutRarity: "+ScoutRarity);


 	 	let request_url = API_URL + "cards/?rarity="+ScoutRarity+"&ordering=random"

 	 	if(Type != "10+1" && Range != "10+1"){
  		https.get(request_url, (res) => {
  		const { statusCode } = res;
  		const contentType = res.headers['content-type'];

  		res.setEncoding('utf8');
  		let rawData = '';
  		res.on('data', (chunk) => { rawData += chunk; });
  		res.on('end', () => {
  			try{
      const parsedData = JSON.parse(rawData);
      //console.log(parsedData);
      console.log(parsedData.count);
	  let num = Math.floor(getRandom(0, parsedData.count));
      //msg.channel.send(new Discord.Attachment("https:"+parsedData.results[Math.floor(num%10)].card_image));
      return msg.channel.sendFile("https:"+parsedData.results[Math.floor(num%10)].card_image);


 //       return msg.channel.send("Currently on maintenance. Don't worry, we aren't KLab, there's no ETA.");
        } catch (e) {
      console.error(e.message);
    }
  });
}).on('error', (e) => {
	message.channel.send("An error has occurred! But don't worry, it has already been reported to Uniterno.");
  console.error(`Got error: ${e.message}`);
});

	}else if(Type == "10+1" || Range == "10+1"){

		let NumberOfScouting = 0;
		let ScoutingResult = new Array();

		while(NumberOfScouting < 11){


		https.get(request_url, (res) => {
  		const { statusCode } = res;
  		const contentType = res.headers['content-type'];

  		res.setEncoding('utf8');
  		let rawData = '';
  		res.on('data', (chunk) => { rawData += chunk; });
  		res.on('end', () => {
      const parsedData = JSON.parse(rawData);
      //console.log(parsedData);
      //console.log(parsedData.count);
	  let num = Math.floor(getRandom(0, parsedData.count));
       
      ScoutingResult[NumberOfScouting] = "https:"+parsedData.results[Math.floor(num%10)].round_card_image;
      let Result = ScoutingResult[NumberOfScouting];
      console.log(ScoutingResult[NumberOfScouting]);
  		sendResult(ScoutingResult, NumberOfScouting, Result, msg);
      	
      			});
			});
			//console.log(request_url);
			//console.log(ScoutingResult[NumberOfScouting]);
			NumberOfScouting++;
	
			}

			
}
}
}


function getRandom(min, max) {
    return Math.random() * (max - min) + min;
  }

  function sendResult(ScoutingResult, NumberOfScouting, Result, msg){

  		Result;
  	 	//console.log(ScoutingResult[NumberOfScouting]);
  	 	if(NumberOfScouting >= 11){
  	 		 mergeImg([Result])
              .then((img) => {
              	 console.log(img); // => `[object Jimp]` 
              	  return msg.channel.sendFile(img);
              	});
  	 	}
  	} */