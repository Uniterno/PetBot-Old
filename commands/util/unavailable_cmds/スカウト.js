const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const ScoutRR = require('./mod/srr.js');
const https = require('https');
const mergeImg = require('merge-img');
//const mysql = require('mysql');
const PetCoins = require('./mod/sql_petcoins.js');
const fs = require('fs');





/*var con = mysql.createConnection({
  host: "localhost",
  user: "Uniterno",
  password: "Uniterno",
  database: "PetDB"
});*/






// vars that I need for some reason

var FirstIsAlwaysSROrHigher = 0;
var ScoutingResult = [];







//var ScoutingResult = new Array();

const API_URL = "https://schoolido.lu/api/";

module.exports = class ScoutCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'スカウト',
            group: 'util',
            memberName: 'スカウト',
            description: 'Allows you to perform a 10+1 scout using 500 PetCoins.',
            examples: ['scout'],
            throttling: {
        usages: 1,
        duration: 10
    },
        });
    }

   async run(message, args) {

  if(message.channel.type != "text"){
      message.channel.send("このコマンドは``"+message.channel.type+"``のチャットタイプで使うことが出来ません。");
      return;
    }



    args = args.toLowerCase();
	args = args.split(' ');
	let Type = args[0];
	let Range = args[1];

  	console.log("-------");
 	console.log(message.content);
 	console.log("-------");
 	console.log("Type is: "+Type);
 	console.log("Range is: "+Range);

 	// Validate arguments

 	if(Type == null){
 		message.channel.send("無効なデーター.");
 		return;
 	}

 	if(!!Type == false){ // Returns false for null,undefined,0,000,"",false.
 		Type = "normal"; // Gives normal if Type is an empty string
 	}

 	if(typeof Range == 'undefined'){
 		Range = "normal";
 	}
 	console.log(Range)



 	


 	let UserID = message.author.id;


 	// Create all the files if needed

 	if(fs.existsSync("./Yohane/settings/PetCoins/"+UserID+"_PetCoins.txt") == false){
 		 fs.writeFileSync("./Yohane/settings/PetCoins/"+UserID+"_PetCoins.txt","3000");
 	}
 	if(fs.existsSync("././Yohane/settings/PetCoins/"+UserID+"_SRTicket.txt") == false){
 		 fs.writeFileSync("./Yohane/settings/PetCoins/"+UserID+"_SRTicket.txt","0");
 	}
 	if(fs.existsSync("././settings/PetCoins/"+UserID+"_SSRTicket.txt") == false){
 		 fs.writeFileSync("./Yohane/settings/PetCoins/"+UserID+"_SSRTicket.txt","0");
 	}
 	if(fs.existsSync("././Yohane/settings/PetCoins/"+UserID+"_URTicket.txt") == false){
 		 fs.writeFileSync("./Yohane/settings/PetCoins/"+UserID+"_URTicket.txt","1");
 	}
 	if(fs.existsSync("././Yohane/settings/PetCoins/"+UserID+"_Inventory.txt") == false){
 		 fs.writeFileSync("./Yohane/settings/PetCoins/"+UserID+"_Inventory.txt","default_null"); // Create inventory, separate IDs with , default_null shall be ignored
 	}

 	if(fs.readFileSync("./Yohane/settings/PetCoins/"+UserID+"_PetCoins.txt") == "NaN"){
 		console.log("Error has occured");
 	}

 	let ObjectToUpdate; // This is what we are working with, PetCoins, Tickets, etc.
 	let AmountToRemove; // This is the amount to remove of a certain Object.


 		if(Type == "10+1" || Type == "normal" || typeof Type == 'undefined'){
 			ObjectToUpdate = "PetCoins";
 			AmountToRemove = 50;
 		} else if(Type == "bt"){
 			ObjectToUpdate = "SRTicket";
 			AmountToRemove = 1;
 		} else if(Type == "ssr+"){
 			ObjectToUpdate = "SSRTicket";
 			AmountToRemove = 1;
 		} else if(Type == "ur"){
 			ObjectToUpdate = "URTicket";
 			AmountToRemove = 1;
 		}

 		if(typeof ObjectToUpdate == 'undefined'){
 			console.log(Type);
 		}

 		if(Type == "10+1" || Range == "10+1"){
 			AmountToRemove = AmountToRemove*10; // Cost 10 times more if it's a 10+1
 		}

 		if(typeof ObjectToUpdate == 'undefined'){
 			message.channel.send("無効なデーター");
 			return;
 		}

 		let CurrentAmount = fs.readFileSync("./Yohane/settings/PetCoins/"+UserID+"_"+ObjectToUpdate+".txt"); // Take current amount

 		if(CurrentAmount - AmountToRemove < 0){
 			message.channel.send(ObjectToUpdate+"数が足りない。.");
 			return;
 		}
 		CurrentAmount = CurrentAmount - AmountToRemove; // Remove the spent amount
 	

    	fs.writeFileSync("./Yohane/settings/PetCoins/"+UserID+"_"+ObjectToUpdate+".txt", CurrentAmount);  // Update with the spent amount
    	message.channel.send(ObjectToUpdate+"の"+AmountToRemove+"個が消費されました。");


 	if(Type === "10+1" || Range === "10+1"){
 		message.channel.send("はい！我がリットルデーモン！ちょっとお待ち下さい！");
 		console.log("LargeScouting has started");
 		LargeScouting(0,Type, message);
 		return;
 	}
    	

 	var RandomScoutRarity = Math.floor(getRandom(0, 101));
 	if(Type != "" && Type != "daily" && Type != "bt" && Type != "ssr+" && Type != "ur" && Type != "idolized" && Type != "normal" && Type != "birthday"){
 		console.log("無効なType");
 		message.channel.send("無効なデーター");
 		return;
 	}
 	if(Type === "" || Type === "normal" || Type === "birthday"){
 		var ScoutRarity = getRarityNormal(RandomScoutRarity);
 	}
 	else if(Type === "bt"){
 		var ScoutRarity = getRarityBT(RandomScoutRarity);
 	}
 	else if(Type === "ssr+"){
 		var ScoutRarity = getRaritySSRPlus(RandomScoutRarity);
 	}
 	else if(Type === "ur"){
 		var ScoutRarity = getRarityGrantedUR(RandomScoutRarity);
 	}
    if(ScoutRarity != "R" && ScoutRarity != "SR" && ScoutRarity != "SSR" && ScoutRarity != "UR"){
        console.log("無効なType");
    message.channel.send("無効なデーター");
    return;
	}
	let page = 1;
  	let request_url = API_URL + "cards/?rarity="+ScoutRarity+"&ordering=random&is_promo=False&is_special=False";
  	/*DailyFeaturedSet = false;
  	DailySpecial = false;
    if(Type === 'daily'){
  		request_url = request_url+DailyExtra;
  		if(ScoutRarity === "SR" || ScoutRarity === "UR"){
  		var DailyRandomizer = Math.floor(getRandom(0,101));
  		if(DailyRandomizer <  URFeaturedSetRate && ScoutRarity === "UR"){
  			DailyFeaturedSet = true;
  			request_url = request_url+DailySet;
  		}
  		else if(DailyRandomizer >=  URFeaturedSetRate && DailyRandomizer <= (URFeaturedSetRate*2) && ScoutRarity === "UR"){
  			DailyFeaturedSet = true;
  			request_url = request_url+DailySetAlt;
  		}
  		else if(DailyRandomizer < SRFeaturedSetRate && ScoutRarity === "SR"){
  			DailyFeaturedSet = true;
  			request_url = request_url+DailySet;
  		}
  		else if(DailyRandomizer >= SRFeaturedSetRate && DailyRandomizer <= (SRFeaturedSetRate*2) && ScoutRarity === "SR"){
  			DailyFeaturedSet = true;
  			request_url = request_url+DailySetAlt;
  		}
  	}
  		DailySpecial = true;
  }*/

  let EventChance = Math.floor(getRandom(0,100));

  console.log("First request URL is: "+request_url);
   https.get(request_url, (res) => {
  const { statusCode } = res;
  const contentType = res.headers['content-type'];

  res.setEncoding('utf8');
  let rawData = '';
  res.on('data', (chunk) => { rawData += chunk; });
  res.on('end', () => {
    try {
      const parsedData = JSON.parse(rawData);
      let num = Math.floor(getRandom(0, parsedData.count));
      let LargeScout = false;
      fixPageSize(num,LargeScout,Type,0,message, EventChance); // previous 'getScoutingWithCorrectPageSize', to avoid null request due to data being stored in pages
    } catch (e) {
      console.error(e.message);
    }
  });
}).on('error', (e) => {
	message.channel.send("An error has occurred! But don't worry, it has already been reported to Uniterno.");
  console.error(`Got error: ${e.message}`);
});
}
}

