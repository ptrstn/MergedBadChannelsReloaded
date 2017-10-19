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
        labelString: 'Database value',
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
        labelString: 'Database value',
        fontSize : 24,
    },
    ticks:{
    	suggestedMin: 0,
    	// min: 0,
    }
}];

function getScaleOptions(is_linear, is_relativeValues){

	var scale = is_linear ? linearScaleOptions : logarithmicScaleOptions;
	console.log(is_relativeValues);
	scale[0].scaleLabel.labelString = is_relativeValues ? 'Database value [%]' : 'Database value';

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

	var superimposedDataset = {label : "Superimposed",
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
					datasets.push({
						label : currentLabel,
						data : vals[i],
						borderWidth: 2,
						borderDash: [5, ((is_relativeValues) ? 5 : 0)],
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

		superimposedDataset.label = "Superimposed <x> = " + (Math.round(mean * 100)/100).toFixed(2) + ((is_relativeValues) ? "%" : "");

		datasets.push(superimposedDataset);
	}

	// console.log("Labels:\n" + labels.sort());
    return { labels : labels.sort(),
    		 datasets : datasets,
			}
}

function CreatePlot(data, is_runByRunOn, is_superimpose, is_relativeValues, is_linear)
{
	chartDataRepresentation = (getChartDataRepresentation(data, is_runByRunOn, is_superimpose, is_relativeValues, null))

	var totalLength = 0;
	for(var k in data.runInfo)
	{
		totalLength += data.runInfo[k].lbs * 100;
	}
	console.log("Total length: " + totalLength)
	
	if (thisPlotContext == null)
	{
		console.log("Creating new 2D context...");
		thisPlotContext = $("#thePlot")[0].getContext('2d');

		$("#thePlot").css("border-style", "ridge");

		var defaultLegendClickHandler = Chart.defaults.global.legend.onClick;

		thisChart = new Chart(thisPlotContext, {
		    type: 'line',
		    data: chartDataRepresentation,

		    options: {
	        	pan: {
					enabled: true,
					mode: 'y',
					speed: 10,
					threshold: 100
				},
				zoom: {
					enabled: false,
					drag: false,
					mode: 'xy',
					limits: {
						max: 1000,
						min: 100,
					}
				},
				elements: {
                    point: {
                        pointStyle: 'dash',
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
         				fontSize: 18,
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
		   			// callbacks:{
		   			// 	title: function(e, d){				// makes tooltip title different than scale label
		   			// 		return d.labels[e[0].index ];
		   			// 	}
		   			// },
				},
                scales: {
                    xAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Run Number',
                            fontSize : 24,
                            
                            // id: "x-axis-2",
                        },
                        ticks:{
                        	userCallback: function(value, index, values){
                        		var labSpl = value.split(".");
                        		var run = parseInt(labSpl[0]);
                        		var lbs = data.runInfo[run].lbs;
                        		// console.log(lbs);

                        		if (labSpl.length == 1 || 
                        			(lbs >= totalLength / 10000 && parseInt(labSpl[1]) == Math.ceil(lbs / 2.0)))
									return labSpl[0];
								if (labSpl[1] == "00000") return "";
                        	},
                        	autoSkip : false,
                        	maxRotation: 90,
                        },
                        offset : true,
                        gridLines: {
                        	borderDash: [5, 5],
                        },
                    }],
                    yAxes: getScaleOptions(is_linear, is_relativeValues),
                },

                // ANNOTATIONS

                annotation: {
                    events: ['click'],
                    drawTime: "afterDraw",
                    annotations: [{
                        id: 'hline',
                        type: 'line',
                        mode: 'horizontal',
                        scaleID: 'y-axis-0',
                        value: 0,
                        endValue: 0,
                        borderColor: 'rgba(255, 0, 0, 0.5)', // a line without visibility
                        borderWidth: 5,
                        label: {
                            position: 'left',
                            yAdjust: -20,
                            xAdjust: 0,
                            backgroundColor: "red",
                            content: "5000 LS",
                            enabled: true
                        },
                        onClick: function(e) {
                            // The annotation is is bound to the `this` variable
                            console.log('Annotation', e.type, this);
                        }
                    },

                    {
                        type: 'box',
                        xScaleID: 'x-axis-0',
                        yScaleID: 'y-axis-0',
                        xMin: "305045",
                        xMax: "305237",
                        yMin: 0.01,
                        yMax: 0.01,
                        backgroundColor: 'rgba(101, 33, 171, 0.5)',
                        borderColor: 'rgb(101, 33, 171)',
                        borderWidth: 1,
                    }

                    ]
                }
		    }
		});		
	}
	else{
		console.log("Reusing existing chart...");
		thisChart.config.data = chartDataRepresentation;
		thisChart.config.options.title.text = "Trends for runs: " + chartDataRepresentation.labels[0].split(".")[0] + " - " + chartDataRepresentation.labels[chartDataRepresentation.labels.length - 1].split(".")[0];

		thisChart.config.options.scales.xAxes[0].ticks.userCallback = function(value, index, values){
                        		var labSpl = value.split(".");
                        		var run = parseInt(labSpl[0]);
                        		var lbs = data.runInfo[run].lbs;
                        		// console.log(lbs);

                        		if (labSpl.length == 1 || 
                        			(lbs >= totalLength / 10000 && parseInt(labSpl[1]) == Math.ceil(lbs / 2.0)))
									return labSpl[0];
								if (labSpl[1] == "00000") return "";
                        		},

      	thisChart.config.options.annotation.annotations.push({
                        id: 'vline',
                        type: 'line',
                        mode: 'vertical',
                        scaleID: 'x-axis-0',
                        value: "305188",
                        borderColor: 'rgba(255, 128, 128, 0.5)', // a line without visibility
                        borderWidth: 5,
                        label: {
                            position: 'left',
                            yAdjust: -20,
                            xAdjust: 0,
                            backgroundColor: "red",
                            content: "FILL",
                            enabled: true
                        },
                        onClick: function(e) {
                            // The annotation is is bound to the `this` variable
                            console.log('Annotation', e.type, this);
                        }
                    });

		thisChart.resetZoom();
		thisChart.update();	

		changeAxisType(is_linear, is_relativeValues);
	}
	console.log(thisChart);

	return thisChart;
}