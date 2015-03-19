/**
 * Roster.js
 * ============================================================================
 * 2009.06.29 - written by Robert Kurcina
 *
 *
 * INFORMATION
 * ----------------------------
 * A wrapper for Cardsheet.js which creates HTML formated for consumption by
 * the Template module.
 *
 *
 * ASSUMES
 * ----------------------------
 * jquery.js loaded
 * jquery.ui.all.js loaded
 * Cardsheet.js loaded
 *
 *
 * STANDARD METHODS
 * ----------------------------
 * generate(n)
 * getSheet(n)
 *
 *
 * DISCLOSURE METHODS
 * ----------------------------
 *
**/
Roster = (function(){
	var generate = function (definitionStrID, cardCountID, bUseTallID, outputAreaID){
		var definitionStr = $("#" + definitionStrID).val() || 6;
		var cardCount = $("#" + cardCountID).val()|| 1;
		var useTall = $("#" + bUseTallID).is(":checked");
		var outputHtml = Cardsheet.generate(definitionStr, useTall, cardCount);

		$("#" + outputAreaID).html(outputHtml); 
		createModalControls();
	}
	
	var getSheet = function (cardIndex, cardCountID, bUseTallID, outputAreaID){
		var cardType = cardIndex || 'backs';
		var cardCount = $("#" + cardCountID).val()|| 1;
		var useTall = $("#" + bUseTallID).is(":checked");
		var outputHtml = Cardsheet.getSheet(cardType, useTall, cardCount);
		
		$("#" + outputAreaID).html(outputHtml);
	}
	
	var saveEdit = function (targetObj, originatorSelector){		
		var newValue = $(targetObj).find("#newValue").val();
		var oldValue = $(targetObj).find("#newValue").attr("title");
		
		if (newValue.indexOf("<table") != -1){
			$(originatorSelector).html(newValue);
		}
		else {
			$(originatorSelector).text(newValue);
		}
		
		$("#newValue").remove();
		$("#editValue").remove();
		$(".newValue").remove();
		$(".editValue").remove();
	}
	
	var saveAllChanges = function (targetObj, context, editablesArr){
		$.each(editablesArr, function (){
			var newValuesSelector = context + " div" + this;
			var originatorId = $("#cardId").val();
			
			if ($(newValuesSelector).not(":hidden")){
				var newValue;
				
				if ($(newValuesSelector).find("table")){
					newValue = $(newValuesSelector).html();
					$("#" + originatorId).find(" div." + this).html(newValue);
				}
				else {
					newValue = $(newValuesSelector).text();			
					$("#" + originatorId).find(" div." + this).text(newValue);
				}
			}
		});
	}
		
	var getCommonFieldHtml = function (context, originatorClass, currentValue){
	    var dialogHtml = "";
	   
	    dialogHtml += "<textarea id='editValue' class='wideText' title='" + currentValue + "'>" + currentValue + "</textarea>";
	    dialogHtml += "<input type='hidden' id='newValue' class='wideText' value='" + currentValue + "'>";
	    
	    $("#editValue").die("change");
	    $("#editValue").live("change", function (){
		   $("#newValue").val($("#editValue").val()); 
	    });
		
		return dialogHtml;
	}
	
	var getAttributesInfoHtml = function (context, editablesArr, currentValue){
		var infoObj = Attributes.getAllInfo();
		var infoList = Utilities.uniques(Table.getLabels(infoObj)).sort();		
		var attributesArr = Utilities.trim(currentValue.split(","));
		var dialogHtml = "";

		attributesArr.push(null);
		
		for (var row = 0; row < attributesArr.length; row++){
			var attribute = attributesArr[row];
			
			dialogHtml += "<select class='editValue wideText fatbottom' title='Choose an attribute if desired'>";
			dialogHtml += "<option value=''>--- choose attribute ---</option>";
			
			for (var i = 0; i < infoList.length; i++){
				var selected = "";
				
				if (attribute == infoList[i]){ selected = "selected"; }
				
				dialogHtml += "<option " + selected + ">" + infoList[i] + "</option>";
			}
			
			dialogHtml += "</select><br/>";
		}
		
		dialogHtml += "<input type='hidden' id='newValue' class='wideText' value='" + currentValue + "'>";
		
		$(".editValue").die("change");
	    $(".editValue").live("change", function (){
		   var revisedArr = [];
		   
		   $.each($(".editValue"), function (){
			   if($(this).val() == ""){ return; }
			   revisedArr.push($(this).val());
		   });
		   
		   $("#newValue").val(Utilities.uniques(revisedArr).join(", "));
	    });
	    
		return dialogHtml;
	}
	
	var getQualitySelectHtml = function (context, originatorClass, currentValue){
		var infoObj = Character.getAllInfo();
		var infoList = Utilities.uniques(Table.getLabels(infoObj)).sort();
		var characterType = $(context + " .type").text();
		var characterCardSrc = $(context).parent().find("img.card").attr("src");
		
		if (!Utilities.contains(infoList, characterType)){ characterType = "Civilian"; }

		var qualityObj = eval(characterType + ".getQualityInfo()");
		var qualityList = Utilities.uniques(Table.getLabels(qualityObj));
		var dialogHtml = "";
		
		dialogHtml += "<select id='newValue' class='wideText fatbottom' title='Choose a specific quality if desired'>";
		
		for (var i = 0; i < qualityList.length; i++){
			var selected = "";
			
			if (currentValue == qualityList[i]){ selected = "selected"; }
			
			dialogHtml += "<option " + selected + ">" + qualityList[i] + "</option>";
		}
		
		dialogHtml += "</select>";
		
		$("#newValue").die("change");
		$("#newValue").live("change", function (){ 
			$(context + " .quality").css("background-color", "transparent");
			$(context + " .rep").text(Table.getCellValue(qualityObj, "label", "rep", $("#newValue").val()));
			
			var revisedQuality = $(context + " .quality").text();		
			var cardType = (revisedQuality == "Star") ? 'star' : 'grunt';
			var cardPath = characterCardSrc.replace(currentValue.toLowerCase(), revisedQuality.toLowerCase());
			
			$(context).parent().find("img.card").attr("src", cardPath);
		});	
		
		return dialogHtml;
	}
	
	var getWeaponsInfoHtml = function (context, editablesArr, currentValue){
		var infoObj = Armory.getAllInfo();
		var infoList = Utilities.uniques(Table.getLabels(infoObj)).sort();		
		var weaponsArr = [];
		var dialogHtml = "";
		
		$.each($(context + " .weapons td:nth-child(1)"), function (){
			weaponsArr.push(Utilities.trim($(this).text()));
		});	

		weaponsArr.push(null);
		
		for (var row = 0; row < weaponsArr.length; row++){
			var weaponName = weaponsArr[row];
			
			dialogHtml += "<select class='editValue wideText fatbottom' title='Choose a specific weapon if desired'>";
			dialogHtml += "<option value=''>--- choose weapon ---</option>";
			
			for (var i = 0; i < infoList.length; i++){
				var selected = "";
				
				if (weaponName == infoList[i]){ selected = "selected"; }
				
				dialogHtml += "<option " + selected + ">" + infoList[i] + "</option>";
			}
			
			dialogHtml += "</select><br/>";
		}
		
		dialogHtml += "<input type='hidden' id='newValue' class='wideText' value='" + currentValue + "'>";
		
		$(".editValue").die("change");
	    $(".editValue").live("change", function (){
		   var revisedArr = [];
		   
		   $.each($(".editValue"), function (){
			   if($(this).val() == ""){ return; }
			   revisedArr.push($(this).val());
		   });
		   
		   $("#newValue").val(Character.getWeaponDetails(revisedArr));
	    });
	    
		return dialogHtml;
	}
	
	var setEditableText = function (context, editablesArr, dialogContentFunc){	
		$.each(editablesArr, function (){
			var selector = context + " div" + this;
			
		    $(selector).unbind('click');		    
		    $(selector).bind('click', function (){
			    var originatorClass = $(this).attr("class");
			    var currentValue = $(this).text();
			    var originatorSelector = context + " div." + originatorClass;
			    var dialogTitle = "Editing " + originatorClass + " [ " + currentValue + " ]";
			    var dialogHtml = dialogContentFunc(context, originatorClass, currentValue);				
			    
			    var fieldButtonsObj = { buttons: { "Cancel": function() { $(this).dialog("close"); }, "Save": function() { Roster.saveEdit(this, originatorSelector); $(this).dialog("close"); } }}
			    
				Modal.display('editableFieldArea', dialogHtml, dialogTitle, fieldButtonsObj, { width: 400 }); 
		    });
		    
		    $(selector).hover(
		    	function (){ $(this).css( "background-color", "gray"); },
		    	function (){ $(this).css("background-color", "transparent"); }
	    	);
	    });
	}
	
	var setEditableSelect = function (context, editablesArr, dialogContentFunc){	
		$.each(editablesArr, function (){
		    var selector = context + " div" + this;
			
		    $(selector).unbind('click');		    
		    $(selector).bind('click', function (){
			    var originatorClass = $(this).attr("class");
			    var currentValue = $(this).text();
			    var originatorSelector = context + " div." + originatorClass;
			    var dialogTitle = "Editing " + originatorClass + " [ " + currentValue + " ]";
			    var dialogHtml = dialogContentFunc(context, originatorClass, currentValue);

			    var fieldButtonsObj = { buttons: { "Cancel": function() { $(this).dialog("close"); }, "Save": function() { Roster.saveEdit(this, originatorSelector); $(this).dialog("close"); } }}
			    
				Modal.display('editableFieldArea', dialogHtml, dialogTitle, fieldButtonsObj, { width: 400 }); 
		    });
		    
		    $(selector).hover(
		    	function (){ $(this).css( "background-color", "gray"); },
		    	function (){ $(this).css("background-color", "transparent"); }
	    	);
	    });
	}
	
	var setEditableIndex = function (context, editablesArr, dialogContentFunc){	
		$.each(editablesArr, function (){
			var selector = context + " div" + this;
			
		    $(selector).unbind('click');		    
		    $(selector).bind('click', function (){
			    var originatorClass = $(this).attr("class");
			    var currentValue = $(this).html();
			    var originatorSelector = context + " div." + originatorClass;
			    var dialogTitle = "Editing " + originatorClass;
			    var dialogHtml = dialogContentFunc(context, originatorClass, currentValue);				
			    
			    var fieldButtonsObj = { buttons: { "Cancel": function() { $(this).dialog("close"); }, "Save": function() { Roster.saveEdit(this, originatorSelector); $(this).dialog("close"); } }}
			    
				Modal.display('editableFieldArea', dialogHtml, dialogTitle, fieldButtonsObj, { width: 400 }); 
		    });
		    
		    $(selector).hover(
		    	function (){ $(this).css( "background-color", "gray"); },
		    	function (){ $(this).css("background-color", "transparent"); }
	    	);
	    });
	}
		
	var createModalControls = function (){
		$(".screen-padded #outputArea .labels").die("dblclick");
		$(".screen-padded #outputArea .labels").live("dblclick", function (){
			var cardId = $(this).parent().attr("id");			
			var templateClass = "double " + $("#outputArea div").attr("class").split(" ")[1];
			var templateDouble;
			var parentClass;
			var iconClass = $(this).find(".gender img").attr("class");
								
			if (templateClass.indexOf('wide') != -1){ 
				templateDouble = 'double atz-wide-double'; 
				parentClass = 'card-wide';
			}
			else { 
				templateDouble = 'double atz-tall-double'; 
				parentClass = 'card-tall';
			}
			
			var context = "#editTarget .labels";
			var editableTextArr = [ ".fullname", ".abbrname", ".rep", ".notes" ];
			var editableSelectArr = [ ".quality" ];
			var editableAttributesArr = [ ".attributes" ];
			var editableRecord = [ ".weapons" ];
			var editablesArr = editableTextArr.concat(editableSelectArr.concat(editableAttributesArr,editableRecord)); 			
			var cardButtonsObj = { buttons: { "Cancel": function() { $(this).dialog("close"); }, "Save": function() { Roster.saveAllChanges(this, context, editablesArr); $(this).dialog("close"); } }}
			var modalTitle = "Editing card [ " + $(this).find(".fullname").text() + " ]";
			var modalHtml = "";
			
			modalHtml += "<div id='editTarget' class='" + templateDouble + "'>";
			modalHtml += "<input type='hidden' id='cardId' value='" + cardId + "'/>";
			modalHtml += "<div class='" + parentClass + "'>" + $(this).parent().html() + "</div>";
			modalHtml += "</div>";
						
			Modal.display('modalArea', modalHtml, modalTitle, cardButtonsObj);
			$("#editTarget .gender img").removeClass(iconClass);
			$("#editTarget .gender img").addClass(iconClass + "-double");
			
			setEditableText(context, editableTextArr, getCommonFieldHtml); 
			setEditableSelect(context, editableAttributesArr, getAttributesInfoHtml);
			setEditableSelect(context, editableSelectArr, getQualitySelectHtml);
			setEditableIndex(context, editableRecord, getWeaponsInfoHtml);	       
		});	 
	};
	
	return {
		generate: generate,
		getSheet: getSheet,
		saveEdit: saveEdit,
		saveAllChanges: saveAllChanges
	}
})();