var thisPlotContext = null;
var thisChart = null;
var chartDataRepresentation = null;

var contrastingColors = ["#f00", "#0f0", "#00f", "#000", "#0ff", "#f0f", "#f70", 
						 "#777", "#f07", "#707", "#77f", "#f77",
						 "#bf0000", "#f29979", "#ffa640", "#b2aa2d", "#e6f2b6", "#829973", "#00736b", "#164c59", "#00294d", "#80a2ff", "#6d00cc", "#3d004d", "#ff00ee", "#992645", "#660000", "#e55c00", "#7f5320", "#e2f200", "#354020", "#008033", "#3df2e6", "#739199", "#b6cef2", "#000033", "#d580ff", "#944d99", "#ff40a6", "#400009", "#403230", "#662900", "#33210d", "#475900", "#74d900", "#3df285", "#00c2f2", "#0080bf", "#3056bf", "#504d66", "#eabfff", "#322633", "#ff0044", "#d9a3aa"];
var contrastingColorIdx = 0;


/*
	DEFINITION OF HOW MANY PARTS EACH <<module>> HAS TO MAKE RELATIVE PLOTS POSSIBLE
*/

// FOR STRIPS

var stripsPerAPV = 128;

var tidModulesPerDisk = 24 * 2 + 24 * 2 + 40;
var tidAPVsPerDisk = 24 * 2 * 6 + 24 * 2 * 6 + 40 * 4;

var tecModulesPerDisk123 = 24 * 2 + 24 * 2 + 40 + 56 + 40 * 2 + 56 + 80;
var tecModulesPerDisk456 =          24 * 2 + 40 + 56 + 40 * 2 + 56 + 80;
var tecModulesPerDisk78  =                 + 40 + 56 + 40 * 2 + 56 + 80;
var tecModulesPerDisk9   =          			  56 + 40 * 2 + 56 + 80;

var tecAPVsPerDisk123 = 24 * 2 * 6 + 24 * 2 * 6 + 40 * 4 + 56 * 4 + 40 * 2 * 6 + 56 * 4 + 80 * 4;
var tecAPVsPerDisk456 =              24 * 2 * 6 + 40 * 4 + 56 * 4 + 40 * 2 * 6 + 56 * 4 + 80 * 4;
var tecAPVsPerDisk78  =                           40 * 4 + 56 * 4 + 40 * 2 * 6 + 56 * 4 + 80 * 4;
var tecAPVsPerDisk9   =                                    56 * 4 + 40 * 2 * 6 + 56 * 4 + 80 * 4;

// FOR PIXEL

var rocsInModule = 16;
var colsInRoc = 52;
var endcapRing1Modules = 44;
var endcapRing2Modules = 68;
var endcapDiskModules = endcapRing1Modules + endcapRing2Modules;
var endcapTotalModules = 672;

