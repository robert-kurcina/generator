/**
 * Military.js
 * ============================================================================
 * 2009.06.21 - written by Robert Kurcina
 *
 *
 * INFORMATION
 * ----------------------------
 * Generates a Military character with a given weapon, quality label, and associated rep.
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
var Military = (function(){
	var CLASS_NAME = "Military";
	
	var qualityList = {
		'*': { 'label': 'Star', 'rep': 5 },
		'2': { 'label': 'Team Leader', 'rep': 5 },
		'3': { 'label': 'Team Leader', 'rep': 5 },
		'4': { 'label': 'Veteran', 'rep': 5 },
		'5': { 'label': 'Veteran', 'rep': 5 },
		'6': { 'label': 'Soldier', 'rep': 4 },
		'7': { 'label': 'Soldier', 'rep': 4 },
		'8': { 'label': 'Soldier', 'rep': 4 },
		'9': { 'label': 'Soldier', 'rep': 4 },
		'10': { 'label': 'Recruit', 'rep': 3 },
		'11': { 'label': 'Recruit', 'rep': 3 },
		'12': { 'label': 'Recruit', 'rep': 3 }
	};
	
	var weaponsList = {
		'3': { 'label': ["Semi-Automatic Rifle", "Flash Bang Grenades"] },
		'4': { 'label': ["Semi-Automatic Rifle", "Flash Bang Grenades"] },
		'5': { 'label': ["Semi-Automatic Rifle", "Flash Bang Grenades"] },
		'6': { 'label': ["Semi-Automatic Rifle", "Flash Bang Grenades"] },
		'7': { 'label': ["Semi-Automatic Rifle", "Flash Bang Grenades"] },
		'8': { 'label': ["Semi-Automatic Rifle", "Flash Bang Grenades"] },
		'9': { 'label': ["Semi-Automatic Rifle", "Flash Bang Grenades"] },
		'10': { 'label': ["Semi-Automatic Rifle", "Flash Bang Grenades"] },
		'11': { 'label': ["Semi-Automatic Rifle", "Flash Bang Grenades"] },
		'12': { 'label': ["Semi-Automatic Rifle", "Flash Bang Grenades"] }																						
	};
	
	var getQuality = function (givenRep, modifier){
		return getQualityObject(givenRep, modifier).label || 'Recruit';
	}
	
	var getWeapon = function (givenRep){
		return getWeaponObject(givenRep).label || 'Automatic Rifle';
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
		var diceScore = Dice.rollDie().score + rep;
		
		if (diceScore < 3){ diceScore = 3; }
		if (diceScore > 12){ diceScore = 12; }
		
		return weaponsList[diceScore];
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