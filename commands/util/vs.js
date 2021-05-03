const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const fs = require('fs');
const rng = require('random-world');


module.exports = class Refund extends Command {
    constructor(client) {
        super(client, {
            name: 'vs',
            group: 'util',
            guildOnly: true,
            memberName: 'vs',
            description: 'VS Live Event.',
            examples: [''],
            throttling: {
        usages: 1,
        duration: 1
    },
        });
    }

   run(message, args) {
    

    args = message.content.split(' ').slice(1);

    if(args[0] == "c"){
        try{
            message.channel.send("```"+fs.readFileSync("./PetBot/settings/Bandori/VS/Players/"+message.author.id+".json", 'utf8') + "```");
        } catch(e){
            message.channel.send("You're not participating in this event!");
        }
        return;
    }

    if(message.author.id != '168389193603612673'){
      message.channel.send("You have no access to this command.");
      return;
    }
        
    let List = [];
    List = (fs.readFileSync("./PetBot/settings/Bandori/VS/PlayerList.txt", 'utf8')).toString().split(",");
    let ListLength = parseInt(List.length);

    if(ListLength <= 1){
        message.channel.send("Error: Player List is corrupted. Please check it out before proceding.");
        return;
    }

    let ListIndex = fs.readFileSync("./PetBot/settings/Bandori/VS/ListIndex.txt")

    let Turn = parseInt(fs.readFileSync("./PetBot/settings/Bandori/VS/Turn.txt"));

    console.log("List: " + List)
    console.log("ListIndex: " + ListIndex);
    console.log("List[ListIndex]: " + List[ListIndex])

    let CurrentPlayerID = List[ListIndex];

    let Player = JSON.parse(fs.readFileSync("./PetBot/settings/Bandori/VS/Players/"+CurrentPlayerID+".json", 'utf8'));

    let rand = getRandom(-1,ListLength-1); // check if 0, 1 and 2 can be obtained, if not, try 3 to check limit (inclusive or exclusive)
    console.log("rand: " + rand);

    let CurrentTargetID = List[rand];

    while(CurrentTargetID == CurrentPlayerID){
        rand = getRandom(-1, ListLength-1);
        CurrentTargetID = List[rand];
    }

    console.log("CurrentTargetID: "+ CurrentTargetID);
    console.log("CurrentPlayerID: "+ CurrentPlayerID);

    let Target = JSON.parse(fs.readFileSync("./PetBot/settings/Bandori/VS/Players/"+CurrentTargetID+".json", 'utf8'));

        while(CurrentTargetID == CurrentPlayerID){
            rand = getRandom(-1, 4);
            CurrentTargetID = List[rand];
        }




    let AmountOfUses = fs.readFileSync("./PetBot/settings/Bandori/VS/AmountOfUses.txt");
    let Settings = JSON.parse(fs.readFileSync("./PetBot/settings/Bandori/VS/Settings.json", 'utf8'));

    let AttackNumberIndex = Math.floor(AmountOfUses/ListLength);

    console.log("AmountOfUses: "+AmountOfUses);
    console.log("AttackNumberIndex: " + AttackNumberIndex);

    let AttackType = "Error";

    console.log("ListLength: " + ListLength);

    console.log(AttackNumberIndex < ListLength);



    if(AttackNumberIndex != 3 && AttackNumberIndex != 5){
        AttackType = 0; // Physical (0) or Magical (1) - magical only at the third turns, uses magic and not attack
    } else if(AttackNumberIndex == 3){
        AttackType = 1; // Physical (0) or Magical (1) - magical only at the third turns, uses magic and not attack
    } else if(AttackNumberIndex == 5){
        AttackType = 2; // Imaginative (2) - only at fifth turns, uses Imagination
    } 

    if(AttackNumberIndex > 5){
        AmountOfUses = 0;
        AttackType = 0;
    }

    console.log("AttackType: " + AttackType);

    let WeatherRNG = getRandom(0, 100);


    if(ListIndex == 0){
        message.channel.send("**__Turn " + parseInt(parseInt(Turn)+parseInt(1)) + "__**");
        fs.writeFileSync("./PetBot/settings/Bandori/VS/Turn.txt", parseInt(Turn) + 1);

        if(WeatherRNG <= 5){ // Weather selection
            message.channel.send("Weather for this turn has changed to flood!");
            Settings.Weather = "Flood";
            Settings.WeatherFinish = parseInt(Turn) + 1;
            Settings.WeatherFinishPlayer = 0; // List Index is 0, start of turn
        }

        if(Settings.WeatherFinish == Turn && Settings.WeatherFinishPlayer == ListIndex){
            Settings.Weather = "Clear";
            message.channel.send("Weather has been cleared!");
        }
    }


    AmountOfUses++;

    fs.writeFileSync("./PetBot/settings/Bandori/VS/AmountOfUses.txt", AmountOfUses);



    let Evaded = false;

    // Attack starts here

    let EvasionChance = getRandom(0, 100);
    let MirrorChance = getRandom(0, 100);
    let CritChance = getRandom(0, 100);
    let RevivalChance = getRandom(0, 100);
    let RevivalChanceM = getRandom(0, 100); // for mirror damage
    let CharmChance = getRandom(0, 100);
    let FleetingChance = getRandom(0, 100);
    let BlossomChance = getRandom(0, 100);
    let BeatingChance = getRandom(0, 100);
    let MemoryChance = getRandom(0, 100); // for Attack
    let MemoryChance2 = getRandom(0, 100); // for Defense
    let DiveChanceWeather = getRandom(0, 100); // To change weather
    let DiveChance = getRandom(0, 100); // Chance to ignore Flood



    let Damage = 0;
    let MirrorDamage = 0;
    let CritStrike = false;
    let MirrorActivated = false;
    let CharmEffect = 0; // 0 - None, 1 - Normal, 2 - Self
    let DefenseTemporal = 0; // For Defense when Beating
    console.log("EvasionChance: " + EvasionChance);

    let TargetMemoryPickString = "(NULL)";
    let PlayerMemoryPickString = "(NULL)";

    message.delete();
    

    if(DiveChanceWeather <= 5){
        message.channel.send(Player.Name + " has summoned a flood into the battlefield! Weather has changed to Flood.");
        Settings.Weather = "Flood";
        Settings.WeatherFinish = Turn + 3;
        Settings.WeatherFinishPlayer = parseInt(ListIndex);
    }



    ListIndex++;

    if(ListIndex >= ListLength){
        ListIndex = 0;
    }

    fs.writeFileSync("./PetBot/settings/Bandori/VS/ListIndex.txt", ListIndex);

    let SettingsJSON = JSON.stringify(Settings, null, "\t");
    fs.writeFileSync("./PetBot/settings/Bandori/VS/Settings.json", SettingsJSON);


    if(BlossomChance <= Player.Blossoming){
        let BlossomHP = getRandom(29, 120);
        let BlossomATK = getRandom(4, 12);
        message.channel.send(Player.Name + " has blossomed! +" + BlossomHP + " HP and +" + BlossomATK + " Attack!");
        Player.Attack += BlossomATK;
        Player.MaxHP += BlossomHP;
        Player.HP += BlossomHP;
    }


    if(Player.Charmed){
        message.channel.send(Player.Name + " is charmed and can't attack this turn!");
        Player.Charmed = false;
    } else{

        if(Settings.Weather == "Flood"){
            if(DiveChance <= Target.Dive){
                message.channel.send(Target.Name + " has dove into the flood and avoided the negative effects for this turn!");
            } else{
                Target.Agility = Math.round(Target.Agility*0.5);
            }
        }

        if(EvasionChance <= Target.Agility){
            Evaded = true;
        } else{



            let PlayerMemoryIsNegative = 1; // 1 for false, -1 for true. In order to switch values.
            let TargetMemoryIsNegative = 1;
            if(Player.Memory < 0){
                Player.Memory * -1;
                PlayerMemoryIsNegative = -1;
            }
            if(Target.Memory < 0){
                Target.Memory * -1;
                TargetMemoryIsNegative = -1;
            }

            if(MemoryChance <= Player.Memory){
                let PlayerMemoryPick = getRandom(0, 7); // 1 - ATK, 2 - Magic, 3 - Critical, 4 - Charm, 5 - Fleetingness, 6 - Imagination, 7 - Beating
                PlayerMemoryPickString = "(NULL)";
                console.log("PlayerMemoryPick: " + PlayerMemoryPick);
                if(PlayerMemoryPick == 1){
                    PlayerMemoryPickString = "Attack";
                } else if(PlayerMemoryPick == 2){
                    PlayerMemoryPickString = "Magic";
                } else if(PlayerMemoryPick == 3){
                    PlayerMemoryPickString = "Critical";
                } else if(PlayerMemoryPick == 4){
                    PlayerMemoryPickString = "Charm";
                } else if(PlayerMemoryPick == 5){
                    PlayerMemoryPickString = "Charm";
                } else if(PlayerMemoryPick == 6){
                    PlayerMemoryPickString = "Imagination";
                } else if(PlayerMemoryPick == 7){
                    PlayerMemoryPickString = "Beating";
                }
                console.log("PlayerMemoryPickString: " + PlayerMemoryPickString);
                if(PlayerMemoryPickString == "(NULL)"){
                    console.log("Line 260 alert!");
                    message.channel.send("WARNING: PlayerMemoryPickString == NULL");
                }

                Player[PlayerMemoryPickString] += 20 * PlayerMemoryIsNegative;

                message.channel.send(Player.Name + " has remembered something! For this attack only: +20 " + PlayerMemoryPickString);
            }

           
            if(MemoryChance2 <= Target.Memory){
                let TargetMemoryPick = getRandom(0, 4); // 1 - Defense, 2 - Agility, 3 - Mirror, 4 - Revival
                TargetMemoryPickString = "(NULL)";
                console.log("TargetMemoryPick: " + TargetMemoryPick);
                if(TargetMemoryPick == 1){
                    TargetMemoryPickString = "Defense";
                } else if(TargetMemoryPick == 2){
                    TargetMemoryPickString = "Agility";
                } else if(TargetMemoryPick == 3){
                    TargetMemoryPickString = "Mirror";
                } else if(TargetMemoryPick == 4){
                    TargetMemoryPickString = "Revival";
                }

                console.log("TargetMemoryPickString: " + TargetMemoryPickString);
                if(TargetMemoryPickString == "(NULL)"){
                    console.log("Line 287 alert!");
                    message.channel.send("WARNING: TargetMemoryPickString == NULL");
                    return;
                }


                Target[TargetMemoryPickString] += 20;

                message.channel.send(Target.Name + " has remembered something! For this attack only: +20 " + TargetMemoryPickString);
            }

            let MirrorDamageVariable = 0.45;

            if(BeatingChance <= Player.Beating && AttackType != 2){
                console.log("CHANGING DEF FOR " + Target.Name);
                if(Player.Beating > 0){
                   DefenseTemporal = Target.Defense;
                   Target.Defense = 0; 
                } else if(Player.Beating < 0 && AttackType != 2){
                    DefenseTemporal = Target.Defense;
                    Target.Defense *= 2;
                }
                

            }

            if(AttackType == 0){ // Physical attack
                Damage = Math.round(Player.Attack - (Player.Attack*(Target.Defense/100)));
            } else if(AttackType == 1){ // Magical attack
                Damage = Math.round(Player.Magic*3) - Math.round((Player.Magic*3)*(Target.Magic/100));
                if(Settings.Weather == "Flood"){
                    if(DiveChance <= Player.Dive){
                        message.channel.send(Player.Name + " has dove into the flood and avoided the negative effects!");
                    } else{
                        Damage = Math.round(Damage*0.9);
                    }
                }
                MirrorDamageVariable = 0.25;
            } else if(AttackType == 2){ // Imagination attack
                if(BeatingChance <= Player.Beating){
                    message.channel.send(Player.Name + " has used a synergy between Imagination and Beating to increase their imagination by " + Target.Defense + "!");
                    Player.Imagination += Target.Defense;
                }
                if(Player.Imagination >= 0){
                    Damage = 5*Math.ceil(Math.sqrt(Player.Imagination));

                } else{
                    Damage = -(5*Math.Ceil(Math.sqrt(Math.abs(Player.Imagination))));
                }

                if(BeatingChance <= Player.Beating){
                    Player.Imagination += -Target.Defense; // Return value to normal
                }
            }


            if(CritChance <= Player.Critical){
                Damage = Math.round(Damage * 3.5);
                if(Settings.Weather == "Flood"){
                    if(DiveChance <= Player.DiveChance){
                        // nothing
                    } else{
                        Damage = Math.round(Damage * 0.6);
                    }
                }
                CritStrike = true;
            }
    
             if(MirrorChance <= Target.Mirror){
                MirrorDamage = Math.round(Damage * MirrorDamageVariable);
                Player.HP = Player.HP - MirrorDamage;
            }

            if(CharmChance <= Player.Charm){
                CharmEffect = 1; // Normal charm
                Target.Charmed = true;
            } else if(CharmChance < 0){
                CharmChance = CharmChance * -1;
                if(CharmChance <= Player.Charm){
                    CharmEffect = 2; // Self charm
                    Player.Charmed = true;
                }
            }

            Target.HP = Target.HP - Damage;
            if(BeatingChance <= Player.Beating && AttackType != 2){
                console.log("RECOVERING DEF FOR " + Target.Name);
                Target.Defense = DefenseTemporal;
            }
        }

     if(Settings.Weather == "Flood"){ // In the case of weather and memory, avoid using temporal values, use correct values instead.
        if(TargetMemoryPickString == "Agility"){
            Target.Agility = parseInt(Target.Agility) - 20;
            Target.Agility *= 2;
            Target.Agility = parseInt(Target.Agility) + 20;
        } else{
            Target.Agility *= 2;
        }
        
     }


     if(Evaded == true){
        if(AttackType == 0){
            message.channel.send(Player.Name + " attempted to attack " + Target.Name + " but they evaded it!\n"+Target.Name+"'s remaining HP: " + Target.HP);
        } else if(AttackType == 1){
            message.channel.send(Player.Name + " attempted to burn " + Target.Name + " with fire magic but they evaded it!\n"+Target.Name+"'s remaining HP: " + Target.HP);
        } else{
            message.channel.send(Player.Name + " attempted using their imagination to cut " + Target.Name + " but they evaded it!\n"+Target.Name+"'s remaining HP: " + Target.HP); 
        }
    } else{

        let MessageString = "";

        if(CritStrike){
            MessageString = MessageString + "Critical hit! ";
        }

        if(BeatingChance <= Player.Beating && AttackType == 0){
            if(Player.Beating > 0){
                MessageString += "(DEF ignored) ";
            } else{
                MessageString += "(DEF x2) ";
            }      
        }   

          if(AttackType == 0){
            MessageString += Player.Name + " attacked " + Target.Name + " and dealt "+Damage+" damage!\n"+Target.Name+"'s remaining HP: " + Target.HP;
        } else if(AttackType == 1){
           MessageString += Player.Name + " used magic against " + Target.Name + " and dealt "+Damage+" magical damage!\n"+Target.Name+"'s remaining HP: " + Target.HP;
        } else{
            MessageString += Player.Name + " used their imagination against " + Target.Name + " and dealt "+Damage+" imaginative damage!\n"+Target.Name+"'s remaining HP: " + Target.HP;
        }

        if(FleetingChance <= Player.Fleetingness){
            MessageString += "\nDue to their fleetingness, "+Player.Name+" healed " + Math.round(Damage*0.75) + " HP!";
            Player.HP += Math.round(Damage*0.75);
            if(Player.HP > Player.MaxHP){
                Player.HP = Player.MaxHP;
            }
        }

        if(MirrorChance <= Target.Mirror){
            MessageString = MessageString  + "\n"+ Target.Name + "'s mirror skill has dealt " + MirrorDamage + " damage to " + Player.Name + " (Remaining HP: " + Player.HP + ")";
        }       

        if(CharmEffect == 1){
            MessageString = MessageString + "\n" + Target.Name + " has been charmed and won't be able to attack on their next turn!";
        } else if(CharmEffect == 2){
            MessageString = MessageString + "\n" + Player.Name + " has charmed themselves and won't be able to attack on their next turn!";

        }

        message.channel.send(MessageString);

    }   


    // Attack finishes here

    if(Target.HP <= 0 && RevivalChance <= Target.Revival){
        if(AttackType == 0){
            message.channel.send("**" + Target.Name + " was slain by " + Player.Name + "! However, they revived thanks to their revival stat!**");
        } else if(AttackType == 1){
            message.channel.send("**" + Target.Name + " was incinerated by " + Player.Name + "! However, they revived thanks to their revival stat!** ");
        } else if(AttackType == 2){
            message.channel.send("**" + Target.Name + " was killed by a fictional character imaginated by " + Player.Name + "! However, they revived thanks to their revival stat!** ");
        }


        Target.HP = Math.round(Target.MaxHP * 0.1);

    } 

    if(Player.HP <= 0 && RevivalChanceM <= Player.Revival){
        if(AttackType == 0){
            message.channel.send("**" + Player.Name + " was slain with a mirror skill! However, they revived thanks to their revival stat!**");
        } else if(AttackType == 1){
            message.channel.send("**" + Player.Name + " was incinerated with a mirror skill! However, they revived thanks to their revival stat!**");
        } else if(AttackType == 2){
            message.channel.send("**" + Target.Name + " was killed with a mirror skill! However, they revived thanks to their revival stat!**");
        }

        Player.HP = Math.round(Player.MaxHP * 0.1);
    }


    if(MemoryChance <= Player.Memory && PlayerMemoryPickString != "(NULL)"){
        Player[PlayerMemoryPickString] += -20; // Return values from Memory back to normal as they were only temporal.
    }

    if(MemoryChance2 <= Target.Memory && TargetMemoryPickString != "(NULL)"){
        Target[TargetMemoryPickString] += -20; // Return values from Memory back to normal as they were only temporal.
    }


    if(Target.HP <= 0){
        let Delete = List.findIndex(CTID => CTID == CurrentTargetID);
    
        for(var i = 0; i < List.length; i++){ 
           if (List[i] == Delete) {
             List.splice(i, 1); 
           }
        }


        fs.writeFileSync("./PetBot/settings/Bandori/VS/PlayerList.txt", List);

        if(AttackType == 0){
            message.channel.send("**" + Target.Name + " has been slain by " + Player.Name + "!**");
        } else if(AttackType == 1){
            message.channel.send("**" + Target.Name + " has been incinerated by " + Player.Name + "!**");
        } else if(AttackType == 2){
            message.channel.send("**" + Target.Name + " was killed by a fictional character imaginated by " + Player.Name + "!");
        }

        ListIndex--;

    }

        if(Player.HP <= 0){
            let Delete = List.findIndex(CTID => CTID === CurrentPlayerID);
    
            for(var i = 0; i < List.length; i++){ 
               if (List[i] == Delete) {
                 List.splice(i, 1); 
               }
            }

            fs.writeFileSync("./PetBot/settings/Bandori/VS/PlayerList.txt", List);

            if(AttackType == 0){
                message.channel.send("**" + Player.Name + " has been slain with a mirror skill!**");
            } else if(AttackType == 1){
                message.channel.send("**" + Player.Name + " has been incinerated with a mirror skill!**");
            } else if(AttackType == 2){
            message.channel.send("**" + Target.Name + " has been killed by a fictional character!**");
        }

            ListIndex--;
        }
  }

  
    let UpdatedJSON = JSON.stringify(Player, null, "\t");
    fs.writeFileSync("./PetBot/settings/Bandori/VS/Players/"+CurrentPlayerID+".json",UpdatedJSON);

    UpdatedJSON = JSON.stringify(Target, null, "\t");
    fs.writeFileSync("./PetBot/settings/Bandori/VS/Players/"+CurrentTargetID+".json",UpdatedJSON);

}
}

function getRandom(min, max) {
    return rng.integer({min, max});
  }
