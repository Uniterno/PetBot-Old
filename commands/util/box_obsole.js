const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const ScoutRR = require('./mod/srr.js');
const https = require('https');
const mergeImg = require('merge-img');
//const mysql = require('mysql');
//const PetCoins = require('./mod/sql_petcoins.js');
const fs = require('fs');
var SoldPetCoins = 0;
var rng = require('random-world');



      var SpecialGirl = fs.readFileSync("./PetBot/settings/box/SpecialGirl.txt");
      var SpecialAttribute = fs.readFileSync("./PetBot/settings/box/SpecialAttribute.txt");
      var SpecialYear = fs.readFileSync("./PetBot/settings/box/SpecialYear.txt");
      var SpecialUnit = fs.readFileSync("./PetBot/settings/box/SpecialUnit.txt");
      var SpecialSubUnit = fs.readFileSync("./PetBot/settings/box/SpecialSubUnit.txt");

      var BoolSpecialGirl = fs.readFileSync("./PetBot/settings/box/bool/SpecialGirl.txt");
      var BoolSpecialAttribute = fs.readFileSync("./PetBot/settings/box/bool/SpecialAttribute.txt");
      var BoolSpecialYear = fs.readFileSync("./PetBot/settings/box/bool/SpecialYear.txt");
      var BoolSpecialUnit = fs.readFileSync("./PetBot/settings/box/bool/SpecialUnit.txt");
      var BoolSpecialSubUnit = fs.readFileSync("./PetBot/settings/box/bool/SpecialSubUnit.txt"); 




// vars that I need for some reason

var FirstIsAlwaysSROrHigher = 0;
var ScoutingResult = [];




// Box scout vars



//var ScoutingResult = new Array();

const API_URL = "https://schoolido.lu/api/";