var totalSubModuleCnt = {
	//https://web.physik.rwth-aachen.de/~klein/eps.pdf
	//http://abbaneo.web.cern.ch/abbaneo/cms/layout/whole.html
	"Strip" : [15148, 72784 / 2, 72784, 72784 * stripsPerAPV], //MODULES, FIBERS, APVS, STRIPS

	"TEC" : [6400, 30208 / 2, 30208, 30208 * stripsPerAPV],
	"TIB" : [2724, 13968 / 2, 13968, 13968 * stripsPerAPV],
	"TID" : [tidModulesPerDisk * 6, tidAPVsPerDisk * 6 / 2, tidAPVsPerDisk * 6, tidAPVsPerDisk * 6 * stripsPerAPV],
	"TOB" : [5208, 24192 / 2, 24192, 24192 * stripsPerAPV],

	"TIB Layer 1" : [336 * 2, 4032 / 2, 4032, 4032 * stripsPerAPV],
	"TIB Layer 2" : [432 * 2, 5184 / 2, 5184, 5184 * stripsPerAPV],
	"TIB Layer 3" : [540, 	  2160 / 2, 2160, 2160 * stripsPerAPV],
	"TIB Layer 4" : [648, 	  2592 / 2, 2592, 2592 * stripsPerAPV],

	"TID+ Disk 1" : [tidModulesPerDisk, tidAPVsPerDisk / 2, tidAPVsPerDisk, tidAPVsPerDisk * stripsPerAPV],
	"TID+ Disk 2" : [tidModulesPerDisk, tidAPVsPerDisk / 2, tidAPVsPerDisk, tidAPVsPerDisk * stripsPerAPV],
	"TID+ Disk 3" : [tidModulesPerDisk, tidAPVsPerDisk / 2, tidAPVsPerDisk, tidAPVsPerDisk * stripsPerAPV],
	"TID- Disk 1" : [tidModulesPerDisk, tidAPVsPerDisk / 2, tidAPVsPerDisk, tidAPVsPerDisk * stripsPerAPV],
	"TID- Disk 2" : [tidModulesPerDisk, tidAPVsPerDisk / 2, tidAPVsPerDisk, tidAPVsPerDisk * stripsPerAPV],
	"TID- Disk 3" : [tidModulesPerDisk, tidAPVsPerDisk / 2, tidAPVsPerDisk, tidAPVsPerDisk * stripsPerAPV],

	"TOB Layer 1" : [504 * 2, 4032 / 2, 4032, 4032 * stripsPerAPV],
	"TOB Layer 2" : [576 * 2, 4608 / 2, 4608, 4608 * stripsPerAPV],
	"TOB Layer 3" : [648, 	  2592 / 2, 2592, 2592 * stripsPerAPV],
	"TOB Layer 4" : [720, 	  2880 / 2, 2880, 2880 * stripsPerAPV],
	"TOB Layer 5" : [792, 	  4752 / 2, 4752, 4752 * stripsPerAPV],
	"TOB Layer 6" : [888, 	  5328 / 2, 5328, 5328 * stripsPerAPV],

	"TEC+ Disk 1" : [tecModulesPerDisk123, tecAPVsPerDisk123 / 2, tecAPVsPerDisk123, tecAPVsPerDisk123 * stripsPerAPV],
	"TEC+ Disk 2" : [tecModulesPerDisk123, tecAPVsPerDisk123 / 2, tecAPVsPerDisk123, tecAPVsPerDisk123 * stripsPerAPV],
	"TEC+ Disk 3" : [tecModulesPerDisk123, tecAPVsPerDisk123 / 2, tecAPVsPerDisk123, tecAPVsPerDisk123 * stripsPerAPV],
	"TEC+ Disk 4" : [tecModulesPerDisk456, tecAPVsPerDisk456 / 2, tecAPVsPerDisk456, tecAPVsPerDisk456 * stripsPerAPV],
	"TEC+ Disk 5" : [tecModulesPerDisk456, tecAPVsPerDisk456 / 2, tecAPVsPerDisk456, tecAPVsPerDisk456 * stripsPerAPV],
	"TEC+ Disk 6" : [tecModulesPerDisk456, tecAPVsPerDisk456 / 2, tecAPVsPerDisk456, tecAPVsPerDisk456 * stripsPerAPV],
	"TEC+ Disk 7" : [tecModulesPerDisk78,  tecAPVsPerDisk78 / 2,  tecAPVsPerDisk78 , tecAPVsPerDisk78  * stripsPerAPV],
	"TEC+ Disk 8" : [tecModulesPerDisk78,  tecAPVsPerDisk78 / 2,  tecAPVsPerDisk78 , tecAPVsPerDisk78  * stripsPerAPV],
	"TEC+ Disk 9" : [tecModulesPerDisk9,   tecAPVsPerDisk9 / 2,   tecAPVsPerDisk9  , tecAPVsPerDisk9   * stripsPerAPV],

	"TEC- Disk 1" : [tecModulesPerDisk123, tecAPVsPerDisk123 / 2, tecAPVsPerDisk123, tecAPVsPerDisk123 * stripsPerAPV],
	"TEC- Disk 2" : [tecModulesPerDisk123, tecAPVsPerDisk123 / 2, tecAPVsPerDisk123, tecAPVsPerDisk123 * stripsPerAPV],
	"TEC- Disk 3" : [tecModulesPerDisk123, tecAPVsPerDisk123 / 2, tecAPVsPerDisk123, tecAPVsPerDisk123 * stripsPerAPV],
	"TEC- Disk 4" : [tecModulesPerDisk456, tecAPVsPerDisk456 / 2, tecAPVsPerDisk456, tecAPVsPerDisk456 * stripsPerAPV],
	"TEC- Disk 5" : [tecModulesPerDisk456, tecAPVsPerDisk456 / 2, tecAPVsPerDisk456, tecAPVsPerDisk456 * stripsPerAPV],
	"TEC- Disk 6" : [tecModulesPerDisk456, tecAPVsPerDisk456 / 2, tecAPVsPerDisk456, tecAPVsPerDisk456 * stripsPerAPV],
	"TEC- Disk 7" : [tecModulesPerDisk78,  tecAPVsPerDisk78 / 2,  tecAPVsPerDisk78 , tecAPVsPerDisk78  * stripsPerAPV],
	"TEC- Disk 8" : [tecModulesPerDisk78,  tecAPVsPerDisk78 / 2,  tecAPVsPerDisk78 , tecAPVsPerDisk78  * stripsPerAPV],
	"TEC- Disk 9" : [tecModulesPerDisk9,   tecAPVsPerDisk9 / 2,   tecAPVsPerDisk9  , tecAPVsPerDisk9   * stripsPerAPV],

	////////////////////////////////////////////////////////////////////////////////////////

	"Pixel" : [0, 0, 0, 0, 0],

	"Barrel Total" : [1184 * rocsInModule, 1184 * rocsInModule, 0, 0, 1184 * rocsInModule * colsInRoc / 2, 1184 * rocsInModule * colsInRoc],
	"Barrel Layer 1" : [96 * rocsInModule, 96 * rocsInModule, 0, 0, 96 * rocsInModule * colsInRoc / 2, 96 * rocsInModule * colsInRoc],
	"Barrel Layer 2" : [224 * rocsInModule, 224 * rocsInModule, 0, 0, 224 * rocsInModule * colsInRoc / 2, 224 * rocsInModule * colsInRoc],
	"Barrel Layer 3" : [352 * rocsInModule, 352 * rocsInModule, 0, 0, 352 * rocsInModule * colsInRoc / 2, 352 * rocsInModule * colsInRoc],
	"Barrel Layer 4" : [512 * rocsInModule, 512 * rocsInModule, 0, 0, 512 * rocsInModule * colsInRoc / 2, 512 * rocsInModule * colsInRoc],

	"Endcap Total" : [endcapTotalModules * rocsInModule, endcapTotalModules * rocsInModule, 0, 0, 0, 0],

	"Ring 1 Disk 1" : [endcapRing1Modules * rocsInModule, endcapRing1Modules * rocsInModule, 0, 0, 0, 0],
	"Ring 1 Disk 2" : [endcapRing1Modules * rocsInModule, endcapRing1Modules * rocsInModule, 0, 0, 0, 0],
	"Ring 1 Disk 3" : [endcapRing1Modules * rocsInModule, endcapRing1Modules * rocsInModule, 0, 0, 0, 0],

	"Ring 1 Disk- 1" : [endcapRing1Modules * rocsInModule, endcapRing1Modules * rocsInModule, 0, 0, 0, 0],
	"Ring 1 Disk- 2" : [endcapRing1Modules * rocsInModule, endcapRing1Modules * rocsInModule, 0, 0, 0, 0],
	"Ring 1 Disk- 3" : [endcapRing1Modules * rocsInModule, endcapRing1Modules * rocsInModule, 0, 0, 0, 0],

	"Ring 2 Disk 1" : [endcapRing2Modules * rocsInModule, endcapRing2Modules * rocsInModule, 0, 0, 0, 0],
	"Ring 2 Disk 2" : [endcapRing2Modules * rocsInModule, endcapRing2Modules * rocsInModule, 0, 0, 0, 0],
	"Ring 2 Disk 3" : [endcapRing2Modules * rocsInModule, endcapRing2Modules * rocsInModule, 0, 0, 0, 0],

	"Ring 2 Disk- 1" : [endcapRing2Modules * rocsInModule, endcapRing2Modules * rocsInModule, 0, 0, 0, 0],
	"Ring 2 Disk- 2" : [endcapRing2Modules * rocsInModule, endcapRing2Modules * rocsInModule, 0, 0, 0, 0],
	"Ring 2 Disk- 3" : [endcapRing2Modules * rocsInModule, endcapRing2Modules * rocsInModule, 0, 0, 0, 0],

	// NOISE AND IDCs ARE NOT REPORTED PER RING BUT THE WHOLE DISK
	"Disk 1" : [0, 0, 0, 0, endcapDiskModules * rocsInModule * colsInRoc / 2, endcapDiskModules * rocsInModule * colsInRoc],
	"Disk 2" : [0, 0, 0, 0, endcapDiskModules * rocsInModule * colsInRoc / 2, endcapDiskModules * rocsInModule * colsInRoc],
	"Disk 3" : [0, 0, 0, 0, endcapDiskModules * rocsInModule * colsInRoc / 2, endcapDiskModules * rocsInModule * colsInRoc],

	"Disk- 1" : [0, 0, 0, 0, endcapDiskModules * rocsInModule * colsInRoc / 2, endcapDiskModules * rocsInModule * colsInRoc],
	"Disk- 2" : [0, 0, 0, 0, endcapDiskModules * rocsInModule * colsInRoc / 2, endcapDiskModules * rocsInModule * colsInRoc],
	"Disk- 3" : [0, 0, 0, 0, endcapDiskModules * rocsInModule * colsInRoc / 2, endcapDiskModules * rocsInModule * colsInRoc],

}

