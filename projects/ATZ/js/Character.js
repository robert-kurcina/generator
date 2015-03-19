/**
 * Character.js
 * ============================================================================
 * 2009.06.22 - written by Robert Kurcina
 *
 *
 * INFORMATION
 * ----------------------------
 * Provides several module wrappers to generate an All-Things-Zombie character
 * of various types.  A character created via this module will returned as an
 * array of character objects which can be aggregated via the Team module and
 * allow printing via the Template module.
 *
 * All characters have a type [ Survivor, Military, Ganger, etc. ] and a list
 * of attributes, notes, and a name.  The disclosure object for type will contain a rep
 * score, quality [ Start, Newbie, etc ], and a weapon name.  The weapon name
 * will be used to retrieve the disclosure object from Weapon module in order
 * to allow the character a weapons line item within the notes member. The attributes
 * will pull from the Attributes module.  Here's a sample details object:
 *
 *	var disclosureObj = {
 *		'name': 'Robert Kurcina',
 *		'type': 'Survivor',
 *		'quality': 'Newbie',
 *		'rep': 5,
 *		'attributes': 'Fast Move', 'Leadership', 'Quick Shot',
 *		'notes': 'Pistol [ range: 5, targets: 2, impact: 1 ]'
 *	};
 *
 *
 * ASSUMES
 * ----------------------------
 * Table.js loaded
 * Dice.js loaded
 * Utilities.js loaded
 * Civilian.js loaded
 * Military.js loaded
 * Ganger.js loaded
 * Police.js loaded
 * Survivor.js loaded
 * Attributes.js loaded
 * Armory.js loaded
 * NameGenerator.js loaded
 *
 * STANDARD METHODS
 * ----------------------------
 * getCharacter()				-	generate a single random character
 * getCharacter(s)				-	generates a character of type "s" such as "Survivor" or "Military"
 * getCharacter(s, r)			-	same as getCharacer(s) but with rep r
 * getCharacterByObject(k)		-	return a character as pre-defined by a value object k
 * getWeaponDetails(a)			-	returns a Table module formatted table for array of weapon names a
 *
 *
 * Value Object
 * ----------------------------
 * For each '?' an attributes will be generated; any other value will be
 * interpreted as a given attributes.  If comma-delimited values are provided for weapon 
 * those will be the sole items that the character possesses.  Anything in notes will
 * otherwise be appended to any weapon information generated.
 *
 *  var valueObj = {
 *   'type': 'Survivor',   
 *   'gender': 'F', //specifying nothing is same as 'M'
 *	 'surname': 'Kurcina',
 *   'rep': 3,
 *   'attributes': '?,?,Leadership', //generates 3 attributes one of which will be 'Leadership'
 *   'weapon': 'Fists, Pistol',
 *   'notes': 'Owns a tank'
 * };
 *
 * 
 * DISCLOSURE METHODS
 * ----------------------------
 * getCharacter().toString()	- outputs a formatted description of the character
 * getAllInfo()
 *
**/
var Character = (function(){
	var typesList = {
		'2': { 'label': 'Police' },
		'3': { 'label': 'Police' },
		'4': { 'label': 'Military' },
		'5': { 'label': 'Military' },
		'6': { 'label': 'Survivor' },
		'7': { 'label': 'Survivor' },
		'8': { 'label': 'Ganger' },
		'9': { 'label': 'Ganger' },
		'10': { 'label': 'Civilian' },
		'11': { 'label': 'Civilian' },
		'12': { 'label': 'Civilian' }
	};
	
	var getCharacter = function (givenType, rep, gender){
		return getSingleCharacter(givenType, rep, gender);
	}
	
	var getCharacterByObject = function (valueObj){
		if (null == valueObj){ return getSingleCharacter(); }
		
		var type = valueObj.type;
		var rep = valueObj.rep;		
		var gender = valueObj.gender;
		var surname = valueObj.surname;
		var attributes = valueObj.attributes;
		var weapons = valueObj.weapon;
		var notes = valueObj.notes;
		
		var typeObj = getCharacter(type, rep);
		var nameObj = getNameObject(gender, surname);
		var attributesObj = getAttributesObject(attributes);
		
		return getDisclosureObject(typeObj, attributesObj, nameObj, weapons, notes);
	}
	
	var getSingleCharacter = function (givenType, rep, gender){
		var typeObj = getTypeObject(givenType, rep);
		var attributesObj;
		var nameObj;

		if (rep == '*'){
			attributesObj = Attributes.getAttributes(2, rep);
		}
		else {
			attributesObj = Attributes.getAttribute(rep);
		}
		
		if (Utilities.firstLetter(gender).toUpperCase() == "F"){ nameObj = NameGenerator.getGirlName(); }
		else { nameObj = NameGenerator.getBoyName(); }
		
		var weapons = typeObj.weapon;
		var weaponsArr = [];

		if (weapons instanceof Array){
			for (var i in weapons){
				var weaponName = weapons[i];
				weaponsArr.push(weaponName);
			}
		}
		else {
			weaponName = weapons;			
			weaponsArr.push(weaponName);
		}
				
		return getDisclosureObject(typeObj, attributesObj, nameObj, weaponsArr);
	}

	var getTypeObject = function (givenType, rep){
		var diceScore = Dice.rollDice().score;
		var characterType = givenType || typesList[diceScore].label;
		var infoObj = Character.getAllInfo();
		var infoList = Utilities.uniques(Table.getLabels(infoObj)).sort();
		
		if (!Utilities.contains(infoList, characterType)){ return Civilian.getCharacter(rep); }
		
		var typeObj = eval(characterType + ".getCharacter('" + rep + "')") || Civilian.getCharacter(rep);
		
		return typeObj;
	}
	
	var getDisclosureObject = function (typeObj, attributesObj, nameObj, weaponsArr, notesStr){
		var type = typeObj.type;
		var fullname = nameObj.fullname;
		var abbrname = getAbbreviatedName(nameObj, type);
		var gender = nameObj.gender;		
		var quality = typeObj.quality;
		var rep = typeObj.rep;
		var attributes = attributesObj.attributes;	
		var weapons = getWeaponDetails(weaponsArr);
		var notes = notesStr || "";
		
		return {
			'fullname': fullname,
			'abbrname': abbrname,
			'gender': gender,
			'type': type,
			'quality': quality,
			'rep': rep,
			'attributes': attributes,
			'weapons': weapons,
			'notes': notes,
			'toString': function (){ return toString(this); }
		}
	}
	
	var getAttributesObject = function (attributes){
		var attributesList = [];		
		var attributesArr = new Array(attributes);
		
		if (attributes){ attributesArr = attributes.split(","); }
		
		attributesArr = Utilities.trim(attributesArr);
		
		for (var i = 0; i < attributesArr.length; i++){
			var item = attributesArr[i];
			var attributes;
			
			if (item == "?"){ 
				attributes = Attributes.getAttribute().attributes; 
			}
			else {
				attributes = item;
			}
			
			attributesList.push(attributes);
		}
		
		return { 'attributes': attributesList.join(", ") }
	}
	
	var getNameObject = function (gender, surname){
		if (gender){
			if (Utilities.firstLetter(gender).toUpperCase() == 'F'){
				nameObj = NameGenerator.getGirlName(surname);
			}
			else {
				nameObj = NameGenerator.getBoyName(surname);
			}
		}
		else {
			var nameObj = NameGenerate.getName(surname);
		}
		
		return nameObj;
	}
	
	var getWeaponDetails = function (weapons){
		var tableObj = {};
		var weaponsArr = (weapons instanceof Array) ? weapons : (weapons.indexOf(",") != -1) ? weapons.split(",") : new Array(weapons);		
		
		for (var i in weaponsArr){
			var weaponName = weaponsArr[i];
			var weaponObj = Armory.getInfo(Utilities.trim(weaponName));
			
			var weaponRange = weaponObj.range;
			var weaponTargets = weaponObj.targets;
			var weaponImpact = weaponObj.impact;
			var weaponOutgunned = weaponObj.outgunned;			
			var rowDefinition;				
			
			if (!weaponRange){
				rowDefinition = { 'weapon': weaponName, 'R': '', 'T': '', 'I': '', 'O': '' };
			}
			else {
				rowDefinition = { 'weapon': weaponName, 'R': weaponRange, 'T': weaponTargets, 'I': weaponImpact, 'O': weaponOutgunned };			
			}
			
			tableObj[i] = rowDefinition;			
		}
		
		var descriptorObj = { 'weapon': 'Weapon Name', 'className': 'small', 'headClasses': { 'weapon': 'left-150', 'T': 'center-80', 'default': 'center-20'}, 'bodyClasses': { 'weapon': 'left-150', 'T': 'center-80', 'default': 'center-20'}}
		
		return Table.getTable(tableObj, descriptorObj);
	}
	
	var getAbbreviatedName = function (nameObj, type){
		var abbrname = nameObj.firstname;

		if (type == 'Military'){ abbrname = nameObj.firstlastdot; }
		else if (type == 'Police'){ abbrname = nameObj.firstdotlast; }
		else { abbrname = nameObj.firstlastdot; }

		return abbrname;
	}
	
	var toString = function(disclosureObj){
		var resultStr = "";		
		var fullname = disclosureObj.fullname;
		var abbrname = disclosureObj.abbrname;
		var gender = disclosureObj.gender;
		var type = disclosureObj.type;
		var quality = disclosureObj.quality;
		var rep = disclosureObj.rep;
		var attributes = disclosureObj.attributes;
		var weapons = disclosureObj.weapons;
		var notes = disclosureObj.notes || "";	

		return Table.getTable( {'table': {
			'fullname': fullname,
			'abbrname': abbrname,
			'gender': gender,
			'type': type,			
			'rep': rep,
			'attributes': attributes,
			'weapons': weapons,
			'notes': notes
		}});
	}
		
	var getAllInfo = function (){
		return typesList;	
	}
	
	return {
		getCharacter: getCharacter,
		getCharacterByObject: getCharacterByObject,
		getWeaponDetails: getWeaponDetails,
		getAllInfo: getAllInfo
	}
})();