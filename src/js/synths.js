var kickWaveform,  kickFFT, kickInitialWaveform;
var snareWaveform, snareFFT, snareInitialWaveform;;
var bass,  bassWaveform,  bassFFT, bassInitialWaveform;;
var piano, pianoWaveform, pianoFFT, pianoInitialWaveform;;
var stepIndex = 0;
var nSteps = 16
var	beat = nSteps/8;
var transport;

var extendedContainerWidth = 500; //pixels
var stepHeight = 100; //pixels 
var oscillatorMap = {0:"sine", 1:"square", 2:"triangle", 3:"sawtooth"};
var oscillatorMapReverse = {"sine":0, "square":1, "triangle":2, "sawtooth":3};

//pulse oscillator looks like EB, with large width value
var synthParams = {'kick':{
					'instrument':null,
					'notes':['C2'],
					'volume':-1,
					'attack':0.1,
					'decay':0.8,
					'oscillator':'sine',
					'color': [0,0,255],
				},

				'snare':{
					'instrument':null,
					'notes':[null],
					'volume':-5,
					'attack':0.001,
					'decay':0.2,
					'oscillator':'sine',
					'color': [0,255,0]
				},

				'bass':{
					'instrument':null,
					'notes':['C3','E2','D2','C2','A1'],
					'volume':-5,
					'attack':0.1,
					'decay':0.3,
					'oscillator':'square',
					'color': [255,0,0]
				},

				'piano':{
					'instrument':null,
					'notes':['C4','D4','E4','F4','G4','A4','B4','C5'],
					'volume':-6,
					'attack':0.2,
					'decay':0.4,
					'oscillator':'sawtooth',
					'color': [255,165,0]
				},
			};

var repeatList = ['kick', 'snare', 'bass', 'piano'];
var visParams;
var haveWaveVis = {'kick':false, 'snare':false, 'bass':false, 'piano':false};
var haveCircleVis = {'kick':false, 'snare':false, 'bass':false, 'piano':false};



