/**
 * Dice.js
 * ============================================================================
 * 2009.06.21 - written by Robert Kurcina
 *
 *
 * INFORMATION
 * ----------------------------
 * Simulates a dice roller.  The number of dice (n), number of sides on each 
 * die (s), the modifier upon each die rolled (m), and the total adds (a) may
 * be specified. The simplest way to invoke the roll of 2 six-sides dice
 * would be rollDice(2,6).  To roll three six-sided dice and add 5 to the total
 * would be rollDice(2,6,0,5).
 * 
 * Each of the method calls will return a results object that must be access via
 * it's members to acquire the desired output.  Here are the members assuming
 * use of the rollDice() syntax:
 *
 * 	Dice.rollDice().score		-	retrieves the sum of all dice, mods, and adds
 * 	Dice.rollDice().rolls		-	a sorted list of all the raw dice rolls 
 *                                  generated prior to application of dice mods
 * 	Dice.rollDice().scores		-	a sorted list of all the dice rolls with
 *                                  each value after adding dice mods
 *
 * The results object also has function members that will retrieve statistics
 * compared against a given target value for example to count matches or 
 * 'successes' and 'failures':
 * 
 * Dice.rollDice().matches(x)		-	displays number of scores matching (x)
 * Dice.rollDice().less(x)			-	displays number of scores less than (x)
 * Dice.rollDice().greater(x)		-	displays number of scores greater than (x)
 * Dice.rollDice().equalOrLess(x)	-	displays number of scores equal to or less than (x)
 * Dice.rollDice().equalOrGreater(x)-	displays number of scores equal to or greater than (x) 
 *
 * ASSUMES
 * ----------------------------
 * - Utilities.js loaded
 *
 *
 * STANDARD METHODS
 * ----------------------------
 * - rollDie()				-	same as rollDie(6);
 * - rollDice()				-	same as rollDice(2,6);
 *
 * - rollDie(s)				-	generates a value from 1 through s
 * - rollDice(n,s)			-	generates n values of rollDie(s) and returns the sum
 * - rollDice(n,s,a)		-	same as rollDice(n,s) but adds a to total
 * - rollDice(n,s,a,m)		-	same as rollDice(n,s,a) but adds m to each die before returning the sum
 * - rollDice("nDs")		-	same as rollDice(n,s);
 * - rollDice("nDs+a")		-	same as rollDice(n,s,a);
 * - rollDice("nDs:m")		-	same as rollDice(n,s,a,m);
 * - rollDice("nDs+a:m")	-	same as rollDice(n,s,a,m);
 *
 *
 * DISCLOSURE METHODS
 * ----------------------------
 * - resultObj.toString()
 * retrieve a simple formatted string.  Assuming use of the rollDice() syntax:
 * 
 * EXAMPLE:
 *	var resultObj = Dice.rollDice();
 * 	var outputStr = resultObj.toString();
 *
 * 	alert(outputStr);
 *
 *
 * - resultObj.compare()
 * The result object has "compare" method that expects a match value otherwise
 * it will assume a given value of Math.floor(1 + number of sides + mods)/2.  This method provides a formatted
 * string showing the statistics collected against the match value.
 *
 * 
 * EXAMPLE:
 * 	var resultObj = Dice.rollDice(10,6);
 *	var outputStr = resultObj.compare(3);
 *
 *	alert(outputStr);
 *
**/
var Dice = (function(){	
	var rollDie = function (givenSides){
		var numSides = givenSides || 6;	
		var dieRoll = rollSingleDie(numSides);
		var total = dieRoll;
		var rolls = new Array(dieRoll);
		var scores = new Array(dieRoll);
		var numDice = 1;
		var numAdds = 0;
		var numMods = 0;
		
		return getDisclosureObj(total, new Array(dieRoll), new Array(dieRoll), numDice, numSides, numAdds, numMods);
	}

	var rollSingleDie = function (numSides){	
		return Math.floor(Math.random() * numSides + 1);
	}
	
	var rollDiceSpecification = function (givenDice, givenSides, givenAdds, givenMods){
		var numDice = givenDice || 2;
		var numSides = givenSides || 6;		
		var numAdds = givenAdds || 0;
		var numMods = givenMods || 0;
	
		if (typeof numDice == "number"){ return rollDiceSet(numDice, numSides, numAdds, numMods, 1); }
		else { return rollDiceType(numDice.toUpperCase()); }
	}
	
	var rollDiceSet = function (numDice, numSides, numAdds, numMods, multiplier){
		var total = 0;
		var scores = [];
		var rolls = [];

		for (var i = 0; i < numDice; i++){
			var dieRoll = rollSingleDie(numSides);
			var dieScore = Math.floor(dieRoll * multiplier);

			if (numMods){ dieScore += numMods; }
			
			scores.push(dieScore);
			rolls.push(dieRoll);
		
			total += dieScore;
		}
		
		if (numAdds){ total += numAdds; }
		
		return getDisclosureObj(total, scores, rolls, numDice, numSides, numAdds, numMods);
	}
	
	var rollDiceType = function (diceType){
		var numDice = 0;
		var numSides = 0;
		var numAdds = 0;
		var numMods = 0;
		var multiplier = 1;	
		var base = diceType;
		
		if (diceType.indexOf(":") != -1){
			var numMods = 1 * diceType.split(":")[1] || 0;
			
			base = diceType.split(":")[0];
			diceType = base;			
		}
		
		if (diceType.indexOf("+") != -1){
			var numAdds = 1 * diceType.split("+")[1] || 0;
			
			base = diceType.split("+")[0];
			diceType = base;
		}
		
		if (diceType.indexOf("-") != -1){			
			var numAdds = -1 * diceType.split("-")[1] || 0;
			
			base = diceType.split("-")[0];
			diceType = base;
		}
		
		if (diceType.indexOf("D") != -1){
			var numDice = base.split("D")[0] || 1;
			var numSides = base.split("D")[1] || 6;
		}
		
		if (numDice.indexOf("/") != -1){ 
			var numerator = numDice.split("/")[0] || 1;
			var divisor = numDice.split("/")[1] || 1;
			
			if (divisor <= 0){ divisor = 1; }
			
			multiplier = numerator/divisor;
			numDice = 1;
		}

		if (numSides.indexOf("/") != -1){
			var numerator = numSides.split("/")[0] || 1;
			var divisor = numSides.split("/")[1] || 1;
			
			if (divisor <= 0){ divisor = 1; }
			
			multiplier /= divisor;
			numSides = numerator;
		}
	
		return rollDiceSet(numDice, numSides, numAdds, numMods, multiplier);
	}
	
	var countScores = function (disclosureObj, matchValue){
		var greater = 0;
		var less = 0;
		var matches = 0;
		var equalOrGreater = 0;
		var equalOrLess = 0;
		var scores = disclosureObj.scores;
		
		for (var i = 0; i < scores.length; i++){
			if (scores[i] > matchValue){ greater++; }
			if (scores[i] < matchValue){ less++; }
			if (scores[i] == matchValue){ matches++; }
			if (scores[i] >= matchValue){ equalOrGreater++; }
			if (scores[i] <= matchValue){ equalOrLess++; }
		}
		
		return { 'greater': greater, 'less': less, 'matches': matches, 'equalOrGreater': equalOrGreater, 'equalOrLess': equalOrLess };
	}
	
	var getStatistics = function (disclosureObj, givenValue){
		var outputStr = "";
		var matchValue = givenValue || Math.floor(disclosureObj.sides/2 + disclosureObj.modifier + 1);

		outputStr += "<b>SCORES:</b> " + disclosureObj.scores;
		outputStr += "<br/>number of scores matching '" + matchValue + "' is " + disclosureObj.matches(matchValue);
		outputStr += "<br/>number of scores equal to '" + matchValue + "' or less is " + disclosureObj.equalOrLess(matchValue);
		outputStr += "<br/>number of scores equal to '" + matchValue + "' or greater is " + disclosureObj.equalOrGreater(matchValue);
		outputStr += "<br/>number of less than '" + matchValue + "' is " + disclosureObj.less(matchValue);
		outputStr += "<br/>number of greater than '" + matchValue + "' is " + disclosureObj.greater(matchValue);
		
		return outputStr;
	}
	
	var getDisclosureObj = function (score, scoresArr, rollsArr, numDice, numSides, numAdds, numMods){
		return { 
			'score': score, 
			'scores': function(){ return Utilities.numericSort(scoresArr, false); }(), 
			'rolls': function(){ return Utilities.numericSort(rollsArr, false); }(), 
			'dice': numDice,
			'sides': numSides,
			'modifier': numMods, 
			'adds': numAdds,
			
			'greater': function(x){ return countScores(this, x).greater; },
			'less': function(x){ return countScores(this, x).less; },
			'matches': function(x){ return countScores(this, x).matches; },
			'equalOrGreater': function(x){ return countScores(this, x).equalOrGreater; },
			'equalOrLess': function(x){ return countScores(this, x).equalOrLess; },
			'compare': function(x){ return getStatistics(this, x); },
			'toString': function(){ return toString(this); }
		};
	}

	var toString = function (disclosureObj){		
		var resultStr = "";		
		var numAdds = disclosureObj.adds || "";
		var numMods = disclosureObj.modifier || "";
		var numSides = disclosureObj.sides || "";
		var numDice = disclosureObj.dice || "";
		
		if (numAdds > 0){ numAdds = "+" + numAdds; }
		if (numMods > 0){ numMods = "+" + numMods; }
		
		resultStr += "<b>RESULTS</b> for " + numDice + "D" + numSides;
		if (numAdds && numAdds != 0){ resultStr += numAdds; }
		if (numMods && numMods != 0){ resultStr += ":" + numMods; }
			
		resultStr += "<b-- rolls: " + disclosureObj.rolls;
		if (numMods && numMods != 0){ resultStr += " [ " + numMods + " per die ]"; }
		
		resultStr += "<b-- scores: " + disclosureObj.scores;	
		if (numAdds && numAdds != 0){ resultStr += " [ " + numAdds + " to total ]"; }
		
		resultStr += "<br/><b>SCORE:</b> " + disclosureObj.score;
		
		return resultStr;
	}
	
	return {
		rollDice: rollDiceSpecification,
		rollDie: rollDie,
		toString: toString
	}
})();