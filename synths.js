var kick,  kickWaveform,  kickFFT;
var snare, snareWaveform, snareFFT;
var bass,  bassWaveform,  bassFFT;
var piano, pianoWaveform, pianoFFT;

//taken from the events example
function setupKick(){
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

	//for loop
	var kickPart = new Tone.Loop(function(time){
		kick.triggerAttackRelease("C2", "8n", time);
	}, "2n").start(0);
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

	//for loop
	var snarePart = new Tone.Loop(function(time){
		snare.triggerAttack(time);
	}, "2n").start("4n");
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

	//for loop
	var bassPart = new Tone.Sequence(function(time, note){
		bass.triggerAttackRelease(note, "16n", time);
	}, ["C2", ["C3", ["C3", "D2"]], "E2", ["D2", "A1"]]).start(0);

	bassPart.probability = 0.9;
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
		piano.triggerAttackRelease(chord, "8n", time);
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


	document.querySelector("tone-play-toggle").bind(Tone.Transport);

}


window.onload = function() {
	setupSynths();
}





