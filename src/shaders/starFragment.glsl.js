var starFragmentShader = `

varying vec3 vPosition;
varying vec3 vNormal;

uniform sampler2D bb;

uniform float radius;
uniform float uTime;

uniform float starTemp;
uniform float sTeff;
uniform float Teffac;
uniform float SSalpha;

uniform float convectionNoiseFrequency;
uniform float spotNoiseFrequency;
uniform float spotNoiseSize;
uniform float spotNoiseMult;
uniform float bfac;
uniform float rX;
uniform float rY;
uniform float rZ;
uniform mat4 objectRotation;
uniform float seed;

//from https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83
//simple 3D noise
float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}
float snoise(vec3 p){
	vec3 a = floor(p);
	vec3 d = p - a;
	d = d * d * (3.0 - 2.0 * d);

	vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
	vec4 k1 = perm(b.xyxy);
	vec4 k2 = perm(k1.xyxy + b.zzww);

	vec4 c = k2 + a.zzzz;
	vec4 k3 = perm(c);
	vec4 k4 = perm(c + 1.0);

	vec4 o1 = fract(k3 * (1.0 / 41.0));
	vec4 o2 = fract(k4 * (1.0 / 41.0));

	vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
	vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

	return o4.y * d.y + o4.x * (1.0 - d.y);
}

// from https://www.seedofandromeda.com/blogs/49-procedural-gas-giant-rendering-with-gpu-noise
//fractal noise
float noise(vec3 position, int octaves, float frequency, float persistence, int rigid) {
	float total = 0.0; // Total value so far
	float maxAmplitude = 0.0; // Accumulates highest theoretical amplitude
	float amplitude = 1.0;
	const int largeN = 50;
	for (int i = 0; i < largeN; i++) {
		if (i > octaves){
				break;
		}
		// Get the noise sample
		if (rigid == 0){
		   total += snoise(position * frequency) * amplitude;
		} else {
		// rigid noise
			total += ((1.0 - abs(snoise(position * frequency))) * 2.0 - 1.0) * amplitude;
		}
		// Make the wavelength twice as small
		frequency *= 2.0;
		// Add to our maximum possible amplitude
		maxAmplitude += amplitude;
		// Reduce amplitude according to persistence for the next octave
		amplitude *= persistence;
	}

	// Scale the result by the maximum amplitude
	return total / maxAmplitude;
}



const float PI = 3.141592653589793;

// axis should be normalized
mat3 rotationMatrix(vec3 axis, float angle)
{
	float s = sin(angle);
	float c = cos(angle);
	float oc = 1.0 - c;
	
	return mat3(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,
				oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,
				oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c);
}



void main()
{

	float useTemp = clamp( (starTemp - sTeff) * Teffac + sTeff, 1000., 19000.);
	vec3 compensatedStarColor = texture2D(bb, vec2(clamp( ((useTemp - 1000.)/19000.), 0., 1.)), 0.5 ).rgb;

    gl_FragColor = vec4(compensatedStarColor, 1.);

    vec4 pos = objectRotation*vec4(vPosition, 1.);
	vec2 fromCenter = abs(pos.xy);
	float dist = length(fromCenter);

	mat3 rotX = rotationMatrix(vec3(1,0,0), rX); 
	mat3 rotY = rotationMatrix(vec3(0,1,0), rY); 
	mat3 rotZ = rotationMatrix(vec3(0,0,1), rZ); 
	vec3 pNorm = rotX*rotY*rotZ*(vNormal + 10.*vec3(0.0, 0.0, uTime + seed));

	//fractal noise (can play with these)
	float n1 = (noise(pNorm, 5, convectionNoiseFrequency, 0.7, 0) + 1.) * 0.7; //regular

	// Sunspots
	float threshold = 0.15;// limit number of spots
	float t1 = snoise(pNorm * spotNoiseFrequency) - spotNoiseSize;
	float t2 = snoise((pNorm + 30.) * spotNoiseFrequency) - spotNoiseSize;
	float ss = (max(t1 * t2, threshold) - threshold) * spotNoiseMult;

	// Accumulate total noise
	float n = n1 - ss;


	//limb darkening
	float brightness = 0.;
	float u = 0.56;
	float Rstar2 = 1.0;
	float r2 = dist/radius * dist/radius;
	brightness = (1. - u*(1. - sqrt((Rstar2 - r2)/Rstar2)));
	gl_FragColor.rgb = vec3(mix(vec3(1.0, 1.0, 1.0), gl_FragColor.rgb, clamp(1.1 - bfac*brightness ,0. , 1.)));

	gl_FragColor.rgb *= n;

	gl_FragColor.a *= SSalpha;


}
`;
