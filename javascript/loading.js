var thisChart = ""

$(document).ready(function() {

	var savedPlots = 0;
	var dateFormat = "dd/mm/yyyy";

	$.post("php/maxRunUtil.php", {}, function(data){
				console.log("CurrMaxRunNum: " + data);

				// RUN SLIDER
				var initialSliderValues = [270000, 300000];
				var minSliderVal = 261370;
				var maxSliderVal = data + 3000;
				var ticks = [];
				var tickStep = 15000;
				
				for (i = minSliderVal + tickStep; i < maxSliderVal ; i+=tickStep)
				{
					var mainVal = Math.floor(i / tickStep) * tickStep;
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

		   }
		   , "json"
    );

	// TOGGLERS
	$('#runDateToggle').bootstrapToggle('on');
	$('#careAboutRunLength').bootstrapToggle('off');
	$('#expertModeToggle').bootstrapToggle('off');
	$('#linLogToggle').bootstrapToggle('off');

	$("#runDateToggle").change(function(){
		$('#datePicker').toggle();
		$('#runRangePicker').toggle();

		// console.log($("#runDateToggle").parent().hasClass("off"));
	});
	$('#expertModeToggle').change(function(){
		$("#userDataPickingPanelBody").toggle();
		$("#expertDataPickingPanelBody").toggle();

	})
	$('#linLogToggle').change(function(){
		changeAxisType($(this).parent().hasClass('off'),
					   !$("#absoluteRelativeValues").parent().hasClass("off")
					   );
	});

	// DATEPICKER
	$('.input-daterange').datepicker({
        format: dateFormat,
        weekStart: 1,
        daysOfWeekHighlighted: "0",
        calendarWeeks: true,
        autoclose: true,
        todayHighlight: true,
        maxViewMode: 3
    });

    var today = moment();
	var todayStr = moment().format(dateFormat.toUpperCase());
	var histDateStr = today.add(-4, 'day').format(dateFormat.toUpperCase());
	// console.log(todayStr);

	$("#datepicker #dateStart").val(histDateStr);
	$("#datepicker #dateEnd").val(todayStr);

	// BUILDING OPTION FOOTERS
	var optionFooterArr = {"Strip" :
							{"Strips" : "Strips",
							 "APVs" : "APVs",
							 "Fibers" : "Fibers",
							 "Modules" : "Modules"},
						   "Pixel" :
						     {"Occupancy" : "Mean Occupancy",
						      "Inefficient" : "Inefficient ROCs",
						      "Dead" : "Dead ROCs",
						      "Inefficientdcols" : "Inefficient DCols",
						      "Noisycols" : "Noisy Cols"
						      }
						  };
	var optionNum = 0;
	for (var det in optionFooterArr)
	{
		var obj = ((det === "Strip") ? $("#stripOptionSelection") : $("#pixelOptionSelection"));
		var htmlBuild = "<div class='row'>";

		for (var optionKey in optionFooterArr[det])
		{
			htmlBuild += 	"<div class='col-md-3'>" + 
								"<label><input type='checkbox' id='option-" + optionNum + "-" + optionKey + "'>" + optionFooterArr[det][optionKey] + "</label>" +
							"</div>";
			optionNum += 1;
		}

		htmlBuild += "</div>";
		obj.append(htmlBuild);
	}

	// MINMAX SELECTION BUILDER
	var minmaxSeleectionArr = {"Strip" :
								{"NumberOfCluster" : "# strip clusters",
							   	"NumberOfDigi" : "# strip digis",
							   	"NumberOfOfffTrackCluster" : "# off track clusters",
							   	"StoNCorrOnTrack" : "S/N correlation on track",
							   	"ResidualsMean" : "Residuals Mean"},
							   	// "ResidualsMean2" : "Residuals Mean"},
							   ////////////////////////////////////////////////////
							   "Pixel" : 
							   {"adc" : "ADC",
							   "charge" : "Charge",
							   "size" : "Size",
							   "num_clusters" : "# pixel clusters",
							   "num_digis" : "# pixel digis",
							   
							   "Tsize" : "Track size",
							   "Tcharge" : "Track charge",
							   "TshapeFilter" : "Track shape filter",
							   "Thitefficiency" : "Track hit efficiency",

							   "Tresidual_x" : "Track X-residual",
							   "Tresidual_y" : "Track Y-residual",
							   "Trechitsize_x" : "Rechit X-size",
							   "Trechitsize_y" : "Rechit Y-size",
							   
							   "Tnum_clusters_ontrack" : "# cluster on track",
							   "Tnum_missing" : "# track missing",
							   "Tnum_valid" : "# track valid"}
							   };
	var currOptionID = 11;
	for (var key in minmaxSeleectionArr)
	{
		var htmlBuild = "<div class='col-md-12'>" + key + "</div><div class='checkbox-checker'>";

		for (var detValKey in minmaxSeleectionArr[key])
		{
			htmlBuild += "<div class='col-md-8' id='" + detValKey + "-title'>" + minmaxSeleectionArr[key][detValKey] + "</div>" +
						 "<div class='col-md-2'>" + 
						 	"<label><input type='checkbox' id='option-" + currOptionID + "-" + detValKey + "-min'" + ((key === "Strip") ? "style='visibility: hidden;'" : "") + ">" +
						 		// minmaxSeleectionArr[key][detValKey] + 
						 	"</label>" +
						 "</div>" + 
						 "<div class='col-md-2'>" + 
						 	"<label><input type='checkbox' id='option-" + (currOptionID + 1) + "-" + detValKey + "-max'>" +
						 		// minmaxSeleectionArr[key][detValKey] + 
						 	"</label>" +
						 "</div>";

			currOptionID = currOptionID + 2;
		}	
		htmlBuild += "</div>";

		$("#minmax-selection .row").append(htmlBuild);
	}
	$("#minmax-selection .row").parent().append("<hr/><div class='row' id='minmax-selection-filterArea'> \
		<div class='col-md-3'>Det ID Filter</div> \
		<div class='col-md-9'>\
			<input type='text' id='minmaxDetIDFilter' placeholder='empty or eg. 353309700' data-toggle='tooltip' data-placement='auto bottom' title='If you leave it empty you will get extreme values for each run. Passing Det ID will give a hint to look only for this Det ID in logs - if it is not there you will get 0 and reported value for this module otherwise.'></input>\
		</div></row>");

	////////////////////////////////////////////////////////////////

	// tooltip enable
	$('[data-toggle="tooltip"]').tooltip(); 

	////////////////////////////////////////////////////////////////

	// batch (un)checking
	$(".panel-body.checkbox-checker, .panel-body .checkbox-checker").on('dblclick', function(){
		var checkboxes = $(this).find("input");
		if ( $(this).find("input:checked").length )
		{
			checkboxes.prop('checked', false); 
		}
		else checkboxes.prop('checked', true); 
	});

	$("#plotSaveBtn").on('click', function(){
		var img = $('#thePlot')[0].toDataURL("image/png");

		var afake = $("<a></a>").attr("href", img).attr("download", "plot" + savedPlots++ + ".png").css("display", "none").html("Link").appendTo("body");

        $(afake)[0].click();
        window.setTimeout(function () {
            $(afake).remove();
        }, 200);

	});

	$("#resetViewBtn").on('click', function(){
		$("#hideSuperimposedData").bootstrapToggle('off');
		thisChart.resetZoom();
	});

	$("#careAboutRunLength, #superimposeData, #absoluteRelativeValues").on('change', function()
	{
		$("#plotImages").click();
	});

	$("#superimposeData").on('change', function(){
		// $("#hideSuperimposedData").toggle();

		var activeSuperImpose = $(this).prop('checked');
		if (activeSuperImpose)
		{
			$("#hideSuperimposedData").parent().css('display', 'inline-block');
		}
		else{
			$("#hideSuperimposedData").bootstrapToggle('off');
			$("#hideSuperimposedData").parent().css('display', 'none');	
		}
	});

	$("#hideSuperimposedData").on('change', function(){
		//(un)hide plots

		if (!$("#superimposeData").prop("checked")) return; //just in case...

		var numElements = thisChart.legend.legendItems.length;
		if (numElements > 1)
		{
			for (var i = 0; i < numElements - 1; ++i)
			{
				thisChart.getDatasetMeta(i).hidden = $(this).prop("checked");
			}

			//CHANGE ANNOTATION POSITION TO MAKE SUPERIMPOSED PLOT BETTER FIT AVAILABLE SPACE
			var maxYValue = $(this).prop("data-global-max");
			var minYValue = $(this).prop("data-global-min");
			var is_runByRunOn = $("#careAboutRunLength").parent().hasClass("off");
			var binsNum = $(this).prop("data-bin-num");
			var is_superimpose = !$("#superimposeData").parent().hasClass("off");
			var is_relativeValues = !$("#absoluteRelativeValues").parent().hasClass("off"); 
			var superimposedDatasetLabel = $(this).prop("data-super-label");
			var fillStr = $(this).prop("data-fill-str");

			if ($(this).prop("checked"))
			{
				var superimposedMin = 1000000;
				var superimposedMax = -1000000;

				var superimposedData = thisChart.config.data.datasets[thisChart.config.data.datasets.length - 1].data;
				for (var i = 0; i < superimposedData.length; ++i)
				{
					if (superimposedData[i].y > superimposedMax) superimposedMax = superimposedData[i].y;
					if (superimposedData[i].y < superimposedMin) superimposedMin = superimposedData[i].y;
				}
				maxYValue = superimposedMax;
				minYValue = superimposedMin;
			}
			var newAnnotations = getAnnotations(maxYValue, minYValue, is_runByRunOn, binsNum,
						is_superimpose, is_relativeValues, superimposedDatasetLabel,
						fillStr);
			// console.log(newAnnotations);

			thisChart.config.options.annotation.annotations = []; // A LITTLE HACKY BUT OTHERWISE FIRST ANNOTATION IS NOT UPDATING
			thisChart.update();

			thisChart.config.options.annotation.annotations = newAnnotations;
			thisChart.update();
		}
	});


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

		objs = $("#stripOptionSelection, #pixelOptionSelection").find("input[id^='option']:checked");
		console.log(objs.length + " options to monitor");
		var optionStr = "";
		for (i = 0; i < objs.length; ++i)
		{
			var sub = $(objs[i]).attr("id").substr(7, 2);
			if (sub[1] == "-") sub = sub[0];
			optionStr = optionStr + sub + "/";
		}

		if ($("#module60").is(":checked")) //small workaround - inserting fake option
		{
			optionStr = optionStr + "10/";
		}
		// NOW ALMOST THE SAME FOR MINMAX TREND PLOTS
		objs = $(".minmaxPanel input[id^='option']:checked");
		console.log(objs.length + " minmax plots to prepare");
		var minmaxOptionStr = "";
		for (i = 0; i < objs.length; ++i)
		{
			var currID = $(objs[i]).attr("id");
			var currIDSpl = currID.split("-");
			minmaxOptionStr += currIDSpl[2] + "-" + currIDSpl[3] + "/";
		}

		var minmaxDetIDFilter = $("#minmax-selection-filterArea #minmaxDetIDFilter").val();

		var is_expertModeOn = $("#expertModeToggle").parent().hasClass("off") == false;

		var start = "";
		var end = "";
		var query = "";

		if (is_expertModeOn)
		{
			query = $('#expertQuery').val();
		}
		else
		{
			if ($("#runDateToggle").parent().hasClass("off") == false)
			{
				start = $(".option-selection #runMin").val();
				end = $(".option-selection #runMax").val();

				query = "where r.runnumber between " + start + " and " + end + " ";
			} 
			else
			{
				start = $("#datepicker #dateStart").val();
				end = $("#datepicker #dateEnd").val();

				query = "where r.starttime between to_date('" + start + "', '" + dateFormat + "') and to_date('" + end + "', '" + dateFormat + "') ";
			}
		}
		
		var is_runByRunOn = $("#careAboutRunLength").parent().hasClass("off");
		var is_superimpose = !$("#superimposeData").parent().hasClass("off");
		var is_beamData = $("#beam-cosmics-switch").parent().hasClass("off");
		var is_relativeValues = !$("#absoluteRelativeValues").parent().hasClass("off"); 
		var is_linear = $('#linLogToggle').parent().hasClass("off"); 

		var subDataSet = $.trim($("#propmtRecoDataset").val());
		subDataSet = (subDataSet == "") ? ((is_beamData) ? "StreamExpress" : "StreamExpressCosmics" ): subDataSet;

		// getting rid of pointless runs
		query += "and r.pixel_present = 1 and r.tracker_present = 1";
		if (is_beamData) query += " and r.beam1_stable = 1 and r.beam2_stable = 1";
	
		console.log("Complete set of parameters:");
		console.log("\tmodules: " + moduleStr);
		console.log("\toptions: " + optionStr);
		console.log("\tis expert mode on?: " + is_expertModeOn);
		console.log("\tquery content: " + query);
		console.log("\tis beam data on?: " + is_beamData);
		console.log("\tsub data set: " + subDataSet);
		console.log("\tminmax option: " + minmaxOptionStr + "\t\tDETID: " + minmaxDetIDFilter);

		// return;

		$("#plotImages").css("background-image", "url(\"img/magnify.gif\")");

		$("#hideSuperimposedData").prop("checked", false);

		$.post("php/getDataFromFile.php", {query : query,
										   moduleStr : moduleStr,
										   optionStr : optionStr,

										   minmaxOptionStr : minmaxOptionStr,
										   minmaxDetIDFilter : minmaxDetIDFilter,

										   beamDataOn : is_beamData ? 1 : 0,
										   subDataSet : subDataSet,

										   }, function(data){
												$("#plotImages").css("background-image", "");
												console.log(data);
												
												thisChart = CreatePlot(data, is_runByRunOn, is_superimpose, is_relativeValues, is_linear);

												$("#plotContainer").css("display", "block");

										        $('html, body').animate({
										            scrollTop: $("#plotContainer").offset().top
										        }, 500);

												$("#plotControlPanel").css("display", "block");

												$("#resetViewBtn").click(); // reset shows values under 0
												
										   }
										   , "json"
										   );
	});

});