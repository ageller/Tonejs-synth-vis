var starVertexShader = `

varying vec3 vPosition;
varying vec3 vNormal;


void main()
{
	vNormal = normal;
	vPosition = position;
	//vec4 vP = modelViewMatrix * vec4( position, 1.0 );
	//vPosition = vP.xyz;

	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );


}

`;
