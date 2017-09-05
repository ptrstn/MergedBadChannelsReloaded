$(document).ready(function() {

	var savedPlots = 0;
	var dateFormat = "dd/mm/yyyy";

	$.post("php/maxRunUtil.php", {}, function(data){
				console.log("CurrMaxRunNum: ");				
				console.log(data);

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
		changeAxisType($(this).parent().hasClass('off'));
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

	////////////////////////////////////////////////////////////////

	$("#plotSaveBtn").on('click', function(){
		var img = $('#thePlot')[0].toDataURL("image/png");

		var afake = $("<a></a>").attr("href", img).attr("download", "plot" + savedPlots++ + ".png").css("display", "none").html("Link").appendTo("body");

        $(afake)[0].click();
        window.setTimeout(function () {
            $(afake).remove();
        }, 200);

	});

	$("#resetViewBtn").on('click', function(){
		thisChart.resetZoom();
	});

	$("#careAboutRunLength, #superimposeData").on('change', function()
	{
		$("#plotImages").click();
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

		objs = $(".option-selection input[id^='option']:checked");
		console.log(objs.length + " options to monitor");
		var optionStr = "";
		for (i = 0; i < objs.length; ++i)
		{
			var sub = $(objs[i]).attr("id").substr(7, 1);
			optionStr = optionStr + sub + "/";
		}

		if ($("#module60").is(":checked")) //small workaround - inserting fake option
		{
			optionStr = optionStr + "10/";
		}

		var start = "";
		var end = "";

		var is_expertModeOn = $("#expertModeToggle").parent().hasClass("off") == false;
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
	
		console.log("Complete set of parameters:");
		console.log("\tmodules: " + moduleStr);
		console.log("\toptions: " + optionStr);
		console.log("\tis expert mode on?: " + is_expertModeOn);
		console.log("\tquery content: " + query);

		// return;

		$("#plotImages").css("background-image", "url(\"img/magnify.gif\")");

		$.post("php/getDataFromFile.php", {query : query,
										   moduleStr : moduleStr,
										   optionStr : optionStr}, function(data){
												$("#plotImages").css("background-image", "");
												console.log(data);
												
												CreatePlot(data, is_runByRunOn, is_superimpose);

										        $('html, body').animate({
										            scrollTop: $("#plotContainer").offset().top
										        }, 500);

												$("#plotControlPanel").css("display", "block");
												
										   }
										   , "json"
										   );
	});

});