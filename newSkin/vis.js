var visParams

function defineVisParms(){
	visParams = {
		'height':100.,//px //this should be decided based on the container size
		'kick':{
			'initialWaveform':kickInitialWaveform,
			'waveform':kickWaveform,
			'fft':kickFFT,
			'color':[0,0,255]
		},
		'snare':{
			'waveform':snareWaveform,
			'fft':snareFFT,
			'color':[0,255,0]
		},
		'bass':{
			'waveform':bassWaveform,
			'fft':bassFFT,
			'color':[255,0,0]
		},
		'piano':{
			'waveform':pianoWaveform,
			'fft':pianoFFT,
			'color':[255,165,0]
		}
	}
}

var circleVis = function(p){ 

	var visHolder;
	var r0, x0, y0;
	var key;

	p.setup = function() {
		//first a dummy, then resize afterwards
		var canvas = p.createCanvas();
		visHolder = p.canvas.parentNode;
		//I don't love this...
		var p1 = visHolder.id.indexOf('Vis')
		key = visHolder.id.substring(0,p1);

		var rect = visHolder.getBoundingClientRect();
		r0 = Math.sqrt(rect.width*rect.width/4 + rect.height*rect.height/4)/2.;
		x0 = rect.width/2.;
		y0 = rect.height/2.;

		p.resizeCanvas(rect.width, rect.height);

	};


	p.draw = function() {
	//draw a line that will change to the current waveform
        p.clear();
		p.noFill();
	 	var waveform = visParams[key].waveform;
	 	var fft = visParams[key].fft;
	 	var color = visParams[key].color;

		p.translate(x0, y0)
		p.stroke(color);
		if (waveform){
			var values = waveform.getValue();
			p.beginShape();
			p.strokeWeight(2);
			for (var i = 0; i < values.length; i++) {
				var theta = p.map(i, 0, values.length, 0, 2.*Math.PI);
				var r = p.map(values[i], -1, 1, 0.3*r0, -0.3*r0);
				var x = (r + 1.1*r0)*Math.cos(theta);
				var y = (r + 1.1*r0)*Math.sin(theta);
				//console.log(theta, r, r0, x, y)
				p.vertex(x, y);
			}
			p.endShape();
		}

		// var ca = []
		// color.forEach(function(x){ ca.push(x)});
		// ca.push(50) //add alpha
		// p.stroke(ca);
		// if (fft){
		// 	var values = fft.getValue();
		// 	p.beginShape();
		// 	p.strokeWeight(5);
		// 	for (var i = 0; i < values.length; i++) {
		// 		var x = p.map(i, 0, values.length, 0, w);
		// 		var y = p.map(values[i], -200, 0, h/2., -h/2.);
		// 		p.vertex(x, y);
		// 	}
		// 	p.endShape();
		// }
	};

};
new p5(circleVis, 'kickVis');
//var myp5 = new p5(circleVis, 'snare-vis');
//var myp5 = new p5(circleVis, 'bass-vis');
//var myp5 = new p5(circleVis, 'piano-vis');



///for the initial waveform in the pull out window
var waveVis = function(p){ 

	var visHolder;
	var w, h;
	var key;
	p.setup = function() {
		//first a dummy, then resize afterwards
		var canvas = p.createCanvas();
		visHolder = p.canvas.parentNode;
		//I don't love this...
		var p1 = visHolder.id.indexOf('Wave')
		key = visHolder.id.substring(0,p1);

		var rect = visHolder.getBoundingClientRect();
		w = rect.width;
		h = visParams.height;//rect.height;

		p.resizeCanvas(rect.width, rect.height);

	};


	p.draw = function() {
	//draw a line that will change to the current waveform
        p.clear();
		p.noFill();
	 	var waveform = visParams[key].initialWaveform;
	 	var color = visParams[key].color;

		p.translate(100, h/2. + 75) //need to fix this
		p.stroke(color);
		if (waveform){
			var values = waveform.getValue();
			p.beginShape();
			p.strokeWeight(2);
			for (var i = 0; i < values.length; i++) {
				var x = p.map(i, 0, values.length, 0, w);
				var y = p.map(values[i], -1, 1, h/2., -h/2.);
				p.vertex(x, y);
			}
			p.endShape();
		}

	};

};
new p5(waveVis, 'kickWave');

