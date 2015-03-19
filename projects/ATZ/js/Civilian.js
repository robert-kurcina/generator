/**
 * Civilian.js
 * ============================================================================
 * 2009.06.21 - written by Robert Kurcina
 *
 *
 * INFORMATION
 * ----------------------------
 * Generates a Civilian character with a given weapon, quality label, and associated rep.
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
var Civilian = (function(){
	var CLASS_NAME = "Civilian";
	
	var qualityList = {
		'*': { 'label': 'Star', 'rep': 5 },
		'2': { 'label': 'Ex-military', 'rep': 5 },
		'3': { 'label': 'Ex-military', 'rep': 5 },
		'4': { 'label': 'Experienced', 'rep': 4 },
		'5': { 'label': 'Experienced', 'rep': 4 },
		'6': { 'label': 'Experienced', 'rep': 4 },
		'7': { 'label': 'Average', 'rep': 3 },
		'8': { 'label': 'Average', 'rep': 3 },
		'9': { 'label': 'Average', 'rep': 3 },
		'10': { 'label': 'Liability', 'rep': 2 },
		'11': { 'label': 'Liability', 'rep': 2 },
		'12': { 'label': 'Liability', 'rep': 2 }
	};
	
	var weaponsList = {
		'3': { 'label': 'Unarmed' },
		'4': { 'label': function(){ return Dice.rollDie().score <= 2 ? "Imp 1H weapon" : "Imp 2H weapon"; }()},
		'5': { 'label': 'Pistol' },
		'6': { 'label': function(){ return Dice.rollDie().score <= 4 ? "Pistol" : "BA Pistol"; }()},
		'7': { 'label': 'Shotgun'},
		'8': { 'label': function(){ return Dice.rollDie().score <= 2 ? "Shotgun" : "Submachine Gun"; }()},
		'9': { 'label': 'Bolt Action Rifle' },
		'10': { 'label': 'Semi-automatic Rifle' },
		'11': { 'label': 'Assault Rifle' },
		'12': { 'label': 'Assault Rifle' }	
	};
	
	var getQuality = function (givenRep, modifier){
		return getQualityObject(givenRep, modifier).label || 'Liability';
	}
	
	var getWeapon = function (givenRep){
		return getWeaponObject(givenRep).label || 'Pistol';
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