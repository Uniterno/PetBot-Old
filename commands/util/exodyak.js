const { Command } = require('discord.js-commando');
const Discord = require('discord.js');


module.exports = class GraphCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'exodyak',
            group: 'util',
            guildOnly: true,
            memberName: 'exodyak',
            description: '???',
            examples: [''],
            throttling: {
        usages: 3,
        duration: 50
    },
        });
    }

   run(message, args) {
    // Simple and quick Bandori efficiency calculator

    args = message.content.split(' ').slice(1);


    let PtsPerFlame = args[0]; // Amount of points received per flame
    let Stars = args[1]; // Amount of available stars
    let EventDurationDays = args[2]; // Duration of event, in days
    let EfficiencyDecrease = args[3]; // Percentage of efficiency to decrease by step.
    /* For example, if this value is 0.1, the table will be printed as such:
    [100%] -> Value
    [90%] -> Value
    [80%] -> Value
    etc.

    If the value is 0.5, the table will be printed as:
    [100%] -> Value
    [50%] -> Value

    If the value is 0.01, values for 100%, 99%, 98%, 97%, etc. will be printed (unless limited by characters)

    */
    

    console.log(args);


    let a = 1; // Amount of efficiency waste. Basically how many natural flames are not optimally consumed.
    let s = ""; 
    let v = 0;

    // There's a maximum of 10 flames, and for speed purposes you'll want to use 3 (the max) at once.
    // That's multiplied by your Stars, since you can refill your flames for 100 Stars.
    // Added to the event duration (in days) / 2, since you get the equivalent to 50 Stars per day.
    // Plus the natural refilling of flames, equivalent to one every 30 minutes, so 48 times a day.
    // Multiplied by efficiency waste.

    while(a > 0){
        v = (10*PtsPerFlame/3)*((Stars/100)+(EventDurationDays/2)) + ((EventDurationDays*48)*(PtsPerFlame/3))*a;
        s += "\n["+Math.round(a*100)+"%] -> " + v;
        a -= EfficiencyDecrease;
    }

    if(EfficiencyDecrease <= 0 || EfficiencyDecrease >= 1){
        s = "Incorrect arguments provided.";
    } 

    message.channel.send(s);

  }
}
