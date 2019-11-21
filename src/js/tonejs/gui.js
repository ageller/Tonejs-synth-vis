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
	document.getElementById('preset2').addEventListener('mousedown', function(){loadPreset(2)});
	document.getElementById('addSteps').addEventListener('mousedown', function(){modifySteps(1)});
	document.getElementById('minusSteps').addEventListener('mousedown', function(){modifySteps(-1)});
	document.getElementById('addBPM').addEventListener('mousedown', function(){modifyBPM(1)});
	document.getElementById('minusBPM').addEventListener('mousedown', function(){modifyBPM(-1)});

	document.getElementById('numSteps').innerHTML = nSteps;
	document.getElementById('BPM').innerHTML = nSteps*BPMfac;

}

function modifyBPM(add){
	var oldBPM = nSteps*BPMfac;
	var oldBPMfac = 0 + BPMfac;
	var newBPM = oldBPM + add;
	BPMfac = newBPM/(nSteps);

	//console.log(newBPM, BPMfac)

	document.getElementById('BPM').innerHTML = nSteps*BPMfac

	Tone.Transport.bpm.value = nSteps*BPMfac;

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
			check = removeSteps();
			if (check) resolve("done");
		})
		promise.then(function(){
			initAllSteps();
			Tone.Transport.bpm.value = nSteps*BPMfac;
			loadPreset();
		});
	}
}
function removeSteps(){
	var steps = document.getElementsByClassName('stepHolder');
	for (var i=0; i<steps.length; i+=1){
		steps[i].innerHTML = ""; 
		if (i == steps.length-1) return true;
	}	
}
function clearSteps(){
	var steps = document.getElementsByClassName('step');
	for (var i=0; i<steps.length; i+=1){
		steps[i].style.backgroundColor = 'white';
		steps[i].dataset.playMe = false;
	}	
}
