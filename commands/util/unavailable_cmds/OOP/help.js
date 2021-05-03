module.exports = {
	help: function(ID){
		let to_return = "ERROR: Couldn't find data for the requested help ID.";
		if(ID == 'Compare'){
			to_return = "Usage: ``!compare <Scorer Score Up> <Score Activation Chance> <Scorer Note Required> <Team Stats> <BeatmapNotes> (<Bonus1.1>) (<Bonus1.21>) (<Flags>)``\n\nAlternatively, use ``!compare (avg/abs) <Average/Absolute> <Team Stats> <BeatmapNotes> (<Bonus1.1>) (<Bonus1.21>)`` to work with Umidah's average data.\n\nWhere Team Stats assumes all members have their SIS equipped, except for the card you're comparing.\n\nBonus1.1 and Bonus1.21 are optional. Check ``!compare tap`` for more information.\n\nUse ``!compare flags`` for more information on flags.";
		} else if(ID == 'Luck'){
			to_return = "Usage: ``!luck <Probability> <Amount>``\n\nAs an example, the probability to get **at least** a UR (1% chance) out of 88 cards (8 10+1 pulls): Probability would be 1 and Amount would be 88.";
		} else if(ID == 'Color'){
			to_return = "Usage: ``!color <Role Name>`` to get a role, if you already have it, will be deleted.\n\nYou can also use ``!color new <Role Name> <Hexadecimal Value>`` to create a custom role. Only 1 word names are allowed. Example: ``!color new PetBot #62FF00``";
		} else if(ID == 'Countdown'){
			to_return = "Usage: ``!cd (<Offset>) (<Range>)``\nBoth values are optional, defaults are 5.\nOffset is the start number of the countdown, in practice the duration of the countdown is the Offset in seconds.\nRange is the number that will define how often the amount of secs left is shown. If the amount left is a multiple of this value, it'll show.";
		}

		return to_return;
	}
}