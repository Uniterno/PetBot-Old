const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
//const mysql = require('mysql');
const fs = require('fs');
//const http = require('http');
const https = require('https');
const rng = require('random-world');
// vars that I need for some reason


module.exports = class Jap extends Command {
    constructor(client) {
        super(client, {
            name: 'jap',
            group: 'util',
            memberName: 'jap',
            guildOnly: true,
            description: 'Japanese Dictionary.',
            examples: [''],
            throttling: {
        usages: 1,
        duration: 5
    },
        });
    }

   run(message, args) {    
    args = message.content.split(' ').slice(1);
    let keyword = args[0];
    let request_url = "https://jisho.org/api/v1/search/words?keyword="+encodeURIComponent(keyword);
    https.get(request_url, (res) => {
      console.log("Requested URL is: "+request_url);
  const { statusCode } = res;
  const contentType = res.headers['content-type'];
  
  res.setEncoding('utf8');
  let rawData = '';
  res.on('data', (chunk) => { rawData += chunk; });
  res.on('end', () => {
      const parsedData = JSON.parse(rawData);
      console.log(parsedData);
      let Common = "";
      let tags = "No";
      if(args[1] == null){
        args[1] = 1;
      }

      let Entry = parseInt(args[1])-1;

      if(parsedData.data[0] == null){
        message.channel.send("No results found. This word does not exist!");
        return;
      }

      if(Entry >= parsedData.data.length){
        message.channel.send("Invalid entry number. The term you searched has only "+parsedData.data.length+" entries.");
        return;
      }

      if(parsedData.data[0].is_common == true){
        Common = "Yes";
      }
      else{
        Common = "Nope";
      }
      if(!!parsedData.data[Entry] == false){
        message.channel.send("Error: Please only use 1 word terms. Multiple words aren't supported as of today.");
        return;
      }
      if(parsedData.data[Entry].senses[0].tags != ""){
        tags = parsedData.data[Entry].senses[0].tags;
      }

      if(parsedData.data[Entry].japanese[0].word == null){
        parsedData.data[Entry].japanese[0].word = "No Japanese Word";
      }

      const embed = new Discord.RichEmbed()
  .setTitle("You searched: "+keyword)
  .setColor([Math.floor(getRandom(0,255)), Math.floor(getRandom(0,255)), Math.floor(getRandom(0,255))])
  .setFooter("Powered by Jisho.org API", "https://www.easyrock.com.ph/wp-content/uploads/2015/08/EASYROCK-TRAVEL-NIHONGOFT.jpg")
  .setThumbnail("https://pbs.twimg.com/media/ClN86VsWAAERhMj.jpg")
  /*
   * Takes a Date object, defaults to current date.
   */
  .setTimestamp()
  .addBlankField()
  .addField("Japanese Word (Kanji)",
    parsedData.data[Entry].japanese[0].word, true)
  .addField("Japanese Reading",
    parsedData.data[Entry].japanese[0].reading, true)
  .addField("English meaning", parsedData.data[Entry].senses[0].english_definitions, true)
  .addField("Grammar Category", parsedData.data[Entry].senses[0].parts_of_speech, true)
  .addField("Notes", tags, true)
  .addField("Is this a common word?", Common, true)
  .addField("Current Entry", Entry+1+"/"+(parsedData.data.length), true)
  message.channel.send({embed});
}).on('error', (e) => {
  message.channel.send("An error has occurred! But don't worry, it has already been reported to Uniterno.");
  console.error(`Got error: ${e.message}`);
});
})

    
    }
  }



function getRandom(min, max) {
    return rng.integer({min, max});
  }