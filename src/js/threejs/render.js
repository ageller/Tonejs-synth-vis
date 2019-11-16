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
		synthParams[k].starMesh.material.uniforms.uTime.value = time/WebGLparams.timeFac;
		synthParams[k].coronaMesh.material.uniforms.uTime.value = time/WebGLparams.timeFac;
	})
}

//this is called to start everything
function WebGLStart(){

//initialize everything
	initWebGL();

//draw everything
	var r = 0.4;
	drawStar('kick', r);
	drawStar('snare',r);
	drawStar('bass', r);
	drawStar('piano',r);

//begin the animation
	animateWebGL();
}

