/**
 * UrbanSetting.js
 * ============================================================================
 * 2009.07.02 - written by Robert Kurcina
 *
 * INFORMATION
 * ----------------------------
 * Generates a vehicles and buildings recommendations for Urban settings.
 *
 *
 * ASSUMES
 * ----------------------------
 * Dice.js loaded
 * Table.js loaded
 * Utilities.js loaded
 *
 *
 * STANDARD METHODS
 * ----------------------------
 *
 *
 * DISCLOSURE METHODS
 * ----------------------------
 * generate()
 *
**/
var UrbanSetting = (function(){
	var vehiclesList = {
		'2': { 'label': 'Big Rig' },
		'3': { 'label': 'Big Rig' },
		'4': { 'label': 'Bus' },
		'5': { 'label': 'Motorcycle' },
		'6': { 'label': 'Pickup Truck' },
		'7': { 'label': 'Sedan' },
		'8': { 'label': 'Sedan' },
		'9': { 'label': 'Sports Car' },
		'10': { 'label': 'SUV' },
		'11': { 'label': 'Sedan' },
		'12': { 'label': 'Sedan' }
	};
	
	var buildingsList = {
		'2':  { 'label': 'Church' },
		'3':  { 'label': 'Hospital' },
		'4':  { 'label': 'Police Station' },
		'5':  { 'label': 'Gas Station' },
		'6':  { 'label': function(){ return Dice.rollDie().score <= 3 ? "Warehouse" : "Restaurant"; }() },
		'7':  { 'label': 'Apartments' },
		'8':  { 'label': function(){ return Dice.rollDie().score <= 3 ? "Apartments" : "Office Building"; }() },
		'9':  { 'label': 'Retail Store' },
		'10': { 'label': 'Supermarket' },
		'11': { 'label': 'School' },
		'12': { 'label': 'Shipyard' }	
	};
	
	var generate = function (vehiclesStr, buildingsStr){
		var vehiclesScore = Dice.rollDice(vehiclesStr).score; 
		var buildingsScore = Dice.rollDice(buildingsStr).score;
		var vehiclesResult = Utilities.enumerate(vehiclesScore, vehiclesList, "2D6");
		var buildingsResult = Utilities.enumerate(buildingsScore, buildingsList, "2D6");
		
		return getDisclosureObject(vehiclesResult, buildingsResult);
	}
		
	var getDisclosureObject = function (vehiclesStr, buildingsStr){
		return {
			'vehicles': vehiclesStr,
			'buildings': buildingsStr,
			'toString': function (){ return toString(this); }
		};
	}
	
	var toString = function(disclosureObj){
		var resultStr = "";
			
		var vehicles = disclosureObj.vehicles;
		var buildings = disclosureObj.buildings;
		
		return Table.getTable( {'table': {
			'vehicles': vehiclesStr.join("<br/>"),
			'buildings': buildingsStr.join("<br/>")
		}});
	}
	
	return {
		generate: generate
	}
})();