// Function from David Walsh: http://davidwalsh.name/css-animation-callback
function whichTransitionEvent(){
	var t,
			el = document.createElement("fakeelement");

	var transitions = {
		"transition"      : "transitionend",
		"OTransition"     : "oTransitionEnd",
		"MozTransition"   : "transitionend",
		"WebkitTransition": "webkitTransitionEnd"
	}

	for (t in transitions){
		if (el.style[t] !== undefined){
			return transitions[t];
		}
	}
}

function whichAnimationEvent(){
	var t,
			el = document.createElement("fakeelement");

	var animations = {
		"animation"      : "animationend",
		"OAnimation"     : "oAnimationEnd",
		"MozAnimation"   : "animationend",
		"WebkitAnimation": "webkitAnimationEnd"
	}

	for (t in animations){
		if (el.style[t] !== undefined){
			return animations[t];
		}
	}
}


function moveExtender(elem){
	//move the extender
	var extender = elem.querySelectorAll('.instExtender')[0]
	var container = elem.querySelectorAll(".extendedContainer")[0];

	extender.classList.add('transformAnimator');
	var xpos = extendedContainerWidth;
	if (elem.open){
		xpos = 0;
	}  
	extender.style.transform = 'translate(' + xpos + 'px,0)';

	//change the icon
	function finishTransition(event){
		extender.removeEventListener(transitionEvent, finishTransition);
		if (elem.open){
			extender.innerHTML = 'chevron_left';
		}  else {
			extender.innerHTML = 'chevron_right'; //want this change after the transition
			container.classList.add('hidden');

		}
	}
	var transitionEvent = whichTransitionEvent();
	extender.addEventListener(transitionEvent, finishTransition);


}

function showHideSteps(elem){
	moveExtender(elem);
	var extendedContainer = elem.querySelectorAll(".extendedContainer")[0];
	extendedContainer.classList.add('transformAnimator');

	//also toggle the open flag
	if (elem.open){
		console.log('closing')
		extendedContainer.style.clipPath = 'inset(0px 0px -10px ' + extendedContainerWidth + 'px)'; //values are from-top, from-right, from-bottom, from-left
		extendedContainer.style.transform = 'translate(' + (-extendedContainerWidth) + 'px,0)';
		elem.open = !elem.open
	} else {
		console.log('opening')
		extendedContainer.classList.remove("hidden");
		extendedContainer.style.clipPath = 'inset(0px 0px -10px 0px)'; 
		extendedContainer.style.transform = 'translate(0,0)';

		elem.open = true
	}
}

//////////////////////////////////////
//for the steps
//////////////////////////////////////
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

function createSteps(key, color, Nrows, notes, poly){
	var parent = document.getElementById(key+"Container");
	var elem = parent.querySelectorAll(".stepHolder")[0];
	var parentRect = parent.getBoundingClientRect();
	for (var j=0; j< Nrows; j+=1){
		note = null;
		if (notes) note = notes[j];

		for (var i=0; i< nSteps; i+=1){
			var step = document.createElement("div")
			step.className = 'step row'+j+' col'+i;
			step.style.width = (extendedContainerWidth - parentRect.width/2.)/nSteps + 'px'; 
			step.style.height = stepHeight + 4 + 'px'; //4 extra to match the extender size (annoyingly, I can't seem to fix this)
			if (note) step.note = note;
			step.playMe = false;

			step.addEventListener('mousedown', function(){addStep(this, color, poly)});
			elem.appendChild(step);
		}
	}
}

function setupSteps(key, color, Nrows=1, notes=null, poly=false){


	//create the step bar
	var parent = document.getElementById(key+"Container");
	var elem = parent.querySelectorAll(".extendedContainer")[0];
	var extender = parent.querySelectorAll('.instExtender')[0]
	extender.addEventListener('mousedown', function(){showHideSteps(parent)})
	var parentRect = parent.getBoundingClientRect();
	var rect = elem.getBoundingClientRect();
	elem.style.width = extendedContainerWidth + parentRect.width/2. + 'px';
	elem.style.height = parentRect.height + 'px';
	elem.style.clipPath = 'inset(0px 0px -10px ' + extendedContainerWidth + 'px)'; //values are from-top, from-right, from-bottom, from-left
	elem.style.transform = 'translate(' + (-extendedContainerWidth) + 'px,0)';

	var h = parentRect.height/2.;
	elem.style.marginTop = -h + 'px';
	elem.style.marginLeft = -parentRect.width/2. + 'px';
	elem.style.borderRadius = '0 ' + h + 'px ' + h +'px 0';

	var stepHolder = document.createElement("div");
	stepHolder.style.marginLeft = parentRect.width/2. + 'px';
	stepHolder.className = 'stepHolder';
	elem.appendChild(stepHolder);

	createSteps(key, color, Nrows, notes, poly)
}

