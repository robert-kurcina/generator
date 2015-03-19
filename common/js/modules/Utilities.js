/**
 * Utilities.js
 * ============================================================================
 * 2009.06.24 - written by Robert Kurcina
 *
 *
 * INFORMATION
 * ----------------------------
 * Numerous methods for things that should have been in core javascript but should
 * not be in the global namespace nor should they be implement by over-riding or
 * extending core javascript functions.
 *
 *
 * ASSUMES
 * ----------------------------
 * none
 *
 *
 * STANDARD METHODS
 * ----------------------------
 * numericSort(a, bool)			-	sorts array a numerically instead of the default alpha order, if bool == true sort descending
 * sortOnKey(a, k, bool)		-	sorts an array of objects a using key k, if bool == true sort descending
 * trim(s)						-	trims leading and trailing white-space from s which can also be an array
 * clean(s)						- 	removes all white-space  from s which can also be an array
 * same(n,s)					-	returns true if the literal values are the same, ignoring case, but doesn't compare objects
 * firstLetter(n)				-	returns first letters
 * hasDigits(s)					-	return true if string s has one or more digits
 * hasAlphas(s)					-	return true if string s has one or more letters
 * isNumeric(s)					-	return true if string s is only digits
 * isDecimal(s)					-	return true if string s is a decimal as in 1.00
 * isTextOnly(s)				-	return true if string s contains only letters
 * isAlphaNumeric(s)			-	return true if string s contains only letters and digits
 * isEmpty(s)					-	return true if string s is null or empty string
 * lookup(o, s)					-	returns value of object o for key s independent of case
 * contains(a,s)				-	returns true if array a contains string s
 * uniques(s, boolean)			-	given an array, return only the unique values, sorted if boolean is 'true'
 * wikify(s)					-	converts newlines \n to <br/>, \t+-- to <ul><li>, ---{3,} to <hr/>, and ={1,3}\w+={1,3}[\s|\n]+ to headers
 * properCase(s)				-	converts s into Proper Name Format
 * sleep(n)						-	sleep for n milliseconds
 * merge(o1, o2, ... oN)		-	combines either multiple value objects or arrays; array may contain duplicate entries
 * disclose(o)					-	essentially o.toString()
 * digits(s)					-	returns the first set of numbers in an alphanumeric string, or zero
 * enumeration(n,o,i)			-	given object list 0 and dice defintion i for indexing, returns array [N1 x item1, N2 x item2, etc] for n elements
 *
 * DISCLOSURE METHODS
 * ----------------------------
 * 
 *
**/
var Utilities = (function(){
	var CHAR_DIGITS = "0123456789";
	var CHAR_ALPHAS =  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var CHAR_ALPHANUMERIC = CHAR_DIGITS + CHAR_ALPHAS;
	
	var numericSort = function (givenArray, bDescending){
		var descending = function (a, b){ return (digits(b) - digits(a)); } 
		var ascending = function (a, b){ return (digits(a) - digits(b)); }
		
		if (bDescending){ return givenArray.sort( descending ); }
		else { return givenArray.sort( ascending ); }
	}
	
	var sortOnKey = function (givenArray, key, bDescending){
		var descending = function (a, b){ return (b[key] - a[key]); } 
		var ascending = function (a, b){ return (a[key] - b[key]); }
		
		if (bDescending){ return givenArray.sort( descending ); }
		else { return givenArray.sort( ascending ); }
	}
	
	var trimString = function (givenStr){
		if (null == givenStr){ return ""; }
		
		var  temp = givenStr.replace(/^\s*/, "");
		temp = temp.replace(/\s*$/, "");
		
		return temp;
	}
	
	var trimArray = function (givenList){		
		if (null == givenList){ return ""; }
		if (typeof givenList == 'string'){ return trimString(givenList); }
		
		var tempArr = [];
	
		for (var i = 0; i < givenList.length; i++){
			var item = givenList[i];
			
			tempArr.push(trimString(item));
		}
		
		return tempArr;
	}
	
	var cleanString = function (givenStr){
		return givenStr.replace(/\s/g, "");
	}
	
	var cleanArray = function (givenList){
		if (null == givenList){ return ""; }
		if (typeof givenList == 'string'){ return cleanString(givenList); }
		
		var tempArr = [];
		
		for (var i = 0; i < givenList.length; i++){
			var item = givenList[i];
			
			tempArr.push(cleanString(item));
		}
		
		return tempArr;
	}
	
	var sameValue = function (first, second){
		if (first == null && second == null){ return true; }
		if (first == null || second == null){ return false; }
		
		if (typeof first == 'string' && typeof second == 'string'){		
			var tempFirst = first.toUpperCase();
			var tempSecond = second.toUpperCase();
			
			return (tempFirst == tempSecond);
		}
		
		if (typeof first == 'number' && typeof second == 'number'){
			return ( first == second);
		}
		
		if (typeof first == 'string' && typeof second == 'number'){
			return ( (1 * first) == second);
		}
		
		if (typeof first == 'number' && typeof second == 'string'){
			return ( (1 * second) == first);
		}
		
		return (first == second);
	}
	
	var firstLetter = function (givenStr){
		if (givenStr == null){ return ""; }
		
		return givenStr.substring(0,1);
	}
	
	var hasDigits = function (myString){
		for (var i = 0; i < CHAR_DIGITS.length; i++){		
			var myDigit = CHAR_DIGITS.substr(i, 1);
			if (myString.indexOf(myDigit) != -1){ return true; }
		}
		return false;	
	}
	
	var hasAlphas = function (myString){
		for (var i = 0; i < CHAR_ALPHAS.length; i++){		
			var myLetter = CHAR_ALPHAS.substr(i, 1);
			if (myString.indexOf(myLetter) != -1){ return true; }
		}
		return false;	
	}
	
	var isNumeric = function (myString){
		for (var i = 0; i < myString.length; i++){
			var myLetter = myString.substr(i, 1);
			if (CHAR_DIGITS.indexOf(myLetter) == -1) { return false; }
		}
		return true;
	}
	
	var isDecimal = function (myString){
		var num_periods = 0;
	
		for (var i = 0; i < myString.length; i++){		
			var myLetter = myString.substr(i, 1);
			if (CHAR_DIGITS.indexOf(myLetter) == -1) { return false; }
			if (myLetter == '.'){ num_periods++; }
		}
		
		if (myLetter == '.'){ return false; }
		if (num_periods > 1){ return false; }
		if (num_periods == 0){ return false; }
		
		return true;
	}
	
	var isTextOnly = function (myString){
		for (var i = 0; i < myString.length; i++){
			var myLetter = myString.substr(i, 1);
			
			if (CHAR_ALPHAS.indexOf(myLetter) == -1) { return false; }
		}
		return true;
	}
	
	var isAlphaNumeric = function (myString){
		for (var i = 0; i < myString.length; i++){
			var myLetter = myString.substr(i, 1);
			
			if (CHAR_ALPHANUMERIC.indexOf(myLetter) == -1) { return false; }
		}
		return true;
	}
	
	var isEmpty = function (myString){
		if (myString == '' || myString == null){ return true; }
		
		return false;
	}
	
	var lookup = function (givenObj, givenStr){
		for (var i in givenObj){
			var value = i.toUpperCase();
			
			if (givenStr.toUpperCase() == value){
				return (givenObj[i]);
			}
		}
		
		return "";
	}
	
	var contains = function (givenArr, givenStr){
		var temp = givenArr.join("::::");
		
		if (temp.indexOf(givenStr) != -1){ return true; }
		
		return false;	
	}
	
	var uniques = function (givenArr, bSorted){
		var finalArr = [];
		var finalObj = {};
		
		for (var i in givenArr){
			var item = givenArr[i];
			
			if (finalObj[item]){ continue; }
			
			finalArr.push(item);
			finalObj[item] = 1;
		}
		
		if (bSorted){ return finalArr.sort(); }
		
		return finalArr;
	}
	
	var wikify = function (givenStr){
		var temp = givenStr;

		temp = temp.replace(/===\s(.*)\s===[\s|\n]+/g, "<h1>$1<\/h1>");
		temp = temp.replace(/==\s(.*)\s==[\s|\n]+/g, "<h2>$1<\/h2>");
		temp = temp.replace(/=\s(.*)\s=[\s|\n]+/g, "<h3>$1<\/h3>");
		temp = temp.replace(/-{3,}/g, "<hr/>");
		temp = temp.replace(/\n/g, "<br/>");
		temp = temp.replace(/https?:\/\/([-\w\.]+)+(:\d+)?(\/([\w/_\.]*(\?\S+)?)?)?/g, "<a href='$1'>$1</a>");
		
		return temp;
	}
	
	var properCase = function (givenStr) {
		return givenStr.replace(/\b([a-z])/g, function (_, initial) {
			return initial.toUpperCase();
		});
	}
	
	var sleep = function (milliseconds){      
	  var startTime = new Date().getTime();
	  var done = false;
	
	  while(!done){
	     var currentTime = new Date().getTime();
	     
	     if(currentTime - startTime > milliseconds){ done = true; }
	  }
	}
   
	var merge = function (){
		if (null == arguments){ return; }
		if (arguments.length == 1){ return; }
		
		if (arguments[0] instanceof Array){
			var temp = [];

			for (var arg = 0; arg < arguments.length; arg++){
				temp = temp.concat(arguments[arg]);
			}
	    }
	    else {
			var temp = {};
			
			for (var arg = 0; arg < arguments.length; arg++){
				var givenOptions = arguments[arg];
				
				for (var i in givenOptions){
					temp[i] = givenOptions[i];	
				}
			}
	    }
	    
	    return temp;
    }
    
    var disclose = function (given){
	    var outputStr = "";
	    
		if (given instanceof Array){
			outputStr += "[ ";
			
			for (var i = 0; i < given.length; i++){
				var element = given[i];
				
				if (typeof element == 'object' || element == 'function'){
					output += "\n" + disclose(element);	
				}				
				else {
					outputStr += element + ",";
				}
			}
			outputStr += " ]";	
		}
		else if (given instanceof Object){
			outputStr += "{ ";
			
			for (var key in given){
				var element = given[key];
				
				if (typeof element == 'object' || element == 'function'){
					output += "\n" + disclose(element);	
				}				
				else {
					outputStr += key + ": " + element + ", ";
				}
			}
			
			outputStr += " }";	
		}
		else {
			outputStr += given;	
		}

		return outputStr;
    }
    
    var digits = function (givenStr){
	    if (isNumeric(givenStr)){ return givenStr; }
		return givenStr.match(/\d+/) || 0;
    }
    
    var getEnumeratedResult = function (count, objectList, diceDefintion){
		var tempObj = {};

		if (count == 0){ return ["None"]; }
		
		for (var i = 0; i < count; i++){
			var index = Dice.rollDice(diceDefintion).score;
			var item = objectList[index].label;
			
			if (tempObj[item]){
				tempObj[item] = tempObj[item] + 1;
			}
			else {
				tempObj[item] = 1;
			}
		}
		
		var resultArr = [];
		
		for (var key in tempObj){
			var count = tempObj[key];
			
			resultArr.push(count + " x " + key);
		}		
		
		return Utilities.numericSort(resultArr, true);
	}

	return {
		numericSort: numericSort,
		sortOnKey: sortOnKey,
		trim: trimArray,
		clean: cleanString,
		same: sameValue,
		firstLetter: firstLetter,
		hasDigits: hasDigits,
		hasAlphas: hasAlphas,
		isNumeric: isNumeric,
		isDecimal: isDecimal,
		isTextOnly: isTextOnly,
		isAlphaNumeric: isAlphaNumeric,
		isEmpty: isEmpty,
		lookup: lookup,
		contains: contains,
		uniques: uniques,
		wikify: wikify,
		properCase: properCase,
		sleep: sleep,
		merge: merge,
		disclose: disclose,
		digits: digits,
		enumerate: getEnumeratedResult
	}
})();