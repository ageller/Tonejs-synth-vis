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
	var parentRect = elem.parentElement.getBoundingClientRect();
	var parent2Rect = elem.parentElement.parentElement.getBoundingClientRect();
	for (var i=0; i< nSteps; i+=1){
		var step = document.createElement("div")
		step.className = 'step row'+row+' col'+i;
		step.style.width = (parseFloat(parentRect.width) - parent2Rect.width)/nSteps + 'px'; 
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

function moveExtender(elem){
	//move the extender
	var extender = elem.querySelectorAll('.instExtender')[0]
	extender.classList.add('transformAnimator');
	var xpos = stepContainerWidth;
	if (elem.open){
		xpos = 0;
	}  
	extender.style.transform = 'translate(' + xpos + 'px,0)';

	//change the icon
	function changeChevron(event){
		extender.removeEventListener(transitionEvent, changeChevron);
		if (elem.open){
			extender.innerHTML = 'chevron_left';
		}  else {
			extender.innerHTML = 'chevron_right'; //want this change after the transition
		}
	}
	var transitionEvent = whichTransitionEvent();
	extender.addEventListener(transitionEvent, changeChevron);



}
function showHideSteps(elem){
	moveExtender(elem);
	var stepContainer = elem.querySelectorAll(".stepContainer")[0];
	stepContainer.classList.add('transformAnimator');

	//also toggle the open flag
	if (elem.open){
		console.log('closing')
		stepContainer.style.clipPath = 'inset(0px 0px 0px ' + stepContainerWidth + 'px)'; //values are from-top, from-right, from-bottom, from-left
		stepContainer.style.transform = 'translate(' + (-stepContainerWidth) + 'px,0)';
		elem.open = !elem.open
	} else {
		console.log('opening')
		stepContainer.classList.remove("hidden");
		stepContainer.style.clipPath = 'inset(0px 0px 0px 0px)'; 
		stepContainer.style.transform = 'translate(0,0)';

		elem.open = true
	}
}
function setupKickSteps(){
	//create the step bar
	var parent = document.getElementById("kickContainer");
	var elem = parent.querySelectorAll(".stepContainer")[0];
	var extender = parent.querySelectorAll('#kickControlsExtender')[0]
	extender.addEventListener('mousedown', function(){showHideSteps(parent)})
	var parentRect = parent.getBoundingClientRect();
	var rect = elem.getBoundingClientRect();
	elem.style.width = stepContainerWidth + parentRect.width/2. + 'px';
	elem.style.height = parentRect.height + 'px';
	elem.style.clipPath = 'inset(0px 0px 0px ' + stepContainerWidth + 'px)'; //values are from-top, from-right, from-bottom, from-left
	elem.style.transform = 'translate(' + (-stepContainerWidth) + 'px,0)';

	var h = parentRect.height/2.;
	elem.style.marginTop = -h + 'px';
	elem.style.marginLeft = -parentRect.width/2. + 'px';
	elem.style.borderRadius = '0 ' + h + 'px ' + h +'px 0';

	var stepHolder = document.createElement("div")
	stepHolder.style.marginLeft = parentRect.width/2. + 'px';
	elem.appendChild(stepHolder);
	createSteps(stepHolder, 'rgb(0,0,255)') //should use the visParams for this color
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