var linearScaleOptions = [{
	id: 'y-axis-0',
	display: true,
	type: 'linear',
	position: 'left',
	scaleLabel: {
        display: true,
        labelString: 'Bad Components / Value',
        fontSize : 24,
    },
	ticks:{
		suggestedMin: 0,
    	// min: 0,
	}
}];

var logarithmicScaleOptions = [{
    id: 'y-axis-0',
    display: true,
    type: 'logarithmic',
    position: 'left',
    scaleLabel: {
        display: true,
        labelString: 'Bad Components / Value',
        fontSize : 24,
    },
    ticks:{
    	suggestedMin: 0,
    	// min: 0,
    }
}];

function getScaleOptions(is_linear, is_relativeValues){

	var scale = is_linear ? linearScaleOptions : logarithmicScaleOptions;
	// console.log(is_relativeValues);
	scale[0].scaleLabel.labelString = is_relativeValues ? 'Bad Components / Value [%]' : 'Bad Components / Value';

	return scale;
}

function intToStrWithLeadingZeros(num, size=5){ 
	return ('00000' + num).substr(-size); 
}

function changeAxisType(is_linear, is_relativeValues)
{
	thisChart.options.scales.yAxes = Chart.helpers.scaleMerge(Chart.defaults.scale, {yAxes: getScaleOptions(is_linear, is_relativeValues)}).yAxes;

	Object.keys(thisChart.scales).forEach(function (axisName) {
        var scale = thisChart.scales[axisName];
        Chart.layoutService.removeBox(thisChart, scale);
    });
    Chart.layoutService.removeBox(thisChart, thisChart.titleBlock);
    Chart.layoutService.removeBox(thisChart, thisChart.legend);

    thisChart.initialize();
	thisChart.update();
}

