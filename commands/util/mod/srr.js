module.exports = {
	ScoutRarityResults: function(Type, RandomScoutRarity){
		
		if(Type == "10+1" || Type == "R"){
			// This is a normal scouting
			if(RandomScoutRarity <= 80){ // 80
   				 ScoutRarity = "R";
  			} else if(RandomScoutRarity >= 81 && RandomScoutRarity <= 95){ // 81 - 95
    			 ScoutRarity = "SR";
  			} else if(RandomScoutRarity >= 96 && RandomScoutRarity <= 99){ // 96 - 99
    			 ScoutRarity = "SSR";
  			} else if(RandomScoutRarity >= 100){
    			 ScoutRarity = "UR";
  			}
  		}

 		if(Type == "BT"){
 			if(RandomScoutRarity <= 80){
   			 ScoutRarity = "SR";
  			} else if(RandomScoutRarity >= 81){
    		 ScoutRarity = "UR";
 			}
 		}
 			

 		if(Type == "SSR+"){
 			if(RandomScoutRarity <= 80){
   			 ScoutRarity = "SSR";
  			} else if(RandomScoutRarity >= 81){
    		 ScoutRarity = "UR";
  			}
 		}

 		if(Type == "UR"){
 			ScoutRarity = "UR";
 		}

 		return ScoutRarity;
 			

	}
}
