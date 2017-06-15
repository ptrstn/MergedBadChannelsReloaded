$(document).ready(function() {
	console.log("on load");

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


	$("#plotImages").on("click", function(){
		console.log("Process Started!");
		/////////////////////////////////////////////////////
		var ctx = $("#thePlot")[0].getContext('2d');

		$("#thePlot").css("border-style", "ridge");

		var myChart = new Chart(ctx, {
		    type: 'line',
		    data: {
		        labels: [1, 2,3,4,5,6],
		        datasets: [{
		        	// steppedLine: true,
		            label: '# of Votes',
		            data: [12, 19, 3, 5, 2, 3],
		            // backgroundColor: [
		            //     'rgba(255, 99, 132, 0.2)',
		            //     'rgba(54, 162, 235, 0.2)',
		            //     'rgba(255, 206, 86, 0.2)',
		            //     'rgba(75, 192, 192, 0.2)',
		            //     'rgba(153, 102, 255, 0.2)',
		            //     'rgba(255, 159, 64, 0.2)'
		            // ],
		            // borderColor: [
		            //     'rgba(255,99,132,1)',
		            //     'rgba(54, 162, 235, 1)',
		            //     'rgba(255, 206, 86, 1)',
		            //     'rgba(75, 192, 192, 1)',
		            //     'rgba(153, 102, 255, 1)',
		            //     'rgba(255, 159, 64, 1)'
		            // ],
		            borderWidth: 3,
		            borderColor: 'rgba(255, 159, 64, 1)',
		            fill: false,
		        }]
		    },
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
					mode: 'xy',
					limits: {
						max: 1,
						min: 1
					}
				},
		    }
		});		

	});

});