function generateRandomColor(){
	var R = Math.floor(Math.random() * 255);
	var G = Math.floor(Math.random() * 255);
	var B = Math.floor(Math.random() * 255);

	return "rgb(" + R + ", " + G + ", " + B + ")";
}

function getColorFromTable()
{
	return contrastingColors[contrastingColorIdx++ % contrastingColors.length];
}

function getRandomColorFromTable()
{
	var val = Math.floor(Math.random() * (contrastingColors.length + 1));
	return contrastingColors[val];
}

function sortData(a, b)
{
	return a.x - b.x;
}

function convertMinmaxModuleNameIntoLabel(moduleName)
{
	var tmpName = moduleName.substr(1);
	var tmpNameArr = tmpName.split(" ");
	tmpName = $("#" + tmpNameArr[1] + "-title").html();

	var filterID = $.trim($("#minmax-selection-filterArea #minmaxDetIDFilter").val());

	if (filterID !== "")
	{
		return "Among " + tmpNameArr[0] + " " + tmpName + " (" + filterID + ")";
	}
	return tmpNameArr[0] + " " + tmpName;
}

function getChartDataRepresentation(data, is_runByRunOn, is_superimpose, is_relativeValues, options)
{
	var labels = [];
	var datasets = [];
	contrastingColorIdx = 0;

	// maybe better would be to grab it from $().innerhtml
	var strOptionStr = [": Modules", ": Fibers" , ": APVs" , ": Strips"];
	var pxoptionStr = [": Dead ROCs", ": Inefficient ROCs", ": Mean Occupancy", ": # of Clusters", ": # of Inefficient DCols", ": # of Noisy Pixel Columns"];

	var superimposedDataset = {label : "",
								data : [],
								borderWidth: 4,
				            	borderColor: getColorFromTable(),
				            	fill: true,
				            	steppedLine: true,
				            	// cubicInterpolationMode: 'monotone',
				            	pointHoverBorderWidth : 10};

	for (var bxpx in data.data)
	{
		var bxpxData = data.data[bxpx];

		for (var moduleName in bxpxData) //gets for example TEC+ DISK 7
	    {
			var runsArr = bxpxData[moduleName];
			var cnt = 0;

			var vals = [[], [], [], [], [], []];

			for (var runNum in runsArr)
			{
				if (is_runByRunOn)
				{
					if ($.inArray(runNum, labels) === -1){
						labels.push(runNum);
					}
				}
				else
				{
					if ($.inArray(runNum + ".00000", labels) === -1)
					{
						for (var lumi = 0; lumi < data.runInfo[runNum].lbs; ++lumi)
						{
							labels.push(runNum + "." + intToStrWithLeadingZeros(lumi));
						}
					} 
				}

			    var allVals = runsArr[runNum];

			    if (moduleName.startsWith("!")) // dealing with extreme components trend
			    {
			    	if (!is_relativeValues)
			    	{
				    	if (is_runByRunOn)
				    	{
				    		vals[0].push({x : runNum,
						    			  y : runsArr[runNum],
						    			  rawValue: runsArr[runNum],
						    			  weight: 0
						    		      });
				    	}
				    	else
				    	{
		    				for (var lumi = 0; lumi < data.runInfo[runNum].lbs; ++lumi)
							{
								vals[0].push({x : runNum + "." + intToStrWithLeadingZeros(lumi),
					    					  y : runsArr[runNum],
					    					  rawValue: runsArr[runNum],
						    			  	  weight: 0
					    					 });
							}
				    	}		    		
			    	}
			    }	
			    else
			    {
				    for (var i = 0; i < allVals.length; ++i)
				    {
				    	if (allVals[i] != -1)
				    	{
				    		var valueToPush = allVals[i];
				    		var weight = 0;
				    		if (is_relativeValues) // because I do not have dictionary for strip
				    		{
				    			if (totalSubModuleCnt[moduleName][i])
				    				weight = (totalSubModuleCnt[moduleName][i] * 0.01);
				    				valueToPush /= weight;
				    		}

				    		if (!is_relativeValues || (is_relativeValues && weight))
				    		{
				    			if (is_runByRunOn)
					    		{
					    			vals[i].push({x : runNum,
						    					  y : valueToPush,
						    					  rawValue : allVals[i],
						    					  weight: weight
						    					 });
					    		}
					    		else
					    		{
					    			for (var lumi = 0; lumi < data.runInfo[runNum].lbs; ++lumi)
									{
										vals[i].push({x : runNum + "." + intToStrWithLeadingZeros(lumi),
							    					  y : valueToPush,
							    					  rawValue : allVals[i],
							    					  weight : weight,
							    					 });
									}
					    		}
				    		}		
				    	}
				    }
				}
			    cnt++;
			}
			// console.log("Current dataset length: " + cnt);
			// console.log(vals);

			for (var i = 0; i < vals.length; ++i)
			{
				if (vals[i].length)
				{
					if (is_superimpose && datasets.length != 0) 
					{
						var dataSum = superimposedDataset.data;
						var labelSum = superimposedDataset.label;
						// console.log(dataSum);

						xs = vals[i].map(function(v){return v.x;});
						// console.log(xs);

						//FIND CORRESPONDING BIN IN SUPERIMPOSED DATA TO ACCUMULATE NEW VALUE IN IT
						for (j in dataSum)
						{
							d = xs.indexOf(superimposedDataset.data[j].x);

							// console.log(data);
							if (d == -1) continue;
							superimposedDataset.data[j].y += vals[i][d].rawValue;
							superimposedDataset.data[j].weightSum += vals[i][d].weight;
						}
						superimposedDataset.data = dataSum;
					}
					else if (is_superimpose && datasets.length == 0)
					{
						for (var j = 0; j < vals[i].length; ++j)
						{
							superimposedDataset.data.push({x : vals[i][j].x,
														   y : vals[i][j].rawValue,
														   weightSum : vals[i][j].weight});
						}
					}

					var currentLabel = "";
					if (moduleName.startsWith("!")){
						currentLabel = convertMinmaxModuleNameIntoLabel(moduleName);
					}
					else{
						currentLabel = moduleName + ((bxpx == "STR") ? strOptionStr[i] : pxoptionStr[i]);
					}

					var mean = 0;
					for (var l = 0; l < vals[i].length; ++l)
					{
						mean += vals[i][l].y;
					}
					mean /= vals[i].length;

					var strippedValue = ((mean >= 1.0) ? mean.toFixed(2) : mean.toPrecision(2));
					datasets.push({
						label : currentLabel + ": " + strippedValue + ((is_relativeValues) ? "%" : ""),
						data : vals[i],
						borderWidth: 2,
						//borderDash: [5, ((is_relativeValues) ? 5 : 0)],
		            	// borderColor: generateRandomColor(),
		            	borderColor: getColorFromTable(),
		            	fill: false,
		            	steppedLine: true,
		            	pointHoverBorderWidth : 10,

		            	// xAxisID: "x-axis-2",
					})
				}
			}
	    }
	}

	if (is_superimpose && datasets.length > 0)
	{
		// only now weights can be applied correctly to the superimposed trend
		// console.log("Before normalization:");
		// console.log(superimposedDataset.data);

		var mean = 0;

		for (var i = 0; i < superimposedDataset.data.length; ++i)
		{
			if (superimposedDataset.data[i].weightSum){
				superimposedDataset.data[i].y /= superimposedDataset.data[i].weightSum;				
			}
			mean += superimposedDataset.data[i].y;
		}
		mean /= superimposedDataset.data.length;

		var strippedValue = ((mean >= 1.0) ? mean.toFixed(2) : mean.toPrecision(2));		
		superimposedDataset.label = "Average = " + strippedValue + ((is_relativeValues) ? "%" : "");

		datasets.push(superimposedDataset);
	}

	// console.log("Labels:\n" + labels.sort());

	// TO MAKE IT EVERYTHING WORK (PROBABLY, WILL FIX PAN&ZOOM PLUGIN ALSO)
	// + LETS FILL IT 'OLD WAY'
	// + SORT ALL LABELS
	// + REASSIGN 'X' WHICH WILL BE THE INDEX OF ITS PLACE IN SORTED LABELS
	// + USE https://stackoverflow.com/questions/44041583/vertical-line-with-annotation-plugin-and-category-axis-in-chart-js AS THE HACK

	labels = labels.sort();
	var maxYValue = -100000000;
	var minYValue = 100000000;
	for (var i = 0; i < datasets.length; ++i)
	{
		var dataset = datasets[i].data;
		for (var j = 0; j < dataset.length; ++j)
		{
			var prevX = dataset[j].x;
			var idxOfX = labels.indexOf(prevX);
			// console.log("Run: " + prevX + "\tIDX: " + idxOfX);
			datasets[i].data[j].x = idxOfX;

			if (dataset[j].y > maxYValue) maxYValue = dataset[j].y;
			if (dataset[j].y < minYValue) minYValue = dataset[j].y;
		}
	}

	// BUILD INFORMATION ABOUT CHANGE OF LHC FILL
	var fillStr = "";

	var previousFill = -1;
	var fillStr = "";
	for (var runNum in data.runInfo)
	{
		var fill = data.runInfo[runNum].fill;
		if (previousFill != fill)
		{
			var currLabel = "" + runNum + (is_runByRunOn ? "" : ".00000");
			var indexOfFillLabel = labels.indexOf(currLabel);

			previousFill = fill;

			fillStr += fill + "@" + indexOfFillLabel + "_";
		}
	}
	fillStr = fillStr.substr(0, fillStr.length - 1);

    return { labels : labels,
    		 datasets : datasets,
    		 proxyLabels : [...Array(labels.length).keys()],
    		 maxYValue : maxYValue,
    		 minYValue : minYValue,
    		 fillStr : fillStr,
			}
}

