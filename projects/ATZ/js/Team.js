/**
 * Team.js
 * ============================================================================
 * 2009.06.21 - written by Robert Kurcina
 *
 *
 * INFORMATION
 * ----------------------------
 * Provides module wrappers to generate an All-Things-Zombie team of 
 * various character types.  Generation requests are by definition
 * string, for example: 
 *
 *	5xMilitary, 3xGanger
 *
 * To specify the gender of a request in a value object, append -M, -F, or -? to
 * the end of the type.  To specify a Star, use an asterisk for count:
 *
 *	*xMilitary-F, *xGanger-M, *xPolice-?
 *
 * The above requests a Female Star Military, a Male Star Ganger, and a Star Police
 * of random gender where up to half are female.  Not specifying a gender
 * notation [ as in *xPolice, or 2xSurvivor ] generates solely males.
 *
 *
 * ASSUMES
 * ----------------------------
 * Dice.js is loaded
 * Character.js is loaded
 *
 *
 * STANDARD METHODS
 * ----------------------------
 * getTeam()					-	generate a single random character
 * getTeam(n)					-	generate n random characters
 * getTeamByDefinition(defStr)	-	generate a team given a definition string such as "5xMilitary, 3xGanger"
 *
 *
 * DISCLOSURE METHODS
 * ----------------------------
 *
**/
var Team = (function(){
	var getTeam = function (definitionStr){
		if (null == definitionStr){ return getSingleTeam(); }
		if (Utilities.isNumeric(definitionStr)){ return getRandomCharacters(definitionStr); }
	
		var rosterArr = [];
		var cleanedStr = Utilities.clean(definitionStr);
		var parts = cleanedStr.split(",");

		for (var i = 0; i < parts.length; i++){
			var item = parts[i];
			var characterType = "Civilian";
			var numCharacters = 0;
			var gender = "M";
			var rep = null;

			if (item.indexOf("x") != -1){
				characterType = item.split("x")[1] || "Civilian";
				numCharacters = item.split("x")[0] || 1;
			}
			else {
				if (Utilities.isNumeric(item)){
					characterType = null;
					numCharacters = item;
				}
				else {
					characterType = item;
					numCharacters = 1;
				}
			}

			if (null != characterType && characterType.indexOf('-') != -1){
				gender = characterType.split('-')[1];
				characterType = characterType.split('-')[0];	
			}
			
			if (!Utilities.isNumeric(numCharacters) && numCharacters.indexOf('*') != -1){
				rep = "*";
				numCharacters = 1;
			}
			
			var requiredGender = gender;
			
			for (var j = 0; j < numCharacters; j++){
				if (gender == "?"){ 
					requiredGender = (Dice.rollDie(4).score < 3) ? "F" : "M";
				}

				var characterObj = Character.getCharacter(characterType, rep, requiredGender);

				rosterArr.push(characterObj);
			}
		}
		
		return cardSort(rosterArr);
	}

	var getSingleTeam = function (givenCount){
		if (null == givenCount){ return Character.getCharacter(); }
		else { return getRandomCharacters(givenCount); }
	}
	
	var getRandomCharacters = function (givenCount){
		var numCharacters = 1 * givenCount || 1;
		var rosterArr = [];
		
		for (var i = 0; i < numCharacters; i++){
			var diceScore = Dice.rollDice().score;
			var characterObj = Character.getCharacter();
			
			rosterArr.push(characterObj);
		}
		
		return cardSort(rosterArr);
	}
	
	var cardSort = function (givenArray, bAscending){
		var descending = function (a, b){ if (b.type == a.type){ return b.rep < a.rep; } else { return (b.type < a.type); }} 
		var ascending = function (a, b){ if (b.type == a.type){ return a.rep < b.rep; } else { return (b.type < a.type); }} 
		
		if (bAscending){ return givenArray.sort( ascending ); }
		else { return givenArray.sort( descending ); }
	}
		
	return {
		getTeam: getTeam
	}
})();