var thisPlotContext = null;
var thisChart = null;
var chartDataRepresentation = null;

function generateRandomColor(){
	var R = Math.floor(Math.random() * 255);
	var G = Math.floor(Math.random() * 255);
	var B = Math.floor(Math.random() * 255);

	return "rgb(" + R + ", " + G + ", " + B + ")";
}

function getChartDataRepresentation(data, options)
{
	var labelsSaved = false;
	var labels = [];
	var datasets = [];

	// maybe better would be to grab it from $().innerhtml
	var strOptionStr = [": Modules", ": Fibers" , ": APVs" , ": Strips"];
	var pxoptionStr = [": Dead ROCs", ": Inefficient ROCs", ": Mean Occupancy", ": # of Clusters"];

	for (var bxpx in data)
	{
		var bxpxData = data[bxpx];

		for (var moduleName in bxpxData) //gets for example TEC+ DISK 7
	    {
			var runsArr = bxpxData[moduleName];
			
			var cnt = 0;

			var vals = [[], [], [], []];
			for (var runNum in runsArr)
			{
				if (!labelsSaved) labels.push(runNum);

			    var allVals = runsArr[runNum];
			    for (var i = 0; i < allVals.length; ++i)
			    {
			    	if (allVals[i] != -1)
			    	{
			    		vals[i].push({x : runNum,
			    					  y: allVals[i],
			    					 });
			    	}
			    }
			    cnt++;
			}
			console.log("Current dataset length: " + cnt);
			labelsSaved = true;
			// console.log(vals);

			for (var i = 0; i < vals.length; ++i)
			{
				if (vals[i].length)
				{
					datasets.push({
						label : moduleName + ((bxpx == "STR") ? strOptionStr[i] : pxoptionStr[i]),
						data : vals[i],
						borderWidth: 3,
		            	borderColor: generateRandomColor(),
		            	fill: false,
		            	steppedLine: true,

		            	pointHoverBorderWidth : 10,

		            	// xAxisID: "x-axis-2",
					})
				}
			}
	    }
	}

    return { labels : labels,
    		 datasets : datasets,
			}
}

function CreatePlot(data)
{
	chartDataRepresentation = (getChartDataRepresentation(data, null));
	console.log(data);
	
	if (thisPlotContext == null)
	{
		console.log("Creating new 2D context...");
		thisPlotContext = $("#thePlot")[0].getContext('2d');

		$("#thePlot").css("border-style", "ridge");

		thisChart = new Chart(thisPlotContext, {
		    type: 'line',
		    data: chartDataRepresentation,

		    options: {
		        scales: {
		            yAxes: [{
		                ticks: {
		                    beginAtZero:true
		                }
		            }]
		        },
	        	pan: {
					enabled: false,
					mode: 'xy',
					// speed: 10,
					// threshold: 100
				},
				zoom: {
					enabled: true,
					drag: true,
					mode: 'xy',
					limits: {
						max: 10,
						min: 0.5,
					}
				},
				elements: {
                    point: {
                        pointStyle: 'dash',
                    }
                },
                title: {
                	display : true,
                	text: "Merged bad Modules for runs: " + runMin + " - " + runMax,
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
				},
                scales: {
                    xAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Run Number',
                            fontSize : 24,
                            
                            // id: "x-axis-2",
                        }
                    }],
                    yAxes: [{
                        display: true,
                        // stacked: true,
                        type: 'linear',
                        scaleLabel: {
                            display: true,
                            labelString: 'Database value',
                            fontSize : 24,
                        }
                    }]
                },
		    }
		});		
	}
	else{
		console.log("Reusing existing chart...");
		thisChart.config.data = chartDataRepresentation;
		thisChart.config.options.title.text = "Merged bad Modules for runs: " + runMin + " - " + runMax;

		thisChart.update();
		
	}
	console.log(thisChart);
}