function getRarityNormal(RandomScoutRarity){
	console.log("RandomScoutRarity is "+RandomScoutRarity);
	if(RandomScoutRarity <= 80){ // 80
    ScoutRarity = "R";
  }
  else if(RandomScoutRarity >= 81 && RandomScoutRarity <= 95){ // 81 - 95
    ScoutRarity = "SR";
  }
  else if(RandomScoutRarity >= 96 && RandomScoutRarity <= 99){ // 96 - 99
    ScoutRarity = "SSR";
  }
  else if(RandomScoutRarity >= 100){
    ScoutRarity = "UR";
  }

 	return ScoutRarity;

}

function getRarityBT(RandomScoutRarity){
  if(RandomScoutRarity <= 80){
    ScoutRarity = "SR";
  }
  else if(RandomScoutRarity >= 81){
    ScoutRarity = "UR";
  }

 	return ScoutRarity;

}

function getRaritySSRPlus(RandomScoutRarity){
	if(RandomScoutRarity <= 80){
    ScoutRarity = "SSR";
  }
  else if(RandomScoutRarity >= 81){
    ScoutRarity = "UR";
  }

 	return ScoutRarity;
}

function getRarityGrantedUR(RandomScoutRarity){
	ScoutRarity = "UR";
 	return ScoutRarity;
}

