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
	var dB = 10. * Math.log(pct)
	kick.volume.value = dB;
}

function setupControls(key){
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
	volumeKnobContainer.style.marginLeft = "20px";
	volumeKnobContainer.style.marginTop = "20px";

	volumeKnob = document.createElement("input");
	volumeKnob.id = "volumeKnob"
	volumeKnob.type = "range";
	volumeKnob.min = "0";
	volumeKnob.max = "10";
	volumeKnob.dataset.width = "75";
	volumeKnob.dataset.height = "75";
	volumeKnob.dataset.angleoffset = "220";
	volumeKnob.dataset.anglerange = "280";
	volumeKnob.value=10;
	volumeKnobContainer.appendChild(volumeKnob);
	volumeKnob.addEventListener('change', function (e){changeVolume(key,e)});

	volumeControl.appendChild(volumeKnobContainer);
	elem.appendChild(volumeControl);

	new Knob(document.getElementById('volumeKnob'), new Ui.P1());    

	/////////////////
	///upper-right
	//////////////////
	var urControl = document.createElement("div")
	urControl.className = 'instController';
	urControl.id = key+'ur';
	urControl.style.width = parentRect.width/2. - bw + 'px';
	urControl.style.height = parentRect.height/2. - bw + 'px';
	//top-left , top-right ,  bottom-right ,  bottom-left 
	urControl.style.borderRadius = '0 100% 0 0';
	urControl.style.borderRight = 'none';
	urControl.style.borderTop = 'none';
	urControl.style.left = parentRect.width/2. -bw + 'px';

	elem.appendChild(urControl);

	/////////////////
	///bottom-left
	//////////////////
	var blControl = document.createElement("div")
	blControl.className = 'instController';
	blControl.id = key+'bl';
	blControl.style.width = parentRect.width/2. - bw + 'px';
	blControl.style.height = parentRect.height/2. - bw + 'px';
	//top-left , top-right ,  bottom-right ,  bottom-left 
	blControl.style.borderRadius = '0 0 0 100%';
	blControl.style.borderLeft = 'none';
	blControl.style.borderBottom = 'none';
	blControl.style.top = parentRect.height/2. -bw + 'px';

	elem.appendChild(blControl);

	/////////////////
	///bottom-right
	//////////////////
	var brControl = document.createElement("div")
	brControl.className = 'instController';
	brControl.id = key+'br';
	brControl.style.width = parentRect.width/2. - bw + 'px';
	brControl.style.height = parentRect.height/2. - bw + 'px';
	//top-left , top-right ,  bottom-right ,  bottom-left 
	brControl.style.borderRadius = '0 0 100% 0';
	brControl.style.borderRight = 'none';
	brControl.style.borderBottom = 'none';
	brControl.style.left = parentRect.width/2. -bw + 'px';
	brControl.style.top = parentRect.width/2. -bw + 'px';

	elem.appendChild(brControl);
}
