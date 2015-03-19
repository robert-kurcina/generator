/**
 * SuburbanSetting.js
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
var SuburbanSetting = (function(){
	var vehiclesList = {
		'2': { 'label': 'Big Rig' },
		'3': { 'label': 'Big Rig' },
		'4': { 'label': 'Bus' },
		'5': { 'label': 'Motorcycle' },
		'6': { 'label': 'Pickup Truck' },
		'7': { 'label': 'RV' },
		'8': { 'label': 'RV' },
		'9': { 'label': 'Sedan' },
		'10': { 'label': 'Sports Car' },
		'11': { 'label': 'SUV' },
		'12': { 'label': 'SUV' }
	};
	
	var buildingsList = {
		'2':  { 'label': 'Military Base' },
		'3':  { 'label': 'Retail "Box" Store' },
		'4':  { 'label': 'Gas Station' },
		'5':  { 'label': 'Warehouse' },
		'6':  { 'label': function(){ return Dice.rollDie().score <= 3 ? "House" : "Church"; }() },
		'7':  { 'label': function(){ return Dice.rollDie().score <= 3 ? "House" : "Retail Store"; }() },
		'8':  { 'label': function(){ return Dice.rollDie().score <= 3 ? "House" : "Clinic"; }() },
		'9':  { 'label': 'Restaurant' },
		'10': { 'label': 'Supermarket' },
		'11': { 'label': 'Warehouse' },
		'12': { 'label': function(){ return Dice.rollDie().score <= 3 ? "Police Station" : "School"; }() }	
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