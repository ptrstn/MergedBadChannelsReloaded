var thisPlotContext = null;
var thisChart = null;
var chartDataRepresentation = null;

var contrastingColors = ["#bf0000", "#f29979", "#ffa640", "#b2aa2d", "#e6f2b6", "#829973", "#00736b", "#164c59", "#00294d", "#80a2ff", "#6d00cc", "#3d004d", "#ff00ee", "#992645", "#660000", "#e55c00", "#7f5320", "#e2f200", "#354020", "#008033", "#3df2e6", "#739199", "#b6cef2", "#000033", "#d580ff", "#944d99", "#ff40a6", "#400009", "#403230", "#662900", "#33210d", "#475900", "#74d900", "#3df285", "#00c2f2", "#0080bf", "#3056bf", "#504d66", "#eabfff", "#322633", "#ff0044", "#d9a3aa"];
var contrastingColorIdx = 0;

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

function intToStrWithLeadingZeros(num, size=5){ 
	return ('00000' + num).substr(-size); 
}

function changeAxisType(isLinear)
{
	if (isLinear)
	{
		thisChart.options.scales.yAxes = Chart.helpers.scaleMerge(Chart.defaults.scale, {yAxes: linearScaleOptions}).yAxes;
	}
	else{
		thisChart.options.scales.yAxes = Chart.helpers.scaleMerge(Chart.defaults.scale, {yAxes: logarithmicScaleOptions}).yAxes;
	}

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

function getChartDataRepresentation(data, is_runByRunOn, is_superimpose, options)
{
	var labels = [];
	var datasets = [];

	// maybe better would be to grab it from $().innerhtml
	var strOptionStr = [": Modules", ": Fibers" , ": APVs" , ": Strips"];
	var pxoptionStr = [": Dead ROCs", ": Inefficient ROCs", ": Mean Occupancy", ": # of Clusters", ": # of Inefficient DCols", ": # of Noisy Pixel Columns"];

	var superimposedDataset = {label : "",
								data : [],
								borderWidth: 4,
				            	// borderColor: generateRandomColor(),
				            	borderColor: getRandomColorFromTable(),
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
					if ($.inArray(runNum, labels) === -1)
					{
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
			    for (var i = 0; i < allVals.length; ++i)
			    {
			    	if (allVals[i] != -1)
			    	{
			    		if (is_runByRunOn)
			    		{
			    			vals[i].push({x : runNum,
				    					  y : allVals[i],
				    					 });
			    		}
			    		else
			    		{
			    			for (var lumi = 0; lumi < data.runInfo[runNum].lbs; ++lumi)
							{
								vals[i].push({x : runNum + "." + intToStrWithLeadingZeros(lumi),
					    					  y : allVals[i],
					    					 });
							}
			    		}
			    	}
			    }
			    cnt++;
			}
			console.log("Current dataset length: " + cnt);
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

						// vals[i] = vals[i].sort(sortData);
						// for (var j = 0; j < dataSum.length && j < vals[i].length; ++j)
						// {
						// 	// console.log(vals[i][j].x);
						// 	if (dataSum[j].x == vals[i][j].x)
						// 		dataSum[j].y += vals[i][j].y;
						// }
						// console.log(vals[i]);
						xs = vals[i].map(function(v){return v.x;});
						console.log(xs);
						for (j in dataSum)
						{
							// d = vals[i].find(v => v.x === data.x);
							// if (d === undefined) continue;

							d = xs.indexOf(superimposedDataset.data[j].x);

							// console.log(data);
							if (d == -1) continue;
							superimposedDataset.data[j].y += vals[i][d].y;
						}

						labelSum = labelSum + " + " + (moduleName + ((bxpx == "STR") ? strOptionStr[i] : pxoptionStr[i]));

						superimposedDataset.label = labelSum;
						superimposedDataset.data = dataSum;
						// console.log(dataSum);
					}
					else if (is_superimpose && datasets.length == 0)
					{
						superimposedDataset.label = moduleName + ((bxpx == "STR") ? strOptionStr[i] : pxoptionStr[i]);
						for (var j = 0; j < vals[i].length; ++j)
						{
							superimposedDataset.data.push({x : vals[i][j].x,
														y : vals[i][j].y});
						}
						// superimposedDataset.data = superimposedDataset.data.sort(sortData);
						// superimposedDataset.data = vals[i].slice(0);
					}
					// else
					{
						datasets.push({
							label : moduleName + ((bxpx == "STR") ? strOptionStr[i] : pxoptionStr[i]),
							data : vals[i],
							borderWidth: 2,
			            	// borderColor: generateRandomColor(),
			            	borderColor: getRandomColorFromTable(),
			            	fill: false,
			            	steppedLine: true,

			            	pointHoverBorderWidth : 10,

			            	// xAxisID: "x-axis-2",
						})
					}
				}
			}
	    }
	}
	if (is_superimpose && datasets.length > 1)
	{
		datasets.push(superimposedDataset);
	}

	// console.log("Labels:\n" + labels.sort());
    return { labels : labels.sort(),
    		 datasets : datasets,
			}
}

function CreatePlot(data, is_runByRunOn, is_superimpose)
{
	// console.log(data);

	chartDataRepresentation = (getChartDataRepresentation(data, is_runByRunOn, is_superimpose, null))
	
	if (thisPlotContext == null)
	{
		console.log("Creating new 2D context...");
		thisPlotContext = $("#thePlot")[0].getContext('2d');

		$("#thePlot").css("border-style", "ridge");

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
                    yAxes: linearScaleOptions,
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
	}
	console.log(thisChart);
}