const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const ScoutRR = require('./mod/srr.js');
const https = require('https');
const mergeImg = require('merge-img');
//const mysql = require('mysql');
//const PetCoins = require('./mod/sql_petcoins.js');
const fs = require('fs');
var SoldPetCoins = 0;
var ObtainedButterflies = 0;
const rng = require('random-world');
//const gm = require('gm').subClass({imageMagick: true});


// vars that I need for some reason

var FirstIsAlwaysSROrHigher = 0;
var ScoutingResult = [];

// Box scout vars

var Settings = JSON.parse(fs.readFileSync("./PetBot/settings/master.json"));


var SpecialGirl = Settings.SIF.SpecialGirl.value;
var SpecialAttribute = Settings.SIF.SpecialAttribute.value;
var SpecialYear = Settings.SIF.SpecialYear.value;
var SpecialUnit = Settings.SIF.SpecialUnit.value;
var SpecialSubUnit = Settings.SIF.SpecialSubunit.value;

var BoolSpecialGirl = Settings.SIF.SpecialGirl.active;
var BoolSpecialAttribute = Settings.SIF.SpecialAttribute.active;
var BoolSpecialYear = Settings.SIF.SpecialYear.active;
var BoolSpecialUnit = Settings.SIF.SpecialUnit.active;
var BoolSpecialSubUnit = Settings.SIF.SpecialSubunit.active;



//var ScoutingResult = new Array();

const API_URL = "https://schoolido.lu/api/";

