var starVertexShader = `

varying vec3 vPosition;
varying vec3 vNormal;

uniform vec3 cameraCenter;

void main()
{
	vNormal = normal;
	vPosition = position;//(modelViewMatrix * vec4( position + cameraCenter, 1.0 )).xyz;

	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );


}

`;
