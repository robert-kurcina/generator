/**
 * Modal.js
 * ============================================================================
 * 2009.06.28 - written by Robert Kurcina
 *
 *
 * INFORMATION
 * ----------------------------
 * A wrapper for jquery.ui.dialog.  Tracks and destroys multiple dialog boxes;
 * each will be modal and will fade-in and upon closing it will fade-out.
 *
 * jquery.ui.dialog requires that the dialog window be assigned a target
 * container [ in this case, a target ID ] which will be used to hold any
 * HTML to be shown.  This container should not be used for any other purpose.
 *
 *
 * ASSUMES
 * ----------------------------
 * jquery.js loaded
 * jquery.ui.all.js loaded
 *
 *
 * STANDARD METHODS
 * ----------------------------
 * create(id)						-	prepares a modal dialog window for target id n; destroys any prior dialog if ID is different
 * reveal(html)						-	pumps html into the previously created dialog
 * reveal(html, title)				-	same as reveal(html) but allows a title
 * reveal(html, title, id)			-	same as reveal(html, title) but will create a dialog
 * reveal(html, title, id, true)	-	same as reveal(html, title, id) but will add an 'Ok' button
 * reveal(html, title, buttonsObj)	-	same as reveal(html, title, id) but will create buttons as defined by buttonsObj
 * reveal(h, t, b, optionsObj)		-	same as reveal(html, title, id, buttonsObj) but will provide options to jquery.ui.dialog
 * destroy()						-	destroys the previously created dialog so that it can be repurposed
 * destroyAll()						-	destroys all tracked modal dialogs
 *
 *
 * EXAMPLE of buttonsObj defintion
 *    var buttonsObj = { buttons: { "Ok": function() { $(this).dialog("close"); } }}
 * 	  var buttonsObj = { buttons: { "Cancel": function() { $(this).dialog("close"); }, "Save": function() { alert('Saving..."); $(this).dialog("close"); } }}
 *
 *
 * DISCLOSURE METHODS
 * ----------------------------
 *
**/
var Modal = (function(){	
	var storedTargetIdArr = [];
	
	var display = function (givenTargetId, outputHtml, title, buttonsObj, optionsObj){
		destroy(givenTargetId);
		create(givenTargetId, buttonsObj, optionsObj);

		$("#" + givenTargetId).html(outputHtml);
		$("#" + givenTargetId).dialog('open');		
		
		if (null != title){ $("#" + givenTargetId).dialog('option', 'title', title); }
		
		$("#" + givenTargetId).dialog('option', 'width', 'auto');
	}
	
	var destroy = function (dialogId){
		if (dialogId != null){ 
			$("#" + dialogId).dialog('destroy');
		}
		
		var found = -1;
		
		for (var i = 0; i < storedTargetIdArr.length; i++){
			if (dialogId == storedTargetIdArr[i]){ found = i; break; }	
		}
		
		if (found != -1){ storedTargetIdArr.splice(found, 1); }	
	}
	
	var create = function (givenTargetId, buttonsObj, optionsObj){
		$("#" + givenTargetId).dialog(getCombinedOptions(optionsObj, buttonsObj));
		
		storedTargetIdArr.push(givenTargetId);
	}
	
	var getCombinedOptions = function (givenOptions, buttonsObj){
		var defaultOptions = { autoOpen: false, modal: true, width: 700, show: 'fade', hide: 'fade' };
		var combinedOptions = defaultOptions;
		
		if (givenOptions == null){
			if (buttonsObj == null){
				return defaultOptions;
			}
			else if (typeof buttonsObj == 'object'){
				combinedOptions['buttons'] = buttonsObj.buttons;
				return combinedOptions;			
			}
			else {
				combinedOptions['buttons'] = { "Ok": function() { $(this).dialog("close"); }};
				return combinedOptions;	
			}	
		}
		else {
			for (var i in givenOptions){
				combinedOptions[i] = givenOptions[i];		
			}
			
			if (buttonsObj == null){
				return combinedOptions;
			}
			else if (typeof buttonsObj == 'object'){
				combinedOptions['buttons'] = buttonsObj.buttons;
				return combinedOptions;	
			}
			else {
				combinedOptions['buttons'] = { "Ok": function() { $(this).dialog("close"); }};
				return combinedOptions;	
			}
		}
	}
	
	var destroyAll = function (){
		for (var i = 0; i < storedTargetIdArr.length; i++){
			destroy(storedTargetIdArr[i]);	
		}	
	}
	
	return {
		display: display
	}
})();