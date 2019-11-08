var kick,  kickWaveform,  kickFFT;
var snare, snareWaveform, snareFFT;
var bass,  bassWaveform,  bassFFT;
var piano, pianoWaveform, pianoFFT;
var stepIndex = 0;
var nSteps = 16
var	beat = nSteps/8;
var transport;

var stepContainerWidth = 500; //pixels
var stepHeight = 50; //pixels 

function addStep(elem, color, poly=false){
	if (elem){
		elemPlay = elem.playMe;
		if (!poly){
			var selectorID = elem.parentElement.parentElement.id
			var cls = elem.className.split(" ")[2]
			var col = document.getElementById(selectorID).querySelectorAll("."+cls)
			for (var i=0; i<col.length; i+=1) {
				col[i].style.backgroundColor = 'white';
				col[i].playMe = false;
			}
		}
		elem.style.backgroundColor = 'white'
		elem.playMe = !elemPlay;
		if (elem.playMe) elem.style.backgroundColor = color; 
	}
}

function createSteps(elem, color, row=1, note=null, poly=false){
	for (var i=0; i< nSteps; i+=1){
		var step = document.createElement("div")
		step.className = 'step row'+row+' col'+i;
		step.style.width = (parseFloat(elem.style.width))/nSteps + 'px'; 
		step.style.height = stepHeight + 4 + 'px'; //4 extra to match the extender size (annoyingly, I can't seem to fix this)

		if (note) step.note = note;
		step.playMe = false;

		step.addEventListener('mousedown', function(){addStep(this, color, poly)});
		elem.appendChild(step);
	}
}


//taken from the events example
function setupKick(steps){
	kick = new Tone.MembraneSynth({
		"envelope" : {
			"sustain" : 0,
			"attack" : 0.02,
			"decay" : 0.8
		},
		"octaves" : 10
	}).toMaster();
	//for visualizing
	kickFFT = new Tone.Analyser("fft", 1024);
	kickWaveform = new Tone.Analyser("waveform", 1024);
	kick.fan(kickWaveform, kickFFT);

	//add the steps
	setupKickSteps();

}
function showHideSteps(elem){
	console.log(elem)
	var extender = elem.querySelectorAll('.instExtender')[0]

	extender.classList.add('transformAnimator');
	var xpos = (100+stepContainerWidth); //how can I get the 100 in the code?
	extender.innerHTML = 'chevron_left'; //want this change after the transition
	if (extender.open){
		xpos = 0;
		extender.innerHTML = 'chevron_right';
	}  
	extender.style.transform = 'translate(' + xpos + 'px,0)';

	if (extender.open){
		extender.open = !extender.open
	} else {
		extender.open = true
	}
}
function setupKickSteps(){
	//create the step bar
	var parent = document.getElementById("kickContainer");
	var elem = parent.querySelectorAll(".stepContainer")[0];
	parent.querySelectorAll('#kickControlsExtender')[0].addEventListener('mousedown', function(){showHideSteps(
		parent)})
	var rect = elem.getBoundingClientRect();
	console.log(rect)
	elem.style.width = stepContainerWidth + 50 + 'px';
	elem.style.marginTop = -stepHeight/2. + 'px';
	elem.style.paddingLeft = '50px';

	createSteps(elem, 'rgb(0,0,255)') //should use the visParams for this color
}



function setupSynths(){

	setupKick();
	
		

	//set the transport 
	Tone.Transport.bpm.value = nSteps*6.;

	defineVisParms();




}

function repeat(time) {
	//change the step boxes
	var stepDOMs = document.getElementsByClassName('step');
	for (var i = 0; i < stepDOMs.length; i++) {
		stepDOMs[i].style.borderColor = "lightgray";
	}

	kickStep = document.getElementById("kickContainer").querySelectorAll(".step")[stepIndex];
	kickStep.style.borderColor = 'black';
	if (kickStep.playMe) kick.triggerAttackRelease("C2", nSteps+'n', time);

	stepIndex = (stepIndex + 1) % nSteps;

}

function defineGUI(){
	document.getElementById('playControl').addEventListener('mousedown', function(){
		var val = this.innerHTML;
		if (val == 'play_arrow'){
			this.innerHTML = 'stop';
			Tone.Transport.start();
		} else {
			this.innerHTML = 'play_arrow';
			Tone.Transport.stop();
		}
		stepIndex = 0

	});

	document.getElementById('clear').addEventListener('mousedown', clearSteps);
	document.getElementById('preset1').addEventListener('mousedown', function(){loadPreset(1)});
	document.getElementById('addSteps').addEventListener('mousedown', function(){modifySteps(1)});
	document.getElementById('minusSteps').addEventListener('mousedown', function(){modifySteps(-1)});
}

function modifySteps(add){
	oldSteps = nSteps
	nSteps += add;
	if (nSteps < 8) nSteps = 8;
	if (nSteps > 64) nSteps = 64;
	beat = Math.round(nSteps/8);
	console.log(nSteps, beat)

	document.getElementById('numSteps').innerHTML = nSteps

	if (oldSteps != nSteps){
		var promise = new Promise(function(resolve, reject){
			check = removeSteps()
			if (check) resolve("done")
		})
		promise.then(function(){
			init();
		});
	}
}
function removeSteps(){
	var steps = document.getElementsByClassName('stepContainer');
	for (var i=0; i<steps.length; i+=1){
		steps[i].innerHTML = ""; 
		if (i == steps.length-1) return true;
	}	
}
function clearSteps(){
	var steps = document.getElementsByClassName('step');
	for (var i=0; i<steps.length; i+=1){
		steps[i].style.backgroundColor = 'white';
		steps[i].playMe = false;
	}	
}
function loadPreset(preset=1){
	//clear all steps first
	clearSteps();

	if (preset == 1){

		var kickSteps = document.getElementById("kickContainer").querySelectorAll(".step");
		var steps = [0, 4*beat, nSteps-beat];
		steps.forEach(function(i){addStep(kickSteps[i],'rgb(0,0,255');})//this color should be set from the vis params



	}

}
function init(){
	setupSynths();
	loadPreset();
}

window.onload = function() {
	init();
	defineGUI();
	Tone.Transport.scheduleRepeat(repeat, nSteps+'n'); //for step sequencing	
}







