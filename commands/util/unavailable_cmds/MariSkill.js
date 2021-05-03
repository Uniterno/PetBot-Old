const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const ScoutRR = require('./mod/srr.js');
const https = require('https');
const mergeImg = require('merge-img');
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

module.exports = class MariSkillCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'luigidisabled',
            group: 'util',
            memberName: 'luigidisabled',
            description: 'Luigi command (Mari).',
            examples: ['scout'],
            throttling: {
        usages: 5,
        duration: 10
    },
        });
    }

   async run(message, args) {

      let UserID = message.author.id;

      if(UserID != "113282276321697792" && UserID != "168389193603612673"){
        return;
      }

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



      if(fs.readFileSync("./PetBot/settings/box/bool/Running.txt") != 'true'){
        message.channel.send("No box available right now");
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

  if(Type != "10+1"){
    Type = "10+1";
  }

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




 	


 

  if(fs.existsSync("././PetBot/settings/PetCoins/"+UserID+"/FreePulls.txt") == false){
     fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/FreePulls.txt","0");
  }

  let CurrentFreePulls = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/FreePulls.txt");

  if(CurrentFreePulls == 0){
    if(fs.existsSync("./PetBot/settings/skills/MariSkill.txt") == false){
      fs.writeFileSync("./PetBot/settings/skills/MariSkill.txt","1");
      }      
      let MariSkill = fs.readFileSync("./PetBot/settings/skills/MariSkill.txt");

      if(MariSkill >= 50){
        console.log("Mari Skill is over");
        return;
      }
  }

   



 	// Create all the files if needed

 	if(fs.existsSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt") == false){
 		 fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt","3000");
 	}
 	if(fs.existsSync("././PetBot/settings/PetCoins/"+UserID+"/SRTicket.txt") == false){
 		 fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/SRTicket.txt","0");
 	}
 if(fs.existsSync("././PetBot/settings/PetCoins/"+UserID+"/SSRTicket.txt") == false){
 		 fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/SSRTicket.txt","0");
 	}
 	if(fs.existsSync("././PetBot/settings/PetCoins/"+UserID+"/URTicket.txt") == false){
 		 fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/URTicket.txt","1");
 	}
 	if(fs.existsSync("././PetBot/settings/PetCoins/"+UserID+"/Inventory.txt") == false){
 		 fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/Inventory.txt","default_null"); // Create inventory, separate IDs with , default_null shall be ignored
 	}

  

 	if(fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt") == "NaN"){
 		console.log("Error has occured");
    message.channel.send("**Warning**: Error 133");
 	}

 	let ObjectToUpdate; // This is what we are working with, PetCoins, Tickets, etc.
 	let AmountToRemove; // This is the amount to remove of a certain Object.


 		if(Type == "10+1" || Type == "normal" || typeof Type == 'undefined'){
      ObjectToUpdate = "PetCoins";
      AmountToRemove = 50; // Pull cost
      if(fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/FreePulls.txt") > 0){
      message.channel.send("You have used a free pull to perform this action");
      AmountToRemove = 0;
      let CurrentTimesUsedSkill = fs.readFileSync("./PetBot/settings/skills/MariSkill.txt");
      fs.writeFileSync("./PetBot/settings/skills/MariSkill.txt",parseInt(CurrentTimesUsedSkill) - 1);

      let CurrentFreePulls = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/FreePulls.txt");

      fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/FreePulls.txt", parseInt(CurrentFreePulls) - 1);


      }
    } else if(Type == "bt"){
      //console.log("Not supported yet");
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

 		let CurrentAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/"+ObjectToUpdate+".txt"); // Take current amount

 		if(CurrentAmount - AmountToRemove < 0){
 			message.channel.send("You don't have enough "+ObjectToUpdateString+" to perform this action.");
       fs.writeFileSync("./PetBot/settings/scout/Running.txt", 'false');
 			return;
 		}
 		CurrentAmount = CurrentAmount - AmountToRemove; // Remove the spent amount
 	

    	fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/"+ObjectToUpdate+".txt", CurrentAmount);  // Update with the spent amount
      if(AmountToRemove != 0){
        if(AmountToRemove == 1){
        message.channel.send(AmountToRemove+" "+ObjectToUpdateString+" has been removed from your inventory to perform this action");
      }  else{
        message.channel.send(AmountToRemove+" "+ObjectToUpdateString+" have been removed from your inventory to perform this action");
      } // Update with the spent amount, for singular and plural
      }
    	


 	if(Type === "10+1" || Range === "10+1"){
 		//message.channel.send("Ok, Little Demon! Please wait a bit, I'm processing all the information...");
 		console.log("LargeScouting has started");
 		LargeScouting(0,Type, message, AmountToRemove);
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
 		var ScoutRarity = getRarityNormal(RandomScoutRarity);
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
  


if(ScoutRarity == "UR"){
    if(SpecialChance <= 50){
      request_url = request_url + "&ids=1574,1575,1576,1578";
      DisableEvent = true; 
    }
  } else if(ScoutRarity == "SSR"){
    /*if(SpecialChance <= 50){
      request_url = request_url + "&ids=1568,1558";
      DisableEvent = true;
    }*/
  }  
  if(ScoutRarity == "SR"){
    if(SpecialChance <= 50){
        request_url = request_url + "&ids=1572,1573,1577";
        DisableEvent = true;
    }
  } else if(ScoutRarity == "R"){
    /*if(SpecialChance <= 15){
      request_url = request_url + "&ids=1516,1517,1518,1519,1520,1521,1522,1523,1524,1525,1526,1527,1528,1529,1530,1531,1532,1533";
      DisableEvent = true;
    }*/
  }
  
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
      fixPageSize(num,LargeScout,Type,0,message, SpecialChance, EventChance, AmountToRemove); // previous 'getScoutingWithCorrectPageSize', to avoid null request due to data being stored in pages
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
	if(RandomScoutRarity >= 21){ // 80, 21
    ScoutRarity = "R";
  }
  else if(RandomScoutRarity >= 6 && RandomScoutRarity <= 20){ // 81 - 95, 6 - 20
    ScoutRarity = "SR";
  }
  else if(RandomScoutRarity >= 2 && RandomScoutRarity <= 5){ // 96 - 99, 2 - 5
    ScoutRarity = "SSR";
  }
  else if(RandomScoutRarity <= 1){ // 1
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

function fixPageSize(num,LargeScout,NumberOfScouting,Type, message, SpecialChance, EventChance, AmountToRemove){
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
    // var request_url = API_URL + "cards/?rarity="+ ScoutRarity + "&ordering=random"+"&page="+page+"&is_special=False";
 

  // BOX STUFF

  let DisableEvent = false;


 if(BoolSpecialAttribute == 'true'){
     request_url = request_url + "&attribute="+SpecialAttribute; // Special Attribute only*/
   }

if(BoolSpecialGirl == 'true'){
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

if(ScoutRarity == "UR"){
    if(SpecialChance <= 50){
      request_url = request_url + "&ids=1574,1575,1576,1578";
      DisableEvent = true; 
    }
  } else if(ScoutRarity == "SSR"){
    /*if(SpecialChance <= 50){
      request_url = request_url + "&ids=1568,1558";
      DisableEvent = true;
    }*/
  }  
  if(ScoutRarity == "SR"){
    if(SpecialChance <= 50){
        request_url = request_url + "&ids=1572,1573,1577";
        DisableEvent = true;
    }
  } else if(ScoutRarity == "R"){
    /*if(SpecialChance <= 15){
      request_url = request_url + "&ids=1516,1517,1518,1519,1520,1521,1522,1523,1524,1525,1526,1527,1528,1529,1530,1531,1532,1533";
      DisableEvent = true;
    }*/
  }

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
            SoldPetCoins = SoldPetCoins+20;
            console.log("20 Sold. Total: "+SoldPetCoins);
          } else if(ScoutRarity == "SSR"){
            SoldPetCoins = SoldPetCoins+200;
            console.log("200 Sold. Total: "+SoldPetCoins);
          } else if(ScoutRarity == "UR"){
            SoldPetCoins = SoldPetCoins+2000;
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
              setTimeout(PetCoinsSoldMessage, 4000, SoldPetCoins, message, LargeScout, AmountToRemove);
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
              setTimeout(PetCoinsSoldMessage, 4000, SoldPetCoins, message, LargeScout, AmountToRemove);
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
          	LargeScouting(NumberOfScouting,Type, message, AmountToRemove);
          }
          if(LargeScout && NumberOfScouting > 10){
              mergeImg([ScoutingResult[0],ScoutingResult[1],ScoutingResult[2],ScoutingResult[3],ScoutingResult[4],ScoutingResult[5],ScoutingResult[6],ScoutingResult[7],ScoutingResult[8],ScoutingResult[9],ScoutingResult[10]])
              .then((img) => {
                 console.log(img); // => `[object Jimp]` 
                  img.write('box_scout.png', () => message.channel.send(new Discord.Attachment('box_scout.png')));
                  //message.channel.send("You got "+SoldPetCoins+" PetCoins as a result of your scout.");
                   setTimeout(PetCoinsSoldMessage, 8000, SoldPetCoins, message, LargeScout, AmountToRemove);
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

function LargeScouting(NumberOfScouting,Type, message, AmountToRemove){
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
 		var ScoutRarity = getRarityNormal(RandomScoutRarity);
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


if(BoolSpecialGirl == 'true'){
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

if(ScoutRarity == "UR"){
    if(SpecialChance <= 50){
      request_url = request_url + "&ids=1574,1575,1576,1578";
      DisableEvent = true; 
    }
  } else if(ScoutRarity == "SSR"){
    /*if(SpecialChance <= 50){
      request_url = request_url + "&ids=1568,1558";
      DisableEvent = true;
    }*/
  }  
  if(ScoutRarity == "SR"){
    if(SpecialChance <= 50){
        request_url = request_url + "&ids=1572,1573,1577";
        DisableEvent = true;
    }
  } else if(ScoutRarity == "R"){
    /*if(SpecialChance <= 15){
      request_url = request_url + "&ids=1516,1517,1518,1519,1520,1521,1522,1523,1524,1525,1526,1527,1528,1529,1530,1531,1532,1533";
      DisableEvent = true;
    }*/
  }


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
     fixPageSize(num,LargeScout,NumberOfScouting,Type, message, SpecialChance, EventChance, AmountToRemove);
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


function PetCoinsSoldMessage(Amount, message, LargeScout, AmountToRemove){
   let UserID = message.author.id;
    message.channel.send("You got "+Amount+" PetCoins as a result of the scout.");
    let NewValue = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt");
    NewValue = parseInt(NewValue) + parseInt(Amount);
     fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/PetCoins.txt",NewValue);
     fs.writeFileSync("./PetBot/settings/scout/Running.txt", 'false');

     let SkillRNG = getRandom(0,100);
      console.log("AmountToRemove: "+AmountToRemove);
      console.log("AmountToRemove: "+AmountToRemove);
      console.log("AmountToRemove: "+AmountToRemove);
      console.log("AmountToRemove: "+AmountToRemove);
      console.log("AmountToRemove: "+AmountToRemove);
      console.log("AmountToRemove: "+AmountToRemove);
      console.log("AmountToRemove: "+AmountToRemove);
      console.log("AmountToRemove: "+AmountToRemove);
      console.log("AmountToRemove: "+AmountToRemove);
      console.log("AmountToRemove: "+AmountToRemove);
      console.log("AmountToRemove: "+AmountToRemove);
      console.log("AmountToRemove: "+AmountToRemove);
      console.log("AmountToRemove: "+AmountToRemove);
      console.log("AmountToRemove: "+AmountToRemove);
      console.log("AmountToRemove: "+AmountToRemove);
      console.log("AmountToRemove: "+AmountToRemove);


      if(SkillRNG <= 15 && AmountToRemove != 0){
        message.channel.send("You got 1 free pull!");

    let CurrentFreePulls = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/FreePulls.txt");

        fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/FreePulls.txt", parseInt(CurrentFreePulls) + 1);
        
      }

        let CurrentTimesUsedSkill = fs.readFileSync("./PetBot/settings/skills/MariSkill.txt");
        fs.writeFileSync("./PetBot/settings/skills/MariSkill.txt",parseInt(CurrentTimesUsedSkill) + 1);


     let BTRNG = getRandom(0,100);
    console.log(BTRNG);
    console.log(UserID);

    if(LargeScout == false){
      if(BTRNG <= 4){
      message.channel.send("You got 1 Blue Ticket!");
      let BTAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/BlueTicket.txt");
      BTAmount = BTAmount.toString('utf8');
      BTAmount++;
      console.log(BTAmount);
      fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/BlueTicket.txt",BTAmount);
    }
    } else{
      if(BTRNG <= 40){
      message.channel.send("You got 1 Blue Ticket!");
      let BTAmount = fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/BlueTicket.txt");
      BTAmount = BTAmount.toString('utf8');
      BTAmount++;
      console.log(BTAmount);
      fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/BlueTicket.txt",BTAmount);
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