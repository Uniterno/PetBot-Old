const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const ScoutRR = require('./mod/srr.js');
const https = require('https');
const mergeImg = require('merge-img');
const fs = require('fs');
const rng = require('random-world');
const stringTable = require('string-table');


module.exports = class BandoriCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'saoars',
            group: 'util',
            guildOnly: true,
            memberName: 'saoars',
            description: 'Does something',
            throttling: {
        usages: 5,
        duration: 10
    },
        });
    }

   run(message, args) {

    // This command was on development and doesn't actually work. Most of it is an unfinished copy-paste anyway.


   if(message.channel.id != 692590332306653215){
      //return;
    }

    let DateV = new Date();
    let UserID = message.author.id;

    if(fs.existsSync("./PetBot/settings/Chaldea/LastDay_" + UserID + ".txt") == false){
      fs.writeFileSync("./PetBot/settings/Chaldea/LastDay_" + UserID + ".txt","0");
    }

    if(fs.existsSync("./PetBot/settings/Chaldea/Pulls_" + UserID + ".txt") == false){
      fs.writeFileSync("./PetBot/settings/Chaldea/Pulls_" + UserID + ".txt","0");
    }

    let LastLogin = fs.readFileSync("./PetBot/settings/Chaldea/LastDay_" + UserID + ".txt");
    let Pulls = fs.readFileSync("./PetBot/settings/Chaldea/Pulls_" + UserID + ".txt");
    let CurrentDate = DateV.getUTCDate() + "/" + (DateV.getUTCMonth()+1) + "/" + DateV.getUTCFullYear();


    if(LastLogin != CurrentDate){
      Pulls = 0;
      fs.writeFileSync("./PetBot/settings/Chaldea/LastDay_" + UserID + ".txt", CurrentDate);
    }

    if(Pulls >= 3){
      message.channel.send("¡Ya has usado tus 3 pulls por hoy!");
      message.channel.send(new Discord.Attachment('https://66.media.tumblr.com/cf239160029d1ffa1e60899b0753d0b9/tumblr_inline_ph4g3rUGce1qifc43_1280.jpg'));
      return;
    }

    Pulls = parseInt(Pulls) + 1;
    fs.writeFileSync("./PetBot/settings/Chaldea/Pulls_" + UserID + ".txt", Pulls);

    console.log("---\nSAOARS scouting\n---");

  args = args.split(' ');
  let Amount = args[0];



     //args = args.toLowerCase();
     
    var AttributePull = false;
      if(args[0] == "10"){
        if(!!args[1] == true){
      args[1] = args[1].toLowerCase();
      console.log(args[1]);
      if(args[1] == "attribute" || args[1] == "a" || args[1] == "atr" || args[1] == "true"){
      AttributePull = true;
      }
    }
  } else{
      args[0] = args[0].toLowerCase();
      console.log(args[0]);
      if(args[0] == "attribute" || args[0] == "a" || args[0] == "atr" || args[0] == "true"){
        AttributePull = true;
    }
  }

  Amount = "1";


    console.log("Amount: "+Amount);

     

  
  let CardsArray = JSON.parse(fs.readFileSync("./PetBot/settings/bandori/cardsAprilFools.json"));
  let CardsArrayTemp = [];
  var ImportantArray = [];
  var ScoutingResult = [];

  //console.log("---");

  //Amount = 1;

  let i = 1;
  while(i <= Amount){
    CardsArrayTemp.length = 0;
    //console.log("i: "+i);
    let RandomScoutRarity = getRandom(0, 1000);
    if(Amount == "10" || Amount == "5"){
      if(i == 1){
        if(RandomScoutRarity > 115){
          RandomScoutRarity = 115; // 3* guaranteed
        }
      }
    }

    //console.log("RandomScoutRarity: "+RandomScoutRarity);
    let Rarity = getRarity(RandomScoutRarity, false);

    if(Rarity == 4){
      ButterflyAmount += 4;
    }
    //console.log("Rarity: "+Rarity);
    let a = 0;
    let b = 0;
    //console.log("Object: "+ JSON.stringify(CardsArray));
   /* while(a <= parseInt(Object.keys(CardsArray.results).length - 1)){
     /* console.log("a: "+a);
      console.log("b: "+b);
      console.log("CardsArray.results[a].i_rarity: "+CardsArray.results[a].i_rarity);
      console.log("Rarity: "+Rarity);
      console.log("Object.keys(CardsArray.results).length - 1: "+parseInt(Object.keys(CardsArray.results).length - 1));*/
    
     /* if(AttributePull == true){
          if(CardsArray.results[a].i_rarity == Rarity && CardsArray.results[a].i_attribute == SettingsMaster.Bandori.Gacha.FeaturedAttribute){
          CardsArrayTemp[b] = CardsArray.results[a];
          //console.log("CardsArrayTemp[b]: "+CardsArrayTemp[b]);
          b++;
        }

      } else{
        if((CardsArray.results[a].i_rarity == Rarity)){
        CardsArrayTemp[b] = CardsArray.results[a];
        //console.log("CardsArrayTemp[b]: "+CardsArrayTemp[b]);
        b++;
      }
      }

      
      a++;
    } */

     //console.log("CardsArrayTemp.length - 1: "+CardsArrayTemp.length - 1);

  let SelectedCard = getRandom(0, 8);
  console.log("SelectedCard: " + SelectedCard);

    //while(SelectedCard == 18 || SelectedCard == 19){
      //SelectedCard = getRandom(0, 45);
    //}

  console.log("SelectedCard after FORCED_CHANGE: " + SelectedCard);
  //console.log("SelectedCard: "+SelectedCard);
  //console.log("CardsArrayTemp: "+CardsArrayTemp);

  if(SelectedCard <= 8){
  	if(Amount == "10" || Amount == "5"){
      ScoutingResult[i] = encodeURI("https://saoars.fanadata.com/public/data/unit/150/character_" + SelectedCard + ".png");
    } else{
      //console.log("i: "+i);
      ScoutingResult[i] = encodeURI("https://saoars.fanadata.com/public/data/character/character_" + SelectedCard + ".png");
    }
} else{
	if(SelectedCard == 9){
		ScoutingResult[i] = "https://i.pinimg.com/564x/25/78/68/2578684ff6e5f085b649c085e52dbc9b.jpg";
	} else if(SelectedCard == 10){
		ScoutingResult[i] = "https://i.pinimg.com/originals/47/85/da/4785da2751184c823524ad3993d0582a.jpg";
	} else if(SelectedCard == 11){
		ScoutingResult[i] = "https://i.pinimg.com/564x/62/c5/f5/62c5f54a06e722be4034122dc8b970b1.jpg";
	} else if(SelectedCard == 12){
		ScoutingResult[i] = "https://scontent-lhr8-1.cdninstagram.com/v/t51.2885-15/sh0.08/e35/s640x640/81513184_2493291927592558_3605390641763810858_n.jpg?_nc_ht=scontent-lhr8-1.cdninstagram.com&_nc_cat=110&_nc_ohc=3u3cKHbM88sAX-wpf_s&oh=12edf0f599a0b6f265122babdc6a177c&oe=5E8DCDB0&ig_cache_key=MjIwOTE0NDUwNDA3MDc0NDQ0NQ%3D%3D.2";
	} else if(SelectedCard == 13){
		ScoutingResult[i] = "PetBot/Kirito.jpg";
	} else if(SelectedCard == 14){
		ScoutingResult[i] = "https://www.pngitem.com/pimgs/m/517-5170253_sword-art-online-christmas-eugeo-hd-png-download.png";
	} else if(SelectedCard == 15){
		ScoutingResult[i] = "https://i.pinimg.com/originals/bc/6e/b0/bc6eb0abe10e3f49ee94159f5e845b42.png";
	} else if(SelectedCard == 16){
		ScoutingResult[i] = "PetBot/Eugeo.jpg";
	} else if(SelectedCard == 17){
		ScoutingResult[i] = "https://i.pinimg.com/originals/31/0b/cd/310bcd0120890039c09fd9f1ad136c60.jpg";
	}
}

      

  

  //UpdateInventory(CardsArrayTemp[SelectedCard], UserID, Idolized);

  i++;

  }

  /* if(ButterflyAmount != 0){
    message.channel.send("You obtained " + ButterflyAmount + " Butterflies!");
    let CurrentButterflyAmount = parseInt(fs.readFileSync("./PetBot/settings/PetCoins/"+UserID+"/Butterflies.txt"));
    fs.writeFileSync("./PetBot/settings/PetCoins/"+UserID+"/Butterflies.txt", CurrentButterflyAmount + ButterflyAmount);
  } */
  

  if(Amount == "10" || Amount == "5"){
    if(Amount == "5"){
      mergeImg([ScoutingResult[1],ScoutingResult[2],ScoutingResult[3],ScoutingResult[4],ScoutingResult[5]])
      .then((img) => {
        console.log(img); // => `[object Jimp]` 
        img.write('saoars_scout.png', () => message.channel.send(new Discord.Attachment('saoars_scout.png')));

      });
    } else if(Amount == "10"){
      mergeImg([ScoutingResult[1],ScoutingResult[2],ScoutingResult[3],ScoutingResult[4],ScoutingResult[5],ScoutingResult[6],ScoutingResult[7],ScoutingResult[8],ScoutingResult[9],ScoutingResult[10]])
        .then((img) => {
          console.log(img); // => `[object Jimp]` 
          img.write('saoars_scout.png', () => message.channel.send(new Discord.Attachment('saoars_scout.png')));
          
        });
    }
  } else{
      console.log("i: "+i);
      message.channel.send(new Discord.Attachment(ScoutingResult[i-1]));

    }
  }
}



