const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const Help = require('./OOP/help');

module.exports = class SIFCompare extends Command {
    constructor(client) {
        super(client, {
            name: 'compare',
            group: 'util',
            guildOnly: true,
            memberName: 'compare',
            description: 'SIF Comparing',
            throttling: {
        usages: 1,
        duration: 3
    },
        });
    }

   run(message, args) {

    args = message.content.split(' ').slice(1);
    if(args[0] == "help"){
      const embed = new Discord.MessageEmbed()
        //.setTitle("")
        .setColor([0, 150, 136])
        .addField("Help", Help.help('Compare'))
      message.channel.send({embed});
      return;
    }

    if(args[0] == "tap"){
      let HelpMessage = "<Bonus1.1> means the quantity of cards that are on-group or on-attrib, but only on one, not both. <BonusTap1.21> means the quantity of cards that are on-group AND on-attrib. Not using any means that ALL cards are off-group and off-center";
      const embed = new Discord.MessageEmbed()
        //.setTitle("")
        .setColor([0, 150, 136])
        .addField("Tap", HelpMessage)
      message.channel.send({embed});
      return;
    }

    if(args[0] == "flags"){
      let HelpMessage = "Flags is an argument to do really cool, cutting-edge, untested and not recommended stuff. Most flags are hidden for testing purposes. The following flags are public: \n\n``-embed``: Use this flag to use an embed instead of plain text. This will use a lot of space in the chat but it's prettier, while plain text is shorter but old-fashioned.";
      const embed = new Discord.MessageEmbed()
      //.setTitle("")
      .setColor([139, 26, 26])
      .addField("Flags", HelpMessage)
      message.channel.send({embed});
      return;
    }

    if(args[0] == "guest"){
      let HelpMessage = "All arguments are optional.\n\n``GuestCenterType`` is the type of the center skill your guest's center card has.\n\n``GuestAmount`` is the amount of cards affected by the second part of the guest center skill (eg. a 6% out of a 9/6 skill).\n\nUse ``!compare gt`` to check all available Guest Types. (Warning: There are a lot).";
      const embed = new Discord.MessageEmbed()
      //.setTitle("")
      .setColor([0, 150, 136])
      .addField("Guest", HelpMessage)
      message.channel.send({embed});
      return;
    }

    if(args[0] == "gt"){
      let HelpMessage = "```css\n Available center skills``` \n9/6\n9/3\n12/6\n7/2\n7/1\n6\n3\n```css\n Debug ones (not in game)``` \n12/12\n24/6\n24/24\n48/6\n48/12\n48/24\n48/48\n100\n100/100\n200/100\n300/100\n200/200\n300/300\n-12/-6\n-9/-6\n-9/-3";
      message.channel.send(HelpMessage);
      return;
    }

    if(args[0] == "avg" || args[0] == "abs"){

      let Type = args[0];   
      let ScoreUp = parseFloat(args[1]);
      let TeamStats = parseFloat(args[2]);
      let BeatmapNotes = parseFloat(args[3]);
      let BonusTap = parseFloat(args[4]);
      if (typeof BonusTap == 'string' || BonusTap instanceof String){
        BonusTap = 0;
        console.log("BonusTap was a string. Default to 0.");
      }
      let BonusTapExtra = parseFloat(args[5]);
      let GuestCenterType = args[6];
      let GuestCenterAmount = parseFloat(args[7]);
      let Flag = args[8];

      console.log("Score Up: "+ScoreUp);
      console.log("isNaN:"+ isNaN(ScoreUp));


      if(!!GuestCenterType == false){
        GuestCenterType = "null";
      }
      if(!!GuestCenterAmount == false){
        GuestCenterAmount = 0;
      }




    if(args[4] == null || isNaN(args[5]) || args[4] == undefined){
      BonusTap = 0;
    } else{
      BonusTap = args[4];
    }
    if(args[5] == null || isNaN(args[5])  || args[5] == undefined){
      BonusTapExtra = 0;
    } else{
      BonusTapExtra = args[5];
    }
    let SumOfCards = parseInt(BonusTap) + parseInt(BonusTapExtra);
    console.log("BonusTap: "+BonusTap);
    console.log("BonusTapExtra: "+BonusTapExtra);
    console.log("SumOfCards: "+SumOfCards);
    if(SumOfCards > 9){
      const embed = new Discord.MessageEmbed()
              .setTitle("Bonus1.1 and Bonus1.21 values are higher than 9. A team can only use up to a max of 9 members.")
              .setColor([238, 146, 5])
              message.channel.send({embed});
      return;
    }

    if(isNaN(args[1]) || isNaN(args[2]) || isNaN(args[3])){
             const embed = new Discord.MessageEmbed()
              .setTitle("Use only math numbers. Unicode and emotes aren't allowed.")
              .setColor([242, 232, 6])
              message.channel.send({embed});
            return;
          }

  
    console.log("GuestCenterAmount: "+GuestCenterAmount);


    if(isNaN(GuestCenterAmount)){
             const embed = new Discord.MessageEmbed()
              .setTitle("Use only math numbers. Unicode and emotes aren't allowed.")
              .setColor([242, 232, 6])
              message.channel.send({embed});
            return;
          }

     if(!!GuestCenterAmount == false){
      GuestCenterAmount = 0;
     }     

    if(GuestCenterAmount >= 10){
             const embed = new Discord.MessageEmbed()
              .setTitle("Guest Center amount can't be greater than 9.")
              .setColor([242, 232, 6])
              message.channel.send({embed});
            return;
          }


         let Data = dahCompare(ScoreUp, TeamStats, BeatmapNotes, 0, Type, BonusTap, BonusTapExtra, GuestCenterType, GuestCenterAmount);
         let Data2 = dahCompare(ScoreUp, TeamStats, BeatmapNotes, 1, Type, BonusTap, BonusTapExtra, GuestCenterType, GuestCenterAmount);

         if(Flag == "-embed"){
          const embed = new Discord.MessageEmbed()
              //.setTitle("Veil vs Charm")
              .setColor([238, 146, 5])
              .addField("Better",
    Data)
  .addField("Detailed info",
   Data2)
  //.addBlankField()
  //.addField("Charm (Absolute)", ScoreAbs, true)
  //.addField("Charm (Average)", ScoreAvg, true)
              message.channel.send({embed});
               return;
             } else{
              message.channel.send(Data);
              message.channel.send(Data2);}
         

         return;
        }

        if(args[0] == null || args[1] == null || args[2] == null || args[3] == null || args[4] == null){
          const embed = new Discord.MessageEmbed()
              .setTitle("Invalid arguments.")
              .setColor([238, 146, 5])
              message.channel.send({embed});
          return;
        }

        console.log("-----");

    let ScoreUp = parseFloat(args[0]);
    let ActivChance = parseFloat(args[1]);
    let NoteReq = parseFloat(args[2]);
    let TeamStats = parseFloat(args[3]);
    let BeatmapNotes = parseFloat(args[4]);
    let BonusTap = parseFloat(args[5]);
    let BonusTapExtra = parseFloat(args[6]);
    let GuestCenterType = args[7];
    let GuestCenterAmount = parseFloat(args[8]);
    let Flag = args[9];


    if(args[5] == "-embed" || args[6] == "-embed"){
      message.channel.send("There's an error in your arguments. Please check them again.");
      return;
    }

    if(args[5] == null || isNaN(args[5]) || args[5] == undefined){
      BonusTap = 0;
    } else{
      BonusTap = args[5];
    }
    if(args[6] == null || isNaN(args[6]) || args[6] == undefined){
      BonusTapExtra = 0;
    } else{
      BonusTapExtra = args[6];
    }
    let SumOfCards = parseInt(BonusTap) + parseInt(BonusTapExtra);
    console.log("BonusTap: "+BonusTap);
    console.log("BonusTapExtra: "+BonusTapExtra);
    console.log("SumOfCards: "+SumOfCards);
    if(SumOfCards > 9){
     const embed = new Discord.MessageEmbed()
              .setTitle("Bonus1.1 and Bonus1.21 values are greater than 9. A team can only use up to a max of 9 members.")
              .setColor([238, 146, 5])
              message.channel.send({embed});
      return;
    }

if(isNaN(args[0]) || isNaN(args[1]) || isNaN(args[2]) || isNaN(args[3]) || isNaN(args[4])){
             const embed = new Discord.MessageEmbed()
              .setTitle("Use only math numbers. Unicode and emotes aren't allowed.")
              .setColor([242, 232, 6])
              message.channel.send({embed});
            return;
          }

      if(!!GuestCenterAmount == false){
        GuestCenterAmount = 0;
      }




     if(GuestCenterAmount >= 10){
             const embed = new Discord.MessageEmbed()
              .setTitle("Guest Center amount can't be greater than 9.")
              .setColor([242, 232, 6])
              message.channel.send({embed});
            return;
          }

    if(ActivChance > 100){
      ActivChance = 100;
    }

    if(ScoreUp < 0 || ActivChance < 0 || NoteReq < 0 || TeamStats < 0 || BeatmapNotes < 0){
      const embed = new Discord.MessageEmbed()
              .setTitle("You can't use negative values.")
              .setColor([242, 232, 6])
              message.channel.send({embed});
      return;
    }

    let ScoreAbs = (Math.floor(BeatmapNotes / NoteReq) * ScoreUp);
    let ScoreAvg = Math.floor(ScoreAbs * (ActivChance/100));
   // let CenterAll = 0;
    // let CenterSome = 0;

   /* if(CenterType == "9/3"){
      CenterAll = 9;
      CenterSome = 3;
    } else if(CenterType == "9/6"){
      CenterAll = 9;
      CenterSome = 6;
    } else if(CenterType == "12/6"){
      CenterAll = 8;
      CenterSome = 6;
    } else if(CenterType == "7/2"){
      CenterAll = 7;
      CenterSome = 2;
    } else if(CenterType == "7/1"){
      CenterAll = 7;
      CenterSome = 1;
    } else if(CenterType == "6"){
      CenterAll = 6;
    } else if (CenterType == "3"){
      CenterAll = 3;
    } else{
      message.channel.send("Invalid CenterType");
      return;
    }

    if(OnCenterCards > 9){
      OnCenterCards = 9;
    }
    console.log("OnCenterCards: "+OnCenterCards);
    let CenterTypeRate = OnCenterCards/9
    console.log("CenterTypeRate: "+CenterTypeRate);


    TeamStats = TeamStats+(TeamStats*CenterAll/100)+(((TeamStats*CenterSome/100))*CenterTypeRate);
    */
let Combo800 = 0;
let Combo600 = 0;
let Combo400 = 0;
let Combo200 = 0;
let Combo100 = 0;
let Combo50 = 0;
let Combo1 = 0;


    if(BeatmapNotes > 800){
      Combo800 = BeatmapNotes - 800;
      //BeatmapNotes = BeatmapNotes % 800;
      //console.log("BeatmapNotes: "+BeatmapNotes);
    }
    if (BeatmapNotes > 600){
      Combo600 = BeatmapNotes - 600;
      if(Combo600 > 200){
        Combo600 = 200;
      }
      //BeatmapNotes = BeatmapNotes % 600;
      //console.log("BeatmapNotes: "+BeatmapNotes);
    }
    if(BeatmapNotes > 400){
      Combo400 = BeatmapNotes - 400;
      if(Combo400 > 200){
        Combo400 = 200;
      }
      //Combo400 = Math.round(BeatmapNotes / 400);
      //BeatmapNotes = BeatmapNotes % 400;
      //console.log("BeatmapNotes: "+BeatmapNotes);
    }
    if(BeatmapNotes > 200){
       Combo200 = BeatmapNotes - 200;
      if(Combo200 > 200){
        Combo200 = 200;
      }
      //Combo200 = Math.round(BeatmapNotes / 200);
      //BeatmapNotes = BeatmapNotes % 200;
      //console.log("BeatmapNotes: "+BeatmapNotes);
    }
    if(BeatmapNotes > 100){
      Combo100 = BeatmapNotes - 100;
      if(Combo100 > 100){
        Combo100 = 100;
      }
      //Combo100 = Math.round(BeatmapNotes / 100);
      //BeatmapNotes = BeatmapNotes % 100;
      //console.log("BeatmapNotes: "+BeatmapNotes);
    }
    if(BeatmapNotes > 50){
      Combo50 = BeatmapNotes - 50;
      if(Combo50 > 50){
        Combo50 = 50;
      }
      //Combo50 = Math.round(BeatmapNotes / 50);
      //BeatmapNotes = BeatmapNotes % 50;
      //console.log("BeatmapNotes: "+BeatmapNotes);
    }
    if(BeatmapNotes >= 1){
      Combo1 = BeatmapNotes;
       if(Combo1 > 50){
        Combo1 = 50;
      }
     /* console.log("BeatmapNotes: "+BeatmapNotes);
      console.log("1: "+Combo1);
      console.log("50: "+Combo50);
      console.log("100: "+Combo100);
      console.log("200: "+Combo200);*/
    }
    

    let NoVeil = (TeamStats * 0.0125)*Combo1;
    NoVeil = NoVeil + ((TeamStats * 0.0125)*(Combo50*1.1));
    NoVeil = NoVeil + ((TeamStats * 0.0125)*(Combo100*1.15));
    NoVeil = NoVeil + ((TeamStats * 0.0125)*(Combo200*1.2));
    NoVeil = NoVeil + ((TeamStats * 0.0125)*(Combo400*1.25));
    NoVeil = NoVeil + ((TeamStats * 0.0125)*(Combo600*1.3));
    NoVeil = NoVeil + ((TeamStats * 0.0125)*(Combo800*1.35));
    NoVeil = Math.ceil(NoVeil);


    let NoVeilArray = new Array();

     NoVeilArray[0] = NoVeil;
            NoVeilArray[1] = NoVeil;
            NoVeilArray[2] = NoVeil;
            NoVeilArray[3] = NoVeil;
            NoVeilArray[4] = NoVeil;
            NoVeilArray[5] = NoVeil;
            NoVeilArray[6] = NoVeil;
            NoVeilArray[7] = NoVeil;
            NoVeilArray[8] = NoVeil;

            console.log("Bonus Tap: "+BonusTap);
            let i = BonusTap;
            let ia = 0;

            while(i != 0){
              NoVeilArray[ia] = NoVeilArray[ia]*1.1;
              i = i - 1; 
              ia++;
            }

            i = BonusTapExtra;

            while(i != 0){
              NoVeilArray[ia] = NoVeilArray[ia]*1.21;
              i = i - 1;
              ia++;
            }

            let GuestCenterMultiplier1 = 1;
            let GuestCenterMultiplier2 = 1;

            if(!!GuestCenterType == true){
              if(GuestCenterType == "12/6"){
                GuestCenterMultiplier1 = 1.12;
                GuestCenterMultiplier2 = 1.06;
              } else if(GuestCenterType == "9/6"){
                GuestCenterMultiplier1 = 1.09;
                GuestCenterMultiplier2 = 1.06;
              } else if(GuestCenterType == "9/3"){
                GuestCenterMultiplier1 = 1.09;
                GuestCenterMultiplier2 = 1.03;
              } else if(GuestCenterType == "7/2"){
                GuestCenterMultiplier1 = 1.07;
                GuestCenterMultiplier2 = 1.02;
              } else if(GuestCenterType == "7/1"){
                GuestCenterMultiplier1 = 1.07;
                GuestCenterMultiplier2 = 1.01;
              } else if(GuestCenterType == "6"){
                GuestCenterMultiplier1 = 1.06;
              } else if(GuestCenterType == "3"){
                GuestCenterMultiplier1 = 1.03;
              } else if(GuestCenterType == "12/12"){
                GuestCenterMultiplier1 = 1.12;
                GuestCenterMultiplier2 = 1.12;
              } else if(GuestCenterType == "24/6"){
                GuestCenterMultiplier1 = 1.24;
                GuestCenterMultiplier2 = 1.06;
              } else if(GuestCenterType == "24/24"){
                GuestCenterMultiplier1 = 1.24;
                GuestCenterMultiplier2 = 1.24;
              } else if(GuestCenterType == "48/6"){
                GuestCenterMultiplier1 = 1.48;
                GuestCenterMultiplier2 = 1.06;
              } else if(GuestCenterType == "48/12"){
                GuestCenterMultiplier1 = 1.48;
                GuestCenterMultiplier2 = 1.12;
              } else if(GuestCenterType == "48/24"){
                GuestCenterMultiplier1 = 1.48;
                GuestCenterMultiplier2 = 1.24;
              } else if(GuestCenterType == "48/48"){
                GuestCenterMultiplier1 = 1.48;
                GuestCenterMultiplier2 = 1.48;
              } else if(GuestCenterType == "100"){
                GuestCenterMultiplier1 = 2;
              } else if(GuestCenterType == "100/100"){
                GuestCenterMultiplier1 = 2;
                GuestCenterMultiplier2 = 2;
              } else if(GuestCenterType == "200/100"){
                GuestCenterMultiplier1 = 3;
                GuestCenterMultiplier2 = 2;
              } else if(GuestCenterType == "300/100"){
                GuestCenterMultiplier1 = 4;
                GuestCenterMultiplier2 = 2;
              } else if(GuestCenterType == "200/200"){
                GuestCenterMultiplier1 = 3;
                GuestCenterMultiplier2 = 3;
              } else if(GuestCenterType == "300/300"){
                GuestCenterMultiplier1 = 4;
                GuestCenterMultiplier2 = 4;
              } else if(GuestCenterType == "-12/-6"){
                GuestCenterMultiplier1 = 0.88;
                GuestCenterMultiplier2 = 0.94;
              } else if(GuestCenterType == "-9/-6"){
                GuestCenterMultiplier1 = 0.91;
                GuestCenterMultiplier2 = 0.94;
              } else if(GuestCenterType == "-9/-3"){
                GuestCenterMultiplier1 = 0.91;
                GuestCenterMultiplier2 = 0.97;
              } 
           }

            i = 9; // Guess Center 'Main'
            ia = 0;

            console.log("GuestCenterAmount: "+GuestCenterAmount);
            console.log("GuestCenterType: "+GuestCenterType);

            while(i != 0){
              NoVeilArray[ia] = NoVeilArray[ia]*GuestCenterMultiplier1;
              i = i - 1; 
              ia++;
            }

            i = GuestCenterAmount;
            ia = 0;

            while(i != 0){
              NoVeilArray[ia] = NoVeilArray[ia]*GuestCenterMultiplier2;
              i = i - 1; 
              ia++;
            }



            NoVeil = (NoVeilArray[0] + NoVeilArray[1] + NoVeilArray[2] + NoVeilArray[3] + NoVeilArray[4] + NoVeilArray[5] + NoVeilArray[6] + NoVeilArray[7] + NoVeilArray[8])/9;

   // let NoVeil = (Math.round(TeamStats * 0.0125)*BeatmapNotes);
    // let Veil = (Math.round((TeamStats+(TeamStats*0.024)) * 0.0125)*BeatmapNotes);

let Veil = ((TeamStats+(TeamStats*0.024)) * 0.0125)*Combo1;
    Veil = Veil + ((TeamStats+(TeamStats*0.024)) * 0.0125)*(Combo50*1.1);
    Veil = Veil + ((TeamStats+(TeamStats*0.024)) * 0.0125)*(Combo100*1.15);
    Veil = Veil + ((TeamStats+(TeamStats*0.024)) * 0.0125)*(Combo200*1.2);
    Veil = Veil + ((TeamStats+(TeamStats*0.024)) * 0.0125)*(Combo400*1.25);
    Veil = Veil + ((TeamStats+(TeamStats*0.024)) * 0.0125)*(Combo600*1.3);
    Veil = Veil + ((TeamStats+(TeamStats*0.024)) * 0.0125)*(Combo800*1.35);
    Veil = Math.ceil(Veil);

            let VeilArray = new Array();

            VeilArray[0] = Veil;
            VeilArray[1] = Veil;
            VeilArray[2] = Veil;
            VeilArray[3] = Veil;
            VeilArray[4] = Veil;
            VeilArray[5] = Veil;
            VeilArray[6] = Veil;
            VeilArray[7] = Veil;
            VeilArray[8] = Veil;


            i = BonusTap;
            ia = 0;

            while(i != 0){
              VeilArray[ia] = VeilArray[ia]*1.1;
              i = i - 1; 
              ia++;
              console.log("i: "+i);
              console.log("ia: "+ia); 
            }

            i = BonusTapExtra;

            while(i != 0){
              VeilArray[ia] = VeilArray[ia]*1.21;
              i = i - 1;
              ia++;
            }


            i = 9; //Guess Center 'Main'
            ia = 0;

            while(i != 0){
              VeilArray[ia] = VeilArray[ia]*GuestCenterMultiplier1;
              i = i - 1; 
              ia++;
            }

            i = GuestCenterAmount;
            ia = 0;

            while(i != 0){
              VeilArray[ia] = VeilArray[ia]*GuestCenterMultiplier2;
              i = i - 1; 
              ia++;
            }


            Veil = Math.ceil((VeilArray[0] + VeilArray[1] + VeilArray[2] + VeilArray[3] + VeilArray[4] + VeilArray[5] + VeilArray[6] + VeilArray[7] + VeilArray[8])/9);

    console.log("NoVeil: "+NoVeil);
    console.log("Veil: "+Veil);
    Veil = Veil - NoVeil;
    let VeilAbs = Veil+ScoreAbs;
    let VeilAvg = Veil+ScoreAvg;
    ScoreAbs = ScoreAbs*2.5;
    ScoreAvg = ScoreAvg*2.5;

    VeilAbs = Math.ceil(VeilAbs);
    VeilAvg = Math.ceil(VeilAvg);
    ScoreAbs = Math.ceil(ScoreAbs);
    ScoreAvg = Math.ceil(ScoreAvg);

  console.log("ScoreAbs: "+ScoreAbs);
  console.log("ScoreAvg: "+ScoreAvg);
  console.log("VeilAbs: "+VeilAbs);
  console.log("VeilAvg: "+VeilAvg);

  let OnAbsoluteString = "";
  let OnAverageString = "";


    if(ScoreAbs > VeilAbs){
      OnAbsoluteString = "Charm is better.";
      } else if(ScoreAbs == VeilAbs){
        OnAbsoluteString = "Both are equal.";
      } else if (ScoreAbs < VeilAbs){
        OnAbsoluteString = "Veil is better.";
      } else{
         OnAbsoluteStrinng = "I don't know, something weird is going on and :snail: pet needs to fix it.";
         return;
      }

    if(ScoreAvg > VeilAvg){
      OnAverageString = "Charm is better.";
      } else if(ScoreAvg == VeilAvg){
        OnAverageString = "Both are equal.";
      } else if (ScoreAvg < VeilAvg){
        OnAverageString = "Veil is better.";
      } else{
         OnAverageString = "I don't know, something weird is going on and :snail: pet needs to fix it.";
         return;
      }

    if(Flag == "-embed"){
       let ColorForEmbed = [0,0,0];

      if((OnAbsoluteString == OnAverageString) && OnAbsoluteString.charAt(0) == "C"){
        ColorForEmbed[0] = 253;
        ColorForEmbed[1] = 89;
        ColorForEmbed[2] = 0;
      } else if((OnAbsoluteString == OnAverageString) && OnAbsoluteString.charAt(0) == "V"){
        ColorForEmbed[0] = 123;
        ColorForEmbed[1] = 0;
        ColorForEmbed[2] = 253;
      } else if(OnAverageString.charAt(0) == "C"){
        ColorForEmbed[0] = 247;
        ColorForEmbed[1] = 255;
        ColorForEmbed[2] = 0;
      } else if(OnAverageString.charAt(0) == "V"){
        ColorForEmbed[0] = 51;
        ColorForEmbed[1] = 0;
        ColorForEmbed[2] = 255;
      } else if(OnAbsoluteString.charAt(0) == "B" || OnAverageString.charAt(0) == "B"){
        ColorForEmbed[0] = 0;
        ColorForEmbed[1] = 255;
        ColorForEmbed[2] = 239;
      } else{
        ColorForEmbed[0] = 255;
        ColorForEmbed[1] = 255;
        ColorForEmbed[2] = 255;
      } 


      const embed = new Discord.MessageEmbed()
  .setTitle("Veil vs Charm")
  .setColor([ColorForEmbed[0], ColorForEmbed[1], ColorForEmbed[2]])
  //.setFooter("", "")
  //.setThumbnail("https://vignette1.wikia.nocookie.net/love-live/images/5/5e/LLSS_S1Ep1_109.png/revision/latest?cb=20160703230250")
  //.setTimestamp()
  //.addBlankField()
  .addField("On absolute",
    OnAbsoluteString, true)
  .addField("On average",
   OnAverageString, true)
  //.addBlankField()
  .addField("Charm (Absolute)", ScoreAbs, true)
  .addField("Charm (Average)", ScoreAvg, true)
  //.addBlankField()
  .addField("Veil (Absolute)", VeilAbs, true)
  .addField("Veil (Average)", VeilAvg, true)
  message.channel.send({embed});
    } else{
      message.channel.send("On absolute: "+OnAbsoluteString+"\nOn average: "+OnAverageString+"\nScore with Charm (Absolute): ``"+ScoreAbs+"``\nScore with Charm (Average): ``"+ScoreAvg+"``\nScore with Veil (Absolute): ``"+VeilAbs +"``\nScore with Veil (Average): ``"+VeilAvg+"``");
    }
  }
}