function getAnnotations(maxYValue, minYValue, is_runByRunOn, binsNum,
						is_superimpose, is_relativeValues, superimposedDatasetLabel,
						fillStr)
{
	console.log(maxYValue);
	console.log(minYValue);
	console.log(is_runByRunOn);
	console.log(binsNum);
	console.log(is_superimpose);
	console.log(is_relativeValues);
	console.log(superimposedDatasetLabel);
	console.log(fillStr);

	var canvasRect = document.getElementById('thePlot').getBoundingClientRect();

	var annotations = [];

	var relativePositionOfLScale = 0.95;

	if (!is_runByRunOn)
	{
		var canvasWidth = canvasRect.width - 95; //subtract y axis labels
		var xLabelShift = 0;
		var labelText = "";
		var scaleLength = 50;
		if (binsNum >= 52){
			xLabelShift += 50 / binsNum * canvasWidth * 0.5;
			labelText = "5000 LS";
		}
		else{
			scaleLength = Math.floor( (binsNum - 2) / 10 ) * 10;
			xLabelShift += scaleLength / binsNum * canvasWidth * 0.5;
			labelText = "" + scaleLength * 100 + " LS";

			console.log("SMALL RANGE");
			console.log("\tScale length:" + scaleLength);
			console.log("\tShift: " + xLabelShift);
			console.log("\tText: " + labelText);
		}

		annotations.push( {
	        id: 'LS_line',
	        type: 'line',
	        mode: 'horizontal',
	        scaleID: 'y-axis-0',
	        value: maxYValue * relativePositionOfLScale,
	        // endValue: chartDataRepresentation.maxYValue,
	        borderColor: 'rgba(255, 0, 0, 0.0)', // a line without visibility
	        borderWidth: 5,
	        label: {
	            position: 'center',
	            yAdjust: -10,
	            xAdjust: -(canvasWidth / 2 -xLabelShift),
	            backgroundColor: "rgba(255, 255, 255, 0)",
	            fontColor : "black",
	            fontSize: 18,
	            content: labelText,
	            enabled: true
	        },
	        // onClick: function(e) {
	        //     // The annotation is is bound to the `this` variable
	        //     console.log('Annotation', e.type, this);
	        // }
	    } );

	    annotations.push({
		        type: 'box',
		        xScaleID: 'x-axis-0',
		        yScaleID: 'y-axis-0',
		        xMin: 2,
		        xMax: 2 + scaleLength,
		        yMin: maxYValue * (relativePositionOfLScale - 0.01),
		        yMax: maxYValue * relativePositionOfLScale,
		        backgroundColor: 'rgb(101, 33, 171)',//'rgba(101, 33, 171, 0.5)',
		        borderColor: 'rgb(101, 33, 171)',
		        borderWidth: 1,
		    }
	    );
	}
	if (is_superimpose && is_relativeValues)
	{
		var labelSpl = superimposedDatasetLabel.split("=");
		if (labelSpl.length == 2)
		{
			var meanValue = labelSpl[1];

			annotations.push( {
		        id: 'Mean_line',
		        type: 'line',
		        mode: 'horizontal',
		        scaleID: 'y-axis-0',
		        value: (/*minYValue + */maxYValue) * 0.1,
		        // endValue: chartDataRepresentation.maxYValue,
		        borderColor: 'rgba(255, 0, 0, 0.0)', // a line without visibility
		        borderWidth: 5,
		        label: {
		            position: 'left',
		            // yAdjust: -35,
		            backgroundColor: "rgba(255, 255, 255, 0)",
		            fontColor : "black",
		            fontSize : 30,
		            //content: "Average: " + meanValue,
		            content: "",
		            enabled: true
		        },
	    	});
		}
	}
	if (fillStr)
	{
		var fillLineID = "Fill_line";
		var fillStrSpl = fillStr.split("_");

		for (var i = 0; i < fillStrSpl.length; ++i)
		{
			var fillDataSpl = fillStrSpl[i].split("@");

			var fillNum = fillDataSpl[0];
			var fillPos = parseInt(fillDataSpl[1]);

			// console.log(fillNum + ", " + fillPos);

			annotations.push( {
		        id: fillLineID + "_" + i,
		        type: 'line',
		        mode: 'vertical',
		        scaleID: 'x-axis-0',
		        value: fillPos,
		        // endValue: chartDataRepresentation.maxYValue,
		        borderColor: 'rgba(0, 100, 0, 0.8)', // a line without visibility
		        borderWidth: 2,
		        //borderDash: [20, 10],
		        label: {
		            position: 'top',
		            yAdjust: (i % 2 ? 20: 0),
		            backgroundColor: "rgba(0, 50, 0, 0.8)",
		            fontColor : "white",
		            fontSize : 12,
		            content: fillNum,
		            enabled: true
		        },
	    	});			
		}
	}

	return annotations;
}

