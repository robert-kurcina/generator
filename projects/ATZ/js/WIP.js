/**
 * WIP.js
 * ============================================================================
 * 2009.06.25 - written by Robert Kurcina
 *
 *
 * INFORMATION
 * ----------------------------
 * Utilizes a form-based interface to generate an output list of Characters and
 * Teams to feed into the Cardsheet module.  The result can then be passed into
 * the Template module to generate a print-ready presentation.
 *
 *
 * ASSUMES
 * ----------------------------
 * jquery.js loaded
 * Table.js loaded
 * Utilities.js loaded
 * Team.js loaded
 * Cardsheet.js loaded
 *
 *
 * STANDARD METHODS
 * ----------------------------
 *
 *
 * DISCLOSURE METHODS
 * ----------------------------
 *
**/
var WIP = (function(){	
	var rosterObj = {};
	var currentIndex = 0;
	var characterCount = 0;
	var characterArr = [];
		
	$(document).ready(function(){		
		addCharacter();
	});	

	var addCharacter = function (){
		var outputHtml = gatherHtml(currentIndex);
		
		$("#roster").append(outputHtml);
		$("#roster").append(getTriggerHtml(currentIndex));
		$("#character_" + currentIndex).hide();	
		$("#character_" + currentIndex).slideToggle("fast");
		
		characterArr.push(currentIndex);
		currentIndex++;
		characterCount++;
		
		renumberCharacterLabels();
	}
	
	var removeCharacter = function (givenIndex){
		if (characterCount == 1){ return; }
		
		$("#character_" + givenIndex).slideToggle("fast", function (){
			$("#character_" + givenIndex).remove();
		});
		
		characterArr.splice(currentIndex, 1);
		characterCount--;
		
		renumberCharacterLabels();
	}
	
	var renumberCharacterLabels = function (){
		var index = 0;
		
		$.each($("h4.header"), function (){
			$(this).text("CHARACTER " + (index++ + 1) + " of " + characterCount);
		});
	}
	
	var getCharacterLabel = function (givenIndex){
		return "<h4 class='header'>CHARACTER " + givenIndex + " of " + characterCount + "</h4>";
	}
	
	var getTriggerHtml = function (givenIndex){
		$("#script_" + givenIndex).remove();
		return "<script id='script_" + givenIndex + "'>$('#type_" + givenIndex + "').bind('change', function(){ $('#quality_" + givenIndex + "').parent().html( Roster.getQualityHtml(" + givenIndex + ", $('#type_" + givenIndex + "').val()) ); });<\/script>"
	}
	
	var gatherHtml = function (givenIndex){
		var resultHtml = "";		

		resultHtml += getControls(givenIndex);
		resultHtml += getCharacterLabel();
		
		resultHtml += getNamesHtml(givenIndex);
		resultHtml += getGenderHtml(givenIndex);
		resultHtml += getTypeHtml(givenIndex);
		resultHtml += getQualityHtml(givenIndex, "Civilian");
				
		resultHtml = "<div id='character_" + givenIndex + "' class='character'>" + resultHtml + "<div style='clear: both; float: none;'></div></div>";

		return resultHtml;
	}
	
	var getControls = function (givenIndex){
		var resultHtml = "";
		
		resultHtml += "<div class='controls righthand small' style='position: relative;'>";
		resultHtml += "<div class='righthand'>[ <a href='#bottom' title='Jump to bottom of page'>&darr;</a> ]</div>";
		resultHtml += "<div class='righthand'>[ <a href='#top' title='Jump to top of page'>&uarr;</a> ]</div>";
		resultHtml += "<div class='righthand'>[ <a href='javascript: Roster.addCharacter();' title='Click to add another character'>ADD</a> ]</div>";
		resultHtml += "<div class='righthand'>[ <a href='javascript: Roster.removeCharacter(" + (givenIndex) + ");' title='Click to delete this character'>REMOVE</a> ]</div>";
		resultHtml += "<div class='clearAll'></div>";
		resultHtml += "</div>";
		
		return resultHtml;
	}
	
	var getGenderHtml = function (givenIndex){
		var resultHtml = "";
		var elementId = 'gender_' + givenIndex;
		
		resultHtml += "<input type='radio' id='genderM_" + givenIndex + "' name='gender_" + givenIndex + "' value='M' title='Make this character male'/>&nbsp;Male&nbsp;&nbsp;&nbsp;";
		resultHtml += "<input type='radio' id='genderF_" + givenIndex + "' name='gender_" + givenIndex + "' value='F' title='Make this character female'/>&nbsp;Female&nbsp;&nbsp;&nbsp;";
		resultHtml += "<input type='radio' id='gender?_" + givenIndex + "' name='gender_" + givenIndex + "' value='?' checked title='Make this character either sex'/>&nbsp;Any&nbsp;&nbsp;&nbsp;";
		
		return wrapDiv(resultHtml, elementId, "genderDiv fatbottom");
	}
	
	var getNamesHtml = function (givenIndex){
		var resultHtml = "";
		var elementId = 'name_' + givenIndex;
		
		resultHtml += "<div class='label'>First Name</div>";
		resultHtml += "<input type='text' id='firstname_" + givenIndex + "' name='firstname_" + givenIndex + "' class='fatbottom wideText' title='Enter a specific first name if desired'/>";
		resultHtml += "<br/>";
		resultHtml += "<div class='label'>Last Name</div>";
		resultHtml += "<input type='text' id='lastname_" + givenIndex + " name='lastname_" + givenIndex + "' class='fatbottom wideText' title='Enter a specific last name if desired'/>";
		
		return wrapDiv(resultHtml, elementId, "namesDiv");
	}
	
	var getTypeHtml = function (givenIndex){
		var resultHtml = "";
		var infoObj = Character.getAllInfo();
		var infoList = Utilities.uniques(Table.getLabels(infoObj)).sort();
		var elementId = 'types_' + givenIndex;
		
		resultHtml += "<select id='type_" + givenIndex + "' class='wideText fatbottom' title='Choose a specific type if desired'>";
		resultHtml += "<option value=''>--- select type ---</option>";
		
		for (var i = 0; i < infoList.length; i++){
			resultHtml += "<option>" + infoList[i] + "</option>";
		}
		
		resultHtml += "</select>";

		return wrapDiv(resultHtml, elementId, "typesDiv");
	}
	
	var getQualityHtml = function (givenIndex, givenType){
		if (null == givenType){ return wrapDiv("", elementId, "qualityDiv"); }			
		
		var infoObj = Character.getAllInfo();
		var infoList = Utilities.uniques(Table.getLabels(infoObj)).sort();
		var elementId = 'qualities_' + givenIndex;
		
		if (!Utilities.contains(infoList, givenType)){ return wrapDiv("", elementId, "qualityDiv"); }
		
		var qualityObj = eval(givenType + ".getQualityInfo()");
		var qualityList = Utilities.uniques(Table.getLabels(qualityObj));

		var resultHtml = "";		
		
		resultHtml += "<select id='quality_" + givenIndex + "' class='wideText fatbottom' title='Choose a specific quality if desired'>";
		resultHtml += "<option value=''>--- select quality ---</option>";
		
		for (var i = 0; i < qualityList.length; i++){
			resultHtml += "<option>" + qualityList[i] + "</option>";
		}
		
		resultHtml += "</select>";
		
		return wrapDiv(resultHtml, elementId, "qualityDiv");
	}
	
	var wrapDiv = function (givenHtml, givenId, givenClasses){
		var divClass = givenClasses || "";
		var resultHtml = "";
		
		resultHtml += "<div id='" + givenId + "' class='" + divClass + "'>";
		resultHtml += givenHtml;
		resultHtml += "</div>";
		
		return resultHtml;
	}
	
	return {
		getQualityHtml: getQualityHtml,
		addCharacter: addCharacter,
		removeCharacter: removeCharacter
	}
})();