//taken from the events example
function defineInst(key){
	//Note: Volume is in dB
	switch (key) {
		case 'kick':
			var kick = new Tone.MembraneSynth({
				"pitchDecay" : 0.05 ,
				"octaves" : 10 ,
				"oscillator" : {
					"type" : synthParams[key].oscillator
				} ,
				"envelope" : {
				    "baseFrequency": 200,
					"attack" : synthParams[key].attack,
					"decay" : synthParams[key].decay,
					"sustain" : 0.02 ,
					"release" : 0.04 ,
					"attackCurve" : "exponential"
				}, 
				"volume": synthParams[key].volume,
			}).toMaster();

			//for visualizing
			kickFFT = new Tone.Analyser("fft", 1024);
			kickWaveform = new Tone.Analyser("waveform", 1024);
			kick.fan(kickWaveform, kickFFT);

			synthParams['kick'].instrument = kick;

			//can I get the initial waveform by playing it once?
			Tone.Offline(function(){
				//only nodes created in this callback will be recorded
				var oscillator = new Tone.Oscillator(synthParams[key].notes[0], synthParams[key].oscillator).toMaster().start(0)
				kickInitialWaveform = new Tone.Analyser("waveform", 1024);
				oscillator.fan(kickInitialWaveform)
			}, 2).then(function(buffer){
				defineVisParms();
				if (!haveCircleVis['kick'])	new p5(circleVis, 'kickVis');
				if (!haveWaveVis['kick']) new p5(waveVis, 'kickWave');
			})

			break;

		case 'snare':
			var snare = new Tone.NoiseSynth({
				"volume" : synthParams[key].volume,
				"oscillator" : {
					"type" : synthParams[key].oscillator
				} ,
				"envelope" : {
					"attack" : synthParams[key].attack,
					"decay" : synthParams[key].decay,
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

			synthParams['snare'].instrument = snare;

			//can I get the initial waveform by playing it once?
			Tone.Offline(function(){
				//only nodes created in this callback will be recorded
				var oscillator = new Tone.PulseOscillator("C3", 0.7).toMaster().start(0)
				snareInitialWaveform = new Tone.Analyser("waveform", 1024);
				oscillator.fan(snareInitialWaveform)
			}, 2).then(function(buffer){
				defineVisParms();
				if (!haveCircleVis['snare']) new p5(circleVis, 'snareVis');
				if (!haveWaveVis['snare']) new p5(waveVis, 'snareWave');
			
			})

			break;

		case 'bass':
			var bass = new Tone.MonoSynth({
				"volume" : synthParams[key].volume,
				"oscillator" : {
					"type" : synthParams[key].oscillator
				} ,
				"envelope" : {
					"attack" : synthParams[key].attack,
					"decay" : synthParams[key].decay,
					"release" : 2
				},
				"filterEnvelope" : {
					"attack" : 0.001,
					"decay" : 0.01,
					"sustain" : 0.5,
					"bassFrequency": 200,
					"octaves" : 2.6,
				}
			}).toMaster();


			//for visualizing
			bassFFT = new Tone.Analyser("fft", 1024);
			bassWaveform = new Tone.Analyser("waveform", 1024);
			bass.fan(bassWaveform, bassFFT);

			synthParams['bass'].instrument = bass;

			//can I get the initial waveform by playing it once?
			Tone.Offline(function(){
				//only nodes created in this callback will be recorded
				var oscillator = new Tone.Oscillator(synthParams[key].notes[0], synthParams[key].oscillator).toMaster().start(0)
				bassInitialWaveform = new Tone.Analyser("waveform", 1024);
				oscillator.fan(bassInitialWaveform)
			}, 2).then(function(buffer){
				defineVisParms();
				if (!haveCircleVis['bass']) new p5(circleVis, 'bassVis');
				if (!haveWaveVis['bass']) new p5(waveVis, 'bassWave');
			
			})

			break;

		case 'piano':
			var piano = new Tone.PolySynth(8, Tone.Synth, {
				"volume" : synthParams[key].volume,
				"oscillator" : {
					"type" : synthParams[key].oscillator
				} ,
				"envelope" : {
					"attack" : synthParams[key].attack,
					"decay" : synthParams[key].decay,
					"release" : 2
				},
			}).toMaster();


			//for visualizing
			pianoFFT = new Tone.Analyser("fft", 1024);
			pianoWaveform = new Tone.Analyser("waveform", 1024);
			piano.fan(pianoWaveform, pianoFFT);

			synthParams['piano'].instrument = piano;

			//can I get the initial waveform by playing it once?
			Tone.Offline(function(){
				//only nodes created in this callback will be recorded
				var oscillator = new Tone.Oscillator(synthParams[key].notes[0], synthParams[key].oscillator).toMaster().start(0)
				pianoInitialWaveform = new Tone.Analyser("waveform", 1024);
				oscillator.fan(pianoInitialWaveform)
			}, 2).then(function(buffer){
				defineVisParms();
				if (!haveCircleVis['piano']) new p5(circleVis, 'pianoVis');
				if (!haveWaveVis['piano']) new p5(waveVis, 'pianoWave');
			
			})

			break;
	}

}







function repeat(time) {
	//change the step boxes
	var stepDOMs = document.getElementsByClassName('step');
	for (var i = 0; i < stepDOMs.length; i++) {
		stepDOMs[i].style.borderColor = "lightgray";
	}

	repeatList.forEach(function(key){

		var step = document.getElementById(key+"Container").querySelectorAll(".col" + stepIndex);
		for (var i=0; i<step.length; i+=1){

			step[i].style.borderColor = 'black';

			if (step[i].dataset.playMe == 'true') {
				//console.log(step[i], step[i].dataset.playMe, step[i].dataset.note, synthParams[key].instrument)
				if (key == 'snare') {
					synthParams[key].instrument.triggerAttackRelease(time);
				} else {
					synthParams[key].instrument.triggerAttackRelease(step[i].dataset.note, nSteps+'n', time);
				}

			}
		}
	});
	stepIndex = (stepIndex + 1) % nSteps;

}


function setupDOM(key, left, top){
	var body = document.getElementsByTagName("BODY")[0];
	
	var container = document.createElement("div");
	container.id = key+'Container';
	container.className = 'instContainer';
	container.style.top = top + 'px';
	container.style.left = left + 'px';

	//to hold the dropshadow, since I want it below everything
	var shadow = document.createElement("div");
	shadow.className = 'instControls dropShadow7';
	container.appendChild(shadow);

	var controls = document.createElement("div");
	controls.id = key+'Controls';
	controls.className = 'instControls';
	container.appendChild(controls);

	//I want some way to fix the shadow that is on top of this element (and make the extender shadow look better)
	var extender = document.createElement("div");
	extender.id = key+'ControlsExtender';
	extender.className ='material-icons instExtender playControls playControlsHover transformAnimator';
	extender.style.lineHeight = '50px';
	extender.style.fontSize = '50px';
	extender.innerHTML = 'chevron_right';
	extender.addEventListener('mousedown', function(){showHideExtendedControls(container)})
	container.appendChild(extender);

	var extend = document.createElement("div");
	extend.id = key+'Extend';
	extend.className = 'extendedContainer transformAnimator';
	extend.style.clipPath = 'inset(0px 0px -10px ' + extendedContainerWidth + 'px)'; //values are from-top, from-right, from-bottom, from-left
	extend.style.transform = 'translate(' + (-extendedContainerWidth) + 'px,0)';

	var visW = document.createElement("div");
	visW.id = key+"Wave";
	visW.className = 'instVis';
	extend.appendChild(visW);
	container.appendChild(extend);

	var vis = document.createElement("div");
	vis.id = key+"Vis";
	vis.className = 'instVis';
	container.appendChild(vis);

	body.appendChild(container);

	//now format a bit more
	var parentRect = container.getBoundingClientRect();
	extend.style.width = extendedContainerWidth + parentRect.width/2. + 'px';
	extend.style.height = parentRect.height + 'px';

	var h = parentRect.height/2.;
	extend.style.marginTop = -h + 'px';
	extend.style.marginLeft = -parentRect.width/2. + 'px';
	extend.style.borderRadius = '0 ' + h + 'px ' + h +'px 0';
	
	showHideExtendedControls(container)

}



function setupInst(key, x, y, controlsList, poly){

	//the DOM elements
	setupDOM(key, x, y);

	//the instrument
	defineInst(key);

	//connect the controls
	setupControls(key, controlsList)

	//format the steps container and add the steps
	setupSteps(key, poly);

}

function init(){
	setupInst('kick', 0, 50, ['volume', 'oscillator', 'attack', 'decay', 'mute'], false);
	setupInst('snare', 0, 300, ['volume', 'attack', 'decay', 'mute'], false);
	setupInst('bass', 800, 50, ['volume', 'oscillator', 'attack', 'decay', 'mute'], false);
	setupInst('piano', 800, 300, ['volume', 'oscillator', 'attack', 'decay', 'mute'], true);

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







