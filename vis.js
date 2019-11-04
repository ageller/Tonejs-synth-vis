var visHolder = document.getElementById('vis-holder');

function setup(){
	//set the size of the div (will need to resize if page is changed)
	var windowWidth = parseFloat(window.innerWidth);
	var windowHeight = parseFloat(window.innerHeight);
	var left = parseFloat(visHolder.style.left);
	var top = parseFloat(visHolder.style.top);
	visHolder.style.width = windowWidth - left;
	visHolder.style.height = windowHeight - height;
	//create a canvas width and height of the screen
	var canvas = createCanvas(parseFloat(visHolder.style.width), parseFloat(visHolder.style.height));
	canvas.parent('vis-holder');
	//no fill
	fill(255);
	console.log(parseFloat(visHolder.style.height)/2., parseFloat(visHolder.style.width), parseFloat(visHolder.style.height)/2.)

}

var phase = 0;

function draw(){
	background(255);
	noFill();
	var width = parseFloat(visHolder.style.width);
	var yPos = parseFloat(visHolder.style.height)/2.;

	stroke(200);
	if (fft){
		var values = fft.getValue();

		beginShape();
		strokeWeight(5);
		for (var i = 0; i < values.length; i++) {
			var x = map(i, 0, values.length, 0, width);
			var y = map(values[i], -200, 0, height, 0);
			vertex(x, y);
		}
		endShape();
	}

	stroke('black');
	if (waveform){
		var values = waveform.getValue();
		beginShape();
		strokeWeight(5);
		for (var i = 0; i < values.length; i++) {
			var x = map(i, 0, values.length, 0, width);
			var y = map(values[i], -1, 1, height, 0);
			vertex(x, y);
		}
		endShape();
	}


	//draw a line that will change to the current waveform
}