module.exports = class ScoutCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'sif',
            guildOnly: true,
            group: 'util',
            memberName: 'sif',
            description: 'Allows you to scout on a special box.',
            throttling: {
        usages: 5,
        duration: 10
    },
        });
    }

   async run(message, args) {

      message.channel.send("No gacha is active at this current time.");
      return;


      Settings = JSON.parse(fs.readFileSync("./PetBot/settings/master.json"));

      SpecialGirl = Settings.SIF.SpecialGirl.value;
      SpecialAttribute = Settings.SIF.SpecialAttribute.value;
      SpecialYear = Settings.SIF.SpecialYear.value;
      SpecialUnit = Settings.SIF.SpecialUnit.value;
      SpecialSubUnit = Settings.SIF.SpecialSubunit.value;

      BoolSpecialGirl = Settings.SIF.SpecialGirl.active;
      BoolSpecialAttribute = Settings.SIF.SpecialAttribute.active;
      BoolSpecialYear = Settings.SIF.SpecialYear.active;
      BoolSpecialUnit = Settings.SIF.SpecialUnit.active;
      BoolSpecialSubUnit = Settings.SIF.SpecialSubunit.active;

      var MasterUser = JSON.parse(fs.readFileSync("./PetBot/settings/user/master.json"));

      //console.log(MasterUser);





      if(fs.readFileSync("./PetBot/settings/box/bool/Running.txt") != 'true'){
        message.channel.send("No box available right now.");
        return;
      }
      


    /*message.channel.send("There's no box available at this moment.");
    return;*/

    var ScoutRunning = fs.readFileSync("./PetBot/settings/scout/Running.txt");
    if(ScoutRunning == 'true'){
      message.channel.send("Another scout is going on right now. Can't run two at the same time.");
      return;
    }
    SoldPetCoins = 0;
    //ObtainedButterflies = 0;
 
    if(message.channel.type != "text"){
      message.channel.send("Command unavailable on the ``"+message.channel.type+"`` type of channel.");
      return;
    }


    args = args.toLowerCase();
	args = args.split(' ');
	let Type = args[0];
	let Range = args[1];

  /*console.log("-------");
 	console.log(message.content);
 	console.log("-------");
 	console.log("Type is: "+Type);
 	console.log("Range is: "+Range);*/

 	// Validate arguments

 	if(Type == null){
 		message.channel.send("Invalid arguments.");
    fs.writeFileSync("./PetBot/settings/scout/Running.txt", 'false');
    // console.log("Type is null, line 129");
 		return;
 	}

 	if(!!Type == false){ // Returns false for null,undefined,0,000,"",false.
 		Type = "normal"; // Gives normal if Type is an empty string
 	}

 	if(typeof Range == 'undefined'){
 		Range = "normal";
 	}
 	// console.log(Range);




 	


 	let UserID = message.author.id;




 	// Create all the files if needed

 	if(fs.existsSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt") == false){
 		 fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt","3000");
 	}
 	if(fs.existsSync("./PetBot/settings/PetCoins/"+UserID+"/SRTicket.txt") == false){
 		 fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/SRTicket.txt","0");
 	}
 if(fs.existsSync("./PetBot/settings/PetCoins/"+UserID+"/SSRTicket.txt") == false){
     fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/SSRTicket.txt","0");
  }
 	if(fs.existsSync("./PetBot/settings/PetCoins/"+UserID+"/URTicket.txt") == false){
 		 fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/URTicket.txt","1");
 	}
 	if(fs.existsSync("./PetBot/settings/PetCoins/"+UserID+"/Inventory.txt") == false){
 		 fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/Inventory.txt","default_null"); // Create inventory, separate IDs with , default_null shall be ignored
 	}

 	if(fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt") == "NaN"){
 		//console.log("Error has occured");
    message.channel.send("**Warning**: Error 160");
 	}

 	let ObjectToUpdate; // This is what we are working with, PetCoins, Tickets, etc.
 	let AmountToRemove = 0; // This is the amount to remove of a certain Object.


 	if(!!MasterUser[UserID].CurrentStepUp == false && MasterUser[UserID].CurrentStepUp != 0){
 		 message.channel.send("An error has occured. It is possible your user has corrupted data or has not been registered properly.");
     fs.writeFileSync("./PetBot/settings/scout/Running.txt", 'false');
     return;
 	}

    // var StepUp = 999;

 	if(Type == "10+1" || Type == "normal" || typeof Type == 'undefined'){
      ObjectToUpdate = "PetCoins";
      AmountToRemove = 0; // Pull cost

      if(Type == "10+1"){
        console.log("MasterUser[UserID].CurrentStepUp: "+MasterUser[UserID].CurrentStepUp);
      	if(MasterUser[UserID].CurrentStepUp == 1){
      		AmountToRemove = 0;
      	} else if(MasterUser[UserID].CurrentStepUp == 2){
      		AmountToRemove = 0;
      	} else if(MasterUser[UserID].CurrentStepUp == 5){
          AmountToRemove = 0;
        } else if(MasterUser[UserID].CurrentStepUp == 6){
          AmountToRemove = 0;
        }
      }

    } else if(Type == "bt5"){
      ObjectToUpdate = "BlueTicket";
      AmountToRemove = 0;
    } else if(Type == "sr"){
      ObjectToUpdate = "SRTicket";
      AmountToRemove = 0;
    } else if(Type == "ssr"){
      ObjectToUpdate = "SSRTicket";
      AmountToRemove = 0;
    } else if(Type == "ur"){
      ObjectToUpdate = "URTicket";
      AmountToRemove = 0;
    } else if(Type == "sr_ssr+"){
      ObjectToUpdate = "SRTicketSSRPlus";
      AmountToRemove = 0;
    } else if(Type == "bt10"){
      ObjectToUpdate = "BlueTicket";
      AmountToRemove = 0;
    } else if(Type == "bt25"){
      ObjectToUpdate = "BlueTicket";
      AmountToRemove = 0;
    } else if(Type == "bts"){
      message.channel.send("This feature is under development. Sorry for the inconvenience.");
      return;
      ObjectToUpdate = "BlueTicket";
      AmountToRemove = 0;
    }

 		if(typeof ObjectToUpdate == 'undefined'){
 			//console.log(Type);
 		}

 		if(Type == "10+1" || Range == "10+1"){
 			AmountToRemove = AmountToRemove*10; // Cost 10 times more if it's a 10+1
 		}

 		if(typeof ObjectToUpdate == 'undefined'){
 			message.channel.send("Invalid arguments.");
       fs.writeFileSync("./PetBot/settings/scout/Running.txt", 'false');
 			return;
 		}


    let ObjectToUpdateString = GetObjectToUpdateString(ObjectToUpdate, AmountToRemove);

    fs.writeFileSync("./PetBot/settings/scout/Running.txt", 'true');

 		let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/"+ObjectToUpdate+".txt"); // Take current amount

 		if(CurrentAmount - AmountToRemove < 0){
 			message.channel.send("You don't have enough "+ObjectToUpdateString+" to perform this action.");
       fs.writeFileSync("./PetBot/settings/scout/Running.txt", 'false');
 			return;
 		}
 		CurrentAmount = CurrentAmount - AmountToRemove; // Remove the spent amount
 	

    	fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/"+ObjectToUpdate+".txt", CurrentAmount);  // Update with the spent amount
    	if(AmountToRemove == 1){
    		if(MasterUser[UserID].CurrentStepUp <= 8 && ObjectToUpdate == "PetCoins" && Type == "10+1"){
    		 //message.channel.send(AmountToRemove+" "+ObjectToUpdateString+" has been removed from your inventory to perform this action. [Step: "+MasterUser[UserID].CurrentStepUp+"]");
    		} else{
    		//message.channel.send(AmountToRemove+" "+ObjectToUpdateString+" has been removed from your inventory to perform this action.");
    		}
      }  else{
      	if(MasterUser[UserID].CurrentStepUp <= 8 && ObjectToUpdate == "PetCoins" && Type == "10+1"){
        //message.channel.send(AmountToRemove+" "+ObjectToUpdateString+" have been removed from your inventory to perform this action. [Step: "+MasterUser[UserID].CurrentStepUp+"]");
    		} else{
        //message.channel.send(AmountToRemove+" "+ObjectToUpdateString+" have been removed from your inventory to perform this action.");
  		}
      } // Update with the spent amount, for singular and plural


      //message.channel.send("*1.5% UR Rate*");

 	if(Type === "10+1" || Range === "10+1"){
 		//message.channel.send("Ok, Little Demon! Please wait a bit, I'm processing all the information...");
 		//console.log("LargeScouting has started");
 		LargeScouting(0,Type, message, UserID, ObjectToUpdate, MasterUser);
 		return;
 	}
    	

 	var RandomScoutRarity = Math.floor(getRandom(0, 100));
 	if(Type != "" && Type != "daily" && Type != "bt5" && Type != "ssr" && Type != "ur" && Type != "idolized" && Type != "normal" && Type != "birthday" && Type != "sr" && Type != "sr_ssr+" && Type != "bt10"&& Type != "bt25" && Type != "bts"){
 		//console.log("Invalid type of Type.");
 		message.channel.send("Invalid arguments.");
     fs.writeFileSync("./PetBot/settings/scout/Running.txt", 'false');
 		return;
 	}
 	if(Type === "" || Type === "normal" || Type === "birthday"){
    RandomScoutRarity = Math.floor(getRandom(0, 100));
 		var ScoutRarity = getRarityNormal(RandomScoutRarity);
 	}
 	else if(Type === "bt5"){
 		var ScoutRarity = getRarityBT(RandomScoutRarity);
 	}
 	else if(Type === "ssr"){
 		var ScoutRarity = getRaritySSRPlus(RandomScoutRarity);
 	}
 	else if(Type === "ur" || Type === "bt25"){
 		var ScoutRarity = getRarityGrantedUR(RandomScoutRarity);
 	}
  else if(Type === "sr"){
    var ScoutRarity = getRaritySRPlus(RandomScoutRarity);
  }
  else if(Type === "sr_ssr+"){
    var ScoutRarity = getRaritySR_SSRPlus(RandomScoutRarity);
  } 
  else if(Type === "bt10"){
    var ScoutRarity = getRarityBT10(RandomScoutRarity);
  } 
  else if(Type === "bts"){
    var ScoutRarity = getRaritySupport(RandomScoutRarity);
  }

    if(ScoutRarity != "R" && ScoutRarity != "SR" && ScoutRarity != "SSR" && ScoutRarity != "UR"){
        //console.log("Invalid arguments for Type");
    message.channel.send("Invalid arguments.");
     fs.writeFileSync("./PetBot/settings/scout/Running.txt", 'false');
    return;
	}
	let page = 1;
    var request_url = API_URL + "cards/?rarity="+ ScoutRarity + "&ordering=random"+"&page="+page+"&is_special=False&is_promo=False";
    console.log("Requested URL is: "+request_url);
    // var request_url = API_URL + "cards/?rarity="+ ScoutRarity + "&ordering=random"+"&page="+page+"&is_special=False";
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

  
  let SpecialChance = Math.floor(getRandom(0, 100));
  let EventChance = Math.floor(getRandom(0,100));


  let DisableEvent = false;

   if(BoolSpecialAttribute == 'true'){
     request_url = request_url + "&attribute="+SpecialAttribute; // Special Attribute only*/
   }
 
if(BoolSpecialGirl == 'true'){
     //let SpecialGirl = "Kousaka Honoka";
  request_url = request_url + "&name="+encodeURIComponent(SpecialGirl); // Special Girl only*/
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
  


/*if(SpecialChance <= 50){
  request_url = request_url + "&name="+encodeURIComponent("Sonoda Umi");
}

let SpecialChanceAttrib = getRandom(0,100);

if(SpecialChanceAttrib <= 50){
  request_url = request_url + "&attribute=Cool";
}*/

if(ScoutRarity == "UR"){
    if(SpecialChance <= 50){
      /* request_url = request_url + "&ids=";
      DisableEvent = true; */ 
    }
  } else if(ScoutRarity == "SSR"){
    if(SpecialChance <= 50){
     /* request_url = request_url + "&ids=1464";
      DisableEvent = true; */
    }
  }  
  else if(ScoutRarity == "SR"){
    if(SpecialChance <= 50){
        /* request_url = request_url + "&ids=1463";
        DisableEvent = true; */
    }
  } /* else if(ScoutRarity == "R"){
    if(SpecialChance <= 15){
      request_url = request_url + "&ids=1516,1517,1518,1519,1520,1521,1522,1523,1524,1525,1526,1527,1528,1529,1530,1531,1532,1533";
      DisableEvent = true;
    } 
  } */
  
  // BOX STUFF

  DisableEvent = true;
  if(!DisableEvent){ // If it wasn't disabled by the box scouting
  if(ScoutRarity == "SR"){
   
   if(EventChance <= 20){ // It's SR and 20% event chance
    request_url = request_url + "&is_event=True";
  //console.log("It was an event card!");
   } else{ // It's SR but not 20% event chance
    request_url = request_url + "&is_event=False";
   }
  } else{ // It's not SR
    request_url = request_url + "&is_event=False";
  }
}



  //console.log("First request URL is: "+request_url);
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
      fixPageSize(num,LargeScout,0,Type,message, SpecialChance, EventChance, page, UserID, ObjectToUpdate, MasterUser); // previous 'getScoutingWithCorrectPageSize', to avoid null request due to data being stored in pages
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
  if(RandomScoutRarity >= 22){ // 80, 21
    ScoutRarity = "R";
  }
  else if(RandomScoutRarity >= 7 && RandomScoutRarity <= 21){ // 81 - 95, 6 - 20
    ScoutRarity = "SR";
  }
  else if(RandomScoutRarity >= 3 && RandomScoutRarity <= 6){ // 96 - 99, 2 - 5
    ScoutRarity = "SSR";
  }
  else if(RandomScoutRarity <= 2){ // 1
    ScoutRarity = "UR";
  }

  return ScoutRarity; 

}

function getRarityBT(RandomScoutRarity){ //BT5
  if(RandomScoutRarity >= 21){
    ScoutRarity = "SR";
  }
  else if(RandomScoutRarity <= 20){
    ScoutRarity = "UR";
  }

  return ScoutRarity; 
 	//return ScoutRarity;

}

function getRarityBT10(RandomScoutRarity){
  if(RandomScoutRarity >= 21){
    ScoutRarity = "SSR";
  }
  else if(RandomScoutRarity <= 20){
    ScoutRarity = "UR";
  }

  return ScoutRarity; 
  //return ScoutRarity;

}

function getRaritySSRPlus(RandomScoutRarity){
	if(RandomScoutRarity >= 21){
    ScoutRarity = "SSR";
  }
  else if(RandomScoutRarity <= 20){
    ScoutRarity = "UR";
  }

  return ScoutRarity; 
 	//return ScoutRarity;
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

function getRaritySR_SSRPlus(RandomScoutRarity){
  if(RandomScoutRarity >= 61){
    ScoutRarity = "SR";
  }
  else if(RandomScoutRarity >= 21 && RandomScoutRarity <= 60){
    ScoutRarity = "SSR";
  }
  else if(RandomScoutRarity <= 20){
    ScoutRarity = "UR";
  }

  return ScoutRarity;
}

function getRarityBTS(RandomScoutRarity){
  if(RandomScoutRarity >= 41){
    ScoutRarity = "R";
  }
  else if(RandomScoutRarity >= 11 && RandomScoutRarity <= 40){
    ScoutRarity = "SR";
  }
  else if(RandomScoutRarity <= 10){
    ScoutRarity = "UR";
  }

  return ScoutRarity;
}

function fixPageSize(num,LargeScout,NumberOfScouting,Type, message, SpecialChance, EventChance, page, UserID, ObjectToUpdate, MasterUser){
  //console.log("SpecialChance: "+SpecialChance);
  //console.log("EventChance: "+EventChance);
  // This is the final part of the scout

  //console.log("Fix Page Size");
  //console.log(MasterUser);
  if(!LargeScout){
  	NumberOfScouting = 999;
  }

  //console.log("Check 8");

  if(page > 49){
    let OldPage = page;
    page = getRandom(1,49);
    //console.log("Page ("+OldPage+") seems to be too big, has been readjusted to: "+page);
  }

  if(page <= 0){
    //console.log("Page was less or equal to 0. It has been default to 1 to avoid issues.");
    page = 1;
  }

  if(EventChance <= 20){
    page = 1;
    //console.log("Event cards, page has been default to 1 to avoid issues.");
  }
  

 var request_url = API_URL + "cards/?rarity="+ ScoutRarity + "&ordering=random"+"&page="+page+"&is_special=False&is_promo=False";
    // var request_url = API_URL + "cards/?rarity="+ ScoutRarity + "&ordering=random"+"&page="+page+"&is_special=False";
 

  // BOX STUFF

  let DisableEvent = false;


 if(BoolSpecialAttribute == true){
     request_url = request_url + "&attribute="+SpecialAttribute; // Special Attribute only*/
   }

if(BoolSpecialGirl == true){
  request_url = request_url + "&name="+encodeURIComponent(SpecialGirl); // Special Girl only*/
}

 if(BoolSpecialSubUnit == true){
    request_url = request_url + "&idol_sub_unit="+encodeURIComponent(SpecialSubUnit);
  }

if(BoolSpecialYear == true){
    request_url = request_url + "&idol_year="+encodeURIComponent(SpecialYear);
  }

if(BoolSpecialUnit == true){
      request_url = request_url + "&idol_main_unit="+encodeURIComponent(SpecialUnit);
    }


/*if(SpecialChance <= 50){
  request_url = request_url + "&name="+encodeURIComponent("Sonoda Umi");
}

let SpecialChanceAttrib = getRandom(0,100);
if(SpecialChanceAttrib <= 50){
  request_url = request_url + "&attribute=Cool";
}*/

if(ScoutRarity == "UR"){
    if(SpecialChance <= 50){
      /* request_url = request_url + "&ids=";
      DisableEvent = true; */ 
    }
  } else if(ScoutRarity == "SSR"){
    if(SpecialChance <= 50){
     /* request_url = request_url + "&ids=1464";
      DisableEvent = true; */
    }
  }  
  else if(ScoutRarity == "SR"){
    if(SpecialChance <= 50){
        /* request_url = request_url + "&ids=1463";
        DisableEvent = true; */
    }
  } /* else if(ScoutRarity == "R"){
    if(SpecialChance <= 15){
      request_url = request_url + "&ids=1516,1517,1518,1519,1520,1521,1522,1523,1524,1525,1526,1527,1528,1529,1530,1531,1532,1533";
      DisableEvent = true;
    } 
  } */

  // BOX STUFF

 
  if(!DisableEvent){ // If it wasn't disabled by the box scouting
  if(ScoutRarity == "SR"){
   if(EventChance <= 20){ // It's SR and 20% event chance
    request_url = request_url + "&is_event=True";
  //console.log("It was an event card!");
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
      num = Math.floor(getRandom(0, parsedData.count));
      //console.log("num value was: "+num);
      //console.log("Length is: "+parsedData.results.length);
      if(num == parsedData.results.length){num = num-1;}

       if(ScoutRarity == "SR"){
            //SoldPetCoins += 50;
          } else if(ScoutRarity == "SSR"){
            //SoldPetCoins += 400;
          } else if(ScoutRarity == "UR"){
            //SoldPetCoins += 4000;
            //ObtainedButterflies += 12;
          }


      if(MasterUser[UserID].CurrentStepUp == 8){
        if(ScoutRarity == "SR"){
            //SoldPetCoins += 50;
          } else if(ScoutRarity == "SSR"){
            //SoldPetCoins += 400;
          }
      }

      
      //console.log("Showing link: "+parsedData.results[Math.floor(num%10)].card_image);
      	if(parsedData.results[Math.floor(num%10)].card_image){
      		if(LargeScout){
            ScoutingResult[NumberOfScouting] = "https:"+parsedData.results[Math.floor(num%10)].round_card_image;
      			//message.channel.send("https:"+parsedData.results[Math.floor(num%10)].round_card_image);
      		}
      		else{
             message.channel.send(new Discord.Attachment("https:"+parsedData.results[Math.floor(num%10)].card_image));
             fs.writeFileSync("./PetBot/settings/scout/Running.txt", 'false');
             setTimeout(PetCoinsSoldMessage, 4000, SoldPetCoins, message, LargeScout, Type, ObtainedButterflies);
      		//message.channel.send("https:"+parsedData.results[Math.floor(num%10)].card_image);
      		}
      	}
      	else{
      	//console.log("Card was a promo. Forcing idolization.")
      		if(LargeScout){
           ScoutingResult[NumberOfScouting] = "https:"+parsedData.results[Math.floor(num%10)].round_card_idolized_image;
      		//message.channel.send("https:"+parsedData.results[Math.floor(num%10)].round_card_idolized_image);
      		}
      		else{
             message.channel.send(new Discord.Attachment("https:"+parsedData.results[Math.floor(num%10)].card_idolized_image));
             fs.writeFileSync("./PetBot/settings/scout/Running.txt", 'false');
             setTimeout(PetCoinsSoldMessage, 4000, SoldPetCoins, message, LargeScout, Type, ObtainedButterflies);
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
          //console.log("ID of given card was: "+parsedData.results[Math.floor(num%10)].id);
          //console.log(NumberOfScouting);


          if(NumberOfScouting < 11){
          	NumberOfScouting++;
          	LargeScouting(NumberOfScouting,Type, message, UserID, ObjectToUpdate, MasterUser);
          }
          if(LargeScout && NumberOfScouting > 10){
              mergeImg([ScoutingResult[0],ScoutingResult[1],ScoutingResult[2],ScoutingResult[3],ScoutingResult[4],ScoutingResult[5],ScoutingResult[6],ScoutingResult[7],ScoutingResult[8],ScoutingResult[9],ScoutingResult[10]])
              .then((img) => {
                 //console.log(img); // => `[object Jimp]` 

                /* gm('box_scout.png')
                .compress('BZip')
                .write('box_scout.png', function (err) {
                  console.log(err);
                 if (!err) console.log('compressed');
                 });
*/

					var MasterUser = JSON.parse(fs.readFileSync("./PetBot/settings/user/master.json"));
					// var StepUp = 999;
          if(ObjectToUpdate == "PetCoins"){
            MasterUser[UserID].CurrentStepUp += 1;
            let UpdatedJSON = JSON.stringify(MasterUser, null, "\t");
            fs.writeFileSync("./PetBot/settings/user/master.json",UpdatedJSON);
          }
					

          img.write('box_scout.png', () => message.channel.send(new Discord.Attachment('box_scout.png')));
            //message.channel.send("You got "+SoldPetCoins+" PetCoins as a result of your scout.");
             setTimeout(PetCoinsSoldMessage, 4000, SoldPetCoins, message, LargeScout, Type, ObtainedButterflies);
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

function LargeScouting(NumberOfScouting,Type, message, UserID, ObjectToUpdate, MasterUser){

  //console.log("Large Scouting: " + MasterUser);
	//console.log("LargeScouting running with NumberOfScouting: "+NumberOfScouting);
	//console.log(NumberOfScouting);
	if(NumberOfScouting == 11){
		FirstIsAlwaysSROrHigher = 0;
		return;
	}
 	
  
  if(Type === "10+1"){
    Type = "normal";
  }
 	
  if(Type != "" && Type != "daily" && Type != "bt5" && Type != "ssr" && Type != "ur" && Type != "idolized" && Type != "normal" && Type != "birthday" && Type != "sr" && Type != "sr_ssr+" && Type != "bt10"&& Type != "bt25" && Type != "bts"){
 		//console.log("Invalid type of Type.");
 		message.channel.send("Invalid arguments.");
    fs.writeFileSync("./PetBot/settings/scout/Running.txt", 'false');
 		return;
 	}
 	
 	let RandomScoutRarity = Math.floor(getRandom(0, 100));

 /* if(Type == "normal"){
    RandomScoutRarity = Math.floor(getRandom(0, 100));
  } */

  if(Type != "normal"){
    if(FirstIsAlwaysSROrHigher == 0){
      if(RandomScoutRarity >= 21){
        RandomScoutRarity = Math.floor(getRandom(0,20));
      }
    }
  }
  

  if(Type == "normal"){
    if(FirstIsAlwaysSROrHigher == 0){
      if(RandomScoutRarity >= 21){
        RandomScoutRarity = Math.floor(getRandom(0,20));
      }
    }
  }

      //var StepUp = 999;

      //console.log("Check 1");

      if(MasterUser[UserID].CurrentStepUp == 2 && FirstIsAlwaysSROrHigher < 2){
        RandomScoutRarity = Math.floor(getRandom(0,20));
        if(RandomScoutRarity == 0){
          RandomScoutRarity = 1;
        } 
      }

      if(MasterUser[UserID].CurrentStepUp == 3 && FirstIsAlwaysSROrHigher == 0){
      	RandomScoutRarity = Math.floor(getRandom(0,5));
      	if(RandomScoutRarity == 0){
      		RandomScoutRarity = 1;
      	}
      }

      if(MasterUser[UserID].CurrentStepUp == 4 || MasterUser[UserID].CurrentStepUp == 8){
        RandomScoutRarity = Math.floor(getRandom(0,20));
        if(RandomScoutRarity == 0){
          RandomScoutRarity = 1;
        }
      }

      if(MasterUser[UserID].CurrentStepUp == 7 && FirstIsAlwaysSROrHigher == 0){
        RandomScoutRarity = Math.floor(getRandom(0,1));
        if(RandomScoutRarity == 0){
          RandomScoutRarity = 1;
        }
      }


      FirstIsAlwaysSROrHigher++;


 	if(Type === "" || Type === "daily" || Type === "idolized" || Type === "normal" || Type === ""){
 		var ScoutRarity = getRarityNormal(RandomScoutRarity);
 	}
 	else if(Type === "bt5"){
 		var ScoutRarity = getRarityBT(RandomScoutRarity);
 	}
 	else if(Type === "ssr"){
 		var ScoutRarity = getRaritySSRPlus(RandomScoutRarity);
 	}
 	else if(Type === "ur"){
 		var ScoutRarity = getRarityGrantedUR(RandomScoutRarity);
 	} else if(Type === "sr"){
    var ScoutRarity = getRaritySRPlus(RandomScoutRarity);
  } else if(Type === "sr_ssr+"){
    var ScoutRarity = getRaritySR_SSRPlus(RandomScoutRarity);
  } else if(Type === "bt10"){
    var ScoutRarity = getRarityBT10(RandomScoutRarity);
  }  else if(Type === "bts"){
    var ScoutRarity = getRaritySupport(RandomScoutRarity);
  }


	else{
		message.channel.send("Invalid arguments. (Note: ExtraType (``ERROR 814``))");
     fs.writeFileSync("./PetBot/settings/scout/Running.txt", 'false');
		return;
	}





	var page = 1;
  	var API_URL = "https://schoolido.lu/api/";
    
  	var request_url = API_URL + "cards/?rarity="+ ScoutRarity + "&ordering=random"+"&page="+page+"&is_special=False&is_promo=False";
    // var request_url = API_URL + "cards/?rarity="+ ScoutRarity + "&ordering=random"+"&page="+page+"&is_special=False";
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

  //console.log("Check 3");


if(BoolSpecialGirl == true){
  request_url = request_url + "&name="+encodeURIComponent(SpecialGirl); // Special Girl only*/
}
  
 if(BoolSpecialSubUnit == true){
    request_url = request_url + "&idol_sub_unit="+encodeURIComponent(SpecialSubUnit);
  }

 if(BoolSpecialYear == true){
    request_url = request_url + "&idol_year="+encodeURIComponent(SpecialYear);
  }

if(BoolSpecialUnit == true){
      request_url = request_url + "&idol_main_unit="+encodeURIComponent(SpecialUnit);
  }  

  //console.log("Check 4");

/*if(SpecialChance <= 50){
  request_url = request_url + "&name="+encodeURIComponent("Sonoda Umi");
}

let SpecialChanceAttrib = getRandom(0,100);

if(SpecialChanceAttrib <= 50){
  request_url = request_url + "&attribute=Cool";
}*/

if(ScoutRarity == "UR"){
    if(SpecialChance <= 50){
      /* request_url = request_url + "&ids=";
      DisableEvent = true; */ 
    }
  } else if(ScoutRarity == "SSR"){
    if(SpecialChance <= 50){
     /* request_url = request_url + "&ids=1464";
      DisableEvent = true; */
    }
  }  
  else if(ScoutRarity == "SR"){
    if(SpecialChance <= 50){
        /* request_url = request_url + "&ids=1463";
        DisableEvent = true; */
    }
  } /* else if(ScoutRarity == "R"){
    if(SpecialChance <= 15){
      request_url = request_url + "&ids=1516,1517,1518,1519,1520,1521,1522,1523,1524,1525,1526,1527,1528,1529,1530,1531,1532,1533";
      DisableEvent = true;
    } 
  } */


  // BOX STUFF

  if(!DisableEvent){ // If it wasn't disabled by the box scouting
    if(ScoutRarity == "SR"){
     
     if(EventChance <= 20){ // It's SR and 20% event chance
      request_url = request_url + "&is_event=True";
    //console.log("It was an event card!");
     } else{ // It's SR but not 20% event chance
      request_url = request_url + "&is_event=False";
     }
    } else{ // It's not SR
      request_url = request_url + "&is_event=False";
    }
}
  
  https.get(request_url, (res) => {
    const { statusCode } = res;
    const contentType = res.headers['content-type'];

    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => {
      try {
        const parsedData = JSON.parse(rawData);
        /*console.log(parsedData);
        console.log(parsedData.count);
        console.log(request_url);*/
        let num = Math.floor(getRandom(0, parsedData.count));
        let LargeScout = true;
        fixPageSize(num,LargeScout,NumberOfScouting,Type, message, SpecialChance, EventChance, page, UserID, ObjectToUpdate, MasterUser);
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


function PetCoinsSoldMessage(Amount, message, LargeScout, Type, ObtainedButterflies){
	fs.writeFileSync("./PetBot/settings/scout/Running.txt", 'false');
   /*let UserID = message.author.id;
    message.channel.send("You got "+Amount+" PetCoins as a result of the scout.");
    let NewValue = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt");
    NewValue = parseInt(NewValue) + parseInt(Amount);
     fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt",NewValue);
     

     if(LargeScout && Type != "bt5" && Type != "bt10" && Type != "bt25" && Type != "bts"){
      message.channel.send("You got 1 Blue Ticket!");
      let BTAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/BlueTicket.txt");
      BTAmount = BTAmount.toString('utf8');
      BTAmount++;
      fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/BlueTicket.txt",BTAmount);
    }

    /* if(ObtainedButterflies != 0){
      message.channel.send("You got " + ObtainedButterflies + " Butterflies!");
      let ButterflyAmount = parseInt(fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/Butterflies.txt"));
      fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/Butterflies.txt", ButterflyAmount + ObtainedButterflies);
    } 

*/
  } 

function GetObjectToUpdateString(ObjectToUpdate, AmountToRemove){

  //console.log("Fu: "+ObjectToUpdate);
  //console.log("FU: "+AmountToRemove);

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
