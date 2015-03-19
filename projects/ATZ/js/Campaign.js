/**
 * Campaign.js
 * ============================================================================
 * 2009.07.03 - written by Robert Kurcina
 *
 *
 * INFORMATION
 * ----------------------------
 * A wrapper for Scenario.js.  Accepts values for number of scenarios to play,
 * across a number of days starting with a given date taking place with a given
 * common area.
 *
 * The campaign start date defaults to 2010-02-05 and must be in a similar format
 *
 *
 * ASSUMES
 * ----------------------------
 * jquery.js loaded
 * jquery.ui.all.js loaded
 * DateFormatter.js loaded
 * Scenario.js loaded
 *
 *
 * STANDARD METHODS
 * ----------------------------
 * generate(n, c, a, d, l, id)		-	number of scenarios n, for campaign name c, in common area a, starting on date d, for l days, output to id
 *
 *
 * DISCLOSURE METHODS
 * ----------------------------
 *
**/
Campaign = (function(){
	var DEFAULT_START_DATE = "2010-02-05";
	var ENCOUNTERS_BY_AREA = {
		'Urban': 4,
		'Suburban': 2,
		'Rural': 1
	};
	
	var BACKDROP_FILES = {
		'Urban': '../img/scenarios/atz.urban.png',
		'Suburban': '../img/scenarios/atz.suburban.png',
		'Rural': '../img/scenarios/atz.rural.png'
	};
	
	var RANDOM_AREA_SELECTION = [ 'Urban','Urban','Urban','Suburban','Suburban','Suburban','Suburban','Suburban','Rural','Rural' ];		
	var generate = function (numScenarios, campaignName, commonArea, startDate, campaignDuration, outputAreaID) {
		var firstDayOfCampaign = startDate || DEFAULT_START_DATE;
		var campaignDates = [];
		var timeOfDayObj = Scenario.getTimeOfDay();
		var parts = startDate.split("-");
		var year = parts[0] || 2012;
		var month = parts[1] - 1 || 4;
		var day = parts[2] || 1;
		var startingDate = new Date(year, month, day);
		var endingDate = new Date(year, month, day);
		var numberOfMonths = campaignDuration || 1;
		var areaList = getAreaList(numberOfMonths, commonArea);
		var totalScenarios = getTotalScenarios(areaList);
		
		if (totalScenarios < numScenarios){
			var diff = numScenarios - totalScenarios;
			var lastAreaType = areaList[areaList.length - 1];

			for (var i = 0; i < diff; i++){
				areaList.push(lastAreaType);
			}
			
			totalScenarios = numScenarios;
		}

		endingDate.setMonth(startingDate.getMonth() + (1 * numberOfMonths));

		var numberOfDays =  Math.floor((endingDate - startingDate)/86400000) - 7 + Math.floor(Math.random() * 14);		
		
		campaignDates.push({ 'label': timeOfDayObj.label, 'datetime': getDateByOffset(firstDayOfCampaign, 0, timeOfDayObj).toString() });
		
		for (var i = 0; i < totalScenarios - 2; i++){
			var offsetDays = Math.floor(Math.random() * numberOfDays);
			timeOfDayObj = Scenario.getTimeOfDay();
			
			campaignDates.push({ 'label': timeOfDayObj.label, 'datetime': getDateByOffset(firstDayOfCampaign, offsetDays, timeOfDayObj).toString() });
		}
		
		if (numberOfDays > 1 ){ 
			timeOfDayObj = Scenario.getTimeOfDay();
			campaignDates.push({ 'label': timeOfDayObj.label, 'datetime': getDateByOffset(firstDayOfCampaign, numberOfDays, timeOfDayObj).toString() });
		}
		
		Utilities.sortOnKey(campaignDates, 'label', false);		
		
		var outputStr = "";
		var outputHtml = "";
		var totalEncounters = 0;
		
		for (var index = 0; index < areaList.length; index++){
			var areaType = areaList[index];
			var encounterCount = ENCOUNTERS_BY_AREA[areaType];
			var encountersForArea = 0;
			
			while(totalEncounters < totalScenarios && encountersForArea < encounterCount){
				var campaignDateObj = campaignDates[totalEncounters];
				var timeOfDay = campaignDateObj.label;
				var dateTime = campaignDateObj.datetime;
				var pageType = BACKDROP_FILES[areaType];
				
				if (Math.random() <= 0.25 && commonArea){ areaType = commonArea; }
				
				outputStr += "<img src='" + pageType + "' class='hidden'/>";
				outputStr += "<div id='encounter_" + totalEncounters + "' class='info'>";
				outputStr += "<h3 class='righthand encounter-index'>" + (totalEncounters + 1) + " of " + totalScenarios + "</h3>";
				outputStr += "<h2 class='editable encounter-title'>Encounter " + (totalEncounters + 1) + "</h2><br/>";			
				outputStr += "<h3>" + dateTime + "</h3>";	
				
				var disclosureObj = Scenario.generate(areaType, timeOfDay);
				
				outputStr += disclosureObj.toString();
				
				for (var key in disclosureObj){
					outputStr += "<div class='" + key + " hidden'>" + disclosureObj[key] + "</div>";	
				}
				
				outputStr += "<h3>Background Information</h3>";
				outputStr += "<div class='editable encounter-background padded-bordered'></div>";
				outputStr += "<h3>Notes</h3>";
				outputStr += "<div class='editable encounter-notes padded-bordered'></div>";
				outputStr += "</div>";
				
				if (totalEncounters % 2 == 0){ outputStr += "<div class='page-break'></div>"; }
				
				totalEncounters++;
				encountersForArea++;
			}
		}
		
		outputHtml += "<div id='generated' class='padded-bordered'>";
		outputHtml += "<h1 class='editable campaign-name'>" + campaignName + "</h1><hr/>";
		outputHtml += "<h3>Overview</h3>";
		outputHtml += "<div class='editable campaign-overview padded-bordered'></div>";
		outputHtml += "<div id='encounters'>" + outputStr + "</div>"
		outputHtml += "</div>";
						
		$("#outputArea").html(outputHtml);
		
		$(".editable").css("cursor", "pointer").attr("title", "Double-click to edit this value");
		$(".editable").unbind("dblclick");
		$(".editable").bind("dblclick", function(){
			editText(this);
		});
		
		$(".editable").hover(
	    	function (){ $(this).css( "background-color", "gray"); },
	    	function (){ $(this).css("background-color", "transparent"); }
    	);
	};
	
	var editText = function (divObj){
		var dialogHtml = "";
				
		dialogHtml += "<input type='hidden' id='oldText' value='" + $(divObj).text() + "'/>";
		dialogHtml += "<input type='hidden' id='oldElement' value='" + $(divObj).attr("class") + "'/>";
		dialogHtml += "<textarea class='veryWideText' id='newText' style='height: 200px;' title='" + $(divObj).text() + "'>" + $(divObj).text() + "</textarea>";
		
		var dialogTitle;

		if($(divObj).attr("class").indexOf("campaign-overview") != -1){ dialogTitle = "Editing Overview [ " + $(divObj).parent().find(".campaign-name").text() + " ]"; }
		else if ($(divObj).attr("class").indexOf("campaign-name") != -1){ dialogTitle = "Editing Campaign Name [ " + $(divObj).text() + " ]"; }
		else if ($(divObj).attr("class").indexOf("encounter-background") != -1){ dialogTitle = "Editing Background [ " + $(divObj).parent().find(".encounter-title").text() + " ]" ; }
		else if ($(divObj).attr("class").indexOf("encounter-notes") != -1){ dialogTitle = "Editing Notes [ " + $(divObj).parent().find(".encounter-title").text() + " ]" ; }
		else { dialogTitle = "Editing Title [ " + $(divObj).text() + " ]"; }
		
		var fieldButtonsObj = { buttons: { "Cancel": function() { $(this).dialog("close"); }, "Save": function() { saveEdit(); $(this).dialog("close"); } }}
			    
		Modal.display('editableFieldArea', dialogHtml, dialogTitle, fieldButtonsObj, { width: 400 }); 
	}
	
	var saveEdit = function (){
		var oldElement = $("#oldElement").val().replace(/ /g, ".");
		var newText = $("#newText").val();

		$("." + oldElement).text(newText);
	}
	
	var getDateByOffset = function (startDate, offsetDays, timeOfDayObj){		
		var parts = startDate.split("-");
		var year = parts[0];
		var month = parts[1] - 1;
		var day = parts[2];

		var startHour = timeOfDayObj.startHH;
		var rangeHours = timeOfDayObj.range;
		var actualHour = startHour + Math.floor(Math.random() * rangeHours) - 1;
		var actualMinutes = Math.floor(Math.random() * 60);
		
		if (actualHour > 23){ actualHour -= 24; }
		
		var finalDate = new Date(year, month, day);
		finalDate.setDate(finalDate.getDate() + offsetDays);
		finalDate.setHours(actualHour, actualMinutes);

		dateStr = DateFormatter.format(finalDate, "l, j F Y #a#t g:i A");

		return dateStr;
	}
	
	var getAreaList = function (numberOfMonths){
		var tempArr = [];

		for (var i = 0; i < numberOfMonths; i++){
			var index = Math.floor(Math.random() * 	RANDOM_AREA_SELECTION.length);
			var area = RANDOM_AREA_SELECTION[index];
			
			tempArr.push(area);
		}
			
		return tempArr;
	}
	
	var getTotalScenarios = function (areaList){
		var count = 0;

		for (var i = 0; i < areaList.length; i++){
			var areaType = areaList[i];
			count += ENCOUNTERS_BY_AREA[areaType];	
		}

		return count;
	}
	
	return {
		generate: generate
	}
})();