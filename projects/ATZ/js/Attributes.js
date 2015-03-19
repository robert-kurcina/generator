/**
 * Attributes.js
 * ============================================================================
 * 2009.06.22 - written by Robert Kurcina
 *
 *
 * INFORMATION
 * ----------------------------
 * Generates character attributes.  The disclosure object retrieved contains a list object and a string which is the list object joined using ", ".
 *
 * ASSUMES
 * ----------------------------
 * Table.js load
 * Utilities.js loaded
 * Dice.js loaded
 *
 *
 * STANDARD METHODS
 * ----------------------------
 * getAttribute()				-	generate a single random attribute
 * getAttribute(r)				-	generate a single random attribute; if r is '*' generates only good attributes
 * getAttributes()				-	same as getAttribute
 * getAttributes(n)				-	generates n random attributes
 * getAttributes(n, r)			-	generates n random attributes; if r is '*' generates only good attributes
 *
 *
 * DISCLOSURE METHODS
 * ----------------------------
 * getAllInfo()
 *
**/
var Attributes = (function(){	
	var attributesList = {
		'2': { 'label': '+Born Leader' },
		'3': { 'label': '-Poser' },
		'4': { 'label': function(){ return Dice.rollDie().score <= 3 ? "+Agile" : "-Dumbass"; }()},
		'5': { 'label': '-Slow' },
		'6': { 'label': function(){ return Dice.rollDie().score <= 4 ? "+Brawler" : "+Ambidextrous"; }()},
		'7': { 'label': function(){ var diceScore = Dice.rollDie().score; if (diceScore < 3){ return "-Slow To React"; } else if (diceScore < 5){ return "-Vanilla" } else { return "+Stone Cold"; } }()},
		'8': { 'label': function(){ return Dice.rollDie().score <= 3 ? "+Knifeman" : "+Athlete"; }()},
		'9': { 'label': function(){ return Dice.rollDie().score <= 3 ? "-Wuss" : "-Runt"; }()},
		'10': { 'label': function(){ return Dice.rollDie().score <= 2 ? "+Transporter" : "+Marksman"; }()},
		'11': { 'label': '-Clumsy' },
		'12': { 'label': '+Nerves Of Steel' }
	};

		
	var getAttribute = function (givenRep){
		var attributeObj = getSingleAttribute(givenRep);

		return getDisclosureObject(new Array(attributeObj.label));
	}
	
	var getAttributes = function (number, givenRep){
		if (null == number){ return getAttribute(givenRep); }
		
		var uniquenessObj = {};
		var uniqueness = "";
		var attributes = [];
		
		while (attributes.length < number){
			var attributeObj = getSingleAttribute(givenRep);
			var attributeName = attributeObj.label;		
			
			if (uniqueness.indexOf(attributeName) == -1){
				uniqueness += attributeName;
				attributes.push(attributeName);
			}
		}
		
		return getDisclosureObject(attributes.sort());
	}
	
	var getSingleAttribute = function (givenRep){
		var found = false;
		var attributeObj;
		
		while (!found){
			var diceScore = Dice.rollDice(2,6).score;
			attributeObj = attributesList[diceScore];
			
			if (givenRep == '*'){
				if (Utilities.firstLetter(attributeObj.label) == '+'){
					found = true;				
				}
			}
			else {
				found = true;
			}
		}
		
		return attributeObj;
	}
	
	var getAllInfo = function (){
		return attributesList;
	}
	
	var getDisclosureObject = function (attributes){
		return {
			'attributes': attributes.join(", "),
			'list': attributes,
			'toString': function (){ return toString(this); }
		};
	}
	
	var toString = function (disclosureObj){
		var resultStr = "";		
		var list = disclosureObj.list || "";
		var attributes = disclosureObj.attributes || "";
		
		return Table.getTable( {'table': {
			'list': list,
			'attributes': attributes
		}});
	}
	
	return {
		getAttribute: getAttribute,
		getAttributes: getAttributes,
		getAllInfo: getAllInfo
	}
})();