// Function from David Walsh: http://davidwalsh.name/css-animation-callback
function whichTransitionEvent(){
	var t,el = document.createElement("fakeelement");

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
	var t,el = document.createElement("fakeelement");

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

function showHideExtendedControls(elem){
	moveExtender(elem);
	var extendedContainer = elem.querySelectorAll(".extendedContainer")[0];
	extendedContainer.classList.add('transformAnimator');

	//also toggle the open flag
	if (elem.open){
		extendedContainer.style.clipPath = 'inset(0px 0px -10px ' + extendedContainerWidth + 'px)'; //values are from-top, from-right, from-bottom, from-left
		extendedContainer.style.transform = 'translate(' + (-extendedContainerWidth) + 'px,0)';
		elem.open = !elem.open
	} else {
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
		elemPlay = (elem.dataset.playMe == 'true');
		if (!poly){
			var selectorID = elem.parentElement.parentElement.parentElement.id
			var cls = elem.className.split(" ")[2]
			var col = document.getElementById(selectorID).querySelectorAll("."+cls)
			for (var i=0; i<col.length; i+=1) {
				col[i].style.backgroundColor = 'white';
				col[i].dataset.playMe = false;
			}
		}
		elem.style.backgroundColor = 'white'
		elem.dataset.playMe = !elemPlay;
		if (elem.dataset.playMe == 'true') elem.style.backgroundColor = color; 
	}
}

function createSteps(key, poly){
	var c = synthParams[key].color;
	var color = 'rgb('+c[0]+','+c[1]+','+c[2]+')';

	var parent = document.getElementById(key+"Container");
	var elem = parent.querySelectorAll(".stepHolder")[0];
	var parentRect = parent.getBoundingClientRect();

	var notes = synthParams[key].notes;
	var Nrows = notes.length;
	var h = stepHeight/Nrows; 
	var w = (extendedContainerWidth - parentRect.width/2.)/nSteps;

	for (var j=0; j< Nrows; j+=1){
		var row = document.createElement("div")
		row.style.width = nSteps*w + 'px';

		note = null;
		if (notes) note = synthParams[key].notes[j];

		for (var i=0; i< nSteps; i+=1){
			var step = document.createElement("div");
			step.className = 'step row'+j+' col'+i;
			step.style.width =  w + 'px'; 
			step.style.height = h + 'px'; 
			if (note) step.dataset.note = note;
			step.dataset.playMe = false;

			step.addEventListener('mousedown', function(){addStep(this, color, poly)});
			row.appendChild(step);
		}
		elem.appendChild(row);
	}
}

function setupSteps(key, poly=false){

	//create the step bar
	var parent = document.getElementById(key+"Container");
	var elem = parent.querySelectorAll(".extendedContainer")[0];
	var parentRect = parent.getBoundingClientRect();

	var stepHolder = document.createElement("div");
	stepHolder.style.marginLeft = parentRect.width/2. + 'px';
	stepHolder.className = 'stepHolder';
	elem.appendChild(stepHolder);

	createSteps(key, poly)
}

//need to make this more general
function initAllSteps(){
	createSteps('kick', false);
	createSteps('snare', false);
}

//////////////////////////////////////
//for the controls
//////////////////////////////////////
function changeVolume(key, event){
	var pct = parseFloat(event.target.value)/10.
	var dB = 10. * Math.log(pct);
	synthParams[key].volume = dB;
	if (synthParams[key].instrument.hasOwnProperty('voices')){
		synthParams[key].instrument.voices.forEach(function(v){
			v.volume.value = dB;
		})
	} else 	{
		synthParams[key].instrument.volume.value = dB;
	}
}
function changeOscillator(key, event){
	var osc = synthParams[key].oscillator; 
	synthParams[key].oscillator = oscillatorMap[event.target.value]
	//this is not general
	if (synthParams[key].oscillator != osc){
		defineInst(key);
		defineVisParms();
	}
}
function changeAttack(key, event){
	var att = synthParams[key].attack;
	synthParams[key].attack = event.target.value/10.;
	//this is not general
	if (synthParams[key].attack != att){
		defineInst(key);
		defineVisParms();
	}
}
function changeDecay(key, event){
	var dec = synthParams[key].decay;
	synthParams[key].decay = event.target.value/10.;
	//this is not general
	if (synthParams[key].decay != dec){
		defineInst(key);
		defineVisParms();
	}
}
function setupControls(key, controlsList){
	//these knobs only allow integer values (I think).  Would be nice to allow decimals.  
	//I can probably trim this down considerably but making a generalized knob function

	var c = synthParams[key].color;
	var color = 'rgb('+c[0]+','+c[1]+','+c[2]+')';

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

	if (controlsList.indexOf('volume') != -1){
		volumeKnob = document.createElement("input");
		volumeKnob.id = key+"VolumeKnob"
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
	}

	volumeControl.appendChild(volumeKnobContainer);
	elem.appendChild(volumeControl);

	if (controlsList.indexOf('volume') != -1){
		new Knob(document.getElementById(key+'VolumeKnob'), new Ui.P1());    

		var text = document.createElement('div');
		text.className = "playInstructions";
		text.style.width = volumeControl.style.width;
		text.style.marginTop = '25px';
		text.style.paddingLeft = '7px';
		text.style.textAlign = 'left';
		text.innerHTML = 'Volume';

		elem.appendChild(text);
	}

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


	if (controlsList.indexOf('oscillator') != -1){
		oscillatorKnob = document.createElement("input");
		oscillatorKnob.id = key+"OscillatorKnob"
		oscillatorKnob.type = "range";
		oscillatorKnob.min = "0";
		oscillatorKnob.max = "3";
		oscillatorKnob.dataset.width = "65";
		oscillatorKnob.dataset.height = "65";
		oscillatorKnob.dataset.angleoffset = "300";
		oscillatorKnob.dataset.anglerange = "120";
		oscillatorKnob.dataset.labels = "sin,sqr,tri,saw";
		oscillatorKnob.value = oscillatorMapReverse[synthParams[key].oscillator]
		oscillatorKnobContainer.appendChild(oscillatorKnob);
		oscillatorKnob.addEventListener('change', function (e){changeOscillator(key,e)});
	}

	oscillatorControl.appendChild(oscillatorKnobContainer);
	elem.appendChild(oscillatorControl);

	if (controlsList.indexOf('oscillator') != -1){
		new Knob(document.getElementById(key+'OscillatorKnob'), new Ui.P1());    

		var text = document.createElement('div');
		text.className = "playInstructions";
		text.style.width = oscillatorControl.style.width;
		text.style.marginTop = '25px';
		text.style.paddingLeft = '90px';
		text.style.textAlign = 'right';
		text.innerHTML = 'Oscillator';

		elem.appendChild(text);
	}

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

	if (controlsList.indexOf('attack') != -1){
		attackKnob = document.createElement("input");
		attackKnob.id = key+"AttackKnob"
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
	}

	attackControl.appendChild(attackKnobContainer);
	elem.appendChild(attackControl);

	if (controlsList.indexOf('attack') != -1){
		new Knob(document.getElementById(key+'AttackKnob'), new Ui.P1());    

		var text = document.createElement('div');
		text.className = "playInstructions";
		text.style.width = attackControl.style.width;
		text.style.marginTop = '45px';
		text.style.paddingLeft = '7px';
		text.style.textAlign = 'left';
		text.innerHTML = 'Attack';

		elem.appendChild(text);
	}


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

	if (controlsList.indexOf('decay') != -1){
		decayKnob = document.createElement("input");
		decayKnob.id = key+"DecayKnob"
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
	}

	decayControl.appendChild(decayKnobContainer);
	elem.appendChild(decayControl);

	if (controlsList.indexOf('volume') != -1){

		new Knob(document.getElementById(key+'DecayKnob'), new Ui.P1());    

		var text = document.createElement('div');
		text.className = "playInstructions";
		text.style.width = decayControl.style.width;
		text.style.marginTop = '45px';
		text.style.paddingLeft = '90px';
		text.style.textAlign = 'right';
		text.innerHTML = 'Decay';

		elem.appendChild(text);
	}

	//define the colors
	var circles = elem.querySelectorAll('circle');
	for (var i=0; i<circles.length; i+=1) circles[i].style.stroke = color;
	
	var rects = elem.querySelectorAll('rect');
	for (var i=0; i<rects.length; i+=1) rects[i].style.fill = color;

	var txt = elem.querySelectorAll('text');
	for (var i=0; i<txt.length; i+=1) txt[i].style.fill = color;
}
