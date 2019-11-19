function defineVisParms(){
	visParams = {
		'height':75.,//px //this should be decided based on the container size
		'kick':{
			'initialWaveform':kickInitialWaveform,
			'waveform':kickWaveform,
			'fft':kickFFT,
		},
		'snare':{
			'initialWaveform':snareInitialWaveform,
			'waveform':snareWaveform,
			'fft':snareFFT,
		},
		'bass':{
			'initialWaveform':bassInitialWaveform,
			'initialWaveformValue':bassInitialWaveform.getValue(), //this gives an error on load
			'waveform':bassWaveform,
			'fft':bassFFT,
		},
		'piano':{
			'initialWaveform':pianoInitialWaveform,
			'waveform':pianoWaveform,
			'fft':pianoFFT,
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
		parent = document.getElementById(key+'Container');
		parentRect = parent.getBoundingClientRect();


		//I could probably turn this sizing into a formula with one input, but for now this works
		var w = parentRect.width + 100;
		var h = parentRect.height + 100;

		//make this big so that there is no clipping, and try to center it
		visHolder.style.height = 1000 + 'px';
		visHolder.style.width = 1000 + 'px';
		visHolder.style.marginLeft = -400 + 'px';
		visHolder.style.marginTop = -400 + 'px';

		var rect = visHolder.getBoundingClientRect();
		r0 = Math.sqrt(w*w/4 + h*h/4)/2.;
		x0 = w/2 + 400;;
		y0 = h/2 + 400;

		p.resizeCanvas(rect.width, rect.height);

		haveCircleVis[key] = true;

	};


	p.draw = function() {
	//draw a line that will change to the current waveform
        p.clear();
		p.noFill();
	 	var waveform = visParams[key].waveform;
	 	var fft = visParams[key].fft;
	 	var color = synthParams[key].color;

		p.translate(x0, y0)
		p.stroke(color);
		if (waveform){
			var values = waveform.getValue();
			p.beginShape();
			p.strokeWeight(8);
			//mirror so that it closes at each end?
			for (var i = 0; i < values.length; i++) {
				var theta = p.map(i, 0, values.length, 0, Math.PI);
				var r = p.map(values[i], -1, 1, r0, -1*r0);
				var x = (r + 1.1*r0)*Math.cos(theta);
				var y = (r + 1.1*r0)*Math.sin(theta);
				//console.log(theta, r, r0, x, y)
				p.vertex(x, y);
			}
			for (var i = values.length-1; i >= 0; i--) {
				var theta = 2.*Math.PI - p.map(i, 0, values.length, 0, Math.PI);
				var r = p.map(values[i], -1, 1, r0, -1*r0);
				var x = (r + 1.1*r0)*Math.cos(theta);
				var y = (r + 1.1*r0)*Math.sin(theta);
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
		visHolder.querySelectorAll('.p5Canvas')[0].classList.add('dragable');

		var rect = visHolder.parentNode.getBoundingClientRect();
		w = rect.width - 75;
		h = visParams.height;//rect.height;

		p.resizeCanvas(w, h);
		visHolder.style.marginTop = (stepHeight + 10) + 'px';

		haveWaveVis[key] = true;

	};


	p.draw = function() {
	//draw a line that will change to the current waveform
        p.clear();
		p.noFill();
	 	var waveform = visParams[key].initialWaveform;
	 	var color = synthParams[key].color;

		p.translate(100, h/2.) //need to fix this
		p.stroke(color);
		if (waveform){
			var values = waveform.getValue();
			p.beginShape();
			p.strokeWeight(2);
			for (var i = 0; i < values.length; i++) {
				var x = p.map(i, 0, values.length, 0, w);
				var y = p.map(values[i], -1, 1, 0.95*h/2., -0.95*h/2.);
				p.vertex(x, y);
			}
			p.endShape();
		}

	};

};