function getRandom(min, max) {
    return rng.integer({min, max});
  }


function getRarity(RandomScoutRarity, DreamFes) {
    return "AprilFools";

    if(DreamFes){
      if(RandomScoutRarity <= 60){
        return 4;
      } else if(RandomScoutRarity <= 145){
        return 3;
      } else{
        return 2;
      }
    } else{
      if(RandomScoutRarity <= 30){
        return 4;
      } else if(RandomScoutRarity <= 115){
        return 3;
      } else{
       return 2;
      }
    }

    
  }

  function UpdateInventory(Card, UserID, Idolized) {
    var Inventory = JSON.parse(fs.readFileSync("./PetBot/settings/bandori/Inventory/"+UserID+"/Inventory.json", 'utf8'));
    let UserMaster = JSON.parse(fs.readFileSync("./PetBot/settings/user/master.json"));
    let SettingsMaster = JSON.parse(fs.readFileSync("./PetBot/settings/master.json"));
    let Member = getMember(Card);

    if(SettingsMaster.Bandori.Gacha.RewardsParameter){
      let RandomParameter = getRandom(0, 4);
        // message.channel.send("[DEBUG] RandomParameter (1): " + RandomParameter);
      let V = 0;
      if(RandomParameter == 4){
        RandomParameter = SettingsMaster.Bandori.Gacha.FeaturedParameters;
      }

      if(RandomParameter == "Performance"){
        RandomParameter = 1;
      } else if(RandomParameter == "Visual"){
        RandomParameter = 2;
      } else if(RandomParameter == "Technique"){
        RandomParameter = 3;
      }

     // message.channel.send("[DEBUG] RandomParameter (2): " + RandomParameter);

      if(RandomParameter == 1){
        RandomParameter = "Performance";

        if(Idolized && Card.performance_trained_max != 0){
          V = getRandom(Card.performance_min, Card.performance_trained_max);
        } else{
          V = getRandom(Card.performance_min, Card.performance_max);
        }
        
      } else if(RandomParameter == 2){
        RandomParameter = "Visual";

        if(Idolized && Card.visual_trained_max != 0){
          V = getRandom(Card.visual_min, Card.visual_trained_max);
        } else{
          V = getRandom(Card.visual_min, Card.visual_max);
        }

      } else if(RandomParameter == 3){
        RandomParameter = "Technique";

        if(Idolized && Card.technique_trained_max != 0){
          V = getRandom(Card.technique_min, Card.technique_trained_max);
        } else{
          V = getRandom(Card.technique_min, Card.technique_max);
        }
      }

      //message.channel.send("[DEBUG] RandomParameter (3): " + RandomParameter);

      V *= SettingsMaster.Bandori.Gacha.ParameterMultiplier;

      UserMaster[UserID].Bandori.Parameters[RandomParameter] += V;

       let ParametersJSON = JSON.stringify(UserMaster, null, "\t");
       fs.writeFileSync("./PetBot/settings/user/master.json",ParametersJSON);
    }
   

    if(Member != "SantaAlter"){
      let Band = getBand(Member);
      let Attribute = Card.i_attribute;
      console.log("Idolized: " + Idolized);

      if(Inventory[Band][Attribute][Member] == Card.i_rarity && Idolized == "s" && Card.i_rarity == 4){
        Inventory[Band][Attribute][Member] = Card.i_rarity + 1;
        Inventory[Band][Attribute][Member][Idolized] = true;
        let UpdatedJSON = JSON.stringify(Inventory, null, "\t");
        fs.writeFileSync("./PetBot/settings/bandori/Inventory/"+UserID+"/Inventory.json",UpdatedJSON);
      } else if(Inventory[Band][Attribute][Member] < Card.i_rarity){
        Inventory[Band][Attribute][Member] = Card.i_rarity;
        let UpdatedJSON = JSON.stringify(Inventory, null, "\t");
        fs.writeFileSync("./PetBot/settings/bandori/Inventory/"+UserID+"/Inventory.json",UpdatedJSON);
      }

      
    }
  }


