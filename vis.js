var windowWidth = parseFloat(window.innerWidth);
var windowHeight = parseFloat(window.innerHeight);
var visParams

function defineVisParms(){
	visParams = {
		'height':100.,//px
		'kick-vis':{
			'waveform':kickWaveform,
			'fft':kickFFT,
			'color':[0,0,255]
		},
		'snare-vis':{
			'waveform':snareWaveform,
			'fft':snareFFT,
			'color':[0,255,0]
		},
		'bass-vis':{
			'waveform':bassWaveform,
			'fft':bassFFT,
			'color':[255,0,0]
		},
		'piano-vis':{
			'waveform':pianoWaveform,
			'fft':pianoFFT,
			'color':[255,165,0]
		}
	}
}

var s = function(p){ 

	var visHolder;
	p.setup = function() {
		//first a dummy, then resize afterwards
		var canvas = p.createCanvas();
		visHolder = p.canvas.parentNode;

		var left = parseFloat(visHolder.style.left);
		var top = parseFloat(visHolder.style.top);
		visHolder.style.width = windowWidth - left;
		visHolder.style.height = visParams.height;
		p.resizeCanvas(parseFloat(visHolder.style.width), parseFloat(visHolder.style.height));
	 	p.fill(255);

	};


	p.draw = function() {
	//draw a line that will change to the current waveform
		p.background(255);
		p.noFill();
	 	var waveform = visParams[visHolder.id].waveform;
	 	var fft = visParams[visHolder.id].fft;
	 	var color = visParams[visHolder.id].color;
		var w = parseFloat(visHolder.style.width);
		var h = visParams.height;

		p.translate(0, h/2.)
		p.stroke(color);
		if (waveform){
			var values = waveform.getValue();
			p.beginShape();
			p.strokeWeight(5);
			for (var i = 0; i < values.length; i++) {
				var x = p.map(i, 0, values.length, 0, w);
				var y = p.map(values[i], -1, 1, h/2., -h/2.);
				p.vertex(x, y);
			}
			p.endShape();
		}

		var ca = []
		color.forEach(function(x){ ca.push(x)});
		ca.push(50) //add alpha
		p.stroke(ca);
		if (fft){
			var values = fft.getValue();
			p.beginShape();
			p.strokeWeight(5);
			for (var i = 0; i < values.length; i++) {
				var x = p.map(i, 0, values.length, 0, w);
				var y = p.map(values[i], -200, 0, h/2., -h/2.);
				p.vertex(x, y);
			}
			p.endShape();
		}
	};

};
var myp5 = new p5(s, 'kick-vis');
var myp5 = new p5(s, 'snare-vis');
var myp5 = new p5(s, 'bass-vis');
var myp5 = new p5(s, 'piano-vis');



