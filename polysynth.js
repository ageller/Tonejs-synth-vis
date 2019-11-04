var synth, waveform, fft;

function setupSynth(){
	console.log('setting up synth');

	synth = new Tone.PolySynth(8, Tone.Synth, {
			"oscillator" : {
				//type: "sawtooth"
				type: "custom",
				"partials":[10,9,8,7,6,5,4,3,2,1]
			}
		});
	synth.toMaster();

	//bind the interface
	document.querySelector("tone-piano").bind(synth);
	document.querySelector("tone-synth").bind(synth);

	//for visualizing
	fft = new Tone.Analyser("fft", 1024);
	waveform = new Tone.Analyser("waveform", 1024);
	synth.fan(waveform, fft);

}


window.onload = function() {
	setupSynth();
}