function getMember(Card){
  let Member = "Unknown";
  if(Card.member == 6){
    Member = "Kasumi";
  } else if(Card.member == 7){
    Member = "Tae";
  } else if(Card.member == 8){
    Member = "Rimi";
  } else if(Card.member == 9){
    Member = "Saaya";
  } else if(Card.member == 10){
    Member = "Arisa";
  } else if(Card.member == 11){
    Member = "Ran";
  } else if(Card.member == 12){
    Member = "Moca";
  } else if(Card.member == 13){
    Member = "Himari";
  } else if(Card.member == 14){
    Member = "Tomoe";
  } else if(Card.member == 15){
    Member = "Tsugumi";
  } else if(Card.member == 16){
    Member = "Kokoro";
  } else if(Card.member == 17){
    Member = "Kaoru";
  } else if(Card.member == 18){
    Member = "Hagumi";
  } else if(Card.member == 19){
    Member = "Kanon";
  } else if(Card.member == 20){
    Member = "Michelle";
  } else if(Card.member == 21){
    Member = "Aya";
  } else if(Card.member == 22){
    Member = "Hina";
  } else if(Card.member == 23){
    Member = "Chisato";
  } else if(Card.member == 24){
    Member = "Maya";
  } else if(Card.member == 25){
    Member = "Eve";
  } else if(Card.member == 26){
    Member = "Yukina";
  } else if(Card.member == 27){
    Member = "Sayo";
  } else if(Card.member == 28){
    Member = "Lisa";
  } else if(Card.member == 29){
    Member = "Ako";
  } else if(Card.member == 30){
    Member = "Rinko";
  } else if(Card.member == 101){
    Member = "SantaAlter";
  }

  return Member;
}

function getBand(Member){
  let Band = "Unknown";

  console.log("Member: "+Member);

  if(Member == "Kasumi" || Member == "Saaya" || Member == "Tae" || Member == "Rimi" || Member == "Arisa"){
    Band = "PoPiPa";
  } else if(Member == "Rinko" || Member == "Ako" || Member == "Lisa" || Member == "Sayo" || Member == "Yukina"){
    Band = "Roselia";
  } else if(Member == "Hagumi" || Member == "Kokoro" || Member == "Kanon" || Member == "Michelle" || Member == "Kaoru"){
    Band = "HaroHapi";
  } else if(Member == "Aya" || Member == "Maya" || Member == "Chisato" || Member == "Eve" || Member == "Hina"){
    Band = "PasuPare";
  } else if(Member == "Tomoe" || Member == "Ran" || Member == "Moca" || Member == "Himari" || Member == "Tsugumi"){
    Band = "Afterglow";
  }

  return Band;
}