module.exports = class ScoutCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'box_uni',
            group: 'util',
            guildOnly: true,
            memberName: 'box_uni',
            description: 'Allows you to scout on a special box.',
            examples: ['scout'],
            throttling: {
        usages: 5,
        duration: 10
    },
        });
    }

   async run(message, args) {

     if(message.author.id != 168389193603612673){
      return;
     }

   
   var RRate = getRandom(0,100);
var SRRate = getRandom(0,100);
var SSRRate = getRandom(0,100);
var URRate = getRandom(0,100);

while(RRate+SRRate+SSRRate+URRate > 100){
  RRate--;
  SRRate--;
  SSRRate--;
  URRate--;
}

while(RRate+SRRate+SSRRate+URRate < 100){
  RRate++;
}

while(RRate < 0){
    RRate++;
    SRRate--;
  }
while(SRRate < 0){
  SRRate++;
  SSRRate--;
}
while(SSRRate < 0){
  SSRRate++
  URRate--;
}

var RValue = getRandom(-20,30);
var SRValue = getRandom(-65,100);
var SSRValue = getRandom(-400,1200);
var URValue = getRandom(-5000,17000);


var RemoveValue = getRandom(-1000,2500);

var BBValue = getRandom(0,100);
var BvValueGive = getRandom(-15,25);


      SpecialGirl = fs.readFileSync("./PetBot/settings/box/SpecialGirl.txt");
      SpecialAttribute = fs.readFileSync("./PetBot/settings/box/SpecialAttribute.txt");
      SpecialYear = fs.readFileSync("./PetBot/settings/box/SpecialYear.txt");
      SpecialUnit = fs.readFileSync("./PetBot/settings/box/SpecialUnit.txt");
      SpecialSubUnit = fs.readFileSync("./PetBot/settings/box/SpecialSubUnit.txt");

      BoolSpecialGirl = fs.readFileSync("./PetBot/settings/box/bool/SpecialGirl.txt");
      BoolSpecialAttribute = fs.readFileSync("./PetBot/settings/box/bool/SpecialAttribute.txt");
      BoolSpecialYear = fs.readFileSync("./PetBot/settings/box/bool/SpecialYear.txt");
      BoolSpecialUnit = fs.readFileSync("./PetBot/settings/box/bool/SpecialUnit.txt");
      BoolSpecialSubUnit = fs.readFileSync("./PetBot/settings/box/bool/SpecialSubUnit.txt"); 



    /*message.channel.send("There's no box available at this moment.");
    return;*/

    var ScoutRunning = fs.readFileSync("./PetBot/settings/scout/Running.txt");
    if(ScoutRunning == 'true'){
      message.channel.send("Another scout is going on right now. Can't run two at the same time.");
      return;
    }
    SoldPetCoins = 0;
 
    if(message.channel.type != "text"){
      message.channel.send("Command unavailable on the ``"+message.channel.type+"`` type of channel.");
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
 		message.channel.send("Invalid arguments.");
    fs.writeFileSync("./PetBot/settings/scout/Running.txt", 'false');
    console.log("Type is null, line 89");
 		return;
 	}

 	if(!!Type == false){ // Returns false for null,undefined,0,000,"",false.
 		Type = "normal"; // Gives normal if Type is an empty string
 	}

 	if(typeof Range == 'undefined'){
 		Range = "normal";
 	}
 	console.log(Range);




 	


 	let UserID = message.author.id;


 	// Create all the files if needed

 	if(fs.existsSync("./PetBot/settings/PetCoins/"+UserID+"_PetCoins.txt") == false){
 		 fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"_PetCoins.txt","3000");
 	}
 	if(fs.existsSync("./PetBot/settings/PetCoins/"+UserID+"_SRTicket.txt") == false){
 		 fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"_SRTicket.txt","0");
 	}
 if(fs.existsSync("./PetBot/settings/PetCoins/"+UserID+"_SSRTicket.txt") == false){
 		 fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"_SSRTicket.txt","0");
 	}
 	if(fs.existsSync("./PetBot/settings/PetCoins/"+UserID+"_URTicket.txt") == false){
 		 fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"_URTicket.txt","1");
 	}
 	if(fs.existsSync("./PetBot/settings/PetCoins/"+UserID+"_Inventory.txt") == false){
 		 fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"_Inventory.txt","default_null"); // Create inventory, separate IDs with , default_null shall be ignored
 	}

 	if(fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"_PetCoins.txt") == "NaN"){
 		console.log("Error has occured");
    message.channel.send("**Warning**: Error 133");
 	}

 	let ObjectToUpdate; // This is what we are working with, PetCoins, Tickets, etc.
 	let AmountToRemove; // This is the amount to remove of a certain Object.


 		if(Type == "10+1" || Type == "normal" || typeof Type == 'undefined'){
      ObjectToUpdate = "PetCoins";
      AmountToRemove = RemoveValue;
    } else if(Type == "bt"){
      console.log("Not supported yet");
      ObjectToUpdate = "BlueTicket";
      AmountToRemove = 5;
    } else if(Type == "sr"){
      ObjectToUpdate = "SRTicket";
      AmountToRemove = 1;
    } else if(Type == "ssr"){
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
 			message.channel.send("Invalid arguments");
       fs.writeFileSync("./PetBot/settings/scout/Running.txt", 'false');
 			return;
 		}


    let ObjectToUpdateString = GetObjectToUpdateString(ObjectToUpdate, AmountToRemove);



    console.log("Started Running");
    fs.writeFileSync("./PetBot/settings/scout/Running.txt", 'true');

 		let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"_"+ObjectToUpdate+".txt"); // Take current amount

 		if(CurrentAmount - AmountToRemove < 0){
 			message.channel.send("You don't have enough "+ObjectToUpdateString+" to perform this action.");
       fs.writeFileSync("./PetBot/settings/scout/Running.txt", 'false');
 			return;
 		}
 		CurrentAmount = CurrentAmount - AmountToRemove; // Remove the spent amount
 	

    	fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"_"+ObjectToUpdate+".txt", CurrentAmount);  // Update with the spent amount
    	if(AmountToRemove == 1){
        message.channel.send(AmountToRemove+" "+ObjectToUpdateString+" has been removed from your inventory to perform this action");
      }  else{
        message.channel.send(AmountToRemove+" "+ObjectToUpdateString+" have been removed from your inventory to perform this action");
      } // Update with the spent amount, for singular and plural

      message.channel.send("R Rate: "+RRate+"%\nSR Rate: "+SRRate+"%\nSSR Rate: "+SSRRate+"%\nUR Rate: "+URRate+"%");


 	if(Type === "10+1" || Range === "10+1"){
 		//message.channel.send("Ok, Little Demon! Please wait a bit, I'm processing all the information...");
 		console.log("LargeScouting has started");
 		LargeScouting(0,Type, message, RValue, SRValue, SSRValue, URValue, RemoveValue, BBValue, BvValueGive, RRate, SRRate, SSRRate, URRate);
 		return;
 	}
    	

 	var RandomScoutRarity = Math.floor(getRandom(0, 101));
 	if(Type != "" && Type != "daily" && Type != "bt" && Type != "ssr" && Type != "ur" && Type != "idolized" && Type != "normal" && Type != "birthday" && Type != "sr"){
 		console.log("Invalid type of Type.");
 		message.channel.send("Invalid arguments.");
     fs.writeFileSync("./PetBot/settings/scout/Running.txt", 'false');
 		return;
 	}
 	if(Type === "" || Type === "normal" || Type === "birthday"){
 		var ScoutRarity = getRarityNormal(RandomScoutRarity, RRate, SRRate, SSRRate, URRate);
 	}
 	else if(Type === "bt"){
 		var ScoutRarity = getRarityBT(RandomScoutRarity);
 	}
 	else if(Type === "ssr"){
 		var ScoutRarity = getRaritySSRPlus(RandomScoutRarity);
 	}
 	else if(Type === "ur"){
 		var ScoutRarity = getRarityGrantedUR(RandomScoutRarity);
 	}
  else if(Type === "sr"){
    var ScoutRarity = getRaritySRPlus(RandomScoutRarity);
  }
    if(ScoutRarity != "R" && ScoutRarity != "SR" && ScoutRarity != "SSR" && ScoutRarity != "UR"){
        console.log("Invalid arguments for Type");
    message.channel.send("Invalid arguments.");
     fs.writeFileSync("./PetBot/settings/scout/Running.txt", 'false');
    return;
	}
	let page = 1;
  	var request_url = API_URL + "cards/?rarity="+ ScoutRarity + "&ordering=random"+"&page="+page+"&is_special=False&is_promo=False";
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


  let DisableEvent = false;

   if(BoolSpecialAttribute == 'true'){
     request_url = request_url + "&attribute="+SpecialAttribute; // Special Attribute only*/
   }
 
