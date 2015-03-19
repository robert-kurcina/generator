/**
 * Scenario.js
 * ============================================================================
 * 2009.07.02 - written by Robert Kurcina
 *
 * INFORMATION
 * ----------------------------
 * Generates a basic scenario
 *
 *
 * ASSUMES
 * ----------------------------
 * UrbanSetting.js loaded
 * SuburbanSetting.js loaded
 * RuralSetting.js loaded
 * Dice.js loaded
 * Table.js loaded
 * Utilities.js loaded
 *
 *
 * STANDARD METHODS
 * ----------------------------
 * generate()					-	generates a scenario with a random settings, timeofday, and recommended vehicles and buildings list
 * generate(a)					-	same as above, but specifies location area a
 * generate(a, t)				-	same as above, but also specifies time of day t
 *
 *
 * DISCLOSURE METHODS
 * ----------------------------
 * getAreaList()
 *
**/
var Scenario = (function(){
	var typeList = {
		'1': { 'label': 'Discover', 'buildings': 'as Area' },
		'2': { 'label': 'Discover', 'buildings': 'as Area' },
		'3': { 'label': 'Discover', 'buildings': 'as Area' },
		'4': { 'label': 'Raid', 'buildings': '1D6+2' },
		'5': { 'label': 'Raid', 'buildings': '1D6+2' },
		'6': { 'label': 'Take Back', 'buildings': 'as Area' }
	};
	
	var areaList = {
		'2': { 'label': 'Urban', 'vehicles': '1D6+6', 'density': 0.75, 'buildings': '1D6+5', 'woods': [0.25], 'hills': [0.10], 'road': '4-lane intersection' },
		'3': { 'label': 'Urban', 'vehicles': '1D6+6', 'density': 0.75, 'buildings': '1D6+5', 'woods': [0.25], 'hills': [0.10], 'road': '4-lane intersection' },
		'4': { 'label': 'Urban', 'vehicles': '1D6+6', 'density': 0.75, 'buildings': '1D6+5', 'woods': [0.25], 'hills': [0.10], 'road': '4-lane intersection' },
		'5': { 'label': 'Urban', 'vehicles': '1D6+6', 'density': 0.75, 'buildings': '1D6+5', 'woods': [0.25], 'hills': [0.10], 'road': '4-lane intersection' },
		'6': { 'label': 'Urban', 'vehicles': '1D6+6', 'density': 0.75, 'buildings': '1D6+5', 'woods': [0.25], 'hills': [0.10], 'road': '4-lane intersection' },
		'7': { 'label': 'Urban', 'vehicles': '1D6+6', 'density': 0.75, 'buildings': '1D6+5', 'woods': [0.25], 'hills': [0.10], 'road': '4-lane intersection' },
		'8': { 'label': 'Suburban', 'vehicles': '1D6+1', 'density': 0.50, 'buildings': '1D6', 'woods': [0.25, 0.10], 'hills': [0.25], 'road': '4-lane full-length' },
		'9': { 'label': 'Suburban', 'vehicles': '1D6+1', 'density': 0.50, 'buildings': '1D6', 'woods': [0.25, 0.10], 'hills': [0.25], 'road': '4-lane full-length' },
		'10': { 'label': 'Rural', 'vehicles': '1/2D6', 'density': 0.25, 'buildings': '1/2D6', 'woods': [0.50, 0.33, 0.10], 'hills': [0.33, 0.25], 'road': '2-lane full-length' },
		'11': { 'label': 'Rural', 'vehicles': '1/2D6', 'density': 0.25, 'buildings': '1/2D6', 'woods': [0.50, 0.33, 0.10], 'hills': [0.33, 0.25], 'road': '2-lane full-length' },
		'12': { 'label': 'Rural', 'vehicles': '1/2D6', 'density': 0.25, 'buildings': '1/2D6', 'woods': [0.50, 0.33, 0.10], 'hills': [0.33, 0.25], 'road': '2-lane cul-de-sac' }		
	};
	
	var timeOfDayList = {
		'1': { 'label': 'Daytime', 'startHH': 6, 'range': 12 },
		'2': { 'label': 'Daytime', 'startHH': 6, 'range': 12 },
		'3': { 'label': 'Daytime', 'startHH': 6, 'range': 12 },
		'4': { 'label': 'Pre-Dawn', 'startHH': 3, 'range': 3 },
		'5': { 'label': 'Evening', 'startHH': 19, 'range': 3 },
		'6': { 'label': 'Night-time', 'startHH': 21, 'range': 6 },
	};
	
	var descriptorObj = { 'type': 'Type', 'area': 'Area', 'timeofday': 'Time of Day', 'buildings': 'Buildings', 'vehicles': 'Vehicles', 'road': 'Roadway', 'hillsandwoods': 'Terrain'};		
		
	var generate = function (givenArea, givenTimeOfDay){
		var typeObj = getTypeObject();
		var areaObj = getAreaObject(givenArea);
		var timeObj = getTimeOfDayObj(givenTimeOfDay);
					
		return getDisclosureObject(typeObj, areaObj, timeObj);
	}
	
	var getAreaList = function (){
		return areaList;
	}
	
	var getTypeObject = function (){		
		var diceScore = Dice.rollDie().score;
		
		return typeList[diceScore];	
	}
	
	var getAreaObject = function (givenArea){	
		var diceScore = Dice.rollDice().score;
		var infoList = Utilities.uniques(Table.getLabels(areaList)).sort();

		if (!Utilities.contains(infoList, givenArea)){ return areaList[diceScore]; }
		else { return Table.getCellValue(areaList, 'label', null, givenArea); }	
	}
	
	var getTimeOfDayObj = function (givenTimeOfDay){	
		var diceScore = Dice.rollDie().score;
		var infoList = Utilities.uniques(Table.getLabels(timeOfDayList)).sort();
		
		if (!Utilities.contains(infoList, givenTimeOfDay)){ return timeOfDayList[diceScore]; }
		else { return Table.getCellValue(timeOfDayList, 'label', null, givenTimeOfDay); }	
	}
	
	var getCount = function (rangeArr){
		var count = 0; 
		
		for (var i = 0; i < rangeArr.length; i++){
			if (Math.random() < rangeArr[i]){ count++; }	
		}	
		
		return count;
	}
	
	var getHillsAndWoodsText = function (hills, woods){
		var numHills = getCount(hills || [ 0.25 ]);
		var numWoods = getCount(woods || [ 0.25 ]);

		var hillsText = (numHills == 1) ? "There is " + numHills + " hill." : "There are " + numHills + " hills.";
		var woodsText = (numWoods == 1) ? "There is " + numWoods + " woods patch." : "There are " + numWoods + " woods patches.";

		if (numHills == 0){ hillsText = ""; }
		if (numWoods == 0){ woodsText = ""; }
		if (numHills == 0 && numWoods == 0){ hillsText = "There are no woods nor hills."; }

		return hillsText + " " + woodsText;
	}
	
	var getDisclosureObject = function (typeObj, areaObj, timeObj){
		var buildingsDice = (typeObj.buildings == 'as Area') ? areaObj.buildings : typeObj.buildings;
		var vehiclesDice = areaObj.vehicles;
		var woods = areaObj.woods;
		var hills = areaObj.hills;
		var road = areaObj.road;
		var timeofday = timeObj.label;
		var area = areaObj.label;
		var type = typeObj.label;

		var hillsAndWoodsStr = getHillsAndWoodsText(hills, woods);		
		var settingsObj = eval(area + "Setting.generate('" + vehiclesDice + "','" + buildingsDice + "')");	
		var buildingsEnum = settingsObj.buildings;
		var vehiclesEnum = settingsObj.vehicles;

		return {
			'type': type,
			'area': area,
			'timeofday': timeofday,
			'buildings': buildingsEnum,
			'vehicles': vehiclesEnum,
			'road': road,
			'hillsandwoods': hillsAndWoodsStr,
			'toString': function (){ return toString(this); }
		};
	}
	
	var toString = function(disclosureObj){
		return Table.getTable( {'table': {
			'type': disclosureObj.type,
			'area': disclosureObj.area,
			'timeofday': disclosureObj.timeofday,
			'buildings': disclosureObj.buildings.join("<br/>"),
			'vehicles': disclosureObj.vehicles.join("<br/>"),
			'road': disclosureObj.road,
			'hillsandwoods': disclosureObj.hillsandwoods
		}}, descriptorObj);
	}
	
	return {
		generate: generate,
		getAreaList: getAreaList,
		getTimeOfDay: getTimeOfDayObj
	}
})();