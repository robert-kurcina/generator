/**
 * Armory.js
 * ============================================================================
 * 2009.06.21 - written by Robert Kurcina
 *
 *
 * INFORMATION
 * ----------------------------
 * Retrieves a weapon object when given the weaponName.  Defaults to 'Pistol'
 * if no name is provided.  The weapon object has the members:
 *
 * 	Armory.getWeapon().label		-	returns the weaponName
 *  Armory.getWeapon().range		-	range in inches for the weapon
 *  Armory.getWeapon().impact		-	Impact rating of the weapon
 *  Armory.getWeapon().target		-	target rating of the weapon
 *
 *
 * ASSUMES
 * ----------------------------
 * Table.js loaded
 * Utilities.js loaded
 *
 *
 * STANDARD METHODS
 * ----------------------------
 * - Armory.getWeapon(n)			-	retrieves a weapon object for weapon n
 *
 *
 * DISCLOSURE METHODS
 * ----------------------------
 * getAllInfo()
 *
**/
var Armory = (function(){
	var weaponsInfo = {
		'Unarmed': { 'label': 'Unarmed', 'range': '-', 'targets': '1', 'impact': 1, 'outgunned': 0 },
		'Fists': { 'label': 'Fists', 'range': '-', 'targets': '1', 'impact': 1, 'outgunned': 0 },
		'Imp 1H weapon': { 'label': 'Imp 1H weapon', 'range': '-', 'targets': '1', 'impact': 1, 'outgunned': 0 },
		'Imp 2H weapon': { 'label': 'Imp 2H weapon', 'range': '-', 'targets': '1', 'impact': 2, 'outgunned': 0 },
		'Edge Weapon': { 'label': 'Edge Weapon', 'range': '-', 'targets': '1', 'impact': 2, 'outgunned': 0 },
		'Assault Rifle': { 'label': 'Assault Rifle', 'range': 48, 'targets': '1 or 3', 'impact': 3, 'outgunned': 3 },
		'BA Pistol': { 'label': 'BA Pistol', 'range': 12, 'targets': '1 or 2', 'impact': 2, 'outgunned': 2 },
		'Bolt Action Rifle': { 'label': 'Bolt Action Rifle', 'range': 12, 'targets': '1', 'impact': 3, 'outgunned': 3 },
		'Flash Bang Grenades': { 'label': 'Flash Bang Grenades', 'range': 6, 'targets': '12\" blast', 'impact': '-', 'outgunned': 5 },
		'Machine Pistol': { 'label': 'Machine Pistol', 'range': 12, 'targets': '3', 'impact': 1, 'outgunned': 3 },
		'Pistol': { 'label': 'Pistol', 'range': 12, 'targets': '1 or 2', 'impact': 1, 'outgunned': 1 },
		'Semi-Automatic Rifle': { 'label': 'Semi-Automatic Rifle', 'range': 48, 'targets': '1 or 2', 'impact': 3, 'outgunned': 3 },
		'Shotgun': { 'label': 'Shotgun', 'range': 12, 'targets': '3', 'impact': 2, 'outgunned': 3 },
		'SAW': { 'label': 'SAW', 'range': 48, 'targets': '4', 'impact': 3, 'outgunned': 4 },
		'Submachine Gun': { 'label': 'Submachine Gun', 'range': 24, 'targets': '3', 'impact': 1, 'outgunned': 3 },
		'Bazooka': { 'label': 'Bazooka', 'range': 48, 'targets': '6\" blast', 'impact': 3, 'outgunned': 5 }
	};
	
	var getInfo = function (givenName){
		var weaponName = givenName || 'Pistol';
	
		return getDisclosureObject(Utilities.lookup(weaponsInfo, weaponName));
	}
	
	var getAllInfo = function (){
		return weaponsInfo;
	}
	
	var getDisclosureObject = function (weaponsInfoObj){
		return {
			'label': weaponsInfoObj.label,
			'range': weaponsInfoObj.range,
			'impact': weaponsInfoObj.impact,
			'targets': weaponsInfoObj.targets,
			'outgunned': weaponsInfoObj.outgunned,
			'toString': function (){ return toString(this); }
		};
	}
	
	var toString = function(disclosureObj){
		var resultStr = "";		
		var label = disclosureObj.label || "Fists";
		var range = disclosureObj.range || '-';
		var impact = disclosureObj.impact || 1;
		var targets = disclosureObj.targets || '1';
		var outgunned = disclosureObj.outgunned || '0';
		
		return Table.getTable( {'table': {
			'label': label,
			'range': range,
			'impact': impact,			
			'targets': targets,
			'outgunned': outgunned
		}});
	}
	
	return {
		getInfo: getInfo,
		getAllInfo: getAllInfo
	}
})();