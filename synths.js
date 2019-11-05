var kick,  kickWaveform,  kickFFT;
var snare, snareWaveform, snareFFT;
var bass,  bassWaveform,  bassFFT;
var piano, pianoWaveform, pianoFFT;
var stepIndex = 0;
var nSteps = 16

var windowWidth = parseFloat(window.innerWidth);
var windowHeight = parseFloat(window.innerHeight);

function addStep(elem, color, poly=false){
	elemPlay = elem.playMe;
	if (!poly){
		var selectorID = elem.parentElement.parentElement.id
		var cls = elem.className.split(" ")[2]
		var col = document.getElementById("bass-selector").querySelectorAll("."+cls)
		for (var i=0; i<col.length; i+=1) {
			col[i].style.backgroundColor = 'white';
			col[i].playMe = false;
		}
	}
	elem.style.backgroundColor = 'white'
	elem.playMe = !elemPlay;
	if (elem.playMe) elem.style.backgroundColor = color; 
}

function createSteps(elem, color, row=1, note=null){
	elem.style.width = windowWidth - 200; //this should be tied back to the container size
	for (var i=0; i< nSteps; i+=1){
		var step = document.createElement("div")
		step.className = 'step row'+row+' col'+i;
		step.style.width = (parseFloat(elem.style.width) - nSteps*4)/nSteps + 'px'; //2 pixel border

		if (note) step.note = note;
		step.playMe = false;

		step.addEventListener('mousedown', function(){addStep(this, color)});
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

	//create the step bar
	var kickStep = document.getElementById("kick-selector").querySelectorAll(".stepContainer");
	createSteps(kickStep[0], 'rgb(0,0,255)') //should use the visParams for this color
}

function setupSnare(){
	snare = new Tone.NoiseSynth({
		"volume" : -5,
		"envelope" : {
			"attack" : 0.001,
			"decay" : 0.2,
			"sustain" : 0
		},
		"filterEnvelope" : {
			"attack" : 0.001,
			"decay" : 0.1,
			"sustain" : 0
		}
	}).toMaster();
	//for visualizing
	snareFFT = new Tone.Analyser("fft", 1024);
	snareWaveform = new Tone.Analyser("waveform", 1024);
	snare.fan(snareWaveform, snareFFT);

	//in the step bar
	var snareSteps = document.getElementById("snare-selector").querySelectorAll(".stepContainer");
	createSteps(snareSteps[0], 'rgb(0,255,0)') //should use the visParams for this color
	
}

function setupBass(){
	bass = new Tone.MonoSynth({
		"volume" : -10,
		"envelope" : {
			"attack" : 0.1,
			"decay" : 0.3,
			"release" : 2,
		},
		"filterEnvelope" : {
			"attack" : 0.001,
			"decay" : 0.01,
			"sustain" : 0.5,
			"baseFrequency" : 200,
			"octaves" : 2.6
		}
	}).toMaster();
	//for visualizing
	bassFFT = new Tone.Analyser("fft", 1024);
	bassWaveform = new Tone.Analyser("waveform", 1024);
	bass.fan(bassWaveform, bassFFT);

	//for loop (original)
	// var bassPart = new Tone.Sequence(function(time, note){
	// 	bass.triggerAttackRelease(note, "16n", time);
	// }, ["C2", ["C3", ["C3", "D2"]], "E2", ["D2", "A1"]]).start(0);
	// bassPart.probability = 0.9;

	//create the step bar
	var bassStep = document.getElementById("bass-selector").querySelectorAll(".stepContainer");
	createSteps(bassStep[0], 'rgb(255, 0, 0)', 1, 'A1') //should use the visParams for this color
	createSteps(bassStep[0], 'rgb(255, 0, 0)', 2, 'C2') 
	createSteps(bassStep[0], 'rgb(255, 0, 0)', 3, 'D2') 
	createSteps(bassStep[0], 'rgb(255, 0, 0)', 4, 'E2') 
	createSteps(bassStep[0], 'rgb(255, 0, 0)', 5, 'C3') 
}

function setupPiano(oscillator){
	piano = new Tone.PolySynth(4, Tone.Synth, {
		"volume" : -8,
		"oscillator" : {
			type: oscillator},
		"portamento" : 0.05
	}).toMaster();
	//for visualizing
	pianoFFT = new Tone.Analyser("fft", 1024);
	pianoWaveform = new Tone.Analyser("waveform", 1024);
	piano.fan(pianoWaveform, pianoFFT);

	//for loop
	var cChord = ["C4", "E4", "G4", "B4"];
	var dChord = ["D4", "F4", "A4", "C5"];
	var gChord = ["B3", "D4", "E4", "A4"];

	var pianoPart = new Tone.Part(function(time, chord){
		piano.triggerAttackRelease(chord, nSteps+'n', time);
	}, [["0:0:2", cChord], ["0:1", cChord], ["0:1:3", dChord], ["0:2:2", cChord], ["0:3", cChord], ["0:3:2", gChord]]).start("2m");

	pianoPart.loop = true;
	pianoPart.loopEnd = "1m";
	pianoPart.humanize = true;

}
function setPianoOscillator(selection){
	setupPiano(selection.value);
	visParams['piano-vis'].waveform = pianoWaveform;
	visParams['piano-vis'].fft = pianoFFT;
}

function setupSynths(){

	setupKick();
	setupSnare();
	setupBass();
	setupPiano('square');

	//set the transport 
	Tone.Transport.bpm.value = 90;

	defineVisParms();

	//my original setup
	// synth = new Tone.PolySynth(8, Tone.Synth, {
	// 		"oscillator" : {
	// 			//type: "sawtooth"
	// 			type: "custom",
	// 			"partials":[10,9,8,7,6,5,4,3,2,1]
	// 		}
	// 	});
	// synth.toMaster();

	// //bind the interface
	// document.querySelector("tone-piano").bind(synth);
	// document.querySelector("tone-synth").bind(synth);




}

function repeat(time) {
	//change the step boxes
	var stepDOMs = document.getElementsByClassName('step');
	for (var i = 0; i < stepDOMs.length; i++) {
		stepDOMs[i].style.borderColor = "lightgray";
	}

	kickStep = document.getElementById("kick-selector").querySelectorAll(".step")[stepIndex];
	kickStep.style.borderColor = 'black';
	if (kickStep.playMe) kick.triggerAttackRelease("C2", nSteps+'n', time);

	snareStep = document.getElementById("snare-selector").querySelectorAll(".step")[stepIndex];
	snareStep.style.borderColor = 'black';
	if (snareStep.playMe) snare.triggerAttackRelease(time);

	bassStep = document.getElementById("bass-selector").querySelectorAll("#step" + stepIndex);
	for (var i=0; i<bassStep.length; i+=1){
		bassStep[i].style.borderColor = 'black';
		if (bassStep[i].playMe) bass.triggerAttackRelease(bassStep[i].note, "16n", time);
	}



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
}

function loadPreset(preset=1){
	if (preset == 1){
		beat = nSteps/8;

		var kickSteps = document.getElementById("kick-selector").querySelectorAll(".step");
		var steps = [0, 4*beat, nSteps-beat];
		steps.forEach(function(i){addStep(kickSteps[i],'rgb(0,0,255');})//this color should be set from the vis params

		var snareSteps = document.getElementById("snare-selector").querySelectorAll(".step");
		steps = [beat, 3*beat, 5*beat, nSteps-beat];
		steps.forEach(function(i){addStep(snareSteps[i],'rgb(0,255,0');})//this color should be set from the vis params

		//notes go from low to high in rows
		var bassSteps1 = document.getElementById("bass-selector").querySelectorAll(".step.row1");
		var bassSteps2 = document.getElementById("bass-selector").querySelectorAll(".step.row2");
		var bassSteps3 = document.getElementById("bass-selector").querySelectorAll(".step.row3");
		var bassSteps4 = document.getElementById("bass-selector").querySelectorAll(".step.row4");
		var bassSteps5 = document.getElementById("bass-selector").querySelectorAll(".step.row5");
		steps1 = [nSteps-beat];
		steps2= [0];
		steps3= [Math.floor(3.5*beat), 6*beat];
		steps4= [4*beat];
		steps5= [2*beat, 3*beat];
		steps1.forEach(function(i){addStep(bassSteps1[i],'rgb(255,0,0');})//this color should be set from the vis params
		steps2.forEach(function(i){addStep(bassSteps2[i],'rgb(255,0,0');})//this color should be set from the vis params
		steps3.forEach(function(i){addStep(bassSteps3[i],'rgb(255,0,0');})//this color should be set from the vis params
		steps4.forEach(function(i){addStep(bassSteps4[i],'rgb(255,0,0');})//this color should be set from the vis params
		steps5.forEach(function(i){addStep(bassSteps5[i],'rgb(255,0,0');})//this color should be set from the vis params

	}

}
window.onload = function() {
	setupSynths();
	defineGUI();
	loadPreset();

	Tone.Transport.scheduleRepeat(repeat, nSteps+'n'); //for step sequencing

}







