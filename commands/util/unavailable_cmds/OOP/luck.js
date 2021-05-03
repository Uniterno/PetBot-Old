module.exports = {
	Luck: function(Probability, Amount){
		//let Result = 100 * (1 - (Math.pow((100-Probability)/100), Amount));
		let Result = 100 * (1 - (Math.pow(1-(Probability/100),Amount)));
		return Result.toFixed(2);
	},

	ColorArray: function(Probability){
		if(Probability <= 5){
			return [255, 0, 0];
		} else if(Probability <= 12.5){
			return [255, 50, 0];
		} else if(Probability <= 22.5){
			return [255, 100, 0];
		} else if(Probability <= 35){
			return [255, 200, 0];
		} else if(Probability <= 45){
			return [255, 255, 0];
		} else if(Probability <= 55){
			return [200, 255, 0];
		} else if(Probability <= 65){
			return [100, 255, 0];
		} else if(Probability <= 75){
			return [0, 255, 0];
		} else if(Probability <= 85){
			return [0, 150, 255];
		} else if(Probability <= 95){
			return [0, 50, 255];
		} else{
			return [0, 0, 255];
		}
	}
}


/* Math based on: 

Actually, the probability is much higher:
3 step-up:
UR: 1 - (.9933) = ~28% of at least one UR
SSR: 1 - (.9633) = ~74% of at least one SSR
Guaranteed at least three SRs.
2 Christmas scouts:
UR: 1 - (.9722) = ~49% of at least one UR
SSR: 1 - (.8820) = ~92% of at least one SSR in addition to your 2 guaranteed: I took away two because at least 2 of the cards must be SSR here.

*/