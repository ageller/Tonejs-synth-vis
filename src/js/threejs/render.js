//all "global" variables are contained within WebGLparams object
var WebGLparams;
function defineWebGLparams(){
	WebGLparams = new function() {

		this.container = null;
		this.renderer = null;
		this.scene = null;
		this.camera = null;

		//for frustum      
		this.zmax = 100;
		this.zmin = 1;
		this.fov = 1.; //so that we don't get distortions toward the edge of the frame
		this.width0 = 1.;
		this.height0 = 1.;

		this.timeFac = 1e5;
	}
}


//this initializes everything needed for the scene
function initWebGL(){
	defineWebGLparams()

	var screenWidth = window.innerWidth;
	var screenHeight = window.innerHeight;
	var aspect = screenWidth / screenHeight;

	// renderer
	WebGLparams.renderer = new THREE.WebGLRenderer( {
		antialias:true,
	} );
	WebGLparams.renderer.setSize(screenWidth, screenHeight);

	WebGLparams.container = document.getElementById('WebGLContainer');
	WebGLparams.container.appendChild( WebGLparams.renderer.domElement );

	// scene
	WebGLparams.scene = new THREE.Scene();     

	// camera
	WebGLparams.camera = new THREE.PerspectiveCamera( WebGLparams.fov, aspect, WebGLparams.zmin, WebGLparams.zmax);
	WebGLparams.camera.up.set(0, -1, 0);
	WebGLparams.camera.position.z = 100;
	WebGLparams.scene.add(WebGLparams.camera);  
	WebGLparams.camera.updateMatrixWorld();

	// events
	//THREEx.WindowResize(WebGLparams.renderer, WebGLparams.camera);

	var dist = WebGLparams.scene.position.distanceTo(WebGLparams.camera.position);
	var vFOV = THREE.Math.degToRad( WebGLparams.camera.fov ); // convert vertical fov to radians
	WebGLparams.height0 = 2 * Math.tan( vFOV / 2 ) * dist; // visible height
	WebGLparams.width0 = WebGLparams.height0 * WebGLparams.camera.aspect;           // visible width

}


//this is the animation loop
function animateWebGL(time) {
	requestAnimationFrame( animateWebGL );
	WebGLparams.renderer.render( WebGLparams.scene, WebGLparams.camera );

	repeatList.forEach(function(k){
		synthParams[k].starMesh.forEach(function(m){
			m.material.uniforms.uTime.value = time/WebGLparams.timeFac;
			var theta = (50.*time/WebGLparams.timeFac) % (2.*Math.PI);
			var axis = new THREE.Vector3(0, 1, 0);
			if (k == "piano") {
			 	axis = new THREE.Vector3(-1, 1, 0);
			}
			var rotMat = new THREE.Matrix4();
		 	rotMat.makeRotationAxis(axis.normalize(), theta);
			var euler = new THREE.Euler().setFromRotationMatrix(rotMat);
			m.setRotationFromEuler(euler);
			m.material.uniforms.objectRotation.value = rotMat;

		});
		synthParams[k].coronaMesh.forEach(function(m){
			m.material.uniforms.uTime.value = time/WebGLparams.timeFac;
		});
	})
	if (repeatList.indexOf('bass') != -1 && visParams['bass'].initialWaveformValue){ //RR Lyrae (should probably smooth out the waveform, and clip the end so that it is symmetric)
		var l = visParams['bass'].initialWaveformValue.length;
		var rFac = 1. + 0.1*visParams['bass'].initialWaveformValue[parseInt(Math.round(time/10.) % l)];
		//console.log(1. + rFac)
		synthParams['bass'].starMesh[0].scale.set(rFac, rFac, rFac);
		synthParams['bass'].coronaMesh[0].material.uniforms.Rout.value = rFac;
	}

	var binaryKeys = ['piano', 'kick'];
	binaryKeys.forEach(function(key){
		if (repeatList.indexOf(key) != -1){ //binary
			var l = synthParams[key].orbit.position1.length;
			var i = parseInt(Math.round(time/40.) % l);
			var p1 = synthParams[key].orbit.position1[i];
			var p2 = synthParams[key].orbit.position2[i];
			var elem = document.getElementById(key+'Container');
			var dx = parseFloat(elem.dataset.meshPosX) - parseFloat(elem.dataset.meshPosX0);
			var dy = parseFloat(elem.dataset.meshPosY) - parseFloat(elem.dataset.meshPosY0);
			if (p1 && p2){
				if (key == 'piano'){
					synthParams[key].starMesh[0].position.set(p1[0] + dx, p1[1] + dy, p1[2] + 1.); //adding the 1 here so that it doesn't get clipped
					synthParams[key].starMesh[1].position.set(p2[0] + dx, p2[1] + dy, p2[2] + 1.);	
				}
				if (key == 'kick'){
					synthParams[key].starMesh[0].rotation.set(0., i/l*2.*Math.PI, 0.)
				}
				synthParams[key].coronaMesh[0].material.uniforms.posX.value = p1[0] + dx;
				synthParams[key].coronaMesh[0].material.uniforms.posY.value = p1[1] + dy;
				synthParams[key].coronaMesh[1].material.uniforms.posX.value = p2[0] + dx;
				synthParams[key].coronaMesh[1].material.uniforms.posY.value = p2[1] + dy;	
			}
		}
	});


}

