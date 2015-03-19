/**
 * Cardsheet.js
 * ============================================================================
 * 2009.06.24 - written by Robert Kurcina
 *
 *
 * INFORMATION
 * ----------------------------
 * Retrieves prepares a cardsheet for use by the Template module.
 *
 *
 * ASSUMES
 * ----------------------------
 * Team.js loaded
 * Template.js loaded
 *
 *
 * STANDARD METHODS
 * ----------------------------
 * generate()				-	Generates 6 characters
 * generate(n)				-	Generates n characters
 * generate(defStr)			-	Generates characters according to definition string defStr
 * generate(k,true)			-	Same as generate(n) or generate(defStr) but will get tall cards instead of wide cards
 * getBlanks(boolean)		-	Retrieve a sheet of 9 default/blank cards; tall if boolean is true
 * getBacks(boolean)		-	Retrieve a sheet of 9 card-back cards; tall if boolean is true
 *
 *
 * DISCLOSURE METHODS
 * ----------------------------
 *
**/
var Cardsheet = (function(){
	var CARD_PATHS = {
		'wide': {
			'default': '../img/characters/wide.blank.png',
			'backs': '../img/characters/wide.back.png',
			'Police': '../img/characters/wide.grunt.police.png',
			'Ganger': '../img/characters/wide.grunt.ganger.png',
			'Survivor': '../img/characters/wide.grunt.survivor.png',
			'Civilian': '../img/characters/wide.grunt.civilian.png',
			'Military': '../img/characters/wide.grunt.military.png'
		},
		
		'wide-star': {
			'default': '../img/characters/wide.blank.png',
			'backs': '../img/characters/wide.back.png',
			'Police': '../img/characters/wide.star.police.png',
			'Ganger': '../img/characters/wide.star.ganger.png',
			'Survivor': '../img/characters/wide.star.survivor.png',
			'Civilian': '../img/characters/wide.star.civilian.png',
			'Military': '../img/characters/wide.star.military.png'
		},
		
		'tall': {
			'default': '../img/characters/tall.blank.png',
			'backs': '../img/characters/tall.back.png',
			'Police': '../img/characters/tall.grunt.police.png',
			'Ganger': '../img/characters/tall.grunt.ganger.png',
			'Survivor': '../img/characters/tall.grunt.survivor.png',
			'Civilian': '../img/characters/tall.grunt.civilian.png',
			'Military': '../img/characters/tall.grunt.military.png'
		},
		
		'tall-star': {
			'default': '../img/characters/tall.blank.png',
			'backs': '../img/characters/tall.back.png',
			'Police': '../img/characters/tall.star.police.png',
			'Ganger': '../img/characters/tall.star.ganger.png',
			'Survivor': '../img/characters/tall.star.survivor.png',
			'Civilian': '../img/characters/tall.star.civilian.png',
			'Military': '../img/characters/tall.star.military.png'
		}
	};
	
	var CARD_CLASS_WIDE = 'atz-wide';
	var CARD_CLASS_TALL = 'atz-tall';		
					
	var generate = function (givenDefinition, useTall, cardCount){
		var useTallCards = useTall || false;
		var cardTypeClass = (useTallCards) ? CARD_CLASS_TALL : CARD_CLASS_WIDE;
		var definitionStr = givenDefinition || 6;
		var teamRoster = Team.getTeam(definitionStr);
		var cardsList = getCardsList(teamRoster, useTallCards);
		
		var outputHtml = Template.getTable(cardsList, cardTypeClass, useTallCards, cardCount);
		
		return outputHtml;
	};
	
	var getSheet = function (cardIndex, useTall, cardCount){
		var cardType = getCardType(cardIndex, useTall);
		var outputHtml = Template.getSheet(cardType, useTall, cardCount);
		
		return outputHtml;
	}
	
	var getDetailsHtml = function (characterObj){
		var resultHtml = "";
		var fullname = characterObj.fullname;
		var abbrname = characterObj.abbrname;
		var type = characterObj.type;
		var attributes = characterObj.attributes;
		var weapons = characterObj.weapons;
		var notes = characterObj.notes;
		var quality = characterObj.quality;
		var gender = characterObj.gender;
		var rep = characterObj.rep;
		
		var genderSymbol = (Utilities.firstLetter(gender).toUpperCase() == "F") ? "<img class='gender-girl' src='../img/atz.icons.png' title='Female'/>" : "<img class='gender-boy' src='../img/atz.icons.png' title='Male'/>" ;
		
		resultHtml += "<div class='labels'>";
		resultHtml += "<div class='fullname'>" + fullname + "</div>";
		resultHtml += "<div class='abbrname'>" + abbrname + "</div>";
		resultHtml += "<div class='type'>" + type + "</div>";
		resultHtml += "<div class='gender'>" + genderSymbol + "</div>";
		resultHtml += "<div class='quality'>" + quality + "</div>";
		resultHtml += "<div class='attributes'>" + attributes + "</div>";
		resultHtml += "<div class='weapons'>" + weapons + "</div>";
		resultHtml += "<div class='notes'>" + notes + "</div>";
		resultHtml += "<div class='rep'>" + rep + "</div>";
		resultHtml += "</div>";
		
		return resultHtml;
	}
	
	var getCardsList = function (teamRoster, useTallCards){
		var resultArr = [];

		for (var i in teamRoster){
			var characterObj = teamRoster[i];			
			var detailsHtml = getDetailsHtml(characterObj);
			var cardType = getCardType(characterObj, useTallCards);
			
			var cardObj = {
				'html': detailsHtml,
				'cardtype': cardType
			}
			
			resultArr.push(cardObj);
		}
		
		return resultArr;
	}
	
	var getCardType = function (characterObj, useTallCards){
		if (characterObj == 'backs' || characterObj == 'default'){ 
			if (useTallCards){
				return CARD_PATHS['tall'][characterObj];
			}
			else {
				return CARD_PATHS['wide'][characterObj];
			}
		}
	
		var characterType = characterObj.type;
		var characterQuality = characterObj.quality;
		var cardPath;

		if (useTallCards){
			if (characterQuality == 'Star'){
				cardPath = CARD_PATHS['tall-star'][characterType] || CARD_PATHS['tall-star']['default'];
			}
			else {
				cardPath = CARD_PATHS['tall'][characterType] || CARD_PATHS['tall']['default'];	
			}
		}
		else {			
			if (characterQuality == 'Star'){
				cardPath = CARD_PATHS['wide-star'][characterType] || CARD_PATHS['wide-star']['default'];
			}
			else {
				cardPath = CARD_PATHS['wide'][characterType] || CARD_PATHS['wide']['default'];	
			}
		}
		
		return cardPath;
	}
	
	return {
		generate: generate,
		getSheet: getSheet
	}
})();