function fixPageSize(num,LargeScout,NumberOfScouting,Type, message, EventChance){
  // This is the final part of the scout
  if(!LargeScout){
  	NumberOfScouting = 999;
  }

  let page = Math.floor(num / 10);
  if(page <= 0){
  	console.log("Page was less or equal to 0. It has been default to 1 to avoid issues.");
  	page = 1;
  }
  
  var request_url = API_URL + "cards/?rarity="+ ScoutRarity + "&ordering=random"+"&page="+page+"&is_promo=False&is_special=False";
 

  if(ScoutRarity == "SR"){
   if(EventChance <= 20){ // It's SR and 20% event chance
    request_url = request_url + "&is_event=True";
  console.log("It was an event card!");
   } else{ // It's SR but not 20% event chance
    request_url = request_url + "&is_event=False";
   }
  } else{ // It's not SR
    request_url = request_url + "&is_event=False";
  }



    https.get(request_url, (res) => {
      console.log("Requested URL is: "+request_url);
  const { statusCode } = res;
  const contentType = res.headers['content-type'];
  
  res.setEncoding('utf8');
  let rawData = '';
  res.on('data', (chunk) => { rawData += chunk; });
  res.on('end', () => {
    try {
      const parsedData = JSON.parse(rawData);
      console.log("num value was: "+num);
      console.log("Length is: "+parsedData.results.length);
      console.log("Showing link: "+parsedData.results[Math.floor(num%10)].card_image);
      	if(parsedData.results[Math.floor(num%10)].card_image){
      		if(LargeScout){
            ScoutingResult[NumberOfScouting] = "https:"+parsedData.results[Math.floor(num%10)].round_card_image;
      			//message.channel.send("https:"+parsedData.results[Math.floor(num%10)].round_card_image);
      		}
      		else{
             message.channel.send(new Discord.Attachment("https:"+parsedData.results[Math.floor(num%10)].card_image));
      		//message.channel.send("https:"+parsedData.results[Math.floor(num%10)].card_image);
      		}
      	}
      	else{
      	console.log("Card was a promo. Forcing idolization.")
      		if(LargeScout){
           ScoutingResult[NumberOfScouting] = "https:"+parsedData.results[Math.floor(num%10)].round_card_idolized_image;
      		//message.channel.send("https:"+parsedData.results[Math.floor(num%10)].round_card_idolized_image);
      		}
      		else{
             message.channel.send(new Discord.Attachment("https:"+parsedData.results[Math.floor(num%10)].card_idolized_image));
      	}
  }
  
  	/*else if(IsIdolized === true){
  		if(LargeScout){
        ScoutingResult[NumberOfScouting] = "https:"+parsedData.results[Math.floor(num%10)].round_card_idolized_image;
  			//message.channel.send("https:"+parsedData.results[Math.floor(num%10)].round_card_idolized_image);
  }
  		else{
  	 	 message.channel.send(new Discord.Attachment("https:"+parsedData.results[Math.floor(num%10)].card_idolized_image));
  	 }
  }*/
          console.log("ID of given card was: "+parsedData.results[Math.floor(num%10)].id);
          console.log(NumberOfScouting);
          if(NumberOfScouting < 11){
          	NumberOfScouting++;
          	LargeScouting(NumberOfScouting,Type, message)
          }
          if(LargeScout && NumberOfScouting > 10){
              mergeImg([ScoutingResult[0],ScoutingResult[1],ScoutingResult[2],ScoutingResult[3],ScoutingResult[4],ScoutingResult[5],ScoutingResult[6],ScoutingResult[7],ScoutingResult[8],ScoutingResult[9],ScoutingResult[10]])
              .then((img) => {
                 console.log(img); // => `[object Jimp]` 
                  img.write('scout.png', () => message.channel.send(new Discord.Attachment('scout.png')));
                   
                   //setTimeout(sendImage, 2000);
                  });

                /* function Promises(img) {
                return saveTheImage(img)
                  }*/

                 /* function saveTheImage(img){
                     img.write('scout.png', () => console.log('Saved image as png'));
                     setTimeout(sendImage, 2000);
                     return new Promise(function (resolve, reject) {
                     resolve('Resolve pls')
                  })}*/
                 

              /*function uploadTheImage(){imgurUploader(fs.readFileSync('C:/Users/Uniterno/scout.png'), {title: 'Scout'}).then(data => {
               console.log(data);
               //message.channel.send(new Attachment('scout.png', 'ScoutResult.png'));
               message.channel.send(data.link);
               });}*/

              /*function sendImage(){
                message.channel.send(new Discord.Attachment('scout.png'));
              }*/
            }

    } catch (e) {
      console.error(e.message);
    }
  });
}).on('error', (e) => {
	message.channel.send("An error has occurred! But don't worry, it has already been reported to Uniterno.");
  console.error(`Got error: ${e.message}`);
});
}

