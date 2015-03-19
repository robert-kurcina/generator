/**
 * Template.js
 * ============================================================================
 * 2009.06.27 - written by Robert Kurcina
 *
 *
 * INFORMATION
 * ----------------------------
 * A generator for print-capable card views.  Bundles all information gathered
 * from a Team request via Character modules and draws out cards that float: left;.
 * The end-user is then responsible to use the browser and set the proper paper
 * select [ letter, legal, tabloid, A4, etc ] and print margins.  The CSS will
 * cause the DOM objects to flow properly.  Normally 9 cards will print per page,
 * but this can be changed by passing in a cardCount parameter.  Whenever the
 * number cards matches that count, a CSS page-break-after is inserted to limit
 * the amount of images appearing on each printed page.
 *
 *
 * ASSUMES
 * ----------------------------
 * jquery.js loaded
 * Cardsheet.js loaded
 *
 *
 * STANDARD METHODS
 * ----------------------------
 * getTable(a,c,boolean,n)		-	print card list a with class c limited to n per page.  Use tall cards if boolean is true
 * getSheet(p, boolean, n)		- 	print n cards to a page of the same sort; either 'backs' or 'default'.  Use tall cards if boolean is true
 *
 *
 * DISCLOSURE METHODS
 * ----------------------------
 *
**/
var Template = (function(){
	var CARD_CLASS_TALL = 'card-tall';
	var CARD_CLASS_WIDE = 'card-wide';
	var SHEET_CLASS_TALL = 'tall-sheet';
	var SHEET_CLASS_WIDE = 'wide-sheet';

	var getTable = function (cardsList, cardTypeClass, bTallCards, cardCount){
		var cardImage = "";
		var resultHtml = "";
		var index = 0;
		var cardClass = (bTallCards) ? CARD_CLASS_TALL : CARD_CLASS_WIDE;
		var sheetType = (bTallCards) ? SHEET_CLASS_TALL : SHEET_CLASS_WIDE;
		var numCards = cardsList.length;
		var pageSize = (Utilities.isNumeric(cardCount)) ? cardCount : 9;
		
		resultHtml += "<div class='template " + cardTypeClass + " " + sheetType + "'>";
		
		for (var index in cardsList){			
			var cardObj = cardsList[index];
			var cardPath = cardObj.cardtype;
			var cardHtml = cardObj.html;		
			var cardStyle = "float: left;";
					
			if (index > 0 && (index % pageSize == 0)){
				resultHtml += "<div class='page-break'></div>";
			}
				
			resultHtml += "<div id='card_" + index + "' class='" + cardClass + "' style='" + cardStyle + "'>";				
			resultHtml += "<img class='card' src='" + cardPath + "'>";
			resultHtml += cardHtml;
			resultHtml += "</div>";		
		}
		
		resultHtml += "<div class='clearAll'></div>";
		resultHtml += "</div>";	
				

		return resultHtml;
	}
		
	var getSheet = function (cardPath, bTallCards, cardCount){
		var resultHtml = "";
		var cardClass = (bTallCards) ? CARD_CLASS_TALL : CARD_CLASS_WIDE;
		var sheetType = (bTallCards) ? SHEET_CLASS_TALL : SHEET_CLASS_WIDE;
		var pageSize = (Utilities.isNumeric(cardCount)) ? cardCount : 9;

		resultHtml += "<div class='template " + sheetType + "'>";
		
		for (var index = 0; index < pageSize; index++){
			var cardStyle = "float: left;";
			
			resultHtml += "<div id='card_" + index + "' class='" + cardClass + "' style='" + cardStyle + "'>";				
			resultHtml += "<img class='card' src='" + cardPath + "'>";
			resultHtml += "</div>";
			
			if (index > 0 && (index % pageSize == 0)){
				resultHtml += "<div class='page-break'></div>";	
			}
		}
		
		resultHtml += "<div class='clearAll'></div>";
		resultHtml += "</div>";			

		return resultHtml;	
	}
		
	return {
		getTable: getTable,
		getSheet: getSheet
	}
})();