if(BoolSpecialGirl == 'true'){
  if(SpecialChance <= 50){
     //let SpecialGirl = "Kousaka Honoka";
  request_url = request_url + "&name="+encodeURIComponent(SpecialGirl); // Special Girl only*/
  }
}
  

  if(BoolSpecialSubUnit == 'true'){
    request_url = request_url + "&idol_sub_unit="+encodeURIComponent(SpecialSubUnit);
  }


  if(BoolSpecialYear == 'true'){
    request_url = request_url + "&idol_year="+encodeURIComponent(SpecialYear);
  }
  
  if(BoolSpecialUnit == 'true'){
    request_url = request_url + "&idol_main_unit="+encodeURIComponent(SpecialUnit);
  }
  

  let SpecialChance = Math.floor(getRandom(0, 100));
  let EventChance = Math.floor(getRandom(0,100));

/*if(ScoutRarity == "UR"){
    if(SpecialChance <= 50){
      request_url = request_url + "&ids=1489";
      DisableEvent = true; 
    }
  } else if(ScoutRarity == "SSR"){
    if(SpecialChance <= 50){
      request_url = request_url + "&ids=1506";
      DisableEvent = true;
    }
  }  else if(ScoutRarity == "SR"){
    if(SpecialChance <= 50){
      request_url = request_url + "&ids=1505";
      DisableEvent = true;
    }
  } */

  // BOX STUFF


  if(!DisableEvent){ // If it wasn't disabled by the box scouting
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
      let LargeScout = false;
      fixPageSize(num,LargeScout,Type,0,message, SpecialChance, EventChance, RValue, SRValue, SSRValue, URValue, RemoveValue, BBValue, BvValueGive, RRate, SRRate, SSRRate, URRate); // previous 'getScoutingWithCorrectPageSize', to avoid null request due to data being stored in pages
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

function getRarityNormal(RandomScoutRarity,RRate,SRRate,SSRRate, URRate){
	console.log("RandomScoutRarity is "+RandomScoutRarity);
	console.log(RRate);
  console.log(RRate+SRRate);
  console.log(RRate+SRRate+SSRRate);
  if(RandomScoutRarity <= RRate){
    ScoutRarity = "R";
  } else if(RandomScoutRarity <= RRate+SRRate){
    ScoutRarity = "SR";
  } else if(RandomScoutRarity <= RRate+SRRate+SSRRate){
    ScoutRarity = "SSR";
  } else{
    ScoutRarity = "UR";
  }

 	return ScoutRarity;

}

function getRarityBT(RandomScoutRarity){
  if(RandomScoutRarity >= 21){
    ScoutRarity = "SR";
  }
  else if(RandomScoutRarity <= 20){
    ScoutRarity = "UR";
  }

 	return ScoutRarity;

}

function getRaritySSRPlus(RandomScoutRarity){
	if(RandomScoutRarity >= 21){
    ScoutRarity = "SSR";
  }
  else if(RandomScoutRarity <= 20){
    ScoutRarity = "UR";
  }

 	return ScoutRarity;
}

function getRarityGrantedUR(RandomScoutRarity){
	ScoutRarity = "UR";
 	return ScoutRarity;
}

function getRaritySRPlus(RandomScoutRarity){
  if(RandomScoutRarity >= 31){
    ScoutRarity = "SR";
  }
  else if(RandomScoutRarity >= 11 && RandomScoutRarity <= 30){
    ScoutRarity = "SSR";
  }
  else if(RandomScoutRarity <= 10){
    ScoutRarity = "UR";
  }

  return ScoutRarity;
}

function fixPageSize(num,LargeScout,NumberOfScouting,Type, message, SpecialChance, EventChance, RValue, SRValue, SSRValue, URValue, RemoveValue, BBValue, BvValueGive, RRate, SRRate, SSRRate, URRate){
  console.log("SpecialChance: "+SpecialChance);
  console.log("EventChance: "+EventChance);
  // This is the final part of the scout
  if(!LargeScout){
  	NumberOfScouting = 999;
  }

  let page = Math.floor(num / 10);
  if(page <= 0){
  	console.log("Page was less or equal to 0. It has been default to 1 to avoid issues.");
  	page = 1;
  }
  
  var request_url = API_URL + "cards/?rarity="+ ScoutRarity + "&ordering=random"+"&page="+page+"&is_special=False&is_promo=False";
 

  // BOX STUFF

  let DisableEvent = false;


 if(BoolSpecialAttribute == 'true'){
     request_url = request_url + "&attribute="+SpecialAttribute; // Special Attribute only*/
   }

if(BoolSpecialGirl == 'true'){
  if(SpecialChance <= 50){
  request_url = request_url + "&name="+encodeURIComponent(SpecialGirl); // Special Girl only*/
  }
}

 if(BoolSpecialSubUnit == 'true'){
    request_url = request_url + "&idol_sub_unit="+encodeURIComponent(SpecialSubUnit);
  }

if(BoolSpecialYear == 'true'){
    request_url = request_url + "&idol_year="+encodeURIComponent(SpecialYear);
  }

 if(BoolSpecialUnit == 'true'){
    request_url = request_url + "&idol_main_unit="+encodeURIComponent(SpecialUnit);
  }

/*if(ScoutRarity == "UR"){
    if(SpecialChance <= 50){
      request_url = request_url + "&ids=1489";
      DisableEvent = true; 
    }
  } else if(ScoutRarity == "SSR"){
    if(SpecialChance <= 50){
      request_url = request_url + "&ids=1506";
      DisableEvent = true;
    }
  }  else if(ScoutRarity == "SR"){
    if(SpecialChance <= 50){
      request_url = request_url + "&ids=1505";
      DisableEvent = true;
    }
  } */

  // BOX STUFF


  if(!DisableEvent){ // If it wasn't disabled by the box scouting
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
      if(num == parsedData.results.length){num = num-1;}



       if(ScoutRarity == "SR"){
            SoldPetCoins = SoldPetCoins+SRValue;
            console.log("20 Sold. Total: "+SoldPetCoins);
          } else if(ScoutRarity == "SSR"){
            SoldPetCoins = SoldPetCoins+SSRValue;
            console.log("200 Sold. Total: "+SoldPetCoins);
          } else if(ScoutRarity == "UR"){
            SoldPetCoins = SoldPetCoins+URValue;
            console.log("2000 Sold. Total: "+SoldPetCoins);
          } else if(ScoutRarity == "R"){
            SoldPetCoins = SoldPetCoins+RValue;
            console.log("2000 Sold. Total: "+SoldPetCoins);
          }

      
      console.log("Showing link: "+parsedData.results[Math.floor(num%10)].card_image);
      	if(parsedData.results[Math.floor(num%10)].card_image){
      		if(LargeScout){
            ScoutingResult[NumberOfScouting] = "https:"+parsedData.results[Math.floor(num%10)].round_card_image;
      			//message.channel.send("https:"+parsedData.results[Math.floor(num%10)].round_card_image);
      		}
      		else{
             message.channel.send(new Discord.Attachment("https:"+parsedData.results[Math.floor(num%10)].card_image));
             fs.writeFileSync("./PetBot/settings/scout/Running.txt", 'false');
              setTimeout(PetCoinsSoldMessage, 4000, SoldPetCoins, message, LargeScout, RValue, SRValue, SSRValue, URValue, RemoveValue, BBValue, BvValueGive, RRate, SRRate, SSRRate, URRate);
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
             fs.writeFileSync("./PetBot/settings/scout/Running.txt", 'false');
              setTimeout(PetCoinsSoldMessage, 4000, SoldPetCoins, message, LargeScout, RValue, SRValue, SSRValue, URValue, RemoveValue, BBValue, BvValueGive, RRate, SRRate, SSRRate, URRate);
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
          	LargeScouting(NumberOfScouting,Type, message, RValue, SRValue, SSRValue, URValue, RemoveValue, BBValue, BvValueGive, RRate, SRRate, SSRRate, URRate)
          }
          if(LargeScout && NumberOfScouting > 10){
              mergeImg([ScoutingResult[0],ScoutingResult[1],ScoutingResult[2],ScoutingResult[3],ScoutingResult[4],ScoutingResult[5],ScoutingResult[6],ScoutingResult[7],ScoutingResult[8],ScoutingResult[9],ScoutingResult[10]])
              .then((img) => {
                 console.log(img); // => `[object Jimp]` 
                  img.write('box_scout.png', () => message.channel.send(new Discord.Attachment('box_scout.png')));
                  //message.channel.send("You got "+SoldPetCoins+" PetCoins as a result of your scout.");
                   setTimeout(PetCoinsSoldMessage, 8000, SoldPetCoins, message);
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

function LargeScouting(NumberOfScouting,Type, message, RValue, SRValue, SSRValue, URValue, RemoveValue, BBValue, BvValueGive, RRate, SRRate, SSRRate, URRate){
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
 	
 	if(Type != "" && Type != "daily" && Type != "bt" && Type != "ssr" && Type != "ur" && Type != "idolized" && Type != "normal" && Type != "sr"){
 		console.log("Invalid type of Type.");
 		message.channel.send("Invalid arguments");
    fs.writeFileSync("./PetBot/settings/scout/Running.txt", 'false');
 		return;
 	}
 	
 	let RandomScoutRarity = Math.floor(getRandom(0, 101));
  if(FirstIsAlwaysSROrHigher === 0){
      if(RandomScoutRarity >= 21){
        RandomScoutRarity = Math.floor(getRandom(1,20));
      }
      FirstIsAlwaysSROrHigher = 1;
    }

 		console.log("I am here");
 	if(Type === "" || Type === "daily" || Type === "idolized" || Type === "normal" || Type === ""){
 		var ScoutRarity = getRarityNormal(RandomScoutRarity, RRate, SRRate, SSRRate, URRate);
 	}
 	else if(Type === "bt"){
 		var ScoutRarity = getRarityBT(RandomScoutRarity);
 	}
 	else if(Type === "ssr"){
 		var ScoutRarity = getRaritySSRPlus(RandomScoutRarity);
 	}
 	else if(Type === "ur"){
 		var ScoutRarity = getRarityGrantedUR(RandomScoutRarity);
 	}
	else{
		message.channel.send("Invalid arguments. (Note: ExtraType (``ERROR 566``))");
     fs.writeFileSync("./PetBot/settings/scout/Running.txt", 'false');
		return;
	}





	var page = 1;
  	var API_URL = "https://schoolido.lu/api/";
  	var request_url = API_URL + "cards/?rarity="+ ScoutRarity + "&ordering=random"+"&page="+page+"&is_special=False&is_promo=False";
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

   // BOX STUFF

  let DisableEvent = false;
 
 if(BoolSpecialAttribute == 'true'){
     request_url = request_url + "&attribute="+SpecialAttribute; // Special Attribute only*/
   }

  let SpecialChance = Math.floor(getRandom(0, 100));
  let EventChance = Math.floor(getRandom(0,100));

if(BoolSpecialGirl == 'true'){
  if(SpecialChance <= 50){
  request_url = request_url + "&name="+encodeURIComponent(SpecialGirl); // Special Girl only*/
  }
}
  


 if(BoolSpecialSubUnit == 'true'){
    request_url = request_url + "&idol_sub_unit="+encodeURIComponent(SpecialSubUnit);
  }

 if(BoolSpecialYear == 'true'){
    request_url = request_url + "&idol_year="+encodeURIComponent(SpecialYear);
  }

  if(BoolSpecialUnit == 'true'){
    request_url = request_url + "&idol_main_unit="+encodeURIComponent(SpecialUnit);
  }

  

/*if(ScoutRarity == "UR"){
    if(SpecialChance <= 50){
      request_url = request_url + "&ids=1489";
      DisableEvent = true; 
    }
  } else if(ScoutRarity == "SSR"){
    if(SpecialChance <= 50){
      request_url = request_url + "&ids=1506";
      DisableEvent = true;
    }
  }  else if(ScoutRarity == "SR"){
    if(SpecialChance <= 50){
      request_url = request_url + "&ids=1505";
      DisableEvent = true;
    }
  } */


  // BOX STUFF


  if(!DisableEvent){ // If it wasn't disabled by the box scouting
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
     fixPageSize(num,LargeScout,NumberOfScouting,Type, message, SpecialChance, EventChance, RValue, SRValue, SSRValue, URValue, RemoveValue, BBValue, BvValueGive, RRate, SRRate, SSRRate, URRate);
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
    return rng.integer({min, max});
  }


function PetCoinsSoldMessage(Amount, message, LargeScout, RValue, SRValue, SSRValue, URValue, RemoveValue, BBValue, BvValueGive,RRate, SRRate, SSRRate, URRate){
   let UserID = message.author.id;
    message.channel.send("You got "+Amount+" PetCoins as a result of the scout.");
    let NewValue = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"_PetCoins.txt");
    NewValue = parseInt(NewValue) + parseInt(Amount);
     fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"_PetCoins.txt",NewValue);
     fs.writeFileSync("./PetBot/settings/scout/Running.txt", 'false');


     let BTRNG = getRandom(0,100);
    console.log(BTRNG);
    console.log(UserID);

    if(LargeScout == false){
      if(BTRNG <= BBValue){
      message.channel.send("You got"+BvValueGive+" Blue Ticket!");
      let BTAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"_BlueTicket.txt");
      BTAmount = BTAmount.toString('utf8');
      BTAmount == BTAmount + BvValueGive;
      console.log(BTAmount);
      fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"_BlueTicket.txt",BTAmount);
    }
    } else{
      if(BTRNG <= BBValue){
      message.channel.send("You got "+BvValueGive+" Blue Ticket!");
      let BTAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"_BlueTicket.txt");
      BTAmount = BTAmount.toString('utf8');
      BTAmount == BTAmount + BvValueGive;
      console.log(BTAmount);
      fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"_BlueTicket.txt",BTAmount);
    }
    }


  }

function ResetRunning(){
  return; 
}

function GetObjectToUpdateString(ObjectToUpdate, AmountToRemove){

  console.log("Fu: "+ObjectToUpdate);
  console.log("FU: "+AmountToRemove);

  if(ObjectToUpdate == "PetCoins" && AmountToRemove == 1){
    return "PetCoin";
  } else if(ObjectToUpdate == "PetCoins" && AmountToRemove >= 2){
    return "PetCoins";
  } else if(ObjectToUpdate == "BlueTicket" && AmountToRemove == 1){
    return "Blue Ticket";
  } else if(ObjectToUpdate == "BlueTicket" && AmountToRemove >= 2){
    return "Blue Tickets";
  } else if(ObjectToUpdate == "SSRTicket" && AmountToRemove == 1){
    return "SSR Ticket";
  } else if(ObjectToUpdate == "SSRTicket" && AmountToRemove >= 2){
    return "SSR Tickets";
  } else if(ObjectToUpdate == "SRTicket" && AmountToRemove == 1){
    return "SR Ticket";
  } else if(ObjectToUpdate == "SRTicket" && AmountToRemove >= 2){
    return "SR Tickets";
  } else if(ObjectToUpdate == "URTicket" && AmountToRemove == 1){
    return "UR Ticket";
  } else if(ObjectToUpdate == "URTicket" && AmountToRemove >= 2){
    return "UR Tickets";
  } else{
    if(AmountToRemove == 1){
      return ObjectToUpdate;
    } else{
      return ObjectToUpdate+"s";
    }
  }

}
