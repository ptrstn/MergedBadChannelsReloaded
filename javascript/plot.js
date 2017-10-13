var thisPlotContext = null;
var thisChart = null;
var chartDataRepresentation = null;

var contrastingColors = ["#f00", "#0f0", "#00f", "#000", "#0ff", "#f0f", "#f70", 
						 "#777", "#f07", "#707", "#77f", "#f77",
						 "#bf0000", "#f29979", "#ffa640", "#b2aa2d", "#e6f2b6", "#829973", "#00736b", "#164c59", "#00294d", "#80a2ff", "#6d00cc", "#3d004d", "#ff00ee", "#992645", "#660000", "#e55c00", "#7f5320", "#e2f200", "#354020", "#008033", "#3df2e6", "#739199", "#b6cef2", "#000033", "#d580ff", "#944d99", "#ff40a6", "#400009", "#403230", "#662900", "#33210d", "#475900", "#74d900", "#3df285", "#00c2f2", "#0080bf", "#3056bf", "#504d66", "#eabfff", "#322633", "#ff0044", "#d9a3aa"];
var contrastingColorIdx = 0;

var rocsInModule = 16;
var colsInRoc = 52;
var endcapRing1Modules = 44;
var endcapRing2Modules = 68;
var endcapDiskModules = endcapRing1Modules + endcapRing2Modules;
var endcapTotalModules = 672;

// only PIXEL - JUST FOR THE TIME BEING...
var totalSubModuleCnt = {

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
    	min: 0,
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
    	min: 0,
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
				    		if (bxpx != "STR" && is_relativeValues) // because I do not have dictionary for strip
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
						borderDash: [5, ((bxpx != "STR" && is_relativeValues) ? 5 : 0)],
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

		console.log("Average value: " + mean + "%");

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
					enabled: true,
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
                	text: "Merged bad Modules for runs: " + chartDataRepresentation.labels[0] + " - " + chartDataRepresentation.labels[chartDataRepresentation.labels.length - 1],
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
		   					return d.labels[e[0].index ];
		   				}
		   			},
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
                        		return value.split(".")[0];
                        	}
                        },
                    }],
                    yAxes: getScaleOptions(is_linear, is_relativeValues),
                },
		    }
		});		
	}
	else{
		console.log("Reusing existing chart...");
		thisChart.config.data = chartDataRepresentation;
		thisChart.config.options.title.text = "Merged bad Modules for runs: " + chartDataRepresentation.labels[0].split(".")[0] + " - " + chartDataRepresentation.labels[chartDataRepresentation.labels.length - 1].split(".")[0];

		thisChart.resetZoom();
		thisChart.update();	

		changeAxisType(is_linear, is_relativeValues);
	}
	console.log(thisChart);

	return thisChart;
}