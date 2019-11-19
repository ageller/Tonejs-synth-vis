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

function drawStar(key, radius=1, Teff=3000, Teffac = 1., coronaMult=3)
{
	//this is not working
	var posScreen = new THREE.Vector3(synthParams[key].left+50+100, synthParams[key].top+50+100, 0); //50px margin, 200x200px size
	posWorld = screenXYto3D(posScreen)


	var ifac = 0;
	var smTeff = 5780.;
	var useSSalpha = 1.;
	var coronaP = 0.3;
	var coronaAlpha = 1.;

	var bbTex = new THREE.TextureLoader().load( "src/textures/bb.png" );

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
			seed: {value:synthParams[key].seed}
		},

		vertexShader: myVertexShader,
		fragmentShader: coronaFragmentShader,
		depthWrite:false,
		depthTest: true,
		side: THREE.DoubleSide, 
		transparent:true,
	} );


	var mesh = new THREE.Mesh( geometry, coronaMaterial );
	mesh.position.set(0,0,0); 
	mesh.lookAt( WebGLparams.camera.position)
	WebGLparams.scene.add(mesh);
	synthParams[key].coronaMesh = mesh;

	// star as sphere	
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
			cameraCenter: {value: WebGLparams.camera.position},
			seed: {value:synthParams[key].seed}
		},

		vertexShader: starVertexShader,
		fragmentShader: starFragmentShader,
		depthWrite: true,
		depthTest: true,
		transparent: true,
	} );

	var mesh = new THREE.Mesh( geometry, starMaterial );
	mesh.position.set(posWorld.x,posWorld.y,0); 
	WebGLparams.scene.add(mesh);
	synthParams[key].starMesh = mesh;


}