function LargeScouting(NumberOfScouting,Type, message){
	console.log("LargeScouting running with NumberOfScouting: "+NumberOfScouting);
	console.log(NumberOfScouting);
	if(NumberOfScouting == 11){
		FirstIsAlwaysSROrHigher = 0;
		return;
	}
	console.log(FirstIsAlwaysSROrHigher);
 	
  
  if(Type === "10+1"){
    Type = "normal";
  }
 	
 	if(Type != "" && Type != "daily" && Type != "bt" && Type != "ssr+" && Type != "ur" && Type != "idolized" && Type != "normal"){
 		console.log("Invalid type of Type.");
 		message.reply("無効なデーター");
 		return;
 	}
 	
 	let RandomScoutRarity = Math.floor(getRandom(0, 101));
 	if(FirstIsAlwaysSROrHigher === 0){
 			if(RandomScoutRarity <= 80){
 				RandomScoutRarity = Math.floor(getRandom(81,101));
 			}
 			FirstIsAlwaysSROrHigher = 1;
 		}

 		console.log("I am here");
 	if(Type === "" || Type === "daily" || Type === "idolized" || Type === "normal" || Type === ""){
 		var ScoutRarity = getRarityNormal(RandomScoutRarity);
 	}
 	else if(Type === "bt"){
 		var ScoutRarity = getRarityBT(RandomScoutRarity);
 	}
 	else if(Type === "ssr+"){
 		var ScoutRarity = getRaritySSRPlus(RandomScoutRarity);
 	}
 	else if(Type === "ur"){
 		var ScoutRarity = getRarityGrantedUR(RandomScoutRarity);
 	}
	else{
		message.channel.send("Invalid arguments. (Note: ExtraType (``ERROR 379``))");
		return;
	}
	var page = 1;
  	var API_URL = "https://schoolido.lu/api/";
  	var request_url = API_URL + "cards/?rarity="+ScoutRarity+"&ordering=random&is_promo=False&is_special=False";
  	/*DailyFeaturedSet = false;
  	DailySpecial = false;
    if(Type === 'daily'){
  		request_url = request_url+DailyExtra;
  		if(ScoutRarity === "SR" || ScoutRarity === "UR"){
  		var DailyRandomizer = Math.floor(getRandom(0,101));
  		if(DailyRandomizer < 25 && ScoutRarity === "UR"){
  			DailyFeaturedSet = true;
  			request_url = request_url+DailySet;
  		}
  		else if(DailyRandomizer >= 25 && DailyRandomizer <= 50 && ScoutRarity === "UR"){
  			DailyFeaturedSet = true;
  			request_url = request_url+DailySetAlt;
  		}
  		else if(DailyRandomizer < 7 && ScoutRarity === "SR"){
  			DailyFeaturedSet = true;
  			request_url = request_url+DailySet;
  		}
  		else if(DailyRandomizer >= 8 && DailyRandomizer <= 14 && ScoutRarity === "SR"){
  			DailyFeaturedSet = true;
  			request_url = request_url+DailySetAlt;
  		}
  	}
  		DailySpecial = true;
  }
  */
  let EventChance = Math.floor(getRandom(0,100));


  if(ScoutRarity == "SR"){
   if(EventChance <= 20){ // It's SR and 20% event chance
    request_url = request_url + "&is_event=True";
  console.log("It was an event card!");
   } else{ // It's SR but not 20% event chance
    request_url = request_url + "&is_event=False";
   }
  } else{ // It's not SR
    request_url = request_url + "&is_event=False";
  }

  console.log("First request URL is: "+request_url);
   https.get(request_url, (res) => {
  const { statusCode } = res;
  const contentType = res.headers['content-type'];

  res.setEncoding('utf8');
  let rawData = '';
  res.on('data', (chunk) => { rawData += chunk; });
  res.on('end', () => {
    try {
      const parsedData = JSON.parse(rawData);
      let num = Math.floor(getRandom(0, parsedData.count));
      let LargeScout = true;
     fixPageSize(num,LargeScout,NumberOfScouting,Type, message, EventChance);
    } catch (e) {
      console.error(e.message);
    }
  });
}).on('error', (e) => {
	message.channel.send("An error has occurred! But don't worry, it has already been reported to Uniterno.");
  console.error(`Got error: ${e.message}`);
});
}


function getRandom(min, max) {
    return Math.random() * (max - min) + min;
  }