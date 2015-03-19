/**
 * Buttons.js
 * ============================================================================
 * 2009.07.01 - written by Robert Kurcina
 *
 *
 * INFORMATION
 * ----------------------------
 * A plug-in for styling buttons using jquery.ui derived from work created by
 * The Filament Group at derived from http://www.filamentgroup.com/lab/styling_buttons_and_toolbars_with_the_jquery_ui_css_framework/
 *
 *
 * ASSUMES
 * ----------------------------
 * none
 *
 *
 * STANDARD METHODS
 * ----------------------------
 *
 *
 * DISCLOSURE METHODS
 * ----------------------------
 * 
 *
**/

$(function(){
	$(document).ready(function (){
		$("input[type=button]").addClass("fg-button ui-state-default ui-corner-all");
		
		//all hover and click logic for buttons
		$(".fg-button:not(.ui-state-disabled)")
		.hover(
			function(){
				$(this).addClass("ui-state-hover"); 
			},
			function(){
				$(this).removeClass("ui-state-hover"); 
			}
		)
		.mousedown(function(){
				$(this).parents('.fg-buttonset-single:first').find(".fg-button.ui-state-active").removeClass("ui-state-active");
				if( $(this).is('.ui-state-active.fg-button-toggleable, .fg-buttonset-multi .ui-state-active') ){ $(this).removeClass("ui-state-active"); }
				else { $(this).addClass("ui-state-active"); }	
		})
		.mouseup(function(){
			if(! $(this).is('.fg-button-toggleable, .fg-buttonset-single .fg-button,  .fg-buttonset-multi .fg-button') ){
				$(this).removeClass("ui-state-active");
			}
		});
	});
});