// basic.vert

attribute vec3 aVertexPosition;
attribute vec3 aPosOffset;
attribute vec3 aExtra;
attribute vec3 aColors;

uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform float time;

varying vec3 vNormal;
varying vec3 vColor;


vec2 rotate(vec2 v, float a) {
	float s = sin(a);
	float c = cos(a);
	mat2 m = mat2(c, -s, s, c);
	return m * v;
}

mat4 rotationMatrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;

    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}

vec3 rotate(vec3 v, vec3 axis, float angle) {
	mat4 m = rotationMatrix(axis, angle);
	return (m * vec4(v, 1.0)).xyz;
}

const float PI = 3.141592653;


void main() {

	vec3 axis = normalize(aExtra);
	float angle = aExtra.z + time * 25. * 1. * mix(aExtra.x, -.5, .1);

    vec3 position = rotate(aVertexPosition, axis, angle);
    position.xz += aPosOffset.xz;

    float d = mod(aPosOffset.y - time * 100., 50.);
    position.y += d - 100./2. + 25.;
    vColor = aColors;
	gl_Position = projectionMatrix * viewMatrix * vec4(position, 1.0);
}
