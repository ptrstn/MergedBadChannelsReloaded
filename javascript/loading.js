$(document).ready(function() {

	// RUN SLIDER
	var initialSliderValues = [270000, 300000];
	var minSliderVal = 261370;
	var maxSliderVal = 320000;
	var ticks = []

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

	// TOGGLERS
	$('#runDateToggle').bootstrapToggle('on');
	$('#careAboutRunLength').bootstrapToggle('off');

	$("#runDateToggle").change(function(){
		$('#datePicker').toggle();
		$('#runRangePicker').toggle();

		// console.log($("#runDateToggle").parent().hasClass("off"));
	});

	// DATEPICKER
	$('.input-daterange').datepicker({
        format: "dd/mm/yyyy",
        weekStart: 1,
        daysOfWeekHighlighted: "0",
        calendarWeeks: true,
        autoclose: true,
        todayHighlight: true,
        maxViewMode: 3
    });

    var today = moment();
	var todayStr = moment().format('DD/MM/YYYY');
	var histDateStr = today.add(-4, 'day').format('DD/MM/YYYY');
	// console.log(todayStr);

	$("#datepicker #dateStart").val(histDateStr);
	$("#datepicker #dateEnd").val(todayStr);

	////////////////////////////////////////////////////////////////

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
		is_searchbyrun = "";

		if ($("#runDateToggle").parent().hasClass("off") == false)
		{
			is_searchbyrun = true;

			start = $(".option-selection #runMin").val();
			end = $(".option-selection #runMax").val();
		} 
		else
		{
			is_searchbyrun = false;

			start = $("#datepicker #dateStart").val();
			end = $("#datepicker #dateEnd").val();
		}	

		console.log("Complete set of parameters:");
		console.log("\tmodules: " + moduleStr);
		console.log("\toptions: " + optionStr);
		console.log("\tis search by run?: " + is_searchbyrun);
		console.log("\trun min: " + start);
		console.log("\trun max: " + end);

		// return;

		$("#plotImages").css("background-image", "url(\"img/magnify.gif\")");

		$.post("php/getDataFromFile.php", {start : start,
										   end : end,
										   is_searchbyrun : is_searchbyrun,
										   moduleStr : moduleStr,
										   optionStr : optionStr}, function(data){
												$("#plotImages").css("background-image", "");

												CreatePlot(data);
												
										   }
										   , "json"
										   );
	});

});