/**
 * RuralSetting.js
 * ============================================================================
 * 2009.07.02 - written by Robert Kurcina
 *
 * INFORMATION
 * ----------------------------
 * Generates a vehicles and buildings recommendations for Suburban settings.
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
var RuralSetting = (function(){
	var vehiclesList = {
		'2': { 'label': 'ATV' },
		'3': { 'label': 'Big Rig' },
		'4': { 'label': 'Bus' },
		'5': { 'label': 'Motorcycle' },
		'6': { 'label': 'Pickup Truck' },
		'7': { 'label': 'RV' },
		'8': { 'label': 'RV' },
		'9': { 'label': 'Sedan' },
		'10': { 'label': 'SUV' },
		'11': { 'label': 'Pickup Truck' },
		'12': { 'label': 'Pickup Truck' }
	};
	
	var buildingsList = {
		'2':  { 'label': function(){ return Dice.rollDie().score <= 3 ? "Military Base" : "Clinic"; }() },
		'3':  { 'label': 'Supermarket' },
		'4':  { 'label': 'Gas Station' },
		'5':  { 'label': 'House' },
		'6':  { 'label': 'House' },
		'7':  { 'label': 'House' },
		'8':  { 'label': function(){ return Dice.rollDie().score <= 3 ? "House" : "Church"; }() },
		'9':  { 'label': 'Retail Store' },
		'10': { 'label': 'Supermarket' },
		'11': { 'label': 'Restaurant' },
		'12': { 'label': function(){ return Dice.rollDie().score <= 3 ? "School" : "Supermarket"; }() }
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