var kick,  kickWaveform,  kickFFT;
var snare, snareWaveform, snareFFT;
var bass,  bassWaveform,  bassFFT;
var piano, pianoWaveform, pianoFFT;
var stepIndex = 0;
var nSteps = 16
var	beat = nSteps/8;
var transport;

var extendedContainerWidth = 500; //pixels
var stepHeight = 50; //pixels 




//taken from the events example
function setupKick(osc, attack, decay, volume){
	kick = new Tone.MembraneSynth({
		"pitchDecay" : 0.05 ,
		"octaves" : 20 ,
		"oscillator" : {
			"type" : osc
		} ,
		"envelope" : {
			"attack" : attack ,
			"decay" : decay,
			"sustain" : 0.01 ,
			"release" : 1.4 ,
			"attackCurve" : "exponential"
		}, 
		"volume": volume,

		// "envelope" : {
		// 	"sustain" : 0,
		// 	"attack" : 0.02,
		// 	"decay" : 0.8
		// },
		// "octaves" : 10
	}).toMaster();
	//for visualizing
	kickFFT = new Tone.Analyser("fft", 1024);
	kickWaveform = new Tone.Analyser("waveform", 1024);
	kick.fan(kickWaveform, kickFFT);

	//connect the controls
	setupControls('kick');

	//format the steps container and add the steps
	//key, color, Nrows, notes, poly
	setupSteps('kick', 'rgb(0,0,255)', 1, null, false);
}






function setupSynths(){

	setupKick("sine", 1, 0.4, 0);

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


function init(){
	setupSynths();
	loadPreset();

	defineVisParms();

	//set the tempo 
	Tone.Transport.bpm.value = nSteps*6.;
}

window.onload = function() {
	init();
	defineGUI();
	Tone.Transport.scheduleRepeat(repeat, nSteps+'n'); //for step sequencing	
}







