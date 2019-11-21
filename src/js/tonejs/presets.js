function loadPreset(preset=1){
	//clear all steps first
	clearSteps();
	currentPreset = preset;
	var foo = document.getElementsByClassName('preset')
	for (var i=0; i< foo.length; i++)foo[i].classList.remove('playControlsClicked');
	document.getElementById('preset'+preset).classList.add('playControlsClicked');

	switch (preset) {
		case 1:

			var c = synthParams['kick'].color;
			var color = 'rgb('+c[0]+','+c[1]+','+c[2]+')';
			var kickSteps = document.getElementById("kickContainer").querySelectorAll(".step");
			var steps = [0, 4*beat, nSteps-beat];
			steps.forEach(function(i){addStep(kickSteps[i], color);})


			c = synthParams['snare'].color;
			color = 'rgb('+c[0]+','+c[1]+','+c[2]+')';
			var snareSteps = document.getElementById("snareContainer").querySelectorAll(".step");
			steps = [beat, 3*beat, 5*beat, nSteps-beat];
			steps.forEach(function(i){addStep(snareSteps[i], color);})


			//notes go from low (row5) to high (row1) in rows
			c = synthParams['bass'].color;
			color = 'rgb('+c[0]+','+c[1]+','+c[2]+')';
			var bassSteps1 = document.getElementById("bassContainer").querySelectorAll(".step.row0");
			var bassSteps2 = document.getElementById("bassContainer").querySelectorAll(".step.row1");
			var bassSteps3 = document.getElementById("bassContainer").querySelectorAll(".step.row2");
			var bassSteps4 = document.getElementById("bassContainer").querySelectorAll(".step.row3");
			var bassSteps5 = document.getElementById("bassContainer").querySelectorAll(".step.row4");
			steps1= [2*beat, 3*beat];
			steps2= [4*beat];
			steps3= [Math.round(3.5*beat), 6*beat];
			steps4= [0];
			steps5 = [nSteps-beat];
			steps1.forEach(function(i){addStep(bassSteps1[i], color);})
			steps2.forEach(function(i){addStep(bassSteps2[i], color);})
			steps3.forEach(function(i){addStep(bassSteps3[i], color);})
			steps4.forEach(function(i){addStep(bassSteps4[i], color);})
			steps5.forEach(function(i){addStep(bassSteps5[i], color);})

			c = synthParams['piano'].color;
			color = 'rgb('+c[0]+','+c[1]+','+c[2]+')';
			var pianoSteps1 = document.getElementById("pianoContainer").querySelectorAll(".step.row0");
			var pianoSteps2 = document.getElementById("pianoContainer").querySelectorAll(".step.row1");
			var pianoSteps3 = document.getElementById("pianoContainer").querySelectorAll(".step.row2");
			var pianoSteps4 = document.getElementById("pianoContainer").querySelectorAll(".step.row3");
			var pianoSteps5 = document.getElementById("pianoContainer").querySelectorAll(".step.row4");
			var pianoSteps6 = document.getElementById("pianoContainer").querySelectorAll(".step.row5");
			var pianoSteps7 = document.getElementById("pianoContainer").querySelectorAll(".step.row6");
			var pianoSteps8 = document.getElementById("pianoContainer").querySelectorAll(".step.row7");
			steps1= [beat, 2*beat, 5*beat, 6*beat];
			steps2= [Math.round(3.5*beat), 7*beat];
			steps3= [beat, 2*beat, 5*beat, 6*beat, 7*beat];
			steps4= [Math.round(3.5*beat)];
			steps5= [beat, 2*beat, 5*beat, 6*beat];
			steps6= [Math.round(3.5*beat), 7*beat];
			steps7= [beat, 2*beat, 5*beat, 6*beat, 7*beat];
			steps8= [Math.round(3.5*beat)];
			steps1.forEach(function(i){addStep(pianoSteps1[i], color, true);});
			steps2.forEach(function(i){addStep(pianoSteps2[i], color, true);});
			steps3.forEach(function(i){addStep(pianoSteps3[i], color, true);});
			steps4.forEach(function(i){addStep(pianoSteps4[i], color, true);});
			steps5.forEach(function(i){addStep(pianoSteps5[i], color, true);});
			steps6.forEach(function(i){addStep(pianoSteps6[i], color, true);});
			steps7.forEach(function(i){addStep(pianoSteps7[i], color, true);});
			steps8.forEach(function(i){addStep(pianoSteps8[i], color, true);});

			break;
		case 2:

			var c = synthParams['kick'].color;
			var color = 'rgb('+c[0]+','+c[1]+','+c[2]+')';
			var kickSteps = document.getElementById("kickContainer").querySelectorAll(".step");
			var steps = [0, 2*beat,  4*beat, Math.round(5.5*beat), nSteps-beat];
			steps.forEach(function(i){addStep(kickSteps[i], color);})


			c = synthParams['snare'].color;
			color = 'rgb('+c[0]+','+c[1]+','+c[2]+')';
			var snareSteps = document.getElementById("snareContainer").querySelectorAll(".step");
			steps = [beat, Math.round(1.5*beat), 3*beat, Math.round(3.5*beat), 5*beat, Math.round(5.5*beat), nSteps-beat, Math.round(nSteps - 0.5*beat)];
			steps.forEach(function(i){addStep(snareSteps[i], color);})


			//notes go from low (row5) to high (row1) in rows
			c = synthParams['bass'].color;
			color = 'rgb('+c[0]+','+c[1]+','+c[2]+')';
			var bassSteps1 = document.getElementById("bassContainer").querySelectorAll(".step.row0");
			var bassSteps2 = document.getElementById("bassContainer").querySelectorAll(".step.row1");
			var bassSteps3 = document.getElementById("bassContainer").querySelectorAll(".step.row2");
			var bassSteps4 = document.getElementById("bassContainer").querySelectorAll(".step.row3");
			var bassSteps5 = document.getElementById("bassContainer").querySelectorAll(".step.row4");
			steps1= [];
			steps2= [nSteps-beat];
			steps3= [Math.round(3.5*beat), 6*beat];
			steps4= [0, Math.round(2.5*beat)];
			steps5 = [beat, Math.round(5.5*beat)];
			steps1.forEach(function(i){addStep(bassSteps1[i], color);})
			steps2.forEach(function(i){addStep(bassSteps2[i], color);})
			steps3.forEach(function(i){addStep(bassSteps3[i], color);})
			steps4.forEach(function(i){addStep(bassSteps4[i], color);})
			steps5.forEach(function(i){addStep(bassSteps5[i], color);})

			c = synthParams['piano'].color;
			color = 'rgb('+c[0]+','+c[1]+','+c[2]+')';
			var pianoSteps1 = document.getElementById("pianoContainer").querySelectorAll(".step.row0");
			var pianoSteps2 = document.getElementById("pianoContainer").querySelectorAll(".step.row1");
			var pianoSteps3 = document.getElementById("pianoContainer").querySelectorAll(".step.row2");
			var pianoSteps4 = document.getElementById("pianoContainer").querySelectorAll(".step.row3");
			var pianoSteps5 = document.getElementById("pianoContainer").querySelectorAll(".step.row4");
			var pianoSteps6 = document.getElementById("pianoContainer").querySelectorAll(".step.row5");
			var pianoSteps7 = document.getElementById("pianoContainer").querySelectorAll(".step.row6");
			var pianoSteps8 = document.getElementById("pianoContainer").querySelectorAll(".step.row7");
			steps1= [Math.round(1.5*beat), 3*beat, 5*beat, 6*beat];
			steps2= [0, nSteps -beat];
			steps3= [0, Math.round(1.5*beat)];
			steps4= [3*beat, 5*beat, 6*beat];
			steps5= [0, nSteps -beat];
			steps6= [Math.round(1.5*beat), 3*beat, 5*beat, 6*beat];
			steps7= [0, Math.round(5.5*beat)];
			steps8= [Math.round(1.5*beat), 5*beat];
			steps1.forEach(function(i){addStep(pianoSteps1[i], color, true);});
			steps2.forEach(function(i){addStep(pianoSteps2[i], color, true);});
			steps3.forEach(function(i){addStep(pianoSteps3[i], color, true);});
			steps4.forEach(function(i){addStep(pianoSteps4[i], color, true);});
			steps5.forEach(function(i){addStep(pianoSteps5[i], color, true);});
			steps6.forEach(function(i){addStep(pianoSteps6[i], color, true);});
			steps7.forEach(function(i){addStep(pianoSteps7[i], color, true);});
			steps8.forEach(function(i){addStep(pianoSteps8[i], color, true);});

			break;
	}

}