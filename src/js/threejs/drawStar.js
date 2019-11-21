function screenXYto3D(pos){

	var vector = pos.clone();

	//deproject this
	vector.x = 2.*vector.x/window.innerWidth - 1.;
	vector.y = -2.*vector.y/window.innerHeight + 1.;
	vector.unproject(WebGLparams.camera);

	//project this along line to z=0
	var dir = vector.sub( WebGLparams.camera.position ).normalize();
	var distance = -WebGLparams.camera.position.z/dir.z;
	var outPos = WebGLparams.camera.position.clone().add( dir.multiplyScalar( distance ) );

	return outPos;
} 

function pos3DtoScreenXY(pos){

	var vector = pos.clone();
	var windowWidth = window.innerWidth;
	var windowHeight = window.innerHeight;
	var widthHalf = (windowWidth/2);
	var heightHalf = (window.innerHeight/2);
	
	vector.project(WebGLparams.camera);
	
	vector.x = (vector.x*widthHalf) + widthHalf;
	vector.y = - (vector.y*heightHalf) + heightHalf;
	
	vector.z = 0;
	
	return vector;
}   

function drawStar(key, radius=1,  offsetX = 0, offsetY = 0, Teff=3000, Teffac = 1., convectionNoiseFrequency = 70., spotNoiseFrequency = 5.5, spotNoiseSize = 0.3, spotNoiseMult = 1.5, coronaMult=3, seed=null)
{
	//this is not working
	var posScreen = new THREE.Vector3(synthParams[key].left+50+100+offsetX, synthParams[key].top+50+100+offsetY, 0); //50px margin, 200x200px size
	var posWorld = screenXYto3D(posScreen)


	var ifac = 0;
	var smTeff = 5780.;
	var useSSalpha = 1.;
	var coronaP = 0.3;
	var coronaAlpha = 1.;

	var bbTex = new THREE.TextureLoader().load( "src/textures/bb.png" );
	if (!seed){
		var seed = synthParams[key].seed;
	}
	//corona on plane
	var geometry = new THREE.PlaneGeometry(WebGLparams.width0, WebGLparams.height0);
	var coronaMaterial =  new THREE.ShaderMaterial( {
		uniforms: {
			Rout: { value: coronaMult*radius },
			uTime: { value: ifac },
			cfac: {value: coronaP},
			calpha: {value: coronaAlpha},
			bb: { type: "t", value: bbTex},
			starTemp: {value: Teff},
			sTeff: {value: smTeff},
			Teffac: {value: Teffac},
			SSalpha: {value: useSSalpha},
			posX: {value:posWorld.x},
			posY: {value:posWorld.y},
			seed: {value:seed}
		},

		vertexShader: myVertexShader,
		fragmentShader: coronaFragmentShader,
		depthWrite:false,
		depthTest: true,
		side: THREE.DoubleSide, 
		transparent:true,
	} );


	var mesh = new THREE.Mesh( geometry, coronaMaterial );
	mesh.name = key+"Corona";
	mesh.position.set(0,0,0); 
	mesh.lookAt( WebGLparams.camera.position)
	WebGLparams.scene.add(mesh);
	synthParams[key].coronaMesh.push(mesh);

	// star as sphere	
	var rotMat = new THREE.Matrix4();
	rotMat.makeRotationY(0);
	var geometry = new THREE.SphereGeometry( radius, 32, 32 );
	var starMaterial =  new THREE.ShaderMaterial( {
		uniforms: {
			radius: { value: radius },
			uTime: { value: ifac },
			bb: { type: "t", value: bbTex},
			starTemp: {value: Teff},
			sTeff: {value: smTeff},
			Teffac: {value: Teffac},
			SSalpha: {value: useSSalpha },
			convectionNoiseFrequency: {value: convectionNoiseFrequency}, 
			spotNoiseFrequency: {value: spotNoiseFrequency}, 
			spotNoiseSize: {value: spotNoiseSize},
			spotNoiseMult: {value: spotNoiseMult},
			bfac: {value: 1.},
			rX: {value: 0.},
			rY: {value: 0.},
			rZ: {value: 0.},
			objectRotation: {value: rotMat},
			seed: {value:seed}
		},

		vertexShader: starVertexShader,
		fragmentShader: starFragmentShader,
		depthWrite: true,
		depthTest: true,
		transparent: true,
	} );

	var mesh = new THREE.Mesh( geometry, starMaterial );
	mesh.name = key+"Star";
	mesh.position.set(posWorld.x,posWorld.y,0); 
	WebGLparams.scene.add(mesh);
	synthParams[key].starMesh.push(mesh);


}