function initAllSteps(){
	createSteps('kick', 'rgb(0,0,255)', 1, null, false)
}

//////////////////////////////////////
//for the controls
//////////////////////////////////////
function changeVolume(key, event){
	var pct = parseFloat(event.target.value)/10.
	var dB = 10. * Math.log(pct);
	synthParams[key].volume = dB;
	window[key].volume.value = dB;
}
function changeOscillator(key, event){
	var map = {0:"sine", 1:"square", 2:"triangle", 3:"sawtooth"};
	synthParams[key].oscillator = map[event.target.value]
	//this is not general
	defineKickInst(synthParams[key].oscillator, synthParams[key].attack, synthParams[key].decay, synthParams[key].volume);
	defineVisParms();
}
function changeAttack(key, event){
	synthParams[key].attack = event.target.value/10.;
	//this is not general
	defineKickInst(synthParams[key].oscillator, synthParams[key].attack, synthParams[key].decay, synthParams[key].volume);
	defineVisParms();
}
function changeDecay(key, event){
	synthParams[key].decay = event.target.value/10.;
	//this is not general
	defineKickInst(synthParams[key].oscillator, synthParams[key].attack, synthParams[key].decay, synthParams[key].volume);
	defineVisParms();
}
function setupControls(key){
	//these knobs only allow integer values (I think).  Would be nice to allow decimals.  

	var parent = document.getElementById(key+"Container");
	var parentRect = parent.getBoundingClientRect();
	var elem = parent.querySelectorAll('#'+key+'Controls')[0];
	var bw = 4;//border on instControls (can't access it here?)

	///////////////////
	/////// Volume
	//////////////////
	var volumeControl = document.createElement("div")
	volumeControl.className = 'instController';
	volumeControl.id = key+'Volume';
	volumeControl.style.width = parentRect.width/2. - bw + 'px';
	volumeControl.style.height = parentRect.height/2. - bw + 'px';
	//top-left , top-right ,  bottom-right ,  bottom-left 
	volumeControl.style.borderRadius = '100% 0 0 0';
	volumeControl.style.borderLeft = 'none';
	volumeControl.style.borderTop = 'none';

	volumeKnobContainer = document.createElement("div");
	volumeKnobContainer.style.marginLeft = "25px";
	volumeKnobContainer.style.marginTop = "17px";

	volumeKnob = document.createElement("input");
	volumeKnob.id = "volumeKnob"
	volumeKnob.type = "range";
	volumeKnob.min = "0";
	volumeKnob.max = "10";
	volumeKnob.dataset.width = "65";
	volumeKnob.dataset.height = "65";
	volumeKnob.dataset.angleoffset = "220";
	volumeKnob.dataset.anglerange = "280";
	pct = Math.pow(10,synthParams[key].volume/10.);
	volumeKnob.value = 10.*pct;
	volumeKnobContainer.appendChild(volumeKnob);
	volumeKnob.addEventListener('change', function (e){changeVolume(key,e)});

	volumeControl.appendChild(volumeKnobContainer);
	elem.appendChild(volumeControl);

	new Knob(document.getElementById('volumeKnob'), new Ui.P1());    

	var text = document.createElement('div');
	text.className = "playInstructions";
	text.style.width = volumeControl.style.width;
	text.style.marginTop = '25px';
	text.style.paddingLeft = '7px';
	text.style.textAlign = 'left';
	text.innerHTML = 'Volume';

	elem.appendChild(text);

	/////////////////
	///upper-right
	//////////////////
	//would be nice to force this to snap to values
	var oscillatorControl = document.createElement("div")
	oscillatorControl.className = 'instController';
	oscillatorControl.id = key+'oscillator';
	oscillatorControl.style.width = parentRect.width/2. - bw + 'px';
	oscillatorControl.style.height = parentRect.height/2. - bw + 'px';
	//top-left , top-right ,  bottom-right ,  bottom-left 
	oscillatorControl.style.borderRadius = '0 100% 0 0';
	oscillatorControl.style.borderRight = 'none';
	oscillatorControl.style.borderTop = 'none';
	oscillatorControl.style.left = parentRect.width/2. -bw + 'px';

	oscillatorKnobContainer = document.createElement("div");
	oscillatorKnobContainer.style.marginLeft = "5px";
	oscillatorKnobContainer.style.marginTop = "17px";

	oscillatorKnob = document.createElement("input");
	oscillatorKnob.id = "oscillatorKnob"
	oscillatorKnob.type = "range";
	oscillatorKnob.min = "0";
	oscillatorKnob.max = "3";
	oscillatorKnob.dataset.width = "65";
	oscillatorKnob.dataset.height = "65";
	oscillatorKnob.dataset.angleoffset = "300";
	oscillatorKnob.dataset.anglerange = "120";
	oscillatorKnob.dataset.labels = "sin,sqr,tri,saw";
	oscillatorKnob.value = 0.;
	oscillatorKnobContainer.appendChild(oscillatorKnob);
	oscillatorKnob.addEventListener('change', function (e){changeOscillator(key,e)});

	oscillatorControl.appendChild(oscillatorKnobContainer);
	elem.appendChild(oscillatorControl);

	new Knob(document.getElementById('oscillatorKnob'), new Ui.P1());    

	var text = document.createElement('div');
	text.className = "playInstructions";
	text.style.width = oscillatorControl.style.width;
	text.style.marginTop = '25px';
	text.style.paddingLeft = '90px';
	text.style.textAlign = 'right';
	text.innerHTML = 'Oscillator';

	elem.appendChild(text);

	/////////////////
	///bottom-left
	//////////////////
	var attackControl = document.createElement("div")
	attackControl.className = 'instController';
	attackControl.id = key+'attack';
	attackControl.style.width = parentRect.width/2. - bw + 'px';
	attackControl.style.height = parentRect.height/2. - bw + 'px';
	//top-left , top-right ,  bottom-right ,  bottom-left 
	attackControl.style.borderRadius = '0 0 0 100%';
	attackControl.style.borderLeft = 'none';
	attackControl.style.borderBottom = 'none';
	attackControl.style.top = parentRect.height/2. -bw + 'px';

	attackKnobContainer = document.createElement("div");
	attackKnobContainer.style.marginLeft = "25px";
	attackKnobContainer.style.marginTop = "10px";

	attackKnob = document.createElement("input");
	attackKnob.id = "attackKnob"
	attackKnob.type = "range";
	attackKnob.min = "0.0";
	attackKnob.max = "10";
	attackKnob.dataset.width = "65";
	attackKnob.dataset.height = "65";
	attackKnob.dataset.angleoffset = "220";
	attackKnob.dataset.anglerange = "280";
	attackKnob.value = synthParams[key].attack*10.; //need to set this from some parameters list
	attackKnobContainer.appendChild(attackKnob);
	attackKnob.addEventListener('change', function (e){changeAttack(key,e)});

	attackControl.appendChild(attackKnobContainer);
	elem.appendChild(attackControl);

	new Knob(document.getElementById('attackKnob'), new Ui.P1());    

	var text = document.createElement('div');
	text.className = "playInstructions";
	text.style.width = attackControl.style.width;
	text.style.marginTop = '45px';
	text.style.paddingLeft = '7px';
	text.style.textAlign = 'left';
	text.innerHTML = 'Attack';

	elem.appendChild(text);


	/////////////////
	///bottom-right
	//////////////////
	var decayControl = document.createElement("div")
	decayControl.className = 'instController';
	decayControl.id = key+'decay';
	decayControl.style.width = parentRect.width/2. - bw + 'px';
	decayControl.style.height = parentRect.height/2. - bw + 'px';
	//top-left , top-right ,  bottom-right ,  bottom-left 
	decayControl.style.borderRadius = '0 0 100% 0';
	decayControl.style.borderRight = 'none';
	decayControl.style.borderBottom = 'none';
	decayControl.style.left = parentRect.width/2. -bw + 'px';
	decayControl.style.top = parentRect.width/2. -bw + 'px';

	decayKnobContainer = document.createElement("div");
	decayKnobContainer.style.marginLeft = "5px";
	decayKnobContainer.style.marginTop = "10px";

	decayKnob = document.createElement("input");
	decayKnob.id = "decayKnob"
	decayKnob.type = "range";
	decayKnob.min = "0.0";
	decayKnob.max = "10";
	decayKnob.dataset.width = "65";
	decayKnob.dataset.height = "65";
	decayKnob.dataset.angleoffset = "220";
	decayKnob.dataset.anglerange = "280";
	decayKnob.value = synthParams[key].decay*10.; //need to set this from some parameters list
	decayKnobContainer.appendChild(decayKnob);
	decayKnob.addEventListener('change', function (e){changeDecay(key,e)});

	decayControl.appendChild(decayKnobContainer);
	elem.appendChild(decayControl);

	new Knob(document.getElementById('decayKnob'), new Ui.P1());    

	var text = document.createElement('div');
	text.className = "playInstructions";
	text.style.width = decayControl.style.width;
	text.style.marginTop = '45px';
	text.style.paddingLeft = '90px';
	text.style.textAlign = 'right';
	text.innerHTML = 'Decay';

	elem.appendChild(text);}