//this is called to start everything
function WebGLStart(){

//initialize everything
	initWebGL();

//draw everything
	var r = 0.25;
	drawStar('snare',r, 0., 0., 5000, 1, 70, 5.5, 0.5, 0.);
	drawStar('bass', r, 0., 0., 7000, 10.,30, 4, 0.7, 0.1);

//contact binary, first create the stars, them combine into single mesh
	drawStar('kick',0.8*r, 0, 0., 3000, 1., 10., 5.5, 0.3, 0., 3);
	drawStar('kick',0.8*r, 0, 0., 3000, 1., 10., 5.5, 0.3, 0., 3, 2.345);
	synthParams['kick'].orbit = createOrbit(synthParams['kick'].starMesh, 1., 1., 0.8*r, 0., 0., 0., Math.PI/2., [0, 0, 2]);
	var elem = document.getElementById('kickContainer');
	elem.dataset.meshPosX0 = synthParams['kick'].starMesh[0].position.x;
	elem.dataset.meshPosY0 = synthParams['kick'].starMesh[0].position.y;
	elem.dataset.meshPosX = synthParams['kick'].starMesh[0].position.x;
	elem.dataset.meshPosY = synthParams['kick'].starMesh[0].position.y;
	createContactBinary('kick');

//normal binary (could make this a quadruple)
	drawStar('piano',0.7*r, 0, 0., 2000);
	drawStar('piano',0.3*r, 0, 0., 1000, 1., 70., 5.5, 0.3,1.5, 3, 1.234);
	synthParams['piano'].orbit = createOrbit(synthParams['piano'].starMesh, 1., 0.1, 1.2*r, 0., 0., Math.PI/4., -Math.PI/2., [-r/3., -r/3., 0]);
	//synthParams['piano'].orbit = createOrbit(synthParams['piano'].starMesh, 1., 0.1, 0.5, 0., 0., 0., -Math.PI/2., [-0.15, -0.15, 0]);
	var elem = document.getElementById('pianoContainer');
	elem.dataset.meshPosX0 = synthParams['piano'].starMesh[0].position.x;
	elem.dataset.meshPosY0 = synthParams['piano'].starMesh[0].position.y;
	elem.dataset.meshPosX = synthParams['piano'].starMesh[0].position.x;
	elem.dataset.meshPosY = synthParams['piano'].starMesh[0].position.y;
//begin the animation
	animateWebGL();
}

