/**
 * Police.js
 * ============================================================================
 * 2009.06.21 - written by Robert Kurcina
 *
 *
 * INFORMATION
 * ----------------------------
 * Generates a Police character with a given weapon, quality label, and associated rep.
 *
 *
 * ASSUMES
 * ----------------------------
 * Table.js loaded
 * Dice.js loaded
 *
 *
 * STANDARD METHODS
 * ----------------------------
 * getQuality()						- 	get character of random quality
 * getQuality(r)					- 	get character of rep r; '*' is also valid
 * getQuality(r,m)					- 	get character of random quality using die modifier m with rep r; usually r should be null
 * getWeapon()						-	get weapon for this type of character, assumes rep 3 as die modifier
 * getWeapon(r)						-	get weapon for this type of character with rep r as die modifier
 * getCharacter(r,m)				-	same as getQuality(q,m) and getWeapon() using rep retrieves from getQuality
 *
 *
 * DISCLOSURE METHODS
 * ----------------------------
 * getQualityInfo()
 * getArmoryInfo()
 *
**/
var Police = (function(){
	var CLASS_NAME = "Police";
	
	var qualityList = {
		'*': { 'label': 'Star', 'rep': 5 },
		'2': { 'label': 'SWAT', 'rep': 5 },
		'3': { 'label': 'SWAT', 'rep': 5 },
		'4': { 'label': 'Detective', 'rep': 5 },
		'5': { 'label': 'Veteran', 'rep': 5 },
		'6': { 'label': 'Officer', 'rep': 4 },
		'7': { 'label': 'Officer', 'rep': 4 },
		'8': { 'label': 'Officer', 'rep': 4 },
		'9': { 'label': 'Officer', 'rep': 4 },
		'10': { 'label': 'Rookie', 'rep': 3 },
		'11': { 'label': 'Rookie', 'rep': 3 },
		'12': { 'label': 'Rookie', 'rep': 3 }
	};
		
	var weaponsList = {
		'Star': { 'label': function(){ return Dice.rollDie().score <= 5 ? ["BA Pistol", "Assault Rifle"] : ["BA Pistol", "Shotgun"]; }()},
		'SWAT': { 'label': function(){ return Dice.rollDie().score <= 5 ? "BA Pistol" : ["BA Pistol", "Assault Rifle"]; }()},
		'Detective': { 'label': function(){ return Dice.rollDie().score <= 5 ? "BA Pistol" : ["BA Pistol", "Shotgun"]; }()},
		'Veteran': { 'label': function(){ return Dice.rollDie().score <= 5 ? "BA Pistol" : ["BA Pistol", "Shotgun"]; }()},
		'Officer': { 'label': function(){ return Dice.rollDie().score <= 5 ? "BA Pistol" : ["BA Pistol", "Shotgun"]; }()},
		'Rookie': { 'label': function(){ return Dice.rollDie().score <= 5 ? "BA Pistol" : ["BA Pistol", "Shotgun"]; }()}
	};
	
	var getQuality = function (givenRep, modifier){
		return getQualityObject(givenRep, modifier).label || 'Rookie';
	}
	
	var getWeapon = function (givenRep){
		return getWeaponObject(givenRep).label || 'BA Pistol ';
	}
	
	var getQualityObject = function (givenRep, modifier){
		if (givenRep == "*"){ return qualityList["*"]; }
	
		var diceScore;
		var qualityObj;
		var count = 0;
		var match = false;
		
		while (!match){
			count++;
			diceScore = Dice.rollDice().score;
			
			if (modifier){ diceScore += 1*modifier; }	
			if (diceScore < 2){ diceScore = 2; }
			if (diceScore > 12){ diceScore = 12; }
			
			qualityObj = qualityList[diceScore];
			
			if (null == givenRep || !givenRep || givenRep == "" || givenRep < 1){ match == true; }
			if (givenRep == qualityObj.rep){ match = true; }
			if (count > 100){ match = true; }
		}
		
		return qualityObj;
	}
	
	var getWeaponObject = function (givenRep){
		var rep = givenRep || 3;
		var qualtiy = getQualityObject(givenRep).label || 'Rookie';
		
		return weaponsList[qualtiy];
	}	
	
	var getCharacter = function (givenRep, modifier){
		var qualityObj = getQualityObject(givenRep, modifier);
		var weaponObj = getWeaponObject(qualityObj.rep);

		return getDisclosureObject(qualityObj, weaponObj);
	}
	
	var getDisclosureObject = function (qualityObj, weaponObj){
		return {
			'quality': qualityObj.label,
			'rep': qualityObj.rep,
			'type': CLASS_NAME,
			'weapon': weaponObj.label,
			'toString': function (){ return toString(this); }
		};
	}
	
	var toString = function (disclosureObj){
		var resultStr = "";
		var type = CLASS_NAME;		
		var quality = disclosureObj.quality || "";
		var rep = disclosureObj.rep || "";
		var weapon = disclosureObj.weapon || "";
		
		return Table.getTable( {'table': {
			'type': type,
			'quality': quality,
			'rep': rep,			
			'weapon': weapon
		}});
	}
	
	var getQualityInfo = function (){
		return qualityList;
	}
	
	var getArmoryInfo = function (){
		return weaponsList;
	}	
	
	return {
		getQuality: getQuality,
		getWeapon: getWeapon,
		getCharacter: getCharacter,
		getQualityInfo: getQualityInfo,
		getArmoryInfo: getArmoryInfo
	}
})();