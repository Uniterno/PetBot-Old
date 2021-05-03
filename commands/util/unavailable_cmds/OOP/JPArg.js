module.exports = {
	JPArg: function(args){
		args = args.split(' ');

		let CurrentValue = 0;
		let LetterByLetter = 0;
		let Value = "";
		let Word = "";
		let FullArg = "";

		while(CurrentValue <= args.length){
			LetterByLetter = args[CurrentValue].length;
			CurrentLetterValue = 0;
			while(CurrentLetterValue <= LetterByLetter.length){
				Value = ConvertLetter(LetterByLetter.charAt(CurrentLetterValue),CurrentLetterValue);
				Word += Value;
				CurrentLetterValue++;
			}
			args[CurrentValue] = Word; // Assign value to current
			Word = ""; // Clean var
			FullArg += args[CurrentValue]+"";
			console.log(FullArg);
		}

		return FullArg;

	},
}



function ConvertLetter(toConvert, Index){
	if(toConvert == "一"){
		return 1;
	} else if(toConvert == "二"){
		return 2;
	} else if(toConvert == "三"){
		return 3;
	} else if(toConvert == "三"){
		return 3;
	} else if(toConvert == "四"){
		return 4;
	} else if(toConvert == "五"){
		return 5;
	} else if(toConvert == "六"){
		return 6;
	} else if(toConvert == "七"){
		return 7;
	} else if(toConvert == "八"){
		return 8;
	} else if(toConvert == "九"){
		return 9;
	} else if(toConvert == "十"){
		if(Index == 0){
			return 10;
		} else{
			return 0;
		}
	} else if(toConvert == "＋"){
		return "+";
	} else{
		return toConvert;
	}
}