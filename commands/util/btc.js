const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const https = require('https');


module.exports = class BTCCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'btc',
            group: 'util',
            guildOnly: true,
            memberName: 'btc',
            description: 'BTC.',
            examples: [''],
            throttling: {
        usages: 3,
        duration: 10
    },
        });
    }

   run(message, args) {

    args = args.toUpperCase();

    let request_url = "https://api.coindesk.com/v1/bpi/currentprice/"+args+".json";

    let value = "ERROR";
      let currency = "ERROR";
      let currency_description = "ERROR";

     https.get(request_url, (res) => {
  const { statusCode } = res;
  const contentType = res.headers['content-type'];

  res.setEncoding('utf8');
  let rawData = '';
  res.on('data', (chunk) => { rawData += chunk; });
  res.on('end', () => {
    try {
      const parsedData = JSON.parse(rawData);
      

      console.log(parsedData);
      console.log(request_url);

      let bpiString = "bpi";
      let valueString = "rate_float";
      let currencyString = "code";
      let currency_descriptionString = "description";

      value = parsedData[bpiString][args][valueString];
      currency = parsedData[bpiString][args][currencyString];
      currency_description = parsedData[bpiString][args][currency_descriptionString];

      console.log(value);


        message.channel.send("Bitcoin price is: **"+value+" "+currency+"** ("+currency_description+").");
    } catch (e) {
      message.channel.send("That currency doesn't exist. Please refer to ISO 4217 on international currency codes. If you're 100% sure it exists but you see this message, it's not supported.")
      //message.channel.send("API couldn't be reached. Error: ```css\n"+e.message+"```");
      console.error(e.message);
    }
  });
}).on('error', (e) => {
   message.channel.send("That currency doesn't exist. Please refer to ISO 4217 on international currency codes. If you're 100% sure it exists but you see this message, it's not supported.")
   //message.channel.send("API couldn't be reached. Error: "+e.message);
  console.error(`Got error: ${e.message}`);
});
}


}