function CreatePlot(data, is_runByRunOn, is_superimpose, is_relativeValues, is_linear)
{
	chartDataRepresentation = (getChartDataRepresentation(data, is_runByRunOn, is_superimpose, is_relativeValues, null))

	var totalLength = 0;
	for(var k in data.runInfo)
	{
		totalLength += data.runInfo[k].lbs * 100;
	}
	console.log("Total length: " + totalLength);
	console.log(chartDataRepresentation);

	// DATA USED  TO ADJUST POSITION OF ANNOTATIONS WHEN HIDING IS USED
	$("#hideSuperimposedData").prop("data-global-max", chartDataRepresentation.maxYValue);
	$("#hideSuperimposedData").prop("data-global-min", chartDataRepresentation.minYValue);
	$("#hideSuperimposedData").prop("data-bin-num", chartDataRepresentation.labels.length);
	$("#hideSuperimposedData").prop("data-super-label", chartDataRepresentation.datasets[chartDataRepresentation.datasets.length - 1].label);
	$("#hideSuperimposedData").prop("data-fill-str", chartDataRepresentation.fillStr);
	
	if (thisPlotContext == null)
	{
		console.log("Creating new 2D context...");
		thisPlotContext = $("#thePlot")[0].getContext('2d');

		$("#thePlot").css("border-style", "ridge");

		var defaultLegendClickHandler = Chart.defaults.global.legend.onClick;

		var previousFillNumber = -1; // Used as a quick workaround to replace run number with the fill number 
		var number_of_slots = 20; // Maximum number of x labels are should be shown in the Graph
		var last_slot = -1; // Used as q quick workaround to implement the maximum number of x labels

		thisChart = new Chart(thisPlotContext, {
		    type: 'line',
		    data: {
		    	labels : chartDataRepresentation.proxyLabels,
		    	datasets : chartDataRepresentation.datasets,
		    },

		    options: {
	        	pan: {
					enabled: false,
					mode: 'xy',
					speed: 100,
					threshold: 100,
					// limits:{
					// 	xmin: 0,
					// 	ymin: 0
					// }
				},
				zoom: {
					enabled: false,
					drag: false,
					mode: 'xy',
					// sensivity: 3,
					limits: {
						max: 1000,
						min: 100,
					}
				},
				elements: {
                    point: {
                        pointStyle: 'line',
                    }
                },
                title: {
                	display : true,
                	fontSize: 30,
                	text: "Trends for runs: " + chartDataRepresentation.labels[0] + " - " + chartDataRepresentation.labels[chartDataRepresentation.labels.length - 1],
                },

                legend: {
         //        	onClick: function(e, legendItem)
         //        	{
         //        		// console.log("Legend item click");
         //        		// console.log(defaultLegendClickHandler)
         //        		// console.log(legendItem);
         //        		// defaultLegendClickHandler(e, legendItem);


         //        		var index = legendItem.datasetIndex;

					    // if (index > 1) {
					    //     // Do the original logic
					    //     // defaultLegendClickHandler(e, legendItem);
					    //     var m = this.chart.getDatasetMeta(index);
					    //     m.hidden = m.hidden === null ? !this.chart.data.datasets[index].hidden : null;
					    //     this.chart.update();
					    // } else {
					    //     let ci = this.chart;
					    //     [ci.getDatasetMeta(0),
					    //      ci.getDatasetMeta(1)].forEach(function(meta) {
					    //         meta.hidden = meta.hidden === null? !ci.data.datasets[index].hidden : null;
					    //     });
					    //      ci.update();
					    // }
					    
         //        	}

         			labels : {
         				fontSize: 12,
         			},

                },

                tooltips: {
					position: 'nearest',
					mode: 'nearest',
					intersect: false,
					// callbacks: {
		   //                      // Use the footer callback to display the sum of the items showing in the tooltip
		   //                      footer: function(tooltipItems, data) {
		   //                          var sum = 0;

		   //                          tooltipItems.forEach(function(tooltipItem) {
		   //                              sum += data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].y;
		   //                          });
		   //                          return 'Sum: ' + sum;
		   //                      },
		   //                  },
		   //                  footerFontStyle: 'normal'
		   			callbacks:{
		   				title: function(e, d){				// makes tooltip title different than scale label
		   					return chartDataRepresentation.labels[d.labels[e[0].index ]];
		   				}
		   			},
				},
                scales: {
                    xAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Fill Number',
                            fontSize : 24,
                            
                            // id: "x-axis-2",
                        },
                        ticks:{
                        	userCallback: function(value, index, values){
                        		var labelSplit = chartDataRepresentation.labels[value].split(".");
                        		var run = parseInt(labelSplit[0]);
					
					previousLabelIndex = index;
					var currentFillNumber = data.runInfo[run].fill;
					var fillLabel = "";
					if(previousFillNumber != currentFillNumber){
					    	divisor = values.length / number_of_slots;
						current_slot = Math.floor(index/divisor)
					    	if(last_slot != current_slot){
							fillLabel = "" + currentFillNumber;
							last_slot = current_slot;
						}
					}
					previousFillNumber = currentFillNumber;
					return fillLabel;
                        	},
                        	autoSkip : false,
                        	maxRotation: 90,
                        },
                        offset : true,
                        gridLines: {
                        	//borderDash: [5, 5],
				display: false,
                        },
                    }],
                    yAxes: getScaleOptions(is_linear, is_relativeValues),
                },

                // ANNOTATIONS

                annotation: {
                    events: ['click'],
                    drawTime: "afterDraw",
                    annotations: getAnnotations(chartDataRepresentation.maxYValue, chartDataRepresentation.minYValue, is_runByRunOn, chartDataRepresentation.labels.length,
                    							is_superimpose, is_relativeValues, chartDataRepresentation.datasets[chartDataRepresentation.datasets.length - 1].label,
                    							chartDataRepresentation.fillStr),
                    // [{
                    //     id: 'hline',
                    //     type: 'line',
                    //     mode: 'horizontal',
                    //     scaleID: 'y-axis-0',
                    //     value: chartDataRepresentation.maxYValue * 0.95,
                    //     // endValue: chartDataRepresentation.maxYValue,
                    //     borderColor: 'rgba(255, 0, 0, 0.0)', // a line without visibility
                    //     borderWidth: 5,
                    //     label: {
                    //         position: 'left',
                    //         yAdjust: -10,
                    //         xAdjust: 100,
                    //         backgroundColor: "rgba(255, 255, 255, 0)",
                    //         fontColor : "black",
                    //         content: "5000 LS",
                    //         enabled: true
                    //     },
                    //     // onClick: function(e) {
                    //     //     // The annotation is is bound to the `this` variable
                    //     //     console.log('Annotation', e.type, this);
                    //     // }
                    // },

                    // {
                    //     type: 'box',
                    //     xScaleID: 'x-axis-0',
                    //     yScaleID: 'y-axis-0',
                    //     xMin: 2,
                    //     xMax: 52,
                    //     yMin: chartDataRepresentation.maxYValue * 0.95,
                    //     yMax: chartDataRepresentation.maxYValue * 0.95,
                    //     backgroundColor: 'rgba(101, 33, 171, 0.5)',
                    //     borderColor: 'rgb(101, 33, 171)',
                    //     borderWidth: 1,
                    // }

                    // ]
                }
		    }
		});		
	}
	else{
		// HAVE TO MAKE SURE THAT ALL DATA IS UPDATED CORRECTLY !!!
		console.log("Reusing existing chart...");
		thisChart.config.data.labels = chartDataRepresentation.proxyLabels;
		thisChart.config.data.datasets = chartDataRepresentation.datasets;

		thisChart.config.options.title.text = "Trends for runs: " + chartDataRepresentation.labels[0].split(".")[0] + " - " + chartDataRepresentation.labels[chartDataRepresentation.labels.length - 1].split(".")[0];
		var previousFillNumber = -1; // Used as a quick workaround to replace run number with the fill number 
		var number_of_slots = 20; // Maximum number of x labels are should be shown in the Graph
		var last_slot = -1; // Used as q quick workaround to implement the maximum number of x labels
		thisChart.config.options.scales.xAxes[0].ticks.userCallback = function(value, index, values){
                        		var labelSplit = chartDataRepresentation.labels[value].split(".");
                        		var run = parseInt(labelSplit[0]);
					
					previousLabelIndex = index;
					var currentFillNumber = data.runInfo[run].fill;
					var fillLabel = "";
					if(previousFillNumber != currentFillNumber){
					    	divisor = values.length / number_of_slots;
						current_slot = Math.floor(index/divisor)
					    	if(last_slot != current_slot){
							fillLabel = "" + currentFillNumber;
							last_slot = current_slot;
						}
					}
					previousFillNumber = currentFillNumber;
					return fillLabel;
                        		};

     	thisChart.config.options.tooltips.callbacks.title = function(e, d){				// makes tooltip title different than scale label
		   														return chartDataRepresentation.labels[d.labels[e[0].index ]];
		   													};

		var is_showLHCFillTags = !$("#lhcFillTag").parent().hasClass("off"); 
		var fillStr = (is_showLHCFillTags) ? chartDataRepresentation.fillStr : "";

      	thisChart.config.options.annotation.annotations = getAnnotations(chartDataRepresentation.maxYValue, chartDataRepresentation.minYValue, is_runByRunOn, chartDataRepresentation.labels.length,
                    							is_superimpose, is_relativeValues, chartDataRepresentation.datasets[chartDataRepresentation.datasets.length - 1].label,
                    							fillStr),

		thisChart.resetZoom();
		thisChart.update();	

		changeAxisType(is_linear, is_relativeValues);
	}
	console.log(thisChart);

	return thisChart;
}
