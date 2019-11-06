var kick,  kickWaveform,  kickFFT;
var snare, snareWaveform, snareFFT;
var bass,  bassWaveform,  bassFFT;
var piano, pianoWaveform, pianoFFT;
var stepIndex = 0;
var nSteps = 16

function addStep(elem, color, poly=false){
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

function createSteps(elem, color, row=1, note=null, poly=false){
	var rect = elem.getBoundingClientRect();
	var parentRect = elem.parentElement.getBoundingClientRect();
	elem.style.width = parentRect.width - rect.left -1;//for border 

	for (var i=0; i< nSteps; i+=1){
		var step = document.createElement("div")
		step.className = 'step row'+row+' col'+i;
		step.style.width = (parseFloat(elem.style.width))/nSteps + 'px'; //2 pixel border

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

	//create the step bar
	var kickStep = document.getElementById("kick-holder").querySelectorAll(".stepContainer");
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
	var snareSteps = document.getElementById("snare-holder").querySelectorAll(".stepContainer");
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
	var bassStep = document.getElementById("bass-holder").querySelectorAll(".stepContainer");
	createSteps(bassStep[0], 'rgb(255, 0, 0)', 1, 'C3') //should use the visParams for this color
	createSteps(bassStep[0], 'rgb(255, 0, 0)', 2, 'E2') 
	createSteps(bassStep[0], 'rgb(255, 0, 0)', 3, 'D2') 
	createSteps(bassStep[0], 'rgb(255, 0, 0)', 4, 'C2') 
	createSteps(bassStep[0], 'rgb(255, 0, 0)', 5, 'A1') 
}

function setupPiano(oscillator){
	piano = new Tone.PolySynth(8, Tone.Synth, {
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
	// var cChord = ["C4", "E4", "G4", "B4"];
	// var dChord = ["D4", "F4", "A4", "C5"];
	// var gChord = ["B4", "D4", "E4", "A4"];
	// //C4, D4, E4, F4, G4, A4, B4, C5

	// var pianoPart = new Tone.Part(function(time, chord){
	// 	piano.triggerAttackRelease(chord, nSteps+'n', time);
	// }, [["0:0:2", cChord], ["0:1", cChord], ["0:1:3", dChord], ["0:2:2", cChord], ["0:3", cChord], ["0:3:2", gChord]]).start("2m");

	// pianoPart.loop = true;
	// pianoPart.loopEnd = "1m";
	// pianoPart.humanize = true;

	var pianoStep = document.getElementById("piano-holder").querySelectorAll(".stepContainer");
	createSteps(pianoStep[0], 'rgb(255, 165, 0)', 1, 'C4', true) //should use the visParams for this color
	createSteps(pianoStep[0], 'rgb(255, 165, 0)', 2, 'D4', true) 
	createSteps(pianoStep[0], 'rgb(255, 165, 0)', 3, 'E4', true) 
	createSteps(pianoStep[0], 'rgb(255, 165, 0)', 4, 'F4', true) 
	createSteps(pianoStep[0], 'rgb(255, 165, 0)', 5, 'G4', true) 
	createSteps(pianoStep[0], 'rgb(255, 165, 0)', 6, 'A4', true) 
	createSteps(pianoStep[0], 'rgb(255, 165, 0)', 7, 'B4', true) 
	createSteps(pianoStep[0], 'rgb(255, 165, 0)', 8, 'C5', true) 

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

	kickStep = document.getElementById("kick-holder").querySelectorAll(".step")[stepIndex];
	kickStep.style.borderColor = 'black';
	if (kickStep.playMe) kick.triggerAttackRelease("C2", nSteps+'n', time);

	snareStep = document.getElementById("snare-holder").querySelectorAll(".step")[stepIndex];
	snareStep.style.borderColor = 'black';
	if (snareStep.playMe) snare.triggerAttackRelease(time);

	bassStep = document.getElementById("bass-holder").querySelectorAll(".col" + stepIndex);
	for (var i=0; i<bassStep.length; i+=1){
		bassStep[i].style.borderColor = 'black';
		if (bassStep[i].playMe) bass.triggerAttackRelease(bassStep[i].note, "16n", time);
	}

	pianoStep = document.getElementById("piano-holder").querySelectorAll(".col" + stepIndex);
	for (var i=0; i<pianoStep.length; i+=1){
		pianoStep[i].style.borderColor = 'black';
		if (pianoStep[i].playMe) piano.triggerAttackRelease(pianoStep[i].note, "16n", time);
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

		var kickSteps = document.getElementById("kick-holder").querySelectorAll(".step");
		var steps = [0, 4*beat, nSteps-beat];
		steps.forEach(function(i){addStep(kickSteps[i],'rgb(0,0,255');})//this color should be set from the vis params

		var snareSteps = document.getElementById("snare-holder").querySelectorAll(".step");
		steps = [beat, 3*beat, 5*beat, nSteps-beat];
		steps.forEach(function(i){addStep(snareSteps[i],'rgb(0,255,0');})//this color should be set from the vis params

		//notes go from low (row5) to high (row1) in rows
		var bassSteps1 = document.getElementById("bass-holder").querySelectorAll(".step.row1");
		var bassSteps2 = document.getElementById("bass-holder").querySelectorAll(".step.row2");
		var bassSteps3 = document.getElementById("bass-holder").querySelectorAll(".step.row3");
		var bassSteps4 = document.getElementById("bass-holder").querySelectorAll(".step.row4");
		var bassSteps5 = document.getElementById("bass-holder").querySelectorAll(".step.row5");
		steps1= [2*beat, 3*beat];
		steps2= [4*beat];
		steps3= [Math.floor(3.5*beat), 6*beat];
		steps4= [0];
		steps5 = [nSteps-beat];
		steps1.forEach(function(i){addStep(bassSteps1[i],'rgb(255,0,0');})//this color should be set from the vis params
		steps2.forEach(function(i){addStep(bassSteps2[i],'rgb(255,0,0');})//this color should be set from the vis params
		steps3.forEach(function(i){addStep(bassSteps3[i],'rgb(255,0,0');})//this color should be set from the vis params
		steps4.forEach(function(i){addStep(bassSteps4[i],'rgb(255,0,0');})//this color should be set from the vis params
		steps5.forEach(function(i){addStep(bassSteps5[i],'rgb(255,0,0');})//this color should be set from the vis params


		var pianoSteps1 = document.getElementById("piano-holder").querySelectorAll(".step.row1");
		var pianoSteps2 = document.getElementById("piano-holder").querySelectorAll(".step.row2");
		var pianoSteps3 = document.getElementById("piano-holder").querySelectorAll(".step.row3");
		var pianoSteps4 = document.getElementById("piano-holder").querySelectorAll(".step.row4");
		var pianoSteps5 = document.getElementById("piano-holder").querySelectorAll(".step.row5");
		var pianoSteps6 = document.getElementById("piano-holder").querySelectorAll(".step.row6");
		var pianoSteps7 = document.getElementById("piano-holder").querySelectorAll(".step.row7");
		var pianoSteps8 = document.getElementById("piano-holder").querySelectorAll(".step.row8");
		steps1= [beat, 2*beat, 5*beat, 6*beat];
		steps2= [Math.floor(3.5*beat), 7*beat];
		steps3= [beat, 2*beat, 5*beat, 6*beat, 7*beat];
		steps4= [Math.floor(3.5*beat)];
		steps5= [beat, 2*beat, 5*beat, 6*beat];
		steps6= [Math.floor(3.5*beat), 7*beat];
		steps7= [beat, 2*beat, 5*beat, 6*beat, 7*beat];
		steps8= [Math.floor(3.5*beat)];
		steps1.forEach(function(i){addStep(pianoSteps1[i],'rgb(255,165,0)', true);})//this color should be set from the vis params
		steps2.forEach(function(i){addStep(pianoSteps2[i],'rgb(255,165,0)', true);})//this color should be set from the vis params
		steps3.forEach(function(i){addStep(pianoSteps3[i],'rgb(255,165,0)', true);})//this color should be set from the vis params
		steps4.forEach(function(i){addStep(pianoSteps4[i],'rgb(255,165,0)', true);})//this color should be set from the vis params
		steps5.forEach(function(i){addStep(pianoSteps5[i],'rgb(255,165,0)', true);})//this color should be set from the vis params
		steps6.forEach(function(i){addStep(pianoSteps6[i],'rgb(255,165,0)', true);})//this color should be set from the vis params
		steps7.forEach(function(i){addStep(pianoSteps7[i],'rgb(255,165,0)', true);})//this color should be set from the vis params
		steps8.forEach(function(i){addStep(pianoSteps8[i],'rgb(255,165,0)', true);})//this color should be set from the vis params


	}

}
window.onload = function() {
	setupSynths();
	defineGUI();
	loadPreset();

	Tone.Transport.scheduleRepeat(repeat, nSteps+'n'); //for step sequencing

}







