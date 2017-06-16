$(document).ready(function() {
	console.log("on load");

	var initialSliderValues = [270000, 300000];
	var minSliderVal = 261370;
	var maxSliderVal = 320000;
	var ticks = []

	var thisPlotContext = null;
	var thisChart = null;
	var chartDataRepresentation = null;

	for (i = minSliderVal + 10000; i < maxSliderVal ; i+=10000)
	{
		var mainVal = Math.floor(i / 10000) * 10000;
		ticks.push(mainVal);
	}

	var slider = $("#slider")[0];
	noUiSlider.create(slider, {
		start: initialSliderValues,
		connect: true,
		step: 1,
		range: {
			'min': minSliderVal, // takes into account padding value
			'max': maxSliderVal
		},
		padding: 3000,

		pips: {
			mode: 'values',
			values: ticks,
			density: 2
		}
	});

	slider.noUiSlider.on("update", function(values, handle){
		$("#runMin").val(values[0].substr(0,6));
		$("#runMax").val(values[1].substr(0,6));
	});

	$("#runMin").val(initialSliderValues[0]);
	$("#runMax").val(initialSliderValues[1]);

	$("#runMin").on("change", function(){
		slider.noUiSlider.set([$(this).val(), null]);
	});
	$("#runMax").on("change", function(){
		slider.noUiSlider.set([null, $(this).val()]);
	});

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
		var optionStr = ["Modules", "Fibers" , "APVs" , "Strips"];

	    for (var moduleName in data) //gets for example TEC+ DISK 7
	    {
			var runsArr = data[moduleName];
			
			var vals = [[], [], [], []];
			for (var runNum in runsArr)
			{
				if (!labelsSaved) labels.push(runNum);

			    var allVals = runsArr[runNum];
			    for (var i = 0; i < allVals.length; ++i)
			    {
			    	if (allVals[i] != -1)
			    	{
			    		vals[i].push(allVals[i]);
			    	}
			    }
			}
			labelsSaved = true;

			for (var i = 0; i < vals.length; ++i)
			{
				if (vals[i].length)
				{
					datasets.push({
						label : moduleName + " " + optionStr[i],
						data : vals[i],
						borderWidth: 3,
		            	borderColor: generateRandomColor(),
		            	fill: false,
		            	steppedLine: true,
					})
				}
			}
			// console.log(datasets);
	    }

	    return { labels : labels,
	    		 datasets : datasets,
				}
	}

	$("#plotImages").on("click", function(){
		console.log("Process Started!");
		
		//packing things tight
		var objs = $(".module-selection input[id^='module']:checked");
		console.log(objs.length + " modules to monitor");

		var moduleStr = "";
		for (i = 0; i < objs.length; ++i)
		{
			var sub = $(objs[i]).attr("id").substr(6, 2);
			moduleStr = moduleStr + sub + "/";
		}

		objs = $(".option-selection input[id^='option']:checked");
		console.log(objs.length + " options to monitor");
		var optionStr = "";
		for (i = 0; i < objs.length; ++i)
		{
			var sub = $(objs[i]).attr("id").substr(7, 1);
			optionStr = optionStr + sub + "/";
		}

		var runMin = $(".option-selection #runMin").val();
		var runMax = $(".option-selection #runMax").val();

		console.log("Complete set of parameters:");
		console.log("\tmodules: " + moduleStr);
		console.log("\toptions: " + optionStr);
		console.log("\trun min: " + runMin);
		console.log("\trun max: " + runMax);

		$("#plotImages").css("background-image", "url(\"img/magnify.gif\")");

		$.post("php/getDataFromFile.php", {startRun : runMin,
										   endRun : runMax,
										   moduleStr : moduleStr,
										   optionStr : optionStr}, function(data){
												$("#plotImages").css("background-image", "");
												chartDataRepresentation = (getChartDataRepresentation(data, null));

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
																enabled: false,
																mode: 'xy',
																limits: {
																	max: 1,
																	min: 1
																}
															},
															elements: {
										                        point: {
										                            pointStyle: 'line',
										                        }
										                    },
										                    title: {
										                    	display : true,
										                    	text: "Merged bad Modules for runs: " + runMin + " - " + runMax,
										                    },
										                    scales: {
											                    xAxes: [{
											                        display: true,
											                        scaleLabel: {
											                            display: true,
											                            labelString: 'Run #'
											                        }
											                    }],
											                    yAxes: [{
											                        display: true,
											                        scaleLabel: {
											                            display: true,
											                            labelString: 'Bad channels'
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
																						

										   }, "json");
	});

});