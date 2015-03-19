/**
 * Table.js
 * ============================================================================
 * 2009.06.22 - written by Robert Kurcina
 *
 *
 * INFORMATION
 * ----------------------------
 * Generates a standard table for displaying list objects.  The list
 * object is an object conforming to this pattern:
 *
 *	var listObj = {
 * 		'index1': { 'label1': 'labelValue1', 'label2': 'labelValue2' },
 * 		'index2': { 'label1': 'labelValue1', 'label2': 'labelValue2' }
 *	};
 *
 * Notice that the first key on each line is an index that references a disclosure 
 * object.  A descriptor object may also be passed into the function with the
 * list object.  If the list object is not available, the table headers will
 * be the member names of the the disclosure objects within the list object.  If
 * the descriptor object is passed in this will allow the table names to have
 * custom values.  Additionally, a CSS class value can be passed in via the
 * descriptor object.  The syntax is as follows:
 *
 * 	var descriptionObj = {
 *		'def1': 'header1',
 *		'def2': 'header2',
 *		...
 *		'defN': 'headerN',
 *		'className': 'CSS class',
 *		'tableCaption': 'caption'
 *		'headerClasses': { 'def1': 'class1', 'default': 'class2' },
 *		'bodyClasses': { 'def1': 'class3', 'default': 'class4' }
 *	};
 *
 * For example, assuming that the disclosure object is { 'label': 'Pistol', 'range': 32 }
 * The descriptor object could be created as { 'label': 'Weapon Name', 'range': 'Range (inches)', 'className': 'blue-table' }
 *
 * If no class property is provided, all tables generated will have the default
 * class 'dynamic-table'.  All classes will use the default cell alignment and
 * widths as defined by 'dynamic-table' unless described with sub-objects
 * 'headerClasses' and 'bodyClasses'.  Each of those sub-objects allow for a
 * default class to be assigned as well.  Lastly, a table caption can be provided
 * via the 'tableCaption' element which will be nested before the <thead> element.
 *
 *
 * STANDARD METHODS
 * ----------------------------
 * getTable()				-	returns nothing
 * getTable(d)				-	returns contents of list object d wrapped in an HTML table
 * getTable(d,n)			-	same as getTable(d) but header labels are defined by descriptor object n
 * getVerboseTable(d)		-	same as getTable(d) but shows the index column
 * getVerboseTable(d,n)		-	same as getTable(d,n) but shows the index column
 * getLabels(d)				-	returns the first non-index column of list object d
 * getLabels(d, i)			-	returns the index i of list object d
 * getCellValue(d, m, l, v) -	returns the cell value of list object d, for match key m and value v, for lookup column l
 *
 *
 * DISCLOSURE METHODS
 * ----------------------------
 *
**/
var Table = (function(){
	var getTableHeaderByDefault = function(listObj, bShowIndex){
		var resultHtml = "<thead>";	
		
		if (bShowIndex){ resultHtml += "<th>#</th>"; }
		
		for (var i in listObj){
			var disclosureObj = listObj[i];

			for (var key in disclosureObj){
				var headerLabel = key;
				resultHtml += "<th>" + headerLabel + "</th>";
			}
			
			break;
		}
		
		resultHtml += "</thead>";				

		return resultHtml;
	}
	
	var getTableBodyByDefault = function (listObj, bShowIndex){
		var resultHtml = "<tbody>";		

		for (var index in listObj){
			var itemObj = listObj[index];
			
			resultHtml += "<tr>";
			
			if (bShowIndex){ resultHtml += "<td>" + index + "</td>"; }
			
			for (var key in itemObj){
				var cellValue = itemObj[key];
				
				resultHtml += "<td>" + cellValue + "</td>";
			}
			
			resultHtml += "</tr>";
		}

		return resultHtml;
	}

	var getTableHeaderByDescriptor = function(listObj, descriptorObj, bShowIndex){
		var resultHtml = "<thead>";
		var headClasses = descriptorObj['headClasses'] || null;
		var defaultClass = (headClasses) ? "class='" + headClasses['default'] + "'" : "";

		if (bShowIndex){ resultHtml += "<th>#</th>"; }
		
		for (var i in listObj){
			var disclosureObj = listObj[i];	
			
			for (var key in disclosureObj){	
				var headerLabel = descriptorObj[key] || key;
				var headClass = defaultClass;
				
				if (headClasses){ 
					if(headClasses[key]){
						headClass = "class='" + headClasses[key] + "'";
					}
				}
				
				resultHtml += "<th " + headClass + ">" + headerLabel + "</th>";
			}
			
			break;
		}
		
		resultHtml += "</thead>";				

		return resultHtml;
	}	
	
	var getTableBodyByDescriptor = function (listObj, descriptorObj, bShowIndex){
		var resultHtml = "<tbody>";
		var bodyClasses = descriptorObj['bodyClasses'] || null;
		var defaultClass = (bodyClasses) ? "class='" + bodyClasses['default'] + "'" : "";	

		for (var index in listObj){
			var itemObj = listObj[index];
			
			resultHtml += "<tr>";
			
			if (bShowIndex){ resultHtml += "<td>" + index + "</td>"; }
			
			for (var key in itemObj){
				var cellValue = itemObj[key];
				var bodyClass = defaultClass;
				
				if (bodyClasses){ 
					if(bodyClasses[key]){
						bodyClass = "class='" + bodyClasses[key] + "'";
					}
				}
				
				resultHtml += "<td " + bodyClass + ">" + cellValue + "</td>";
			}
			
			resultHtml += "</tr>";
		}

		return resultHtml;
	}
	
	var getTable = function (listObj, descriptorObj, bShowIndex){
		var resultHtml = "";
		

		if (null == descriptorObj){
			var className = 'dynamic-table';
			
			resultHtml += "<table class='" + className + "'>";
			resultHtml += getTableHeaderByDefault(listObj, bShowIndex);
			resultHtml += getTableBodyByDefault(listObj, bShowIndex);
			resultHtml += "</table>";
		}
		else {			
			var className = descriptorObj.className || 'dynamic-table';
			var tableCaption = descriptorObj.tableCaption || "";
			
			var tableLine = (className) ? "<table class='" + className + "'>" : "<table>";
			var captionLine = (tableCaption) ? "<caption>" + tableCaption + "</caption>" : "";
			
			resultHtml += tableLine;
			resultHtml += captionLine;
			resultHtml += getTableHeaderByDescriptor(listObj, descriptorObj, bShowIndex);
			resultHtml += getTableBodyByDescriptor(listObj, descriptorObj, bShowIndex);
			resultHtml += "</table>";
		}
		
		return resultHtml;
	}
	
	var getCellValue = function (listObj, matchKey, lookupKey, matchValue){
		var cellValue = "";

		for (var i in listObj){
			var itemObj = listObj[i];
			
			if (itemObj[matchKey] == matchValue){				
				if (null == lookupKey){ return itemObj; }
				
				cellValue = itemObj[lookupKey];
				break;
			}
		}
		
		return cellValue;
	}
	
	var getLabels = function (listObj, column){
		var resultArr = [];

		for (var index in listObj){
			var itemObj = listObj[index];
			var currentColumn = 0;
			
			for (var key in itemObj){
				var cellValue = itemObj[key];							
				
				if (null == column || currentColumn == column || currentColumn > column) { resultArr.push(cellValue); break; }
				currentColumn++;
			}
		}

		return resultArr;
	}
	
	var getVerboseTable = function (listObj, descriptorObj){
		return getTable(listObj, descriptorObj, true);
	}
	
	return {
		getLabels: getLabels,
		getTable: getTable,
		getVerboseTable: getVerboseTable,
		getCellValue: getCellValue
	}
})();