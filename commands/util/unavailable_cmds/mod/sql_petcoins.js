const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "Uniterno",
  password: "Uniterno",
  database: "PetDB"
});


module.exports = {
	DeleteByCost: function(Type, Range, message){

    if(Type == "10+1" || Type == "Normal"){ // If it's a normal (not BT, SSR or UR) scout
      con.connect(function(err) {
  if (err) throw err;
  con.query("SELECT PetCoins FROM Users WHERE DiscordID = "+mysql.escape(message.author.id), function (err, result, fields) {
    if (err) throw err;
    let PetCoins = result[0].PetCoins;
    let RestPetCoins = 0;

    if(Type == "10+1" || Range == "10+1"){ // If it's 10+1 remove 2500
      RestPetCoins = 2500;
    } else{ // If it's a solo
      RestPetCoins = 500;
    }
    if(PetCoins - RestPetCoins < 0){ // If you don't have enough PetCoins
      let Cost = "Not enough";
      console.log("Cost defined as Not enough");
      return Cost;
    } else{ // If you do
    con.query("UPDATE Users SET PetCoins = "+mysql.escape(PetCoins-RestPetCoins)+" WHERE DiscordID = "+mysql.escape(message.author.id), function (err, result, fields) {
    if (err) throw err;
    let Cost = RestPetCoins;
    console.log("Cost defined as "+RestPetCoins);
    return Cost;

          });
        }});	
      });
    }
   /* if(Cost == "Not enough"){
    message.channel.send("Not enough PetCoins!");
    return;
  } */
  /*message.channel.send(Cost+" PetCoins were removed from your inventory to perform this action.");*/

    /*return new Promise(function(resolve, reject) {
      resolve(toReturn);
    });*/
  }


  }