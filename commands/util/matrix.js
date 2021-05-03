const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const math = require('mathjs');
const rng = require('random-world');


module.exports = class Matrix extends Command {
    constructor(client) {
        super(client, {
            name: 'matrix',
            group: 'util',
            guildOnly: true,
            memberName: 'matrix',
            description: 'matrix',
            throttling: {
        usages: 1,
        duration: 1
    },
        });
    }

  run(message, args){
  
  // Builds a matrix based on requierements. Multiplies it with a random matrix and returns result.
  // Useful for math purposes.


      args = message.content.split(' ').slice(1);
      let n = args[0];
      let m = args[1];
      let k = args[2];
      let maxDenominator = args[3];
      let maxMultiplication = args[4];

      if(isNaN(n) || isNaN(m) || isNaN(k)){
        message.channel.send("Error: ``n = " + n + "``, ``m = " + m + "`` and ``k = " + k + "`` must be integers.");
        return;
      }

      n = Math.round(n);
      m = Math.round(m);
      k = Math.round(k);

      if(k > n || k < 1){
        message.channel.send("Error: ``k = " + k + "`` must not be greater than ``n = " + n + "`` and a positive integer greater than 0.");
        return;
      }

      if(args[3] == undefined){
        maxDenominator = 5;
      }

      if(args[4] == undefined){
        maxMultiplication = 5;
      }

      let Y = [];
      let Matrix = [];
      let kRows = [];

      for(let i = 0; i < k; i++){
        console.log("Loop One. i: " + i + "; k: " + k);
        kRows.push(getRandom(-1, m - 1));
        if(i != 0){
          while(kRows[i] == kRows[i - 1]){
            console.log("Loop While. i: " + i + "; kRows[i]: " + kRows[i] + "; kRows[i - 1]: " + kRows[i - 1]);
            kRows[i] = getRandom(-1, m - 1);
          }
        }
      }

      console.log("kRows: " + kRows);

      let aux = 0;
      let selectedN = 0;
      for(let i = 0; i < m; i++){
        Y = [];
        for(let i = 0; i < n; i++){
           console.log("Loop Two. i: " + i + "; n: " + n);
          if(i == kRows[aux] && aux < kRows.length){
            selectedN = getRandom(-1, n - 1);
            Y[selectedN] = 1;
            for(let i = 0; i < n; i++){
              if(i != selectedN){
                Y[i] = 0;
              }
            }
            aux++;
          } else{
            //message.channel.send("Added a new item to Y! kRows is: " + kRows + "\ni is: " + i);
            Y.push(getRandom(-1, maxDenominator));
          }
          //Matrix.push(Y);
        }
        //message.channel.send("Added to push Y to Matrix[" + i + "]; Y: ``` " + Y + "```");
        //Matrix.push([]);
        Matrix.push(Y);
      }
      
        

        let tempRow = 0;
        let tempRow2 = 0;

        //console.log(Matrix[0]);

        for(let a = 0; a < m; a++){
          for(let i = 0; i < n; i++){
            console.log("Matrix[a]: " + Matrix[a]);
            console.log("Matrix[a][i]: " + Matrix[a][i]);
            tempRow = Matrix[a][i] * getRandom(1, maxMultiplication) / getRandom(1, maxMultiplication*2);
            tempRow2 = Matrix[a][i] * getRandom(1, maxMultiplication) / getRandom(1, maxMultiplication*2);
            Matrix[a][i] = tempRow + tempRow2;
            console.log(tempRow);
            console.log(tempRow2);
            console.log(maxMultiplication);
          }
        }

        console.log(Matrix[0]);

      let X = [];

      for(let i = 0; i < n; i++){
        X.push(getRandom(getRandom(0, 15) / getRandom(1, 15), getRandom(0, 15)*getRandom(1, 3) / getRandom(0, 15)*getRandom(1, 3)));
      }

      message.channel.send("[DEBUG] Array Matrix: " + Matrix);
       message.channel.send("[DEBUG] Array X: " + X);
      let MatrixA = math.matrix(Matrix); 
      message.channel.send("[DEBUG] Matrix A: " + MatrixA);
      let MatrixX = math.matrix(X);
      message.channel.send("[DEBUG] Matrix X: " + MatrixX);
      let MatrixB = math.multiply(MatrixA, MatrixX);
       message.channel.send("[DEBUG] Matrix B: " + MatrixB);

      //message.channel.send(MatrixB);

      }
  }

function getRandom(min, max) {
    return rng.integer({min, max});
}