function createContactBinary(key){
	//combine the geometries and use the material from the first one
	//first remove the 2 stars from the scene
	var selectedObject = WebGLparams.scene.getObjectByName(key+'Star');
	WebGLparams.scene.remove( selectedObject );
	var selectedObject = WebGLparams.scene.getObjectByName(key+'Star');
	WebGLparams.scene.remove( selectedObject );

	//then offset the stars, and combine the vertices to a single mesh
	var i = 0
	var p1 = synthParams[key].orbit.position1[i];
	var p2 = synthParams[key].orbit.position2[i];
	var mean = []
	for (var i =0; i<3; i++) mean.push((p1[i] + p2[i])/2.);

	//combine these into a single geometry
	var geometry = new THREE.Geometry();	
	synthParams[key].starMesh[0].geometry.applyMatrix( new THREE.Matrix4().makeTranslation(p1[0] - mean[0], p1[1] - mean[1], p1[2] - mean[2]) );
	synthParams[key].starMesh[1].geometry.applyMatrix( new THREE.Matrix4().makeTranslation(p2[0] - mean[0], p2[1] - mean[1], p2[2] - mean[2]) );
	geometry.merge(synthParams[key].starMesh[0].geometry, synthParams[key].starMesh[0].matrix);
	geometry.merge(synthParams[key].starMesh[1].geometry, synthParams[key].starMesh[1].matrix);

	//use the original material, but this is not great because of the limb darkening...
	var material = synthParams[key].starMesh[0].material;
	material.uniforms.bfac.value = 0; //no limb darkening

	var mesh = new THREE.Mesh(geometry, material);
	var posScreen = new THREE.Vector3(synthParams[key].left+50+100, synthParams[key].top+50+100, 0); //50px margin, 200x200px size
	var posWorld = screenXYto3D(posScreen)
	mesh.position.set(posWorld.x,posWorld.y,0); 
	WebGLparams.scene.add(mesh);
	synthParams[key].starMesh = [mesh];
}

//////////////////////////////
/// binary orbit
/////////////////////////////


function getOrbitPos(xb,m1,m2,semi,ecc,omega,pi,zi,phase){
//from Jarrod's orbit.f code with some modifications
//units of Rsun
	gma = 2942.206217504419 //solRad3 / (d2 solMass)
  

//Set values at apocentre. 
	var xorb = new Array(2);
	var yorb = new Array(2);
	xorb[0] = semi*(1.0 + ecc);
	xorb[1] = 0.0;

//Set transformation elements (Brouwer & Clemence p. 35).
//;also Murray & Dermott page 51
//;O=pi
//;w=omega
//;I=zi
	var px = new Array(3);
	var qx = new Array(3);
	var f = phase*2.*Math.PI;
	px[0] = Math.cos(pi)*Math.cos(omega+f) - Math.sin(pi)*Math.sin(omega+f)*Math.cos(zi);
	qx[0] =-Math.sin(pi)*Math.cos(omega+f) - Math.cos(pi)*Math.sin(omega+f)*Math.cos(zi);
	//px[1] = Math.cos(pi)*Math.sin(omega+phase) + Math.sin(pi)*Math.cos(omega+phase)*Math.cos(zi);
	px[1] = Math.sin(pi)*Math.cos(omega+f) + Math.cos(pi)*Math.sin(omega+f)*Math.cos(zi);
	//qx[1] =-Math.sin(pi)*Math.sin(omega+phase) + Math.cos(pi)*Math.cos(omega+phase)*Math.cos(zi);
	qx[1] =-Math.cos(pi)*Math.cos(omega+f) + Math.sin(pi)*Math.sin(omega+f)*Math.cos(zi);
	px[2] = Math.sin(omega+f)*Math.sin(zi)
	qx[2] = Math.cos(omega+f)*Math.sin(zi)
// Transform to relative variables.
	var xrel = new Array(3);
	for (var k = 0; k<3; k++){
		xrel[k] = px[k]*xorb[0] + qx[k]*xorb[1];
	}

// Set positions for each component (pc and km/s).
	var xsb = new Array(2);
	for (var i = 0; i < xsb.length; i++) {
		xsb[i] = new Array(3);
	}
	for (var k = 0; k<3; k++){
		xsb[0][k] = xb[k] + m2*xrel[k]/(m1+m2)
		xsb[1][k] = xsb[0][k] - xrel[k]
	}

	return xsb;
}

function createOrbit(mesh, m1,m2,semi,ecc,omega,pi,zi, offset = [0,0,0], nPhase = 100.){

	//this works if I position initially at equal distances from the center
	xb = new Array(3);
	xb[0] = (mesh[0].position.x + mesh[1].position.x)/2. + offset[0];
	xb[1] = (mesh[0].position.y + mesh[1].position.y)/2. + offset[1];
	xb[2] = (mesh[0].position.z + mesh[1].position.z)/2. + offset[2]; 

	var dPhase = 1./nPhase; 
	var pos1 = new Array(nPhase);
	var pos2 = new Array(nPhase);
	var phase = 0;
	for (var i=0; i<nPhase; i++){
		pos = getOrbitPos(xb,m1,m2,semi,ecc,omega,pi,zi,phase)
		pos1[i] = pos[0];
		pos2[i] = pos[1];
		phase += dPhase;
	}

	return {'position1':pos1, 'position2':pos2}
}
